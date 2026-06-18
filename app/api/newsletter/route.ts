import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

// In-process rate limit: max 5 attempts per IP per 10 minutes.
// Resets on cold start — sufficient to stop burst bot attacks on serverless.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many requests. Try again later." }, { status: 429 });
  }

  const { firstName, email, org } = await req.json();

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) {
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
