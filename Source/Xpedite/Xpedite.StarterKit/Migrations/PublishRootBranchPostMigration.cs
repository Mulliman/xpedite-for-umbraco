using System.Linq;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Xpedite.StarterKit.Migrations
{
    public class PublishRootBranchPostMigration(
        ILogger<PublishRootBranchPostMigration> logger,
        IContentService contentService,
        IMigrationContext context) : MigrationBase(context)
    {
        protected override void Migrate()
        {
            var contentHome = contentService.GetRootContent().FirstOrDefault(x => x.ContentType.Alias == "home");
            if (contentHome != null)
            {
                contentService.SaveAndPublishBranch(contentHome, true);
            }
            else
            {
                logger.LogWarning("The installed Home page was not found");
            }
        }
    }
}