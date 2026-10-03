import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
export default function LandscapePromoBanner({ image, mobile, href }: { image: string; mobile?: string; href: string }) {
  if (!image) return null;
  return <section className="home-banner"><Link href={href} aria-label="Explore the JITTOK collection">
    <ResponsiveImage desktop={image} mobile={mobile} alt="JITTOK collection" />
  </Link></section>;
}
