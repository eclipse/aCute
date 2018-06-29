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
import java.util.concurrent.CompletableFuture;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.acute.Messages;
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
import org.eclipse.debug.ui.IDebugUIConstants;
import org.eclipse.debug.ui.ILaunchShortcut;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.osgi.util.NLS;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IEditorInput;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.PlatformUI;

public class DotnetRunDelegate extends LaunchConfigurationDelegate implements ILaunchShortcut {

	public static final String PROJECT_FOLDER = "PROJECT_FOLDER"; //$NON-NLS-1$
	public static final String PROJECT_BUILD = "PROJECT_BUILD"; //$NON-NLS-1$
	public static final String PROJECT_ARGUMENTS = "PROJECT_ARGUMENTS"; //$NON-NLS-1$
	public static final String PROJECT_FRAMEWORK = "PROJECT_FRAMEWORK"; //$NON-NLS-1$
	public static final String PROJECT_CONFIGURATION = "PROJECT_CONFIGURATION"; //$NON-NLS-1$

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
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(), Messages.DotnetRunDelegate_launchError_title,
					Messages.DotnetRunDelegate_launchError_message);
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
		String projectLocation = configuration.getAttribute(PROJECT_FOLDER, ""); //$NON-NLS-1$
		boolean buildProject = configuration.getAttribute(PROJECT_BUILD, true);
		String projectArguments = configuration.getAttribute(PROJECT_ARGUMENTS, ""); //$NON-NLS-1$
		String projectFramework = configuration.getAttribute(PROJECT_FRAMEWORK, ""); //$NON-NLS-1$
		String projectConfiguration = configuration.getAttribute(PROJECT_CONFIGURATION, "Debug"); //$NON-NLS-1$
		String inputFileLocation = configuration.getAttribute(IDebugUIConstants.ATTR_CAPTURE_STDIN_FILE, ""); //$NON-NLS-1$
		IContainer projectFolder = ResourcesPlugin.getWorkspace().getRoot()
				.getContainerForLocation(new Path(projectLocation));
		File projectFileLocation = new File(projectLocation);

		File inputFile;

		if (!inputFileLocation.isEmpty()) {
			inputFile = locationToFile(inputFileLocation);
			if (inputFile != null) {
				try {
					projectArguments += " " + new String(Files.readAllBytes(inputFile.toPath())); //$NON-NLS-1$
				} catch (IOException e) {
					Display.getDefault().asyncExec(() -> {
						MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
								Messages.DotnetRunDelegate_launchError_title, Messages.DotnetRunDelegate_launchError_message_readInputFile);
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
							Messages.DotnetRunDelegate_launchError_title, Messages.DotnetRunDelegate_launchError_message_retrieveTargetFile);
				});
				return;
			}
		}
		final String finalProjectArguments = projectArguments;
		final String framework = projectFramework;
		CompletableFuture.runAsync(() -> {
			try {
				if (buildProject) {
					String[] cmdLine = new String[] { AcutePlugin.getDotnetCommand(), "build" }; //$NON-NLS-1$
					Process restoreProcess = DebugPlugin.exec(cmdLine, projectFileLocation);
					IProcess process = DebugPlugin.newProcess(launch, restoreProcess, "dotnet build"); //$NON-NLS-1$
					process.setAttribute(IProcess.ATTR_CMDLINE, String.join(" ", cmdLine)); //$NON-NLS-1$

					try {
						restoreProcess.waitFor();
					} catch (InterruptedException e) {
					}
					if (restoreProcess.exitValue() != 0) { // errors will be shown in console
						return;
					}
					projectFolder.getProject().refreshLocal(IResource.DEPTH_INFINITE, null);
				}

				IPath projectFile = ProjectFileAccessor.getProjectFile(projectFolder);
				File binaryFile = new File(projectLocation + "/bin/" + projectConfiguration + "/" + framework + "/" //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
						+ projectFile.removeFileExtension().addFileExtension("dll").lastSegment()); //$NON-NLS-1$

				if (binaryFile.exists() && binaryFile.isFile()) {
					List<String> commandList = new ArrayList<>();
					commandList.add(AcutePlugin.getDotnetCommand());
					commandList.add("exec"); //$NON-NLS-1$
					commandList.add(binaryFile.getAbsolutePath());
					if (!finalProjectArguments.isEmpty()) {
						commandList.addAll(Arrays.asList(finalProjectArguments.split("\\s+"))); //$NON-NLS-1$
					}

					String[] cmdLine = commandList.toArray(new String[commandList.size()]);
					Process p = DebugPlugin.exec(cmdLine, projectFileLocation);
					IProcess process = DebugPlugin.newProcess(launch, p, "dotnet exec"); //$NON-NLS-1$
					process.setAttribute(IProcess.ATTR_CMDLINE, String.join(" ", cmdLine)); //$NON-NLS-1$
				} else {
					Display.getDefault().asyncExec(() -> {
						MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
								Messages.DotnetRunDelegate_launchError_title, NLS.bind(Messages.DotnetRunDelegate_launchError_message_findBinaryFile, binaryFile.getAbsolutePath()));
					});
					return;
				}

			} catch (CoreException e) {
				Display.getDefault().asyncExec(() -> {
					MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
							Messages.DotnetRunDelegate_exceptionInLaunch, e.getLocalizedMessage());
				});
			} catch (IllegalStateException e) {
				// handled by getDotnetCommand()
			}
		});
	}

	private ILaunchConfiguration getLaunchConfiguration(String mode, IResource resource) {
		ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
		ILaunchConfigurationType configType = launchManager
				.getLaunchConfigurationType("org.eclipse.acute.dotnetrun.DotnetRunDelegate"); //$NON-NLS-1$
		try {
			ILaunchConfiguration[] launchConfigurations = launchManager.getLaunchConfigurations(configType);

			String configName;
			if (resource.getLocation().toFile().isFile()) {
				configName = NLS.bind(Messages.DotnetRunDelegate_configuration, resource.getParent().getName() + "." + resource.getName()); //$NON-NLS-1$
			} else {
				configName = NLS.bind(Messages.DotnetRunDelegate_configuration, resource.getName());
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
			wc.setAttribute(PROJECT_FOLDER, resource.getLocation().toString());
			return wc;
		} catch (CoreException e) {
			AcutePlugin.logError(e);
		}
		return null;
	}

	private File locationToFile(String location) {
		if (location.matches("^.*\\$\\{.*\\}.*$")) { //$NON-NLS-1$
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