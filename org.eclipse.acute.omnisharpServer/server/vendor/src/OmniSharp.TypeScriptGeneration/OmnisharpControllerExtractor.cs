using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using OmniSharp.Mef;
using OmniSharp.Models;

namespace OmniSharp.TypeScriptGeneration
{
    public static class OmnisharpControllerExtractor
    {
        public class ItemVersion
        {
            public ItemVersion(int versionNumber, string version, string actionName, string path, string requestType, string returnType, string value, bool stringBased = false)
            {
                Version = version;
                Value = value;
                ActionName = actionName;
                VersionNumber = versionNumber;
                RequestType = requestType;
                ReturnType = returnType;
                Path = path;
                StringBased = stringBased;
            }

            public string Version { get; set; }
            public int VersionNumber { get; set; }
            public string ActionName { get; set; }
            public string Value { get; set; }
            public string Path { get; set; }
            public string RequestType { get; set; }
            public string ReturnType { get; set; }
            public bool StringBased {get;set;}
        }

        public static IEnumerable<string> GetInterface()
        {
            var methodStrings = GetMethods().Where(x => !x.StringBased).GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            var eventStrings = GetEvents().Where(x => !x.StringBased).GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());
            var aggregateEventStrings = GetAggregateEvents().Where(x => !x.StringBased).GroupBy(z => z.Version).ToDictionary(z => z.Key, z => z.GroupBy(x => x.ActionName).ToArray());

            var keys = methodStrings.Keys;

            yield return $"declare module {nameof(OmniSharp)} {{\n{ContextInterface}{RequestOptionsInterface}{CombinationKeyInterface}}}";

            yield return $"declare module {nameof(OmniSharp)}.Api {{\n";

            var results1 = GetMethods().Where(x => x.StringBased).OrderBy(x => x.ActionName).Select(z => z.Value);
            var methods1 = "        request(path: string, options?: RequestOptions): Observable<any>;\n        request(path: string, request?: any, options?: RequestOptions): Observable<any>;\n        " + string.Join("\n        ", results1) + "\n";
            yield return $"    interface Common {{\n{methods1}    }}\n";

            foreach (var kvp in methodStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();
                foreach (var item in GetMethods().Where(x => !x.StringBased).GroupBy(x => x.ActionName))
                {
                    if (items.Any(x => x.Key != item.Key))
                    {
                        items.Add(item);
                    }
                }

                items = items.GroupBy(x => x.Key).Select(x => x.First()).ToList();

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var methods = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} extends Common {{\n{methods}    }}\n";
            }

            var allVersions = methodStrings.SelectMany(x => x.Value).SelectMany(x => x).Select(x => x.Version)
                .Distinct().Select(x => $"\"{x}\"");

            yield return $"    export function getVersion(name: string): {string.Join(" | ", allVersions)} {{";
            foreach (var method in methodStrings.Where(x => x.Key != "v1"))
            {
                var items = method.Value
                    .SelectMany(x => x)
                    .GroupBy(x => x.ActionName)
                    .Distinct();

                foreach (var key in items.Select(x => x.Key).Distinct())
                {
                    var item = items.First(x => x.Key == key).First();
                    yield return $"        if (\"{item.ActionName.ToLower()}\" === name.toLowerCase()) {{";
                    yield return $"            return \"{item.Version.ToLower()}\";";
                    yield return $"        }}";
                }
            }
            yield return $"        return \"v1\";";
            yield return $"    }}";

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events {{\n";

            results1 = GetEvents().Where(x => x.StringBased).OrderBy(x => x.ActionName).Select(z => z.Value);
            var events1 = "        listen(path: string): Observable<any>;\n        " + string.Join("\n        ", results1) + "\n";
            yield return $"    interface Common {{\n{events1}    }}\n";

            foreach (var kvp in eventStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();

                foreach (var item in GetEvents().Where(x => !x.StringBased).GroupBy(x => x.ActionName))
                {
                    if (items.Any(x => x.Key != item.Key))
                    {
                        items.Add(item);
                    }
                }

                items = items.GroupBy(x => x.Key).Select(x => x.First()).ToList();

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} extends Common {{\n{events}    }}\n";
            }

            yield return $"}}";

            yield return $"declare module {nameof(OmniSharp)}.Events.Aggregate {{\n";

            results1 = GetAggregateEvents().Where(x => x.StringBased).OrderBy(x => x.ActionName).Select(z => z.Value);
            events1 = "        listen(path: string): Observable<any>;\n        " + string.Join("\n        ", results1) + "\n";
            yield return $"    interface Common {{\n{events1}    }}\n";

            foreach (var kvp in aggregateEventStrings)
            {
                var key = kvp.Key;
                var items = kvp.Value.ToList();

                foreach (var item in GetAggregateEvents().Where(x => !x.StringBased).GroupBy(x => x.ActionName))
                {
                    if (items.Any(x => x.Key != item.Key))
                    {
                        items.Add(item);
                    }
                }

                items = items.GroupBy(x => x.Key).Select(x => x.First()).ToList();

                var results = items.SelectMany(x => x).OrderBy(x => x.ActionName).Select(z => z.Value);
                var events = "        " + string.Join("\n        ", results) + "\n";
                yield return $"    interface {key.ToUpper()} {{\n{events}    }}\n";
            }

            yield return $"}}";
        }

