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

package org.eclipse.acute.SWTBotTests.dotnettest;

import java.util.List;
import static org.junit.Assert.assertTrue;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
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
		super.buildEmptyProject();
		
		String projectFileName;
		if(dotnetVersion.matches("2\\.0.*")) {
			projectFileName = "Project2.Tests.csproj";
		}else if(dotnetVersion.matches("1\\.0\\.1.*")){
			projectFileName = "Project1.Tests.csproj";
		}else {
			projectFileName = "Project.Tests.json";
		}
		csprojFile = this.project.getFile(projectFileName);
		csprojFile.create(getClass().getResourceAsStream(csprojFile.getName()), true, new NullProgressMonitor());
	}

	@Test
	public void testDotnetRunSuccessful() throws CoreException {
		int exitCode = runTest("ProjectTestsPass.cs");
		assertTrue("Test's exit code was incorrect; expected: 0, actual: "+exitCode, exitCode == 0);
	}
	
	@Test
	public void testDotnetRunFailure() throws CoreException {
		int exitCode = runTest("ProjectTestsFail.cs");
		assertTrue("Test's exit code was incorrect; expected: 1, actual: "+exitCode, exitCode == 1);
	}
	
	private int runTest(String csharpSourceFileName) throws CoreException {
		csharpSourceFile = this.project.getFile(csharpSourceFileName);
		csharpSourceFile.create(getClass().getResourceAsStream(csharpSourceFile.getName()), true, new NullProgressMonitor());

		SWTBotView view = bot.viewByTitle("Project Explorer");
		List<Tree> explorerControls = new ChildrenControlFinder(
				view.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree explorerTree = new SWTBotTree((Tree) explorerControls.get(0));
		SWTBotTreeItem projectItem = explorerTree.getTreeItem(project.getName());
		SWTBotTreeItem fileItem = projectItem.expand().getNode(csharpSourceFile.getName());
		fileItem.select().contextMenu("Open").click();
		SWTBotEditor editor = bot.editorByTitle(csharpSourceFile.getName());
		editor.setFocus();
	
		bot.styledText(1).contextMenu("Run As").menu("2 .NET Core Test").click();		
		SWTBotView debugView = bot.viewByTitle("Debug");
		List<Tree> debugControls = new ChildrenControlFinder(
				debugView.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree debugTree = new SWTBotTree((Tree) debugControls.get(0));
		
		bot.waitUntil(new ICondition() {
			@Override
			public boolean test() throws Exception {
				for(SWTBotTreeItem item : debugTree.getAllItems()) {
					for (String node : item.expand().getNodes()) {
						if(node.matches("<terminated, exit value: \\d>.NET Core Tests")) {
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
		
		for(SWTBotTreeItem item : debugTree.getAllItems()) {
			for (String node : item.expand().getNodes()) {
				if(node.matches("<terminated, exit value: \\d>.NET Core Tests")) {
					return Integer.parseInt(node.replace("<terminated, exit value: ", "").replace(">.NET Core Tests", ""));
				}
			}
		}
		return -1;
	}
}