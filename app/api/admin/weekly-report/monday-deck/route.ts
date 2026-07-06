import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

function sanitize(text: string): string {
  return text.replace(/-->/g, "→").replace(/->/g, "→").replace(/--/g, "—").replace(/\s{2,}/g, " ").trim();
}

const NAVY  = "071B2A";
const NAVY2 = "0D2436";
const GOLD  = "D4A017";
const WHITE = "FFFFFF";
const SLATE = "94A3B8";
const W = 13.33;
const H = 7.5;

interface DeckSection { title: string; bullets: string[] }

function formatWeekDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function addSlideFooter(slide: PptxGenJS.Slide, prs: PptxGenJS, weekLabel: string) {
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.42, w: W, h: 0.42,
    fill: { color: GOLD }, line: { color: GOLD },
  });
  slide.addText("APRN Africa  ·  Internal", {
    x: 0.4, y: H - 0.35, w: 5, h: 0.28,
    fontSize: 7, color: NAVY, bold: true, valign: "middle",
  });
  slide.addText(weekLabel, {
    x: W - 5, y: H - 0.35, w: 4.6, h: 0.28,
    fontSize: 7, color: NAVY, align: "right", valign: "middle",
  });
}

function addSectionSlide(
  prs: PptxGenJS,
  section: DeckSection,
  index: number,
  total: number,
  weekLabel: string,
  logoData: string,
) {
  const MAX_PER_SLIDE = 7;
  const chunks: string[][] = [];
  for (let i = 0; i < Math.max(1, section.bullets.length); i += MAX_PER_SLIDE) {
    chunks.push(section.bullets.slice(i, i + MAX_PER_SLIDE));
  }

  chunks.forEach((chunk, chunkIdx) => {
    const slide = prs.addSlide();
    slide.background = { color: NAVY };

    // Left accent bar
    slide.addShape(prs.ShapeType.rect, {
      x: 0, y: 0, w: 0.1, h: H - 0.42,
      fill: { color: GOLD }, line: { color: GOLD },
    });

    // Section number badge
    slide.addShape(prs.ShapeType.rect, {
      x: 0.3, y: 0.28, w: 0.46, h: 0.46,
      fill: { color: GOLD }, line: { color: GOLD },
    });
    slide.addText(String(index + 1), {
      x: 0.3, y: 0.28, w: 0.46, h: 0.46,
      fontSize: 14, color: NAVY, bold: true, align: "center", valign: "middle",
    });

    // Section title
    const suffix = chunks.length > 1 ? ` (${chunkIdx + 1}/${chunks.length})` : "";
    slide.addText(section.title + suffix, {
      x: 0.92, y: 0.3, w: W - 3, h: 0.5,
      fontSize: 22, color: GOLD, bold: true, fontFace: "Calibri",
    });

    // Slide counter top-right
    slide.addText(`${index + 1} / ${total}`, {
      x: W - 1.8, y: 0.35, w: 1.5, h: 0.35,
      fontSize: 9, color: SLATE, align: "right", fontFace: "Calibri",
    });

    // Divider
    slide.addShape(prs.ShapeType.line, {
      x: 0.3, y: 0.9, w: W - 0.6, h: 0,
      line: { color: GOLD + "35", width: 0.5 },
    });

    // Bullets
    if (chunk.length === 0) {
      slide.addText("Nothing planned for this section.", {
        x: 0.4, y: 1.2, w: W - 0.8, h: 0.5,
        fontSize: 11, color: SLATE, italic: true, fontFace: "Calibri",
      });
    } else {
      const bulletObjects = chunk.map((b) => ({
        text: sanitize(b),
        options: {
          bullet: { type: "number" as const },
          color: WHITE,
          fontSize: 12,
          fontFace: "Calibri",
          paraSpaceBefore: 6,
          indentLevel: 0,
        },
      }));
      slide.addText(bulletObjects, {
        x: 0.5, y: 1.05, w: W - 1.1, h: H - 1.75,
        valign: "top", wrap: true,
      });
    }

    // Logo
    if (logoData) {
      slide.addImage({ data: logoData, x: W - 1.75, y: 0.22, w: 1.35, h: 0.48 });
    }

    addSlideFooter(slide, prs, weekLabel);
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    weekDate?: string;
    theme?: string;
    sections?: { title: string; lines: string }[];
  };

  const { weekDate = new Date().toISOString().slice(0, 10), theme = "", sections = [] } = body;

  const weekLabel = formatWeekDate(weekDate);

  // Parse each section's textarea lines into bullets
  const deckSections: DeckSection[] = sections
    .map((s) => ({
      title: sanitize(s.title),
      bullets: (s.lines ?? "")
        .split("\n")
        .map((l) => sanitize(l.replace(/^[-*•]\s*/, "")))
        .filter(Boolean),
    }))
    .filter((s) => s.title);

  // Load logo
  let logoData = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
    const buf = fs.readFileSync(logoPath);
    logoData = `image/png;base64,${buf.toString("base64")}`;
  } catch {
    // slides still work without logo
  }

  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.title = `APRN Monday Meeting — ${weekLabel}`;
  prs.author = "Joseph Agwuh";
  prs.company = "APRN Africa";

  // ── Cover slide ────────────────────────────────────────────────────────────
  const cover = prs.addSlide();
  cover.background = { color: NAVY };

  // Gold top band
  cover.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 1.0,
    fill: { color: GOLD }, line: { color: GOLD },
  });

  // Logo on band
  if (logoData) {
    cover.addImage({ data: logoData, x: 0.5, y: 0.13, w: 2.7, h: 0.69 });
  } else {
    cover.addText("APRN Africa", {
      x: 0.5, y: 0.15, w: 4, h: 0.7,
      fontSize: 22, color: NAVY, bold: true, fontFace: "Calibri",
    });
  }

  cover.addText("MONDAY MEETING", {
    x: W - 4.5, y: 0.32, w: 4.2, h: 0.38,
    fontSize: 10, color: NAVY, bold: true, align: "right",
    fontFace: "Calibri", charSpacing: 4,
  });

  // Main content panel
  cover.addShape(prs.ShapeType.rect, {
    x: 0.5, y: 1.5, w: W - 1, h: 4.0,
    fill: { color: NAVY2 }, line: { color: GOLD + "25" },
  });

  // Week date
  cover.addText(weekLabel, {
    x: 0.85, y: 1.85, w: W - 1.7, h: 1.0,
    fontSize: 30, color: WHITE, bold: true, fontFace: "Calibri",
    valign: "middle", wrap: true,
  });

  // Theme
  if (theme.trim()) {
    cover.addShape(prs.ShapeType.rect, {
      x: 0.85, y: 3.05, w: 0.04, h: 0.72,
      fill: { color: GOLD }, line: { color: GOLD },
    });
    cover.addText(sanitize(theme), {
      x: 1.05, y: 3.0, w: W - 2, h: 0.8,
      fontSize: 16, color: GOLD, fontFace: "Calibri",
      valign: "middle", wrap: true,
    });
  }

  // Prepared by
  cover.addText("Presented by Joseph Agwuh  ·  Director, Applied Engineering", {
    x: 0.85, y: 4.0, w: W - 1.7, h: 0.35,
    fontSize: 9, color: SLATE, fontFace: "Calibri",
  });

  // Agenda count
  if (deckSections.length > 0) {
    cover.addText(`${deckSections.length} agenda item${deckSections.length !== 1 ? "s" : ""}`, {
      x: 0.85, y: 4.4, w: W - 1.7, h: 0.3,
      fontSize: 9, color: SLATE + "99", fontFace: "Calibri",
    });
  }

  // Bottom bar
  cover.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.42, w: W, h: 0.42,
    fill: { color: GOLD }, line: { color: GOLD },
  });
  cover.addText("INTERNAL  ·  NOT FOR DISTRIBUTION", {
    x: 0, y: H - 0.35, w: W, h: 0.28,
    fontSize: 7, color: NAVY, bold: true, align: "center", fontFace: "Calibri",
  });

  // ── Section slides ─────────────────────────────────────────────────────────
  deckSections.forEach((section, i) => {
    addSectionSlide(prs, section, i, deckSections.length, weekLabel, logoData);
  });

  // ── Closing slide ──────────────────────────────────────────────────────────
  const closing = prs.addSlide();
  closing.background = { color: NAVY };

  closing.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 1.0,
    fill: { color: GOLD }, line: { color: GOLD },
  });

  if (logoData) {
    closing.addImage({ data: logoData, x: 0.5, y: 0.13, w: 2.7, h: 0.69 });
  }

  closing.addText("Thank you", {
    x: 0, y: 2.2, w: W, h: 1.2,
    fontSize: 48, color: WHITE, bold: true, align: "center",
    fontFace: "Calibri", valign: "middle",
  });
  closing.addText(weekLabel, {
    x: 0, y: 3.6, w: W, h: 0.55,
    fontSize: 14, color: GOLD, align: "center", fontFace: "Calibri",
  });
  closing.addText("info@aprn-africa.org  ·  aprn-africa.org", {
    x: 0, y: 4.3, w: W, h: 0.4,
    fontSize: 10, color: SLATE, align: "center", fontFace: "Calibri",
  });

  closing.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.42, w: W, h: 0.42,
    fill: { color: GOLD }, line: { color: GOLD },
  });

  // ── Output ─────────────────────────────────────────────────────────────────
  const rawBuffer = await prs.write({ outputType: "nodebuffer" }) as Buffer;
  const buffer = new Uint8Array(rawBuffer);
  const safeDate = weekDate.replace(/-/g, "");
  const filename = `APRN-Monday-${safeDate}.pptx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(rawBuffer.length),
    },
  });
}
