/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.jobs.IJobChangeEvent;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.core.runtime.jobs.JobChangeAdapter;
import org.eclipse.jface.text.IDocument;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.IPageLayout;
import org.eclipse.ui.IViewReference;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;
import org.eclipse.ui.tests.harness.util.DisplayHelper;
import org.eclipse.ui.texteditor.ITextEditor;
import org.junit.Test;

public class TestLSPIntegration extends AbstractAcuteTest {

	@Override
	public void setUp() throws Exception {
		super.setUp();
	}

	@Test
	public void testLSFindsDiagnosticsCSProj() throws Exception {
		IProject project = getProject("csprojWithError");
		IWorkbenchPage activePage = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
		for (IViewReference viewReference : activePage.getViewReferences()) {
			if (IPageLayout.ID_OUTLINE.equals(viewReference.getId())) {
				viewReference.getView(false).dispose();
			}
		}
		IFile csharpSourceFile = project.getFile("Program.cs");
		boolean[] lsInitialized = new boolean[1];
		Job.getJobManager().addJobChangeListener(new JobChangeAdapter() {
			@Override public void done(IJobChangeEvent event) {
				if (event.getJob().getName().toLowerCase().contains("language server")) {
					lsInitialized[0] = true;
				}
			}
		});
		IEditorPart editor = IDE.openEditor(activePage, csharpSourceFile);
		assertTrue(new DisplayHelper() {
			@Override protected boolean condition() {
				return lsInitialized[0];
			}
		}.waitForCondition(editor.getSite().getShell().getDisplay(), 20000));
		// extra-wait workaround https://github.com/OmniSharp/omnisharp-roslyn/issues/1245
		DisplayHelper.sleep(editor.getSite().getShell().getDisplay(), 3000);
		// Make an edit to workaround https://github.com/OmniSharp/omnisharp-roslyn/issues/1088
		IDocument document = ((ITextEditor)editor).getDocumentProvider().getDocument(editor.getEditorInput());
		document.set(document.get().replace("syntaxerror", "someSyntaxError"));
		assertTrue(new DisplayHelper() {
			@Override
			protected boolean condition() {
				try {
					return csharpSourceFile.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO).length > 0;
				} catch (Exception e) {
					return false;
				}
			}
		}.waitForCondition(editor.getEditorSite().getShell().getDisplay(), 10000));
		DisplayHelper.sleep(500); // give time for marker to be updated
		IMarker marker = csharpSourceFile.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO)[0];
		assertTrue(marker.getType().contains("lsp4e"));
		assertEquals(12, marker.getAttribute(IMarker.LINE_NUMBER, -1));
	}
}
