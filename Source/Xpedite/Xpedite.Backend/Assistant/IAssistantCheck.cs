namespace Xpedite.Backend.Assistant
{
    public interface IAssistantCheck<T> where T : CheckInput
    {
        Task<CheckResult?> RunCheck(T input);
    }
}