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
package org.eclipse.acute.dotnetexport;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.acute.AcutePlugin;

public class DotnetExportAccessor {

	public static String getDefaultRuntime() {
		try {
			String listCommand = AcutePlugin.getDotnetCommand() + " --info";
			Runtime runtime = Runtime.getRuntime();
			Process process = runtime.exec(listCommand);

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("^\\sRID:\\s+.*$")) {
						return inputLine.replaceFirst("^\\sRID:\\s+", "").replaceAll("\\s", "");
					}
				}
			}
		} catch (IllegalStateException | IOException e) {
			return "";
		}
		return "";
	}
}