        private static string ContextInterface = "    interface Context<TRequest, TResponse>\n    {\n        request: TRequest;\n        response: TResponse;\n    }\n";
        private static string RequestOptionsInterface = "    interface RequestOptions\n    {\n        silent?: boolean;\n    }\n";
        private static string CombinationKeyInterface = "    interface CombinationKey<T>\n    {\n        key: string;\n        value: T;\n    }\n";

        public static IEnumerable<ItemVersion> GetMethods()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var versionNumber = GetVersionNumber(actionName);
                var version = GetVersion(ref actionName);
                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                if (method.RequestType != null)
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"request(path: \"/{method.Action}\", request: {requestType}, options?: RequestOptions): Observable<{returnType}>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{actionName}(request: {requestType}, options?: RequestOptions): Observable<{returnType}>;");
                }
                else
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"request(path: \"/{method.Action}\", options?: RequestOptions): Observable<{returnType}>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{actionName}(): Observable<{returnType}, options?: RequestOptions>;");
                }
            }

            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"request(path: \"/checkalivestatus\", options?: RequestOptions): Observable<boolean>;", true);
            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"checkalivestatus(options?: RequestOptions): Observable<boolean>;");
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"request(path: \"/checkreadystatus\", options?: RequestOptions): Observable<boolean>;", true);
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"checkreadystatus(options?: RequestOptions): Observable<boolean>;");
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"request(path: \"/stopserver\", options?: RequestOptions): Observable<boolean>;", true);
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"stopserver(options?: RequestOptions): Observable<boolean>;");
        }

        public static IEnumerable<ItemVersion> GetEvents()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var versionNumber = GetVersionNumber(actionName);
                var version = GetVersion(ref actionName);
                var observeName = actionName;

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                if (method.RequestType != null)
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"listen(path: \"/{method.Action}\"): Observable<Context<{requestType}, {returnType}>>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{observeName}: Observable<Context<{requestType}, {returnType}>>;");
                }
                else
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"listen(path: \"/{method.Action}\"): Observable<{returnType}>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{observeName}: Observable<{returnType}>;");
                }
            }

            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"listen(path: \"/checkalivestatus\"): Observable<Context<any, boolean>>;", true);
            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"checkalivestatus: Observable<Context<any, boolean>>;");
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"listen(path: \"/checkreadystatus\"): Observable<Context<any, boolean>>;", true);
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"checkreadystatus: Observable<Context<any, boolean>>;");
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"listen(path: \"/stopserver\"): Observable<Context<any, boolean>>;", true);
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"stopserver: Observable<Context<any, boolean>>;");
        }

        public static IEnumerable<ItemVersion> GetAggregateEvents()
        {
            var methods = GetControllerMethods().ToArray();
            foreach (var method in methods)
            {
                var actionName = method.Action;
                var versionNumber = GetVersionNumber(actionName);
                var version = GetVersion(ref actionName);
                var observeName = actionName;

                var requestType = method.RequestType;
                if (method.RequestArray)
                    requestType += "[]";

                var returnType = method.ReturnType;
                if (method.ReturnArray)
                    returnType += "[]";

                if (method.RequestType != null)
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"listen(path: \"/{method.Action}\"): Observable<CombinationKey<Context<{requestType}, {returnType}>>[]>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{observeName}: Observable<CombinationKey<Context<{requestType}, {returnType}>>[]>;");
                }
                else
                {
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"listen(path: \"/{method.Action}\"): Observable<CombinationKey<{returnType}>[]>;", true);
                    yield return new ItemVersion(versionNumber, version, actionName, method.Action, requestType, returnType, $"{observeName}: Observable<CombinationKey<{returnType}>[]>;");
                }
            }

            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"listen(path: \"/checkalivestatus\"): Observable<CombinationKey<Context<any, boolean>>>;", true);
            yield return new ItemVersion(1, "v1", "checkalivestatus", "checkalivestatus", "void", "boolean", $"checkalivestatus: Observable<CombinationKey<Context<any, boolean>>>;");
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"listen(path: \"/checkreadystatus\"): Observable<CombinationKey<Context<any, boolean>>>;", true);
            yield return new ItemVersion(1, "v1", "checkreadystatus", "checkreadystatus", "void", "boolean", $"checkreadystatus: Observable<CombinationKey<Context<any, boolean>>>;");
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"listen(path: \"/stopserver\"): Observable<CombinationKey<Context<any, boolean>>>;", true);
            yield return new ItemVersion(1, "v1", "stopserver", "stopserver", "void", "boolean", $"stopserver: Observable<CombinationKey<Context<any, boolean>>>;");
        }

        private static string GetVersion(ref string actionName)
        {
            if (actionName.Contains("/"))
            {
                var s = actionName.Split('/');
                actionName = s[1];
                return s[0];
            }
            return "v1";
        }

        private static int GetVersionNumber(string actionName)
        {
            if (actionName.Contains("/"))
            {
                var s = actionName.Split('/');
                return int.Parse(s[0].Trim('v'));
            }
            return 1;
        }

        public class MethodResult
        {
            public string Action { get; set; }
            public string RequestType { get; set; }
            public bool RequestArray { get; set; }
            public string ReturnType { get; set; }
            public bool ReturnArray { get; set; }
        }

        private static IEnumerable<MethodResult> GetControllerMethods()
        {
            var assemblies = new[] {
                 typeof(OmniSharp.DotNet.DotNetProjectSystem),
                typeof(OmniSharp.DotNetTest.Models.GetTestStartInfoRequest),
                typeof(Request)
             };
            var types = assemblies.SelectMany(x => x.Assembly.GetTypes())
                .Where(z => z.GetTypeInfo().GetCustomAttributes<OmniSharpEndpointAttribute>().Any());

            foreach (var type in types.Where(z => z.IsPublic))
            {
                var attribute = type.GetCustomAttribute<OmniSharpEndpointAttribute>();
                var requestType = attribute.RequestType;
                var responseType = attribute.ResponseType;

                var requestArray = false;
                if (requestType != null && requestType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    requestArray = true;
                    requestType = requestType.GetGenericArguments().First();
                }

                string requestTypeString = "any";
                if (requestType != null && requestType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    requestTypeString = requestType.FullName;
                }

                if (requestType == typeof(Boolean))
                {
                    requestTypeString = nameof(Boolean).ToLowerInvariant();
                }

                var responseArray = false;
                if (responseType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    responseArray = true;
                    responseType = responseType.GetGenericArguments().First();
                }

                string responseTypeString = "any";
                if (responseType != null && responseType.FullName.StartsWith(InferNamespace(typeof(Request)), StringComparison.Ordinal))
                {
                    responseTypeString = responseType.FullName;
                }

                if (responseType == typeof(Boolean))
                {
                    responseTypeString = nameof(Boolean).ToLowerInvariant();
                }

                yield return new MethodResult()
                {
                    RequestType = requestTypeString,
                    RequestArray = requestArray,
                    ReturnType = responseTypeString,
                    ReturnArray = responseArray,
                    Action = attribute.EndpointName.TrimStart('/')
                };
            }
        }

        internal static string InferNamespace(Type type)
        {
            var pieces = type.FullName.Split('.');
            return string.Join(".", pieces.Take(pieces.Length - 1)) + ".";
        }
    }
}
