/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Lucas Bullen   (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.dotnettest;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IAdaptable;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.debug.core.DebugPlugin;
import org.eclipse.debug.core.ILaunch;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationType;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.core.ILaunchManager;
import org.eclipse.debug.core.Launch;
import org.eclipse.debug.core.model.LaunchConfigurationDelegate;
import org.eclipse.debug.ui.ILaunchShortcut;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IEditorInput;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.PlatformUI;

public class DotnetTestDelegate extends LaunchConfigurationDelegate implements ILaunchShortcut {

	public static String ALL_TESTS = "ALL";
	public static String MATCHING_TESTS = "MATCHING";
	public static String SELECTED_TEST = "SELECTED";

	@Override
	public void launch(ISelection selection, String mode) {

		if (selection instanceof IStructuredSelection) {
			Iterator<Object> selectionIterator = ((IStructuredSelection) selection).iterator();
			while (selectionIterator.hasNext()) {
				Object element = selectionIterator.next();
				IResource resource = null;
				if (element instanceof IResource) {
					resource = (IResource) element;
				} else if (element instanceof IAdaptable) {
					resource = ((IAdaptable) element).getAdapter(IResource.class);
				}

				if (resource != null) {
					try {
						ILaunchConfiguration launchConfig = getLaunchConfiguration(mode, resource);
						launchConfig.launch(mode, new NullProgressMonitor());
					} catch (CoreException e) {
						e.printStackTrace();
					}
					return;
				}
			}
		}
		Display.getDefault().asyncExec(() -> {
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
					"Unable to run test", "Unable to run .NET Core tests from selection.");
		});
	}

	@Override
	public void launch(IEditorPart editor, String mode) {
		IEditorInput input = editor.getEditorInput();
		IFile file = input.getAdapter(IFile.class);

		try {
			ILaunchConfiguration launchConfig = getLaunchConfiguration(mode, file);
			launchConfig.launch(mode, new NullProgressMonitor());
		} catch (CoreException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void launch(ILaunchConfiguration configuration, String mode, ILaunch launch, IProgressMonitor monitor)
			throws CoreException {
		String projectLocation = configuration.getAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, "");
		String projectConfiguration = configuration.getAttribute("CONFIGURATION", "Debug");
		String projectFramework = configuration.getAttribute("FRAMEWORK", "");
		String testSelectionMethod = configuration.getAttribute("TEST_SELECTION_TYPE", ALL_TESTS);
		String selectionFilter = configuration.getAttribute("TEST_FILTER", "");
		String selectionClass = configuration.getAttribute("TEST_CLASS", "");
		String selectionMethod = configuration.getAttribute("TEST_METHOD", "");
		boolean buildProject = configuration.getAttribute("PROJECT_BUILD", true);
		boolean restoreProject = configuration.getAttribute("PROJECT_RESTORE", true);

		File projectFile = new File(projectLocation);

		if (projectFile != null && projectFile.isFile()) {
			projectFile = projectFile.getParentFile();
		}

		if (!projectFile.exists() || projectFile == null) {
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
					"Unable to run test", "Unable to run .NET Core tests from specified location.");
			return;

		}

		List<String> commandList = new ArrayList<>();
		commandList.add("dotnet");
		commandList.add("test");

		if (!projectConfiguration.isEmpty()) {
			commandList.add("-c");
			commandList.add(projectConfiguration);
		}

		if (!projectFramework.isEmpty()) {
			commandList.add("-f");
			commandList.add(projectFramework);
		}

		if (testSelectionMethod.equals(MATCHING_TESTS) && !selectionFilter.isEmpty()) {
			commandList.add("--filter");
			commandList.add(selectionFilter);
		} else if (testSelectionMethod.equals(SELECTED_TEST) && !selectionClass.isEmpty()) {
			commandList.add("--filter");
			if (selectionMethod.isEmpty()) {
				commandList.add("FullyQualifiedName~" + selectionClass);
			} else {
				commandList.add("FullyQualifiedName=" + selectionClass + "." + selectionMethod);

			}
		}

		if (!buildProject) {
			commandList.add("--no-build");
		}

		if (restoreProject) {
			ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
			ILaunch newLaunch = new Launch(null, ILaunchManager.RUN_MODE, null);

			Process restoreProcess = DebugPlugin.exec(new String[] { "dotnet", "restore" }, projectFile);
			DebugPlugin.newProcess(launch, restoreProcess, "dotnet restore");
			launchManager.addLaunch(newLaunch);

			try {
				restoreProcess.waitFor();
			} catch (InterruptedException e) {
			}
			if (restoreProcess.exitValue() != 0) { // errors will be shown in console
				return;
			}
		}

		Process p = DebugPlugin.exec(commandList.toArray(new String[commandList.size()]), projectFile);
		DebugPlugin.newProcess(launch, p, "dotnet test");
	}

	private ILaunchConfiguration getLaunchConfiguration(String mode, IResource resource) {
		ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
		ILaunchConfigurationType configType = launchManager
				.getLaunchConfigurationType("org.eclipse.acute.dotnettest.DotnetTestDelegate");
		try {
			ILaunchConfiguration[] launchConfigurations = launchManager.getLaunchConfigurations(configType);

			String configName;
			if (resource.getLocation().toFile().isFile()) {
				configName = resource.getParent().getName() + "." + resource.getName() + " Configuration";
			} else {
				configName = resource.getName() + " Configuration";
			}

			for (ILaunchConfiguration iLaunchConfiguration : launchConfigurations) {
				if (iLaunchConfiguration.getName().equals(configName)
						&& iLaunchConfiguration.getModes().contains(mode)) {
					return iLaunchConfiguration;
				}
			}
			configName = launchManager.generateLaunchConfigurationName(configName);
			ILaunchConfigurationWorkingCopy wc = configType.newInstance(null, configName);
			if (resource.getLocation().toFile().isFile()) {
				if (resource.getFileExtension().equals("cs")) {
					wc.setAttribute("TEST_SELECTION_TYPE", SELECTED_TEST);
					wc.setAttribute("TEST_CLASS", resource.getName().replaceFirst("\\.cs$", ""));
				}
				resource = resource.getParent();
			}
			wc.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, resource.getLocation().toString());

			return wc;
		} catch (CoreException e) {
			e.printStackTrace();
		}
		return null;
	}
}