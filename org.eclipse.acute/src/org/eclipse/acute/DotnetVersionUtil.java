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
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.core.runtime.Platform;

public class DotnetVersionUtil {

	public static final int MINIMUM_MAJOR_VERSION = 2;

	public static boolean isValidVersionFormat(String version) {
		return !version.isEmpty() && version.matches("\\d+\\.\\d+\\.\\d+.*"); //$NON-NLS-1$
	}

	public static boolean isValidVersionNumber(String version) {
		return getMajorVersionNumber(version) >= MINIMUM_MAJOR_VERSION;
	}

	public static int getMajorVersionNumber(String version) {
		return Integer.parseInt(version.split("\\.")[0]); //$NON-NLS-1$
	}

	public static String getVersion(String dotnetPath) {
		try {
			String[] command = new String[] { dotnetPath + " --version" }; //$NON-NLS-1$
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] { "cmd", "/c", "\"" + dotnetPath + "\" --version" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
			}
			ProcessBuilder builder = new ProcessBuilder(command);
			Process process = builder.start();

			if (process.waitFor() == 0) {
				try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
					return in.readLine();
				}
			}
		} catch (IOException | InterruptedException e) {
			// Error will be caught with empty response
		}
		return ""; //$NON-NLS-1$
	}
}
