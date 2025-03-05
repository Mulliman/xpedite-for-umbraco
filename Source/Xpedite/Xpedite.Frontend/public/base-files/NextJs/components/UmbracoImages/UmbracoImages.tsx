import SingleUmbracoImage, { UmbracoImageProps } from "./SingleUmbracoImage";

export type UmbracoImagesProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  umbracoImages: UmbracoImageProps[] | undefined | null;
}

export default function UmbracoImages(props: UmbracoImagesProps) {
  if (!props?.umbracoImages) return null;

  const { umbracoImages, ...htmlAttributes } = props;

  return umbracoImages.filter(p => !!p).map(p => <SingleUmbracoImage {...htmlAttributes} umbracoImage={p} />)
}