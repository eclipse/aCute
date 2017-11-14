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
package org.eclipse.acute;

import static org.eclipse.swt.events.SelectionListener.widgetSelectedAdapter;

import java.io.File;

import org.eclipse.jface.preference.IPreferenceStore;
import org.eclipse.jface.preference.PreferencePage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkbenchPreferencePage;

public class AcutePreferencePage extends PreferencePage implements IWorkbenchPreferencePage {
	public static String PAGE_ID = "org.eclipse.acute.preferencePage";
	private IPreferenceStore store;

	private Text explicitDotnetPathText;

	@Override
	public void init(IWorkbench workbench) {
		store = doGetPreferenceStore();
	}

	@Override
	protected Control createContents(Composite parent) {
		Composite container = new Composite(parent, SWT.NULL);
		container.setLayout(new GridLayout(2, false));

		createDotnetPathPart(container);

		initializeContent();
		return container;
	}

	private void initializeContent() {
		explicitDotnetPathText.setText(store.getString(AcutePreferenceInitializer.explicitDotnetPathPreference));
	}

	@Override
	protected IPreferenceStore doGetPreferenceStore() {
		return AcutePlugin.getDefault().getPreferenceStore();
	}

	private boolean isPageValid() {
		if (explicitDotnetPathText.getText().isEmpty()) {
			setErrorMessage("Path cannot be empty");
			return false;
		}
		File dotnetCommand = new File(explicitDotnetPathText.getText());
		if (!dotnetCommand.exists() || !dotnetCommand.isFile()) {
			setErrorMessage("Input a valid path to `dotnet` command");
			return false;
		} else if (!dotnetCommand.canExecute()) {
			setErrorMessage("Inputted command is not executable");
			return false;
		}
		setErrorMessage(null);
		return true;
	}

	@Override
	protected void performDefaults() {
		explicitDotnetPathText.setText(store.getDefaultString(AcutePreferenceInitializer.explicitDotnetPathPreference));
		super.performDefaults();
	}

	@Override
	public boolean performOk() {
		store.setValue(AcutePreferenceInitializer.explicitDotnetPathPreference, explicitDotnetPathText.getText());
		return super.performOk();
	}

	private void createDotnetPathPart(Composite container) {
		Label infoLabel = new Label(container, SWT.WRAP);
		infoLabel.setText(
				"Direct path to the `dotnet` command for .NET Core features:");
		infoLabel.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 2, 1));

		GridData textIndent = new GridData(SWT.FILL, SWT.CENTER, true, false, 1, 1);
		textIndent.horizontalIndent = 25;

		explicitDotnetPathText = new Text(container, SWT.BORDER);
		explicitDotnetPathText.setLayoutData(textIndent);
		explicitDotnetPathText.addModifyListener(e -> {
			setValid(isPageValid());
		});

		Button browseButton = new Button(container, SWT.NONE);
		browseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		browseButton.setText("Browse...");
		browseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			FileDialog dialog = new FileDialog(browseButton.getShell());
			String path = dialog.open();
			if (path != null) {
				explicitDotnetPathText.setText(path);
			}
		}));
	}

}
