import { client as sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import NewsletterDistributionClient from "@/components/admin/NewsletterDistributionClient";

export const metadata = { title: "Newsletter Distribution | APRN Admin" };

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [issues, subscriberCount] = await Promise.all([
    sanityClient.fetch(groq`
      *[_type == "newsletter"] | order(publishDate desc) {
        _id,
        "slug": slug.current,
        title,
        volume,
        issueNumber,
        publishDate,
        status,
        sentAt,
        recipientCount,
        "storyCount": count(stories)
      }
    `),
    sanityClient.fetch<number>(groq`count(*[_type == "subscriber" && active == true])`),
  ]);

  return (
    <NewsletterDistributionClient
      issues={issues ?? []}
      subscriberCount={subscriberCount ?? 0}
    />
  );
}
