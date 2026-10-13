import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import type { ImageRef } from "@/lib/types";

/** Sanity CDN'i kendi boyutlandırma / WebP dönüşümünü yapar; Next'e yük bindirmeyelim. */
function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const u = new URL(src);
  u.searchParams.set("w", String(width));
  u.searchParams.set("q", String(quality ?? 80));
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "max");
  return u.toString();
}

type Props = Omit<ImageProps, "src" | "alt" | "loader" | "placeholder" | "blurDataURL"> & {
  image: ImageRef;
  alt: string;
};

export default function Img({ image, alt, style, ...rest }: Props) {
  const focal = image.focal;
  const isSanity = image.url.includes("cdn.sanity.io");
  return (
    <Image
      src={image.url}
      alt={alt}
      loader={isSanity ? sanityLoader : undefined}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      style={focal ? { objectPosition: `${focal.x * 100}% ${focal.y * 100}%`, ...style } : style}
      {...rest}
    />
  );
}
