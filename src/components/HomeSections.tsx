"use client";

import type { HomeContent } from "@/lib/contentService";
import HeroWall from "@/components/HeroWall";
import BestSellers from "@/components/Bestsellers";
import AccessoriesSection from "@/components/Accessoriesection";
import ReelsSection from "@/components/ReelsSection";
import CustomerLoveSection from "@/components/CustomerLoveSection";
import BrandStatement from "@/components/BrandStatement";
import TrustStrip from "@/components/TrustStrip";
import Story from "@/components/story";
import LandscapePromoBanner from "@/components/LandscapePromoBanner";
import PosterStrip from "@/components/PosterStrip";
import StoreBestSellers from "@/components/StoreBestSellers";

export default function HomeSections({ content, now }: { content: HomeContent; now: number }) {
  const v = content.sectionVisibility;
  return <>
    {v.hero && <HeroWall presentation={content.presentation} initialTime={now} />}
    {v.posterStrip !== false && <PosterStrip />}
    {v.jittokLineup && <Story />}
    {v.newArrivals && <BestSellers />}
    {v.editorial && <LandscapePromoBanner image={content.landscapeBannerImage} mobile={content.presentation.bannerMobile} href={content.presentation.bannerHref} />}
    {v.accessories !== false && <AccessoriesSection />}
    {v.storeBestSellers !== false && <StoreBestSellers />}
    {v.reels && <ReelsSection />}
    {v.customerLove && <CustomerLoveSection />}
    {v.brandStatement && <BrandStatement />}
    {v.trustStrip && <TrustStrip />}
  </>;
}
