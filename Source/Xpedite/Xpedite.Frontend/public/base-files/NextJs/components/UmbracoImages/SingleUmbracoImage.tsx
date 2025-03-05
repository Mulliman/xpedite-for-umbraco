export type UmbracoImageProps = {
  url: string;
  width: number;
  height: number;
  mediaType: string;
  name?: string;
  className?: string;
};

export type SingleUmbracoImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  umbracoImage: UmbracoImageProps;
}

export default function SingleUmbracoImage(props: SingleUmbracoImageProps) {
  const { umbracoImage, ...htmlAttributes } = props;
  const { url, name, mediaType, width, height } = umbracoImage;

  if (!url || mediaType != 'Image') return null;
  
  const fullUrl = process.env.UMBRACO_SERVER_URL + url;

  return (
    // You could use Next image rendering, but you'll need to set it up in the settings to allow your domain.
    // <Image src={fullUrl} alt={name || ''} width={width} height={height} />
    <img {...htmlAttributes} src={fullUrl} alt={name || ''} />
  );
}