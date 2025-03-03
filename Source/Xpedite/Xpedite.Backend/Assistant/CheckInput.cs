namespace Xpedite.Backend.Assistant
{
    public class CheckInput
    {
        public Guid DocumentTypeId { get; set; }
    }

    public class BlockCheckInput : CheckInput
    {
        public Guid? SettingsTypeId { get; set; }
    }
}
