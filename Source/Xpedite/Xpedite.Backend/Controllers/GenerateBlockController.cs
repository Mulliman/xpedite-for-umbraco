using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Web.Common.Authorization;
using Xpedite.Backend.Codebase;
using Xpedite.Backend.InputMappers;
using Xpedite.Backend.Models;
using Xpedite.Generator;
using Xpedite.Generator.NextJs;

namespace Xpedite.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("xpedite-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/xpedite")]
    public class GenerateBlockController : Controller
    {
        private readonly XpediteSettings _settings;
        private readonly NextJsBlockGenerator _generator;
        private readonly BlockMapper _mapper;
        private readonly CodebaseUpdater _codebaseUpdater;

        public GenerateBlockController(XpediteSettings settings, BlockMapper mapper, CodebaseUpdater codebaseUpdater)
        {
            _settings = settings;
            _mapper = mapper;
            _codebaseUpdater = codebaseUpdater;

            var fieldRenderer = new FileBasedFieldRenderer(_settings.TemplatesRootFolderPath);
            _generator = new NextJsBlockGenerator(settings.TemplatesRootFolderPath, fieldRenderer);
        }

        [HttpPost("generate-block")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(GeneratedFiles), StatusCodes.Status200OK)]
        public async Task<ActionResult<GeneratedFiles>> GenerateBlock([FromBody] GenerateBlockApiModel model)
        {
            GeneratedFiles generatedFiles = await GenerateBlockFiles(model);

            return Ok(generatedFiles);
        }

        [HttpPost("save-block")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> SaveBlock([FromBody] GenerateBlockApiModel model, bool force = false)
        {
            var generatedFiles = await GenerateBlockFiles(model);

            if (generatedFiles == null)
            {
                return BadRequest();
            }

            var result = await _codebaseUpdater.ApplyFilesToCodebase(generatedFiles, force)
                ?? throw new Exception("ApplyFilesToCodebase returned null");

            return result.WasSuccessful ? Ok() : Conflict(new { result.Message });
        }

        private async Task<GeneratedFiles> GenerateBlockFiles(GenerateBlockApiModel model)
        {
            var inputData = await _mapper.MapToNextJsBlockInput(model);
            var generatedFiles = await _generator.GenerateFiles(inputData);

            generatedFiles.GroupName = inputData.Name;

            return generatedFiles;
        }
    }
}
