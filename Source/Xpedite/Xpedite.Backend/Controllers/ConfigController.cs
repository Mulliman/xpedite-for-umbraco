using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration.Models;
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
    public class ConfigController(XpediteSettings settings, IOptions<DeliveryApiSettings> deliveryApiSettings) : Controller
    {
        private readonly XpediteSettings _settings = settings;
        private readonly IOptions<DeliveryApiSettings> _deliveryApiSettings = deliveryApiSettings;

        [HttpGet("get-config")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(ConfigModel), StatusCodes.Status200OK)]
        public async Task<ActionResult<ConfigModel>> GetConfig()
        {
            return Ok(new ConfigModel
            {
                CodebaseSrcPath = _settings.CodebaseSrcPath,
                TemplatesRootFolderPath = _settings.TemplatesRootFolderPath,
                IsDeliveryApiEnabled = _deliveryApiSettings.Value?.Enabled ?? false,
                IsXpediteTypescriptCodeInstalled = DoesFileExistInSrcFolder("umbraco\\types.ts"),
                IsReactTestingInstalled = DoesFileExistInSrcFolder("..\\jest.config.ts"),
            });
        }

        private bool DoesFileExistInSrcFolder(string partialPath)
        {
            if(string.IsNullOrWhiteSpace(partialPath)) return false;
            if (string.IsNullOrWhiteSpace(_settings.CodebaseSrcPath)) return false;

            var combinedPath = Path.Combine(_settings.CodebaseSrcPath, partialPath);
            var filePath = Path.GetFullPath(combinedPath);

            return System.IO.File.Exists(filePath);
        }

        private bool DoesFileExist(string filePath)
        {
            return System.IO.File.Exists(filePath);
        }
    }
}
