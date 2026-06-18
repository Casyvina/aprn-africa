import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import XLSX from "xlsx-js-style";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

// ─── Brand tokens ────────────────────────────────────────────────────────────

const NAVY  = "FF071B2A"; // navy-900
const CARD  = "FF0D2436"; // navy-800
const GOLD  = "FFD4A017"; // gold-500
const WHITE = "FFFFFFFF";
const SLATE = "FF94A3B8"; // slate-400
const ROW_ALT = "FF0A2133"; // slightly lighter than navy-900

// ─── Style helpers ───────────────────────────────────────────────────────────

type CellStyle = {
  font?: { bold?: boolean; color?: { rgb: string }; sz?: number; name?: string };
  fill?: { fgColor: { rgb: string } };
  alignment?: { horizontal?: string; vertical?: string; wrapText?: boolean };
  border?: {
    top?: { style: string; color: { rgb: string } };
    bottom?: { style: string; color: { rgb: string } };
    left?: { style: string; color: { rgb: string } };
    right?: { style: string; color: { rgb: string } };
  };
};

const FONT_BASE = "Calibri";

function headerCell(value: string): { v: string; t: string; s: CellStyle } {
  return {
    v: value,
    t: "s",
    s: {
      font: { bold: true, color: { rgb: GOLD }, sz: 10, name: FONT_BASE },
      fill: { fgColor: { rgb: NAVY } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        bottom: { style: "medium", color: { rgb: GOLD } },
      },
    },
  };
}

function dataCell(
  value: string | number | null | undefined,
  rowIdx: number,
  opts: { url?: boolean; center?: boolean } = {}
): { v: string | number; t: string; s: CellStyle } {
  const isAlt = rowIdx % 2 === 0;
  return {
    v: value ?? "",
    t: typeof value === "number" ? "n" : "s",
    s: {
      font: {
        color: { rgb: opts.url ? GOLD : WHITE },
        sz: 9,
        name: FONT_BASE,
      },
      fill: { fgColor: { rgb: isAlt ? NAVY : ROW_ALT } },
      alignment: {
        horizontal: opts.center ? "center" : "left",
        vertical: "center",
        wrapText: true,
      },
      border: {
        bottom: { style: "thin", color: { rgb: "FF15324A" } },
      },
    },
  };
}

function titleCell(value: string, sz = 14): { v: string; t: string; s: CellStyle } {
  return {
    v: value,
    t: "s",
    s: {
      font: { bold: true, color: { rgb: GOLD }, sz, name: FONT_BASE },
      fill: { fgColor: { rgb: NAVY } },
      alignment: { horizontal: "left", vertical: "center" },
    },
  };
}

function metaCell(value: string): { v: string; t: string; s: CellStyle } {
  return {
    v: value,
    t: "s",
    s: {
      font: { color: { rgb: SLATE }, sz: 9, name: FONT_BASE },
      fill: { fgColor: { rgb: NAVY } },
      alignment: { horizontal: "left", vertical: "center" },
    },
  };
}

function summaryLabelCell(value: string): { v: string; t: string; s: CellStyle } {
  return {
    v: value,
    t: "s",
    s: {
      font: { bold: true, color: { rgb: WHITE }, sz: 10, name: FONT_BASE },
      fill: { fgColor: { rgb: CARD } },
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        bottom: { style: "thin", color: { rgb: "FF15324A" } },
      },
    },
  };
}

function summaryCountCell(value: number, rowIdx: number): { v: number; t: string; s: CellStyle } {
  const isAlt = rowIdx % 2 === 0;
  return {
    v: value,
    t: "n",
    s: {
      font: { bold: true, color: { rgb: GOLD }, sz: 10, name: FONT_BASE },
      fill: { fgColor: { rgb: isAlt ? CARD : NAVY } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        bottom: { style: "thin", color: { rgb: "FF15324A" } },
      },
    },
  };
}

function emptyCell(): { v: string; t: string; s: CellStyle } {
  return { v: "", t: "s", s: { fill: { fgColor: { rgb: NAVY } } } };
}

// ─── Sheet builder ───────────────────────────────────────────────────────────

