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
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.dotnetexport;

import static org.eclipse.swt.events.SelectionListener.widgetSelectedAdapter;

import java.io.File;
import java.net.URL;

import org.eclipse.acute.Messages;
import org.eclipse.acute.ProjectFileAccessor;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.runtime.Path;
import org.eclipse.jface.fieldassist.ControlDecoration;
import org.eclipse.jface.fieldassist.FieldDecorationRegistry;
import org.eclipse.jface.resource.ImageDescriptor;
import org.eclipse.jface.viewers.ArrayContentProvider;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.ListViewer;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.layout.RowLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.List;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Text;
import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;

public class DotnetExportWizardPage extends WizardPage {
	private Path projectPath;
	private boolean isSCD = false;
	private String runtime;
	private boolean isExportLocDefault = true;
	private File exportLocation;
	private String configuration = "Debug"; //$NON-NLS-1$
	private String version = ""; //$NON-NLS-1$

	private Object[] targetFrameworks;
	private String defaultRuntime;

	private ControlDecoration projectLocationControlDecoration;
	private ListViewer frameworkViewer;
	private ControlDecoration frameworkControlDecoration;
	private Text runtimeText;
	private Label runtimeLabel;
	private ControlDecoration runtimeControlDecoration;
	private Button exportBrowseButton;
	private Label exportLocationLabel;
	private Text exportLocationText;
	private ControlDecoration exportLocationControlDecoration;
	private ControlDecoration configControlDecoration;

	public boolean isSCD() {
		return isSCD;
	}

	public String getRuntime() {
		return runtime;
	}

	public File getExportLocation() {
		return exportLocation;
	}

	public String getConfiguration() {
		return configuration;
	}

	public String getTargetFramework() {
		IStructuredSelection selection = (IStructuredSelection) frameworkViewer.getSelection();
		if (selection.isEmpty()) {
			return ""; //$NON-NLS-1$
		}
		return (String) selection.getFirstElement();
	}

	public String getVersion() {
		return version;
	}

	public Path getProjectFilePath() {
		return projectPath;
	}

	protected DotnetExportWizardPage(IFile projectFile) {
		super(DotnetExportWizardPage.class.getName());
		setTitle(Messages.DotnetExportWizardPage_exportProject_title);
		setDescription(Messages.DotnetExportWizardPage_exportProject_message);

		Bundle bundle = FrameworkUtil.getBundle(this.getClass());
		URL url = bundle.getEntry("images/dotnet.png"); //$NON-NLS-1$
		ImageDescriptor imageDescriptor = ImageDescriptor.createFromURL(url);
		setImageDescriptor(imageDescriptor);

		if (projectFile != null) {
			projectPath = new Path(projectFile.getRawLocation().toString());
		}
		targetFrameworks = ProjectFileAccessor.getTargetFrameworks(projectPath);
		defaultRuntime = DotnetExportAccessor.getDefaultRuntime();
	}

