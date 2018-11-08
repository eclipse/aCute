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
package org.eclipse.acute;

import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.Adapters;
import org.eclipse.core.runtime.IAdapterFactory;
import org.eclipse.debug.ui.actions.ILaunchable;

public class LaunchableAdapterFactory implements IAdapterFactory {

	private static final ILaunchable DUMMY = new ILaunchable() {
	};

	@Override public <T> T getAdapter(Object adaptableObject, Class<T> adapterType) {
		IResource resource = Adapters.adapt(adaptableObject, IResource.class);
		if (adapterType.equals(ILaunchable.class) && Tester.isDotnetProject(resource.getProject())) {
			return adapterType.cast(DUMMY);
		}
		return null;
	}

	@Override public Class<?>[] getAdapterList() {
		return new Class<?>[] { ILaunchable.class };
	}

}
