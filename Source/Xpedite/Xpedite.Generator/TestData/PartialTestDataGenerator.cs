﻿using Microsoft.Extensions.Options;
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

        public async Task<KeyValuePair<string, string>?> GeneratePageJson(Guid id, bool isEntirePage, IEnumerable<string?>? propertyAliases)
        {
            var contentItem = await _publishedContentCache.GetByIdAsync(id, true);

            if (contentItem == null)
            {
                return null;
            }

            return isEntirePage ? GeneratePageJson(contentItem) : GeneratePartialJson(contentItem, propertyAliases);
        }

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

        private KeyValuePair<string, string>? GeneratePartialJson(IPublishedContent contentItem, IEnumerable<string?>? propertyAliases)
        {
            if(contentItem == null) { return null; }

            var propertiesToMap = propertyAliases?.Any() == true
                ? contentItem.Properties?.Where(p => propertyAliases?.Contains(p.Alias) == true)
                : contentItem.Properties;

            var dictionary = MapProperties(propertiesToMap);

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

        private IDictionary<string, object?> MapProperties(IEnumerable<IPublishedProperty>? properties)
        {
            var result = new Dictionary<string, object?>();

            if(properties == null)
            {
                return result;
            }

            foreach (IPublishedProperty property in properties)
            {
                result[property.Alias] = _propertyRenderer.GetPropertyValue(property, true);
            }

            return result;
        }
    }
}