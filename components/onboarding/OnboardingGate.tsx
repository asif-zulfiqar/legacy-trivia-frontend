"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { useMe } from "@/lib/auth/queries";

/**
 * Guards the /onboarding route. Mirrors AuthGate, but additionally bounces
 * users who have already finished onboarding straight to the game. Server-side
 * `proxy.ts` only knows the auth-presence cookie, so completion is enforced
 * here on the client where the verified user object is available.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { data: user, isError, isLoading } = useMe();

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken && !refreshToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, refreshToken, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (isError) {
      const stillHas = useAuthStore.getState().refreshToken;
      if (!stillHas) router.replace("/login");
    }
  }, [hydrated, isError, router]);

  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace("/game");
    }
  }, [user?.onboardingCompleted, router]);

  if (!hydrated || (accessToken && isLoading && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040C1A] text-white">
        <div className="font-londrina text-xl font-[900] tracking-wide">
          Loading...
        </div>
      </div>
    );
  }

  if (!accessToken && !refreshToken) return null;
  if (user?.onboardingCompleted) return null;

  return <>{children}</>;
}
