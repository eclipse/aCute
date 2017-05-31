/*******************************************************************************
 * Copyright (c) 2017 Red Hat Inc. and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute.dotnetnew;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class DotnetNewAccessor {

	/**
	 * Retrieves and returns the list of available dotnet templates
	 *
	 * @return Map<String, String>: Contains the short name, used to refer to the
	 *         template in bash commands, as the key and the template's full name as
	 *         the value.
	 */
	public static Map<String, String> getTemplates() {
		Map<String, String> templateCommandToNameMap = new HashMap<>();
		try {
			String listCommand = "dotnet new -- list";

			Runtime runtime = Runtime.getRuntime();
			Process process = runtime.exec(listCommand);

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;
				Boolean templateListExists = false;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("^-{30,}$")) {
						templateListExists = true;
						break;
					}
				}

				if (templateListExists) {
					while ((inputLine = in.readLine()) != null) {
						String[] template = inputLine.split("[\\s]{2,}");

						if (template.length == 3) { // No language column
							templateCommandToNameMap.put(template[0], template[1]);
						} else if (template.length > 3) { // Language column present
							String[] languages = template[2].split(",");

							for (String languageStringDirty : languages) {
								String languageString = languageStringDirty.replaceAll("[\\s\\[\\]]", "");
								templateCommandToNameMap.put(template[0] + " [" + languageString + "]",
										template[1] + " -lang " + languageString);
							}
						} else {
							break;
						}
					}
				}
				return templateCommandToNameMap;
			}
		} catch (IOException e) {
			return Collections.<String, String>emptyMap();
		}
	}

}
