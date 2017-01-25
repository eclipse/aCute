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
package org.eclipse.acute;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.runtime.Platform;
import org.eclipse.lsp4e.server.StreamConnectionProvider;

public class OmnisharpStreamConnectionProvider implements StreamConnectionProvider {

	private Process process;

	public OmnisharpStreamConnectionProvider() {
	}

	@Override
	public void start() throws IOException {
		String commandLine = System.getenv("OMNISHARP_LANGUAGE_SERVER_COMMAND");
		String omnisharpLocation = System.getenv("OMNISHARP_LANGUAGE_SERVER_LOCATION");
		if (commandLine != null) {
			String[] command = new String[] {"/bin/bash", "-c", commandLine};
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] {"cmd", "/c", commandLine};
			}
			this.process = Runtime.getRuntime().exec(command);
		} else if (omnisharpLocation != null) {
			ProcessBuilder builder = new ProcessBuilder(
				getNodeJsLocation(),
				omnisharpLocation);
			process = builder.start();
		} else { // my defaults
			ProcessBuilder builder = new ProcessBuilder(
				getNodeJsLocation(),
				"/home/mistria/git/omnisharp-node-client/languageserver/server.js");
			builder.environment().put("LD_LIBRARY_PATH", "/home/mistria/apps/OmniSharp.NET/icu54:" + System.getenv("LD_LIBRARY_PATH"));
			process = builder.start();
		}
	}
	
	public static String getNodeJsLocation() {
		String res = "/path/to/node";
		String[] command = new String[] {"/bin/bash", "-c", "which node"};
		if (Platform.getOS().equals(Platform.OS_WIN32)) {
			command = new String[] {"cmd", "/c", "where node"};
		}
		BufferedReader reader = null;
		try {
			Process p = Runtime.getRuntime().exec(command);
			reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			res = reader.readLine();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			IOUtils.closeQuietly(reader);
		}

		// Try default install path as last resort
		if (res == null && Platform.getOS().equals(Platform.OS_MACOSX)) {
			String defaultInstallPath = "/usr/local/bin/node";
			if (Files.exists(Paths.get(defaultInstallPath))) {
				return defaultInstallPath;
			}
		}

		return res;
	}


	@Override
	public InputStream getInputStream() {
		return process.getInputStream();
	}

	@Override
	public OutputStream getOutputStream() {
		return process.getOutputStream();
	}

	@Override
	public void stop() {
		process.destroy();
	}

}
