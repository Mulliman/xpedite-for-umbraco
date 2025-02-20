namespace Xpedite.Generator;

public record GeneratedFiles
{
    public string? GroupName { get; set; }

    public required IEnumerable<GeneratedFile> Files { get; set; }
}

public record GeneratedFile(string RelativeFilePath, string Contents, bool IsAIGenerated = false)
{
    public string? FolderPath => Path.GetDirectoryName(RelativeFilePath);

    public string? FileName => Path.GetFileName(RelativeFilePath);

    public string Extension => string.IsNullOrWhiteSpace(FileName) ? string.Empty : Path.GetExtension(FileName);
}