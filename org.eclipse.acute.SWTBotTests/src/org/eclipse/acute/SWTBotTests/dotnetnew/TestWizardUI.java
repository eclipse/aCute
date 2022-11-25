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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.SWTBot;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotText;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotToggleButton;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTree;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotTreeItem;
import org.junit.Test;

public class TestWizardUI extends AbstractNewWizardTest {

	@Test
	public void testSelectedFolderPresetDirectory() {
		SWTBotView view = bot.viewByTitle("Project Explorer");
		SWTBotTree tree = new SWTBot(view.getWidget()).tree(0);
		SWTBotTreeItem item = tree.getTreeItem(project.getName());
		item.select();

		openWizard();
		assertEquals("Selected container was not used for pre-set project name",
				project.getName(), bot.textWithLabel("Project name").getText());
		assertEquals("Selected container was not used for pre-set project location",
				project.getLocation().toString(), bot.textWithLabel("Location").getText());
		bot.button("Cancel").click();

	}

	@Test
	public void testRelinkingSetsName() {
		openWizard();
		SWTBotText nameText = bot.textWithLabel("Project name");
		SWTBotToggleButton linkButton = bot.toggleButton(0);
		linkButton.click();
		assertTrue("Name field did not enable after unlinking",nameText.isEnabled());

		nameText.setText("DifferentProjectName");
		bot.textWithLabel("Location").setText("/new/directory/with/expectedProjectName");
		linkButton.click();

		assertFalse("Name field did not disable after linking",nameText.isEnabled());
		assertEquals("Name field did not update content after linking", "expectedProjectName", nameText.getText());

		bot.button("Cancel").click();
	}

	@Test
	public void testPresetFolderNameCreation() throws CoreException {
		SWTBotShell shell = openWizard();
		String firstPresetName = bot.textWithLabel("Project name").getText();
		IProject newProject = checkProjectCreate(shell, null);
		bot.closeAllEditors();

		openWizard();
		String secondPresetName = bot.textWithLabel("Project name").getText();

		assertNotEquals("Pre-set project name is not unique from currently created project", firstPresetName, secondPresetName);

		bot.button("Cancel").click();
		newProject.delete(true, true, new NullProgressMonitor());
	}
}
