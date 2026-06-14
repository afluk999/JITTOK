import Navbar from "@/components/Navbar";
import HeroWall from "@/components/HeroWall";
import IconicProductsCurve from "@/components/IconicProductsCurve";
import NewArrivals from "@/components/NewArrivals";
import Editorial from "@/components/Editorial";
import ReelsSection from "@/components/ReelsSection";
import InstagramSection from "@/components/InstagramSection";
import BrandStatement from "@/components/BrandStatement";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroWall />
      <IconicProductsCurve />
      <NewArrivals />
      <Editorial />
      <ReelsSection />
      <InstagramSection />
      <BrandStatement />
      <Footer />
    </>
  );
}