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

import static org.junit.Assert.assertTrue;

import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.ui.IWorkingSet;
import org.eclipse.ui.IWorkingSetManager;
import org.eclipse.ui.PlatformUI;
import org.junit.After;
import org.junit.Test;

public class TestProjectCreation extends AbstractNewWizardTest {
	private IProject newProject;
	
	@After
	@Override
	public void tearDown() throws CoreException {
		if (newProject != null) {
			newProject.delete(true, true, new NullProgressMonitor());
		}
		super.tearDown();
	}
	
	
	@Test
	public void testPreSets() {
		SWTBotShell shell = openWizard();
		newProject = checkProjectCreate(shell, null);
	}
	
	@Test
	public void testNewLocation() throws CoreException{
		IFolder folder = project.getFolder("TestFolder");
		folder.create(false, false, null);
		
		SWTBotShell shell = openWizard();
		bot.text(0).setText(folder.getLocation().toString());
		assertTrue("Updating directory did not set Project name",
				bot.text(1).getText().equals(folder.getLocation().lastSegment()));
		newProject = checkProjectCreate(shell, null);
	}
	
	@Test
	public void testNewName(){
		SWTBotShell shell = openWizard();
		bot.toggleButton(0).click();
		bot.textWithLabel("Project name").setText("NewProject"+ System.currentTimeMillis());
		newProject = checkProjectCreate(shell, null);
	}
	
	@Test
	public void testAddToWorkingSet(){
		SWTBotShell shell = openWizard();
		int numOfWSMade = 3;

		if(!bot.checkBox(0).isChecked()) {
			bot.checkBox(0).click();
		}
		bot.button("Select...").click();
		SWTBotShell selectWorkingSetShell = bot.shell("Select Working Sets");
		//create 3 fake working sets
		for (int i = 0; i < numOfWSMade; i++) {
			selectWorkingSetShell.activate();
			bot.button("New...").click();
			bot.shell("New Working Set").activate();
			bot.textWithLabel("Working set name:").setText("testWS"+i);
			bot.button("Finish").click();
		}
		selectWorkingSetShell.activate();
		bot.button("OK").click();
		
		IWorkingSet[] allWorkingSets = PlatformUI.getWorkbench().getWorkingSetManager().getWorkingSets();
		IWorkingSet[] testWorkingSets= new IWorkingSet[3];
		for (IWorkingSet iWorkingSet : allWorkingSets) {
			if(iWorkingSet.getName().matches("testWS\\d")) {
				testWorkingSets[numOfWSMade-1] = iWorkingSet;
				numOfWSMade--;
			}
		}
		
		bot.shell("New .NET Project").activate();
		newProject = checkProjectCreate(shell, testWorkingSets);
		
		IWorkingSetManager manager = PlatformUI.getWorkbench().getWorkingSetManager();
		for (IWorkingSet iWorkingSet : testWorkingSets) {
			manager.removeWorkingSet(iWorkingSet);
		}
	}
}
