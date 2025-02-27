import { IGeneratorInfo } from "../../IGeneratorInfo";

export const partialsDescription = "A partial is a way to render reusable components onto a page. These will be defined in code usually in a page template file or from other partials. You may use data from normal and element document types.";
export const partialsIcon = 'icon-list';
export const partialsColour = "#2A9088";

export default class PartialsInfo implements IGeneratorInfo {
    colour = partialsColour;
    name = 'Partials';
    description = partialsDescription;
    url = '/umbraco/section/xpedite/dashboard/xpedite-partials';
    icon = partialsIcon;
}