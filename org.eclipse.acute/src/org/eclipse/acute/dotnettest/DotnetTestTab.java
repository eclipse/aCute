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

import static org.eclipse.swt.events.SelectionListener.widgetSelectedAdapter;

import java.util.List;
import java.util.Map;

import org.eclipse.acute.ProjectFileAccessor;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.ICoreRunnable;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.jface.layout.GridLayoutFactory;
import org.eclipse.jface.viewers.ArrayContentProvider;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.LabelProvider;
import org.eclipse.jface.viewers.ListViewer;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.RowLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.dialogs.ElementListSelectionDialog;

public class DotnetTestTab extends AbstractLaunchConfigurationTab {
	private String projectConfig;
	private Path projectPath;
	private String testType;

	// Map<ClassName, List<MethodName>>
	private Map<String, List<String>> testMethods;
	private String[] targetFrameworks;
	private String loadedSelectedTargetFramework;
	private String loadedTestsParentProject;

	private Text pathText;
	private Button runAllRadio;
	private Button runMatchingRadio;
	private Label filterLabel;
	private Text filterText;
	private Button runSelectedRadio;
	private Label classLabel;
	private Text classText;
	private Button classBrowseButton;
	private Label methodLabel;
	private Text methodText;
	private Button methodBrowseButton;
	private ListViewer frameworkViewer;
	private Button releaseRadio;
	private Button debugRadio;
	private Button buildCheckBoxButton;
	private Button restoreCheckBoxButton;

