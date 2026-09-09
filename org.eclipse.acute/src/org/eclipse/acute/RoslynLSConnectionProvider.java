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
 *  Mickael Istria (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.io.FilterInputStream;
import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.eclipse.core.runtime.ILog;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.jdt.annotation.Nullable;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.lsp4e.server.StreamConnectionProvider;
import org.eclipse.swt.widgets.Display;

public class RoslynLSConnectionProvider implements StreamConnectionProvider {

	private static boolean installationAlreadySuggested = false;

	private boolean DEBUG = Boolean.parseBoolean(System.getProperty("roslyn.lsp.debug")) || //$NON-NLS-1$
			Boolean.parseBoolean(System.getProperty("omnisharp.lsp.debug")); //$NON-NLS-1$ // for backward compatibility

	private Process process;

	public RoslynLSConnectionProvider() {
	}

	private boolean showDotnetCommandError = true;

	@Override
	public void start() throws IOException {
		// workaround for https://github.com/OmniSharp/omnisharp-node-client/issues/265
		try {
			Process restoreProcess = Runtime.getRuntime().exec(new String[] { AcutePlugin.getDotnetCommand(showDotnetCommandError), "restore" }); //$NON-NLS-1$
			showDotnetCommandError = true;
			try {
				restoreProcess.waitFor();
			} catch (InterruptedException e) {
				AcutePlugin.logError(e);
			}
		} catch (IllegalStateException e) {
			showDotnetCommandError = false;
			ILog.get().log(new Status(IStatus.ERROR,
					AcutePlugin.getDefault().getBundle().getSymbolicName(),
					Messages.roslynLSStreamConnection_dotnetRestoreError));
		}

		String commandLine = System.getenv("ROSLYN_LANGUAGE_SERVER_COMMAND"); //$NON-NLS-1$
		if (commandLine == null) {
			// for backward compatibility
			commandLine = System.getenv("OMNISHARP_LANGUAGE_SERVER_COMMAND"); //$NON-NLS-1$
		}
		if (commandLine == null) {
			commandLine = "roslyn-language-server --stdio --autoLoadProjects"; //$NON-NLS-1$
		}
		try {
			this.process = Runtime.getRuntime().exec(commandLine);
		} catch (IOException ex) {
			if (!installationAlreadySuggested) {
				Display.getDefault().asyncExec(this::suggestInstallation);
			}
		}
	}

	// Runs in UI Thread
	private void suggestInstallation() {
		if (installationAlreadySuggested) {
			return;
		}
		installationAlreadySuggested = true;
		MessageDialog.openError(Display.getCurrent().getActiveShell(),
			Messages.roslynLSStreamConnection_roslynLSNotStarted_Title,
			Messages.roslynLSStreamConnection_roslynLSNotFoundError);
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
		if (process != null) {
			process.destroy();
		}
	}

	@Override public @Nullable InputStream getErrorStream() {
		return process.getErrorStream();
	}

}
