using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Xpedite.Backend.Assistant.Documentation;
using Xpedite.Backend.Codebase;
using Xpedite.Backend.InputMappers;
using Xpedite.Backend.Models;
using Xpedite.Backend.TestItems;
using Xpedite.Generator;
using Xpedite.Generator.NextJs;
using Xpedite.Generator.TestData;

namespace Xpedite.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("xpedite-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/xpedite")]
    public class GenerateTemplateController : Controller
    {
        private readonly XpediteSettings _settings;
        private readonly NextJsTemplateGenerator _generator;
        private readonly TemplateMapper _templateMapper;
        private readonly CodebaseUpdater _codebaseUpdater;
        private readonly TestItemResolver _testItemResolver;

        public GenerateTemplateController(XpediteSettings settings,
            TemplateMapper templateMapper,
            CodebaseUpdater codebaseUpdater,
            PageTestDataGenerator pageTestDataGenerator,
            TestItemResolver testItemResolver)
        {
            _settings = settings;
            _templateMapper = templateMapper;
            _codebaseUpdater = codebaseUpdater;
            _testItemResolver = testItemResolver;

            var fieldRenderer = new FileBasedFieldRenderer(_settings.TemplatesRootFolderPath);
            _generator = new NextJsTemplateGenerator(settings.TemplatesRootFolderPath, fieldRenderer, pageTestDataGenerator);
        }

        [HttpPost("generate-template")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(GeneratedFiles), StatusCodes.Status200OK)]
        public async Task<ActionResult<GeneratedFiles>> GenerateTemplate([FromBody] GenerateApiModel model)
        {
            GeneratedFiles generatedFiles = await GenerateTemplateFiles(model);

            return Ok(generatedFiles);
        }

        [HttpPost("save-template")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> SaveTemplate([FromBody] GenerateApiModel model, bool force = false)
        {
            var generatedFiles = await GenerateTemplateFiles(model);

            if (generatedFiles == null)
            {
                return BadRequest();
            }

            var result = await _codebaseUpdater.ApplyFilesToCodebase(generatedFiles, force)
                ?? throw new Exception("ApplyFilesToCodebase returned null");

            return result.WasSuccessful ? Ok() : Conflict(new { result.Message });
        }

        private async Task<GeneratedFiles> GenerateTemplateFiles(GenerateApiModel model)
        {
            var inputData = await _templateMapper.MapToNextJsInput(model);

            inputData.PageToCreateTestDataFrom = _testItemResolver.FindSpecificItem(model?.TestItem)
                ?? await _testItemResolver.FindDocumentationPageForTemplate(model?.DocumentTypeId);

            var generatedFiles = await _generator.GenerateFiles(inputData);

            generatedFiles.GroupName = inputData.Name;

            return generatedFiles;
        }
    }
}
