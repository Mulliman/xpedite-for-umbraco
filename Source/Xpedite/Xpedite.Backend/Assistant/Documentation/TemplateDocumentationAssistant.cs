using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Documentation
{
    public class TemplateDocumentationAssistant(IContentService contentService,
        IContentEditingService contentEditingService,
        IContentTypeService contentTypeService,
        XpediteSettings settings) : DocumentationAssistantBase<CheckInput, ActionInput>(contentService, contentEditingService, contentTypeService, settings)
    {
        public override string ActionName => "createTemplateDocumentation";

        public override string SubFolder => Settings.DocumentationTemplatesSubfolder;
    }
}
