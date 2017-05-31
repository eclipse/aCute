/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *  Lucas Bullen (Red Hat inc.)
 *******************************************************************************/
package org.eclipse.acute.dotnetnew;

import java.io.File;
import java.io.IOException;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.resources.IWorkspace;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkingSetManager;
import org.eclipse.ui.PlatformUI;

public class DotnetNewWizard extends Wizard implements INewWizard {
	private DotnetNewWizardPage wizardPage;
	@Override
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		wizardPage = new DotnetNewWizardPage();
	}

	@Override
	public void addPages() {
		addPage(wizardPage);
	}

	@Override
	public boolean performFinish() {
		String template = wizardPage.getTemplate();
		File location = wizardPage.getLocation();
		String projectName = wizardPage.getProjectName();

		if (!location.exists()) {
			location.mkdir();
		}

		if (!template.isEmpty()) {
			String createCommand = "dotnet new " + template + " -o " + location.toString();

			Runtime runtime = Runtime.getRuntime();
			try {
				Process process = runtime.exec(createCommand);
				if (process.waitFor() != 0) {
					MessageDialog.openError(getShell(), "Cannot create dotnet template",
							"The 'dotent new' command failed.");
					return false;
				}
			} catch (IOException | InterruptedException e) {
				MessageDialog.openError(getShell(), "Cannot create dotnet template",
						"The 'dotent new' command failed.");
				return false;
			}
		}

		try {
			IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
			IProject project = root.getProject(projectName);
			final IWorkspace workspace = ResourcesPlugin.getWorkspace();

			IProjectDescription projectDescription = workspace.newProjectDescription(project.getName());
			String projectLocation = location.getAbsolutePath();
			IPath projectPath = new Path(projectLocation);
			projectDescription.setLocation(projectPath);

			project.create(projectDescription, null);

			IWorkingSetManager wsm = PlatformUI.getWorkbench().getWorkingSetManager();
			wsm.addToWorkingSets(project, wizardPage.getWorkingSets());
		} catch (CoreException e) {
			MessageDialog.openError(getShell(), "Unable to load project description", "");
			return false;
		}
		return true;
	}

}
