using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Extensions;
using Umbraco.Cms.Core.Models.ContentEditing;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Assistant.Blueprints
{
    public class BlueprintAssistant(IContentBlueprintEditingService contentBlueprintEditingService,
        IContentTypeService contentTypeService) : IAssistantAction<ActionInput>, IAssistantCheck<CheckInput>
    {
        private readonly IContentBlueprintEditingService _contentBlueprintEditingService = contentBlueprintEditingService;
        private readonly IContentTypeService _contentTypeService = contentTypeService;

        public string ActionName => "createBlueprint";

        public async Task RunAction(ActionInput input, Guid userKey)
        {
            var contentType = await _contentTypeService.GetAsync(input.DocumentTypeId) 
                ?? throw new ArgumentException($"Content type {input.DocumentTypeId} does not exist");

            var model = new ContentBlueprintCreateModel
            {
                ContentTypeKey = input.DocumentTypeId,
                InvariantName = $"{contentType.Name} - Default",
                Key = Guid.NewGuid(),
            };

            await _contentBlueprintEditingService.CreateAsync(model, userKey);
        }

        public async Task<CheckResult?> RunCheck(CheckInput input)
        {
            ArgumentNullException.ThrowIfNull(input, nameof(input));

            return await CheckForBlueprint(input.DocumentTypeId);
        }

        private async Task<CheckResult?> CheckForBlueprint(Guid documentTypeId)
        {
            var blueprintAttempt = await _contentBlueprintEditingService.GetPagedByContentTypeAsync(documentTypeId, 0, 100);

            if (blueprintAttempt.Success is false || blueprintAttempt.Result == null)
            {
                return null;
            }

            var blueprint = blueprintAttempt.Result;
            var items = blueprint.Items.ToList();

            if (items.Count == 0)
            {
                return new CheckResult
                {
                    IsOk = false,
                    Message = "No blueprint created",
                    ActionButtonText = "Create",
                    ActionName = "createBlueprint"
                };
            }

            var link = items.Count == 1
                 ? $"/umbraco/section/settings/workspace/document-blueprint/edit/{items.First().Key}/invariant/tab/content"
                 : null;

            return new CheckResult
            {
                IsOk = true,
                Message = items.Count > 1 ? "Has multiple blueprints configured" : "Has blueprint configured",
                ActionButtonText = link != null ? "Go" : null,
                ActionUrl = link
            };
        }
    }
}
