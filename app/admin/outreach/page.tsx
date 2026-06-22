import { createAdminClient } from "@/lib/supabase/admin";
import OutreachListClient from "@/components/OutreachListClient";

export const metadata = { title: "Outreach | APRN Admin" };

export default async function OutreachPage() {
  const admin = createAdminClient();
  const { data: campaigns } = await admin
    .from("outreach_campaigns")
    .select("*, outreach_recipients(count)")
    .order("created_at", { ascending: false });

  return <OutreachListClient initialCampaigns={campaigns ?? []} />;
}
