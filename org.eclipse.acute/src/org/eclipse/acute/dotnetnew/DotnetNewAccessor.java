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
	public static Map<String, String> getTemplates() {
		Map<String, String> templatesMap = new HashMap<String, String>();
		try {
			String listCommand = "dotnet new -- list";
			int linesTillTemplateList = 18;

			Runtime runtime = Runtime.getRuntime();
			Process process = runtime.exec(listCommand);

			BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
			String inputLine;
			while ((inputLine = in.readLine()) != null) {
				if (linesTillTemplateList > 0) {
					linesTillTemplateList--;
				} else if (!inputLine.isEmpty()) {
					String[] template = inputLine.split("[\\s]{2,}", 3);
					templatesMap.put(template[0], template[1]);
				} else {
					break;
				}
			}
			in.close();
			return templatesMap;

		} catch (IOException e) {
			return Collections.<String, String>emptyMap();
		}
	}

}
