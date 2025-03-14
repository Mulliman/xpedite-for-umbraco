namespace Xpedite.Backend.Models;

public class GenerateApiModel
{
    public string? ComponentName { get; set; }

    public string? VariantName { get; set; }

    public Guid DocumentTypeId { get; set; }

    public Guid? TestItem { get; set; }

    public IEnumerable<string> SelectedProperties { get; set; } = [];
}

public class GenerateBlockApiModel : GenerateApiModel
{
    public Guid? SettingsTypeId { get; set; }

    public IEnumerable<string>? SelectedSettings { get; set; } = [];
}
