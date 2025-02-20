namespace Xpedite.Generator;

public record MultiCasedValue(string Value)
{
    public string CamelCase => CaseConverter.Converters.ToCamelCase(Value);
    public string PascalCase => CaseConverter.Converters.ToPascalCase(Value);
    public string KebabCase => CaseConverter.Converters.ToKebabCase(Value);
    public string SnakeCase => CaseConverter.Converters.ToSnakeCase(Value);
}
