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

import org.eclipse.core.expressions.PropertyTester;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.Platform;

public class TestDotnetBuilderEnabled extends PropertyTester {

	private static final String IS_ENABLED = "isDotnetBuilderEnabled"; //$NON-NLS-1$

	@Override
	public boolean test(final Object receiver, final String property, final Object[] args, final Object expectedValue) {
		if (IS_ENABLED.equals(property)) {
			final IProject project = Platform.getAdapterManager().getAdapter(receiver, IProject.class);
			if (project != null) {
				return AddDotnetBuilder.hasBuilder(project);
			}
		}
		return false;
	}
}
