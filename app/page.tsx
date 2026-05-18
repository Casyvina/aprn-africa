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
import { sanityFetch } from "@/lib/sanity/fetch";
import { HOMEPAGE_CONFIG_QUERY, type HomepageConfig } from "@/lib/queries/homepage";

export default async function Home() {
  let config: HomepageConfig | null = null;
  try {
    config = await sanityFetch<HomepageConfig>(HOMEPAGE_CONFIG_QUERY, {}, ["homepageConfig"]);
  } catch { /* use component defaults */ }

  const heroStats = config
    ? [
        {
          label: "Active Projects",
          value: String(config.activeProjectsCount ?? 42),
          width: "75%",
        },
        {
          label: "Engineering Trainees",
          value: config.engineeringTraineesCount
            ? `${config.engineeringTraineesCount.toLocaleString()}+`
            : "1,250+",
          width: "60%",
        },
        {
          label: "km Under Construction",
          value: config.kmUnderConstruction
            ? `${config.kmUnderConstruction.toLocaleString()}km`
            : "12,400km",
          width: "45%",
        },
      ]
    : undefined;

  return (
    <>
      <Navigation />
      <IntelligenceStrip />
      <main className="flex flex-col flex-1">
        <HeroSection stats={heroStats} />
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
