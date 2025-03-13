using CaseConverter;

namespace Xpedite.Generator;

public class ValidComponentName(string? name, string backupName)
{
    public string Value { get; } = GetValue(name, backupName);

    private static string GetValue(string? name, string backupName)
    {
        if (!string.IsNullOrEmpty(name))
        {
            name = name.ToPascalCase();
        }

        backupName = backupName.ToPascalCase();

        return !string.IsNullOrWhiteSpace(name) ? name : !string.IsNullOrWhiteSpace(backupName) ? backupName : "InvalidNameProvided";
    }
}