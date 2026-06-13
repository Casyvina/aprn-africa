import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { type, context } = await req.json() as { type: string; context?: string };

  let systemPrompt = "You are a strategic communications expert for APRN Africa, a pan-African pipeline research and networking organisation founded by Lucy Okeke. Write in a professional, authoritative tone appropriate for a B2B NGO operating across Africa and internationally.";
  let userPrompt = "";

  switch (type) {
    case "regenerate_comms":
      systemPrompt += " You are improving APRN's internal communication strategy document.";
      userPrompt = `Review and improve this APRN communication strategy. Keep all stakeholder names and roles exactly as provided. Enhance the channel recommendations and frequency based on best practices for a pan-African NGO operating across government, industry, and international partners. Return well-structured content with clear sections.\n\nCurrent strategy context:\n${context ?? ""}`;
      break;

    case "engagement_brief":
      userPrompt = `Write a 150-word APRN stakeholder engagement brief for: ${context}. Include: (1) their importance to APRN, (2) what APRN offers them, (3) recommended first contact approach, and (4) key talking points. Be specific to APRN's mission in African pipeline research, training, and advocacy.`;
      break;

    case "summarise_document": {
      const hasContent = (context ?? "").includes("Document content:");
      if (hasContent) {
        userPrompt = `Provide a 3-bullet executive summary of this APRN document. Each bullet must be 1 concise sentence. Cover: (1) key purpose, (2) main findings or content highlights, (3) relevance to APRN's mission in African pipeline research and capacity building.\n\n${context}`;
      } else {
        userPrompt = `Based on the following document metadata, write a 3-bullet executive summary for an APRN internal document library. Each bullet must be 1 concise sentence. Cover: (1) what this document is and its purpose, (2) the likely scope and audience based on the title/description, (3) how it relates to APRN's mission in African pipeline research and capacity building. Work only from the information given — do not ask for more.\n\n${context}`;
      }
      break;
    }

    default:
      return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400 });
  }

  // Stream response
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
