/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.tests;

import static org.junit.Assert.*;

import java.io.ByteArrayInputStream;
import java.util.concurrent.TimeUnit;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.core.runtime.Platform;
import org.eclipse.lsp4e.LanguageServiceAccessor;
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.TextDocumentPositionParams;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;
import org.eclipse.ui.internal.genericeditor.ExtensionBasedTextEditor;
import org.eclipse.ui.tests.harness.util.DisplayHelper;
import org.eclipse.ui.texteditor.AbstractTextEditor;
import org.junit.Assert;
import org.junit.Test;

public class TestLSPIntegration extends AbstractAcuteTest {

	@Override
	public void setUp() throws Exception {
		super.setUp();
	}

	private void dotnetRestore(IProject project) throws Exception {
		String[] command = new String[] {"/bin/bash", "-c", "dotnet restore"};
		if (Platform.getOS().equals(Platform.OS_WIN32)) {
			command = new String[] {"cmd", "/c", "dotnet restore"};
		}
		ProcessBuilder builder = new ProcessBuilder(command);
		builder.directory(project.getLocation().toFile());
		Process dotnetRestoreProcess = builder.start();
		dotnetRestoreProcess.waitFor();
	}

	@Test
	public void testLSFound() throws Exception {
		IProject project = getProject("basic");
		dotnetRestore(project);
		IFile csharpSourceFile = project.getFile("test.cs");
		LanguageServer languageServer = LanguageServiceAccessor.getLanguageServers(csharpSourceFile, capabilities -> capabilities.getHoverProvider() != null).iterator().next();
		String uri = csharpSourceFile.getLocationURI().toString();
		Hover hover = languageServer.getTextDocumentService().hover(new TextDocumentPositionParams(new TextDocumentIdentifier(uri), uri, new Position(4, 21))).get(3, TimeUnit.MINUTES);
		Assert.assertNotNull(hover);
	}
	
	@Test
	public void testLSWorks() throws Exception {
		IProject project = getProject("basicWithError");
		dotnetRestore(project);
		IWorkbenchPage activePage = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
		IEditorPart editor = null;
		IFile file = project.getFile("testError.cs");
		editor = IDE.openEditor(activePage, file);
		new DisplayHelper() {
			@Override
			protected boolean condition() {
				try {
					return file.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO)[0].getAttribute(IMarker.LINE_NUMBER, -1) == 13;
				} catch (Exception e) {
					return false;
				}
			}
		}.waitForCondition(editor.getEditorSite().getShell().getDisplay(), 30000);
		IMarker marker = file.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO)[0];
		assertTrue(marker.getType().contains("lsp4e"));
		assertEquals(13, marker.getAttribute(IMarker.LINE_NUMBER, -1));
	}
}
