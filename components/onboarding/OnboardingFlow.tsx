"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { SparkleIcon } from "@/app/assets/icons";
import { useAuthStore } from "@/lib/auth/store";
import { useCompleteOnboarding } from "@/lib/auth/queries";
import { navigateAfterAuth } from "@/lib/auth/navigate";
import { extractErrorMessage } from "@/lib/api";
import { STEPS, LAST_STEP_INDEX, LeaderboardScreen } from "./steps";
import { WelcomeScreen } from "./WelcomeScreen";
import { OnboardingShell } from "./OnboardingShell";
import { NavButton } from "./NavButton";

/**
 * Tutorial stepper. The active step lives in the `?step=` query param so a
 * refresh keeps the user on the same screen. The Back / Next buttons move
 * between steps; the final screen's "Start Game" marks onboarding complete on
 * the server and hard-navigates into the game (so the auth cookie and the
 * onboarding gate both see a fresh request).
 */
export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const complete = useCompleteOnboarding();

  const rawStep = Number(searchParams?.get("step") ?? "0");
  const step = Number.isFinite(rawStep)
    ? Math.min(Math.max(Math.trunc(rawStep), 0), LAST_STEP_INDEX)
    : 0;

  const goToStep = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), LAST_STEP_INDEX);
      router.replace(`/onboarding?step=${clamped}`);
    },
    [router],
  );

  const finish = useCallback(() => {
    if (complete.isPending) return;
    complete.mutate(undefined, {
      onSuccess: () => navigateAfterAuth("/game"),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  }, [complete]);

  const current = STEPS[step];
  const name = user?.firstName || "Adventurer";

  if (current.popup) {
    return <WelcomeScreen name={name} onBegin={() => goToStep(step + 1)} />;
  }

  const isLast = step === LAST_STEP_INDEX;

  return (
    <OnboardingShell
      background={current.background}
      left={
        <NavButton
          variant="back"
          label="Back"
          onClick={() => goToStep(step - 1)}
        />
      }
      right={
        isLast ? (
          <Button
            type="button"
            size="lg"
            onClick={finish}
            disabled={complete.isPending}
            className="h-[55px] min-w-[170px] px-8 py-0 font-londrina text-base md:text-[22px] font-[900] leading-none disabled:opacity-70"
          >
            {complete.isPending ? "Starting..." : "Start Game"}
            <span className="flex size-5 scale-[0.7] items-center justify-center">
              <SparkleIcon />
            </span>
          </Button>
        ) : (
          <NavButton
            variant="next"
            label="Next"
            onClick={() => goToStep(step + 1)}
          />
        )
      }
    >
      {isLast ? (
        <LeaderboardScreen onStartGame={finish} starting={complete.isPending} />
      ) : (
        current.content
      )}
    </OnboardingShell>
  );
}
