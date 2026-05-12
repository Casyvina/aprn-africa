import Navigation from "@/components/Navigation";
import IntelligenceStrip from "@/components/IntelligenceStrip";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhyNowSection from "@/components/WhyNowSection";
import PillarsSection from "@/components/PillarsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import MapSection from "@/components/MapSection";
import ResearchSection from "@/components/ResearchSection";
import RoadmapSection from "@/components/RoadmapSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <IntelligenceStrip />
      <main className="flex flex-col flex-1">
        <HeroSection />
        <AboutSection />
        <WhyNowSection />
        <PillarsSection />
        <PartnershipsSection />
        <MapSection />
        <ResearchSection />
        <RoadmapSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
