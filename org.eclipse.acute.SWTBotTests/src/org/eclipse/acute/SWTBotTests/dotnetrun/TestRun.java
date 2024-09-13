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

package org.eclipse.acute.SWTBotTests.dotnetrun;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotEditor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.waits.ICondition;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestRun extends AbstractDotnetTest {

	@Test
	public void testDotnetRun() {
		SWTBotView view = bot.viewByTitle("Project Explorer");
		SWTBotTree tree = new SWTBot(view.getWidget()).tree(0);
		SWTBotTreeItem projectItem = tree.getTreeItem(project.getName());
		SWTBotTreeItem fileItem = projectItem.expand().getNode(csharpSourceFile.getName());
		fileItem.select().contextMenu("Open").click();
		SWTBotEditor editor = bot.editorByTitle("Project.cs");
		editor.setFocus();
		editor.toTextEditor().contextMenu("Run As").menu("1 .NET Core").click();
		SWTBotView debugView = bot.viewByTitle("Debug");
		bot.waitUntil(new ICondition() {
			@Override
			public boolean test() throws Exception {
				SWTBotView consoleView = bot.viewByPartName("Console");
				return consoleView.bot().label().getText().matches("<terminated> .* \\[\\.NET Core\\] dotnet exec.*");
			}

			@Override
			public void init(SWTBot bot) {
				debugView.setFocus();
			}

			@Override
			public String getFailureMessage() {
				SWTBotView consoleView = bot.viewByPartName("Console");
				return "No termination found. the " + consoleView.bot().label().getText() + " console outputted: "
						+ consoleView.bot().styledText().getText();
			}
		}, 30000);

	}
}
