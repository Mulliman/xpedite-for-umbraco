using System.Text.Json;
using System.Text.Json.Serialization;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models.DeliveryApi;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Extensions;

namespace Xpedite.Generator.TestData
{
    public class BlockTestDataGenerator(IPublishedContentCache publishedContentCache,
        IApiPropertyRenderer propertyRenderer)
    {
        private readonly IPublishedContentCache _publishedContentCache = publishedContentCache;
        private readonly IApiPropertyRenderer _propertyRenderer = propertyRenderer;

        private const string PropertyEditorAlias = "Umbraco.BlockList";

        public async Task<Dictionary<string, string>?> GenerateBlocksJson(Guid id, string contentTypeAlias, string? settingsTypeAlias)
        {
            var contentItem = await _publishedContentCache.GetByIdAsync(id, true);

            if (contentItem == null)
            {
                return null;
            }

            return GenerateBlocksJson(contentItem, contentTypeAlias, settingsTypeAlias);
        }

        private Dictionary<string, string>? GenerateBlocksJson(IPublishedContent? contentItem, string contentTypeAlias, string? settingsTypeAlias)
        {
            if(contentItem == null)
            {
                return null;
            }

            var blockLists = contentItem.Properties.Where(p => p.PropertyType?.DataType.EditorAlias == PropertyEditorAlias);

            var dictionary = MapProperties(contentItem.Properties, contentTypeAlias, settingsTypeAlias);

            var jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                TypeInfoResolver = new Umbraco.Cms.Api.Delivery.Json.DeliveryApiJsonTypeResolver(),
                WriteIndented = true
            };

            jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

            var dictToReturn = new Dictionary<string, string>();

            foreach(var pair in dictionary)
            {
                string json = JsonSerializer.Serialize(pair.Value, jsonSerializerOptions);
                var variableName = new ValidVariableName(pair.Key, "valid");

                dictToReturn.Add(variableName.Value, json);
            }

            return dictToReturn;
        }

        private IDictionary<string, object?> MapProperties(IEnumerable<IPublishedProperty> properties, string contentTypeAlias, string? settingsTypeAlias)
        {
            var result = new Dictionary<string, object?>();

            foreach (IPublishedProperty property in properties)
            {
                var rawVal = _propertyRenderer.GetPropertyValue(property, true);

                if (rawVal is not ApiBlockListModel typedVal)
                {
                    continue;
                }

                var validItems = typedVal.Items.Where(i => i.Content.ContentType == contentTypeAlias && (settingsTypeAlias == null || settingsTypeAlias == i.Settings?.ContentType));

                foreach (var validItem in validItems)
                {
                    var variableName = $"{contentTypeAlias}TestData_{validItem.Content.Id.ToString()[..6]}";
                    result[variableName] = validItem;
                }
            }

            return result;
        }
    }
}