namespace Xpedite.Generator.NextJs;

public class FileManager(string rootDirectory)
{
    public string RootDirectory { get; } = rootDirectory;

    public const string FileNameToken = "[name]";

    public const string FileExtension = TemplatingLanguage.FileExtension;

    public string TemplatesDirectory => Path.Combine(RootDirectory, "templates");

    public string PartialsDirectoryName => "partials";

    public string PartialsDirectory => Path.Combine(RootDirectory, PartialsDirectoryName);

    public string BlocksDirectory => Path.Combine(RootDirectory, "blocks");

    public string RenderersDirectory => Path.Combine(RootDirectory, "renderers");

    public string GetRendererFullPath(string editorAlias)
    {
        return Path.Combine(RenderersDirectory, $"{editorAlias}{FileExtension}");
    }

    public static string[] GetFilePaths(string directory)
    {
        var allFiles = Directory.GetFiles(directory, "*", SearchOption.AllDirectories);

        return allFiles;
    }

    public string GetRelativePath(string file)
    {
        return Path.GetRelativePath(RootDirectory, file);
    }

    public string GetOutputFileName(string file, string name)
    {
        var outputFileName = file.Replace(FileNameToken, name);

        if (outputFileName.EndsWith(FileExtension))
        {
            outputFileName = outputFileName[..^FileExtension.Length];
        }

        return GetRelativePath(outputFileName);
    }
}