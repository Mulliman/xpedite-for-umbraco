using Xpedite.Generator;

namespace Xpedite.Generator.NextJs;

public class NextJsPartialGenerator(string rootDirectory, IFieldRenderer fieldRenderer) : GeneratorBase<NextJsInput, NextJsTransformData>(rootDirectory, fieldRenderer)
{
    public const string DefaultVariantName = "default";

    protected override Task<NextJsTransformData> CreateTransformData(NextJsInput input, string[] renderedFields)
    {
        return Task.FromResult(new NextJsTransformData(new MultiCasedValue(input.Name), input.Properties, [.. renderedFields], input.VariantName));
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
}