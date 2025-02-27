import { IGeneratorInfo } from "../../IGeneratorInfo";

export const templatesDescription = "A template defines what markup and components we should use to render a page. In xpedite templates are automatically selected based on the document type of the current page.";
export const templatesIcon = 'icon-document-dashed-line';
export const templatesColour = "#066784";

export default class TemplatesInfo implements IGeneratorInfo {
    colour = templatesColour;
    name = 'Templates';
    description = templatesDescription;
    url = '/umbraco/section/xpedite/dashboard/xpedite-templates';
    icon = templatesIcon;
}