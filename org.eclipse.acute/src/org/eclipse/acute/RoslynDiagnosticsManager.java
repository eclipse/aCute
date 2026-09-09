/*******************************************************************************
 * Copyright (c) 2026 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Alexander Kurtakov (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import org.eclipse.core.filebuffers.FileBuffers;
import org.eclipse.core.filebuffers.IFileBuffer;
import org.eclipse.core.filebuffers.IFileBufferListener;
import org.eclipse.core.filebuffers.ITextFileBuffer;
import org.eclipse.core.filebuffers.ITextFileBufferManager;
import org.eclipse.core.filebuffers.LocationKind;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Platform;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.content.IContentType;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.IDocument;
import org.eclipse.lsp4e.LSPEclipseUtils;
import org.eclipse.lsp4e.LanguageServers;
import org.eclipse.lsp4e.LanguageServersRegistry;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DiagnosticSeverity;
import org.eclipse.lsp4j.DocumentDiagnosticParams;
import org.eclipse.lsp4j.DocumentDiagnosticReport;
import org.eclipse.lsp4j.FullDocumentDiagnosticReport;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.RelatedFullDocumentDiagnosticReport;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.UnchangedDocumentDiagnosticReport;
import org.eclipse.lsp4j.jsonrpc.messages.Either;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.ui.IEditorReference;
import org.eclipse.ui.IFileEditorInput;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.PlatformUI;

/**
 * Pulls diagnostics from the Roslyn language server and maps them to Eclipse
 * problem markers.
 * <p>
 * Roslyn never sends {@code textDocument/publishDiagnostics}. It only answers
 * {@code textDocument/diagnostic} requests, and asks for a new round through
 * {@code workspace/diagnostic/refresh}. LSP4E implements the push model only,
 * so aCute has to drive the pull model itself.
 * <p>
 * The server also loads projects lazily, so the first pull is what gets any
 * analysis going at all. Waiting for the server to volunteer a refresh would
 * wait forever.
 */
public final class RoslynDiagnosticsManager {

	public static final String CSHARP_MARKER_TYPE = "org.eclipse.acute.problem"; //$NON-NLS-1$

	private static final String CSHARP_CONTENT_TYPE_ID = "org.eclipse.acute.csharp"; //$NON-NLS-1$

	private static final long REFRESH_DEBOUNCE_MS = 250;
	private static final long DIAGNOSTICS_TIMEOUT_SECONDS = 30;

	private static final Set<IFile> OPEN_CSHARP_FILES = ConcurrentHashMap.newKeySet();

	/**
	 * De-dupes pulls so repeated refresh requests do not start overlapping
	 * diagnostics for the same file and server.
	 */
	private static final ConcurrentHashMap<String, CompletableFuture<Void>> IN_FLIGHT_REFRESHES = new ConcurrentHashMap<>();

	/**
	 * Servers that asked for a refresh since the last debounce run. Identity based,
	 * because the server proxies do not implement hashCode().
	 */
	private static final Set<LanguageServer> PENDING_REFRESH_SERVERS = Collections
			.newSetFromMap(new IdentityHashMap<>());

	private static final AtomicBoolean TRACKING = new AtomicBoolean();

	private static final Object REFRESH_JOB_LOCK = new Object();

	private static Job refreshJob;

	/**
	 * Starts tracking open C# editors and pulls a first round of diagnostics.
	 * Called when the language server starts, which is the earliest point at which
	 * this bundle is guaranteed to be active: a file opened before that would
	 * otherwise never be noticed.
	 */
	public static void serverStarted() {
		if (TRACKING.compareAndSet(false, true)) {
			FileBuffers.getTextFileBufferManager().addFileBufferListener(new BufferTracker());
		}
		Job seed = Job.create("Roslyn diagnostics", monitor -> { //$NON-NLS-1$
			collectOpenEditors();
			openFiles().forEach(RoslynDiagnosticsManager::refreshFile);
		});
		seed.setSystem(true);
		seed.schedule(REFRESH_DEBOUNCE_MS);
	}

