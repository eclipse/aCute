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

import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.eclipse.acute.Messages;
import org.eclipse.acute.debug.DebuggersRegistry.DebuggerInfo;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.lsp4e.debug.DSPPlugin;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;

public class DebuggerTab extends AbstractLaunchConfigurationTab {

	static final String ATTR_DEFAULT_DEBUGGER = DebuggerTab.class.getName() + ".ATTR_DEFAULT_DEBUGGER"; //$NON-NLS-1$
	private Text debugCommandText;
	private Text debugArgsText;
	private Button defaultDebuggerCheckbox;
	private Button browseDebuggerButton;
	private Set<Control> toDisableWhenDefault = new HashSet<>();

	@Override public void createControl(Composite parent) {
		Composite res = new Composite(parent, SWT.NONE);
		res.setLayout(new GridLayout(3, false));
		defaultDebuggerCheckbox = createCheckButton(res, Messages.DebuggerTab_useDefaultDebugger);
		defaultDebuggerCheckbox.setLayoutData(new GridData(SWT.FILL, SWT.DEFAULT, false, false, 3, 1));
		Label debuggerPathLabel = new Label(res, SWT.NONE);
		debuggerPathLabel.setText(Messages.DebuggerTab_debuggerPath);
		toDisableWhenDefault.add(debuggerPathLabel);
		debugCommandText = new Text(res, SWT.BORDER);
		debugCommandText.setLayoutData(new GridData(SWT.FILL, SWT.DEFAULT,true, false));
		debugCommandText.addModifyListener(e -> {
			setDirty(true);
		});
		toDisableWhenDefault.add(debugCommandText);
		browseDebuggerButton = new Button(res, SWT.PUSH);
		browseDebuggerButton.setText(Messages.DotnetRunTab_browse);
		browseDebuggerButton.addSelectionListener(SelectionListener.widgetSelectedAdapter(event -> {
			FileDialog dialog = new FileDialog(getShell());
			dialog.setText(Messages.DebuggerTab_selectDebugger);
			String currentCommand = debugCommandText.getText();
			if (currentCommand != null && !currentCommand.trim().isEmpty()) {
				File file = new File(currentCommand.trim());
				if (file.isDirectory()) {
					dialog.setFilterPath(file.getAbsolutePath());
				} else if (file.isFile()) {
					dialog.setFilterPath(file.getParentFile().getAbsolutePath());
					dialog.setFileName(file.getName());
				} else if (file.getParentFile().exists()) {
					dialog.setFilterPath(file.getParentFile().getAbsolutePath());
				}
			}
			boolean cancel = false;
			boolean valid = false;
			File file = null;
			do {
				cancel = valid = false;
				String path = dialog.open();
				if (path != null) {
					file = new File(path);
					if (!file.isFile()) {
						MessageDialog.openError(getShell(), Messages.DebuggerTab_invalidFile_title, Messages.DebuggerTab_invalidFile_message);
					} else if (!file.canExecute()) {
						MessageDialog.openError(getShell(), Messages.DebuggerTab_nonExecutableFile_title, Messages.DebuggerTab_nonExecutableFileMessage);
					} else {
						valid = true;
					}
				} else {
					cancel = true;
				}
			} while (!cancel && !valid);
			if (valid && !file.getAbsolutePath().equals(debugCommandText.getText())) {
				debugCommandText.setText(file.getAbsolutePath());
				setDirty(valid);
			}
		}));
		toDisableWhenDefault.add(browseDebuggerButton);
		// TODO validation
		Label debuggerArgsLabel = new Label(res, SWT.NONE);
		debuggerArgsLabel.setText(Messages.DebuggerTab_debuggerArgs);
		toDisableWhenDefault.add(debuggerArgsLabel);
		debugArgsText = new Text(res, SWT.BORDER);
		debugArgsText.addModifyListener(e -> {
			setDirty(true);
		});
		debugArgsText.setLayoutData(new GridData(SWT.FILL, SWT.DEFAULT, true, false, 2, 1));
		toDisableWhenDefault.add(debugArgsText);
		defaultDebuggerCheckbox.addSelectionListener(SelectionListener.widgetSelectedAdapter(event -> {
			setDirty(true);
			toDisableWhenDefault.forEach(widget -> widget.setEnabled(!defaultDebuggerCheckbox.getSelection()));
		}));
		setControl(res);
	}

	@Override public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute(DebuggerTab.ATTR_DEFAULT_DEBUGGER, true);
		configuration.setAttribute(DSPPlugin.ATTR_DSP_CMD, ""); //$NON-NLS-1$
		configuration.setAttribute(DSPPlugin.ATTR_DSP_ARGS, ""); //$NON-NLS-1$
	}

	@Override public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			defaultDebuggerCheckbox.setSelection(configuration.getAttribute(ATTR_DEFAULT_DEBUGGER, true));
			if (defaultDebuggerCheckbox.getSelection()) {
				DebuggerInfo info = DebuggersRegistry.getDefaultDebugger();
				debugCommandText.setText(info.debugger.getAbsolutePath());
				debugArgsText.setText(String.join(" ", info.args)); //$NON-NLS-1$
				toDisableWhenDefault.forEach(control -> control.setEnabled(false));
			} else {
				defaultDebuggerCheckbox.setSelection(false);
				debugCommandText.setText(configuration.getAttribute(DSPPlugin.ATTR_DSP_CMD, "")); //$NON-NLS-1$
				List<String> args = configuration.getAttribute(DSPPlugin.ATTR_DSP_ARGS, Collections.emptyList());
				debugArgsText.setText(String.join(" ", args.toArray(new String[args.size()]))); //$NON-NLS-1$
				toDisableWhenDefault.forEach(control -> control.setEnabled(true));
			}
		} catch (CoreException e) {
			setErrorMessage(e.getMessage());
		}
	}

	@Override public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute(ATTR_DEFAULT_DEBUGGER, defaultDebuggerCheckbox.getSelection());
		if (defaultDebuggerCheckbox.getSelection()) {
			configuration.removeAttribute(DSPPlugin.ATTR_DSP_CMD);
			configuration.removeAttribute(DSPPlugin.ATTR_DSP_ARGS);
		} else {
			configuration.setAttribute(DSPPlugin.ATTR_DSP_CMD, getAttributeValueFrom(debugCommandText));
			String arg = getAttributeValueFrom(debugArgsText);
			if (arg == null) {
				configuration.setAttribute(DSPPlugin.ATTR_DSP_ARGS, (String) null);
			} else {
				configuration.setAttribute(DSPPlugin.ATTR_DSP_ARGS, Arrays.asList(arg.split("\\s+"))); //$NON-NLS-1$
			}
		}
	}

	protected String getAttributeValueFrom(Text text) {
		String value = text.getText().trim();
		if (!value.isEmpty()) {
			return value;
		}
		return null;
	}

	@Override public String getName() {
		return Messages.DebuggerTab_title;
	}

}
