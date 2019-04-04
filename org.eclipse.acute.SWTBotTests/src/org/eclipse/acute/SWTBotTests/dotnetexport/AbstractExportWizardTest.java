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
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.SWTBotTests.dotnetexport;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;

public class AbstractExportWizardTest extends AbstractDotnetTest {

	protected void openExportWizard() {
		SWTBotView view = bot.viewByTitle("Project Explorer");
		SWTBotTree tree = new SWTBot(view.getWidget()).tree(0);
		SWTBotTreeItem item = tree.getTreeItem(project.getName());
		item.select();
		item.contextMenu("Export...").click();

		SWTBotShell shell = bot.shell("Export");
		shell.activate();
		bot.tree().expandNode("Other").select(".NET Core Project");
		bot.button("Next >").click();

		return;
	}
}
