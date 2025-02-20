using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Xpedite.Backend.Codebase;
using Xpedite.Backend.InputMappers;

namespace Xpedite.Backend.Composers;

public class ServiceComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddScoped<Settings>();
        builder.Services.AddScoped<CodebaseUpdater>();


        // Mappers
        builder.Services.AddScoped<TemplateMapper>();
        builder.Services.AddScoped<PartialMapper>();
        builder.Services.AddScoped<BlockMapper>();
    }
}
