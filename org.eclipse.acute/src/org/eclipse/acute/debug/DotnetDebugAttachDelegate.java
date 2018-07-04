/*******************************************************************************
 * Copyright (c) 2018 Red Hat Inc. and others.
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
package org.eclipse.acute.debug;

import org.eclipse.acute.debug.DebuggersRegistry.DebuggerInfo;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.debug.core.ILaunch;
import org.eclipse.debug.core.ILaunchConfiguration;
import org.eclipse.debug.core.ILaunchConfigurationWorkingCopy;
import org.eclipse.lsp4e.debug.DSPPlugin;
import org.eclipse.lsp4e.debug.launcher.DSPLaunchDelegate;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class DotnetDebugAttachDelegate extends DSPLaunchDelegate {

	@Override public void launch(ILaunchConfiguration configuration, String mode, ILaunch launch, IProgressMonitor monitor) throws CoreException {
		ILaunchConfigurationWorkingCopy wc = configuration.getWorkingCopy();
		JsonObject param = new JsonObject();
		param.addProperty("request", "attach"); //$NON-NLS-1$ //$NON-NLS-2$
		param.addProperty("processId", wc.getAttribute(AttachMainTab.ATTR_PID, Integer.toString(-1))); //$NON-NLS-1$
		wc.setAttribute(DSPPlugin.ATTR_DSP_PARAM, new Gson().toJson(param));
		wc.setAttribute(DSPPlugin.ATTR_DSP_MODE, DSPPlugin.DSP_MODE_LAUNCH);
		wc.setAttribute(DSPPlugin.ATTR_DSP_MONITOR_DEBUG_ADAPTER, true);
		if (wc.getAttribute(DebuggerTab.ATTR_DEFAULT_DEBUGGER, true)) {
			DebuggerInfo debuggerInfo = DebuggersRegistry.getDefaultDebugger();
			wc.setAttribute(DSPPlugin.ATTR_DSP_CMD, debuggerInfo.debugger.getAbsolutePath());
			wc.setAttribute(DSPPlugin.ATTR_DSP_ARGS, debuggerInfo.args);
		}
		configuration = wc.doSave();
		super.launch(configuration, mode, launch, monitor);
	}

}
