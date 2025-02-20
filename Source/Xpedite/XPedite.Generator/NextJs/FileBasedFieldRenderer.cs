namespace Xpedite.Generator.NextJs;

public class FileBasedFieldRenderer : IFieldRenderer
{
    const string DefaultRendererFileName = $"default";

    protected FileManager Locations { get; }

    protected string[] RendererFileNames { get; }

    public FileBasedFieldRenderer(string rootDirectory)
    {
        Locations = new FileManager(rootDirectory);
        RendererFileNames = FileManager.GetFilePaths(Locations.RenderersDirectory);
    }

    public async Task<string> RenderField(string propertyAlias, string editorAlias)
    {
        var filePath = Locations.GetRendererFullPath(editorAlias);
        var defaultFilePath = Locations.GetRendererFullPath(DefaultRendererFileName);

        var matchingRenderer = RendererFileNames.FirstOrDefault(f => f.Equals(filePath, StringComparison.OrdinalIgnoreCase))
            ?? RendererFileNames.FirstOrDefault(f => f.Equals(defaultFilePath, StringComparison.OrdinalIgnoreCase));

        if (matchingRenderer == null)
        {
            return "{" + propertyAlias + "}";
        }

        var templateText = await File.ReadAllTextAsync(matchingRenderer);

        return TemplatingLanguage.Generate(templateText, new { propertyAlias });
    }
}
