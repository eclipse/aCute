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
package org.eclipse.acute.SWTBotTests;

import static org.junit.Assert.fail;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.eclipse.finder.SWTWorkbenchBot;
import org.eclipse.swtbot.swt.finder.exceptions.WidgetNotFoundException;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

public class AbstractDotnetTest {
	protected static SWTWorkbenchBot bot;
	protected IProject project;
	protected IFile csharpSourceFile;
	protected IFile csprojFile;
	protected static final String dotnetVersion = getDotNetVersion();
	
	@BeforeClass
	public static void beforeClass() {
		bot = new SWTWorkbenchBot();
		try {
			bot.viewByTitle("Welcome").close();
		} catch (WidgetNotFoundException e) {
			//Welcome widget already closed
		}
		bot.menu("Window").menu("Perspective").menu("Open Perspective").menu("Other...").click();
		SWTBotShell shell = bot.shell("Open Perspective");
		shell.activate();
		bot.table(0).select("Debug");
		bot.button("Open").click();

		bot.menu("Window").menu("Show View").menu("Other...").click();
		shell = bot.shell("Show View");
		shell.activate();
		bot.tree().expandNode("General").getNode("Project Explorer").select().click();
		bot.button("Open").click();
	}
	
	@Before
	public void setup() throws CoreException {
		buildDotnetProject();
	}
	
	@After
	public void tearDown() throws CoreException {
		if(this.project.exists()) {
			this.project.delete(true, new NullProgressMonitor());
		}
	}
	
	public void buildEmptyProject() {
		try {
			this.project = ResourcesPlugin.getWorkspace().getRoot().getProject(getClass().getName() + System.currentTimeMillis());
			this.project.create(new NullProgressMonitor());
			this.project.open(new NullProgressMonitor());
		}catch (CoreException e) {
			fail("Unable to build empty project: " + e);
		}
	}

	public void buildDotnetProject() {
		buildEmptyProject();
		try {
			csharpSourceFile = this.project.getFile("Project.cs");
			csharpSourceFile.create(getClass().getResourceAsStream("../"+csharpSourceFile.getName()), true, new NullProgressMonitor());
			
			String projectFileName;
			
			if(dotnetVersion.matches("2\\.0.*")) {
				projectFileName = "project2.0.csproj";
			}else if(dotnetVersion.matches("1\\.0\\.1.*")){
				projectFileName = "project1.0.csproj";
			}else {
				projectFileName = "project.json";
			}
			
			csprojFile = this.project.getFile(projectFileName);
			csprojFile.create(getClass().getResourceAsStream("../"+csprojFile.getName()), true, new NullProgressMonitor());
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
