using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace Xpedite.Backend;

public class Settings(IWebHostEnvironment hostingEnvironment, IOptions<XpediteSettings> xpediteSettings)
{
    private readonly IWebHostEnvironment _hostingEnvironment = hostingEnvironment;
    private readonly IOptions<XpediteSettings> _xpediteSettings = xpediteSettings;

    public string? CodebaseSrcPath => _xpediteSettings?.Value?.CodebaseSrcPath;

    public string TemplatesRootFolderPath => !string.IsNullOrWhiteSpace(_xpediteSettings?.Value?.TemplatesRootFolderPath)
        ? _xpediteSettings.Value.TemplatesRootFolderPath
        : Path.Combine([_hostingEnvironment.ContentRootPath, "wwwroot", "app_plugins", "Xpedite.Frontend", "default-templates", "NextJs"]);
}

public class XpediteSettings
{
    public string? CodebaseSrcPath { get; set; }

    public string? TemplatesRootFolderPath { get; set; }
}