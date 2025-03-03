namespace Xpedite.Backend.Assistant
{
    public class CheckResult
    {
        public bool IsOk { get; set; }

        public string? Message { get; set; }

        public string? ActionUrl { get; set; }

        public string? ActionName { get; set; }

        public string? ActionButtonText { get; set; }
    }
}