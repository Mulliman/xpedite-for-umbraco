import { BlockRenderer } from "@/blocks/BlockRenderer";
import { Block, BlockList, TypedUmbracoNode } from "@/umbraco/types";

export default function Page(currentPage : TypedUmbracoNode<{title?: any, content: BlockList}>) {
    const { content } = currentPage?.properties;

    return (
        <div className="">
            {content && (
                <section>
                    {content.items.map((contentRow: Block<any, any>) => (
                        <section key={contentRow?.content?.id} className="">
                            <BlockRenderer {...contentRow} />
                        </section>
                    ))}
                </section>
            )}
        </div>
    )
}