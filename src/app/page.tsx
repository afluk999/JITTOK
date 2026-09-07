import HeroWall from "@/components/HeroWall";
import BestSellers from "@/components/Bestsellers";
import AccessoriesSection from "@/components/Accessoriesection";
import ReelsSection from "@/components/ReelsSection";
import CustomerLoveSection from "@/components/CustomerLoveSection";
import BrandStatement from "@/components/BrandStatement";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import Story from "@/components/story";
import LandscapePromoBanner from "@/components/LandscapePromoBanner";
import PosterStrip from "@/components/PosterStrip";

export default function Home() {
  return (
    <>
      <HeroWall />
      <PosterStrip />
      <Story />
      <BestSellers />
      <LandscapePromoBanner />
      <AccessoriesSection />

      <ReelsSection />
      <CustomerLoveSection />
      <BrandStatement />
      <TrustStrip />
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .desktop-only-lineup {
            display: none;
          }
        }
      `}</style>
    </>
  );
}