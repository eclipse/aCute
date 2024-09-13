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
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *  Lucas Bullen   (Red Hat Inc.) - Logic implementation
 *******************************************************************************/
package org.eclipse.acute.dotnetnew;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.acute.AcutePlugin;
import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;

public class DotnetNewAccessor {

	public static class Template {
		public final @NonNull String id;
		public final @NonNull String label;
		public final @Nullable String languageString;

		public Template(@NonNull String label, @NonNull String id) {
			this(label, id, null);
		}

		public Template(@NonNull String label, @NonNull String id, @Nullable String languageString) {
			this.label = label;
			this.id = id;
			this.languageString = languageString;
		}

		@Override
		public String toString() {
			if (this.languageString == null) {
				return this.label;
			}
			return this.label + " [" + this.languageString + "]"; //$NON-NLS-1$ //$NON-NLS-2$
		}

		public List<String> getCLIOptions() {
			if (this.languageString != null) {
				return Arrays.asList(this.id, "--language", this.languageString); //$NON-NLS-1$
			}
			return Collections.singletonList(this.id);
		}
	}

	/**
	 * Retrieves and returns the list of available dotnet templates
	 *
	 * @return Map<String, String>: Contains the short name, used to refer to the
	 *         template in bash commands, as the key and the template's full name as
	 *         the value.
	 * @throws IllegalStateException
	 *             If no `dotnet` path has been set
	 */
	public static List<Template> getTemplates() {
		try {
			List<Template> templates = new ArrayList<>();

			Process process = new ProcessBuilder(AcutePlugin.getDotnetCommand(), "new", "list").start(); //$NON-NLS-1$ //$NON-NLS-2$
			try (BufferedReader in = process.inputReader()) {
				String inputLine;
				boolean templateListExists = false;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.matches("[' ',-]{10,}$")) { //$NON-NLS-1$
						templateListExists = true;
						break;
					}
				}

				if (templateListExists) {
					while ((inputLine = in.readLine()) != null) {
						String[] template = inputLine.split("[\\s]{2,}"); //$NON-NLS-1$

						if (template.length == 3) { // No language column
							templates.add(new Template(template[0], template[1]));
						} else if (template.length > 3) { // Language column present
							String[] languages = template[2].split(","); //$NON-NLS-1$

							for (String languageStringDirty : languages) {
								String languageString = languageStringDirty.replaceAll("[\\s\\[\\]]", ""); //$NON-NLS-1$ //$NON-NLS-2$
								templates.add(new Template(template[0], template[1], languageString));
							}
						} else {
							break;
						}
					}
				}
				return templates;
			}
		} catch (IOException e) {
			return Collections.emptyList();
		}
	}

}
