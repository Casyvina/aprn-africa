import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

// ── Colours ──────────────────────────────────────────────────────────────────
const NAVY    = "071B2A";
const NAVY2   = "0D2436";
const GOLD    = "D4A017";
const WHITE   = "FFFFFF";
const SLATE   = "94A3B8";

// ── Slide dimensions (LAYOUT_WIDE = 13.33" × 7.5") ───────────────────────────
const W = 13.33;
const H = 7.5;

// ── Parse markdown sections ───────────────────────────────────────────────────
interface Section { title: string; bullets: string[] }

function sanitize(text: string): string {
  return text.replace(/-->/g, "→").replace(/->/g, "→").replace(/--/g, "—").replace(/\s{2,}/g, " ").trim();
}

function parseSections(markdown: string): { reportTitle: string; sections: Section[] } {
  const lines = markdown.split("\n");
  let reportTitle = "APRN Engineering Report";
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      reportTitle = sanitize(line.replace(/^## /, ""));
    } else if (line.startsWith("### ")) {
      if (current) sections.push(current);
      current = { title: sanitize(line.replace(/^### /, "")), bullets: [] };
    } else if ((line.startsWith("- ") || line.startsWith("* ")) && current) {
      const text = sanitize(line.replace(/^[-*] /, ""));
      if (text) current.bullets.push(text);
    } else if (line.startsWith("— ") && current) {
      current.bullets.push(sanitize(line));
    }
  }
  if (current) sections.push(current);
  return { reportTitle, sections };
}

// ── Add a gold bar at the bottom of every slide ───────────────────────────────
function addFooter(slide: PptxGenJS.Slide, prs: PptxGenJS, label: string) {
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.45, w: W, h: 0.45,
    fill: { color: GOLD }, line: { color: GOLD },
  });
  slide.addText("APRN Africa  ·  Confidential", {
    x: 0.4, y: H - 0.38, w: 6, h: 0.3,
    fontSize: 7, color: NAVY, bold: true, valign: "middle",
  });
  slide.addText(label, {
    x: W - 5, y: H - 0.38, w: 4.6, h: 0.3,
    fontSize: 7, color: NAVY, align: "right", valign: "middle",
  });
}

// ── Content slide (section title + bullets, auto-wrap to multiple slides) ────
function addContentSlide(
  prs: PptxGenJS,
  section: Section,
  periodLabel: string,
  logoData: string,
) {
  const MAX_PER_SLIDE = 8;
  const chunks: string[][] = [];
  for (let i = 0; i < Math.max(1, section.bullets.length); i += MAX_PER_SLIDE) {
    chunks.push(section.bullets.slice(i, i + MAX_PER_SLIDE));
  }

  chunks.forEach((chunk, idx) => {
    const slide = prs.addSlide();
    slide.background = { color: NAVY };

    // Left gold bar accent
    slide.addShape(prs.ShapeType.rect, {
      x: 0, y: 0, w: 0.12, h: H - 0.45,
      fill: { color: GOLD }, line: { color: GOLD },
    });

    // Section title
    const suffix = chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : "";
    slide.addText(section.title + suffix, {
      x: 0.4, y: 0.35, w: W - 1.5, h: 0.7,
      fontSize: 20, color: GOLD, bold: true, fontFace: "Calibri",
    });

    // Divider line
    slide.addShape(prs.ShapeType.line, {
      x: 0.4, y: 1.1, w: W - 0.8, h: 0,
      line: { color: GOLD + "40", width: 0.5 },
    });

    // Bullets
    if (chunk.length === 0) {
      slide.addText("Nothing to report this period.", {
        x: 0.4, y: 1.4, w: W - 0.8, h: 0.5,
        fontSize: 11, color: SLATE, italic: true, fontFace: "Calibri",
      });
    } else {
      const bulletObjects = chunk.map((b) => ({
        text: b,
        options: { bullet: { code: "25BA" }, color: WHITE, fontSize: 11, fontFace: "Calibri", paraSpaceBefore: 4 },
      }));
      slide.addText(bulletObjects, {
        x: 0.5, y: 1.3, w: W - 1, h: H - 2.1,
        valign: "top", wrap: true,
      });
    }

    // Logo top-right
    slide.addImage({ data: logoData, x: W - 1.8, y: 0.25, w: 1.4, h: 0.5 });

    addFooter(slide, prs, periodLabel);
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    content?: string;
    periodLabel?: string;
    mode?: string;
  };

  const { content = "", periodLabel = "Report" } = body;
  if (!content) return NextResponse.json({ error: "No report content provided" }, { status: 400 });

  // ── Load logo ──────────────────────────────────────────────────────────────
  let logoData = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
    const buf = fs.readFileSync(logoPath);
    logoData = `image/png;base64,${buf.toString("base64")}`;
  } catch {
    // no logo — slides still work
  }

  const { reportTitle, sections } = parseSections(content);

  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.title = `APRN Engineering Report — ${periodLabel}`;
  prs.author = "Joseph Agwuh";
  prs.company = "APRN Africa";

  // ── Slide 1: Cover ─────────────────────────────────────────────────────────
  const cover = prs.addSlide();
  cover.background = { color: NAVY };

  // Full-width gold band at top
  cover.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 1.1,
    fill: { color: GOLD }, line: { color: GOLD },
  });

  // Logo on the gold band
  if (logoData) {
    cover.addImage({ data: logoData, x: 0.55, y: 0.15, w: 2.8, h: 0.72 });
  } else {
    cover.addText("APRN Africa", {
      x: 0.55, y: 0.2, w: 4, h: 0.7,
      fontSize: 22, color: NAVY, bold: true, fontFace: "Calibri",
    });
  }

  // "ENGINEERING REPORT" label on band right
  cover.addText("ENGINEERING REPORT", {
    x: W - 4.5, y: 0.35, w: 4.2, h: 0.45,
    fontSize: 10, color: NAVY, bold: true, align: "right",
    fontFace: "Calibri", charSpacing: 3,
  });

  // Dark panel for main content
  cover.addShape(prs.ShapeType.rect, {
    x: 0.55, y: 1.6, w: W - 1.1, h: 3.8,
    fill: { color: NAVY2 }, line: { color: GOLD + "30" },
  });

  // Report title
  cover.addText(reportTitle, {
    x: 0.9, y: 2.0, w: W - 1.8, h: 1.6,
    fontSize: 32, color: WHITE, bold: true, fontFace: "Calibri",
    valign: "middle", wrap: true,
  });

  // Period label
  cover.addText(periodLabel, {
    x: 0.9, y: 3.7, w: W - 1.8, h: 0.5,
    fontSize: 14, color: GOLD, fontFace: "Calibri",
  });

  // Prepared by
  cover.addText("Prepared by Joseph Agwuh  ·  Director, Applied Engineering", {
    x: 0.9, y: 4.4, w: W - 1.8, h: 0.4,
    fontSize: 9, color: SLATE, fontFace: "Calibri",
  });

  // Bottom bar
  cover.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.45, w: W, h: 0.45,
    fill: { color: GOLD }, line: { color: GOLD },
  });
  cover.addText("CONFIDENTIAL  ·  INTERNAL USE ONLY", {
    x: 0, y: H - 0.38, w: W, h: 0.3,
    fontSize: 7, color: NAVY, bold: true, align: "center", fontFace: "Calibri",
  });

  // ── Content slides ─────────────────────────────────────────────────────────
  for (const section of sections) {
    addContentSlide(prs, section, periodLabel, logoData);
  }

  // ── Generate buffer ────────────────────────────────────────────────────────
  const rawBuffer = await prs.write({ outputType: "nodebuffer" }) as Buffer;
  const buffer = new Uint8Array(rawBuffer);
  const filename = `APRN-Report-${periodLabel.replace(/[^a-zA-Z0-9]/g, "-")}.pptx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(rawBuffer.length),
    },
  });
}
