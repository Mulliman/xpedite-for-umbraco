using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;

namespace Xpedite.Backend.Security;

public class AddXpediteSectionNotificationHandler(IRuntimeState runtimeState,
    XpediteSettings xpediteSettings,
    IUserService userService,
    IUserGroupService userGroupService,
    ILogger<AddXpediteSectionNotificationHandler> logger) : INotificationAsyncHandler<UmbracoApplicationStartedNotification>
{
    private readonly IRuntimeState _runtimeState = runtimeState;
    private readonly XpediteSettings _xpediteSettings = xpediteSettings;
    private readonly IUserService _userService = userService;
    private readonly IUserGroupService _userGroupService = userGroupService;
    private readonly ILogger<AddXpediteSectionNotificationHandler> _logger = logger;

    public async Task HandleAsync(UmbracoApplicationStartedNotification notification, CancellationToken cancellationToken)
    {
        _logger.LogWarning("xpedite - Automatically adding section to admin users. Update the AutoAddSectionToAdminUser in appsettings if you want to disabled this.");

        if (_runtimeState.Level >= RuntimeLevel.Run)
        {
            if (!_xpediteSettings.AutoAddSectionToAdminUser)
            {
                _logger.LogWarning("xpedite - Disabled in config. Skipping adding section to admin");
                return;
            }

            var adminUser = _userService.GetUserById(-1);

            if (adminUser == null)
            {
                _logger.LogWarning("xpedite - Admin user not found. Skipping adding section to admin");
                return;
            }

            var group = await _userGroupService.GetAsync("admin");

            if (group == null)
            {
                return;
            }

            const string sectionName = "xpedite.Section";

            if (group.AllowedSections.All(s => s != sectionName))
            {
                group.AddAllowedSection(sectionName);

                var updateAttempt = await _userGroupService.UpdateAsync(group, adminUser.Key);

                if (!updateAttempt.Success)
                    _logger.LogError(updateAttempt.Exception, "xpedite - Failed to update user group.");
            }
        }
    }
}