"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import type { Profile } from "@/store/auth";

export default function DashboardHydrator({ profile }: { profile: Partial<Profile> }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const setLoading    = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    // Seed profile from server-fetched data and clear the loading flag
    // so client components don't flash empty state waiting for AuthProvider.
    updateProfile(profile);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
