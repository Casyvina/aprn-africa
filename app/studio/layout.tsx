import { redirect } from "next/navigation";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  // In production: only allow access if STUDIO_ENABLED env var is explicitly set to "true".
  // On Vercel, do NOT set this var — studio should be used via sanity.io/manage instead.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.STUDIO_ENABLED !== "true"
  ) {
    redirect("/");
  }

  return <>{children}</>;
}
