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
			return isDotnetProject(resource.getProject());
		}
		return false;
	}

	private IResource toResource(Object o) {
		if (o instanceof IResource r) {
			return r;
		} else if (o instanceof IAdaptable a) {
			return a.getAdapter(IResource.class);
		} else {
			return null;
		}
	}

	public static boolean isDotnetProject(IProject p) {
		if (p == null || !p.isAccessible()) {
			return false;
		}
		try {
			for (IResource projItem : p.members()) {
				if (projItem.getName().matches("^.*\\.csproj$")) { //$NON-NLS-1$
					return true;
				}
			}
		} catch (CoreException e) {
		}
		return false;
	}
}
