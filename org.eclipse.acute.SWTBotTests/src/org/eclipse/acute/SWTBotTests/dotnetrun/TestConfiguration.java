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

package org.eclipse.acute.SWTBotTests.dotnetrun;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.eclipse.acute.SWTBotTests.AbstractDotnetTest;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.debug.core.DebugPlugin;
import org.junit.Test;

public class TestConfiguration extends AbstractDotnetTest {
	private String name = "Test_config1";
	private String location = "test location";
	private String arguments = "test Arg";
	
	@Override
	public void setup() throws CoreException {
		super.setup();
		
		bot.menu("Run").menu("Run Configurations...").click();
		
		bot.shell("Run Configurations").activate();
		bot.tree().select(".NET Core Project");
		bot.toolbarButtonWithTooltip("New launch configuration").click();

		bot.textWithLabel("Name:").setText(name);
		bot.textWithLabel("Location:").setText(location);
		bot.textWithLabel("Arguments:").setText(arguments);
		
		bot.cTabItem(1).activate();
		bot.radio("Shared file:").click();
		bot.text(2).setText("/"+project.getName());		
		
		bot.button("Apply").click();
	}
	
	@Test
	public void testConfigInputs() throws FileNotFoundException, IOException {
		
		try(BufferedReader br = new BufferedReader(new FileReader(project.getLocation().toString() + "/" + name + ".launch"))) {
		    String line = br.readLine();
		    boolean isArgsPresent = false;
		    boolean isLocPresent = false;
		    boolean isBuildBoolPresent = false;

		    while (line != null) {
		    	if(line.equals("<stringAttribute key=\"PROJECT_ARGUMENTS\" value=\""+arguments+"\"/>")) {
		        	isArgsPresent = true;
		        }else if(line.equals("<booleanAttribute key=\"PROJECT_BUILD\" value=\"true\"/>")) {
		        	isBuildBoolPresent = true;
		        }else if(line.equals("<stringAttribute key=\"PROJECT_FOLDER\" value=\""+location+"\"/>")) {
		        	isLocPresent = true;
		        }
		        line = br.readLine();
		    }
		    assertTrue("Launch file does not include all .NET Core variables", isArgsPresent && isBuildBoolPresent && isLocPresent);
		}
		
		bot.button("Close").click();
	}
	
	@Override
	public void tearDown() throws CoreException {
		bot.menu("Run").menu("Run Configurations...").click();
		
		bot.shell("Run Configurations").activate();
		bot.tree().expandNode(".NET Core Project").select(name);
		
		bot.toolbarButtonWithTooltip("Delete selected launch configuration(s)").click();
		bot.shell("Confirm Launch Configuration Deletion").activate();
		bot.button("Yes").click();
		
		bot.shell("Run Configurations").activate();
		bot.button("Close").click();
		
		super.tearDown();
	}
}
