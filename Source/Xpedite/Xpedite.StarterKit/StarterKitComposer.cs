using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Nodes;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Xpedite.StarterKit;

internal class StarterKitManifestReader : IPackageManifestReader
{
    public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync()
    {
        var assembly = typeof(StarterKitManifestReader).Assembly;
        List<PackageManifest> manifest = [
            new PackageManifest
            {
                Extensions = [new JsonObject()],
                Name = "XPEDITE.StarterKit",
                Version = assembly.GetName()?.Version?.ToString(3) ?? "15.0.0",
                AllowTelemetry = true
            }
        ];

        return Task.FromResult(manifest.AsEnumerable());
    }
}

public class StarterKitComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<IPackageManifestReader, StarterKitManifestReader>();
    }
}