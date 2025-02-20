import { IGeneratorInfo } from "../../IGeneratorInfo";

export const partialsDescription = "A block is a component that can be rendered as part of a block list. These can be chosen by content editors in the CMS. You must use element document types.";
export const partialsIcon = 'icon-thumbnails-small';

export default class BlocksInfo implements IGeneratorInfo {
    name = 'Blocks';
    description = partialsDescription;
    url = '/umbraco/section/xpedite/dashboard/xpedite-blocks';
    icon = partialsIcon;
}