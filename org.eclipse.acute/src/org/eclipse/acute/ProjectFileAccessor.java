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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class ProjectFileAccessor {
	private static final String[] EMPTY_ARRAY = new String[0];

	public static IPath getProjectFile(IContainer project) {
		try {
			for (IResource projItem : project.members()) {
				if (projItem.getName().equals("project.json") || projItem.getName().matches("^.*\\.csproj$")) {
					return projItem.getFullPath();
				}
			}
		} catch (CoreException e) {
			return null;
		}
		return null;
	}

	public static String[] getTargetFrameworks(IPath projectFile) {
		if (projectFile == null) {
			return EMPTY_ARRAY;
		} else if (projectFile.getFileExtension().equals("json")) {
			try {
				JSONObject object = new JSONObject(new String(Files.readAllBytes(Paths.get(projectFile.toString()))));
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
					String tagName = "TargetFramework";
					NodeList frameworkNodeList = ((Element) propertyGroup).getElementsByTagName(tagName);
					if (frameworkNodeList.getLength() > 0) {
						String[] framework = { frameworkNodeList.item(0).getTextContent() };
						return framework;
					} else {
						Node framework = ((Element) propertyGroup).getElementsByTagName(tagName + "s").item(0);
						if (framework != null) {
							String allFrameworks = framework.getTextContent();
							if (!allFrameworks.isEmpty()) {
								return framework.getTextContent().split(";");
							}
						}
					}
				}
			} catch (ParserConfigurationException | SAXException | IOException e) {
				return EMPTY_ARRAY;
			}
		}

		return EMPTY_ARRAY;
	}
}