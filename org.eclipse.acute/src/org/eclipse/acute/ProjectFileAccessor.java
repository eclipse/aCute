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
 *  Lucas Bullen   (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ProjectFileAccessor {
	private static final String[] EMPTY_ARRAY = new String[0];

	public static IPath getProjectFile(IContainer project) {
		try {
			for (IResource projItem : project.members()) {
				if (projItem.getName().matches("^.*\\.csproj$")) { //$NON-NLS-1$
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
		} else if (projectFile.getFileExtension().equals("json")) { // TODO consider defining and checking content-type //$NON-NLS-1$
			try (FileReader reader = new FileReader(projectFile.toFile())) {
				Gson gson = new Gson();
				JsonObject object = gson.fromJson(reader, JsonObject.class);
				List<String> frameworks = new ArrayList<>();
				for (Entry<String, ?> framework : object.getAsJsonObject("frameworks").entrySet()) { //$NON-NLS-1$
					frameworks.add(framework.getKey());
				}
			} catch (IOException e) {
				e.printStackTrace();
				return EMPTY_ARRAY;
			}
		} else if (projectFile.getFileExtension().equals("csproj")) { // TODO consider defining and checking //$NON-NLS-1$
																		// content-type
			try {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document doc = builder.parse(projectFile.toFile());
				doc.getDocumentElement().normalize();

				NodeList nList = doc.getElementsByTagName("PropertyGroup"); //$NON-NLS-1$
				if (nList.getLength() > 0) {
					Node propertyGroup = nList.item(0);
					String tagName = "TargetFramework"; //$NON-NLS-1$
					NodeList frameworkNodeList = ((Element) propertyGroup).getElementsByTagName(tagName);
					if (frameworkNodeList.getLength() > 0) {
						return new String[]{ frameworkNodeList.item(0).getTextContent() };
					} else {
						Node framework = ((Element) propertyGroup).getElementsByTagName(tagName + "s").item(0); //$NON-NLS-1$
						if (framework != null) {
							String allFrameworks = framework.getTextContent();
							if (!allFrameworks.isEmpty()) {
								return framework.getTextContent().split(";"); //$NON-NLS-1$
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