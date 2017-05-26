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
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.resources.IWorkspace;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkingSetManager;
import org.eclipse.ui.internal.WorkbenchPlugin;

public class DotnetNewWizard extends Wizard implements INewWizard {
	private DotnetNewWizardPage wizardPage;
	@Override
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		// TODO
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

		if (!location.exists()) {
			location.mkdir();
		}

		File dotProjectFile = new File(location.getAbsolutePath() + "/.project");
		if (!(dotProjectFile).exists()) {
			try {
				dotProjectFile.createNewFile();
				List<String> lines = Arrays.asList("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<projectDescription>",
						"<name>" + wizardPage.getProjectName() + "</name>", "</projectDescription>");
				Files.write(dotProjectFile.toPath(), lines, Charset.forName("UT-8"));
			} catch (IOException e) {
				wizardPage.setErrorMessage("Unable to create .project file");
				return false;
			}
		}

		if (!template.isEmpty()) {
			String listCommand = "dotnet new " + template + " -o " + location.toString();

			Runtime runtime = Runtime.getRuntime();
			try {
				runtime.exec(listCommand);
			} catch (IOException e) {
				wizardPage.setErrorMessage("Cannot create dotnet template");
				return false;
			}
		}

		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
		final IWorkspace workspace = ResourcesPlugin.getWorkspace();

		try {
			IPath projectDotProjectFile = new Path(location.getAbsolutePath() + "/.project");
			IProjectDescription projectDescription = workspace.loadProjectDescription(projectDotProjectFile);
			IProject project = workspace.getRoot().getProject(projectDescription.getName());
			project.create(projectDescription, null);

			IWorkingSetManager wsm = WorkbenchPlugin.getDefault().getWorkingSetManager();
			wsm.addToWorkingSets(project, wizardPage.getWorkingSets());
		} catch (CoreException e) {
			wizardPage.setErrorMessage("Unable to load project description");
			return false;
		}

		return true;
	}

}
