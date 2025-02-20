using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xpedite.Generator.NextJs;
using Xpedite.Generator;
using Xpedite.Backend.Models;

namespace Xpedite.Backend.InputMappers;

public abstract class NextJsMapper<TApi>(IContentTypeService contentTypeService, IDataTypeService dataTypeService)
    where TApi : GenerateApiModel
{
    protected readonly IContentTypeService ContentTypeService = contentTypeService;
    protected readonly IDataTypeService DataTypeService = dataTypeService;

    public virtual async Task<NextJsInput> MapToNextJsInput(TApi model)
    {
        var contentType = ContentTypeService.Get(model.DocumentTypeId) ?? throw new ArgumentException("Invalid document type ID", nameof(model.DocumentTypeId));

        var propertyTokens = await GeneratePropertyTokens(model, contentType);
        var name = GetComponentName(model, contentType);

        return new NextJsInput(name, propertyTokens);
    }

    protected virtual async Task<List<PropertyTokens>> GeneratePropertyTokens(TApi model, IContentType contentType)
    {
        var selectedProperties = GetSelectedProperties(model.SelectedProperties, contentType);

        return (await Task.WhenAll(selectedProperties.Select(CreatePropertyTokens))).ToList();
    }

    protected virtual string GetComponentName(TApi model, IContentType contentType)
    {
        return new ValidComponentName(model.ComponentName, contentType.Alias).Value;
    }

    protected virtual IEnumerable<IPropertyType> GetSelectedProperties(IEnumerable<string> propertyNames, IContentType contentType)
    {
        var selectedPropertiesSet = new HashSet<string>(propertyNames);

        var allProperties = contentType.PropertyTypes.Union(contentType.CompositionPropertyTypes);

        return allProperties.Where(p => selectedPropertiesSet.Contains(p.Alias));
    }

    protected virtual async Task<PropertyTokens> CreatePropertyTokens(IPropertyType propertyType)
    {
        var alias = propertyType.Alias;
        var editor = (await DataTypeService.GetAsync(propertyType.DataTypeKey))?.EditorAlias;

        return new PropertyTokens(alias, editor);
    }
}
