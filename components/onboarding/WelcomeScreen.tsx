"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SparkleIcon } from "@/app/assets/icons";

/**
 * First onboarding step — the welcome popup shown to every brand-new user
 * (email signup + Google first sign-in alike). Reuses the ornate
 * `form-popup.png` frame from the auth dialogs for visual consistency.
 */
export function WelcomeScreen({
  name,
  onBegin,
}: {
  name: string;
  onBegin: () => void;
}) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#040C1A] px-4"
      style={{
        backgroundImage: "url(/images/onboarding/welcome-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[url(/images/auth-bg.png)] bg-cover" />
      <div className="relative z-10 flex min-h-[366px] w-full max-w-[370px] items-center justify-center px-9 py-12 text-center sm:px-[35px]">
        <Image
          src="/images/form-popup.jpg"
          alt=""
          fill
          sizes="370px"
          className="pointer-events-none select-none"
        />
        <div className="relative z-10 mx-auto max-w-[423px]">
          <h2 className="font-londrina text-[30px] font-[900] leading-none text-white">
            Welcome, {name}!
          </h2>
          <p className="mx-auto mt-3 max-w-[405px] font-londrina text-sm md:text-lg font-[900] leading-[1.7] text-white">
            You have been granted access to The Legacy Ascent. This is a
            seasonal event. Your journey begins now. May your mind be sharp and
            your ascent be legendary.
          </p>
          <Button
            type="button"
            onClick={onBegin}
            size="lg"
            className="mx-auto mt-8 h-[55px] min-w-[207px] px-8 py-0 font-londrina text-[22px] font-[900] leading-none"
          >
            Begin The Tutorial
            <span className="flex size-6 scale-[0.72] items-center justify-center">
              <SparkleIcon />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
