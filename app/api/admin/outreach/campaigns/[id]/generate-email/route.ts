import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";

function isAdmin(email: string | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { mode } = await req.json() as { mode: "general" | "personalized" };

  const admin = createAdminClient();
  const { data: campaign } = await admin
    .from("outreach_campaigns")
    .select("*, outreach_recipients(*)")
    .eq("id", id)
    .single();

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  if (mode === "general") {
    const recipientCount = campaign.outreach_recipients?.length ?? 0;
    const recipientTypes = [...new Set((campaign.outreach_recipients ?? []).map((r: { recipient_type: string }) => r.recipient_type))].join(", ");

    const prompt = `You are writing a professional outreach email on behalf of APRN Africa — the leading network for African pipeline engineering and energy sector professionals.

Campaign goal: ${campaign.goal}

Audience: ${recipientCount} contacts (${recipientTypes || "mixed"}) — pipeline engineers, EPC contractors, operators, and regulatory professionals across Africa.

Write a single email template. Use {{first_name}} as the only merge tag for personalisation.

Rules:
- Subject line: specific, professional, no clickbait
- Opening: address by first name, 1 sentence on why we're reaching out
- Body: 2–3 short paragraphs, direct and factual — no filler phrases
- CTA: one clear call to action
- Sign-off: Joseph Agwuh, Director of Applied Engineering, APRN Africa

Respond with ONLY valid JSON, no markdown fences:
{
  "subject": "...",
  "body": "Full email body with {{first_name}} placeholder..."
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "Model returned no JSON" }, { status: 500 });
    const generated = JSON.parse(match[0]) as { subject: string; body: string };

    // Save template to campaign
    await admin
      .from("outreach_campaigns")
      .update({ subject: generated.subject, body_template: generated.body })
      .eq("id", id);

    return NextResponse.json({ subject: generated.subject, body: generated.body });
  }

  // Personalized: generate a tailored opening for each recipient in one batch call
  const recipients = (campaign.outreach_recipients ?? []).filter((r: { status: string }) => r.status !== "no_email");
  if (!recipients.length) return NextResponse.json({ error: "No recipients with email addresses" }, { status: 400 });

  const recipientList = recipients
    .map((r: { id: string; recipient_name: string; recipient_type: string }) =>
      `- id: ${r.id} | name: ${r.recipient_name} | type: ${r.recipient_type}`
    )
    .join("\n");

  const prompt = `You are writing personalized outreach emails on behalf of APRN Africa — the leading network for African pipeline engineering and energy sector professionals.

Campaign goal: ${campaign.goal}

Recipients:
${recipientList}

For each recipient, write a personalized email. Reference their name and role/type naturally. Keep each email concise: subject + 3 short paragraphs + one CTA. Sign off: Joseph Agwuh, Director of Applied Engineering, APRN Africa.

Important: be warm but professional. No generic platitudes. Mention APRN Africa's value proposition relevant to their specific profile.

Respond with ONLY valid JSON array — no markdown fences:
[
  {
    "recipient_id": "...",
    "subject": "...",
    "body": "Full personalized email body..."
  }
]`;

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return NextResponse.json({ error: "Model returned no JSON" }, { status: 500 });
  const generated = JSON.parse(match[0]) as { recipient_id: string; subject: string; body: string }[];

  // Save personalized bodies per recipient
  await Promise.all(
    generated.map((g) =>
      admin
        .from("outreach_recipients")
        .update({ personalized_body: g.body })
        .eq("id", g.recipient_id)
        .eq("campaign_id", id)
    )
  );

  // Use first as template subject (they share a subject for personalized too)
  const subject = generated[0]?.subject ?? campaign.subject ?? "";
  await admin.from("outreach_campaigns").update({ subject, campaign_type: "personalized" }).eq("id", id);

  return NextResponse.json({ generated, subject });
}
