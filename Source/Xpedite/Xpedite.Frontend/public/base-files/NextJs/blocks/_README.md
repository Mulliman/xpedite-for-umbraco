# Blocks

A block is a component that can be rendered as part of a block list or block grid. These can be chosen by content editors in the CMS. You must use element document types.

## Example Block

This example is a block that simply renders some rich text

```
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

```

## Example Usage

To make sure that this block is found and used you need to add it to the blocks map.

In blocks.ts add a line for each block, setting the key as the element type you want to match e.g.

```
import { lazy } from 'react';

export const blocksMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    // example: lazy(() => import('./example'))
    richTextElement: lazy(() => import('./RichText')),
  };
```

richTextElement is the content type alias of the element that we want to render.

You can loop through the blocks that have been assigned to a property on your page like so:

```
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { Block, BlockList, TypedUmbracoNode } from "@/umbraco/types";

...

{content.items.map((contentRow: Block<any, any>) => (
    <section key={contentRow?.content?.id} className="">
        <BlockRenderer {...contentRow} />
    </section>
))}
```