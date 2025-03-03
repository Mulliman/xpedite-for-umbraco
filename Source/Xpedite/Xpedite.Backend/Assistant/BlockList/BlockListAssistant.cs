using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.ContentEditing;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using static Umbraco.Cms.Core.PropertyEditors.BlockListConfiguration;

namespace Xpedite.Backend.Assistant.BlockList
{
    public class BlockListAssistant(IDataTypeService dataTypeService,
        IContentTypeService contentTypeService,
        IConfigurationEditorJsonSerializer serializer) : IAssistantAction<BlockActionInput>, IAssistantCheck<BlockCheckInput>
    {
        private const string PropertyEditorAlias = "Umbraco.BlockList";
        private readonly IDataTypeService _dataTypeService = dataTypeService;
        private readonly IContentTypeService _contentTypeService = contentTypeService;
        private readonly IConfigurationEditorJsonSerializer _serializer = serializer;

        public string ActionName => "addToAllBlockLists";

        public async Task RunAction(BlockActionInput input, Guid userKey)
        {
            var contentType = await _contentTypeService.GetAsync(input.DocumentTypeId)
                ?? throw new ArgumentException($"Content type {input.DocumentTypeId} does not exist");

            var configEditor = new ConfigurationEditor();

            var editors = await _dataTypeService.GetByEditorAliasAsync(PropertyEditorAlias);

            foreach (var editor in editors)
            {
                var config = editor.ConfigurationAs<BlockListConfiguration>();

                if (config == null)
                {
                    continue;
                }

                var newBlock = new BlockConfiguration { ContentElementTypeKey = contentType.Key, SettingsElementTypeKey = input?.SettingsTypeId };

                config.Blocks = [.. config.Blocks, newBlock];

                editor.ConfigurationData = configEditor.FromConfigurationObject(config, _serializer);

                await _dataTypeService.UpdateAsync(editor, userKey);
            }
        }

        public async Task<CheckResult?> RunCheck(BlockCheckInput input)
        {
            ArgumentNullException.ThrowIfNull(input, nameof(input));

            return await CheckIncludedInBlockLists(input.DocumentTypeId, input.SettingsTypeId);
        }

        private bool DoesEditorIncludeBlock(IDataType editor, Guid contentBlockTypeId, Guid? settingsTypeId)
        {
            var config = editor.ConfigurationAs<BlockListConfiguration>();

            if (config == null) 
            {
                return false;
            }

            return settingsTypeId.HasValue
                ? config.Blocks.Any(b => b.ContentElementTypeKey == contentBlockTypeId && b.SettingsElementTypeKey == settingsTypeId)
                : config.Blocks.Any(b => b.ContentElementTypeKey == contentBlockTypeId);
        }

        private async Task<CheckResult?> CheckIncludedInBlockLists(Guid documentTypeId, Guid? settingsTypeId)
        {
            var editors = await _dataTypeService.GetByEditorAliasAsync(PropertyEditorAlias);

            if (editors.Any(e => DoesEditorIncludeBlock(e, documentTypeId, settingsTypeId)))
            {
                return new CheckResult
                {
                    IsOk = true,
                    Message = settingsTypeId.HasValue ? "Is in block list(s)" : "Is in block list(s)"
                };
            }

            return new CheckResult
            {
                IsOk = false,
                Message = settingsTypeId.HasValue ? "Not in any block lists" : "Not in any block lists",
                ActionButtonText = "Add to all",
                ActionName = ActionName
            };
        }
    }
}
