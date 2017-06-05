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

public class AbstractRunTest {
	protected static SWTWorkbenchBot bot;
	protected IProject project;
	
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
	}
	
	@Before
	public void setup() throws CoreException {
		this.project = ResourcesPlugin.getWorkspace().getRoot().getProject(getClass().getName() + System.currentTimeMillis());
		this.project.create(new NullProgressMonitor());
		this.project.open(new NullProgressMonitor());
	}
	
	@After
	public void tearDown() throws CoreException {
		this.project.delete(true, new NullProgressMonitor());
	}
}
