namespace Xpedite.Generator.NextJs;

public record NextJsBlockInput(string Name, List<PropertyTokens> Properties, List<PropertyTokens> Settings, string? VariantName = null)
    : NextJsInput(Name, Properties, VariantName);

public record NextJsBlockTransformData(MultiCasedValue Name, List<PropertyTokens>? Properties, List<PropertyTokens>? Settings, List<string>? FieldRenderers, List<string>? RenderedSettings, string? VariantName = null)
    : NextJsTransformData(Name, Properties, FieldRenderers, VariantName);

public class NextJsBlockGenerator(string rootDirectory, IFieldRenderer fieldRenderer) : GeneratorBase<NextJsBlockInput, NextJsBlockTransformData>(rootDirectory, fieldRenderer)
{
    protected override async Task<NextJsBlockTransformData> CreateTransformData(NextJsBlockInput input, string[] renderedFields)
    {
        var renderedSettings = await GetRenderedSettings(input);

        var model = new NextJsBlockTransformData(new MultiCasedValue(input.Name), input.Properties, input.Settings, [.. renderedFields], [.. renderedSettings], input.VariantName);

        return model;
    }

    protected override async Task<GeneratedFile> GenerateFile(NextJsBlockTransformData data, string filePathIncludingTokens)
    {
        var templateText = await File.ReadAllTextAsync(filePathIncludingTokens);
        var output = TemplatingLanguage.Generate(templateText, data);

        var newFileName = FileManager.GetOutputFileName(filePathIncludingTokens, data.Name.Value);

        return new GeneratedFile(newFileName, output);
    }

    protected override string[] GetTemplateFilePaths(string? variant = null)
    {
        return FileManager.GetFilePaths(FileManager.BlocksDirectory);
    }

    private async Task<string[]> GetRenderedSettings(NextJsBlockInput input)
    {
        return await GetRenderedFields(input.Settings);
    }
}