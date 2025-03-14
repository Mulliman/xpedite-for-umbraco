using Xpedite.Generator.TestData;

namespace Xpedite.Generator.NextJs;

public class NextJsBlockInput(string name, string contentTypeAlias, string? settingsTypeAlias, List<PropertyTokens> properties, List<PropertyTokens> settings, string? variantName = null) 
    : NextJsInput(name, properties, variantName)
{
    public string ContentTypeAlias { get; } = contentTypeAlias;

    public string? SettingsTypeAlias { get; } = settingsTypeAlias;

    public List<PropertyTokens> Settings { get; set; } = settings;
}

public record NextJsBlockTransformData(MultiCasedValue Name, List<PropertyTokens>? Properties,
    List<PropertyTokens>? Settings,
    List<string>? FieldRenderers,
    List<string>? RenderedSettings,
    string? VariantName = null,
    Dictionary<string, string>? TestJsonObjects = null)
    : NextJsTransformData(Name, Properties, FieldRenderers, VariantName, TestJsonObjects);

public class NextJsBlockGenerator(string rootDirectory, IFieldRenderer fieldRenderer, BlockTestDataGenerator blockTestDataGenerator) : GeneratorBase<NextJsBlockInput, NextJsBlockTransformData>(rootDirectory, fieldRenderer)
{
    private readonly BlockTestDataGenerator _blockTestDataGenerator = blockTestDataGenerator;

    protected override async Task<NextJsBlockTransformData> CreateTransformData(NextJsBlockInput input, string[] renderedFields)
    {
        var renderedSettings = await GetRenderedSettings(input);

        var model = new NextJsBlockTransformData(new MultiCasedValue(input.Name),
            input.Properties,
            input.Settings,
            [.. renderedFields],
            [.. renderedSettings],
            input.VariantName,
            await GetTestJson(input.PageToCreateTestDataFrom, input.ContentTypeAlias, input.SettingsTypeAlias));

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

    private async Task<Dictionary<string, string>?> GetTestJson(Umbraco.Cms.Core.Models.IContent? pageToCreateTestDataFrom, string contentTypeAlias, string? settingsTypeAlias)
    {
        var defaultValue = new Dictionary<string, string> { { "testData", "{ /* Fill in props with some test data */ }" } };

        if (pageToCreateTestDataFrom?.Key == null)
        {
            return defaultValue;
        }

        var testData = await _blockTestDataGenerator.GenerateBlocksJson(pageToCreateTestDataFrom.Key, contentTypeAlias, settingsTypeAlias);
        return testData?.Count > 0 ? testData : defaultValue;
    }
}