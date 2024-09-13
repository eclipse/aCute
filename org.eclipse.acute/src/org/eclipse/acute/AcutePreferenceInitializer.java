/*******************************************************************************
 * Copyright (c) 2017, 2024 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Lucas Bullen   (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.core.runtime.Platform;
import org.eclipse.core.runtime.preferences.AbstractPreferenceInitializer;
import org.eclipse.jface.preference.IPreferenceStore;

public class AcutePreferenceInitializer extends AbstractPreferenceInitializer {

	public static final String EXPLICIT_DOTNET_PATH = "dotnet.explicitPath"; //$NON-NLS-1$

	@Override
	public void initializeDefaultPreferences() {
		IPreferenceStore store = AcutePlugin.getDefault().getPreferenceStore();

		store.setDefault(EXPLICIT_DOTNET_PATH, getBestDotnetPathGuess());
	}

	private String getBestDotnetPathGuess() {
		try {
			String[] command = { "/bin/bash", "-c", "which dotnet" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] { "cmd", "/c", "which dotnet" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			}
			ProcessBuilder builder = new ProcessBuilder(command);
			Process process = builder.start();

			if (process.waitFor() == 0) {
				try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
					return in.readLine();
				}
			}
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		}
		return ""; //$NON-NLS-1$
	}

}
