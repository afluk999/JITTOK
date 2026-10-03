import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & { src?: string; width?: number; height?: number };

export default function ProductImage({ src, alt = "", width = 900, height = 1200, sizes = "(max-width: 768px) 50vw, 25vw", ...props }: Props) {
  if (!src) return null;
  const supported = src.startsWith("/") || src.startsWith("https://res.cloudinary.com/");
  return <Image {...props} src={src} alt={alt} width={width} height={height} sizes={sizes} unoptimized={!supported} />;
}
