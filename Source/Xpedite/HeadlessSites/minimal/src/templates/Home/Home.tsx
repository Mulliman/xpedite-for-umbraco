import { TypedUmbracoNode } from "@/umbraco/types";

import "./Home.css";

export type HomeProps = {
  pageTitle?: any;
};

export default function Home(currentPage: TypedUmbracoNode<HomeProps>) {
  const { pageTitle } = currentPage?.properties;

  return (
    <div className="template-home">
      <h1>{pageTitle}</h1>
    </div>
  );
}
