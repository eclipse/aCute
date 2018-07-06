/*********************************************************************
 * Copyright (c) 2018 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.SubMonitor;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.ui.console.ConsolePlugin;
import org.eclipse.ui.console.IConsole;
import org.eclipse.ui.console.IConsoleManager;
import org.eclipse.ui.console.MessageConsole;
import org.eclipse.ui.console.MessageConsoleStream;

public class CommandJob extends Job {
	private Process process;
	private String[] command;
	private String progressMessage;
	private String errorTitle;
	private String errorMessage;
	private String commandID;

	public CommandJob(String[] command, String progressMessage, String errorTitle, String errorMessage,
			String commandID) {
		super(progressMessage);
		if (command == null) {
			this.command = null;
		} else {
			this.command = Arrays.copyOf(command, command.length);
		}
		this.progressMessage = progressMessage;
		this.errorTitle = errorTitle;
		this.errorMessage = errorMessage;
		this.commandID = commandID;
	}

	@Override
	protected IStatus run(IProgressMonitor monitor) {
		SubMonitor subMonitor = SubMonitor.convert(monitor, 0);
		try {
			subMonitor.beginTask(progressMessage, 0);
			process = new ProcessBuilder(command).start();
			try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				CompletableFuture.runAsync(() -> {
					reader.lines().forEachOrdered(line -> logToConsole(line));
				});
				if (process.waitFor() != 0) {
					if (!subMonitor.isCanceled()) {
						AcutePlugin.showError(errorTitle, errorMessage);
					}
					return Status.CANCEL_STATUS;
				}
			}
			return Status.OK_STATUS;
		} catch (IOException e) {
			AcutePlugin.showError(errorTitle, errorMessage, e);
			return Status.CANCEL_STATUS;
		} catch (InterruptedException e) {
			AcutePlugin.showError(errorTitle, errorMessage, e);
			Thread.currentThread().interrupt();
			return Status.CANCEL_STATUS;
		}
	}

	private void logToConsole(String string) {
		if (consoleStream == null || consoleStream.isClosed()) {
			consoleStream = findConsole().newMessageStream();
		}
		consoleStream.println(string);
	}

	private MessageConsoleStream consoleStream;
	private MessageConsole console;
	private MessageConsole findConsole() {
		if(console == null) {
			ConsolePlugin plugin = ConsolePlugin.getDefault();
			IConsoleManager conMan = plugin.getConsoleManager();
			IConsole[] existing = conMan.getConsoles();
			for (int i = 0; i < existing.length; i++) {
				if (commandID.equals(existing[i].getName())) {
					console = (MessageConsole) existing[i];
					console.clearConsole();
					return console;
				}
			}
			// no console found, so create a new one
			MessageConsole myConsole = new MessageConsole(commandID, null);
			conMan.addConsoles(new IConsole[] { myConsole });
			console = myConsole;
		}
		return console;
	}

	@Override
	protected void canceling() {
		if (process != null) {
			process.destroyForcibly();
		}
	}
}
