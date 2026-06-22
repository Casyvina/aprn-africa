import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import CampaignDetailClient from "@/components/CampaignDetailClient";

export const metadata = { title: "Campaign | APRN Outreach" };

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const [campaignRes, opsRes, epcRes, engRes, regRes] = await Promise.all([
    admin.from("outreach_campaigns").select("*, outreach_recipients(*)").eq("id", id).single(),
    admin.from("pipeline_operators").select("id, company_name, contact_person, email, country").order("company_name"),
    admin.from("contractors_epc").select("id, company_name, contact_person, email, country_hq").order("company_name"),
    admin.from("pipeline_engineers").select("id, full_name, email, organisation, location").order("full_name"),
    admin.from("regulators_associations").select("id, organisation, contact_email, country_region").order("organisation"),
  ]);

  if (!campaignRes.data) notFound();

  return (
    <CampaignDetailClient
      campaign={campaignRes.data}
      operators={opsRes.data ?? []}
      contractors={epcRes.data ?? []}
      engineers={engRes.data ?? []}
      regulators={regRes.data ?? []}
    />
  );
}
