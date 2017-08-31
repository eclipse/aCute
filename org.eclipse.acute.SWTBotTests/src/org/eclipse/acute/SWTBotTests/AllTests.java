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
package org.eclipse.acute.SWTBotTests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;
import org.eclipse.acute.SWTBotTests.dotnetnew.AllNewTests;
import org.eclipse.acute.SWTBotTests.dotnetrun.AllRunTests;
import org.eclipse.acute.SWTBotTests.dotnettest.AllTestTests;
import org.eclipse.acute.SWTBotTests.dotnetexport.AllExportTests;

@RunWith(Suite.class)
@SuiteClasses({
	AllNewTests.class,
	AllRunTests.class,
	AllExportTests.class,
	AllExportTests.class
})
public class AllTests {

}