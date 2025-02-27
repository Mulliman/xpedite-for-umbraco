import { IGeneratorInfo } from "../../IGeneratorInfo";

export const blocksDescription = "A block is a component that can be rendered as part of a block list. These can be chosen by content editors in the CMS. You must use element document types.";
export const blocksIcon = 'icon-thumbnails-small';
export const blocksColour = "#92C98C";

export default class BlocksInfo implements IGeneratorInfo {
    colour = blocksColour;
    name = 'Blocks';
    description = blocksDescription;
    url = '/umbraco/section/xpedite/dashboard/xpedite-blocks';
    icon = blocksIcon;
}