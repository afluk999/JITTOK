import { getImageProps } from "next/image";

export default function ResponsiveImage({ desktop, mobile, alt, priority = false }: {
  desktop: string; mobile?: string; alt: string; priority?: boolean;
}) {
  const unoptimized = (src: string) => !src.startsWith("/") && !src.startsWith("https://res.cloudinary.com/");
  const common = { alt, sizes: "100vw", fill: true, loading: priority ? "eager" as const : "lazy" as const,
    fetchPriority: priority ? "high" as const : "auto" as const };
  const { props } = getImageProps({ ...common, src: desktop, unoptimized: unoptimized(desktop) });
  const mobileProps = mobile && mobile !== desktop
    ? getImageProps({ ...common, src: mobile, unoptimized: unoptimized(mobile) }).props : null;
  return <picture>
    {mobileProps && <source media="(max-width: 767px)" sizes="100vw" srcSet={mobileProps.srcSet || mobileProps.src} />}
    {/* getImageProps supplies optimized responsive sources; picture downloads only the matching image. */}
    <img {...props} alt={alt} style={{ ...props.style, objectFit: "cover" }} />
  </picture>;
}
