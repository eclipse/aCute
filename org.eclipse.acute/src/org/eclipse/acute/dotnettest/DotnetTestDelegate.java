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
package org.eclipse.acute.dotnettest;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.acute.Messages;
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
import org.eclipse.debug.core.model.LaunchConfigurationDelegate;
import org.eclipse.debug.ui.ILaunchShortcut;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.osgi.util.NLS;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IEditorInput;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.PlatformUI;

public class DotnetTestDelegate extends LaunchConfigurationDelegate implements ILaunchShortcut {

	public static final String CONFIGURATION = "CONFIGURATION"; //$NON-NLS-1$
	public static final String FRAMEWORK = "FRAMEWORK"; //$NON-NLS-1$
	public static final String TEST_SELECTION_TYPE = "TEST_SELECTION_TYPE"; //$NON-NLS-1$
	public static final String TEST_FILTER = "TEST_FILTER"; //$NON-NLS-1$
	public static final String TEST_CLASS = "TEST_CLASS"; //$NON-NLS-1$
	public static final String TEST_METHOD = "TEST_METHOD"; //$NON-NLS-1$
	public static final String PROJECT_BUILD = "PROJECT_BUILD"; //$NON-NLS-1$
	public static final String PROJECT_RESTORE = "PROJECT_RESTORE"; //$NON-NLS-1$

	public static final String ALL_TESTS = "ALL"; //$NON-NLS-1$
	public static final String MATCHING_TESTS = "MATCHING"; //$NON-NLS-1$
	public static final String SELECTED_TEST = "SELECTED"; //$NON-NLS-1$

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
						AcutePlugin.logError(e);
					}
					return;
				}
			}
		}
		Display.getDefault().asyncExec(() -> {
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
					Messages.DotnetTestDelegate_runTestError_title, Messages.DotnetTestDelegate_runTestError_message_badSelection);
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
			AcutePlugin.logError(e);
		}
	}

	@Override
	public void launch(ILaunchConfiguration configuration, String mode, ILaunch launch, IProgressMonitor monitor)
			throws CoreException {
		String projectLocation = configuration.getAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, ""); //$NON-NLS-1$
		String projectConfiguration = configuration.getAttribute(CONFIGURATION, "Debug"); //$NON-NLS-1$
		String projectFramework = configuration.getAttribute(FRAMEWORK, ""); //$NON-NLS-1$
		String testSelectionMethod = configuration.getAttribute(TEST_SELECTION_TYPE, ALL_TESTS);
		String selectionFilter = configuration.getAttribute(TEST_FILTER, ""); //$NON-NLS-1$
		String selectionClass = configuration.getAttribute(TEST_CLASS, ""); //$NON-NLS-1$
		String selectionMethod = configuration.getAttribute(TEST_METHOD, ""); //$NON-NLS-1$
		boolean buildProject = configuration.getAttribute(PROJECT_BUILD, true);
		boolean restoreProject = configuration.getAttribute(PROJECT_RESTORE, true);

		File projectFile = new File(projectLocation);

		if (projectFile != null && projectFile.isFile()) {
			projectFile = projectFile.getParentFile();
		}

		if (projectFile == null || !projectFile.exists()) {
			MessageDialog.openError(PlatformUI.getWorkbench().getActiveWorkbenchWindow().getShell(),
					Messages.DotnetTestDelegate_runTestError_title, Messages.DotnetTestDelegate_runTestError_message_badLocation);
			return;

		}

		List<String> commandList = new ArrayList<>();
		try {
			commandList.add(AcutePlugin.getDotnetCommand());
		} catch (IllegalStateException e) {
			e.printStackTrace(); // Added to see if sonarqube will log as added major issue
			return;
		}
		commandList.add("test"); //$NON-NLS-1$

		if (!projectConfiguration.isEmpty()) {
			commandList.add("-c"); //$NON-NLS-1$
			commandList.add(projectConfiguration);
		}

		if (!projectFramework.isEmpty()) {
			commandList.add("-f"); //$NON-NLS-1$
			commandList.add(projectFramework);
		}

		if (testSelectionMethod.equals(MATCHING_TESTS) && !selectionFilter.isEmpty()) {
			commandList.add("--filter"); //$NON-NLS-1$
			commandList.add(selectionFilter);
		} else if (testSelectionMethod.equals(SELECTED_TEST) && !selectionClass.isEmpty()) {
			commandList.add("--filter"); //$NON-NLS-1$
			if (selectionMethod.isEmpty()) {
				commandList.add("FullyQualifiedName~" + selectionClass); //$NON-NLS-1$
			} else {
				commandList.add("FullyQualifiedName=" + selectionClass + "." + selectionMethod); //$NON-NLS-1$ //$NON-NLS-2$

			}
		}

		if (!buildProject) {
			commandList.add("--no-build"); //$NON-NLS-1$
		}

		if (!restoreProject) {
			commandList.add("--no-restore"); //$NON-NLS-1$
		}

		Process p = DebugPlugin.exec(commandList.toArray(new String[commandList.size()]), projectFile);
		DebugPlugin.newProcess(launch, p, "dotnet test"); //$NON-NLS-1$
	}

	private ILaunchConfiguration getLaunchConfiguration(String mode, IResource resource) {
		ILaunchManager launchManager = DebugPlugin.getDefault().getLaunchManager();
		ILaunchConfigurationType configType = launchManager
				.getLaunchConfigurationType("org.eclipse.acute.dotnettest.DotnetTestDelegate"); //$NON-NLS-1$
		try {
			ILaunchConfiguration[] launchConfigurations = launchManager.getLaunchConfigurations(configType);

			String configName;
			if (resource.getLocation().toFile().isFile()) {
				configName = NLS.bind(Messages.DotnetTestDelegate_configuration, resource.getParent().getName() + "." + resource.getName()); //$NON-NLS-1$
			} else {
				configName = NLS.bind(Messages.DotnetTestDelegate_configuration, resource.getName());
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
				String extension = resource.getFileExtension();
				if (extension!= null && extension.equals("cs")) { //$NON-NLS-1$
					wc.setAttribute(TEST_SELECTION_TYPE, SELECTED_TEST);
					wc.setAttribute(TEST_CLASS, resource.getName().replaceFirst("\\.cs$", "")); //$NON-NLS-1$ //$NON-NLS-2$
				}
				wc.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, resource.getParent().getLocation().toString());
			} else {
				wc.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, resource.getLocation().toString());
			}

			return wc;
		} catch (CoreException e) {
			AcutePlugin.logError(e);
		}
		return null;
	}
}