import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership — APRN Africa Team",
  description:
    "Meet the APRN Africa leadership team — engineers, researchers, and policy experts driving pipeline engineering development across the continent.",
  openGraph: {
    title: "APRN Leadership — Our Team",
    description:
      "The engineers, researchers, and policy experts behind the African Pipeline Resource Network.",
    type: "website",
    url: "https://aprn-africa.org/leadership",
    images: [{ url: "/images/engineers-group1.png", width: 1200, height: 630, alt: "APRN Africa Leadership Team" }],
  },
};

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LeadershipPageClient from "@/components/LeadershipPageClient";
import { sanityFetch } from "@/lib/sanity/fetch";
import { PERSONS_QUERY, type PersonCard } from "@/lib/queries/persons";
import { groq } from "next-sanity";

const YOUTH_AMBASSADOR_SLUG = "allison-gabriel";

const YOUTH_PHOTO_QUERY = groq`
  *[_type == "person" && slug.current == $slug][0]{
    "photoUrl": photo.asset->url
  }
`;

// Display order for the main leadership profiles
const LEADERSHIP_SLUGS = [
  "pieter-bas-nederveen",
  "lucy-okeke",
  "kosie-onuora",
  "joseph-agwuh",
];

// Operations / content team
const TEAM_SLUGS = [
  "olatokunbo-ajelara",
];

export default async function LeadershipPage() {
  const [allPersons, youthData] = await Promise.all([
    sanityFetch<PersonCard[]>(PERSONS_QUERY, {}, ["leadership"]),
    sanityFetch<{ photoUrl?: string } | null>(
      YOUTH_PHOTO_QUERY,
      { slug: YOUTH_AMBASSADOR_SLUG },
      ["leadership"],
    ),
  ]);

  const persons: PersonCard[] = LEADERSHIP_SLUGS
    .map((slug) => allPersons?.find((p) => p.slug === slug))
    .filter((p): p is PersonCard => Boolean(p));

  const teamMembers: PersonCard[] = TEAM_SLUGS
    .map((slug) => allPersons?.find((p) => p.slug === slug))
    .filter((p): p is PersonCard => Boolean(p));

  const displayPersons = persons.length > 0 ? persons : (allPersons ?? []);

  return (
    <>
      <Navigation />
      <LeadershipPageClient
        persons={displayPersons}
        teamMembers={teamMembers}
        youthAmbassadorPhotoUrl={youthData?.photoUrl ?? null}
      />
      <Footer />
    </>
  );
}
