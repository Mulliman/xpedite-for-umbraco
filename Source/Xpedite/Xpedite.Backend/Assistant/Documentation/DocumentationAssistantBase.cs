using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.ContentEditing;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Documentation
{
    public abstract class DocumentationAssistantBase<TCheck, TAction>(IContentService contentService,
        IContentEditingService contentEditingService,
        IContentTypeService contentTypeService,
        XpediteSettings settings) : IAssistantAction<TAction>, IAssistantCheck<TCheck> where TCheck : CheckInput where TAction : ActionInput
    {
        protected readonly IContentService ContentService = contentService;
        protected readonly IContentEditingService ContentEditingService = contentEditingService;
        protected readonly IContentTypeService ContentTypeService = contentTypeService;
        protected readonly XpediteSettings Settings = settings;
        
        public abstract string ActionName { get; }

        public abstract string SubFolder { get; }
        
        public async Task RunAction(TAction input, Guid userKey)
        {
            var contentType = await ContentTypeService.GetAsync(input.DocumentTypeId)
                ?? throw new ArgumentException($"Content type {input.DocumentTypeId} does not exist");

            var documentationPageType = ContentTypeService.Get(Settings.DocumentationDocumentTypeAlias)
                ?? throw new ArgumentException($"Documentation content type {input.DocumentTypeId} does not exist");

            var roots = ContentService.GetRootContent();

            foreach (var root in roots)
            {
                var parent = FindDocumentationParentForPageType(SubFolder, documentationPageType, contentType, root);

                if(parent == null)
                {
                    continue;
                }

                var model = new ContentCreateModel
                {
                    ContentTypeKey = input.DocumentTypeId,
                    InvariantName = $"{contentType.Name}",
                    ParentKey = parent.Key,
                    Key = Guid.NewGuid()
                };

                await ContentEditingService.CreateAsync(model, userKey);
            } 
        }

        public async Task<CheckResult?> RunCheck(TCheck input)
        {
            var documentTypeId = input.DocumentTypeId;

            var roots = ContentService.GetRootContent();

            var documentationPageType = ContentTypeService.Get(Settings.DocumentationDocumentTypeAlias);
            var contentType = ContentTypeService.Get(documentTypeId);

            if (documentationPageType == null || contentType == null)
            {
                return null;
            }

            foreach (var root in roots)
            {
                var foundPage = FindDocumentationPageForPageType(SubFolder, documentationPageType, contentType, root);

                if (foundPage != null)
                {
                    return new CheckResult
                    {
                        IsOk = true,
                        Message = "Has documentation page",
                        ActionUrl = $"/umbraco/section/content/workspace/document/edit/{foundPage.Key}/invariant/tab/content",
                        ActionButtonText = "Go"
                    };
                }
            }

            return new CheckResult
            {
                IsOk = false,
                Message = "No documentation page created",
                ActionName = ActionName,
                ActionButtonText = "Create"
            };
        }

        private IContent? FindDocumentationPageForPageType(string subfolder, IContentType documentationPageType, IContentType contentType, IContent root)
        {
            var subfolderPage = FindDocumentationParentForPageType(subfolder, documentationPageType, contentType, root);

            if (subfolderPage == null)
            {
                return null;
            }

            var docPage = GetChildByDocType(subfolderPage, contentType.Id);

            return docPage;
        }

        private IContent? FindDocumentationParentForPageType(string subfolder, IContentType documentationPageType, IContentType contentType, IContent root)
        {
            var docsRootPage = GetChildByDocType(root, documentationPageType.Id);

            if (docsRootPage == null)
            {
                return null;
            }

            return GetChildByName(docsRootPage, subfolder);
        }

        private IContent? GetChildByDocType(IContent parent, int docTypeId)
        {
            var children = ContentService.GetPagedChildren(parent.Id, 0, 100, out _);
            return children.FirstOrDefault(r => r.ContentTypeId == docTypeId);
        }

        private IContent? GetChildByName(IContent parent, string childName)
        {
            var children = ContentService.GetPagedChildren(parent.Id, 0, 100, out _);
            return children.FirstOrDefault(child => childName.Equals(child?.Name, StringComparison.OrdinalIgnoreCase));
        }
    }
}
