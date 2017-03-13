# omnisharp-node-client [![Travis](https://travis-ci.org/OmniSharp/omnisharp-node-client.svg?branch=master)](https://travis-ci.org/OmniSharp/omnisharp-node-client) [![Appveyor](https://ci.appveyor.com/api/projects/status/github/omnisharp/omnisharp-node-client?svg=true&branch=master)](https://ci.appveyor.com/project/david-driscoll/omnisharp-node-client)
The node client for [omnisharp-roslyn](https://github.com/OmniSharp/omnisharp-roslyn) is a unified way to interact with the roslyn server.

It currently offers the ability to connect to your local server over Stdio.  In the future more drivers can be added, to allow it to connect to the server over Http, Web Sockets, the cloud... anything really.  The current focus is covering the entire Api surface of roslyn with a strongly typed interface (for those typescript users out there).  This will allow anyone wanting to fire up an omnisharp server to be able to do so with ease.

## Used by
* [omnisharp-atom](https://github.com/OmniSharp/omnisharp-atom) <sup>soon(</sup>&trade;<sup>)</sup>

## Developers
To get started:
* clone repository
* tsd reinstall
* npm install
* run build-server[.sh|.ps1]

### **!Windows Developers!**
There is an issue with kre beta3 and `Nuget.Core` trying to resolve as `NuGet.Core`.

The fix is to set up a local nuget repository that contains a modified package.
The modified package can be found here:
https://onedrive.live.com/redir?resid=b65e6b05ae4ee402!109984&authkey=!AOlvubzpEnZbJJg&ithint=file%2cnupkg

Rough installation steps are:
* clone repository
* init the submodule
* edit vendor/omnisharp-roslyn/NuGet.config
* Add a value pointing to local nuget store eg. `<add key="Local" value="D:\Development\Nuget" />`

This should solve the issue with KPM restore not working correctly.  I imagine once we update to beta4 this will go away.
NOTE: This is just to build the server locally, once it's built once you can just ignore this step.

## Api
The api mimics the roslyn surface, with strongly typed methods for everything.  Under the covers we use [RxJS](https://github.com/Reactive-Extensions/RxJS) to handle our events.  Through the API we offer several streams of data, as well as several ways of data access.

For those that like promises, there is a promise API as well.

## Methods
  * `updatebuffer(request: OmniSharp.Models.Request): Observable<any>`
  * `updatebufferPromise(request: OmniSharp.Models.Request): IPromise<any>`


  * `changebuffer(request: OmniSharp.Models.ChangeBufferRequest): Observable<any>`
  * `changebufferPromise(request: OmniSharp.Models.ChangeBufferRequest): IPromise<any>`


  * `codecheck(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.QuickFixResponse>`
  * `codecheckPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.QuickFixResponse>`


  * `formatAfterKeystroke(request: OmniSharp.Models.FormatAfterKeystrokeRequest): Observable<OmniSharp.Models.FormatRangeResponse>`
  * `formatAfterKeystrokePromise(request: OmniSharp.Models.FormatAfterKeystrokeRequest): IPromise<OmniSharp.Models.FormatRangeResponse>`


  * `formatRange(request: OmniSharp.Models.FormatRangeRequest): Observable<OmniSharp.Models.FormatRangeResponse>`
  * `formatRangePromise(request: OmniSharp.Models.FormatRangeRequest): IPromise<OmniSharp.Models.FormatRangeResponse>`


  * `codeformat(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.CodeFormatResponse>`
  * `codeformatPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.CodeFormatResponse>`


  * `autocomplete(request: OmniSharp.Models.AutoCompleteRequest): Observable<OmniSharp.Models.AutoCompleteResponse[]>`
  * `autocompletePromise(request: OmniSharp.Models.AutoCompleteRequest): IPromise<OmniSharp.Models.AutoCompleteResponse[]>`


  * `findimplementations(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.QuickFixResponse>`
  * `findimplementationsPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.QuickFixResponse>`


  * `findsymbols(request: OmniSharp.Models.FindSymbolsRequest): Observable<OmniSharp.Models.QuickFixResponse>`
  * `findsymbolsPromise(request: OmniSharp.Models.FindSymbolsRequest): IPromise<OmniSharp.Models.QuickFixResponse>`


  * `findusages(request: OmniSharp.Models.FindUsagesRequest): Observable<OmniSharp.Models.QuickFixResponse>`
  * `findusagesPromise(request: OmniSharp.Models.FindUsagesRequest): IPromise<OmniSharp.Models.QuickFixResponse>`


  * `gotodefinition(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.GotoDefinitionResponse>`
  * `gotodefinitionPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.GotoDefinitionResponse>`


  * `navigateup(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.NavigateResponse>`
  * `navigateupPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.NavigateResponse>`


  * `navigatedown(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.NavigateResponse>`
  * `navigatedownPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.NavigateResponse>`


  * `rename(request: OmniSharp.Models.RenameRequest): Observable<OmniSharp.Models.RenameResponse>`
  * `renamePromise(request: OmniSharp.Models.RenameRequest): IPromise<OmniSharp.Models.RenameResponse>`


  * `signatureHelp(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.SignatureHelp>`
  * `signatureHelpPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.SignatureHelp>`


  * `checkalivestatus(request: any): Observable<boolean>`
  * `checkalivestatusPromise(request: any): IPromise<boolean>`


  * `checkreadystatus(request: any): Observable<boolean>`
  * `checkreadystatusPromise(request: any): IPromise<boolean>`


  * `currentfilemembersastree(request: OmniSharp.Models.Request): Observable<any>`
  * `currentfilemembersastreePromise(request: OmniSharp.Models.Request): IPromise<any>`


  * `currentfilemembersasflat(request: OmniSharp.Models.Request): Observable<any>`
  * `currentfilemembersasflatPromise(request: OmniSharp.Models.Request): IPromise<any>`


  * `typelookup(request: OmniSharp.Models.TypeLookupRequest): Observable<any>`
  * `typelookupPromise(request: OmniSharp.Models.TypeLookupRequest): IPromise<any>`


  * `filesChanged(request: OmniSharp.Models.Request[]): Observable<boolean>`
  * `filesChangedPromise(request: OmniSharp.Models.Request[]): IPromise<boolean>`


  * `projects(request: any): Observable<OmniSharp.Models.WorkspaceInformationResponse>`
  * `projectsPromise(request: any): IPromise<OmniSharp.Models.WorkspaceInformationResponse>`


  * `project(request: OmniSharp.Models.Request): Observable<OmniSharp.Models.ProjectInformationResponse>`
  * `projectPromise(request: OmniSharp.Models.Request): IPromise<OmniSharp.Models.ProjectInformationResponse>`


  * `getcodeactions(request: OmniSharp.Models.CodeActionRequest): Observable<OmniSharp.Models.GetCodeActionsResponse>`
  * `getcodeactionsPromise(request: OmniSharp.Models.CodeActionRequest): IPromise<OmniSharp.Models.GetCodeActionsResponse>`


  * `runcodeaction(request: OmniSharp.Models.CodeActionRequest): Observable<OmniSharp.Models.RunCodeActionResponse>`
  * `runcodeactionPromise(request: OmniSharp.Models.CodeActionRequest): IPromise<OmniSharp.Models.RunCodeActionResponse>`


  * `gettestcontext(request: OmniSharp.Models.TestCommandRequest): Observable<OmniSharp.Models.GetTestCommandResponse>`
  * `gettestcontextPromise(request: OmniSharp.Models.TestCommandRequest): IPromise<OmniSharp.Models.GetTestCommandResponse>`


## Observables
  * ``events: Observable<OmniSharp.Stdio.Protocol.EventPacket>``
    Listen to all events sent from the server.  These are generally log messages, but not always.

  * `commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>`
    Listen to all the responses sent from the server.

  * `state: Observable<DriverState>`
    Listen to state changes in the client.  This goes from Disconnected -> Connecting -> Connected

  * `status: Observable<OmnisharpClientStatus>`
    Listen to the server state, this contains fields such as requests and responses per second, outstanding requests, and maybe more in the future.

  * `requests: Observable<RequestWrapper<any>>`
    Listen to all outbound requests from the client to the server.

  * `responses: Observable<ResponseWrapper<any, any>>`
    Listen to all returned requests from the server to the client.  This also includes the original request, so you can use that information for processing.

  * `errors: Observable<CommandWrapper<any>>`
    Stream of any errors from the server


## Response Observables  
These observables are just shorthand for the overall `responses` stream.  These are useful because it allows you to fire and forget to the client, and then on the responses setup specific behavior.

Since the request is bundled with the response in the context object, you have all the data that you sent, plus the response to do with as you please.  This allows you to greatly simplify your code, fire from many places, and observe once.

  * `observeUpdatebuffer: Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeChangebuffer: Observable<Context<OmniSharp.Models.ChangeBufferRequest, any>>`
  * `observeCodecheck: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>`
  * `observeFormatAfterKeystroke: Observable<Context<OmniSharp.Models.FormatAfterKeystrokeRequest, OmniSharp.Models.FormatRangeResponse>>`
  * `observeFormatRange: Observable<Context<OmniSharp.Models.FormatRangeRequest, OmniSharp.Models.FormatRangeResponse>>`
  * `observeCodeformat: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.CodeFormatResponse>>`
  * `observeAutocomplete: Observable<Context<OmniSharp.Models.AutoCompleteRequest, OmniSharp.Models.AutoCompleteResponse[]>>`
  * `observeFindimplementations: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.QuickFixResponse>>`
  * `observeFindsymbols: Observable<Context<OmniSharp.Models.FindSymbolsRequest, OmniSharp.Models.QuickFixResponse>>`
  * `observeFindusages: Observable<Context<OmniSharp.Models.FindUsagesRequest, OmniSharp.Models.QuickFixResponse>>`
  * `observeGotodefinition: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.GotoDefinitionResponse>>`
  * `observeNavigateup: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>`
  * `observeNavigatedown: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.NavigateResponse>>`
  * `observeRename: Observable<Context<OmniSharp.Models.RenameRequest, OmniSharp.Models.RenameResponse>>`
  * `observeSignatureHelp: Observable<Context<OmniSharp.Models.Request, OmniSharp.Models.SignatureHelp>>`
  * `observeCheckalivestatus: Observable<Context<any, boolean>>`
  * `observeCheckreadystatus: Observable<Context<any, boolean>>`
  * `observeCurrentfilemembersastree: Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeCurrentfilemembersasflat: Observable<Context<OmniSharp.Models.Request, any>>`
  * `observeTypelookup: Observable<Context<OmniSharp.Models.TypeLookupRequest, any>>`
  * `observeFilesChanged: Observable<Context<OmniSharp.Models.Request[], boolean>>`
  * `observeProjects: Observable<Context<OmniSharp.Models.v1.WorkspaceInformationRequest, OmniSharp.Models.WorkspaceInformationResponse>>`
  * `observeProject: Observable<Context<OmniSharp.Models.v1.ProjectInformationRequest, OmniSharp.Models.ProjectInformationResponse>>`
  * `observeGetcodeactions: Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.GetCodeActionsResponse>>`
  * `observeRuncodeaction: Observable<Context<OmniSharp.Models.CodeActionRequest, OmniSharp.Models.RunCodeActionResponse>>`
  * `observeGettestcontext: Observable<Context<OmniSharp.Models.TestCommandRequest, OmniSharp.Models.GetTestCommandResponse>>`
