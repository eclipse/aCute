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
package org.eclipse.acute.debug;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.attribute.PosixFilePermission;
import java.util.Collections;
import java.util.List;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.Path;

public class DebuggersRegistry {

	public static class DebuggerInfo {
		public final File debugger;
		public final List<String> args;

		private DebuggerInfo(File debugger, List<String> args) {
			this.debugger = debugger;
			this.args = args;
		}
	}

	public static DebuggerInfo getDefaultDebugger() {
		URL netcoredbgUrl = FileLocator.find(AcutePlugin.getDefault().getBundle(), new Path("netcoredbg")); //$NON-NLS-1$
		if (netcoredbgUrl != null) {
			try {
				netcoredbgUrl = FileLocator.toFileURL(netcoredbgUrl);
				File dbgDir = new File(netcoredbgUrl.toURI().normalize()).getAbsoluteFile();
				if (!dbgDir.canExecute() && dbgDir.canExecute()) {
					Files.setPosixFilePermissions(dbgDir.toPath(), Collections.singleton(PosixFilePermission.OWNER_EXECUTE));
				}
				return new DebuggerInfo(new File(dbgDir,"netcoredbg"), Collections.singletonList("--interpreter=vscode")); //$NON-NLS-1$ //$NON-NLS-2$
			} catch (IOException | URISyntaxException ex) {
				AcutePlugin.logError(ex);
			}
		}
		return new DebuggerInfo(new File("/home/mistria/apps/netcoredbg-linux-master/netcoredbg/netcoredbg"), Collections.singletonList("--interpreter=vscode")); //$NON-NLS-1$ //$NON-NLS-2$
	}

}
