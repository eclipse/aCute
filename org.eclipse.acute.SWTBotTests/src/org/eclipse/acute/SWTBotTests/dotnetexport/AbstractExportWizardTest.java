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

import java.util.List;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.swt.widgets.Tree;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.finders.ChildrenControlFinder;
import org.eclipse.swtbot.swt.finder.matchers.WidgetOfType;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;

public class AbstractExportWizardTest extends AbstractDotnetTest{
	
	protected void openExportWizard() {
		SWTBotView view = bot.viewByTitle("Project Explorer");
		List<Tree> controls = new ChildrenControlFinder(view.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		SWTBotTreeItem item = tree.getTreeItem(project.getName());
		item.select();
		item.contextMenu("Export...").click();
		
		SWTBotShell shell = bot.shell("Export");
		shell.activate();
		bot.tree().expandNode("Other").select(".NET Project Exporter");
		bot.button("Next >").click();

		return;
	}
}
