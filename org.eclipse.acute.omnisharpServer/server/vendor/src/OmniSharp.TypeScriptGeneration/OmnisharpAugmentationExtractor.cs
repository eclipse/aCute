/*
import * as OmniSharp from "../../omnisharp-server";
import {Observable} from "rxjs";
import {ReactiveClient} from "../reactive-client-base";
import {requestAugmentation} from "../../helpers/decorators";
import * as preconditions from "../../helpers/preconditions";

requestAugmentation(ReactiveClient.prototype, "getcodeactions", preconditions.getcodeactions);

declare module "../reactive-client-base" {
    interface ReactiveClient {
        getcodeactions(request: OmniSharp.Models.V2.GetCodeActionsRequest, options?: OmniSharp.RequestOptions): Observable<OmniSharp.Models.V2.GetCodeActionsResponse>;
    }
}

*/
using System;
using System.Collections.Generic;
using System.Linq;

namespace OmniSharp.TypeScriptGeneration
{
    public class AugmentationResult
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public string Version { get; set; }
        public int VersionNumber { get; set; }
    }

    public class OmnisharpAugmentationExtractor
    {
        public static IEnumerable<KeyValuePair<string, Tuple<string, string>>> GetAugmentationMethods()
        {
            var methods = OmnisharpControllerExtractor.GetMethods().Where(x => !x.StringBased)
                .Where(x => x.RequestType != null)
                .GroupBy(x => x.ActionName)
                .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); })
                .ToArray();
            var events = OmnisharpControllerExtractor.GetEvents().Where(x => !x.StringBased)
                .Where(x => x.RequestType != null)
                .GroupBy(x => x.ActionName)
                .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); })
                .Join(
                    OmnisharpControllerExtractor.GetAggregateEvents().Where(x => !x.StringBased)
                        .Where(x => x.RequestType != null)
                        .GroupBy(x => x.ActionName)
                        .SelectMany(x => { var max = x.Max(z => z.VersionNumber); return x.Where(z => max == z.VersionNumber); }),
                    x => x.ActionName,
                    x => x.ActionName,
                    (@event, aggregateEvent) => new { @event, aggregateEvent });

            var serverEvents = OmnisharpEventExtractor.GetEvents().GroupBy(x => x.Name).Select(x => x.First(z => !z.Value.Contains("listen")))
                .Join(OmnisharpEventExtractor.GetAggregateEvents().GroupBy(x => x.Name).Select(x => x.First(z => !z.Value.Contains("listen"))), x => x.Name, x => x.Name, (@event, aggregateEvent) => new { @event, aggregateEvent });

            var v = $@"{string.Join("\n", methods.Select(x => $"request(ReactiveClient.prototype, \"{x.ActionName}\");"))}
{string.Join("\n", events.Select(x => $"response(ReactiveClientEvents.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", serverEvents.Select(x => $"event(ReactiveClientEvents.prototype, \"{x.@event.Name}\");"))}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-client.ts", v));

            v = $@"{string.Join("\n", events.Select(x => $"makeObservable(ReactiveObservationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", serverEvents.Select(x => $"makeObservable(ReactiveObservationClient.prototype, \"{x.@event.Name}\", \"{x.@event.Name}\");"))}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-observation-client.ts", v));

            v = $@"{string.Join("\n", events.Select(x => $"makeObservable(ReactiveCombinationClient.prototype, \"{x.@event.ActionName}\", \"/{x.@event.Path}\");"))}
{string.Join("\n", serverEvents.Select(x => $"makeObservable(ReactiveCombinationClient.prototype, \"{x.@event.Name}\", \"{x.@event.Name}\");"))}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("reactive", Tuple.Create("reactive-combination-client.ts", v));

            v = $@"{string.Join("\n", methods.Select(x => $"request(AsyncClient.prototype, \"{x.ActionName}\");"))}
";

            yield return new KeyValuePair<string, Tuple<string, string>>("async", Tuple.Create("async-client.ts", v));
        }
    }
}
