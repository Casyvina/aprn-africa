import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsTabs from "@/components/SettingsTabs";

export const metadata = { title: "Account Settings | APRN" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, membership_tier")
    .eq("id", user.id)
    .single();

  return (
    <SettingsTabs
      user={{ id: user.id, email: user.email ?? "" }}
      profile={profile}
    />
  );
}
