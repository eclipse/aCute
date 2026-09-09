/*******************************************************************************
 * Copyright (c) 2026 Red Hat Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *  Alexander Kurtakov (Red Hat Inc.) - Initial implementation
 *******************************************************************************/
package org.eclipse.acute;

import java.util.concurrent.CompletableFuture;

import org.eclipse.lsp4e.client.DefaultLanguageClient;

/**
 * Adds what LSP4E does not provide for Roslyn: a reaction to
 * {@code workspace/diagnostic/refresh}, which is how the server says its
 * analysis moved on and the client should pull diagnostics again.
 */
public class RoslynLanguageClient extends DefaultLanguageClient {

	@Override
	public CompletableFuture<Void> refreshDiagnostics() {
		RoslynDiagnosticsManager.refreshAllOpenFiles(getLanguageServer());
		return CompletableFuture.completedFuture(null);
	}
}
