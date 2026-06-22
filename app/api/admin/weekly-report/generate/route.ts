import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { client as sanityClient } from "@/lib/sanity/client";
import Anthropic from "@anthropic-ai/sdk";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

function weekRange(offsetWeeks = 0): { since: Date; until: Date; label: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) - offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { since: monday, until: sunday, label: `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}` };
}

async function fetchGitHubCommits(since: Date, until: Date) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casyvina/aprn-africa/commits?since=${since.toISOString()}&until=${until.toISOString()}&per_page=50`,
      { headers: { Authorization: `Bearer ${token}`, "User-Agent": "aprn-africa" } }
    );
    if (!res.ok) return null;
    const commits = (await res.json()) as { sha: string; commit: { message: string; author: { date: string } } }[];
    return commits
      .filter((c) => !c.commit.message.startsWith("Merge"))
      .map((c) => ({ message: c.commit.message.split("\n")[0], date: c.commit.author.date }));
  } catch {
    return null;
  }
}

async function fetchSanityActivity(since: Date, until: Date) {
  try {
    const [published, drafts] = await Promise.all([
      sanityClient.fetch<{ _type: string; title?: string; name?: string; _updatedAt: string }[]>(
        `*[_updatedAt >= $since && _updatedAt <= $until && !(_id in path("drafts.**"))] | order(_updatedAt desc) {
          _type, _updatedAt, title, name
        }`,
        { since: since.toISOString(), until: until.toISOString() }
      ),
      sanityClient.fetch<{ _type: string; title?: string; name?: string; _updatedAt: string }[]>(
        `*[_updatedAt >= $since && _updatedAt <= $until && _id in path("drafts.**")] | order(_updatedAt desc) {
          _type, _updatedAt, title, name
        }`,
        { since: since.toISOString(), until: until.toISOString() }
      ),
    ]);

    const grouped: Record<string, number> = {};
    for (const d of published) {
      grouped[d._type] = (grouped[d._type] ?? 0) + 1;
    }
    return {
      publishedTotal: published.length,
      draftsTotal: drafts.length,
      byType: grouped,
      publishedItems: published.slice(0, 30).map((d) => ({ type: d._type, title: d.title ?? d.name ?? "(untitled)", updatedAt: d._updatedAt })),
      draftItems: drafts.slice(0, 10).map((d) => ({ type: d._type, title: d.title ?? d.name ?? "(untitled)" })),
    };
  } catch {
    return null;
  }
}

async function fetchSupabaseActivity(since: Date, _until: Date) {
  const admin = createAdminClient();
  const iso = since.toISOString();

  const [members, payments, operators, contractors, engineers, regulators, sources] = await Promise.all([
    admin.from("profiles").select("full_name, membership_tier, created_at").gte("created_at", iso),
    admin.from("payments").select("amount_ngn, payment_type, paid_at").gte("paid_at", iso),
    admin.from("pipeline_operators").select("company_name, created_at").gte("created_at", iso),
    admin.from("contractors_epc").select("company_name, created_at").gte("created_at", iso),
    admin.from("pipeline_engineers").select("full_name, created_at").gte("created_at", iso),
    admin.from("regulators_associations").select("organisation, created_at").gte("created_at", iso),
    admin.from("research_sources").select("title, category, created_at").gte("created_at", iso),
  ]);

  const totalRevenue = (payments.data ?? []).reduce((sum, p) => sum + (p.amount_ngn ?? 0), 0);

  return {
    newMembers: members.data ?? [],
    payments: payments.data ?? [],
    totalRevenueNgn: totalRevenue,
    database: {
      operators: operators.data?.length ?? 0,
      contractors: contractors.data?.length ?? 0,
      engineers: engineers.data?.length ?? 0,
      regulators: regulators.data?.length ?? 0,
      researchSources: sources.data?.length ?? 0,
    },
  };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const offsetWeeks = Number(body.offsetWeeks ?? 0);
  const { since, until, label } = weekRange(offsetWeeks);

  const [commits, sanity, supabaseData] = await Promise.all([
    fetchGitHubCommits(since, until),
    fetchSanityActivity(since, until),
    fetchSupabaseActivity(since, until),
  ]);

  const rawData = { week: label, since, until, commits, sanity, supabase: supabaseData };

  // Build a compact prose brief so Claude uses its budget on analysis, not parsing
  const lines: string[] = [`WEEK: ${label}`];

  if (commits && commits.length > 0) {
    lines.push(`\nCODE COMMITS (${commits.length}):`);
    commits.forEach((c) => lines.push(`- ${c.message}`));
  } else {
    lines.push("\nCODE COMMITS: None this week.");
  }

  if (sanity) {
    lines.push(`\nSANITY CMS: ${sanity.publishedTotal} published, ${sanity.draftsTotal} drafts updated.`);
    if (sanity.publishedItems.length > 0) {
      lines.push("Published:");
      sanity.publishedItems.forEach((d) => lines.push(`- [${d.type}] ${d.title}`));
    }
    if (sanity.draftItems.length > 0) {
      lines.push("Drafts in progress:");
      sanity.draftItems.forEach((d) => lines.push(`- [${d.type}] ${d.title}`));
    }
  }

  if (supabaseData) {
    const { newMembers, payments, totalRevenueNgn, database } = supabaseData;
    lines.push(`\nPLATFORM:`);
    lines.push(`- New members: ${newMembers.length}${newMembers.length > 0 ? " — " + newMembers.map((m: { full_name: string | null; membership_tier: string }) => `${m.full_name ?? "unnamed"} (${m.membership_tier})`).join(", ") : ""}`);
    lines.push(`- Payments: ${payments.length} transaction(s), total ₦${totalRevenueNgn.toLocaleString()}`);
    if (database.operators + database.contractors + database.engineers + database.regulators + database.researchSources > 0) {
      lines.push(`- Database additions: ${database.operators} operators, ${database.contractors} contractors, ${database.engineers} engineers, ${database.regulators} regulators, ${database.researchSources} research sources`);
    }
  }

  const dataBrief = lines.join("\n");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are generating a weekly progress report for APRN Africa — a membership platform for African pipeline research and engineering professionals.

This report is from Joseph Agwuh (Director of Applied Engineering) to Lucy Okeke (Founder & Executive Director).

Tone: professional, direct, factual. No filler phrases. No "I'm pleased to report." Bullets over prose. Lucy is sharp — tell her what happened, not how hard you worked.

Structure your output in exactly this format (markdown):

## Week of ${label}

### What Shipped
[Technical work delivered — features, fixes, infrastructure. Each bullet = one meaningful change. Use the commit messages to describe the actual feature or fix — no jargon, plain English. If no commits, write "No deployments this week."]

### Content & Intelligence
[CMS activity — list every published document by name and type. List any draft content in progress. If nothing, skip this section.]

### Platform Activity
[New members with their tier, payments in ₦, any database additions. Every number should be stated explicitly.]

### Notes
— Joseph to complete —

Rules: Do NOT add a "Coming Up Next" section. Do NOT add a sign-off. Do NOT mention this was AI-generated. Do NOT truncate or summarise — include every item from the data.`;

  const userPrompt = `${dataBrief}

Generate the full weekly report now. Include every commit, every content item, every member.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const firstBlock = message.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    return NextResponse.json({ error: "Unexpected model response format" }, { status: 500 });
  }
  const content = (firstBlock as { type: "text"; text: string }).text;

  return NextResponse.json({ content, rawData, label });
}
