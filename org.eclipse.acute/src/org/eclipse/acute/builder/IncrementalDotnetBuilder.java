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
package org.eclipse.acute.builder;

import java.util.Map;

import org.eclipse.core.resources.IMarker;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IncrementalProjectBuilder;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.ICoreRunnable;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.debug.core.DebugPlugin;

public class IncrementalDotnetBuilder extends IncrementalProjectBuilder {

	public static final String BUILDER_ID = "org.eclipse.acute.builder.IncrementalDotnetBuilder";

	private boolean isBuilding = false;
	private Process buildProcess;

	@Override
	protected IProject[] build(int kind, Map<String, String> args, IProgressMonitor monitor) throws CoreException {

		IProject project = getProject();
		IMarker[] errorMarkers = project.findMarkers(IMarker.PROBLEM, true, IResource.DEPTH_INFINITE);

		if (isBuilding && buildProcess != null) {
			buildProcess.destroyForcibly();
		}
		if (errorMarkers.length == 0) {
			Job.create("dotnet build", (ICoreRunnable) buildMonitor -> {
				try {
					String[] commandList = { "dotnet", "build" };
					isBuilding = true;
					buildProcess = DebugPlugin.exec(commandList,
							project.getRawLocation().makeAbsolute().toFile());
					buildProcess.waitFor();
					isBuilding = false;
					project.refreshLocal(IResource.DEPTH_INFINITE, null);
				} catch (InterruptedException | CoreException e) {
					return;
				}
			}).schedule();
		}
		return null;
	}
}
