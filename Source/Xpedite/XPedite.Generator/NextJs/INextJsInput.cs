namespace Xpedite.Generator.NextJs;

public interface INextJsInput
{
    string Name { get; }

    List<PropertyTokens> Properties { get; }
}