/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.SWTBotTests.dotnetexport;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.List;

import static org.eclipse.swtbot.swt.finder.matchers.WidgetMatcherFactory.withText;

import org.eclipse.swt.widgets.Tree;
import org.eclipse.swtbot.eclipse.finder.waits.Conditions;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.exceptions.WidgetNotFoundException;
import org.eclipse.swtbot.swt.finder.finders.ChildrenControlFinder;
import org.eclipse.swtbot.swt.finder.matchers.WidgetOfType;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotButton;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestValidSelectionExport extends AbstractExportWizardTest{
	 
	 @Test
	 public void testValidSelectionExport() {
		openExportWizard();
		SWTBotButton finishButton = bot.button("Finish");
		assertTrue("Should be able to Finish an export with a valid Project selected.", finishButton.isEnabled());
		finishButton.click();
		
		bot.waitUntil(Conditions.waitForWidget(withText("<terminated> .NET Core Export")),30000);
		
		SWTBotView view = bot.viewByTitle("Project Explorer");
		List<Tree> controls = new ChildrenControlFinder(
				view.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		SWTBotTreeItem projectItem = tree.getTreeItem(project.getName());

		try {		
			projectItem.expand().getNode("bin");
		}catch (WidgetNotFoundException e) {
			SWTBotView consoleView = bot.viewByPartName("Console");
			fail("Export failed: "+ consoleView.bot().styledText().getText());
		}
	 }
}
