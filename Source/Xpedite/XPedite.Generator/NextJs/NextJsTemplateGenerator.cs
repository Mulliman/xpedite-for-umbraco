namespace Xpedite.Generator.NextJs;

public class NextJsTemplateGenerator(string rootDirectory, IFieldRenderer fieldRenderer) : GeneratorBase<NextJsInput, NextJsTransformData>(rootDirectory, fieldRenderer)
{
    protected override Task<NextJsTransformData> CreateTransformData(NextJsInput input, string[] renderedFields)
    {
        return Task.FromResult(new NextJsTransformData(new MultiCasedValue(input.Name), input.Properties, [.. renderedFields], input.VariantName));
    }

    protected override async Task<GeneratedFile> GenerateFile(NextJsTransformData data, string filePathIncludingTokens)
    {
        var templateText = await File.ReadAllTextAsync(filePathIncludingTokens);
        var output = TemplatingLanguage.Generate(templateText, data);

        var newFileName = FileManager.GetOutputFileName(filePathIncludingTokens, data.Name.Value);

        return new GeneratedFile(newFileName, output);
    }

    protected override string[] GetTemplateFilePaths(string? variant = null)
    {
        return FileManager.GetFilePaths(FileManager.TemplatesDirectory);
    }
}