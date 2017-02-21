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

import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.PartInitException;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;
import org.eclipse.ui.internal.genericeditor.ExtensionBasedTextEditor;
import org.junit.Assert;
import org.junit.Test;

public class TestIDEIntegration extends AbstractAcuteTest {
	
	@Test
	public void testEditorAssociation() throws PartInitException {
		IWorkbenchPage activePage = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
		IEditorPart editor = null;
		try {
			editor = IDE.openEditor(activePage, this.csharpSourceFile);
			Assert.assertTrue(editor instanceof ExtensionBasedTextEditor);
		} finally {
			if (editor != null) {
				activePage.closeEditor(editor, false);
			}
		}
	}
}
