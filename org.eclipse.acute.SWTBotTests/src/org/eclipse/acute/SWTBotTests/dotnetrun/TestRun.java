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

import static org.junit.Assert.fail;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swt.widgets.Tree;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotEditor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.exceptions.WidgetNotFoundException;
import org.eclipse.swtbot.swt.finder.finders.ChildrenControlFinder;
import org.eclipse.swtbot.swt.finder.matchers.WidgetOfType;
import org.eclipse.swtbot.swt.finder.waits.ICondition;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestRun extends AbstractRunTest{
	protected IFile csharpSourceFile;
	
	@Override
	public void setup() throws CoreException {
		super.setup();
		buildDotnetProject();
		
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
		bot.styledText(1).contextMenu("Run As").menu("1 .NET Project").click();		
		SWTBotView debugView = bot.viewByTitle("Debug");
		List<Tree> controls = new ChildrenControlFinder(
				debugView.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		
		bot.waitUntil(new ICondition() {
			@Override
			public boolean test() throws Exception {
				for(SWTBotTreeItem item : tree.getAllItems()) {
					for (String node : item.expand().getNodes()) {
						if(node.matches("<terminated, exit value: 0>.NET Project")) {
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
	
	public void buildDotnetProject() {
		try {
			csharpSourceFile = this.project.getFile("Project.cs");
			csharpSourceFile.create(getClass().getResourceAsStream(csharpSourceFile.getName()), true, new NullProgressMonitor());
			
			String projectFileName;
			
			String version = getDotNetVersion();
			if(version.matches("2\\.0.*")) {
				projectFileName = "project2.0.csproj";
			}else if(version.matches("1\\.0\\.1.*")){
				projectFileName = "project1.0.csproj";
			}else {
				projectFileName = "project.json";
			}
			
			IFile csproj = this.project.getFile(projectFileName);
			csproj.create(getClass().getResourceAsStream(csproj.getName()), true, new NullProgressMonitor());
		}catch (CoreException e) {
			fail("Unable to build dotnet project file: " + e);
		}
	}
	
	private static String getDotNetVersion() {
		String listCommand = "dotnet --version";

		Runtime runtime = Runtime.getRuntime();
		Process process;
		try {
			process = runtime.exec(listCommand);
			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String version = in.readLine();
				if (!version.isEmpty() && version.matches("^\\d\\.\\d\\.\\d.*")) {
					return version;
				} else {
					return "";
				}
			}
		} catch (IOException e1) {
			return "";
		}
	}
}
