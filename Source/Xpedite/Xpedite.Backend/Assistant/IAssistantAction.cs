namespace Xpedite.Backend.Assistant
{
    public interface IAssistantAction<T> where T : ActionInput
    {
        string ActionName { get; }

        Task RunAction(T input, Guid userKey);
    }
}