function buildSheet(
  headers: string[],
  rows: (string | number | null | undefined)[][],
  colWidths: number[],
  urlColIdx?: number
): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};

  // Header row (row 0)
  headers.forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 0, c })] = headerCell(h);
  });

  // Data rows
  rows.forEach((row, ri) => {
    row.forEach((val, c) => {
      ws[XLSX.utils.encode_cell({ r: ri + 1, c })] = dataCell(val, ri, {
        url: c === urlColIdx,
        center: c === 0,
      });
    });
  });

  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: headers.length - 1 } });
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));
  ws["!rows"] = [{ hpt: 28 }, ...rows.map(() => ({ hpt: 20 }))];

  return ws;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const [ops, epc, engineers, regs, sources] = await Promise.all([
    admin.from("pipeline_operators").select("*").order("company_name"),
    admin.from("contractors_epc").select("*").order("company_name"),
    admin.from("pipeline_engineers").select("*").order("full_name"),
    admin.from("regulators_associations").select("*").order("organisation"),
    admin.from("research_sources").select("*").order("created_at", { ascending: false }),
  ]);

  const wb = XLSX.utils.book_new();

  // ── Summary Dashboard ──────────────────────────────────────────────────────
  const summaryWs: XLSX.WorkSheet = {};
  const generated = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  summaryWs["A1"] = titleCell("APRN Africa — Pipeline Industry Database", 16);
  summaryWs["A2"] = metaCell(`Generated: ${generated}`);
  summaryWs["A3"] = emptyCell();
  summaryWs["A4"] = headerCell("Data Sheet");
  summaryWs["B4"] = headerCell("Records");

  const summaryRows = [
    ["Pipeline Operators",        ops.data?.length      ?? 0],
    ["Contractors & EPC",         epc.data?.length      ?? 0],
    ["Pipeline Engineers",        engineers.data?.length ?? 0],
    ["Regulators & Associations", regs.data?.length     ?? 0],
    ["Research Sources",          sources.data?.length  ?? 0],
  ] as [string, number][];

  summaryRows.forEach(([label, count], i) => {
    summaryWs[XLSX.utils.encode_cell({ r: 4 + i, c: 0 })] = summaryLabelCell(label);
    summaryWs[XLSX.utils.encode_cell({ r: 4 + i, c: 1 })] = summaryCountCell(count, i);
  });

  summaryWs["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 8, c: 1 } });
  summaryWs["!cols"] = [{ wch: 36 }, { wch: 12 }];
  summaryWs["!rows"] = [{ hpt: 36 }, { hpt: 18 }, { hpt: 10 }, { hpt: 26 }, ...summaryRows.map(() => ({ hpt: 22 }))];
  summaryWs["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary Dashboard");

  // ── Pipeline Operators ─────────────────────────────────────────────────────
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(
      ["#", "Company Name", "Country", "Type", "Key Pipeline Assets", "HQ Address", "Website", "Contact Person", "Title", "Email", "Phone", "Notes"],
      (ops.data ?? []).map((r, i) => [i + 1, r.company_name, r.country, r.type, r.key_pipeline_assets, r.hq_address, r.website, r.contact_person, r.title, r.email, r.phone, r.notes]),
      [4, 28, 14, 16, 32, 26, 24, 20, 18, 24, 16, 28],
      6
    ),
    "Pipeline Operators"
  );

  // ── Contractors & EPC ──────────────────────────────────────────────────────
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(
      ["#", "Company Name", "Country / HQ", "Specialisation", "Key Projects in Africa", "Address", "Website", "Contact Person", "Email", "Phone", "Notes"],
      (epc.data ?? []).map((r, i) => [i + 1, r.company_name, r.country_hq, r.specialisation, r.key_projects_africa, r.address, r.website, r.contact_person, r.email, r.phone, r.notes]),
      [4, 28, 16, 22, 32, 24, 24, 20, 24, 16, 28],
      6
    ),
    "Contractors & EPC"
  );

  // ── Pipeline Engineers ─────────────────────────────────────────────────────
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(
      ["#", "Full Name", "Organisation", "Role / Specialisation", "Qualifications", "Location", "LinkedIn / Web Profile", "Email", "Phone", "Notes"],
      (engineers.data ?? []).map((r, i) => [i + 1, r.full_name, r.organisation, r.role_specialisation, r.qualifications, r.location, r.linkedin_web, r.email, r.phone, r.notes]),
      [4, 24, 26, 26, 22, 18, 30, 24, 16, 28],
      6
    ),
    "Pipeline Engineers"
  );

  // ── Regulators & Associations ──────────────────────────────────────────────
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(
      ["#", "Organisation", "Type", "Country / Region", "Relevance to APRN", "Website", "Contact Email", "Key Contact / Title", "Phone", "Notes"],
      (regs.data ?? []).map((r, i) => [i + 1, r.organisation, r.type, r.country_region, r.relevance_to_aprn, r.website, r.contact_email, r.key_contact_title, r.phone, r.notes]),
      [4, 30, 18, 18, 34, 26, 24, 26, 16, 28],
      5
    ),
    "Regulators & Associations"
  );

  // ── Research Sources ───────────────────────────────────────────────────────
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(
      ["#", "Title", "URL", "Description", "Category", "Source Type", "Date Published", "Added By", "Notes"],
      (sources.data ?? []).map((r, i) => [i + 1, r.title, r.url, r.description, r.category, r.source_type, r.date_published, r.added_by, r.notes]),
      [4, 40, 40, 40, 18, 16, 16, 16, 28],
      2
    ),
    "Research Sources"
  );

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const filename = `APRN_Pipeline_Database_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
