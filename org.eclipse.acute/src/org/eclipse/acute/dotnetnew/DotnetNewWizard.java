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
package org.eclipse.acute.dotnetnew;

import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;

public class DotnetNewWizard extends Wizard implements INewWizard {

	@Override
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		// TODO
	}

	@Override
	public void addPages() {
		addPage(new DotnetNewWizardPage());
	}

	@Override
	public boolean performFinish() {
		// TODO:
		// 1.dotnet new <template> -o <location>
		// 2.Import dotnet project in workspace (with name <projectName>
		return false;
	}

}