	/**
	 * Pulls diagnostics again for every open C# file, in reaction to the server
	 * saying its analysis moved on.
	 */
	public static void refreshAllOpenFiles(LanguageServer languageServer) {
		if (languageServer == null) {
			return;
		}
		synchronized (REFRESH_JOB_LOCK) {
			PENDING_REFRESH_SERVERS.add(languageServer);
			if (refreshJob == null) {
				refreshJob = new Job("Roslyn diagnostics refresh") { //$NON-NLS-1$
					@Override
					protected IStatus run(IProgressMonitor monitor) {
						List<LanguageServer> servers;
						synchronized (REFRESH_JOB_LOCK) {
							servers = new ArrayList<>(PENDING_REFRESH_SERVERS);
							PENDING_REFRESH_SERVERS.clear();
						}
						for (LanguageServer server : servers) {
							for (IFile file : openFiles()) {
								if (monitor.isCanceled()) {
									return Status.OK_STATUS;
								}
								refreshFile(file, server);
							}
						}
						return Status.OK_STATUS;
					}
				};
				refreshJob.setSystem(true);
			}
			// Debounce: a burst of refresh requests collapses into a single round.
			refreshJob.cancel();
			refreshJob.schedule(REFRESH_DEBOUNCE_MS);
		}
	}

	/**
	 * Pulls diagnostics for one file from whichever servers back its document,
	 * starting the language server if it is not running yet.
	 */
	private static void refreshFile(IFile file) {
		if (file == null || !file.exists()) {
			return;
		}
		IPath path = file.getFullPath();
		ITextFileBufferManager manager = FileBuffers.getTextFileBufferManager();
		try {
			manager.connect(path, LocationKind.IFILE, null);
			try {
				IDocument document = documentOf(manager, path);
				if (document == null) {
					return;
				}
				LanguageServers.forDocument(document)
						.withPreferredServer(LanguageServersRegistry.getInstance()
								.getDefinition(RoslynLSConnectionProvider.SERVER_ID))
						.collectAll((wrapper, server) -> CompletableFuture.completedFuture(server))
						.thenAccept(servers -> servers.forEach(server -> refreshFile(file, server)));
			} finally {
				manager.disconnect(path, LocationKind.IFILE, null);
			}
		} catch (CoreException e) {
			AcutePlugin.logError(e);
		}
	}

	private static void refreshFile(IFile file, LanguageServer languageServer) {
		if (file == null || !file.exists() || languageServer == null) {
			return;
		}
		// Has to be the very URI LSP4E opened the document with. Roslyn answers null,
		// not a report, when asked about "file:/path" after opening "file:///path",
		// and the EFS location URI is the single slash form.
		URI uri = LSPEclipseUtils.toUri(file);
		if (uri == null) {
			return;
		}
		// The server identity is part of the key so de-duping does not hide a refresh
		// coming from a different server instance.
		String key = file.getFullPath().toString() + '@' + System.identityHashCode(languageServer);
		IN_FLIGHT_REFRESHES.compute(key, (id, running) -> {
			if (running != null && !running.isDone()) {
				return running;
			}
			DocumentDiagnosticParams params = new DocumentDiagnosticParams();
			params.setTextDocument(new TextDocumentIdentifier(uri.toString()));
			CompletableFuture<Void> pull = languageServer.getTextDocumentService().diagnostic(params)
					.orTimeout(DIAGNOSTICS_TIMEOUT_SECONDS, TimeUnit.SECONDS)
					.thenAccept(report -> handleReport(file, report)).exceptionally(e -> {
						AcutePlugin.logError(e);
						return null;
					});
			pull.whenComplete((ignored, e) -> IN_FLIGHT_REFRESHES.remove(key, pull));
			return pull;
		});
	}

	private static void handleReport(IFile file, DocumentDiagnosticReport report) {
		// A right-hand report means unchanged, so the existing markers still stand.
		if (file != null && file.exists() && report != null && report.isLeft()) {
			applyMarkers(file, extractDiagnostics(report.getLeft()));
		}
	}

	private static List<Diagnostic> extractDiagnostics(RelatedFullDocumentDiagnosticReport report) {
		if (report == null) {
			return List.of();
		}
		List<Diagnostic> diagnostics = new ArrayList<>();
		if (report.getItems() != null) {
			diagnostics.addAll(report.getItems());
		}
		if (report.getRelatedDocuments() != null) {
			for (Either<FullDocumentDiagnosticReport, UnchangedDocumentDiagnosticReport> related : report
					.getRelatedDocuments().values()) {
				if (related != null && related.isLeft() && related.getLeft().getItems() != null) {
					diagnostics.addAll(related.getLeft().getItems());
				}
			}
		}
		return diagnostics;
	}

