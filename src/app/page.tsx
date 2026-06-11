import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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
      <HeroSection />
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