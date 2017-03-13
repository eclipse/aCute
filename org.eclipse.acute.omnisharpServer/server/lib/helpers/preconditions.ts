// tslint:disable-next-line:max-file-line-count
import { each, get, isNull, isUndefined, some } from 'lodash';
import * as OmniSharp from '../omnisharp-server';

export type PreconditionMethod = ((request: any) => void);

function isNotNull(property: string) {
    return (request: OmniSharp.Models.Request) => {
        const result = get(request, property);
        if (isNull(result) || isUndefined(result)) {
            const errorText = `${property} must not be null.`;
            throw new Error(errorText);
        }
    };
}

function isAboveZero(property: string) {
    return (request: OmniSharp.Models.Request) => {
        const minValue = 0;
        const result = get(request, property);
        if (isNull(result) || isUndefined(result)) {
            return;
        }
        if (result < minValue) {
            const errorText = `${property} must be greater than or equal to ${minValue}.`;
            throw new Error(errorText);
        }
    };
}

function precondition(property: Function, ...decorators: PreconditionMethod[]) {
    return (request: OmniSharp.Models.Request) => {
        if (property(request)) {
            each(decorators, decorator => {
                decorator(request);
            });
        }
    };
}

function any(...properties: string[]) {
    return (request: OmniSharp.Models.Request) => {
        const anyMatch = some(properties, property => {
            const result = get(request, property);
            if (result === null || result === undefined) {
                return false;
            }
            return true;
        });

        if (!anyMatch) {
            const errorText = `${properties.join(' || ')}  must not be null.`;
            throw new Error(errorText);
        }
    };
}

const preconditions: { [index: string]: PreconditionMethod[] } = {};
export function getPreconditions(key: string) {
    return preconditions[key.toLocaleLowerCase()] || [];
}

preconditions['/v2/getcodeactions'] = [
    isNotNull(`FileName`),
    precondition((x: any) => !x.Selection,
        isNotNull(`Line`),
        isAboveZero(`Line`),
        isNotNull(`Column`),
        isAboveZero(`Column`)),
    precondition((x: any) => !!x.Selection,
        isNotNull(`Selection.Start.Line`),
        isAboveZero(`Selection.Start.Line`),
        isNotNull(`Selection.Start.Column`),
        isAboveZero(`Selection.Start.Column`),
        isNotNull(`Selection.End.Line`),
        isAboveZero(`Selection.End.Line`),
        isNotNull(`Selection.End.Column`),
        isAboveZero(`Selection.End.Column`))
];

preconditions['/v2/runcodeaction'] = [
    isNotNull(`FileName`),
    isNotNull(`Identifier`),
    precondition((x: any) => !x.Selection,
        isNotNull(`Line`),
        isAboveZero(`Line`),
        isNotNull(`Column`),
        isAboveZero(`Column`)),
    precondition((x: any) => !!x.Selection,
        isNotNull(`Selection.Start.Line`),
        isAboveZero(`Selection.Start.Line`),
        isNotNull(`Selection.Start.Column`),
        isAboveZero(`Selection.Start.Column`),
        isNotNull(`Selection.End.Line`),
        isAboveZero(`Selection.End.Line`),
        isNotNull(`Selection.End.Column`),
        isAboveZero(`Selection.End.Column`))
];

// OmniSharp.Models.UpdateBufferRequest
preconditions['/updatebuffer'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.ChangeBufferRequest
preconditions['/changebuffer'] = [
    isNotNull(`FileName`),
    isNotNull(`NewText`),
    isNotNull(`StartLine`),
    isAboveZero(`StartLine`),
    isNotNull(`StartColumn`),
    isAboveZero(`StartColumn`),
    isNotNull(`EndLine`),
    isAboveZero(`EndLine`),
    isNotNull(`EndColumn`),
    isAboveZero(`EndColumn`)
];

// OmniSharp.Models.FormatAfterKeystrokeRequest
preconditions['/formatafterkeystroke'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`),
    any(`Character`, `Char`)
];

// OmniSharp.Models.FormatRangeRequest
preconditions['/formatrange'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`),
    isNotNull(`EndLine`),
    isAboveZero(`EndLine`),
    isNotNull(`EndColumn`),
    isAboveZero(`EndColumn`)
];

// OmniSharp.Models.CodeFormatRequest
preconditions['/codeformat'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.AutoCompleteRequest
preconditions['/autocomplete'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`),
    isNotNull(`WordToComplete`)
];

// OmniSharp.Models.FindImplementationsRequest
preconditions['/findimplementations'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.FindSymbolsRequest
preconditions['/findsymbols'] = [
    isNotNull(`Filter`)
];

// OmniSharp.Models.FindUsagesRequest
preconditions['/findusages'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.FixUsingsRequest
preconditions['/fixusings'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.GotoDefinitionRequest
preconditions['/gotodefinition'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.NavigateUpRequest
preconditions['/navigateup'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.GotoFileRequest
preconditions['/gotofile'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.GotoRegionRequest
preconditions['/gotoregion'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.HighlightRequest
preconditions['/highlight'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.MetadataRequest
preconditions['/metadata'] = [
    isNotNull(`AssemblyName`),
    isNotNull(`TypeName`)
];

// OmniSharp.Models.NavigateDownRequest
preconditions['/navigatedown'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.PackageSearchRequest
preconditions['/packagesearch'] = [
    isNotNull(`ProjectPath`),
    isNotNull(`Search`)
];

// OmniSharp.Models.PackageSourceRequest
preconditions['/packagesource'] = [
    isNotNull(`ProjectPath`)
];

// OmniSharp.Models.PackageVersionRequest
preconditions['/packageversion'] = [
    isNotNull(`ProjectPath`),
    isNotNull(`Id`)
];

// OmniSharp.Models.RenameRequest
preconditions['/rename'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`),
    isNotNull(`RenameTo`)
];

// OmniSharp.Models.SignatureHelpRequest
preconditions['/signaturehelp'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.MembersTreeRequest
preconditions['/currentfilemembersastree'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.MembersTreeRequest
preconditions['/fileschanged'] = [
    (request: OmniSharp.Models.Request[]) => {
        if (!request) {
            const errorText = `fileschanged must not be null.`;
            throw new Error(errorText);
        }
        if (some(request, x => !x.FileName)) {
            const errorText = `fileschanged[].FileName must not be null.`;
            throw new Error(errorText);
        }
    }
];

// OmniSharp.Models.MembersFlatRequest
preconditions['/currentfilemembersasflat'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.TypeLookupRequest
preconditions['/typelookup'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`)
];

// OmniSharp.Models.v1.ProjectInformationRequest
preconditions['/project'] = [
    isNotNull(`FileName`)
];

// OmniSharp.Models.TestCommandRequest
preconditions['/gettestcontext'] = [
    isNotNull(`FileName`),
    isNotNull(`Line`),
    isAboveZero(`Line`),
    isNotNull(`Column`),
    isAboveZero(`Column`),
    isNotNull(`Type`),
    isAboveZero(`Type`)
];
