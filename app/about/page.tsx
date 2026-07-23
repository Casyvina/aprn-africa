import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About APRN — Africa's Pipeline Engineering Research Organisation",
  description:
    "Learn about the African Pipeline Resource Network — our mission to develop pipeline engineering capacity across Africa through research, training, policy collaboration, and professional development.",
  openGraph: {
    title: "About APRN — African Pipeline Resource Network",
    description:
      "APRN exists to build pipeline engineering capacity across Africa. Research, training, policy, and professional development for the continent's energy future.",
    type: "website",
    url: "https://aprn-africa.org/about",
    images: [{ url: "/images/female-engineer.jpg", width: 1200, height: 630, alt: "APRN Africa — About Us" }],
  },
};

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutPageClient from "@/components/AboutPageClient";
import { sanityFetch } from "@/lib/sanity/fetch";
import { groq } from "next-sanity";
import type { PersonCard } from "@/lib/queries/persons";

const ABOUT_LEADERSHIP_SLUGS = [
  "pieter-bas-nederveen",
  "lucy-okeke",
  "joseph-agwuh",
];

const ABOUT_PERSONS_QUERY = groq`
  *[_type == "person" && slug.current in $slugs] {
    _id,
    name,
    title,
    bio,
    "photoUrl": photo.asset->url,
    "slug": slug.current,
  }
`;

export default async function AboutPage() {
  const allPersons = await sanityFetch<PersonCard[]>(
    ABOUT_PERSONS_QUERY,
    { slugs: ABOUT_LEADERSHIP_SLUGS },
    ["person"],
  );

  const persons: PersonCard[] = ABOUT_LEADERSHIP_SLUGS
    .map((slug) => allPersons?.find((p) => p.slug === slug))
    .filter((p): p is PersonCard => Boolean(p));

  return (
    <>
      <Navigation />
      <AboutPageClient persons={persons} />
      <Footer />
    </>
  );
}
