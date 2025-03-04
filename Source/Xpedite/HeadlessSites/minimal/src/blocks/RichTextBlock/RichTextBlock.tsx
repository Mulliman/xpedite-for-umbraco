import { Block } from "@/umbraco/types";

import "./RichTextBlock.css";

export type RichTextBlockContentProps = {
  richText?: any;
};

export type RichTextBlockSettingsProps = {};

type RichTextBlockProps = Block<RichTextBlockContentProps, RichTextBlockSettingsProps>;

export default function RichTextBlock({ content, settings }: RichTextBlockProps) {
  const { richText } = content?.properties || {};

  return (
    <div className="block-rich-text-block">
      <div className="block-rich-text-block-name">Block: RichTextBlock</div>

      <div className="richText" dangerouslySetInnerHTML={{ __html: richText?.markup || "" }}></div>
    </div>
  );
}
