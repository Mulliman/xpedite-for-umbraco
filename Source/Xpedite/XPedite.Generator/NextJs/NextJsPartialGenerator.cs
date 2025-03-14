using Xpedite.Generator;
using Xpedite.Generator.TestData;

namespace Xpedite.Generator.NextJs;

public class NextJsPartialGenerator(string rootDirectory, IFieldRenderer fieldRenderer, PartialTestDataGenerator partialTestDataGenerator) : GeneratorBase<NextJsInput, NextJsTransformData>(rootDirectory, fieldRenderer)
{
    private readonly PartialTestDataGenerator _partialTestDataGenerator = partialTestDataGenerator;

    public const string DefaultVariantName = "default";

    protected override async Task<NextJsTransformData> CreateTransformData(NextJsInput input, string[] renderedFields)
    {
        return new NextJsTransformData(new MultiCasedValue(input.Name), 
            input.Properties, 
            [.. renderedFields], 
            input.VariantName,
            await GetTestJson(input.PageToCreateTestDataFrom));
    }

    protected override async Task<GeneratedFile> GenerateFile(NextJsTransformData data, string filePathIncludingTokens)
    {
        var templateText = await File.ReadAllTextAsync(filePathIncludingTokens);
        var output = TemplatingLanguage.Generate(templateText, data);

        var newFileName = FileManager.GetOutputFileName(filePathIncludingTokens, data.Name.Value);

        var startPath = GetVariantFolderTwoLevels(data.VariantName);

        if(newFileName.StartsWith(startPath))
        {
            newFileName = newFileName.Replace(startPath, FileManager.PartialsDirectoryName);
        }

        return new GeneratedFile(newFileName, output);
    }

    protected override string[] GetTemplateFilePaths(string? variant = null)
    {
        var subfolder = GetVariantName(variant);
        var directory = Path.Combine(FileManager.PartialsDirectory, subfolder);

        return FileManager.GetFilePaths(directory);
    }

    private string GetVariantName(string? variant = null)
    {
        return string.IsNullOrEmpty(variant) ? DefaultVariantName : variant;
    }

    private string GetVariantFolderTwoLevels(string? variant = null)
    {
        var variantName = GetVariantName(variant);

        var rootFolder = FileManager.PartialsDirectoryName;

        return $"{rootFolder}{Path.DirectorySeparatorChar}{variantName}";
    }

    private async Task<Dictionary<string, string>?> GetTestJson(Umbraco.Cms.Core.Models.IContent? pageToCreateTestDataFrom)
    {
        var defaultValue = new Dictionary<string, string> { { "testData", "{ /* Fill in props with some test data */ }" } };

        if (pageToCreateTestDataFrom?.Key == null)
        {
            return defaultValue;
        }

        var testData = await _partialTestDataGenerator.GeneratePageJson(pageToCreateTestDataFrom.Key);
        return testData != null ? new Dictionary<string, string> { { testData.Value.Key, testData.Value.Value } } : defaultValue;
    }
}