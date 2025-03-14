using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xpedite.Backend.Assistant.Documentation;

namespace Xpedite.Backend.TestItems;

public class TestItemResolver(IContentService contentService, IContentTypeService contentTypeService, DocumentationPageFinder documentationPageFinder, XpediteSettings settings)
{
    protected readonly IContentService ContentService = contentService;
    protected readonly IContentTypeService ContentTypeService = contentTypeService;
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

    public async Task<IContent?> FindDocumentationPageForBlock(Guid? elementTypeId)
    {
        if (elementTypeId == null || !elementTypeId.HasValue)
        {
            return null;
        }

        var contentType = await ContentTypeService.GetAsync(elementTypeId.Value);

        if (contentType?.Name == null)
        {
            return null;
        }

        return DocumentationPageFinder.FindDocumentationPageForPageName(Settings.DocumentationBlocksSubfolder,
                Settings.DocumentationDocumentTypeAlias,
                contentType.Name);
    }
}