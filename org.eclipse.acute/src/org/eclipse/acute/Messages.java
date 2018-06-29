/*******************************************************************************
 * Copyright (c) 2018 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Lucas Bullen   (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import org.eclipse.osgi.util.NLS;

public class Messages extends NLS {
	private static final String BUNDLE_NAME = Messages.class.getPackage().getName() + ".messages"; //$NON-NLS-1$

	public static String dotnetNoPathError_title;
	public static String dotnetNoPathError_message;

	public static String dotnetInvalidPathError_title;
	public static String dotnetInvalidPathError_message;
	public static String dotnetInvalidVersionError_title;
	public static String dotnetInvalidVersionError_message;

	public static String acutePlugin_cancel;
	public static String acutePlugin_openPreferences;

	public static String preferences_EmptyPathError;
	public static String preferences_InvalidPathError;
	public static String preferences_NonexecutablePathError;
	public static String preferences_DotnetPathInfo;
	public static String preferences_CommandVersion;
	public static String preferences_BrowseButton;

	public static String omnisharpStreamConnection_dotnetRestoreError;
	public static String omnisharpStreamConnection_omnisharpNotFoundError;
	public static String omnisharpStreamConnection_serverNotFoundError;
	public static String omnisharpStreamConnection_serverNotExecutableError;

	public static String DotnetExportWizard_dotnetCoreExport;
	public static String DotnetExportWizard_dotnetRestore;
	public static String DotnetExportWizard_exportError_message;
	public static String DotnetExportWizard_exportError_title;
	public static String DotnetExportWizard_exportProject;

	public static String DotnetExportWizardPage_browse;
	public static String DotnetExportWizardPage_configuration;
	public static String DotnetExportWizardPage_debug;
	public static String DotnetExportWizardPage_exportLocationError_empty;
	public static String DotnetExportWizardPage_exportLocationError_existingFile;
	public static String DotnetExportWizardPage_exportLocationError_unableToCreate;
	public static String DotnetExportWizardPage_exportLocationError_unableToWrite;
	public static String DotnetExportWizardPage_exportProject_message;
	public static String DotnetExportWizardPage_exportProject_title;
	public static String DotnetExportWizardPage_framework;
	public static String DotnetExportWizardPage_frameworkError_empty;
	public static String DotnetExportWizardPage_loadingFrameworks;
	public static String DotnetExportWizardPage_location;
	public static String DotnetExportWizardPage_noFrameworksAvailable;
	public static String DotnetExportWizardPage_pathError_doesNotExist;
	public static String DotnetExportWizardPage_pathError_empty;
	public static String DotnetExportWizardPage_pathError_isDirectory;
	public static String DotnetExportWizardPage_pathError_notProjectFile;
	public static String DotnetExportWizardPage_projectFile;
	public static String DotnetExportWizardPage_release;
	public static String DotnetExportWizardPage_runtime;
	public static String DotnetExportWizardPage_runtimeError_empty;
	public static String DotnetExportWizardPage_selfContainedDeployment;
	public static String DotnetExportWizardPage_useDefaultExportLocation;
	public static String DotnetExportWizardPage_versionError_invalidSuffix;
	public static String DotnetExportWizardPage_versionSuffix;

	public static String DotnetNewWizard_createProject;
	public static String DotnetNewWizard_createTemplateError_title;
	public static String DotnetNewWizard_createTemplateError_message;
	public static String DotnetNewWizard_createTemplateErrorExitValue_message;
	public static String DotnetNewWizard_newProject;
	public static String DotnetNewWizard_openProjectError;
	public static String DotnetNewWizard_projectDescriptionLoadingError;

	public static String DotnetNewWizardPage_browse;
	public static String DotnetNewWizardPage_createProject_message;
	public static String DotnetNewWizardPage_createProject_title;
	public static String DotnetNewWizardPage_directroyError_empty;
	public static String DotnetNewWizardPage_dotnetError;
	public static String DotnetNewWizardPage_dotnetPreferencesLink;
	public static String DotnetNewWizardPage_linkNames;
	public static String DotnetNewWizardPage_loadingTemplates;
	public static String DotnetNewWizardPage_location;
	public static String DotnetNewWizardPage_locationError_existingFile;
	public static String DotnetNewWizardPage_locationError_unableToCreate;
	public static String DotnetNewWizardPage_locationError_unableToWrite;
	public static String DotnetNewWizardPage_noTemplatesError;
	public static String DotnetNewWizardPage_projectError_empty;
	public static String DotnetNewWizardPage_projectError_existingName;
	public static String DotnetNewWizardPage_projectError_invalidDotProjectFile;
	public static String DotnetNewWizardPage_projectError_invalidName;
	public static String DotnetNewWizardPage_projectError_invalidNameMatch;
	public static String DotnetNewWizardPage_projectName;
	public static String DotnetNewWizardPage_projectTemplate;
	public static String DotnetNewWizardPage_retriveTemplates;
	public static String DotnetNewWizardPage_templateError_empty;

	public static String DotnetPreferencePage_dotnetSettings;

	public static String DotnetRunDelegate_configuration;
	public static String DotnetRunDelegate_exceptionInLaunch;
	public static String DotnetRunDelegate_launchError_message;
	public static String DotnetRunDelegate_launchError_message_findBinaryFile;
	public static String DotnetRunDelegate_launchError_message_readInputFile;
	public static String DotnetRunDelegate_launchError_message_retrieveTargetFile;
	public static String DotnetRunDelegate_launchError_title;

	public static String dotnetRunTab_loadingFrameworks;
	public static String DotnetRunTab_arguments;
	public static String DotnetRunTab_browse;
	public static String DotnetRunTab_buildProject;
	public static String DotnetRunTab_debug;
	public static String DotnetRunTab_framework;
	public static String DotnetRunTab_location;
	public static String DotnetRunTab_name;
	public static String DotnetRunTab_noFrameworks;
	public static String DotnetRunTab_projectFolder;
	public static String DotnetRunTab_release;

	public static String DotnetTestAccessor_listTests;

	public static String DotnetTestDelegate_configuration;
	public static String DotnetTestDelegate_runTestError_message_badLocation;
	public static String DotnetTestDelegate_runTestError_message_badSelection;
	public static String DotnetTestDelegate_runTestError_title;

	public static String DotnetTestTab_allMethods;
	public static String DotnetTestTab_browse;
	public static String DotnetTestTab_buildProject;
	public static String DotnetTestTab_classSelection_message;
	public static String DotnetTestTab_classSelection_title;
	public static String DotnetTestTab_configuration;
	public static String DotnetTestTab_debug;
	public static String DotnetTestTab_framework;
	public static String DotnetTestTab_loadingFrameworks;
	public static String DotnetTestTab_methodSelection_message;
	public static String DotnetTestTab_methodSelection_title;
	public static String DotnetTestTab_name;
	public static String DotnetTestTab_noFrameworks;
	public static String DotnetTestTab_project;
	public static String DotnetTestTab_release;
	public static String DotnetTestTab_restoreProject;
	public static String DotnetTestTab_retrieveClasses;
	public static String DotnetTestTab_runAll;
	public static String DotnetTestTab_runMatching;
	public static String DotnetTestTab_runSingle;
	public static String DotnetTestTab_search;
	public static String DotnetTestTab_testClass;
	public static String DotnetTestTab_testFilter;
	public static String DotnetTestTab_testMethod;

	static {
		NLS.initializeMessages(BUNDLE_NAME, Messages.class);
	}
}
