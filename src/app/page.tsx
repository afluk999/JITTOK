import Navbar from "@/components/Navbar";
import HeroWall from "@/components/HeroWall";
import IconicProductsCurve from "@/components/IconicProductsCurve";
import NewArrivals from "@/components/NewArrivals";
import SpiderDropBanner from "@/components/SpiderDropBanner";
import { JittokLineup } from "@/components/JittokLineup";
import Editorial from "@/components/Editorial";
import ReelsSection from "@/components/ReelsSection";
import CustomerLoveSection from "@/components/CustomerLoveSection";
import BrandStatement from "@/components/BrandStatement";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroWall />
      <IconicProductsCurve />
      <SpiderDropBanner />
      <NewArrivals />
      <JittokLineup />
      <ReelsSection />
      <CustomerLoveSection />
      <BrandStatement />
      <TrustStrip />
      <Footer />
    </>
  );
}