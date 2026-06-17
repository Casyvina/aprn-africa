import { createAdminClient } from "@/lib/supabase/admin";
import WeeklyReportClient from "@/components/WeeklyReportClient";

export const metadata = { title: "Weekly Report | APRN Admin" };

export default async function WeeklyReportPage() {
  const admin = createAdminClient();
  const { data: reports } = await admin
    .from("weekly_reports")
    .select("id, week_of, subject, sent_at, sent_by, created_at")
    .order("week_of", { ascending: false })
    .limit(20);

  return <WeeklyReportClient pastReports={reports ?? []} />;
}
