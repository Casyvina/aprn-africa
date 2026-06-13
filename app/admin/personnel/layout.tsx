import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Only Lucy and Joseph may access personnel documents
const PERSONNEL_EMAILS = ["info@aprn-africa.org", "josephagwuh@gmail.com"];

export default async function PersonnelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!PERSONNEL_EMAILS.includes(user.email?.toLowerCase() ?? "")) redirect("/admin");

  return <>{children}</>;
}
