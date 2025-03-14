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
using Xpedite.Generator;
using Xpedite.Generator.NextJs;
using Xpedite.Generator.TestData;

namespace Xpedite.Backend.Controllers;

[ApiController]
[ApiVersion("1.0")]
[MapToApi("xpedite-api-v1")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
[Route("api/v{version:apiVersion}/xpedite")]
public class GeneratePartialController : Controller
{
    private readonly XpediteSettings _settings;
    private readonly NextJsPartialGenerator _generator;
    private readonly PartialMapper _templateMapper;
    private readonly CodebaseUpdater _codebaseUpdater;
    private readonly DocumentationPageFinder _documentationPageFinder;
    private readonly IContentService _contentService;

    public GeneratePartialController(XpediteSettings settings,
        PartialMapper templateMapper,
        CodebaseUpdater codebaseUpdater,
        PartialTestDataGenerator partialTestDataGenerator,
        DocumentationPageFinder documentationPageFinder,
        IContentService contentService)
    {
        _settings = settings;
        _templateMapper = templateMapper;
        _codebaseUpdater = codebaseUpdater;
        _documentationPageFinder = documentationPageFinder;
        _contentService = contentService;

        var fieldRenderer = new FileBasedFieldRenderer(_settings.TemplatesRootFolderPath);
        _generator = new NextJsPartialGenerator(settings.TemplatesRootFolderPath, fieldRenderer, partialTestDataGenerator);
    }

    [HttpPost("generate-partial")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(GeneratedFiles), StatusCodes.Status200OK)]
    public async Task<ActionResult<GeneratedFiles>> GeneratePartial([FromBody] GenerateApiModel model)
    {
        GeneratedFiles generatedFiles = await GeneratePartialFiles(model);

        return Ok(generatedFiles);
    }


    [HttpPost("save-partial")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
    public async Task<ActionResult> SavePartial([FromBody] GenerateApiModel model, bool force = false)
    {
        var generatedFiles = await GeneratePartialFiles(model);

        if (generatedFiles == null)
        {
            return BadRequest();
        }

        var result = await _codebaseUpdater.ApplyFilesToCodebase(generatedFiles, force)
            ?? throw new Exception("ApplyFilesToCodebase returned null");

        return result.WasSuccessful ? Ok() : Conflict(new { result.Message });
    }

    private async Task<GeneratedFiles> GeneratePartialFiles(GenerateApiModel model)
    {
        var inputData = await _templateMapper.MapToNextJsInput(model);

        if(model.TestItem != null)
        {
            var testItem = _contentService.GetById(model.TestItem.Value);

            if(testItem != null)
            {
                inputData.PageToCreateTestDataFrom = testItem;
            }
        }

        var generatedFiles = await _generator.GenerateFiles(inputData);

        generatedFiles.GroupName = inputData.Name;

        return generatedFiles;
    }
}
