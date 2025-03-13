using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Xpedite.Backend.Assistant;
using Xpedite.Backend.Assistant.Blueprints;
using Xpedite.Backend.Assistant.Documentation;

namespace Xpedite.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("xpedite-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/xpedite")]
    public class AssistantTemplateController(XpediteSettings settings,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        BlueprintAssistant blueprintAssistant,
        TemplateDocumentationAssistant templateDocumentationAssistant,
        TemplateAllowedChildOfDocumentationPageAssistant allowedChildAssistant) : ManagementApiControllerBase
    {
        private readonly XpediteSettings _settings = settings;
        private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        private readonly BlueprintAssistant _blueprintAssistant = blueprintAssistant;
        private readonly TemplateDocumentationAssistant _templateDocumentationAssistant = templateDocumentationAssistant;
        private readonly TemplateAllowedChildOfDocumentationPageAssistant _allowedChildAssistant = allowedChildAssistant;

        private List<IAssistantCheck<CheckInput>> Checks => [ _blueprintAssistant, _allowedChildAssistant, _templateDocumentationAssistant];
        private List<IAssistantAction<ActionInput>> Actions => [_blueprintAssistant, _allowedChildAssistant, _templateDocumentationAssistant];

        [HttpPost("assistant-template-checks")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(List<CheckResult>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CheckResult>>> TemplateChecks([FromBody] CheckInput input)
        {
            var documentTypeId = input.DocumentTypeId;
            List<CheckResult> checks = await GetChecks(input);

            return Ok(checks);
        }

        [HttpPost("assistant-template-action")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(List<CheckResult>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CheckResult>>> TemplateAction([FromBody] ActionInputModel input)
        {
            var documentTypeId = input.DocumentTypeId;

            var action = Actions.FirstOrDefault(a => a.ActionName == input.ActionName);

            if(action == null)
            {
                return BadRequest("Action Name provided does not have an implementation.");
            }

            await action.RunAction(input, CurrentUserKey(_backOfficeSecurityAccessor));

            List<CheckResult> checks = await GetChecks(new CheckInput { DocumentTypeId = documentTypeId });

            return Ok(checks);
        }

        private async Task<List<CheckResult>> GetChecks(CheckInput input)
        {
            var tasks = Checks.Select(c => c.RunCheck(input)).ToList();
            var results = await Task.WhenAll(tasks);

            return results.Where(r => r != null).Cast<CheckResult>().ToList();
        }

        public class ActionInputModel : ActionInput
        {
            public string? ActionName { get; set; }
        }

    }
}
