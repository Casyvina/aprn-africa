import { createAdminClient } from "@/lib/supabase/admin";
import DatabasePageClient, { type DbRow } from "@/components/DatabasePageClient";

export const metadata = { title: "Pipeline Database | APRN Admin" };

export default async function DatabasePage() {
  const admin = createAdminClient();

  const [ops, epc, engineers, regs, sources] = await Promise.all([
    admin.from("pipeline_operators").select("*").order("company_name"),
    admin.from("contractors_epc").select("*").order("company_name"),
    admin.from("pipeline_engineers").select("*").order("full_name"),
    admin.from("regulators_associations").select("*").order("organisation"),
    admin.from("research_sources").select("*").order("date_published", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
  ]);

  return (
    <DatabasePageClient
      initialOperators={(ops.data ?? []) as DbRow[]}
      initialContractors={(epc.data ?? []) as DbRow[]}
      initialEngineers={(engineers.data ?? []) as DbRow[]}
      initialRegulators={(regs.data ?? []) as DbRow[]}
      initialSources={(sources.data ?? []) as DbRow[]}
    />
  );
}
