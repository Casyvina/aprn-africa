"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import type { Profile } from "@/store/auth";

export default function DashboardHydrator({ profile }: { profile: Partial<Profile> }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  useEffect(() => {
    updateProfile(profile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
