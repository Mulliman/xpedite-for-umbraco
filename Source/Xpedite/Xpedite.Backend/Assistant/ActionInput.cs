namespace Xpedite.Backend.Assistant
{
    public class ActionInput
    {
        public Guid DocumentTypeId { get; set; }
    }

    public class BlockActionInput : ActionInput
    {
        public Guid? SettingsTypeId { get; set; }
    }
}
