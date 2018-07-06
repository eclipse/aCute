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
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({
	TestIDEIntegration.class,
	TestSyntaxHighlighting.class//,
	// This test is purposed with confirming that the language server is being connected.
	// It is disabled as the current method does not work on the Jenkins server. You are
	// still able to test it locally to confirm functionality
	//	TestLSPIntegration.class
})
public class AllTests {

}
