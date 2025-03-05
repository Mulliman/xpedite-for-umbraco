import SingleUmbracoLink, { UmbracoLinkProps } from "./SingleUmbracoLink";

export type UmbracoLinksProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  umbracoLinks: UmbracoLinkProps[] | undefined | null;
}

export default function UmbracoLinks(props: UmbracoLinksProps) {
  if (!props?.umbracoLinks) return null;

  const { umbracoLinks, ...htmlAttributes } = props;

  return umbracoLinks.filter(p => !!p).map(p => <SingleUmbracoLink key={p.url} {...htmlAttributes} umbracoLink={p} />)
}