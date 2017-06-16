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
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.eclipse.core.runtime.Path;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class DotnetExportAccessor {
	private static final String[] EMPTY_ARRAY = new String[0];

	public static String getDefaultRuntime() {
		String listCommand = "dotnet --info";

		Runtime runtime = Runtime.getRuntime();
		try {
			Process process = runtime.exec(listCommand);

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("^\\sRID:\\s+.*$")) {
						return inputLine.replaceFirst("^\\sRID:\\s+", "").replaceAll("\\s", "");
					}
				}
			}
		} catch (IOException e) {
			return "";
		}
		return "";
	}

	public static String[] getTargetFrameworks(Path projectFile) {
		if (projectFile == null) {
			return EMPTY_ARRAY;
		} else if (projectFile.getFileExtension().equals("json")) {
			try {
				JSONObject object = new JSONObject(new String(Files.readAllBytes(Paths.get(
						projectFile.toString()))));
				Iterator<String> frameworkIterator = object.getJSONObject("frameworks").keys();
				List<String> frameworks = new ArrayList<>();
				while (frameworkIterator.hasNext()) {
					frameworks.add(frameworkIterator.next());
				}
				return frameworks.toArray(EMPTY_ARRAY);
			} catch (JSONException | IOException e) {
				e.printStackTrace();
				return EMPTY_ARRAY;
			}

		} else if (projectFile.getFileExtension().equals("csproj")) {
			try {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document doc = builder.parse(projectFile.toFile());
				doc.getDocumentElement().normalize();

				NodeList nList = doc.getElementsByTagName("PropertyGroup");
				if (nList.getLength() > 0) {
					Node propertyGroup = nList.item(0);
					Node framework = ((Element) propertyGroup).getElementsByTagName("TargetFramework").item(0);
					if (framework != null) {
						String allFrameworks = framework.getTextContent();
						if (!allFrameworks.isEmpty()) {
							return framework.getTextContent().split(";");
						}
					}
					return EMPTY_ARRAY;
				}
				return EMPTY_ARRAY;
			} catch (ParserConfigurationException | SAXException | IOException e) {
				return EMPTY_ARRAY;
			}
		}

		return EMPTY_ARRAY;
	}
}
