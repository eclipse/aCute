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
package org.eclipse.acute.dotnetexport;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.acute.AcutePlugin;

public class DotnetExportAccessor {

	public static String getDefaultRuntime() {
		try {
			String listCommand = AcutePlugin.getDotnetCommand() + " --info"; //$NON-NLS-1$
			Runtime runtime = Runtime.getRuntime();
			Process process = runtime.exec(listCommand);

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("^\\sRID:\\s+.*$")) { //$NON-NLS-1$
						return inputLine.replaceFirst("^\\sRID:\\s+", "").replaceAll("\\s", ""); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
					}
				}
			}
		} catch (IllegalStateException | IOException e) {
			return ""; //$NON-NLS-1$
		}
		return ""; //$NON-NLS-1$
	}
}
