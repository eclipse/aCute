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

package org.eclipse.acute.SWTBotTests.dotnetnew;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swt.widgets.Tree;
import org.eclipse.swtbot.eclipse.finder.widgets.SWTBotView;
import org.eclipse.swtbot.swt.finder.finders.ChildrenControlFinder;
import org.eclipse.swtbot.swt.finder.matchers.WidgetOfType;
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
		List<Tree> controls = new ChildrenControlFinder(view.getWidget()).findControls(WidgetOfType.widgetOfType(Tree.class));
		SWTBotTree tree = new SWTBotTree((Tree) controls.get(0));
		SWTBotTreeItem item = tree.getTreeItem(project.getName());
		item.select();
		
		openWizard();
		assertTrue("Selected container was not used for pre-set project name",
				bot.textWithLabel("Project name").getText().equals(project.getName()));
		assertTrue("Selected container was not used for pre-set project location",
				bot.textWithLabel("Location").getText().equals(project.getLocation().toString()));
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
		assertTrue("Name field did not update content after linking",nameText.getText().equals("expectedProjectName"));
		
		bot.button("Cancel").click();
	}
	
	@Test
	public void testPresetFolderNameCreation() throws CoreException {
		SWTBotShell shell = openWizard();
		String firstPresetName = bot.textWithLabel("Project name").getText();
		IProject newProject = checkProjectCreate(shell, null);

		bot.viewByTitle("Outline").setFocus();

		shell = openWizard();
		String secondPresetName = bot.textWithLabel("Project name").getText();
		
		assertFalse("Pre-set project name is not unique from currently created project",firstPresetName.equals(secondPresetName));
		
		bot.button("Cancel").click();
		newProject.delete(true, true, new NullProgressMonitor());
	}
}
