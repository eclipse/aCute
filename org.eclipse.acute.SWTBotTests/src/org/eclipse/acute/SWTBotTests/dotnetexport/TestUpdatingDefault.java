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
package org.eclipse.acute.SWTBotTests.dotnetexport;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotText;
import org.junit.Test;

public class TestUpdatingDefault extends AbstractExportWizardTest {
	private IFile projectCSFile;
	
	@Override
	public void setup() throws CoreException {
		buildEmptyProject();
		IFile codeFile = this.project.getFile("Project.cs");
		codeFile.create(getClass().getResourceAsStream(codeFile.getName()), true, new NullProgressMonitor());
		projectCSFile = this.project.getFile("multipleFrameworks.csproj");
		projectCSFile.create(getClass().getResourceAsStream(projectCSFile.getName()), true, new NullProgressMonitor());
		openExportWizard();
	}
	
	@Test
	public void TestDefaultExportLocation() {
		final String frameworkString = "netcoreapp1.0";
		String expectedExportSubDirectory = "/bin/Release/"
				+ frameworkString + "/"+ getDefaultRuntime() + "/";
		
		bot.list().select(frameworkString);
		bot.checkBox("Self-Contained Deployment").click();
		bot.radio("Release").click();

		SWTBotText exportLocation = bot.textWithLabel("Location:", 2);
		
		assertTrue("Export location: " + exportLocation.getText() + 
				" does not match: .*" + expectedExportSubDirectory + " after field changes.",
				exportLocation.getText().matches(".*"+expectedExportSubDirectory));
	}
	
	@Override
	public void tearDown() throws CoreException {
		bot.button("Cancel").click();
		super.tearDown();
	}
	
	private String getDefaultRuntime() {
		String listCommand = "dotnet --info";

		Runtime runtime = Runtime.getRuntime();
		try {
			Process process = runtime.exec(listCommand);

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("^\\sRID:\\s+.*$")) {
						return inputLine.replaceFirst("^\\sRID:\\s+", "").replaceAll("\\s", "");
					}
				}
			}
		} catch (IOException e) {
			return "";
		}
		return "";
	}
}
