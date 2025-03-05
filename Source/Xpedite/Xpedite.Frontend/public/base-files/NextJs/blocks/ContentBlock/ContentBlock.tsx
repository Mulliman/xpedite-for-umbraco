import { Block } from "@/umbraco/types";
import UmbracoImages, { UmbracoImageProps } from "@/components/UmbracoImages";
import UmbracoLinks from "@/components/UmbracoLinks";

import "./ContentBlock.css";

export type ContentBlockContentProps = {
  richText?: any;
  title?: any;
  image?: any;
  callToAction?: any;
  icon?: any;
};

export type ContentBlockSettingsProps = {
  backgroundColour?: any;
  backgroundImage?: UmbracoImageProps[];
};

type ContentBlockProps = Block<ContentBlockContentProps, ContentBlockSettingsProps>;

export default function ContentBlock({ content, settings }: ContentBlockProps) {
  const { richText, title, image, callToAction, icon } = content?.properties || {};
  const { backgroundColour, backgroundImage } = settings?.properties || {};

  const backgroundImageSrc = backgroundImage?.[0]?.url ? process.env.UMBRACO_SERVER_URL + backgroundImage?.[0]?.url : "";

  return (
    <div className="block-content-block">
      <div className="block-content-block-name">Block: ContentBlock</div>

      <div className="content-block__container">
        <div className="content-block__left">
          <UmbracoImages umbracoImages={image} />
        </div>
        <div
          className="content-block__right"
          style={{
            backgroundColor: backgroundColour,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundImage: `url(${backgroundImageSrc})`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            <UmbracoImages umbracoImages={icon} className="content-block__icon" />
            <h2>{title}</h2>
            <div className="" dangerouslySetInnerHTML={{ __html: richText?.markup || "" }}></div>
            <UmbracoLinks umbracoLinks={callToAction}></UmbracoLinks>
          </div>
        </div>
      </div>
    </div>
  );
}
