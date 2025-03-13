using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Documentation
{
    public class BlockDocumentationAssistant(IContentService contentService,
        IContentEditingService contentEditingService,
        IContentTypeService contentTypeService,
        DocumentationPageFinder documentationPageFinder,
        XpediteSettings settings) : DocumentationAssistantBase<BlockCheckInput, BlockActionInput>(contentService, contentEditingService, contentTypeService, documentationPageFinder, settings)
    {
        public override string ActionName => "createBlockDocumentation";

        public override string SubFolder => Settings.DocumentationBlocksSubfolder;

        protected override IContent? FindDocumentationPage(string subfolder, IContentType documentationPageType, IContentType contentType, IContent root)
        {
            return DocumentationPageFinder.FindDocumentationPageForPageName(subfolder, documentationPageType, contentType.Name, root);
        }
    }
}
