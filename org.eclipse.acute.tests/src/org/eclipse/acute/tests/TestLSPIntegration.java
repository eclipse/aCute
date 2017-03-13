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

import org.eclipse.core.resources.IFile;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.lsp4e.LanguageServiceAccessor;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.TextDocumentPositionParams;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;
import org.eclipse.ui.internal.genericeditor.ExtensionBasedTextEditor;
import org.junit.Assert;
import org.junit.Test;

public class TestLSPIntegration extends AbstractAcuteTest {

	@Override
	public void setUp() throws Exception {
		super.setUp();
		IFile projectJson = this.project.getFile("project.json");
		projectJson.create(getClass().getResourceAsStream(projectJson.getName()), true, new NullProgressMonitor());
		dotnetRestore(); // https://github.com/OmniSharp/omnisharp-node-client/issues/265
	}

	private void dotnetRestore() throws Exception {
		ProcessBuilder builder = new ProcessBuilder("/bin/bash", "-c", "dotnet restore");
		builder.directory(this.project.getLocation().toFile());
		builder.start().waitFor();
	}

	@Test
	public void testLSFound() throws Exception {
		IWorkbenchPage activePage = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
		IEditorPart editor = null;
		try {
			editor = IDE.openEditor(activePage, this.csharpSourceFile);
			Assert.assertTrue(editor instanceof ExtensionBasedTextEditor);
			LanguageServer languageServer = LanguageServiceAccessor.getLanguageServer(this.csharpSourceFile, capabilities -> capabilities.getHoverProvider() != null);
			String uri = this.csharpSourceFile.getLocationURI().toString();
			Assert.assertNotNull(languageServer.getTextDocumentService().hover(new TextDocumentPositionParams(new TextDocumentIdentifier(uri), uri, new Position(4, 21))).get());
		} finally {
			if (editor != null) {
				activePage.closeEditor(editor, false);
			}
		}
	}
}
