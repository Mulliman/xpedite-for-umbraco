using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;
using Xpedite.Backend.Assistant.BlockList;
using Xpedite.Backend.Assistant.Blueprints;
using Xpedite.Backend.Assistant.Documentation;
using Xpedite.Backend.Codebase;
using Xpedite.Backend.InputMappers;
using Xpedite.Backend.Security;
using Xpedite.Backend.TestItems;
using Xpedite.Generator.TestData;

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

        // Assistant
        builder.Services.AddScoped<BlueprintAssistant>();
        builder.Services.AddScoped<DocumentationPageFinder>();
        builder.Services.AddScoped<TemplateAllowedChildOfDocumentationPageAssistant>();
        builder.Services.AddScoped<TemplateDocumentationAssistant>();
        builder.Services.AddScoped<BlockDocumentationAssistant>();
        builder.Services.AddScoped<BlockListAssistant>();

        builder.Services.AddScoped<TestItemResolver>(); 
        builder.Services.AddScoped<PageTestDataGenerator>(); 
        builder.Services.AddScoped<PartialTestDataGenerator>();
        builder.Services.AddScoped<BlockTestDataGenerator>();


        builder.Services.Configure<Xpedite>(builder.Config.GetSection("Xpedite"));

        builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, AddXpediteSectionNotificationHandler>();
    }
}
