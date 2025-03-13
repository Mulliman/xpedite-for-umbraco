using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Documentation
{
    public class TemplateDocumentationAssistant(IContentService contentService,
        IContentEditingService contentEditingService,
        IContentTypeService contentTypeService,
        DocumentationPageFinder documentationPageFinder,
        XpediteSettings settings) : DocumentationAssistantBase<CheckInput, ActionInput>(contentService, contentEditingService, contentTypeService, documentationPageFinder, settings)
    {
        public override string ActionName => "createTemplateDocumentation";

        public override string SubFolder => Settings.DocumentationTemplatesSubfolder;

        protected override IContent? FindDocumentationPage(string subfolder, IContentType documentationPageType, IContentType contentType, IContent root)
        {
            return DocumentationPageFinder.FindDocumentationPageForPageType(subfolder, documentationPageType, contentType, root);
        }
    }
}
