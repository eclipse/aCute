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
import java.io.File;
import java.io.FilterInputStream;
import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Platform;
import org.eclipse.core.runtime.Status;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.lsp4e.server.StreamConnectionProvider;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.progress.UIJob;

public class OmnisharpStreamConnectionProvider implements StreamConnectionProvider {

	private boolean DEBUG = Boolean.parseBoolean(System.getProperty("omnisharp.lsp.debug"));

	private Process process;

	public OmnisharpStreamConnectionProvider() {
	}

	@Override
	public void start() throws IOException {
		// workaround for https://github.com/OmniSharp/omnisharp-node-client/issues/265
		String[] command;
		try {
			command = new String[] { "/bin/bash", "-c", AcutePlugin.getDotnetCommand(), "restore" };
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] { "cmd", "/c", AcutePlugin.getDotnetCommand(), "restore" };
			}
			Process restoreProcess = Runtime.getRuntime().exec(command);
			try {
				restoreProcess.waitFor();
			} catch (InterruptedException e) {
				AcutePlugin.logError(e);
			}
		} catch (IllegalStateException e) {
			AcutePlugin.getDefault().getLog().log(new Status(IStatus.ERROR,
					AcutePlugin.getDefault().getBundle().getSymbolicName(),
					"`dotnet restore` not performed!\n"
							+ "Main issue and remediation: The `dotnet` path is not set in the .NET Core preferences. Please set it.\n"
							+ "Possible alternative remediation:\n"
							+ "* `dotnet` (v2.0 or later) is a prerequisite. Install it on your system if missing."));
		}

		String commandLine = System.getenv("OMNISHARP_LANGUAGE_SERVER_COMMAND");
		String omnisharpLocation = System.getenv("OMNISHARP_LANGUAGE_SERVER_LOCATION");
		if (commandLine != null) {
			command = new String[] {"/bin/bash", "-c", commandLine};
			if (Platform.getOS().equals(Platform.OS_WIN32)) {
				command = new String[] {"cmd", "/c", commandLine};
			}
			this.process = Runtime.getRuntime().exec(command);
		} else if (omnisharpLocation != null) {
			ProcessBuilder builder = new ProcessBuilder(
					getNodeJsLocation().getAbsolutePath(),
					omnisharpLocation);
			process = builder.start();
		} else {
			URL serverFileUrl = getClass().getResource("/server/omnisharp-node-client-7.1.2/languageserver/server.js");
			if (serverFileUrl != null) {
				File serverFile = new File(FileLocator.toFileURL(serverFileUrl).getPath());
				if (serverFile.exists()) {
					File nodeJsLocation = getNodeJsLocation();
					if (nodeJsLocation == null || !nodeJsLocation.isFile()) {
						AcutePlugin.getDefault().getLog().log(new Status(IStatus.ERROR,
								AcutePlugin.getDefault().getBundle().getSymbolicName(),
								"Couldn't find nodejs in your machine. Please make sure it's part of your PATH."));
						return;
					}
					ProcessBuilder builder = new ProcessBuilder(
							nodeJsLocation.getAbsolutePath(),
							serverFile.getAbsolutePath());
					AcutePlugin.getDefault().getLog().log(new Status(IStatus.INFO,
							AcutePlugin.getDefault().getBundle().getSymbolicName(),
							"Omnisharp command-line: " + builder.command().stream().collect(Collectors.joining(" "))));
					process = builder.start();
					return;
				}
			} else {
				AcutePlugin.getDefault().getLog().log(new Status(IStatus.ERROR,
						AcutePlugin.getDefault().getBundle().getSymbolicName(),
						"Omnisharp not found!\n"
								+
								"Main issue and remediation: The `org.eclipse.acute.omnisharpServer` fragment is missing. Please add it.\n" +
								"Possible alternative settings:\n" +
								"* set `OMNISHARP_LANGUAGE_SERVER_COMMAND` to the command that should be used to start the server (with full path).\n" +
						"* set `OMNISHARP_LANGUAGE_SERVER_LOCATION` to the full path of thel language server file."));
			}
		}
	}

	private static File getNodeJsLocation() {
		String location = null;
		String[] command = new String[] {"/bin/bash", "-c", "which node"};
		if (Platform.getOS().equals(Platform.OS_WIN32)) {
			command = new String[] {"cmd", "/c", "where node"};
		}
		BufferedReader reader = null;
		try {
			Process p = Runtime.getRuntime().exec(command);
			reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			location = reader.readLine();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			IOUtils.closeQuietly(reader);
		}

		// Try default install path as last resort
		if (location == null && Platform.getOS().equals(Platform.OS_MACOSX)) {
			location = "/usr/local/bin/node";
		}

		if (Files.exists(Paths.get(location))) {
			return new File(location);
		}
		new UIJob(PlatformUI.getWorkbench().getDisplay(), "Missing `node` in PATH") {
			@Override
			public IStatus runInUIThread(IProgressMonitor monitor) {
				MessageDialog.openError(getDisplay().getActiveShell(), "Missing Node.js",
						"`node` is missing in your PATH, C# editor won't work fully.\n" +
						"Please install `node` and make it available in your PATH");
				return Status.OK_STATUS;
			}
		}.schedule();
		return null;
	}


	@Override
	public InputStream getInputStream() {
		if (DEBUG) {
			return new FilterInputStream(process.getInputStream()) {
				@Override
				public int read() throws IOException {
					int res = super.read();
					System.err.print((char) res);
					return res;
				}

				@Override
				public int read(byte[] b, int off, int len) throws IOException {
					int bytes = super.read(b, off, len);
					byte[] payload = new byte[bytes];
					System.arraycopy(b, off, payload, 0, bytes);
					System.err.print(new String(payload));
					return bytes;
				}

				@Override
				public int read(byte[] b) throws IOException {
					int bytes = super.read(b);
					byte[] payload = new byte[bytes];
					System.arraycopy(b, 0, payload, 0, bytes);
					System.err.print(new String(payload));
					return bytes;
				}
			};
		} else {
			return process.getInputStream();
		}
	}

	@Override
	public OutputStream getOutputStream() {
		if (DEBUG) {
			return new FilterOutputStream(process.getOutputStream()) {
				@Override
				public void write(int b) throws IOException {
					System.err.print((char) b);
					super.write(b);
				}

				@Override
				public void write(byte[] b) throws IOException {
					System.err.print(new String(b));
					super.write(b);
				}

				@Override
				public void write(byte[] b, int off, int len) throws IOException {
					byte[] actual = new byte[len];
					System.arraycopy(b, off, actual, 0, len);
					System.err.print(new String(actual));
					super.write(b, off, len);
				}
			};
		} else {
			return process.getOutputStream();
		}
	}

	@Override
	public void stop() {
		process.destroy();
	}

}
