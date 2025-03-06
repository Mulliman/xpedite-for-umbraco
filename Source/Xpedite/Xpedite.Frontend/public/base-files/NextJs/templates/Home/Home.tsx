import { Block, TypedUmbracoNode } from "@/umbraco/types";
import PageHeading from "@/partials/PageHeading";

import "./Home.css";
import PageBlocks from "@/partials/PageBlocks";
import { UmbracoPropertiesJson } from "@/components/UmbracoPropertiesJson";

export type HomeProps = {
  pageBlockList?: any,
  pageTitle?: any,
}

export default function Home(currentPage: TypedUmbracoNode<HomeProps>) {
  const { pageTitle, pageBlockList } = currentPage?.properties;

  return (
    <div className="template-home">
      <div className="template-home-name">Template: Home</div>
      <PageHeading pageTitle={pageTitle} />

      <PageBlocks pageBlockList={pageBlockList}></PageBlocks>

      <UmbracoPropertiesJson data={currentPage}></UmbracoPropertiesJson>
    </div>
  );
}