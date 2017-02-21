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

import org.eclipse.core.runtime.CoreException;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.widgets.Control;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.editors.text.TextEditor;
import org.eclipse.ui.ide.IDE;
import org.eclipse.ui.tests.harness.util.DisplayHelper;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestSyntaxHighlighting extends AbstractAcuteTest {

	private TextEditor editor;
	private StyledText editorTextWidget;

	@Before
	@Override
	public void setUp() throws CoreException {
		super.setUp();
		editor = (TextEditor) IDE.openEditor(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage(), csharpSourceFile, "org.eclipse.ui.genericeditor.GenericEditor");
		editorTextWidget = (StyledText)editor.getAdapter(Control.class);
	}
	
	@After
	@Override
	public void tearDown() throws CoreException {
		if (this.editor != null) {
			this.editor.close(false);
			this.editor = null;
		}
		super.tearDown();
	}
	
	@Test
	public void testSyntaxHighlighting() throws CoreException {
		new DisplayHelper() {
			@Override
			protected boolean condition() {
				return editorTextWidget.getStyleRanges().length > 1;
			}
		}.waitForCondition(editorTextWidget.getDisplay(), 4000);
		Assert.assertTrue("There should be multiple styles in editor", editorTextWidget.getStyleRanges().length > 1);
	}

}
