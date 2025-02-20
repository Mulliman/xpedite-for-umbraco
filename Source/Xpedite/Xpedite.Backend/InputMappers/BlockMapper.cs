using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xpedite.Backend.Models;
using Xpedite.Generator;
using Xpedite.Generator.NextJs;

namespace Xpedite.Backend.InputMappers;

public class BlockMapper(IContentTypeService contentTypeService, IDataTypeService dataTypeService)
    : NextJsMapper<GenerateBlockApiModel>(contentTypeService, dataTypeService)
{
    public async Task<NextJsBlockInput> MapToNextJsBlockInput(GenerateBlockApiModel model)
    {
        var contentType = ContentTypeService.Get(model.DocumentTypeId) ?? throw new ArgumentException("Invalid document type ID", nameof(model.DocumentTypeId));

        var propertyTokens = await GeneratePropertyTokens(model, contentType);
        var settingTokens = await CreateSettingTokens(model);

        var name = GetComponentName(model, contentType);

        return new NextJsBlockInput(name, propertyTokens, settingTokens);
    }

    private async Task<List<PropertyTokens>> CreateSettingTokens(GenerateBlockApiModel model)
    {
        if (model.SettingsTypeId == null)
        {
            return [];
        }

        var settingsContentType = ContentTypeService.Get(model.SettingsTypeId.Value);
        var settingTokens = settingsContentType != null ? await GenerateSettingTokens(model, settingsContentType) : [];

        return settingTokens;
    }

    protected virtual async Task<List<PropertyTokens>> GenerateSettingTokens(GenerateBlockApiModel model, IContentType contentType)
    {
        if (model.SelectedSettings == null)
        {
            return [];
        }

        var selectedProperties = GetSelectedProperties(model.SelectedSettings, contentType);

        return (await Task.WhenAll(selectedProperties.Select(CreatePropertyTokens))).ToList();
    }
}