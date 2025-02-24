import { Block, TypedUmbracoNode } from "@/umbraco/types";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import PageHeading from "@/partials/PageHeading";

import "./Page.css";

export type PageProps = {
  pageBlockList?: any;
  pageTitle?: any;
};

export default function Page(currentPage: TypedUmbracoNode<PageProps>) {
  const { pageBlockList, pageTitle } = currentPage?.properties;

  return (
    <div className="template-page">
      <div className="template-page-name">Template: Page</div>

      <PageHeading pageTitle={pageTitle} />

      {pageBlockList && (
        <section className="">
          {pageBlockList.items.map((contentRow: Block<any, any>) => (
            <div key={contentRow?.content?.id} className="">
              <BlockRenderer {...contentRow} />
            </div>
          ))}
        </section>
      )}
      
    </div>
  );
}

// TODO: Add template to the templatesMap in templates.ts with value -> page: lazy(() => import('./Page')),
