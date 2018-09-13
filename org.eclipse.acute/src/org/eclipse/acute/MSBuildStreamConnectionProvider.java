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
 *  Lucas Bullen (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URL;
import java.util.Collections;

import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.lsp4e.server.StreamConnectionProvider;

public class MSBuildStreamConnectionProvider implements StreamConnectionProvider {

	private Process process;

	public MSBuildStreamConnectionProvider() {
	}

	@Override
	public void start() throws IOException {
		URL serverFileUrl = getClass()
				.getResource(
						"/server/msbuild-project-tools-server-0.2.33/out/language-server/MSBuildProjectTools.LanguageServer.Host.dll"); //$NON-NLS-1$
		if (serverFileUrl != null) {
			File serverFile = new File(FileLocator.toFileURL(serverFileUrl).getPath());
			if (serverFile.exists()) {
				String[] command = new String[] { AcutePlugin.getDotnetCommand(true), "exec", serverFile.getAbsolutePath() }; //$NON-NLS-1$
				this.process = Runtime.getRuntime().exec(command);
				return;
			}
		}
		AcutePlugin.getDefault().getLog().log(new Status(IStatus.ERROR,
				AcutePlugin.getDefault().getBundle().getSymbolicName(), "MSBuild Server not found!\n" //$NON-NLS-1$
						+ "Main issue and remediation: The `org.eclipse.acute.msBuildServer` fragment is missing.")); //$NON-NLS-1$
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

	@Override
	public Object getInitializationOptions(URI rootUri) {
		return Collections.singletonMap("msbuildProjectTools", //$NON-NLS-1$
				Collections.singletonMap("experimentalFeatures", Collections.singletonList("empty-completion-lists"))); //$NON-NLS-1$ //$NON-NLS-2$
	}

	@Override
	public InputStream getErrorStream() {
		return process.getErrorStream();
	}

}
