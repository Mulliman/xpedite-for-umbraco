using Umbraco.Cms.Core.Services;
using Xpedite.Backend.Models;

namespace Xpedite.Backend.InputMappers;

public class TemplateMapper(IContentTypeService contentTypeService, IDataTypeService dataTypeService)
    : NextJsMapper<GenerateApiModel>(contentTypeService, dataTypeService)
{
}