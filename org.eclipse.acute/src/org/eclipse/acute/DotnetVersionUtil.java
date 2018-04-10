/*******************************************************************************
 * Copyright (c) 2018 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
		return !version.isEmpty() && version.matches("\\d+\\.\\d+\\.\\d+.*");
	}

	public static boolean isValidVersionNumber(String version) {
		return getMajorVersionNumber(version) >= MINIMUM_MAJOR_VERSION;
	}

	public static int getMajorVersionNumber(String version) {
		return Integer.parseInt(version.split("\\.")[0]);
	}

	public static String getVersion(String dotnetPath) {
		try {
			String[] command = new String[] { "/bin/bash", "-c", dotnetPath + " --version" };
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] { "cmd", "/c", "which dotnet" };
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
		return "";
	}
}
