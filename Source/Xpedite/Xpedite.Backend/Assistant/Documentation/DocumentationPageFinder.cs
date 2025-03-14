using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Documentation
{
    public class DocumentationPageFinder(IContentService contentService, IContentTypeService contentTypeService)
    {
        private readonly IContentService _contentService = contentService;
        protected readonly IContentTypeService ContentTypeService = contentTypeService;

        public async Task<IContent?> FindDocumentationPageForPageType(string subfolder, string documentationPageTypeAlias, Guid contentTypeIdToFind)
        {
            var contentType = await ContentTypeService.GetAsync(contentTypeIdToFind)
                ?? throw new ArgumentException($"Content type {contentTypeIdToFind} does not exist");

            var documentationPageType = ContentTypeService.Get(documentationPageTypeAlias)
                ?? throw new ArgumentException($"Documentation content type {documentationPageTypeAlias} does not exist");

            var roots = _contentService.GetRootContent();

            foreach (var root in roots)
            {
                var foundItem = FindDocumentationPageForPageType(subfolder, documentationPageType, contentType, root);

                if (foundItem != null)
                {
                    return foundItem;
                }
            }

            return null;
        }

        public IContent? FindDocumentationPageForPageType(string subfolder, IContentType documentationPageType, IContentType contentTypeToFind)
        {
            var roots = _contentService.GetRootContent();

            foreach (var root in roots)
            {
                var foundItem = FindDocumentationPageForPageType(subfolder, documentationPageType, contentTypeToFind, root);

                if (foundItem != null)
                {
                    return foundItem;
                }
            }

            return null;
        }

        public IContent? FindDocumentationPageForPageType(string subfolder, IContentType documentationPageType, IContentType contentTypeToFind, IContent root)
        {
            var subfolderPage = FindDocumentationParent(subfolder, documentationPageType, root);

            if (subfolderPage == null)
            {
                return null;
            }

            var docPage = GetChildByDocType(subfolderPage, contentTypeToFind.Id);

            return docPage;
        }

        public IContent? FindDocumentationPageForPageName(string subfolder, string documentationPageTypeAlias, string pageName)
        {
            var documentationPageType = ContentTypeService.Get(documentationPageTypeAlias)
                ?? throw new ArgumentException($"Documentation content type {documentationPageTypeAlias} does not exist");

            return FindDocumentationPageForPageName(subfolder, documentationPageType, pageName);
        }

        public IContent? FindDocumentationPageForPageName(string subfolder, IContentType documentationPageType, string pageName)
        {
            var roots = _contentService.GetRootContent();

            foreach (var root in roots)
            {
                var foundItem = FindDocumentationPageForPageName(subfolder, documentationPageType, pageName, root);

                if (foundItem != null)
                {
                    return foundItem;
                }
            }

            return null;
        }

        public IContent? FindDocumentationPageForPageName(string subfolder, IContentType documentationPageType, string pageName, IContent root)
        {
            var subfolderPage = FindDocumentationParent(subfolder, documentationPageType, root);

            if (subfolderPage == null || pageName == null)
            {
                return null;
            }

            var docPage = GetChildByName(subfolderPage, pageName);

            return docPage;
        }

        public IContent? FindDocumentationParent(string subfolder, IContentType documentationPageType, IContent root)
        {
            var docsRootPage = GetChildByDocType(root, documentationPageType.Id);

            if (docsRootPage == null)
            {
                return null;
            }

            return GetChildByName(docsRootPage, subfolder);
        }

        public IContent? GetChildByDocType(IContent parent, int docTypeId)
        {
            // Feels like there'll be a better way to do this if performance becomes an issue
            var children = _contentService.GetPagedChildren(parent.Id, 0, 100, out _);
            return children.FirstOrDefault(r => r.ContentTypeId == docTypeId);
        }

        public IContent? GetChildByName(IContent parent, string childName)
        {
            // Feels like there'll be a better way to do this if performance becomes an issue
            var children = _contentService.GetPagedChildren(parent.Id, 0, 100, out _);
            return children.FirstOrDefault(child => childName.Equals(child?.Name, StringComparison.OrdinalIgnoreCase));
        }
    }
}
