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
