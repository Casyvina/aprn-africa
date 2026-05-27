import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";

export type MembershipTier =
  | "free"
  | "student"
  | "graduate"
  | "professional"
  | "associate"
  | "corporate";

export interface Profile {
  id: string;
  full_name:    string | null;
  job_title:    string | null;
  discipline:   string | null;
  organisation: string | null;
  country:      string | null;
  linkedin_url: string | null;
  bio:          string | null;
  avatar_url:   string | null;
  membership_tier: MembershipTier;
  topics:       string[];
  updated_at:   string | null;
}

interface AuthState {
  user:      User | null;
  session:   Session | null;
  profile:   Profile | null;
  isLoading: boolean;

  setUser:    (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  /** Merge partial profile fields into the existing profile */
  updateProfile: (partial: Partial<Profile>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  session:   null,
  profile:   null,
  isLoading: true,

  setUser:    (user)      => set({ user }),
  setSession: (session)   => set({ session }),
  setProfile: (profile)   => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  updateProfile: (partial) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...partial } : null,
    })),
  clear: () => set({ user: null, session: null, profile: null, isLoading: false }),
}));
