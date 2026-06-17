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
    sanityFetch<PersonCard[]>(PERSONS_QUERY, {}, ["person"]),
    sanityFetch<{ photoUrl?: string } | null>(
      YOUTH_PHOTO_QUERY,
      { slug: YOUTH_AMBASSADOR_SLUG },
      ["person"],
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
