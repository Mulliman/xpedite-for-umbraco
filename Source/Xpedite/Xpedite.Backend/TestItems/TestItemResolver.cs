using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xpedite.Backend.Assistant.Documentation;

namespace Xpedite.Backend.TestItems;

public class TestItemResolver(IContentService contentService, DocumentationPageFinder documentationPageFinder, XpediteSettings settings)
{
    protected readonly IContentService ContentService = contentService;
    protected readonly DocumentationPageFinder DocumentationPageFinder = documentationPageFinder;
    protected readonly XpediteSettings Settings = settings;

    public IContent? FindSpecificItem(Guid? testItemId)
    {
        if (testItemId == null || !testItemId.HasValue)
        {
            return null;
        }

        return ContentService.GetById(testItemId.Value);
    }

    public async Task<IContent?> FindDocumentationPageForTemplate(Guid? documentTypeId)
    {
        if (documentTypeId == null || !documentTypeId.HasValue)
        {
            return null;
        }

        return await DocumentationPageFinder.FindDocumentationPageForPageType(Settings.DocumentationTemplatesSubfolder,
                Settings.DocumentationDocumentTypeAlias,
                documentTypeId.Value);
    }
}