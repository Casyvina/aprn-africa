import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_TIERS = ["free", "student", "graduate", "professional", "associate", "corporate"];

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

export async function POST(req: NextRequest) {
  // Verify the caller is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, tier } = await req.json();

  if (!userId || !tier) {
    return NextResponse.json({ error: "Missing userId or tier" }, { status: 400 });
  }

  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ membership_tier: tier, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Admin tier update error:", error);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId, tier });
}