	private static synchronized void applyMarkers(IFile file, List<Diagnostic> diagnostics) {
		try {
			// Reuse markers that are still reported, so annotations do not flicker on
			// every pull, and drop whatever is left unmatched at the end.
			HashMap<String, IMarker> existing = new HashMap<>();
			for (IMarker marker : file.findMarkers(CSHARP_MARKER_TYPE, true, IResource.DEPTH_ZERO)) {
				existing.putIfAbsent(markerKey(marker), marker);
			}
			for (Diagnostic diagnostic : diagnostics) {
				String message = messageOf(diagnostic);
				int severity = severityOf(diagnostic.getSeverity());
				Range range = diagnostic.getRange();
				int line = range != null ? range.getStart().getLine() + 1 : 1;
				int charStart = -1;
				int charEnd = -1;
				if (range != null) {
					try {
						int[] offsets = offsetsOf(file, range);
						charStart = offsets[0];
						charEnd = offsets[1];
					} catch (BadLocationException | CoreException e) {
						AcutePlugin.logError(e);
					}
				}
				if (existing.remove(markerKey(message, severity, charStart, charEnd)) != null) {
					continue;
				}
				IMarker marker = file.createMarker(CSHARP_MARKER_TYPE);
				marker.setAttribute(IMarker.MESSAGE, message);
				marker.setAttribute(IMarker.SEVERITY, severity);
				marker.setAttribute(IMarker.LINE_NUMBER, line);
				marker.setAttribute(IMarker.CHAR_START, charStart);
				marker.setAttribute(IMarker.CHAR_END, charEnd);
			}
			for (IMarker stale : existing.values()) {
				stale.delete();
			}
		} catch (CoreException e) {
			AcutePlugin.logError(e);
		}
	}

	private static int[] offsetsOf(IFile file, Range range) throws CoreException, BadLocationException {
		IPath path = file.getFullPath();
		ITextFileBufferManager manager = FileBuffers.getTextFileBufferManager();
		manager.connect(path, LocationKind.IFILE, null);
		try {
			IDocument document = documentOf(manager, path);
			if (document == null) {
				return new int[] { -1, -1 };
			}
			int start = Math.min(document.getLength(),
					document.getLineOffset(Math.max(0, range.getStart().getLine()))
							+ Math.max(0, range.getStart().getCharacter()));
			int end = Math.min(document.getLength(), document.getLineOffset(Math.max(0, range.getEnd().getLine()))
					+ Math.max(0, range.getEnd().getCharacter()));
			return new int[] { start, Math.max(start, end) };
		} finally {
			manager.disconnect(path, LocationKind.IFILE, null);
		}
	}

	private static IDocument documentOf(ITextFileBufferManager manager, IPath path) {
		ITextFileBuffer buffer = manager.getTextFileBuffer(path, LocationKind.IFILE);
		return buffer != null ? buffer.getDocument() : null;
	}

	private static String markerKey(IMarker marker) throws CoreException {
		return markerKey(String.valueOf(marker.getAttribute(IMarker.MESSAGE)),
				marker.getAttribute(IMarker.SEVERITY, -1), marker.getAttribute(IMarker.CHAR_START, -1),
				marker.getAttribute(IMarker.CHAR_END, -1));
	}

	private static String markerKey(String message, int severity, int charStart, int charEnd) {
		return message + '|' + severity + '|' + charStart + ':' + charEnd;
	}

	private static String messageOf(Diagnostic diagnostic) {
		Either<String, MarkupContent> message = diagnostic.getMessage();
		return message.isLeft() ? message.getLeft() : message.getRight().getValue();
	}

	private static int severityOf(DiagnosticSeverity severity) {
		if (severity == null) {
			return IMarker.SEVERITY_INFO;
		}
		return switch (severity) {
			case Error -> IMarker.SEVERITY_ERROR;
			case Warning -> IMarker.SEVERITY_WARNING;
			case Information, Hint -> IMarker.SEVERITY_INFO;
		};
	}

