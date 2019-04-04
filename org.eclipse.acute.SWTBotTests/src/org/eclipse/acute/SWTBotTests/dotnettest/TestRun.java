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

package org.eclipse.acute.SWTBotTests.dotnettest;

import static org.junit.Assert.assertTrue;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotEditor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.waits.ICondition;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestRun extends AbstractDotnetTest {

	@Override
	public void setup() throws CoreException {
		super.buildEmptyProject();
		csprojFile = this.project.getFile("Project2.Tests.csproj");
		csprojFile.create(getClass().getResourceAsStream(csprojFile.getName()), true, new NullProgressMonitor());
	}

	@Test
	public void testDotnetRunSuccessful() throws CoreException {
		int exitCode = runTest("ProjectTestsPass.cs");
		assertTrue("Test's exit code was incorrect; expected: 0, actual: " + exitCode, exitCode == 0);
	}

	@Test
	public void testDotnetRunFailure() throws CoreException {
		int exitCode = runTest("ProjectTestsFail.cs");
		assertTrue("Test's exit code was incorrect; expected: 1, actual: " + exitCode, exitCode == 1);
	}

	private int runTest(String csharpSourceFileName) throws CoreException {
		csharpSourceFile = this.project.getFile(csharpSourceFileName);
		csharpSourceFile.create(getClass().getResourceAsStream(csharpSourceFile.getName()), true,
				new NullProgressMonitor());

		SWTBotView packageExplorer = bot.viewByTitle("Project Explorer");
		SWTBotTree explorerTree = new SWTBot(packageExplorer.getWidget()).tree(0);
		SWTBotTreeItem projectItem = explorerTree.getTreeItem(project.getName());
		SWTBotTreeItem fileItem = projectItem.expand().getNode(csharpSourceFile.getName());
		fileItem.select().contextMenu("Open").click();
		SWTBotEditor editor = bot.editorByTitle(csharpSourceFile.getName());
		editor.setFocus();
		editor.toTextEditor().contextMenu("Run As").menu("2 .NET Core Test").click();
		SWTBotView debugView = bot.viewByTitle("Debug");
		SWTBotTree debugTree = new SWTBot(debugView.getWidget()).tree(0);

		bot.waitUntil(new ICondition() {
			@Override
			public boolean test() throws Exception {
				for (SWTBotTreeItem item : debugTree.getAllItems()) {
					for (String node : item.expand().getNodes()) {
						if (node.matches("<terminated, exit value: \\d>dotnet test")) {
							return true;
						}
					}
				}
				return false;
			}

			@Override
			public void init(SWTBot bot) {
				debugView.setFocus();
			}

			@Override
			public String getFailureMessage() {
				SWTBotView consoleView = bot.viewByPartName("Console");
				return "Test program failed: " + consoleView.bot().styledText().getText();
			}
		}, 30000);

		for (SWTBotTreeItem item : debugTree.getAllItems()) {
			for (String node : item.expand().getNodes()) {
				if (node.matches("<terminated, exit value: \\d>dotnet test")) {
					return Integer.parseInt(node.replace("<terminated, exit value: ", "").replace(">dotnet test", ""));
				}
			}
		}
		return -1;
	}
}