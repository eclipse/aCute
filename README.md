# Eclipse aCute: C# in Eclipse IDE

Support for C# development in the Eclipse IDE. Supports rich edition, execution of .NET programs, debugging of .NET program, integration with `dotnet` CLI (for export, publish...).

aCute is an Eclipse.org project. See https://projects.eclipse.org/projects/tools.acute .

[Video Demo of Editor and .NET Core Commands Integration](https://www.dropbox.com/s/yc60dsoslv0hedd/aCute.mp4)

![screenshot](aCute.png "Screenshot of aCute editor")

## Prerequisites

* On **any OS**, `dotnet`(v2.0 or later) needs to be available in your PATH.
* On **Windows**, .NET SDK needs to be installed.
* On **Mac**: Unknown. If you discover an issue or required prerequisite, please [report the issue.](https://github.com/eclipse/aCute/issues)

Or see [Alternative configuration](#alternative-configuration)

## Installation in Eclipse IDE

Using Eclipse Marketplace: https://marketplace.eclipse.org/content/acute-c-edition-eclipse-ide-experimental

Using p2 repository, with the [Install New Software wizard](http://help.eclipse.org/topic/org.eclipse.platform.doc.user/tasks/tasks-127.htm) (or to reference in p2 director command, or in target-platform description for your RCP application)
* use `http://download.eclipse.org/acute/releases/latest` for the latest release, or
* use `http://download.eclipse.org/acute/snapshots` to try the latest build from master.

## Concept

Eclipse aCute relies on [OmniSharp-Roslyn](https://github.com/OmniSharp/omnisharp-roslyn) and [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) for edition, and on [netcoredbg](https://github.com/Samsung/netcoredbg) and [Debug Adapter Protocol](https://github.com/Microsoft/vscode-debugadapter-node/tree/master/protocol) for debugging. Integration with those tools is powered by [Eclipse LSP4E](http://projects.eclipse.org/technology.lsp4e)

Eclipse aCute relies on [TM4E](http://projects.eclipse.org/technology.tm4e) and a textmate grammar to provide syntax highlighting in the IDE.

## Alternative configuration

You can setup a local [OmniSharp Language Server](https://github.com/OmniSharp/omnisharp-node-client) fetched, configured and working locally. Then at least one of the following *environment variables* should be set to make Eclipse IDE able to locate your specific OmniSharp-node-client:
* `OMNISHARP_LANGUAGE_SERVER_COMMAND`: a command-line to start the language server over stdio (such as `/usr/bin/node /home/mistria/git/omnisharp-node-client/languageserver/server.js` or `/home/mistria/omnisharp-roslyn/run -lsp -stdio`)

Note that this approach isn't recommended nor supported by the aCute project developers. It's mainly useful for contributors who want to hack things around Omnisharp-node-client and/or aCute.
