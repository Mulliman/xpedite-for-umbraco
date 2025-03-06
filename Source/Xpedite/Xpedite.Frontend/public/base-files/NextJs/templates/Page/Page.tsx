import { Block, TypedUmbracoNode } from "@/umbraco/types";
import PageHeading from "@/partials/PageHeading";
import { UmbracoPropertiesJson } from "@/components/UmbracoPropertiesJson";
import PageBlocks from "@/partials/PageBlocks";

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

      <PageBlocks pageBlockList={pageBlockList}></PageBlocks>

      <UmbracoPropertiesJson data={currentPage}></UmbracoPropertiesJson>
    </div>
  );
}

// TODO: Add template to the templatesMap in templates.ts with value -> page: lazy(() => import('./Page')),
