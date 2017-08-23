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

package org.eclipse.acute.SWTBotTests.dotnetrun;

import java.util.List;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.swt.widgets.Tree;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotEditor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.finders.ChildrenControlFinder;
import org.eclipse.swtbot.swt.finder.matchers.WidgetOfType;
import org.eclipse.swtbot.swt.finder.waits.ICondition;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestRun extends AbstractDotnetTest{
	
	@Override
	public void setup() throws CoreException {
		super.setup();
		
		SWTBotView view = bot.viewByTitle("Project Explorer");
		List<Tree> controls = new ChildrenControlFinder(
				view.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		SWTBotTreeItem projectItem = tree.getTreeItem(project.getName());
		SWTBotTreeItem fileItem = projectItem.expand().getNode(csharpSourceFile.getName());
		fileItem.select().contextMenu("Open").click();
		SWTBotEditor editor = bot.editorByTitle("Project.cs");
		editor.setFocus();
	}

	@Test
	public void testDotnetRun() throws CoreException, InterruptedException {
		bot.styledText(1).contextMenu("Run As").menu("1 .NET Core Project").click();
		SWTBotView debugView = bot.viewByTitle("Debug");
		List<Tree> controls = new ChildrenControlFinder(
				debugView.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		
		bot.waitUntil(new ICondition() {
			@Override
			public boolean test() throws Exception {
				for(SWTBotTreeItem item : tree.getAllItems()) {
					for (String node : item.expand().getNodes()) {
						if(node.matches("<terminated, exit value: 0>dotnet exec")) {
							return true;
						}
					}
				}
				return false;
			}
			@Override public void init(SWTBot bot) {
				debugView.setFocus();
			}
			@Override
			public String getFailureMessage() {
				SWTBotView consoleView = bot.viewByPartName("Console");
				return "Test program failed: "+ consoleView.bot().styledText().getText();
			}
		},30000);
		
	}
}
