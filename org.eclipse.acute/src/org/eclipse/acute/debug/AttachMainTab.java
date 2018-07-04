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
import org.eclipse.core.runtime.CoreException;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Spinner;

/**
 * This class should take advantage of Java 9 {@link ProcessHandle} to discover
 * process based on the CLI parameters whenever we're ready to make Java 9 the BREE.
 */
public class AttachMainTab extends AbstractLaunchConfigurationTab {

	static final String ATTR_PID = AttachMainTab.class.getName() + ".ATTR_PID"; //$NON-NLS-1$
	// private static final String ATTR_COMMAND = AttachMainTab.class.getName() + ".ATTR_PROCESS_COMMAND"; //$NON-NLS-1$
	private Spinner pidText;

	@Override public void createControl(Composite parent) {
		Composite res = new Composite(parent, SWT.NONE);
		res.setLayout(new GridLayout(3, false));
		Label pidLabel = new Label(res, SWT.NONE);
		pidLabel.setText(Messages.AttachMainTab_processId);
		// As pid is volatile, additionally to PID, we should store the
		// CLI param of selected PID to easily discover other PID started
		// with same params.
		pidText = new Spinner(res, SWT.BORDER);
		pidText.setMinimum(0);
		pidText.setMaximum(Integer.MAX_VALUE);
		pidText.setLayoutData(new GridData(120, SWT.DEFAULT));
		pidText.addModifyListener(e -> setDirty(true));
		// with Java 9, add a Search button showing a "ProcessSelectionDialog"
		// filtering process using dotnet as command.
		setControl(res);
	}

	@Override public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {

	}

	@Override public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			if (configuration.hasAttribute(ATTR_PID)) {
				long pid = Long.parseLong(configuration.getAttribute(ATTR_PID, Integer.toString(-1)));
				if (pid >= Integer.MAX_VALUE) {
					throw new IllegalArgumentException("too big PID value: " + pid); //$NON-NLS-1$
				}
//			boolean sameProcess = ProcessHandle.of(pid).map(ProcessHandle::info).map(info -> info.commandLine().equals(Optional.ofNullable(configuration.getAttribute(ATTR_COMMAND, "NONSENSE"))));
//			if (sameProcess) {
					pidText.setSelection((int) pid);
//			} else {
//				String command = configuration.getAttribute(ATTR_COMMAND, "");
//				if (command.trim().length() > 0) {
//					Optional<String> commandOptional = Optional.of(command);
//					ProcessHandle.allProcesses().filter(handle -> handle.info().commandLine().equals(commandOptional)).findFirst().ifPresent(handle -> pidText.setSelection((int)handle.pid());
//				}
//			}
			}
		} catch (NumberFormatException | CoreException e) {
			AcutePlugin.logError(e);
		}
	}

	@Override public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute(ATTR_PID, pidText.getText());
	}

	@Override public String getName() {
		return Messages.AttachMainTab_title;
	}

}
