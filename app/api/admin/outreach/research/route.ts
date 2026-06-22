import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";

function isAdmin(email: string | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

const TARGET_SHAPES: Record<string, string> = {
  pipeline_engineers: `{
    "full_name": "...",
    "role_specialisation": "e.g. Pipeline Integrity Engineer",
    "organisation": "Company name",
    "location": "City, Country",
    "email": "if known or null",
    "linkedin_web": "if known or null",
    "qualifications": "e.g. BEng, CEng, COREN",
    "notes": "why this person is relevant to APRN"
  }`,
  pipeline_operators: `{
    "company_name": "...",
    "type": "e.g. National Oil Company",
    "contact_person": "key contact name if known",
    "title": "their job title if known",
    "country": "country of operations",
    "email": "if known or null",
    "website": "if known or null",
    "key_pipeline_assets": "known pipeline assets",
    "notes": "why relevant to APRN"
  }`,
  contractors_epc: `{
    "company_name": "...",
    "specialisation": "e.g. Pipeline Construction, Integrity Management",
    "contact_person": "if known",
    "country_hq": "...",
    "email": "if known or null",
    "website": "if known or null",
    "key_projects_africa": "notable African pipeline projects",
    "notes": "why relevant to APRN"
  }`,
  regulators_associations: `{
    "organisation": "...",
    "type": "e.g. Regulator, Industry Association",
    "country_region": "...",
    "contact_email": "if known or null",
    "website": "if known or null",
    "key_contact_title": "e.g. Director General",
    "relevance_to_aprn": "why relevant"
  }`,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, target_table, count = 5 } = await req.json() as {
    prompt: string;
    target_table: keyof typeof TARGET_SHAPES;
    count?: number;
  };

  if (!prompt?.trim() || !target_table) {
    return NextResponse.json({ error: "prompt and target_table are required" }, { status: 400 });
  }

  if (!TARGET_SHAPES[target_table]) {
    return NextResponse.json({ error: "Invalid target_table" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Pull existing names to help Claude avoid duplicates
  const nameField = target_table === "pipeline_engineers" ? "full_name"
    : target_table === "regulators_associations" ? "organisation"
    : "company_name";

  const { data: existing } = await admin
    .from(target_table as "pipeline_engineers")
    .select(nameField)
    .limit(100);

  const existingNames = (existing ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r: any) => (r as Record<string, string | null>)[nameField])
    .filter(Boolean)
    .slice(0, 60)
    .join(", ");

  const shape = TARGET_SHAPES[target_table];
  const tableLabel = target_table.replace(/_/g, " ");

  const systemPrompt = `You are a research assistant for APRN Africa — a professional network for African pipeline engineering and energy sector professionals. Your job is to suggest real, verifiable ${tableLabel} that should be in our database.

CRITICAL RULES:
- Only suggest real, named organisations or people that actually exist in the African energy/pipeline sector
- Do NOT invent names, companies, or contact details
- If you are not confident a specific email or LinkedIn exists, set it to null — do not guess
- Every entry must be genuinely relevant to African pipeline infrastructure
- Flag anything uncertain in the "notes" field`;

  const userPrompt = `Research brief: ${prompt}

Target database: ${tableLabel}
Suggestions needed: ${count}

Already in our database (avoid duplicates): ${existingNames || "none yet"}

Return exactly ${count} suggestions as a JSON array. Each entry must match this shape:
${shape}

Return ONLY a valid JSON array. No markdown, no explanation.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return NextResponse.json({ error: "Model returned no JSON" }, { status: 500 });

  let suggestions: Record<string, unknown>[];
  try {
    suggestions = JSON.parse(match[0]) as Record<string, unknown>[];
  } catch {
    return NextResponse.json({ error: "Failed to parse model JSON" }, { status: 500 });
  }

  // Save suggestions as pending review
  const rows = suggestions.map((s) => ({
    target_table,
    suggested_data: s as import("@/types/database").Json,
    source_context: prompt,
    status: "pending" as const,
  }));

  const { data: saved, error } = await admin
    .from("ai_research_suggestions")
    .insert(rows)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ suggestions: saved, count: saved?.length ?? 0 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("ai_research_suggestions")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
