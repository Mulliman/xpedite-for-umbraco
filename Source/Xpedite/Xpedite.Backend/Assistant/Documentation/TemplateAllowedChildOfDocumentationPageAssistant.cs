using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.ContentTypeEditing;

namespace Xpedite.Backend.Assistant.Documentation
{
    public class TemplateAllowedChildOfDocumentationPageAssistant(IContentService contentService,
        IContentEditingService contentEditingService,
        IContentTypeEditingService contentTypeEditingService,
        IContentTypeService contentTypeService,
        DocumentationPageFinder documentationPageFinder,
        XpediteSettings settings) : IAssistantAction<ActionInput>, IAssistantCheck<CheckInput>
    {
        protected readonly IContentService ContentService = contentService;
        protected readonly IContentEditingService ContentEditingService = contentEditingService;
        private readonly IContentTypeEditingService _contentTypeEditingService = contentTypeEditingService;
        protected readonly IContentTypeService ContentTypeService = contentTypeService;
        protected readonly DocumentationPageFinder DocumentationPageFinder = documentationPageFinder;
        protected readonly XpediteSettings Settings = settings;

        public string ActionName => "addToAllowedChildrenOfDocumentation";

        public virtual async Task RunAction(ActionInput input, Guid userKey)
        {
            var contentType = await ContentTypeService.GetAsync(input.DocumentTypeId)
                ?? throw new ArgumentException($"Content type {input.DocumentTypeId} does not exist");

            var documentationPageType = ContentTypeService.Get(Settings.DocumentationDocumentTypeAlias)
                ?? throw new ArgumentException($"Documentation content type {input.DocumentTypeId} does not exist");

            var type = new ContentTypeSort(contentType.Key, 0, contentType.Alias);
            documentationPageType.AllowedContentTypes = [..documentationPageType.AllowedContentTypes, type];

            var attempt = await ContentTypeService.UpdateAsync(documentationPageType, userKey);

            if(!attempt.Success)
            {
                throw attempt.Exception ?? new Exception("addToAllowedChildrenOfDocumentation failed");
            }
        }

        public virtual async Task<CheckResult?> RunCheck(CheckInput input)
        {
            var documentTypeId = input.DocumentTypeId;

            var documentationPageType = ContentTypeService.Get(Settings.DocumentationDocumentTypeAlias);
            var contentType = ContentTypeService.Get(documentTypeId);

            if (documentationPageType == null || contentType == null)
            {
                return null;
            }

            if(documentationPageType.AllowedContentTypes?.Any(ct => ct.Key == contentType.Key) == true)
            {
                return new CheckResult
                {
                    IsOk = true,
                    Message = "Allowed child of documentation page"
                };
            }

            return new CheckResult
            {
                IsOk = false,
                Message = "Not allowed child of documentation page",
                ActionName = ActionName,
                ActionButtonText = "Allow"
            };
        }
    }
}
