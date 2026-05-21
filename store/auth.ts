import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";

type MembershipTier = "free" | "professional" | "institutional" | null;

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  specialisation: string | null;
  membership_tier: MembershipTier;
  role: "member" | "admin" | "student" | "institution";
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, session: null, profile: null, isLoading: false }),
}));
