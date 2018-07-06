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
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.swt.finder.waits.Conditions;
import org.junit.Test;

public class TestConfiguration extends AbstractDotnetTest {
	private String name = "Test_config1";

	@Override
	public void setup() throws CoreException {
		super.buildEmptyProject();

		String projectFileName;
		if (dotnetVersion.matches("2\\..*")) {
			projectFileName = "Project2.Tests.csproj";
		} else if (dotnetVersion.matches("1\\.0\\.1.*")) {
			projectFileName = "Project1.Tests.csproj";
		} else {
			projectFileName = "Project.Tests.json";
		}
		csprojFile = this.project.getFile(projectFileName);
		csprojFile.create(getClass().getResourceAsStream(csprojFile.getName()), true, new NullProgressMonitor());

		csharpSourceFile = this.project.getFile("ProjectTestsPass.cs");
		csharpSourceFile.create(getClass().getResourceAsStream(csharpSourceFile.getName()), true,
				new NullProgressMonitor());

		bot.menu("Run").menu("Run Configurations...").click();

		bot.shell("Run Configurations").activate();
		bot.tree().select(".NET Core Test");
		bot.toolbarButtonWithTooltip("New launch configuration").click();
		bot.textWithLabel("Project:").setText(ResourcesPlugin.getWorkspace().getRoot().getLocation().toString()
				+ csprojFile.getFullPath().toPortableString());
		bot.textWithLabel("Name:").setText(name);
	}

	@Test
	public void testSelectTestMethod() {
		bot.radio("Run a single test").click();
		bot.button("\uD83D\uDD0ESearch", 0).click();
		bot.waitUntil(Conditions.shellIsActive("Class Selection"), 30000);
		bot.button("OK").click();

		String className = bot.textWithLabel("Test class:").getText();

		bot.button("\uD83D\uDD0ESearch", 1).click();
		bot.waitUntil(Conditions.shellIsActive("Method Selection from \"" + className + "\""));
		assertTrue("No methods found for selected class", bot.button("OK").isEnabled());
		bot.button("OK").click();

		bot.button("Apply").click();
		bot.button("Close").click();
	}

	@Override
	public void tearDown() throws CoreException {
		bot.menu("Run").menu("Run Configurations...").click();

		bot.shell("Run Configurations").activate();
		bot.tree().expandNode(".NET Core Test").select(name);

		bot.toolbarButtonWithTooltip("Delete selected launch configuration(s)").click();
		bot.shell("Confirm Launch Configuration Deletion").activate();
		bot.button("Delete").click();

		bot.shell("Run Configurations").activate();
		bot.button("Close").click();

		super.tearDown();
	}
}