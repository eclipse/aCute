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
package org.eclipse.acute.dotnetexport;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.ICoreRunnable;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.debug.core.DebugPlugin;
import org.eclipse.debug.core.ILaunch;
import org.eclipse.debug.core.ILaunchManager;
import org.eclipse.debug.core.Launch;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IExportWizard;
import org.eclipse.ui.IWorkbench;

public class DotnetExportWizard extends Wizard implements IExportWizard {
	private DotnetExportWizardPage wizardPage;

	public DotnetExportWizard() {
		super();
		setNeedsProgressMonitor(true);
	}

	@Override
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		setWindowTitle("New .NET Project");

		Iterator<Object> selectionIterator = selection.iterator();
		IFile projectFile = null;

		while (selectionIterator.hasNext() && projectFile == null) {
			IResource resource = (IResource) selectionIterator.next();
			projectFile = getProjectFile(resource.getProject());
		}
		wizardPage = new DotnetExportWizardPage(projectFile);
	}

	@Override
	public void addPages() {
		addPage(wizardPage);
	}

	@Override
	public boolean performFinish() {
		boolean isSCD = wizardPage.isSCD();
		String runtime = wizardPage.getRuntime();
		String framework = wizardPage.getTargetFramework();

		File exportLocation = wizardPage.getExportLocation();
		String configuration = wizardPage.getConfiguration();
		String version = wizardPage.getVersion();
		File projectLocation = wizardPage.getProjectFilePath().toFile().getParentFile();

		if (!exportLocation.exists()) {
			exportLocation.mkdirs();
		}
		List<String> restoreCommandList = new ArrayList<>();
		restoreCommandList.add("dotnet");
		restoreCommandList.add("restore");
		if (isSCD) {
			restoreCommandList.add("-r");
			restoreCommandList.add(runtime);
		}

		List<String> exportCommandList = new ArrayList<>();
		exportCommandList.add("dotnet");
		exportCommandList.add("publish");
		if (isSCD) {
			exportCommandList.add("-r");
			exportCommandList.add(runtime);
		}
		exportCommandList.add("-o");
		exportCommandList.add(exportLocation.getAbsolutePath());
		exportCommandList.add("-f");
		exportCommandList.add(framework);
		exportCommandList.add("-c");
		exportCommandList.add(configuration);

		if (!version.isEmpty()) {
			exportCommandList.add("--version-suffix");
			exportCommandList.add(version);
		}

		Job.create(".NET Export", (ICoreRunnable) monitor -> {
			try {
				ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
				ILaunch newLaunch = new Launch(null, ILaunchManager.RUN_MODE, null);

				Process restoreProcess = DebugPlugin.exec(restoreCommandList.toArray(new String[0]), projectLocation);
				DebugPlugin.newProcess(newLaunch, restoreProcess, ".NET Restore");
				launchManager.addLaunch(newLaunch);

				try {
					restoreProcess.waitFor();
				} catch (InterruptedException e) {
				}
				if (restoreProcess.exitValue() != 0) { // errors will be shown in console
					return;
				}

				Process publishProcess = DebugPlugin.exec(exportCommandList.toArray(new String[0]), projectLocation);
				DebugPlugin.newProcess(newLaunch, publishProcess, ".NET Export");
				launchManager.addLaunch(newLaunch);

				try {
					publishProcess.waitFor();
				} catch (InterruptedException e) { // errors will be shown in console
				}
				if (publishProcess.exitValue() == 0) {
					IPath pathToExport = Path.fromOSString(exportLocation.getAbsolutePath().toString());
					IFile exportiFile = ResourcesPlugin.getWorkspace().getRoot().getFileForLocation(pathToExport);
					if (exportiFile == null) {
						return;
					}
					exportiFile.getProject().refreshLocal(IResource.DEPTH_INFINITE, null);
				}

			} catch (CoreException e) {
				Display.getDefault().asyncExec(() -> {
					MessageDialog.openError(getShell(), "Cannot export .NET project",
							"The 'dotnet publish' command failed: " + e);
				});
			}
		}).schedule();
		return true;
	}

	public static IFile getProjectFile(IContainer container) {
		if (container != null) {
			try {
				for (IResource projResource : container.members()) {
					if (projResource.getFileExtension() != null && (projResource.getFileExtension().equals("csproj")
							|| projResource.getName().equals("project.json"))) {
						return (IFile) projResource;
					}
				}
			} catch (CoreException e) {
			}
		}
		return null;
	}

}