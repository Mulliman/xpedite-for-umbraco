import Link from "next/link";

export type UmbracoLinkProps = {
  url?: string;
  queryString?: string;
  title?: string;
  target?: string;
  route?: {
    path?: string;
  };
};

export type SingleUmbracoLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  umbracoLink: UmbracoLinkProps;
}

export default function SingleUmbracoLink(props: SingleUmbracoLinkProps) {
  if (!props?.umbracoLink) return null;

  const { umbracoLink, ...htmlAttributes } = props;

  const { url, queryString, title, target, route } = umbracoLink;
  const urlToUse = `${url || (route && route.path) || ""}${queryString || ""}`;

  return (
    <Link {...htmlAttributes} href={urlToUse} target={target} title={title}>
      {(props.children || title)}
    </Link>
  );
}