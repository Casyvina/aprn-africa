import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import * as XLSX from "xlsx";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function GET(req: NextRequest) {
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

  // Summary sheet
  const summaryData = [
    ["APRN Africa — Pipeline Industry Database"],
    ["Generated:", new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
    [""],
    ["Sheet", "Records"],
    ["Pipeline Operators", ops.data?.length ?? 0],
    ["Contractors & EPC", epc.data?.length ?? 0],
    ["Pipeline Engineers", engineers.data?.length ?? 0],
    ["Regulators & Associations", regs.data?.length ?? 0],
    ["Research Sources", sources.data?.length ?? 0],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary Dashboard");

  // Pipeline Operators
  const opsHeaders = ["#", "Company Name", "Country", "Type", "Key Pipeline Assets", "HQ Address", "Website", "Contact Person", "Title", "Email", "Phone", "Notes"];
  const opsRows = (ops.data ?? []).map((r, i) => [
    i + 1, r.company_name, r.country, r.type, r.key_pipeline_assets,
    r.hq_address, r.website, r.contact_person, r.title, r.email, r.phone, r.notes,
  ]);
  const opsWs = XLSX.utils.aoa_to_sheet([opsHeaders, ...opsRows]);
  XLSX.utils.book_append_sheet(wb, opsWs, "Pipeline Operators");

  // Contractors & EPC
  const epcHeaders = ["#", "Company Name", "Country/HQ", "Specialisation", "Key Projects in Africa", "Address", "Website", "Contact Person", "Email", "Phone", "Notes"];
  const epcRows = (epc.data ?? []).map((r, i) => [
    i + 1, r.company_name, r.country_hq, r.specialisation, r.key_projects_africa,
    r.address, r.website, r.contact_person, r.email, r.phone, r.notes,
  ]);
  const epcWs = XLSX.utils.aoa_to_sheet([epcHeaders, ...epcRows]);
  XLSX.utils.book_append_sheet(wb, epcWs, "Contractors & EPC");

  // Pipeline Engineers
  const engHeaders = ["#", "Full Name", "Organisation", "Role / Specialisation", "Qualifications", "Location", "LinkedIn / Web Profile", "Email", "Phone", "Notes"];
  const engRows = (engineers.data ?? []).map((r, i) => [
    i + 1, r.full_name, r.organisation, r.role_specialisation, r.qualifications,
    r.location, r.linkedin_web, r.email, r.phone, r.notes,
  ]);
  const engWs = XLSX.utils.aoa_to_sheet([engHeaders, ...engRows]);
  XLSX.utils.book_append_sheet(wb, engWs, "Pipeline Engineers");

  // Regulators & Associations
  const regHeaders = ["#", "Organisation", "Type", "Country / Region", "Relevance to APRN", "Website", "Contact Email", "Key Contact / Title", "Phone", "Notes"];
  const regRows = (regs.data ?? []).map((r, i) => [
    i + 1, r.organisation, r.type, r.country_region, r.relevance_to_aprn,
    r.website, r.contact_email, r.key_contact_title, r.phone, r.notes,
  ]);
  const regWs = XLSX.utils.aoa_to_sheet([regHeaders, ...regRows]);
  XLSX.utils.book_append_sheet(wb, regWs, "Regulators & Associations");

  // Research Sources
  const srcHeaders = ["#", "Title", "URL", "Description", "Category", "Source Type", "Date Published", "Added By", "Notes"];
  const srcRows = (sources.data ?? []).map((r, i) => [
    i + 1, r.title, r.url, r.description, r.category,
    r.source_type, r.date_published, r.added_by, r.notes,
  ]);
  const srcWs = XLSX.utils.aoa_to_sheet([srcHeaders, ...srcRows]);
  XLSX.utils.book_append_sheet(wb, srcWs, "Research Sources");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const filename = `APRN_Pipeline_Database_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
