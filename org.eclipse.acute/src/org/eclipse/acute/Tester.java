/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/

package org.eclipse.acute;

import org.eclipse.core.expressions.PropertyTester;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IAdaptable;

public class Tester extends PropertyTester {
	private static final String PROPERTY_NAME = "isDotnetProject"; //$NON-NLS-1$
	@Override
	public boolean test(Object receiver, String property, Object[] args, Object expectedValue) {
		if (property.equals(PROPERTY_NAME)) {
			IResource resource = toResource(receiver);
			if (resource == null) {
				return false;
			}
			IProject project = resource.getProject();
			try {
				for (IResource projItem : project.members()) {
					if (projItem.getName().equals("project.json") || projItem.getName().matches("^.*\\.csproj$")) { //$NON-NLS-1$ //$NON-NLS-2$
						return true;
					}
				}
			} catch (CoreException e) {
				return false;
			}
		}
		return false;
	}

	private IResource toResource(Object o) {
		if (o instanceof IResource) {
			return (IResource) o;
		} else if (o instanceof IAdaptable) {
			return ((IAdaptable) o).getAdapter(IResource.class);
		} else {
			return null;
		}
	}
}
