using CaseConverter;

namespace Xpedite.Generator;

public class ValidVariableName(string? name, string backupName)
{
    public string Value { get; } = GetValue(name, backupName);

    private static string GetValue(string? name, string backupName)
    {
        if (!string.IsNullOrEmpty(name))
        {
            name = name.ToCamelCase();
        }

        backupName = backupName.ToCamelCase();

        return !string.IsNullOrWhiteSpace(name) ? name : !string.IsNullOrWhiteSpace(backupName) ? backupName : "invalidNameProvided";
    }
}
