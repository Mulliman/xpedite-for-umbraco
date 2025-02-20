namespace Xpedite.Generator.NextJs;

public interface INextJsInput
{
    string Name { get; init; }

    List<PropertyTokens> Properties { get; init; }
}