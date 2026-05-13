"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "./types";

const AUTH_HINT_COOKIE = "lt_auth";
const AUTH_HINT_MAX_AGE = 60 * 60 * 24 * 30;

function setAuthHintCookie(present: boolean) {
  if (typeof document === "undefined") return;
  const isHttps =
    typeof location !== "undefined" && location.protocol === "https:";
  if (present) {
    document.cookie = `${AUTH_HINT_COOKIE}=1; path=/; max-age=${AUTH_HINT_MAX_AGE}; samesite=lax${isHttps ? "; secure" : ""}`;
  } else {
    document.cookie = `${AUTH_HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setSession: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setTokens: (data: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: User) => void;
  clear: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setSession: ({ user, accessToken, refreshToken }) => {
        setAuthHintCookie(true);
        set({ user, accessToken, refreshToken });
      },
      setTokens: ({ accessToken, refreshToken }) => {
        setAuthHintCookie(true);
        set({ accessToken, refreshToken });
      },
      setUser: (user) => set({ user }),
      clear: () => {
        setAuthHintCookie(false);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "lt-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        if (state?.refreshToken) setAuthHintCookie(true);
      },
    },
  ),
);
