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

import static org.junit.Assert.assertFalse;

import org.eclipse.core.runtime.CoreException;
import org.junit.Test;

public class TestInvalidSelection extends AbstractExportWizardTest {
	@Override
	public void setup() throws CoreException {
		buildEmptyProject();
	}
	
	@Test
	public void testInvalidSelection() {
		openExportWizard();
		assertFalse("Should not be able to Finish an export without a selected Project.", 
				bot.button("Finish").isEnabled());
	}
	
	@Override
	public void tearDown() throws CoreException {
		bot.button("Cancel").click();
		super.tearDown();
	}
}
