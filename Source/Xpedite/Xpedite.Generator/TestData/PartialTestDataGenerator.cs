using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Models.DeliveryApi;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using Umbraco.Extensions;
using Umbraco.Cms.Api.Delivery.Rendering;
using static Umbraco.Cms.Core.Collections.TopoGraph;

namespace Xpedite.Generator.TestData
{
    public class PartialTestDataGenerator(IPublishedContentCache publishedContentCache,
        IApiContentResponseBuilder apiContentResponseBuilder,
        IApiPropertyRenderer propertyRenderer)
    {
        private readonly IPublishedContentCache _publishedContentCache = publishedContentCache;
        private readonly IApiContentResponseBuilder _apiContentResponseBuilder = apiContentResponseBuilder;
        private readonly IApiPropertyRenderer _propertyRenderer = propertyRenderer;

        public async Task<KeyValuePair<string, string>?> GeneratePageJson(Guid id)
        {
            var contentItem = await _publishedContentCache.GetByIdAsync(id, true);

            if (contentItem == null)
            {
                return null;
            }

            return GeneratePartialJson(contentItem);
        }

        //public async Task<KeyValuePair<string, string>?> GeneratePageJson(string path)
        //{
        //    var contentItem = _publishedContentCache.GetByRoute(true, path);

        //    if (contentItem == null)
        //    {
        //        return null;
        //    }

        //    return GeneratePageJson(contentItem);
        //}

        private KeyValuePair<string, string>? GeneratePageJson(IPublishedContent? contentItem)
        {
            IApiContentResponse? apiContentResponse = _apiContentResponseBuilder.Build(contentItem);

            if (apiContentResponse is null)
            {
                return null;
            }

            var jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                TypeInfoResolver = new Umbraco.Cms.Api.Delivery.Json.DeliveryApiJsonTypeResolver(),
                WriteIndented = true 
            };

            jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

            string json = JsonSerializer.Serialize(apiContentResponse, jsonSerializerOptions);
            var variableName = new ValidVariableName(contentItem.Name, "valid");

            return new KeyValuePair<string, string>($"{variableName.Value}TestData", json);
        }

        private KeyValuePair<string, string>? GeneratePartialJson(IPublishedContent? contentItem)
        {
            var dictionary = MapProperties(contentItem.Properties);

            var jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                TypeInfoResolver = new Umbraco.Cms.Api.Delivery.Json.DeliveryApiJsonTypeResolver(),
                WriteIndented = true 
            };

            jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

            string json = JsonSerializer.Serialize(dictionary, jsonSerializerOptions);
            var variableName = new ValidVariableName(contentItem.Name, "valid");

            return new KeyValuePair<string, string>($"{variableName.Value}TestData", json);
        }

        private IDictionary<string, object?> MapProperties(IEnumerable<IPublishedProperty> properties)
        {
            var result = new Dictionary<string, object?>();
            foreach (IPublishedProperty property in properties)
            {
                result[property.Alias] = _propertyRenderer.GetPropertyValue(property, true);
            }

            return result;
        }
    }
}