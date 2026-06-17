import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SavedPageClient from "@/components/SavedPageClient";

export const metadata = { title: "Saved Articles | APRN" };

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("saved_items")
    .select("id, item_id, item_type, item_slug, item_title, saved_at")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  return <SavedPageClient initialItems={items ?? []} />;
}
