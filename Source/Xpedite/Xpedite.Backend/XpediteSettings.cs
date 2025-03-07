using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace Xpedite.Backend;

public class XpediteSettings(IWebHostEnvironment hostingEnvironment, IOptions<Xpedite> xpediteSettings)
{
    private readonly IWebHostEnvironment _hostingEnvironment = hostingEnvironment;
    private readonly IOptions<Xpedite> _xpediteSettings = xpediteSettings;

    public string? CodebaseSrcPath => _xpediteSettings?.Value?.CodebaseSrcPath
        ?? (_xpediteSettings?.Value?.FrontendCodebaseRootPath != null ?  Path.Combine(_xpediteSettings.Value.FrontendCodebaseRootPath, "src") : null);

    public string TemplatesRootFolderPath => !string.IsNullOrWhiteSpace(_xpediteSettings?.Value?.TemplatesRootFolderPath)
        ? _xpediteSettings.Value.TemplatesRootFolderPath
        : Path.Combine([_hostingEnvironment.ContentRootPath, "wwwroot", "app_plugins", "Xpedite.Frontend", "default-templates", "NextJs"]);

    public bool AutoAddSectionToAdminUser => _xpediteSettings.Value?.AutoAddSectionToAdminUser ?? true;

    public string DocumentationDocumentTypeAlias => _xpediteSettings.Value?.DocumentationDocumentTypeAlias ?? "documentationPage";

    public string DocumentationTemplatesSubfolder => _xpediteSettings.Value?.DocumentationTemplatesSubfolder ?? "Page Templates";

    public string DocumentationBlocksSubfolder => _xpediteSettings.Value?.DocumentationBlocksSubfolder ?? "Blocks";
}

public class Xpedite
{
    public string? FrontendCodebaseRootPath { get; set; }

    public string? CodebaseSrcPath { get; set; }

    public string? TemplatesRootFolderPath { get; set; }

    public bool? AutoAddSectionToAdminUser { get; set; }

    public string? DocumentationDocumentTypeAlias { get; set; }

    public string? DocumentationTemplatesSubfolder { get; set; }

    public string? DocumentationBlocksSubfolder { get; set; }
}