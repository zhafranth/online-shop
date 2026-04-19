import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Ticker } from "@/components/layout/ticker";
import { HeroSection } from "@/components/home/hero-section";
import { EditorsPicks } from "@/components/home/editors-picks";
import { GenderBanner } from "@/components/home/gender-banner";
import { NewArrivals } from "@/components/home/new-arrivals";
import { UspStrip } from "@/components/home/usp-strip";
import { Toast } from "@/components/ui/toast";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <Ticker />
      <HeroSection />
      <EditorsPicks />
      <GenderBanner />
      <NewArrivals />
      <UspStrip />
      <Footer />
      <Toast />
    </div>
  );
}
