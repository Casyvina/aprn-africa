import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { client as sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  return NextResponse.json({ issues: issues ?? [], subscriberCount: subscriberCount ?? 0 });
}
