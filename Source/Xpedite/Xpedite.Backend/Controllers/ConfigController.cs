using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Text;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Web.Common.Authorization;
using Xpedite.Backend.Models;

namespace Xpedite.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("xpedite-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/xpedite")]
    public class ConfigController(XpediteSettings settings,
        IOptions<DeliveryApiSettings> deliveryApiSettings,
        IOptions<SwaggerGenOptions> swaggerOptions,
        IPublishedContentQuery publishedContentQuery,
        IServiceProvider serviceProvider) : Controller
    {
        private readonly XpediteSettings _settings = settings;
        private readonly IOptions<DeliveryApiSettings> _deliveryApiSettings = deliveryApiSettings;
        private readonly IOptions<SwaggerGenOptions> _swaggerOptions = swaggerOptions;
        private readonly IPublishedContentQuery _publishedContentQuery = publishedContentQuery;
        //private readonly IServiceProvider _serviceProvider = serviceProvider;

        private const string DeliveryApiName = "delivery";

        [HttpGet("get-config")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(ConfigModel), StatusCodes.Status200OK)]
        public ActionResult<ConfigModel> GetConfig()
        {
            return Ok(new ConfigModel
            {
                CodebaseSrcPath = _settings.CodebaseSrcPath,
                TemplatesRootFolderPath = _settings.TemplatesRootFolderPath,
                IsDeliveryApiInstalled = IsDeliveryApiInstalled(),
                IsDeliveryApiEnabled = _deliveryApiSettings.Value?.Enabled ?? false,
                IsXpediteTypescriptCodeInstalled = DoesFileExistInSrcFolder("umbraco\\types.ts"),
                IsNextJsInstalled = DoesFileExistInSrcFolder("..\\next.config.ts"),
                IsReactTestingInstalled = DoesFileExistInSrcFolder("..\\jest.config.ts"),
                IsEnvFileInstalled = DoesFileExistInSrcFolder("..\\.env"),
                IsContentInPlace = IsUmbracoContentPublished()
            });
        }

        [HttpPost("add-env-file")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddEnvFile()
        {
            const string filePath = "..\\.env";
            var alreadyExists = DoesFileExistInSrcFolder(filePath);

            if (alreadyExists == null)
            {
                return BadRequest();
            }

            if (alreadyExists == true)
            {
                return Conflict();
            }

            var url = $"{Request.Scheme}://{Request.Host}";
            var apiKey = _deliveryApiSettings.Value?.ApiKey;

            var fileContents = new StringBuilder();
            fileContents.AppendLine("UMBRACO_SERVER_URL=" + url);

            if (!string.IsNullOrEmpty(apiKey))
            {
                fileContents.AppendLine("UMBRACO_DELIVERY_API_KEY=" + apiKey);
            }

            var envFilePath = GetFullSrcPath(filePath);
            await System.IO.File.WriteAllTextAsync(envFilePath, fileContents.ToString());

            return Ok();
        }

        private bool IsDeliveryApiInstalled()
        {
            return _swaggerOptions.Value?.SwaggerGeneratorOptions.SwaggerDocs.Keys.Any(k => k == DeliveryApiName) ?? false;
        }

        private bool IsUmbracoContentPublished()
        {
            var foundItem = _publishedContentQuery.ContentAtRoot()?.FirstOrDefault(c => c.IsPublished());

            return foundItem != null;
        }

        private bool? DoesFileExistInSrcFolder(string partialPath)
        {
            if(string.IsNullOrWhiteSpace(partialPath)) return null;
            if (string.IsNullOrWhiteSpace(_settings.CodebaseSrcPath)) return null;

            var filePath = GetFullSrcPath(partialPath);

            return System.IO.File.Exists(filePath);
        }

        private string GetFullSrcPath(string partialPath)
        {
            if (string.IsNullOrWhiteSpace(_settings.CodebaseSrcPath)) throw new Exception("CodebaseSrcPath not set");

            var combinedPath = Path.Combine(_settings.CodebaseSrcPath, partialPath);
            var filePath = Path.GetFullPath(combinedPath);

            return filePath;
        }

        private bool DoesFileExist(string filePath)
        {
            return System.IO.File.Exists(filePath);
        }
    }
}
