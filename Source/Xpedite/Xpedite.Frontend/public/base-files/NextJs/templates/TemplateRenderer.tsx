import { UmbracoNode } from "@/umbraco/types";
import { templatesMap } from "./templates";

export const TemplateRenderer = (pageData: UmbracoNode) => {
    const MatchingTemplate = templatesMap[pageData.contentType];
    
    if (MatchingTemplate) {
      return (<MatchingTemplate {...pageData} />);
    }

    return null;
};