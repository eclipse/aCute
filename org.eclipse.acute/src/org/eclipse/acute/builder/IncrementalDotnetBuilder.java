/*******************************************************************************
 * Copyright (c) 2017, 2018 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Lucas Bullen   (Red Hat Inc.) - Initial implementation
 *  Mickael Istria (Red Hat Inc.) - Avoid jobs, fixed schedulingrule, clean
 *******************************************************************************/
package org.eclipse.acute.builder;

import java.io.File;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IncrementalProjectBuilder;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.jobs.ISchedulingRule;
import org.eclipse.debug.core.DebugPlugin;

public class IncrementalDotnetBuilder extends IncrementalProjectBuilder {

	public static final String BUILDER_ID = "org.eclipse.acute.builder.IncrementalDotnetBuilder"; //$NON-NLS-1$

	private Process buildProcess;

	@Override
	protected IProject[] build(int kind, Map<String, String> args, IProgressMonitor monitor) throws CoreException {
		IProject project = getProject();
		IMarker[] errorMarkers = project.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_INFINITE);
		if (errorMarkers.length == 0) {
			runDotnetSubCommand("build", project, monitor); //$NON-NLS-1$
		}
		return null;
	}

	@Override protected void clean(IProgressMonitor monitor) throws CoreException {
		runDotnetSubCommand("clean", getProject(), monitor); //$NON-NLS-1$
	}

	private void runDotnetSubCommand(String dotnetSubCommand, IProject project, IProgressMonitor monitor) throws CoreException {
		if (buildProcess != null && buildProcess.isAlive()) {
			buildProcess.destroyForcibly();
		}

		File projectFolder = project.getLocation().toFile();
		if (!projectFolder.exists() || !projectFolder.isDirectory()) {
			return;
		}
		try {
			String[] commandList = { AcutePlugin.getDotnetCommand(), dotnetSubCommand };
			buildProcess = DebugPlugin.exec(commandList, projectFolder);
			boolean isProcessDone = false;
			while (!isProcessDone) {
				if (monitor.isCanceled()) {
					buildProcess.destroyForcibly();
				}
				isProcessDone = buildProcess.waitFor(100, TimeUnit.MILLISECONDS);
			}
			project.refreshLocal(IResource.DEPTH_INFINITE, null);
		} catch (InterruptedException e) {
			throw new CoreException(new Status(IStatus.ERROR, AcutePlugin.PLUGIN_ID, e.getMessage(), e));
		}
	}

	@Override public ISchedulingRule getRule(int kind, Map<String, String> args) {
		return null;
	}
}
