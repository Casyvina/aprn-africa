import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: suggestion } = await admin
    .from("ai_research_suggestions")
    .select("*")
    .eq("id", id)
    .single();

  if (!suggestion) return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
  if (suggestion.status !== "pending") return NextResponse.json({ error: "Already reviewed" }, { status: 400 });

  // Insert into the target table
  const { data: editedData } = await req.json().catch(() => ({ data: null }));
  const rowToInsert = editedData ?? suggestion.suggested_data;

  const { error: insertError } = await admin
    .from(suggestion.target_table as "pipeline_engineers")
    .insert(rowToInsert);

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Mark as accepted
  await admin
    .from("ai_research_suggestions")
    .update({ status: "accepted", reviewed_by: user.email, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