	@Override
	public void createControl(Composite parent) {
		Composite container = new Group(parent, SWT.BORDER);
		setControl(container);
		GridLayoutFactory.swtDefaults().numColumns(4).applyTo(container);

		Label pathLabel = new Label(container, SWT.NONE);
		pathLabel.setText("Project:");
		pathLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));

		pathText = new Text(container, SWT.BORDER);
		pathText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		pathText.addModifyListener(e -> {
			updateProjectPath(pathText.getText());
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		Button browseButton = new Button(container, SWT.NONE);
		browseButton.setText("Browse...");
		browseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			FileDialog dialog = new FileDialog(browseButton.getShell());
			String path = dialog.open();
			if (path != null) {
				pathText.setText(path);
				updateProjectPath(path.toString());
				setDirty(true);
				updateLaunchConfigurationDialog();
			}
		}));

		runAllRadio = new Button(container, SWT.RADIO);
		runAllRadio.setText("Run all tests");
		runAllRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 4, 1));
		runAllRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.ALL_TESTS);
		}));

		runMatchingRadio = new Button(container, SWT.RADIO);
		runMatchingRadio.setText("Run tests matching the following filter");
		runMatchingRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 4, 1));
		runMatchingRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.MATCHING_TESTS);
		}));

		filterLabel = new Label(container, SWT.NONE);
		filterLabel.setText("Test Filter:");
		filterLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));

		filterText = new Text(container, SWT.BORDER);
		filterText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		filterText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});
		new Label(container, SWT.NONE);

		runSelectedRadio = new Button(container, SWT.RADIO);
		runSelectedRadio.setText("Run a single test");
		runSelectedRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 4, 1));
		runSelectedRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.SELECTED_TEST);
		}));

		classLabel = new Label(container, SWT.NONE);
		classLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		classLabel.setText("Test class:");

		classText = new Text(container, SWT.BORDER);
		classText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		classText.addModifyListener(e -> {
			if (classText.getText().isEmpty()) {
				methodBrowseButton.setEnabled(true);
				methodLabel.setEnabled(true);
				methodText.setEnabled(true);
			}
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		classBrowseButton = new Button(container, SWT.NONE);
		classBrowseButton.setText("Search");
		classBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		classBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			searchForTestClass();
		}));

		methodLabel = new Label(container, SWT.NONE);
		methodLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		methodLabel.setText("Test method:");

		methodText = new Text(container, SWT.BORDER);
		methodText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		methodText.setMessage("(all methods)");
		methodText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		methodBrowseButton = new Button(container, SWT.NONE);
		methodBrowseButton.setText("Search");
		methodBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		methodBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			searchForTestMethods();
		}));

		Label configLabel = new Label(container, SWT.NONE);
		configLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		configLabel.setText("Configuration:");

		Composite configComp = new Composite(container, SWT.NULL);
		configComp.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, true, false, 3, 1));
		configComp.setLayout(new RowLayout());

		Listener configRadioListener = new Listener() {
			@Override
			public void handleEvent(Event e) {
				projectConfig = ((Button) e.widget).getText();
				setDirty(true);
				updateLaunchConfigurationDialog();
			}
		};

		debugRadio = new Button(configComp, SWT.RADIO);
		debugRadio.setText("Debug");
		debugRadio.addListener(SWT.Selection, configRadioListener);

		releaseRadio = new Button(configComp, SWT.RADIO);
		releaseRadio.setText("Release");
		releaseRadio.addListener(SWT.Selection, configRadioListener);

		Label frameworkLabel = new Label(container, SWT.NONE);
		frameworkLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		frameworkLabel.setText("Framework:");

		org.eclipse.swt.widgets.List list = new org.eclipse.swt.widgets.List(container, SWT.V_SCROLL | SWT.BORDER);
		GridData listBoxData = new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1);
		listBoxData.heightHint = 50;
		list.setLayoutData(listBoxData);

		new Label(container, SWT.NONE).setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 4, 1));

		buildCheckBoxButton = new Button(container, SWT.CHECK);
		buildCheckBoxButton.setSelection(true);
		buildCheckBoxButton.setText("Build project");
		buildCheckBoxButton.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 4, 1));
		buildCheckBoxButton.addSelectionListener(widgetSelectedAdapter(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		}));

		restoreCheckBoxButton = new Button(container, SWT.CHECK);
		restoreCheckBoxButton.setSelection(true);
		restoreCheckBoxButton.setText("Restore project");
		restoreCheckBoxButton.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 4, 1));
		restoreCheckBoxButton.addSelectionListener(widgetSelectedAdapter(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		}));

		list.setEnabled(false);
		frameworkViewer = new ListViewer(list);
		frameworkViewer.setContentProvider(new ArrayContentProvider());
		frameworkViewer.add("No frameworks available");
	}

	@Override
	public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute("PROJECT_PATH", "");
		configuration.setAttribute("TEST_SELECTION_TYPE", DotnetTestDelegate.ALL_TESTS);
		configuration.setAttribute("TEST_FILTER", "");
		configuration.setAttribute("TEST_CLASS", "");
		configuration.setAttribute("TEST_METHOD", "");
		configuration.setAttribute("CONFIGURATION", "Debug");
		configuration.setAttribute("FRAMEWORK", "");
		configuration.setAttribute("PROJECT_BUILD", true);
		configuration.setAttribute("PROJECT_RESTORE", true);
	}

	@Override
	public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			pathText.setText(configuration.getAttribute("PROJECT_PATH", ""));
		} catch (CoreException ce) {
			pathText.setText("");
		}
		try {
			filterText.setText(configuration.getAttribute("TEST_FILTER", ""));
		} catch (CoreException ce) {
			filterText.setText("");
		}
		try {
			classText.setText(configuration.getAttribute("TEST_CLASS", ""));
		} catch (CoreException ce) {
			classText.setText("");
		}
		try {
			methodText.setText(configuration.getAttribute("TEST_METHOD", ""));
		} catch (CoreException ce) {
			methodText.setText("");
		}

		try {
			testType = configuration.getAttribute("TEST_SELECTION_TYPE", DotnetTestDelegate.ALL_TESTS);
		} catch (CoreException ce) {
			testType = DotnetTestDelegate.ALL_TESTS;
		} finally {
			switchSelector(testType);
			runSelectedRadio.setSelection(false);
			runMatchingRadio.setSelection(false);
			runAllRadio.setSelection(false);
			if (testType.equals(DotnetTestDelegate.SELECTED_TEST)) {
				runSelectedRadio.setSelection(true);
			} else if (testType.equals(DotnetTestDelegate.MATCHING_TESTS)) {
				runMatchingRadio.setSelection(true);
			} else {
				runAllRadio.setSelection(true);
			}
		}

		try {
			projectConfig = configuration.getAttribute("CONFIGURATION", "Debug");
		} catch (CoreException ce) {
			projectConfig = "Debug";
		} finally {
			if (projectConfig.equals("Debug")) {
				debugRadio.setSelection(true);
				releaseRadio.setSelection(false);
			} else {
				releaseRadio.setSelection(true);
				debugRadio.setSelection(false);
			}
		}
		try {
			loadedSelectedTargetFramework = configuration.getAttribute("FRAMEWORK", "");
		} catch (CoreException ce) {
			// no selection to load
		}
		try {
			buildCheckBoxButton.setSelection(configuration.getAttribute("PROJECT_BUILD", true));
		} catch (CoreException ce) {
			buildCheckBoxButton.setSelection(true);
		}
		try {
			restoreCheckBoxButton.setSelection(configuration.getAttribute("PROJECT_RESTORE", true));
		} catch (CoreException ce) {
			restoreCheckBoxButton.setSelection(true);
		}
	}

	@Override
	public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute("PROJECT_PATH", pathText.getText());
		configuration.setAttribute("TEST_SELECTION_TYPE", testType);
		configuration.setAttribute("TEST_FILTER", filterText.getText());
		configuration.setAttribute("TEST_CLASS", classText.getText());
		configuration.setAttribute("TEST_METHOD", methodText.getText());
		configuration.setAttribute("CONFIGURATION", projectConfig);
		configuration.setAttribute("FRAMEWORK", getTargetFramework());
		configuration.setAttribute("PROJECT_BUILD", buildCheckBoxButton.getSelection());
		configuration.setAttribute("PROJECT_RESTORE", restoreCheckBoxButton.getSelection());

		setDirty(false);
	}

	@Override
	public String getName() {
		return "Main";
	}

	private void switchSelector(String type) {

		filterLabel.setEnabled(false);
		filterText.setEnabled(false);
		classBrowseButton.setEnabled(false);
		classLabel.setEnabled(false);
		classText.setEnabled(false);
		methodBrowseButton.setEnabled(false);
		methodLabel.setEnabled(false);
		methodText.setEnabled(false);

		if (type.equals(DotnetTestDelegate.SELECTED_TEST)) {
			classBrowseButton.setEnabled(true);
			classLabel.setEnabled(true);
			classText.setEnabled(true);
			if (!classText.getText().isEmpty()) {
				methodBrowseButton.setEnabled(true);
				methodLabel.setEnabled(true);
				methodText.setEnabled(true);
			}
			testType = DotnetTestDelegate.SELECTED_TEST;
		} else if (type.equals(DotnetTestDelegate.MATCHING_TESTS)) {
			filterLabel.setEnabled(true);
			filterText.setEnabled(true);
			testType = DotnetTestDelegate.MATCHING_TESTS;
		} else {
			testType = DotnetTestDelegate.ALL_TESTS;
		}

		setDirty(true);
		updateLaunchConfigurationDialog();
	}

	private void updateProjectPath(String location) {
		projectPath = new Path(location);
		updateFrameworkList();
	}

	private void searchForTestClass() {
		if (!pathText.getText().equals(loadedTestsParentProject) || testMethods == null) {
			loadedTestsParentProject = pathText.getText();
			testMethods = null;
			Job.create("Retrive Test Classes", (ICoreRunnable) monitor -> {
				testMethods = DotnetTestAccessor.getTestMethods(projectPath.toFile());
				Display.getDefault().asyncExec(() -> {
					displayClassSelectorDialog();
				});
			}).schedule();
		} else {
			displayClassSelectorDialog();
		}
	}

	private void displayClassSelectorDialog() {

		ElementListSelectionDialog dialog = new ElementListSelectionDialog(classBrowseButton.getShell(),
				new LabelProvider());
		dialog.setTitle("Class Selection");
		dialog.setMessage("Select a class (* = any string, ? = any char):");
		dialog.setElements(testMethods.keySet().toArray());
		dialog.open();
		String selected = (String) dialog.getFirstResult();
		if (selected != null) {
			methodBrowseButton.setEnabled(true);
			methodLabel.setEnabled(true);
			methodText.setEnabled(true);
			classText.setText(selected);
			setDirty(true);
			updateLaunchConfigurationDialog();
		}
	}

	private void searchForTestMethods() {
		if (!pathText.getText().equals(loadedTestsParentProject) || testMethods == null) {
			loadedTestsParentProject = pathText.getText();
			testMethods = null;
			Job.create("Retrive Test Classes", (ICoreRunnable) monitor -> {
				testMethods = DotnetTestAccessor.getTestMethods(projectPath.toFile());
				Display.getDefault().asyncExec(() -> {
					displayMethodSelectorDialog();
				});
			}).schedule();
		} else {
			displayMethodSelectorDialog();
		}
	}

	private void displayMethodSelectorDialog() {
		ElementListSelectionDialog dialog = new ElementListSelectionDialog(classBrowseButton.getShell(),
				new LabelProvider());
		dialog.setTitle("Method Selection from \"" + classText.getText() + "\"");
		dialog.setMessage("Select a method (* = any string, ? = any char):");
		List<String> methods = testMethods.get(classText.getText());
		if(methods!=null) {
			dialog.setElements(methods.toArray());
		}
		dialog.open();
		String selected = (String) dialog.getFirstResult();
		if (selected != null) {
			methodText.setText(selected);
			setDirty(true);
			updateLaunchConfigurationDialog();
		}
	}

	private void updateFrameworkList() {
		frameworkViewer.getList().removeAll();
		if (isProjectFile(projectPath)) {
			frameworkViewer.getList().deselectAll();
			frameworkViewer.add("Loading frameworks");
			frameworkViewer.getList().setEnabled(false);
			targetFrameworks = ProjectFileAccessor.getTargetFrameworks(projectPath);
			frameworkViewer.getList().removeAll();

			if (targetFrameworks.length > 0) {
				frameworkViewer.add(targetFrameworks);
				frameworkViewer.getList().select(0);
				frameworkViewer.getList().setEnabled(true);
				loadFramework();
				return;
			}
		}

		frameworkViewer.add("No frameworks available");
	}

	private void loadFramework() {
		if (loadedSelectedTargetFramework == null || loadedSelectedTargetFramework.isEmpty()) {
			return;
		}
		int index = 0;
		for (String framework : frameworkViewer.getList().getItems()) {
			if (framework.equals(loadedSelectedTargetFramework)) {
				frameworkViewer.getList().select(index);
				break;
			}
			index++;
		}
		loadedSelectedTargetFramework = null;
	}

	private boolean isProjectFile(Path path) {
		if (path == null || path.isEmpty()) {
			return false;
		} else if (!path.lastSegment().matches("(.*\\.csproj|project.json)")) {
			return false;
		} else if (!path.toFile().isFile()) {
			return false;
		}
		return true;
	}

	public String getTargetFramework() {
		IStructuredSelection selection = (IStructuredSelection) frameworkViewer.getSelection();
		if (selection.isEmpty()) {
			return "";
		}
		return (String) selection.getFirstElement();
	}

}
