import { Suspense } from "react";
import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "How to Play | Legacy Trivia",
};

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#040C1A] text-white">
          <div className="font-londrina text-xl font-[900] tracking-wide">
            Loading...
          </div>
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}
