import { NextRequest } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@/lib/supabase/server";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

fal.config({ credentials: process.env.FAL_KEY });

type FalImageSize =
  | "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9"
  | { width: number; height: number };

const FORMAT_SIZES: Record<string, FalImageSize> = {
  linkedin:       { width: 1200, height: 627  },
  newsletter:     { width: 1200, height: 400  },
  event_banner:   "landscape_16_9",
  research_cover: { width: 800,  height: 1000 },
  social_square:  "square_hd",
};

const BRAND_PREFIX =
  "Professional, authoritative visual for APRN Africa — a pan-African pipeline research and professional networking organisation. " +
  "Dark navy blue colour palette (#071B2A) with gold accents (#D4A017). " +
  "African pipeline infrastructure context. Clean corporate style, no text or typography overlays. ";

interface FalOutput {
  images: Array<{ url: string; width: number; height: number; content_type: string }>;
  seed: number;
  prompt: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const {
    prompt,
    format = "event_banner",
    includeBrandContext = true,
  } = await req.json() as { prompt?: string; format?: string; includeBrandContext?: boolean };

  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
  }

  const fullPrompt = includeBrandContext ? `${BRAND_PREFIX}${prompt}` : prompt;
  const imageSize: FalImageSize = FORMAT_SIZES[format] ?? "landscape_16_9";

  try {
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt: fullPrompt,
        image_size: imageSize,
        num_images: 1,
        output_format: "jpeg",
        enhance_prompt: false,
      },
    });

    const output = result.data as FalOutput;
    const image = output?.images?.[0];

    if (!image?.url) {
      return new Response(JSON.stringify({ error: "No image returned from Fal.ai" }), { status: 500 });
    }

    return Response.json({
      url: image.url,
      width: image.width,
      height: image.height,
      seed: output.seed,
      format,
      prompt: fullPrompt,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
