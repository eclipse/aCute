using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using OmniSharp.Models;

namespace OmniSharp.TypeScriptGeneration
{
    public static class OmnisharpEventExtractor
    {
        public static string GetInterface()
        {
            var methods = "        " + string.Join("\n        ", GetEvents().Select(x => x.Value)) + "\n";
            var aggregateMethods = "        " + string.Join("\n        ", GetAggregateEvents().Select(x => x.Value)) + "\n";

            return $"declare module {nameof(OmniSharp)} {{\n    interface Events {{\n        listen(path: string): Observable<any>;\n{methods}    }}\n}}\ndeclare module {nameof(OmniSharp)}.Aggregate {{\n    interface Events {{\n        listen(path: string): Observable<any>;\n{aggregateMethods}    }}\n}}";
        }

        private static string GetEventReturnType(string propertyName)
        {
            switch (propertyName)
            {
                case nameof(EventTypes.ProjectAdded):
                case nameof(EventTypes.ProjectChanged):
                case nameof(EventTypes.ProjectRemoved):
                    return typeof(ProjectInformationResponse).FullName;
                case nameof(EventTypes.Error):
                    return typeof(ErrorMessage).FullName;
                case nameof(EventTypes.MsBuildProjectDiagnostics):
                    return typeof(MSBuildProjectDiagnostics).FullName;
                case nameof(EventTypes.PackageRestoreStarted):
                case nameof(EventTypes.PackageRestoreFinished):
                    return typeof(PackageRestoreMessage).FullName;
                case nameof(EventTypes.UnresolvedDependencies):
                    return typeof(UnresolvedDependenciesMessage).FullName;
                case nameof(EventTypes.Diagnostic):
                    return typeof(DiagnosticMessage).FullName;
                default:
                    return "any";
            }
        }

        public class EventItem
        {
            public string Name { get; set; }
            public string Value { get; set; }
            public string ReturnType { get; set; }
        }

        public static IEnumerable<EventItem> GetEvents()
        {
            var properties = typeof(EventTypes).GetFields(BindingFlags.Static | BindingFlags.Public);

            foreach (var property in properties)
            {
                var eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return new EventItem()
                {
                    Name = eventName,
                    ReturnType = GetEventReturnType(property.Name),
                    Value = $"listen(path: \"{eventName}\"): Observable<{GetEventReturnType(property.Name)}>;"
                };
            }

            foreach (var property in properties)
            {
                var eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return new EventItem()
                {
                    Name = eventName,
                    ReturnType = GetEventReturnType(property.Name),
                    Value = $"{eventName}: Observable<{GetEventReturnType(property.Name)}>;"
                };
            }
        }

        public static IEnumerable<EventItem> GetAggregateEvents()
        {
            var properties = typeof(EventTypes).GetFields(BindingFlags.Static | BindingFlags.Public);

            foreach (var property in properties)
            {
                var eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return new EventItem()
                {
                    Name = eventName,
                    ReturnType = GetEventReturnType(property.Name),
                    Value = $"listen(path: \"{eventName}\"): Observable<CombinationKey<{GetEventReturnType(property.Name)}>[]>;"
                };
            }

            foreach (var property in properties)
            {
                var eventName = property.Name.ToLowerInvariant()[0] + property.Name.Substring(1);
                yield return new EventItem()
                {
                    Name = eventName,
                    ReturnType = GetEventReturnType(property.Name),
                    Value = $"{eventName}: Observable<CombinationKey<{GetEventReturnType(property.Name)}>[]>;"
                };
            }
        }
    }
}
