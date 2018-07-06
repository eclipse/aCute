/*******************************************************************************
 * Copyright (c) 2018 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.debug;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.acute.Messages;
import org.eclipse.acute.Tester;
import org.eclipse.acute.dotnetrun.DotnetRunDelegate;
import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.jface.fieldassist.ControlDecoration;
import org.eclipse.jface.fieldassist.FieldDecorationRegistry;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;

public class DebugLaunchMainTab extends AbstractLaunchConfigurationTab {

	private Combo projectCombo;
	private Text programArgsText;

	@Override public void createControl(Composite parent) {
		Composite control = new Composite(parent, SWT.NONE);
		control.setLayout(new GridLayout(2, false));
		Label project = new Label(control, SWT.NONE);
		project.setText(Messages.AcuteDebugMainTab_project);
		projectCombo = new Combo(control, SWT.BORDER);
		for (IProject p : ResourcesPlugin.getWorkspace().getRoot().getProjects()) {
			if (Tester.isDotnetProject(p)) {
				projectCombo.add(p.getName());
			}
		}
		ControlDecoration projectComboDecoration = new ControlDecoration(projectCombo, SWT.TOP | SWT.LEFT);
		projectComboDecoration.setImage(FieldDecorationRegistry.getDefault().getFieldDecoration(FieldDecorationRegistry.DEC_ERROR).getImage());
		projectCombo.addModifyListener(e -> {
			setDirty(true);
			String projectName = projectCombo.getText();
			IProject p = ResourcesPlugin.getWorkspace().getRoot().getProject(projectName);
			if (p == null || !p.exists()) {
				setErrorMessage(Messages.AcuteDebugMainTab_notAProject);
				projectComboDecoration.setDescriptionText(Messages.AcuteDebugMainTab_notAProject);
				projectComboDecoration.show();
			} else if (!Tester.isDotnetProject(p)) {
				setErrorMessage(Messages.AcuteDebugMainTab_notADotnetProject);
				projectComboDecoration.setDescriptionText(Messages.AcuteDebugMainTab_notADotnetProject);
				projectComboDecoration.show();
			} else {
				setErrorMessage(null);
				projectComboDecoration.hide();
			}
			updateLaunchConfigurationDialog();
		});

		// TODO validation
		Label programArgsLabel = new Label(control, SWT.NONE);
		programArgsLabel.setText(Messages.AcuteDebugMainTab_promgramArgs);
		programArgsText = new Text(control, SWT.BORDER);
		programArgsText.addModifyListener(e -> {
			setDirty(true);
		});
		setControl(control);
	}

	@Override public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {
	}

	@Override public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			projectCombo.setText(configuration.getAttribute(DotnetRunDelegate.PROJECT_FOLDER, "")); //$NON-NLS-1$
			if (projectCombo.getText().isEmpty() && projectCombo.getItems().length > 0) {
				projectCombo.setText(projectCombo.getItems()[0]);
			}
			programArgsText.setText(configuration.getAttribute(DotnetRunDelegate.PROJECT_ARGUMENTS, "")); //$NON-NLS-1$
		} catch (CoreException e) {
			setErrorMessage(e.getMessage());
		}
	}

	@Override public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		if (getProject() != null) {
			configuration.setAttribute(DotnetRunDelegate.PROJECT_FOLDER, getProject().getName());
		}
		String programArgs = programArgsText.getText();
		configuration.setAttribute(DotnetRunDelegate.PROJECT_ARGUMENTS, programArgs);
	}

	private IContainer getProject() {
		String projectName = projectCombo.getText();
		if (projectName != null && !projectName.isEmpty()) {
			return ResourcesPlugin.getWorkspace().getRoot().getProject(projectName);
		}
		return null;
	}

	@Override public String getName() {
		return Messages.AcuteDebugMainTab_title;
	}

	@Override public boolean isValid(ILaunchConfiguration launchConfig) {
		if (!super.isValid(launchConfig)) {
			return false;
		}
		String projectName;
		try {
			projectName = launchConfig.getAttribute(DotnetRunDelegate.PROJECT_FOLDER, ""); //$NON-NLS-1$
			if (projectName.isEmpty()) {
				return false;
			}
			return Tester.isDotnetProject(ResourcesPlugin.getWorkspace().getRoot().getProject(projectName));
		} catch (CoreException e) {
			AcutePlugin.logError(e);
			setErrorMessage(e.getMessage());
			return false;
		}
	}

}
