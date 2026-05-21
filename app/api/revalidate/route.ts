import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// Maps Sanity document types → Next.js cache tags
const TYPE_TO_TAGS: Record<string, string[]> = {
  newsletter:          ["newsletter"],
  subscriber:          ["newsletter"],
  researchReport:      ["insights"],
  editorialInsight:    ["insights"],
  intelligenceUpdate:  ["intelligence", "insights"],
  pipelineCorridor:    ["infrastructure"],
  infrastructureProject: ["infrastructure"],
  trainingProgram:     ["training"],
  organizationPartner: ["partnerships"],
  person:              ["leadership"],
  homepageConfig:      ["homepage"],
  siteSettings:        ["site"],
  topic:               ["insights", "newsletter"],
  country:             ["infrastructure"],
};

function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  // Sanity signature format: t=<timestamp>,v1=<hex-hmac>
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.split("=", 2) as [string, string])
  );
  const { t: timestamp, v1: signature } = parts;
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  // If no secret is configured, reject all requests
  if (!secret) {
    return NextResponse.json({ message: "Webhook secret not configured." }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("sanity-webhook-signature") ?? "";

  if (!verifySignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  let body: { _type?: string; _id?: string } = {};
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const docType = body._type ?? "";
  const tags = TYPE_TO_TAGS[docType] ?? ["site"];

  // Revalidate all matching tags in parallel
  // expire: 0 = immediate expiration, required for external webhook callers
  await Promise.all(tags.map((tag) => revalidateTag(tag, { expire: 0 })));

  return NextResponse.json({
    revalidated: true,
    type: docType,
    tags,
  });
}
