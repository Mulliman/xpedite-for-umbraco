# Page Templates

A page template defines what markup and components we should use to render a certain type of page. In XPEDITE templates are automatically selected based on the document type of the current page.

## Example Page Template

This example is taking data form the current page, and using that to populate and render a partial and then using that same page data to render a block list of components.

```
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { Block, BlockList, TypedUmbracoNode } from "@/umbraco/types";
import PagePartial from "@/partials/Page/Page";

export default function Page(currentPage : TypedUmbracoNode<{title?: any, content: BlockList}>) {
    const { content } = currentPage?.properties;

    return (
        <div className="">
            <PagePartial {...currentPage}></PagePartial>

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
```

## Example Usage

To make sure that this page template is found and used you need to add it to the templates map.

In templates.ts add a line for each page template, setting the key as the document type you want to match e.g.

```
export const templatesMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    page: lazy(() => import('./Page'))
  };

```