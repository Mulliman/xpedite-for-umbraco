namespace Xpedite.Generator;

public class TemplatingLanguage
{
    public const string FileExtension = ".sbn";

    public static string Generate(string template, object model)
    {
        var parsedTemplate = Scriban.Template.Parse(template);

        return parsedTemplate.Render(model);
    }
}
