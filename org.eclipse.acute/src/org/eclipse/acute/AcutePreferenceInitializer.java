/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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

	public static String explicitDotnetPathPreference = "dotnet.explicitPath";

	@Override
	public void initializeDefaultPreferences() {
		IPreferenceStore store = AcutePlugin.getDefault().getPreferenceStore();

		store.setDefault(explicitDotnetPathPreference, getBestDotnetPathGuess());
	}

	private String getBestDotnetPathGuess() {
		try {
			String[] command = new String[] { "/bin/bash", "-c", "which dotnet" };
			String os = System.getProperty("os.name");
			if (os.toLowerCase().contains("windows")) {
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
