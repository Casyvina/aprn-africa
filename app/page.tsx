import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "African Pipeline Resource Network — Research, Training & Intelligence",
  description:
    "APRN is Africa's leading pipeline engineering research organisation. Access strategic intelligence, policy frameworks, training programmes, and infrastructure data covering 12,400km of active construction.",
  openGraph: {
    title: "APRN — African Pipeline Resource Network",
    description:
      "Africa's leading platform for pipeline engineering intelligence. Research, training, policy, and infrastructure data for energy professionals.",
    type: "website",
    url: "https://aprn-africa.org",
    images: [{ url: "/images/hero-pipeline.jpg", width: 1200, height: 630, alt: "APRN Africa" }],
  },
};

import Navigation from "@/components/Navigation";
import IntelligenceStrip from "@/components/IntelligenceStrip";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhyNowSection from "@/components/WhyNowSection";
import PillarsSection from "@/components/PillarsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import MapSection from "@/components/MapSection";
import ResearchSection from "@/components/ResearchSection";
import LatestInsightsSection from "@/components/LatestInsightsSection";
import RoadmapSection from "@/components/RoadmapSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { HOMEPAGE_CONFIG_QUERY, type HomepageConfig } from "@/lib/queries/homepage";
import { SITE_SETTINGS_FOOTER_QUERY, type SiteSettingsFooter } from "@/lib/queries/siteSettings";

export default async function Home() {
  let config: HomepageConfig | null = null;
  let siteSettings: SiteSettingsFooter | null = null;

  try {
    [config, siteSettings] = await Promise.all([
      sanityFetch<HomepageConfig>(HOMEPAGE_CONFIG_QUERY, {}, ["homepageConfig"]),
      sanityFetch<SiteSettingsFooter>(SITE_SETTINGS_FOOTER_QUERY, {}, ["siteSettings"]),
    ]);
  } catch { /* use component defaults */ }

  // Hero network metrics panel
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

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "African Pipeline Resource Network",
    "alternateName": "APRN Africa",
    "url": "https://aprn-africa.org",
    "logo": "https://aprn-africa.org/images/logo.png",
    "description": "Africa's leading pipeline engineering research organisation. Strategic intelligence, policy frameworks, training programmes, and infrastructure data for energy professionals.",
    "email": "info@aprn-africa.org",
    "foundingDate": "2024",
    "areaServed": "Africa",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@aprn-africa.org",
      "contactType": "General Enquiries",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Navigation />
      <IntelligenceStrip />
      <main className="flex flex-col flex-1">
        <HeroSection
          stats={heroStats}
          badgeLabel={config?.heroBadgeLabel}
          headline={config?.heroHeadline}
          headlineAccent={config?.heroHeadlineAccent}
          subtext={config?.heroSubtext}
          primaryButtonLabel={config?.heroPrimaryButtonLabel}
          secondaryButtonLabel={config?.heroSecondaryButtonLabel}
        />
        <AboutSection
          heading={config?.aboutHeading}
          description={config?.aboutDescription}
          partnerName={config?.aboutPartnerName}
          stat1Value={config?.aboutStat1Value}
          stat1Label={config?.aboutStat1Label}
          stat2Value={config?.aboutStat2Value}
          stat2Label={config?.aboutStat2Label}
          leadership={config?.aboutLeadership}
          imageUrl={config?.aboutImageUrl}
        />
        <WhyNowSection
          badge={config?.whyNowBadge}
          heading={config?.whyNowHeading}
          intro1={config?.whyNowIntro1}
          intro2={config?.whyNowIntro2}
          quote={config?.whyNowQuote}
          stats={config?.whyNowStats}
        />
        <PillarsSection
          sectionTag={config?.pillarsSectionTag}
          sectionHeading={config?.pillarsSectionHeading}
          pillars={config?.pillars}
        />
        <PartnershipsSection
          badge={config?.partnershipsBadge}
          heading={config?.partnershipsHeading}
          subtext={config?.partnershipsSubtext}
          backgroundImageUrl={config?.partnershipsBackgroundImageUrl}
        />
        <MapSection
          heading={config?.corridorsHeading}
          subtext={config?.corridorsSubtext}
          spotlightLabel={config?.corridorSpotlightLabel}
          spotlightTitle={config?.corridorSpotlightTitle}
          spotlightSubtitle={config?.corridorSpotlightSubtitle}
        />
        <ResearchSection
          badge={config?.researchBadge}
          heading={config?.researchHeading}
          subtext={config?.researchSubtext}
          backgroundImageUrl={config?.researchBackgroundImageUrl}
        />
        <LatestInsightsSection />
        <RoadmapSection
          heading={config?.roadmapHeading}
          milestones={config?.roadmapMilestones}
        />
        <CTASection
          headline={config?.ctaHeadline}
          headlineAccent={config?.ctaHeadlineAccent}
          primaryButtonLabel={config?.ctaButtonLabel}
          secondaryButtonLabel={config?.ctaSecondaryButtonLabel}
          backgroundImageUrl={config?.ctaBackgroundImageUrl}
        />
      </main>
      <Footer siteSettings={siteSettings} />
    </>
  );
}
