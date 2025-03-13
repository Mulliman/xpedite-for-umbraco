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

namespace Xpedite.Generator.TestData
{
    public class PageTestDataGenerator(IPublishedContentCache publishedContentCache,
        IApiContentResponseBuilder apiContentResponseBuilder)
    {
        private readonly IPublishedContentCache _publishedContentCache = publishedContentCache;
        private readonly IApiContentResponseBuilder _apiContentResponseBuilder = apiContentResponseBuilder;

        public async Task<KeyValuePair<string, string>?> GeneratePageJson(Guid id)
        {
            var contentItem = await _publishedContentCache.GetByIdAsync(id, true);

            if (contentItem == null)
            {
                return null;
            }

            return GeneratePageJson(contentItem);
        }

        public async Task<KeyValuePair<string, string>?> GeneratePageJson(string path)
        {
            var contentItem = _publishedContentCache.GetByRoute(true, "/");

            if (contentItem == null)
            {
                return null;
            }

            return GeneratePageJson(contentItem);
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
    }
}