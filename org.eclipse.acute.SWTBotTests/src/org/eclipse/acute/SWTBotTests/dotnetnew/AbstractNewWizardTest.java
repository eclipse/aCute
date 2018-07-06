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

package org.eclipse.acute.SWTBotTests.dotnetnew;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Arrays;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.Path;
import org.eclipse.swtbot.eclipse.finder.SWTWorkbenchBot;
import org.eclipse.swtbot.eclipse.finder.waits.Conditions;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.ui.IWorkingSet;

public class AbstractNewWizardTest extends AbstractDotnetTest {

	@Override
	public void setup() throws CoreException {
		buildEmptyProject();
	}

	@Override
	public void tearDown() throws CoreException {
		// ensure that the pre-set values will be used
		bot.viewByTitle("Outline").setFocus();
		super.tearDown();
	}

	protected SWTBotShell openWizard() {
		bot = new SWTWorkbenchBot();
		bot.menu("File").menu("New").menu("Other...").click();
		bot.waitUntil(Conditions.shellIsActive("New"));
		SWTBotShell shell = bot.shell("New");
		shell.activate();
		bot.tree().expandNode(".NET Core").select(".NET Core Project");
		bot.button("Next >").click();

		while (!bot.list(0).itemAt(0).equals("No available templates") && !bot.list(0).isEnabled()) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		return shell;
	}

	protected IProject checkProjectCreate(SWTBotShell shell, IWorkingSet[] workingSets) {
		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();

		String pathToFolder = bot.textWithLabel("Location").getText();
		String projectName = bot.textWithLabel("Project name").getText();
		Boolean isTemplateSelected = bot.list(0).selectionCount() != 0;

		IContainer container = root.getContainerForLocation(new Path(pathToFolder));
		int beforeFileCount = 0;
		if (container != null) {
			try {
				beforeFileCount = container.members().length;
			} catch (CoreException e) {
				fail("Unable to get containing folder content");
			}
		}
		bot.waitUntil(Conditions.widgetIsEnabled(bot.button("Finish")), 60000);// delay to load templates
		bot.button("Finish").click();
		bot.waitUntil(Conditions.shellCloses(shell), 60000);// delay to build project

		IProject createdProject = root.getProject(projectName);
		assertTrue("No .project file", createdProject.getFile(".project") != null);

		try {
			// Newer versions (>=2) of `dotnet new` require a template to generate extra
			// files
			// Versions 1.1.* did not require a template to generate project files
			// Older versions (<1.1) did not have the dotnet run function
			if ((isTemplateSelected && !dotnetVersion.isEmpty() && dotnetVersion.matches("2\\..*"))
					|| dotnetVersion.matches("^1\\.1.*")) {
				assertTrue("No files created with wizard", createdProject.members().length > beforeFileCount + 1);
			}
		} catch (CoreException e) {
			fail("Unable to get project folder content");
		}

		if (workingSets != null) {
			for (IWorkingSet iWorkingSet : workingSets) {
				assertTrue("Project not part of Working Set " + iWorkingSet.getName(),
						Arrays.asList(iWorkingSet.getElements()).contains(createdProject));
			}
		}

		return createdProject;
	}
}
