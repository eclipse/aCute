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
package org.eclipse.acute.dotnetrun;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.acute.ProjectFileAccessor;
import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IAdaptable;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.variables.IStringVariableManager;
import org.eclipse.core.variables.VariablesPlugin;
import org.eclipse.debug.core.DebugPlugin;
import org.eclipse.debug.core.ILaunch;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationType;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.core.ILaunchManager;
import org.eclipse.debug.core.model.IProcess;
import org.eclipse.debug.core.model.LaunchConfigurationDelegate;
import org.eclipse.debug.ui.ILaunchShortcut;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IEditorInput;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.PlatformUI;

public class DotnetRunDelegate extends LaunchConfigurationDelegate implements ILaunchShortcut {

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
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(), "Unable to Launch",
					"Unable to launch .NET Core Project from selection.");
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
		File projectFileLocation = new File(configuration.getAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, ""));
		boolean buildProject = configuration.getAttribute("PROJECT_BUILD", true);
		String projectArguments = configuration.getAttribute("PROJECT_ARGUMENTS", "");
		String projectFramework = configuration.getAttribute("PROJECT_FRAMEWORK", "");
		String projectConfiguration = configuration.getAttribute("PROJECT_CONFIGURATION", "Debug");
		String inputFileLocation = configuration.getAttribute("org.eclipse.debug.ui.ATTR_CAPTURE_STDIN_FILE", "");
		IContainer projectFolder = ResourcesPlugin.getWorkspace().getRoot()
				.getContainerForLocation(new Path(projectFileLocation.getAbsolutePath()));

		File inputFile;

		if (!inputFileLocation.isEmpty()) {
			inputFile = locationToFile(inputFileLocation);
			if (inputFile != null) {
				try {
					projectArguments += " " + new String(Files.readAllBytes(inputFile.toPath()));
				} catch (IOException e) {
					Display.getDefault().asyncExec(() -> {
						MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
								"Unable to Launch", "Unable to read input file.");
					});
					return;
				}
			}
		}

		if (projectFramework.isEmpty()) {
			IPath projectFilePath = new Path(
					projectFileLocation.getParent() + ProjectFileAccessor.getProjectFile(projectFolder));
			String[] frameworks = ProjectFileAccessor.getTargetFrameworks(projectFilePath);
			if (frameworks.length > 0) {
				projectFramework = frameworks[0];
			} else {
				Display.getDefault().asyncExec(() -> {
					MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
							"Unable to Launch", "Unable to retrieve target framework");
				});
				return;
			}
		}

		if (buildProject) {
			String[] cmdLine = new String[] { "dotnet", "build" };
			Process restoreProcess = DebugPlugin.exec(cmdLine, projectFileLocation);
			IProcess process = DebugPlugin.newProcess(launch, restoreProcess, "dotnet build");
			process.setAttribute(IProcess.ATTR_CMDLINE, String.join(" ", cmdLine));
			process.setAttribute(DebugPlugin.ATTR_PATH, configuration.getAttribute(DebugPlugin.ATTR_PATH, ""));
			process.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY,
					configuration.getAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, ""));

			try {
				restoreProcess.waitFor();
			} catch (InterruptedException e) {
			}
			if (restoreProcess.exitValue() != 0) { // errors will be shown in console
				return;
			}
			projectFolder.getProject().refreshLocal(IResource.DEPTH_INFINITE, null);
		}

		IContainer binaryFileContainer = projectFolder
				.getFolder(new Path("/bin/" + projectConfiguration + "/" + projectFramework));
		IFile binaryFile = null;
		if (binaryFileContainer.exists()) {
			for (IResource resource : binaryFileContainer.members()) {
				if (resource.getName().matches("^.*\\.dll$") && resource.getType() == IResource.FILE) {
					binaryFile = (IFile) resource;
				}
			}
		}

		if (binaryFile != null) {
			List<String> commandList = new ArrayList<>();
			commandList.add("dotnet");
			commandList.add("exec");
			commandList.add(ResourcesPlugin.getWorkspace().getRoot().getLocation().toString()
					+ binaryFile.getFullPath().toOSString());
			if (!projectArguments.isEmpty()) {
				commandList.addAll(Arrays.asList(projectArguments.split("\\s+")));
			}

			String[] cmdLine = commandList.toArray(new String[commandList.size()]);
			Process p = DebugPlugin.exec(cmdLine, projectFileLocation);
			IProcess process = DebugPlugin.newProcess(launch, p, "dotnet exec");
			process.setAttribute(IProcess.ATTR_CMDLINE, String.join(" ", cmdLine));
		} else {
			Display.getDefault().asyncExec(() -> {
				MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
						"Unable to Launch", "Unable to find binary file");
			});
			return;
		}
	}

	private ILaunchConfiguration getLaunchConfiguration(String mode, IResource resource) {
		ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
		ILaunchConfigurationType configType = launchManager
				.getLaunchConfigurationType("org.eclipse.acute.dotnetrun.DotnetRunDelegate");
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
				resource = resource.getParent();
			}
			wc.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, resource.getLocation().toString());
			wc.setAttribute(DebugPlugin.ATTR_PATH, "dotnet");
			return wc;
		} catch (CoreException e) {
			AcutePlugin.logError(e);
		}
		return null;
	}

	private File locationToFile(String location) {
		if (location.matches("^.*\\$\\{.*\\}.*$")) {
			IStringVariableManager manager = VariablesPlugin.getDefault().getStringVariableManager();
			try {
				location = manager.performStringSubstitution(location, false);
			} catch (CoreException e) {
				return null;
			}
		}
		return new File(location);
	}
}