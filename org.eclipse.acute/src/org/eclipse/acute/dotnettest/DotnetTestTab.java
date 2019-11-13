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

import static org.eclipse.swt.events.SelectionListener.widgetSelectedAdapter;

import java.util.List;
import java.util.Map;

import org.eclipse.acute.Messages;
import org.eclipse.acute.ProjectFileAccessor;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.ICoreRunnable;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.debug.core.DebugPlugin;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.debug.ui.AbstractLaunchConfigurationTab;
import org.eclipse.jface.layout.GridLayoutFactory;
import org.eclipse.jface.viewers.ArrayContentProvider;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.LabelProvider;
import org.eclipse.jface.viewers.ListViewer;
import org.eclipse.osgi.util.NLS;
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
	private Object[] targetFrameworks;
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
		pathLabel.setText(Messages.DotnetTestTab_project);
		pathLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));

		pathText = new Text(container, SWT.BORDER);
		pathText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		pathText.addModifyListener(e -> {
			updateProjectPath(pathText.getText());
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		Button browseButton = new Button(container, SWT.NONE);
		browseButton.setText(Messages.DotnetTestTab_browse);
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
		runAllRadio.setText(Messages.DotnetTestTab_runAll);
		runAllRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 4, 1));
		runAllRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.ALL_TESTS);
		}));

		runMatchingRadio = new Button(container, SWT.RADIO);
		runMatchingRadio.setText(Messages.DotnetTestTab_runMatching);
		runMatchingRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 4, 1));
		runMatchingRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.MATCHING_TESTS);
		}));

		filterLabel = new Label(container, SWT.NONE);
		filterLabel.setText(Messages.DotnetTestTab_testFilter);
		filterLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));

		filterText = new Text(container, SWT.BORDER);
		filterText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		filterText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});
		new Label(container, SWT.NONE);

		runSelectedRadio = new Button(container, SWT.RADIO);
		runSelectedRadio.setText(Messages.DotnetTestTab_runSingle);
		runSelectedRadio.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 4, 1));
		runSelectedRadio.addSelectionListener(widgetSelectedAdapter(e -> {
			switchSelector(DotnetTestDelegate.SELECTED_TEST);
		}));

		classLabel = new Label(container, SWT.NONE);
		classLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		classLabel.setText(Messages.DotnetTestTab_testClass);

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
		classBrowseButton.setText(Messages.DotnetTestTab_search);
		classBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		classBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			searchForTestClass();
		}));

		methodLabel = new Label(container, SWT.NONE);
		methodLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		methodLabel.setText(Messages.DotnetTestTab_testMethod);

		methodText = new Text(container, SWT.BORDER);
		methodText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		methodText.setMessage(Messages.DotnetTestTab_allMethods);
		methodText.addModifyListener(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		});

		methodBrowseButton = new Button(container, SWT.NONE);
		methodBrowseButton.setText(Messages.DotnetTestTab_search);
		methodBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		methodBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			searchForTestMethods();
		}));

		Label configLabel = new Label(container, SWT.NONE);
		configLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		configLabel.setText(Messages.DotnetTestTab_configuration);

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
		debugRadio.setText(Messages.DotnetTestTab_debug);
		debugRadio.addListener(SWT.Selection, configRadioListener);

		releaseRadio = new Button(configComp, SWT.RADIO);
		releaseRadio.setText(Messages.DotnetTestTab_release);
		releaseRadio.addListener(SWT.Selection, configRadioListener);

		Label frameworkLabel = new Label(container, SWT.NONE);
		frameworkLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		frameworkLabel.setText(Messages.DotnetTestTab_framework);

		org.eclipse.swt.widgets.List list = new org.eclipse.swt.widgets.List(container, SWT.V_SCROLL | SWT.BORDER);
		GridData listBoxData = new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1);
		listBoxData.heightHint = 50;
		list.setLayoutData(listBoxData);

		new Label(container, SWT.NONE).setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 4, 1));

		buildCheckBoxButton = new Button(container, SWT.CHECK);
		buildCheckBoxButton.setSelection(true);
		buildCheckBoxButton.setText(Messages.DotnetTestTab_buildProject);
		buildCheckBoxButton.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 4, 1));
		buildCheckBoxButton.addSelectionListener(widgetSelectedAdapter(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		}));

		restoreCheckBoxButton = new Button(container, SWT.CHECK);
		restoreCheckBoxButton.setSelection(true);
		restoreCheckBoxButton.setText(Messages.DotnetTestTab_restoreProject);
		restoreCheckBoxButton.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 4, 1));
		restoreCheckBoxButton.addSelectionListener(widgetSelectedAdapter(e -> {
			setDirty(true);
			updateLaunchConfigurationDialog();
		}));

		list.setEnabled(false);
		frameworkViewer = new ListViewer(list);
		frameworkViewer.setContentProvider(new ArrayContentProvider());
		frameworkViewer.add(Messages.DotnetTestTab_noFrameworks);
	}

	@Override
	public void setDefaults(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, ""); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.TEST_SELECTION_TYPE, DotnetTestDelegate.ALL_TESTS);
		configuration.setAttribute(DotnetTestDelegate.TEST_FILTER, ""); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.TEST_CLASS, ""); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.TEST_METHOD, ""); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.CONFIGURATION, "Debug"); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.FRAMEWORK, ""); //$NON-NLS-1$
		configuration.setAttribute(DotnetTestDelegate.PROJECT_BUILD, true);
		configuration.setAttribute(DotnetTestDelegate.PROJECT_RESTORE, true);
	}

	@Override
	public void initializeFrom(ILaunchConfiguration configuration) {
		try {
			pathText.setText(configuration.getAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, "")); //$NON-NLS-1$
		} catch (CoreException ce) {
			pathText.setText(""); //$NON-NLS-1$
		}
		try {
			filterText.setText(configuration.getAttribute(DotnetTestDelegate.TEST_FILTER, "")); //$NON-NLS-1$
		} catch (CoreException ce) {
			filterText.setText(""); //$NON-NLS-1$
		}
		try {
			classText.setText(configuration.getAttribute(DotnetTestDelegate.TEST_CLASS, "")); //$NON-NLS-1$
		} catch (CoreException ce) {
			classText.setText(""); //$NON-NLS-1$
		}
		try {
			methodText.setText(configuration.getAttribute(DotnetTestDelegate.TEST_METHOD, "")); //$NON-NLS-1$
		} catch (CoreException ce) {
			methodText.setText(""); //$NON-NLS-1$
		}

		try {
			testType = configuration.getAttribute(DotnetTestDelegate.TEST_SELECTION_TYPE, DotnetTestDelegate.ALL_TESTS);
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
			projectConfig = configuration.getAttribute(DotnetTestDelegate.CONFIGURATION, "Debug"); //$NON-NLS-1$
		} catch (CoreException ce) {
			projectConfig = "Debug"; //$NON-NLS-1$
		} finally {
			if (projectConfig.equals("Debug")) { //$NON-NLS-1$
				debugRadio.setSelection(true);
				releaseRadio.setSelection(false);
			} else {
				releaseRadio.setSelection(true);
				debugRadio.setSelection(false);
			}
		}
		try {
			loadedSelectedTargetFramework = configuration.getAttribute(DotnetTestDelegate.FRAMEWORK, ""); //$NON-NLS-1$
		} catch (CoreException ce) {
			// no selection to load
		}
		try {
			buildCheckBoxButton.setSelection(configuration.getAttribute(DotnetTestDelegate.PROJECT_BUILD, true));
		} catch (CoreException ce) {
			buildCheckBoxButton.setSelection(true);
		}
		try {
			restoreCheckBoxButton.setSelection(configuration.getAttribute(DotnetTestDelegate.PROJECT_RESTORE, true));
		} catch (CoreException ce) {
			restoreCheckBoxButton.setSelection(true);
		}
	}

	@Override
	public void performApply(ILaunchConfigurationWorkingCopy configuration) {
		configuration.setAttribute(DebugPlugin.ATTR_WORKING_DIRECTORY, pathText.getText());
		configuration.setAttribute(DotnetTestDelegate.TEST_SELECTION_TYPE, testType);
		configuration.setAttribute(DotnetTestDelegate.TEST_FILTER, filterText.getText());
		configuration.setAttribute(DotnetTestDelegate.TEST_CLASS, classText.getText());
		configuration.setAttribute(DotnetTestDelegate.TEST_METHOD, methodText.getText());
		configuration.setAttribute(DotnetTestDelegate.CONFIGURATION, projectConfig);
		configuration.setAttribute(DotnetTestDelegate.FRAMEWORK, getTargetFramework());
		configuration.setAttribute(DotnetTestDelegate.PROJECT_BUILD, buildCheckBoxButton.getSelection());
		configuration.setAttribute(DotnetTestDelegate.PROJECT_RESTORE, restoreCheckBoxButton.getSelection());

		setDirty(false);
	}

	@Override
	public String getName() {
		return Messages.DotnetTestTab_name;
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
			Job.create(Messages.DotnetTestTab_retrieveClasses, (ICoreRunnable) monitor -> {
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
		dialog.setTitle(Messages.DotnetTestTab_classSelection_title);
		dialog.setMessage(Messages.DotnetTestTab_classSelection_message);
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
			Job.create(Messages.DotnetTestTab_retrieveClasses, (ICoreRunnable) monitor -> {
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
		dialog.setTitle(NLS.bind(Messages.DotnetTestTab_methodSelection_title, classText.getText()));
		dialog.setMessage(Messages.DotnetTestTab_methodSelection_message);
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
			frameworkViewer.add(Messages.DotnetTestTab_loadingFrameworks);
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

		frameworkViewer.add(Messages.DotnetTestTab_noFrameworks);
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
		} else if (!path.lastSegment().matches("(.*\\.csproj|project.json)")) { //$NON-NLS-1$
			return false;
		} else if (!path.toFile().isFile()) {
			return false;
		}
		return true;
	}

	public String getTargetFramework() {
		IStructuredSelection selection = (IStructuredSelection) frameworkViewer.getSelection();
		if (selection.isEmpty()) {
			return ""; //$NON-NLS-1$
		}
		return (String) selection.getFirstElement();
	}

}
