using Xpedite.Generator.TestData;

namespace Xpedite.Generator.NextJs;

public class NextJsTemplateGenerator(string rootDirectory, IFieldRenderer fieldRenderer, PageTestDataGenerator pageTestDataGenerator)
    : GeneratorBase<NextJsInput, NextJsTransformData>(rootDirectory, fieldRenderer)
{
    private readonly PageTestDataGenerator _pageTestDataGenerator = pageTestDataGenerator;

    protected override async Task<NextJsTransformData> CreateTransformData(NextJsInput input, string[] renderedFields)
    {
        var result = new NextJsTransformData(new MultiCasedValue(input.Name),
            input.Properties,
            [.. renderedFields],
            input.VariantName,
            await GetTestJson(input.PageToCreateTestDataFrom));

        return result;
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

    private async Task<Dictionary<string, string>?> GetTestJson(Umbraco.Cms.Core.Models.IContent? pageToCreateTestDataFrom)
    {
        var defaultValue = new Dictionary<string, string> { { "testData", "{ /* Fill in props with some test data */ }" } };

        if (pageToCreateTestDataFrom?.Key == null)
        {
            return defaultValue;
        }

        var testData = await _pageTestDataGenerator.GeneratePageJson(pageToCreateTestDataFrom.Key);
        return testData != null ? new Dictionary<string, string> { { testData.Value.Key, testData.Value.Value } } : defaultValue;
    }
}