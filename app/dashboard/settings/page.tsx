import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsTabs from "@/components/SettingsTabs";

export const metadata = { title: "Account Settings | APRN" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: notifPrefs }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, job_title, discipline, organisation, country, linkedin_url, bio, membership_tier, avatar_url")
      .eq("id", user.id)
      .single(),
    supabase
      .from("notification_preferences")
      .select("newsletter_weekly, research_alerts, event_reminders, member_activity")
      .eq("user_id", user.id)
      .single(),
  ]);

  return (
    <SettingsTabs
      user={{ id: user.id, email: user.email ?? "" }}
      profile={profile}
      notifPrefs={notifPrefs}
    />
  );
}
