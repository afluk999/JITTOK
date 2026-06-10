import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IconicProductsCurve from "@/components/IconicProductsCurve";
import NewArrivals from "@/components/NewArrivals";
import Editorial from "@/components/Editorial";
import BrandStatement from "@/components/BrandStatement";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <IconicProductsCurve />
      <NewArrivals />
      <Editorial />
      <BrandStatement />
    </>
  );
}