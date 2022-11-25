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

import org.eclipse.acute.AcutePlugin;
import org.eclipse.acute.Messages;
import org.eclipse.acute.ProjectFileAccessor;
import org.eclipse.acute.debug.DebuggersRegistry.DebuggerInfo;
import org.eclipse.acute.dotnetrun.DotnetRunDelegate;
import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.jobs.IJobChangeEvent;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.core.runtime.jobs.JobChangeAdapter;
import org.eclipse.debug.core.DebugPlugin;
import org.eclipse.debug.core.ILaunch;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.lsp4e.debug.DSPPlugin;
import org.eclipse.lsp4e.debug.launcher.DSPLaunchDelegate;
import org.eclipse.swt.widgets.Display;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class DotnetDebugLaunchDelegate extends DSPLaunchDelegate {

	static final String ID = "org.eclipse.acute.debug.launchType"; //$NON-NLS-1$

	@Override public void launch(ILaunchConfiguration configuration, String mode, ILaunch launch, IProgressMonitor monitor) throws CoreException {
		IContainer container = getContainer(configuration);
		if (container == null) {
			Display.getDefault().asyncExec(() ->
				MessageDialog.openError(Display.getDefault().getActiveShell(), Messages.DotnetDebugLaunchDelegate_noFolderSelected_title, Messages.DotnetDebugLaunchDelegate_noFolderSelected_message)
			);
			return;
		}
		ILaunchConfigurationWorkingCopy wc = configuration.getWorkingCopy();
		wc.setAttribute(DSPPlugin.ATTR_DSP_PARAM, DotnetDebugLaunchDelegate.createDebugParam(container, configuration.getAttribute(DotnetRunDelegate.PROJECT_ARGUMENTS, ""))); //$NON-NLS-1$;
		wc.setAttribute(DSPPlugin.ATTR_DSP_MODE, DSPPlugin.DSP_MODE_LAUNCH);
		wc.setAttribute(DSPPlugin.ATTR_DSP_MONITOR_DEBUG_ADAPTER, false);
		if (wc.getAttribute(DebuggerTab.ATTR_DEFAULT_DEBUGGER, true)) {
			DebuggerInfo debuggerInfo = DebuggersRegistry.getDefaultDebugger();
			wc.setAttribute(DSPPlugin.ATTR_DSP_CMD, debuggerInfo.debugger.getAbsolutePath());
			wc.setAttribute(DSPPlugin.ATTR_DSP_ARGS, debuggerInfo.args);
		}
		wc.setAttribute(DotnetRunDelegate.PROJECT_CONFIGURATION, "Debug"); //$NON-NLS-1$
		final ILaunchConfiguration config = wc.doSave();
		for (IMarker marker : container.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_INFINITE)) {
			if (marker.getAttribute(IMarker.SEVERITY, -1) == IMarker.SEVERITY_ERROR) {
				Display.getDefault().asyncExec(() ->
					MessageDialog.openError(Display.getDefault().getActiveShell(), Messages.DotnetDebugLaunchDelegate_errorsOnProject_title, Messages.DotnetDebugLaunchDelegate_errorsOnProject_message)
				);
				return;
			}
		}
		if (projectNeedsRebuild()) {
			// TODO: attaching build process currently cause issue of the debugtarget not being attached
			// as launch is assumed terminated too early.
			// So make it a job.
			// TODO factorize with DotnetRunDelegate
			Job buildJob = Job.create("dotnet build > " + container.getFullPath(), mon -> { //$NON-NLS-1$
				String[] cmdLine = new String[] { AcutePlugin.getDotnetCommand(), "build" }; //$NON-NLS-1$
				Process restoreProcess;
				try {
					restoreProcess = DebugPlugin.exec(cmdLine, container.getLocation().toFile());
				} catch (CoreException e1) {
					return new Status(IStatus.ERROR, AcutePlugin.PLUGIN_ID, "", e1); //$NON-NLS-1$
				}
				try {
					restoreProcess.waitFor();
				} catch (InterruptedException e) {
				}
				if (restoreProcess.exitValue() != 0) { // errors will be shown in console
					return new Status(IStatus.ERROR, AcutePlugin.PLUGIN_ID, ""); //$NON-NLS-1$
				} else {
					return Status.OK_STATUS;
				}
			});
			buildJob.addJobChangeListener(new JobChangeAdapter() {
				@Override public void done(IJobChangeEvent event) {
					try {
						if (event.getResult().isOK()) {
							DotnetDebugLaunchDelegate.super.launch(config, mode, launch, monitor);
						} else {
							launch.terminate();
						}
					} catch (Exception ex) {
						AcutePlugin.logError(ex);
					}
					super.done(event);
				}
			});
			buildJob.schedule();
		} else {
			super.launch(config, mode, launch, monitor);
		}
	}

	private boolean projectNeedsRebuild() {
		// TODO Possible criteria
		// * whether the dll exists in expected folder
		// * last mod date of dll vs folder content
		return true;
	}

	private IContainer getContainer(ILaunchConfiguration configuration) throws CoreException {
		String projectPath = configuration.getAttribute(DotnetRunDelegate.PROJECT_FOLDER, ""); //$NON-NLS-1$
		if (projectPath == null) {
			return null;
		}
		IPath location = new Path(projectPath);
		if (location.toFile().isDirectory()) {
			return ResourcesPlugin.getWorkspace().getRoot().getContainerForLocation(location);
		} else if (location.segmentCount() == 1) {
			return ResourcesPlugin.getWorkspace().getRoot().getProject(location.segments()[0]);
		} else {
			return ResourcesPlugin.getWorkspace().getRoot().getFolder(location);
		}
	}

	static File getProgram(IContainer project) {
		IPath projectFile = ProjectFileAccessor.getProjectFile(project);
		String projectConfiguration = "Debug"; //$NON-NLS-1$
		String[] frameworks = ProjectFileAccessor.getTargetFrameworks(project.getWorkspace().getRoot().getFile(projectFile).getLocation());
		if (frameworks.length > 0) {
			return new File(project.getLocation().toFile().getAbsolutePath() + "/bin/" + projectConfiguration + "/" + frameworks[0] + "/" //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
					+ projectFile.removeFileExtension().addFileExtension("dll").lastSegment()); //$NON-NLS-1$
		}
		return null;
	}

	static String createDebugParam(IContainer project, String programArgs) {
		JsonObject conf = new JsonObject();
		conf.addProperty("request", "launch"); //$NON-NLS-1$ //$NON-NLS-2$
		File program = DotnetDebugLaunchDelegate.getProgram(project);
		conf.addProperty("program", program.getAbsolutePath()); //$NON-NLS-1$
		if (programArgs != null && !programArgs.trim().isEmpty()) {
			JsonArray args = new JsonArray();
			for (String arg : programArgs.split("\\s+")) { //$NON-NLS-1$
				args.add(arg); // consider better strategies for parsing, as this ignores quotes and escapes
			}
			conf.add("args", args); //$NON-NLS-1$
		}
		return new Gson().toJson(conf);
	}

}
