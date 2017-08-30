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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.eclipse.core.commands.AbstractHandler;
import org.eclipse.core.commands.ExecutionEvent;
import org.eclipse.core.commands.ExecutionException;
import org.eclipse.core.resources.ICommand;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.runtime.CoreException;

public class RemoveDotnetBuilder extends AbstractHandler {

	@Override
	public Object execute(final ExecutionEvent event) throws ExecutionException {
		final IProject project = AddDotnetBuilder.getProject(event);

		if (project != null) {
			try {
				final IProjectDescription description = project.getDescription();
				final List<ICommand> commands = new ArrayList<>();
				commands.addAll(Arrays.asList(description.getBuildSpec()));

				for (final ICommand buildSpec : description.getBuildSpec()) {
					if (IncrementalDotnetBuilder.BUILDER_ID.equals(buildSpec.getBuilderName())) {
						commands.remove(buildSpec);
					}
				}

				description.setBuildSpec(commands.toArray(new ICommand[commands.size()]));
				project.setDescription(description, null);
			} catch (final CoreException e) {
			}
		}

		return null;
	}
}
