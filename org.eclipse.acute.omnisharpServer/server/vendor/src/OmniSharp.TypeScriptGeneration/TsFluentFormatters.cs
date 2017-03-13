using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using OmniSharp.Models;
using OmniSharp.Stdio.Protocol;
using TypeLite.TsModels;

namespace OmniSharp.TypeScriptGeneration
{
    public static class TsFluentFormatters
    {
        public static string FormatPropertyType(TsProperty property, string memberTypeName)
        {
            Type propertyType = property.MemberInfo.DeclaringType.GetProperty(property.MemberInfo.Name).PropertyType;
            if (propertyType == typeof(IDictionary<string, string>) || propertyType == typeof(Dictionary<string, string>))
            {
                return "{ [key: string]: string; }";
            }

            if (propertyType.IsGenericType && (propertyType.GetGenericTypeDefinition() == typeof(IDictionary<,>) || propertyType.GetGenericTypeDefinition() == typeof(Dictionary<,>)))
            {
                var valueType = propertyType.GetGenericArguments()[1];
                var valueString = propertyType.FullName;
                if (valueType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
                {
                    var v2 = valueType.GetGenericArguments()[0];
                    if (v2 == typeof(string))
                    {
                        valueString = "string[]";
                    }
                    else
                    {
                        valueString = v2.FullName + "[]";
                    }
                }
                return $"{{ [key: string]: {valueString}; }}";
            }

            if (propertyType == typeof(Guid))
            {
                return "string";
            }

            if (propertyType == typeof(Stream))
            {
                return "any";
            }

            if (propertyType.Name.EndsWith("[]", StringComparison.Ordinal))
            {
                return memberTypeName + "[]";
            }

            if (propertyType.Name.StartsWith(nameof(IEnumerable), StringComparison.Ordinal))
            {
                return memberTypeName + "[]";
            }

            if (propertyType.Name.StartsWith(nameof(IList), StringComparison.Ordinal))
            {
                return memberTypeName + "[]";
            }

            if (propertyType.Name.StartsWith(nameof(HashSet<object>), StringComparison.Ordinal))
            {
                return memberTypeName + "[]";
            }

            if (propertyType.Name.StartsWith(nameof(ICollection), StringComparison.Ordinal))
            {
                return memberTypeName + "[]";
            }

            return memberTypeName;
        }

        public static string FormatPropertyName(TsProperty property)
        {
            // These are mapped as arguments from the client side.
            if (property.Name == nameof(RequestPacket.ArgumentsStream))
            {
                return "Arguments";
            }

            var declaringType = property.MemberInfo.DeclaringType;

            // Request type arguments are optional
            // TODO: Leverage [Required] to know what is needed and not?
            if (!declaringType.Name.Contains(nameof(Packet)) &&
                declaringType.Name.Contains(nameof(Request)))
            {
                return $"{property.Name}?";
            }

            if (declaringType.Name == nameof(Packet) &&
                declaringType.GetProperty(property.MemberInfo.Name).Name == nameof(Packet.Type))
            {
                return $"{property.Name}?";
            }

            return property.Name;
        }
    }
}
