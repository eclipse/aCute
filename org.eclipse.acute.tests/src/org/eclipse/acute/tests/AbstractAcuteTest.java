/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.tests;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.junit.After;
import org.junit.Before;

/**
 * Takes care of creating a temporary project and resource before test and to clean
 * it up after.
 */
public class AbstractAcuteTest {

	protected IProject project;
	protected IFile csharpSourceFile;

	@Before
	public void setUp() throws CoreException {
		this.project = ResourcesPlugin.getWorkspace().getRoot().getProject(getClass().getName() + System.currentTimeMillis());
		this.project.create(new NullProgressMonitor());
		this.project.open(new NullProgressMonitor());
		csharpSourceFile = this.project.getFile("test.cs");
		csharpSourceFile.create(getClass().getResourceAsStream("test.cs"), true, new NullProgressMonitor());
	}
	
	@After
	public void tearDown() throws CoreException {
		this.project.delete(true, new NullProgressMonitor());
	}
	
}
