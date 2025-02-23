import { getContentItemAsync } from "@/umbraco/contentApi";
import { TemplateRenderer } from "@/templates/TemplateRenderer";

export default async function Home() {
  const rootItem = process.env.UMBRACO_HOME_ITEM || "home";
  const currentPage = await getContentItemAsync(rootItem, rootItem);

  return TemplateRenderer(currentPage);
}