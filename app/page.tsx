import Navigation from "@/components/Navigation";
import IntelligenceStrip from "@/components/IntelligenceStrip";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PillarsSection from "@/components/PillarsSection";
import MapSection from "@/components/MapSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <IntelligenceStrip />
      <main className="flex flex-col flex-1">
        <HeroSection />
        <AboutSection />
        <PillarsSection />
        <MapSection />
      </main>
    </>
  );
}
