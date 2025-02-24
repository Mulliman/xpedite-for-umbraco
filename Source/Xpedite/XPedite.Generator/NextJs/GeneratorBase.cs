namespace Xpedite.Generator.NextJs;

public record NextJsInput(string Name, List<PropertyTokens> Properties, string? VariantName = null) : INextJsInput;

public record NextJsTransformData(MultiCasedValue Name, List<PropertyTokens>? Properties, List<string>? RenderedProperties, string? VariantName = null);

public abstract class GeneratorBase<TInput, TTransformData>(string rootDirectory, IFieldRenderer fieldRenderer)
    where TInput : NextJsInput
    where TTransformData : NextJsTransformData
{
    protected string RootDirectory { get; } = rootDirectory;

    protected IFieldRenderer FieldRenderer { get; } = fieldRenderer;

    protected FileManager FileManager { get; } = new FileManager(rootDirectory);

    public async virtual Task<GeneratedFiles> GenerateFiles(TInput input)
    {
        ArgumentNullException.ThrowIfNull(input, nameof(input));

        var filePathsIncludingTokens = GetTemplateFilePaths(input.VariantName);

        var renderedFields = await GetRenderedFields(input);
        var model = await CreateTransformData(input, renderedFields);

        return await GenerateFiles(model, filePathsIncludingTokens);
    }

    protected async virtual Task<GeneratedFiles> GenerateFiles(TTransformData transformData, string[] filePathsIncludingTokens)
    {
        var generateTasks = filePathsIncludingTokens.Select(f => GenerateFile(transformData, f)).ToList();
        var generatedFiles = generateTasks != null ? await Task.WhenAll(generateTasks) : [];

        return new GeneratedFiles { Files = generatedFiles };
    }

    protected abstract string[] GetTemplateFilePaths(string? variant = null);

    protected abstract Task<TTransformData> CreateTransformData(TInput input, string[] renderedFields);

    protected abstract Task<GeneratedFile> GenerateFile(TTransformData data, string filePathsIncludingTokens);

    protected virtual async Task<string[]> GetRenderedFields(TInput input)
    {
        return await GetRenderedFields(input.Properties);
    }

    protected virtual async Task<string[]> GetRenderedFields(List<PropertyTokens> properties)
    {
        var fieldRendererTasks = properties?.Select(p => FieldRenderer.RenderField(p.Alias, p.Editor)).ToList();
        var renderedFields = fieldRendererTasks != null ? await Task.WhenAll(fieldRendererTasks) : [];

        return renderedFields;
    }
}