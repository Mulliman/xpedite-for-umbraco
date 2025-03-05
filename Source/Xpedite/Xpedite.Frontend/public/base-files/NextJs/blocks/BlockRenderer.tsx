import { Block } from "@/umbraco/types";
import { blocksMap } from "./blocks";

export const BlockRenderer = (blockData: Block<any, any> | null | undefined) => {
    const contentType = blockData?.content?.contentType;

    if(!contentType) {
      return null;
    }

    const MatchingBlock = blocksMap[contentType];
    
    if (MatchingBlock) {
      return (<MatchingBlock {...blockData} />);
    }

    return null;
};