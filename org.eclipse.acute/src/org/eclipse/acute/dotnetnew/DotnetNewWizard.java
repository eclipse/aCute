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
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.TimeUnit;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.resources.IWorkspace;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.Path;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkbenchPage;
import org.eclipse.ui.IWorkingSetManager;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.ide.IDE;

public class DotnetNewWizard extends Wizard implements INewWizard {
	private DotnetNewWizardPage wizardPage;

	public DotnetNewWizard() {
		super();
		setNeedsProgressMonitor(true);
	}

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

		try {
			getContainer().run(true, true, monitor -> {
				monitor.beginTask("Creating .NET project", 0);
				ProcessBuilder processBuilder;
				if (template.isEmpty()) {
					processBuilder = new ProcessBuilder("dotnet", "new");
				} else {
					processBuilder = new ProcessBuilder("dotnet", "new", template);
				}
				processBuilder.directory(location);

				try {
					Process process = processBuilder.start();
					boolean isProcessDone = false;
					while (!isProcessDone) {
						if (monitor.isCanceled()) {
							process.destroyForcibly();
						}
						isProcessDone = process.waitFor(100, TimeUnit.MILLISECONDS);
					}

					if (process.exitValue() == 0) {
						createProject(projectName, location, monitor);
					} else {
						Display.getDefault().asyncExec(() -> {
							MessageDialog.openError(getShell(), "Cannot create dotnet template",
									"The 'dotnet new' command exited with :" + process.exitValue());
						});
					}
					monitor.done();
				} catch (IOException e) {
					monitor.done();
					Display.getDefault().asyncExec(() -> {
						MessageDialog.openError(getShell(), "Cannot create dotnet template",
								"The 'dotnet new' command failed: " + e);
					});
				}
			});
		} catch (InvocationTargetException | InterruptedException e) {
			MessageDialog.openError(getShell(), "Cannot create dotnet template",
					"The 'dotnet new' command failed: " + e);
		}
		return true;
	}

	private void createProject(String name, File directory, IProgressMonitor monitor) {
		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
		IProject project = root.getProject(name);

		try {
			final IWorkspace workspace = ResourcesPlugin.getWorkspace();
			IProjectDescription projectDescription = workspace.newProjectDescription(project.getName());

			String projectLocation = directory.getAbsolutePath();
			IPath projectPath = new Path(projectLocation);

			projectDescription.setLocation(projectPath);
			project.create(projectDescription, monitor);
			project.open(monitor);

		} catch (CoreException e) {
			MessageDialog.openError(getShell(), "Unable to load project description", e.toString());
		}

		IWorkingSetManager wsm = PlatformUI.getWorkbench().getWorkingSetManager();
		IFile csPrgramFile = project.getFile("Program.cs");
		IFile fsPrgramFile = project.getFile("Program.fs");

		Display.getDefault().asyncExec(() -> {

			wsm.addToWorkingSets(project, wizardPage.getWorkingSets());

			IWorkbenchPage page = PlatformUI.getWorkbench().getActiveWorkbenchWindow().getActivePage();
			if (page != null) {
				try {
					if (csPrgramFile.exists()) {
						IDE.openEditor(page, csPrgramFile);
					} else if (fsPrgramFile.exists()) {
						IDE.openEditor(page, fsPrgramFile);
					}
				} catch (CoreException e) {
					MessageDialog.openError(getShell(), "Cannot open project", e.toString());
				}
			}
		});
	}

}
