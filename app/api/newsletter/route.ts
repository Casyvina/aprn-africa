import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

export async function POST(req: NextRequest) {
  const { firstName, email, org } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "A valid email address is required." }, { status: 400 });
  }

  const sanity = getSanityWriteClient();

  if (!sanity) {
    // Dev fallback — Sanity not configured, log and accept
    console.log("[newsletter] Sanity not configured — subscriber:", { firstName, email, org });
    return NextResponse.json({ ok: true });
  }

  // Idempotent: use email as deterministic document ID so duplicates are ignored
  const docId = `subscriber-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  await sanity
    .transaction()
    .createIfNotExists({
      _id:          docId,
      _type:        "subscriber",
      email:        email.toLowerCase().trim(),
      firstName:    firstName?.trim() ?? "",
      org:          org?.trim() ?? "",
      active:       true,
      subscribedAt: new Date().toISOString(),
    })
    // If they already exist, ensure they're marked active
    .patch(docId, (p) => p.set({ active: true }))
    .commit();

  return NextResponse.json({ ok: true });
}
