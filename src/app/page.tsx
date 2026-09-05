import HeroWall from "@/components/HeroWall";
import BestSellers from "@/components/Bestsellers";
import AccessoriesSection from "@/components/Accessoriesection";
import ReelsSection from "@/components/ReelsSection";
import CustomerLoveSection from "@/components/CustomerLoveSection";
import BrandStatement from "@/components/BrandStatement";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import Story from "@/components/story";

export default function Home() {
  return (
    <>
      <HeroWall />
      <Story />
      <BestSellers />
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