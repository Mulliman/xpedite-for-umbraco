# Partials

A partial is a way to render reusable components onto a page. These will be defined in code usually in a page template file or from other partials. You may use data from normal and element document types.

## Example Partial

This example is taking data form the current page, but you can pass in any dat you want to a partial.

```
import { TypedUmbracoNode } from "@/umbraco/types";

export type PageProps = { 
    title?: any
}

export default function Page (item : TypedUmbracoNode<PageProps>) {
    const { title } = item?.properties;

    return (
        <div className="partial-page">
             <span>{ title }</span>
        </div>
    )
}
```

## Example Usage

```
import PagePartial from "@/partials/Page/Page";

...

<PagePartial {...currentPage}></PagePartial>

```