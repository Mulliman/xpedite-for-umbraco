using Xpedite.Backend;
using Xpedite.Generator;

namespace Xpedite.Backend.Codebase;

public class CodebaseUpdater(Settings settings)
{
    protected Settings Settings { get; } = settings;

    public string SrcDirectory => Settings.CodebaseSrcPath;

    public bool IsEnabled => Directory.Exists(SrcDirectory);

    public string TemplatesDirectory => Path.Combine(SrcDirectory, "templates");

    public string PartialsDirectory => Path.Combine(SrcDirectory, "partials");

    public string BlocksDirectory => Path.Combine(SrcDirectory, "blocks");

    public string RenderersDirectory => Path.Combine(SrcDirectory, "renderers");

    public async Task<UpdateResult> ApplyFilesToCodebase(GeneratedFiles files, bool force = false)
    {
        try
        {
            foreach (var file in files.Files)
            {
                await ApplyFileToCodebase(file, force);
            }

            return new UpdateResult { WasSuccessful = true };
        }
        catch (FileExistsException fee)
        {
            return new UpdateResult { WasSuccessful = false, Message = fee.Message };
        }
    }

    public async Task ApplyFileToCodebase(GeneratedFile file, bool force = false)
    {
        var fileToUpdate = Path.Combine(SrcDirectory, file.RelativeFilePath);

        if (File.Exists(fileToUpdate) && !force)
        {
            throw new FileExistsException();
        }

        var directoryToUpdate = Path.GetDirectoryName(fileToUpdate);

        if (directoryToUpdate != null && !Directory.Exists(directoryToUpdate))
        {
            Directory.CreateDirectory(directoryToUpdate);
        }

        await File.WriteAllTextAsync(fileToUpdate, file.Contents);
    }
}