	@Override
	public void createControl(Composite parent) {
		Image errorImage = FieldDecorationRegistry.getDefault().getFieldDecoration(FieldDecorationRegistry.DEC_ERROR)
				.getImage();

		Composite container = new Composite(parent, SWT.NULL);
		setControl(container);
		container.setLayout(new GridLayout(3, false));

		Label projectLabel = new Label(container, SWT.NONE);
		projectLabel.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 3, 1));
		projectLabel.setText(Messages.DotnetExportWizardPage_projectFile);

		Label projectLocationLabel = new Label(container, SWT.NONE);
		projectLocationLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		projectLocationLabel.setText(Messages.DotnetExportWizardPage_location);
		Text projectLocationText = new Text(container, SWT.BORDER);
		projectLocationText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 1, 1));
		projectLocationText.addModifyListener(e -> updateProjectPath(projectLocationText.getText()));
		projectLocationControlDecoration = new ControlDecoration(projectLocationText, SWT.TOP | SWT.LEFT);
		projectLocationControlDecoration.setImage(errorImage);

		Button projectBrowseButton = new Button(container, SWT.NONE);
		projectBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		projectBrowseButton.setText(Messages.DotnetExportWizardPage_browse);
		projectBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			FileDialog dialog = new FileDialog(Display.getDefault().getActiveShell());
			String path = dialog.open();
			if (path != null) {
				projectLocationText.setText(path);
			}
		}));

		Label frameworkLabel = new Label(container, SWT.NONE);
		frameworkLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		frameworkLabel.setText(Messages.DotnetExportWizardPage_framework);

		List list = new List(container, SWT.V_SCROLL | SWT.BORDER);
		GridData listBoxData = new GridData(SWT.FILL, SWT.CENTER, true, false, 1, 1);
		listBoxData.heightHint = 50;
		list.setLayoutData(listBoxData);
		list.setEnabled(false);
		frameworkViewer = new ListViewer(list);
		frameworkViewer.setContentProvider(new ArrayContentProvider());
		frameworkViewer.add(Messages.DotnetExportWizardPage_noFrameworksAvailable);
		frameworkControlDecoration = new ControlDecoration(frameworkViewer.getControl(), SWT.TOP | SWT.LEFT);
		frameworkControlDecoration.setImage(errorImage);
		frameworkViewer.addSelectionChangedListener(e -> {
			setLocationIfDefault();
			setPageComplete(isPageComplete());
		});

		Button scdCheck = new Button(container, SWT.CHECK);
		scdCheck.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, true, false, 3, 1));
		scdCheck.setText(Messages.DotnetExportWizardPage_selfContainedDeployment);
		scdCheck.addSelectionListener(widgetSelectedAdapter(e -> {
			updateDeployment(((Button) e.widget).getSelection());
			setPageComplete(isPageComplete());
		}));

		runtimeLabel = new Label(container, SWT.NONE);
		runtimeLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false));
		runtimeLabel.setText(Messages.DotnetExportWizardPage_runtime);

		runtimeText = new Text(container, SWT.NONE);
		runtimeText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 2, 1));
		runtimeText.setEnabled(false);
		runtimeText.addModifyListener(e -> {
			runtime = runtimeText.getText();
			setLocationIfDefault();
			setPageComplete(isPageComplete());
		});
		runtimeControlDecoration = new ControlDecoration(runtimeText, SWT.TOP | SWT.LEFT);
		runtimeControlDecoration.setImage(errorImage);

		new Label(container, SWT.NONE).setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 3, 1));

		Button defaultLocationCheckbox = new Button(container, SWT.CHECK);
		defaultLocationCheckbox.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, true, false, 3, 1));
		defaultLocationCheckbox.setText(Messages.DotnetExportWizardPage_useDefaultExportLocation);
		defaultLocationCheckbox.setSelection(true);
		defaultLocationCheckbox.addSelectionListener(widgetSelectedAdapter(e ->
			updateDefaultLocationState(((Button) e.widget).getSelection())
		));

		exportLocationLabel = new Label(container, SWT.NONE);
		exportLocationLabel.setLayoutData(new GridData(SWT.RIGHT, SWT.CENTER, false, false, 1, 1));
		exportLocationLabel.setText(Messages.DotnetExportWizardPage_location);
		exportLocationText = new Text(container, SWT.BORDER);
		exportLocationText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false, 1, 1));
		exportLocationText.addModifyListener(e -> {
			exportLocation = new File(exportLocationText.getText());
			setPageComplete(isPageComplete());
		});
		exportLocationControlDecoration = new ControlDecoration(exportLocationText, SWT.TOP | SWT.LEFT);
		exportLocationControlDecoration.setImage(errorImage);

		exportBrowseButton = new Button(container, SWT.NONE);
		exportBrowseButton.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		exportBrowseButton.setText(Messages.DotnetExportWizardPage_browse);
		exportBrowseButton.addSelectionListener(widgetSelectedAdapter(e -> {
			DirectoryDialog dialog = new DirectoryDialog(exportBrowseButton.getShell());
			String path = dialog.open();
			if (path != null) {
				exportLocation = new File(path);
				exportLocationText.setText(exportLocation.toString());
				setPageComplete(isPageComplete());
			}
		}));

		Label configLabel = new Label(container, SWT.NONE);
		configLabel.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 2, 1));
		configLabel.setText(Messages.DotnetExportWizardPage_configuration);

		Label versionLabel = new Label(container, SWT.NONE);
		versionLabel.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 1, 1));
		versionLabel.setText(Messages.DotnetExportWizardPage_versionSuffix);

		Composite configComp = new Composite(container, SWT.NULL);
		configComp.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, true, false, 2, 1));
		configComp.setLayout(new RowLayout());

		Listener configRadioListener = e -> {
			configuration = ((Button) e.widget).getText();
			setLocationIfDefault();
		};

		Button debugRadio = new Button(configComp, SWT.RADIO);
		debugRadio.setText(Messages.DotnetExportWizardPage_debug);
		debugRadio.setSelection(true);
		debugRadio.addListener(SWT.Selection, configRadioListener);

		Button releaseRadio = new Button(configComp, SWT.RADIO);
		releaseRadio.setText(Messages.DotnetExportWizardPage_release);
		releaseRadio.addListener(SWT.Selection, configRadioListener);

		Text versionText = new Text(container, SWT.BORDER);
		versionText.setText(version);
		versionText.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false, 1, 1));
		versionText.addModifyListener(e -> {
			version = versionText.getText();
			setPageComplete(isPageComplete());
		});
		configControlDecoration = new ControlDecoration(versionText, SWT.TOP | SWT.LEFT);
		configControlDecoration.setImage(errorImage);
		configControlDecoration.setShowOnlyOnFocus(true);

		if (projectPath != null) {
			projectLocationText.setText(projectPath.toString());
		}
		updateDeployment(false);
		updateDefaultLocationState(true);
	}

	private void updateProjectPath(String location) {
		projectPath = new Path(location);
		frameworkViewer.getList().removeAll();
		if (isProjectFile(projectPath)) {
			frameworkViewer.getList().deselectAll();
			frameworkViewer.add(Messages.DotnetExportWizardPage_loadingFrameworks);
			frameworkViewer.getList().setEnabled(false);
			targetFrameworks = ProjectFileAccessor.getTargetFrameworks(projectPath);
			frameworkViewer.getList().removeAll();
			if (targetFrameworks.length > 0) {
				frameworkViewer.add(targetFrameworks);
				frameworkViewer.getList().select(0);
				frameworkViewer.getList().setEnabled(true);
			} else {
				frameworkViewer.add(Messages.DotnetExportWizardPage_noFrameworksAvailable);
				frameworkViewer.getList().setEnabled(false);
			}
		} else {
			frameworkViewer.add(Messages.DotnetExportWizardPage_noFrameworksAvailable);
			frameworkViewer.getList().setEnabled(false);
		}
		setPageComplete(isPageComplete());
		setLocationIfDefault();
	}

	private void updateDeployment(boolean isSCD) {
		this.isSCD = isSCD;
		if (isSCD) {
			runtimeLabel.setEnabled(true);
			runtimeText.setEnabled(true);
		} else {
			runtimeLabel.setEnabled(false);
			runtimeText.setEnabled(false);

			runtime = defaultRuntime;
			runtimeText.setText(runtime);
		}

		setLocationIfDefault();
	}

	private void updateDefaultLocationState(Boolean isDefault) {
		isExportLocDefault = isDefault;
		if (isExportLocDefault) {
			exportLocationLabel.setEnabled(false);
			exportLocationText.setEnabled(false);
			exportBrowseButton.setEnabled(false);
		} else {
			exportLocationLabel.setEnabled(true);
			exportLocationText.setEnabled(true);
			exportBrowseButton.setEnabled(true);
		}
		setLocationIfDefault();
	}

	private void setLocationIfDefault() {
		if (!isExportLocDefault) {
			return;
		}

		String locationString = ""; //$NON-NLS-1$
		if (isProjectFile(projectPath)) {
			locationString = projectPath.toFile().getParent() + "/bin/" + configuration + "/" //$NON-NLS-1$ //$NON-NLS-2$
					+ getTargetFramework() + "/"; //$NON-NLS-1$
			if (isSCD) {
				locationString += runtime + "/"; //$NON-NLS-1$
			}
		}

		exportLocation = new File(locationString);
		exportLocationText.setText(locationString);
	}

	private boolean isProjectFile(Path path) {
		if (path == null || path.isEmpty()) {
			return false;
		} else if (!path.lastSegment().matches("(.*\\.csproj)")) { //$NON-NLS-1$
			return false;
		} else if (!path.toFile().isFile()) {
			return false;
		}
		return true;
	}

	@Override
	public boolean isPageComplete() {
		String runtimeError = ""; //$NON-NLS-1$
		String exportLocationError = ""; //$NON-NLS-1$
		String projectLocationError = ""; //$NON-NLS-1$
		String configError = ""; //$NON-NLS-1$
		String frameworkError = ""; //$NON-NLS-1$

		if (projectPath == null || projectPath.isEmpty()) {
			projectLocationError = Messages.DotnetExportWizardPage_pathError_empty;
		} else if (projectPath.toFile().isDirectory()) {
			projectLocationError = Messages.DotnetExportWizardPage_pathError_isDirectory;
		} else if (!projectPath.lastSegment().matches("(.*\\.csproj)")) { //$NON-NLS-1$
			projectLocationError = Messages.DotnetExportWizardPage_pathError_notProjectFile;
		} else if (!projectPath.toFile().isFile()) {
			projectLocationError = Messages.DotnetExportWizardPage_pathError_doesNotExist;
		} else if (getTargetFramework().isEmpty()) {
			frameworkError = Messages.DotnetExportWizardPage_frameworkError_empty;
		} else if (isSCD && (runtime == null || runtime.isEmpty())) {
			runtimeError = Messages.DotnetExportWizardPage_runtimeError_empty;
		} else if (!version.matches("\\w*")) { //$NON-NLS-1$
			configError = Messages.DotnetExportWizardPage_versionError_invalidSuffix;
		} else if (exportLocation == null || exportLocation.getPath().isEmpty()) {
			exportLocationError = Messages.DotnetExportWizardPage_exportLocationError_empty;
		} else if (exportLocation.isFile()) {
			exportLocationError = Messages.DotnetExportWizardPage_exportLocationError_existingFile;
		} else {
			File existingParent = exportLocation.getParentFile();
			while (existingParent != null && !existingParent.exists() && !existingParent.getPath().isEmpty()) {
				existingParent = existingParent.getParentFile();
			}
			if (existingParent == null || (!exportLocation.exists() && !existingParent.canWrite())) {
				exportLocationError = Messages.DotnetExportWizardPage_exportLocationError_unableToCreate;
			} else if (exportLocation.exists() && !exportLocation.canWrite()) {
				exportLocationError = Messages.DotnetExportWizardPage_exportLocationError_unableToWrite;
			}
		}

		String error = runtimeError + exportLocationError + configError + projectLocationError + frameworkError;

		projectLocationControlDecoration.hide();
		exportLocationControlDecoration.hide();
		runtimeControlDecoration.hide();
		configControlDecoration.hide();
		frameworkControlDecoration.hide();

		if (error.isEmpty()) {
			setErrorMessage(null);
		} else {
			setErrorMessage(error);
			if (!runtimeError.isEmpty()) {
				runtimeControlDecoration.show();
			} else if (!exportLocationError.isEmpty()) {
				exportLocationControlDecoration.show();
			} else if (!projectLocationError.isEmpty()) {
				projectLocationControlDecoration.show();
			} else if (!frameworkError.isEmpty()) {
				frameworkControlDecoration.show();
			} else {
				configControlDecoration.show();
			}
		}
		return error.isEmpty();
	}
}
