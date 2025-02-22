using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;
using Xpedite.Backend.Codebase;
using Xpedite.Backend.InputMappers;
using Xpedite.Backend.Security;

namespace Xpedite.Backend.Composers;

public class ServiceComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddScoped<XpediteSettings>();
        builder.Services.AddScoped<CodebaseUpdater>();

        // Mappers
        builder.Services.AddScoped<TemplateMapper>();
        builder.Services.AddScoped<PartialMapper>();
        builder.Services.AddScoped<BlockMapper>();

        builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, AddXpediteSectionNotificationHandler>();
    }
}
