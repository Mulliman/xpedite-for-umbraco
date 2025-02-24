import { Block } from "@/umbraco/types";

import "./ContentBlock.css";
import UmbracoLinks from "@/components/UmbracoLinks";
import UmbracoImages from "@/components/UmbracoImages";

export type ContentBlockContentProps = {
  richText?: any;
  title?: any;
  image?: any;
  callToAction?: any;
  icon?: any;
};

export type ContentBlockSettingsProps = {
  backgroundColour?: any;
  backgroundImage?: any;
};

type ContentBlockProps = Block<ContentBlockContentProps, ContentBlockSettingsProps>;

export default function ContentBlock({ content, settings }: ContentBlockProps) {
  const { richText, title, image, callToAction, icon } = content?.properties || {};
  const { backgroundColour, backgroundImage } = settings?.properties || {};

  return (
    <div className="block-content-block">
      <div className="block-content-block-name">Block: ContentBlock</div>

      <h2>{title}</h2>

      <div className="rich-text" dangerouslySetInnerHTML={{ __html: richText?.markup || "" }}></div>

      <UmbracoImages umbracoImages={image} />
      <UmbracoImages umbracoImages={icon} />

      <UmbracoLinks umbracoLinks={callToAction}></UmbracoLinks>

      <div className="default-renderer">{backgroundColour}</div>
      <UmbracoImages umbracoImages={backgroundImage} />
    </div>
  );
}

// TODO: Add block to the blocksMap in blocks.ts with value -> contentBlock: lazy(() => import('./ContentBlock')),
