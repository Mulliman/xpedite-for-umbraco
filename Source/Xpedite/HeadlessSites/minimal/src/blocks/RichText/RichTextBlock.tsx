import { Block } from "@/umbraco/types";

type ContentProps = {
    richText: string
};

type Props = Block<ContentProps, any>;

export default function RichTextBlock({ content }: Props) {
    const richText = content?.properties?.richText || '';

    return (
        <>
            <div className='' dangerouslySetInnerHTML={{ __html: richText }}></div>
        </>
    )
}
