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

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.jface.text.IDocument;
import org.eclipse.lsp4e.LSPEclipseUtils;
import org.eclipse.lsp4e.LanguageServiceAccessor;
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.MarkedString;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.TextDocumentIdentifier;
import org.eclipse.lsp4j.TextDocumentPositionParams;
import org.eclipse.lsp4j.jsonrpc.messages.Either;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.tests.harness.util.DisplayHelper;
import org.junit.Assert;
import org.junit.Test;

public class TestLSPIntegration extends AbstractAcuteTest {

	@Override
	public void setUp() throws Exception {
		super.setUp();
	}

	@Test
	public void testLSFoundWithCSProj() throws Exception {
		IProject project = getProject("csproj");
		IFile csharpSourceFile = project.getFile("Program.cs");
		LanguageServer languageServer = LanguageServiceAccessor.getLanguageServers(csharpSourceFile, capabilities -> capabilities.getCompletionProvider() != null).iterator().next();
		Assert.assertNotNull(languageServer);
		Thread.sleep(1000);
		{ // workaround https://github.com/OmniSharp/omnisharp-roslyn/issues/1088
			IDocument doc = LSPEclipseUtils.getDocument(csharpSourceFile);
			doc.set(doc.get() + " ");
			Thread.sleep(1000);
		}
		CompletableFuture<Hover> hoverRequest = languageServer.getTextDocumentService().hover(new TextDocumentPositionParams(new TextDocumentIdentifier(LSPEclipseUtils.toUri(csharpSourceFile).toString()), new Position(10, 23)));
		Hover res = hoverRequest.get(3, TimeUnit.SECONDS);
		Assert.assertNotNull(res);
		Either<List<Either<String, MarkedString>>, MarkupContent> contents = res.getContents();
		if (contents.isLeft()) {
			Either<String, MarkedString> either = contents.getLeft().get(0);
			if (either.isLeft()) {
				Assert.assertTrue(either.getLeft().contains("WriteLine"));
			} else if (either.isRight()) {
				Assert.assertTrue(either.getRight().getValue().contains("WriteLine"));
			} else {
				Assert.fail("Illegal value");
			}
		} else if (contents.isRight()) {
			MarkupContent markupContent = contents.getRight();
			Assert.assertTrue(markupContent.getValue().contains("WriteLine"));
		} else {
			Assert.fail("Illegal value");
		}
	}

	@Test
	public void testLSFindsDiagnosticsCSProj() throws Exception {
		IProject project = getProject("csprojWithError");
		final IFile csharpSourceFile = project.getFile("Program.cs");
		LanguageServer languageServer = LanguageServiceAccessor.getLanguageServers(csharpSourceFile, capabilities -> capabilities.getCompletionProvider() != null).iterator().next();
		Assert.assertNotNull(languageServer);
		{ // workaround https://github.com/OmniSharp/omnisharp-roslyn/issues/1088
			Thread.sleep(3000);
			IDocument doc = LSPEclipseUtils.getDocument(csharpSourceFile);
			doc.set(doc.get().replace("syntaxerror", "someSyntaxError"));
		}
		new DisplayHelper() {
			@Override
			protected boolean condition() {
				try {
					return csharpSourceFile.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO).length > 0;
				} catch (Exception e) {
					return false;
				}
			}
		}.waitForCondition(Display.getDefault(), 3000);
		Thread.sleep(500); // time to fill marker details
		IMarker marker = csharpSourceFile.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_ZERO)[0];
		assertTrue(marker.getType().contains("lsp4e"));
		assertEquals(12, marker.getAttribute(IMarker.LINE_NUMBER, -1));
	}
}