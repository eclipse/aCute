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
package org.eclipse.acute.SWTBotTests.dotnetexport;

import static org.junit.Assert.assertArrayEquals;

import java.io.File;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.junit.Test;

public class TestChangingProjectFile extends AbstractExportWizardTest {
	private IFile projectCSFile;
	private final String[] csprojFrameworks = new String[]{"netcoreapp1.0", "netcoreapp2.0" };
	private final String csProjFileName = "multipleFrameworks.csproj";
	
	@Override
	public void setup() throws CoreException {
		super.setup();
		openExportWizard();
		projectCSFile = this.project.getFile(csProjFileName);
		projectCSFile.create(getClass().getResourceAsStream(projectCSFile.getName()), true, new NullProgressMonitor());
	}
	
	@Test
	public void testChangingProjectFile() throws CoreException {
		File oldProjectFile = new File(bot.textWithLabel("Location:",0).getText());
		bot.textWithLabel("Location:").setText(oldProjectFile.getParent()+"/"+csProjFileName);
		assertArrayEquals("Frameworks list is not loaded corret", csprojFrameworks, bot.list().getItems());
	}
	
	@Override
	public void tearDown() throws CoreException {
		bot.button("Cancel").click();
		super.tearDown();
	}
}
