import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

const SCHEMAS: Record<string, { fields: string[]; description: string }> = {
  pipeline_operators: {
    description: "African pipeline operators — oil companies, gas companies, national oil companies",
    fields: ["company_name", "country", "type", "key_pipeline_assets", "hq_address", "website", "contact_person", "title", "email", "phone", "notes"],
  },
  contractors_epc: {
    description: "EPC contractors and engineering firms working on African pipeline projects",
    fields: ["company_name", "country_hq", "specialisation", "key_projects_africa", "address", "website", "contact_person", "email", "phone", "notes"],
  },
  pipeline_engineers: {
    description: "Individual pipeline engineers and professionals working in Africa",
    fields: ["full_name", "organisation", "role_specialisation", "qualifications", "location", "linkedin_web", "email", "phone", "notes"],
  },
  regulators_associations: {
    description: "Regulatory bodies, professional associations, and development organisations relevant to African pipeline sector",
    fields: ["organisation", "type", "country_region", "relevance_to_aprn", "website", "contact_email", "key_contact_title", "phone", "notes"],
  },
  research_sources: {
    description: "Research sources, publications, and online resources about African pipelines and energy",
    fields: ["title", "url", "description", "category", "source_type", "date_published", "added_by", "notes"],
  },
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, prompt, existingRecord } = await req.json();

  const schema = SCHEMAS[table];
  if (!schema) return NextResponse.json({ error: "Invalid table" }, { status: 400 });

  const client = new Anthropic();

  const systemPrompt = `You are a database assistant for APRN Africa, a membership platform for African pipeline research and engineering professionals.
Your job is to generate or update database records for the "${table}" table.
Table description: ${schema.description}
Fields: ${schema.fields.join(", ")}

Return ONLY a valid JSON object with those exact field names. No explanation, no markdown, no code fences.
Use null for unknown fields. Be accurate and professional.`;

  const userPrompt = existingRecord
    ? `Update this existing record based on the instruction: "${prompt}"\n\nExisting record:\n${JSON.stringify(existingRecord, null, 2)}\n\nReturn the complete updated record as JSON.`
    : `Generate a new database record based on: "${prompt}"\n\nReturn a JSON object with these fields: ${schema.fields.join(", ")}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  let record: Record<string, unknown>;
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    record = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON", raw: text }, { status: 500 });
  }

  return NextResponse.json({ record });
}