	private static List<IFile> openFiles() {
		List<IFile> files = new ArrayList<>(OPEN_CSHARP_FILES.size());
		for (IFile file : OPEN_CSHARP_FILES) {
			if (file != null && file.exists()) {
				files.add(file);
			}
		}
		return files;
	}

	private static void collectOpenEditors() {
		if (!PlatformUI.isWorkbenchRunning()) {
			return;
		}
		PlatformUI.getWorkbench().getDisplay().syncExec(() -> {
			for (IWorkbenchWindow window : PlatformUI.getWorkbench().getWorkbenchWindows()) {
				for (IWorkbenchPage page : window.getPages()) {
					for (IEditorReference reference : page.getEditorReferences()) {
						try {
							if (reference.getEditorInput() instanceof IFileEditorInput input
									&& isCSharpFile(input.getFile())) {
								OPEN_CSHARP_FILES.add(input.getFile());
							}
						} catch (CoreException e) {
							AcutePlugin.logError(e);
						}
					}
				}
			}
		});
	}

	private static boolean isCSharpFile(IFile file) {
		if (file == null) {
			return false;
		}
		IContentType csharp = Platform.getContentTypeManager().getContentType(CSHARP_CONTENT_TYPE_ID);
		IContentType actual = Platform.getContentTypeManager().findContentTypeFor(file.getName());
		return csharp != null && actual != null && actual.isKindOf(csharp);
	}

	private static IFile toWorkspaceFile(IPath location) {
		if (location == null) {
			return null;
		}
		IResource resource = ResourcesPlugin.getWorkspace().getRoot().findMember(location);
		if (resource instanceof IFile file) {
			return file;
		}
		return ResourcesPlugin.getWorkspace().getRoot().getFileForLocation(location);
	}

	/**
	 * Keeps the set of open C# files current, and pulls for files opened later.
	 */
	private static final class BufferTracker implements IFileBufferListener {

		@Override
		public void bufferCreated(IFileBuffer buffer) {
			IFile file = toWorkspaceFile(buffer.getLocation());
			if (file == null || !file.exists() || !isCSharpFile(file)) {
				return;
			}
			OPEN_CSHARP_FILES.add(file);
			// Off the notification, so the buffer manager is not re-entered while it is
			// still creating this buffer.
			Job pull = Job.create("Roslyn diagnostics", monitor -> { //$NON-NLS-1$
				refreshFile(file);
			});
			pull.setSystem(true);
			pull.schedule(REFRESH_DEBOUNCE_MS);
		}

		@Override
		public void bufferDisposed(IFileBuffer buffer) {
			IFile file = toWorkspaceFile(buffer.getLocation());
			if (file == null) {
				return;
			}
			OPEN_CSHARP_FILES.remove(file);
			try {
				if (file.exists()) {
					file.deleteMarkers(CSHARP_MARKER_TYPE, true, IResource.DEPTH_ZERO);
				}
			} catch (CoreException e) {
				AcutePlugin.logError(e);
			}
		}

		@Override
		public void underlyingFileMoved(IFileBuffer buffer, IPath path) {
			IFile from = toWorkspaceFile(buffer.getLocation());
			if (from != null) {
				OPEN_CSHARP_FILES.remove(from);
			}
			IFile to = toWorkspaceFile(path);
			if (to != null && to.exists() && isCSharpFile(to)) {
				OPEN_CSHARP_FILES.add(to);
			}
		}

		@Override
		public void bufferContentAboutToBeReplaced(IFileBuffer buffer) {
			// nothing
		}

		@Override
		public void bufferContentReplaced(IFileBuffer buffer) {
			// nothing
		}

		@Override
		public void dirtyStateChanged(IFileBuffer buffer, boolean isDirty) {
			// nothing
		}

		@Override
		public void stateChangeFailed(IFileBuffer buffer) {
			// nothing
		}

		@Override
		public void stateChanging(IFileBuffer buffer) {
			// nothing
		}

		@Override
		public void stateValidationChanged(IFileBuffer buffer, boolean isStateValidated) {
			// nothing
		}

		@Override
		public void underlyingFileDeleted(IFileBuffer buffer) {
			// nothing
		}
	}

	private RoslynDiagnosticsManager() {
	}
}
