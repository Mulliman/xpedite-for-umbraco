namespace Xpedite.Backend.Models
{
    public class ConfigModel
    {
        public bool IsDeliveryApiEnabled { get; set; }

        public string? CodebaseSrcPath { get; set; }

        public string? TemplatesRootFolderPath { get; set; }

        public bool? IsReactTestingInstalled { get; set; }

        public bool? IsXpediteTypescriptCodeInstalled { get; set; }

        public bool IsComplete => IsDeliveryApiEnabled
            && !string.IsNullOrWhiteSpace(CodebaseSrcPath)
            && IsReactTestingInstalled == true
            && IsXpediteTypescriptCodeInstalled == true;
    }
}
