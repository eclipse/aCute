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

import static org.eclipse.swt.events.SelectionListener.widgetSelectedAdapter;

import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.Path;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.jface.layout.GridDataFactory;
import org.eclipse.jface.layout.GridLayoutFactory;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.dialogs.ContainerSelectionDialog;;

public class DotnetRunTab extends AbstractLaunchConfigurationTab {

	private Text pathText;
	private Text argumentsText;
	private Button debugRadio;
	private Button releaseRadio;
	private Button buildCheckBoxButton;

	private String configuration = "Debug";

	@Override
	public void createControl(Composite parent) {
		Composite container = new Group(parent, SWT.BORDER);
		setControl(container);
		GridLayoutFactory.swtDefaults().numColumns(4).applyTo(container);

		Label locationLabel = new Label(container, SWT.NONE);
		locationLabel.setText("Location:");
		locationLabel.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 2, 1));

		pathText = new Text(container, SWT.BORDER);
		pathText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		Button browseButton = new Button(container, SWT.NONE);
		browseButton.setText("Browse...");
		browseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			ContainerSelectionDialog dialog = new ContainerSelectionDialog(browseButton.getShell(),
					ResourcesPlugin.getWorkspace().getRoot(), false, "Project Folder:");
			int path = dialog.open();
			Object[] results = dialog.getResult();
			if (path == 0 && results.length > 0) {
				pathText.setText(
						ResourcesPlugin.getWorkspace().getRoot().getLocation().toFile().getAbsolutePath().toString()
						+ ((Path) results[0]).toOSString());
				setDirty(true);
				updateLaunchConfigurationDialog();
			}
		}));

		GridDataFactory.fillDefaults().grab(true, false).applyTo(pathText);

		Label argumentLabel = new Label(container, SWT.NONE);
		argumentLabel.setText("Arguments:");
		argumentLabel.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 2, 1));

		argumentsText = new Text(container, SWT.BORDER);
		argumentsText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 2, 1));
		argumentsText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		Listener configRadioListener = new Listener() {
			@Override
			public void handleEvent(Event e) {
				configuration = ((Button) e.widget).getText();
				setDirty(true);
				updateLaunchConfigurationDialog();
			}
		};

		debugRadio = new Button(container, SWT.RADIO);
		debugRadio.setText("Debug");
		debugRadio.setSelection(true);
		debugRadio.addListener(SWT.Selection, configRadioListener);

		releaseRadio = new Button(container, SWT.RADIO);
		releaseRadio.setText("Release");
		releaseRadio.addListener(SWT.Selection, configRadioListener);

		new Label(container, SWT.NONE).setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 4, 1));

		buildCheckBoxButton = new Button(container, SWT.CHECK);
		buildCheckBoxButton.setSelection(true);
		buildCheckBoxButton.setText("Build project");
		buildCheckBoxButton.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 4, 1));
		buildCheckBoxButton.addSelectionListener(widgetSelectedAdapter(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		}));
	}

	@Override
	public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute("PROJECT_FOLDER",
				ResourcesPlugin.getWorkspace().getRoot().getLocation().toString());
		configuration.setAttribute("PROJECT_ARGUMENTS", "");
		configuration.setAttribute("PROJECT_BUILD", true);
		configuration.setAttribute("PROJECT_FRAMEWORK", "");
	}

	@Override
	public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			pathText.setText(configuration.getAttribute("PROJECT_FOLDER", ""));
		} catch (CoreException ce) {
			pathText.setText(ResourcesPlugin.getWorkspace().getRoot().getLocation().toString());
		}
		try {
			argumentsText.setText(configuration.getAttribute("PROJECT_ARGUMENTS", ""));
		} catch (CoreException ce) {
			argumentsText.setText("");
		}
		try {
			this.configuration = configuration.getAttribute("PROJECT_CONFIGURATION", "Debug");
			debugRadio.setSelection(this.configuration.equals("Debug"));
			releaseRadio.setSelection(!debugRadio.getSelection());
		} catch (CoreException ce) {
			// no initialize required
		}
		try {
			buildCheckBoxButton.setSelection(configuration.getAttribute("PROJECT_BUILD", true));
		} catch (CoreException ce) {
			buildCheckBoxButton.setSelection(true);
		}
	}

	@Override
	public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute("PROJECT_FOLDER", pathText.getText());
		configuration.setAttribute("PROJECT_ARGUMENTS", argumentsText.getText());
		configuration.setAttribute("PROJECT_BUILD", buildCheckBoxButton.getSelection());
		configuration.setAttribute("PROJECT_CONFIGURATION", this.configuration);
		setDirty(false);
	}

	@Override
	public String getName() {
		return "Main";
	}

}