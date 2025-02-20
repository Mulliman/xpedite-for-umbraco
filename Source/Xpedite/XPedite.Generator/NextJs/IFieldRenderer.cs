namespace Xpedite.Generator.NextJs;

public interface IFieldRenderer
{
    Task<string> RenderField(string fieldAlias, string fieldType);
}
