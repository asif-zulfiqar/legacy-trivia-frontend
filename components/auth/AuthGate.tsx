"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { useMe } from "@/lib/auth/queries";

export function AuthGate({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
