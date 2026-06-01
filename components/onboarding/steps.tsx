"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { SparkleIcon } from "@/app/assets/icons";
import { Leaderboard } from "@/components/common/Leaderboard";

/**
 * Onboarding tutorial content. Backgrounds and section illustrations are
 * referenced by path under `public/images/onboarding/`; drop the exported
 * Figma assets there to have them appear (missing backgrounds fall back to the
 * base cosmic colour, missing illustrations simply show their alt text).
 */

const ONB = "/images/onboarding";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#16203C]/85 px-5 py-2 font-londrina text-xs font-[900] uppercase tracking-[0.12em] text-white/90">
      {children}
    </span>
  );
}

function StepBadge({
  number,
  color,
}: {
  number: number;
  color: "gold" | "teal";
}) {
  const styles =
    color === "gold"
      ? "bg-gradient-to-br from-[#FFC24B] to-[#E89A1C]"
      : "bg-gradient-to-br from-[#3FD0D8] to-[#1C9AA8]";
  return (
    <span
      className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full font-londrina text-base font-[900] text-white shadow-[inset_0px_2px_1px_0px_#FFFFFF66] ${styles}`}
    >
      {number}
    </span>
  );
}

function HowToPlayScreen() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="Legacy Trivia"
        className="mb-8 w-40 select-none sm:w-52"
      />
      <h1 className="font-londrina text-6xl font-[900] leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-8xl">
        How to Play
      </h1>
      <p className="mt-6 font-londrina text-lg font-[900] text-white/85 sm:text-xl">
        Understand the rules before you begin.
      </p>
    </div>
  );
}

function GameObjectiveScreen() {
  return (
    <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
      <div>
        <Chip>Your Goal</Chip>
        <h2 className="mt-5 font-londrina text-5xl font-[900] leading-none text-white sm:text-6xl">
          Game Objective
        </h2>
        <p className="mt-5 max-w-xl font-londrina text-lg font-[900] leading-relaxed text-white/85">
          Climb the Ladder of Ascent by answering trivia questions. Each correct
          answer moves you up and increases your potential prize.
        </p>
        <ul className="mt-8 space-y-5">
          <li className="flex items-center gap-4">
            <StepBadge number={1} color="gold" />
            <span className="font-londrina text-lg font-[900] text-white">
              Answer 15 questions correctly to win $15.
            </span>
          </li>
          <li className="flex items-center gap-4">
            <StepBadge number={2} color="teal" />
            <span className="font-londrina text-lg font-[900] text-white">
              Wrong answer = you drop to the last milestone you passed.
            </span>
          </li>
        </ul>
      </div>
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ONB}/game-objective.png`}
          alt="Game stage"
          className="w-full max-w-lg select-none"
        />
      </div>
    </div>
  );
}

function EmpressGuardScreen() {
  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ONB}/empress-guard.png`}
        alt="Empress's Guard"
        className="pointer-events-none absolute -top-24 right-0 hidden w-40 select-none lg:block"
      />
      <Chip>Who We Are</Chip>
      <h2 className="mt-5 font-londrina text-5xl font-[900] leading-none text-white underline decoration-[#5FC5FF] decoration-4 underline-offset-[10px] sm:text-6xl">
        Your Empress&apos;s Guard
      </h2>
      <p className="mx-auto mt-6 max-w-2xl font-londrina text-lg font-[900] leading-relaxed text-white/90">
        This is your one-time safety net. If you answer incorrectly, your Guard
        protects you from dropping and lets you retry the question.
      </p>
      <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl bg-[#A77BE8]/45 px-8 py-5 shadow-[inset_0px_2px_2px_0px_#FFFFFF33]">
        <p className="font-londrina text-2xl font-[900] text-white sm:text-3xl">
          You only get one per game. Use it wisely.
        </p>
      </div>
    </div>
  );
}

function TreasuryScreen() {
  return (
    <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ONB}/treasury.png`}
          alt="Treasury"
          className="w-full max-w-md select-none"
        />
      </div>
      <div>
        <Chip>Balance</Chip>
        <h2 className="mt-5 font-londrina text-5xl font-[900] leading-none text-white sm:text-6xl">
          Your Treasury
        </h2>
        <p className="mt-6 font-londrina text-lg font-[900] leading-relaxed text-white/85">
          Your balance gem holds your winnings.
        </p>
        <p className="mt-2 font-londrina text-lg font-[900] leading-relaxed text-white/85">
          Use it to purchase Gems, which power your lifelines.
        </p>
      </div>
    </div>
  );
}

const LIFELINES = [
  {
    title: "Ask a Friend",
    description: "Removes two incorrect answers.",
    icon: `${ONB}/lifeline-ask-friend.png`,
  },
  {
    title: "Ask the Audience",
    description: "See what the audience picked.",
    icon: `${ONB}/lifeline-audience.png`,
  },
  {
    title: "The Reveal",
    description: "Briefly highlight the correct answer.",
    icon: `${ONB}/lifeline-reveal.png`,
  },
  {
    title: "Time Freeze",
    description: "Stops the timer for 15 seconds.",
    icon: `${ONB}/lifeline-time-freeze.png`,
  },
];

function LifelineCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-[26px] bg-[#9168E0]/40 p-2 shadow-[inset_0px_2px_2px_0px_#FFFFFF26]">
      <div className="flex h-full flex-col items-center rounded-[20px] bg-gradient-to-b from-[#9F73F2] to-[#7C44E6] px-6 py-8 text-center shadow-[inset_0px_-6px_8px_0px_#00000026]">
        <div className="mb-5 flex size-[88px] items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt={title} className="size-12 select-none" />
        </div>
        <h3 className="font-londrina text-2xl font-[900] text-white">{title}</h3>
        <p className="mt-2 font-londrina text-sm font-[900] leading-snug text-white/85">
          {description}
        </p>
      </div>
    </div>
  );
}

function LifelinesScreen() {
  return (
    <div className="flex w-full max-w-7xl flex-col items-center text-center">
      <Chip>Boosts</Chip>
      <h2 className="mt-5 font-londrina text-5xl font-[900] leading-none text-white sm:text-6xl">
        About Lifelines
      </h2>
      <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LIFELINES.map((lifeline) => (
          <LifelineCard key={lifeline.title} {...lifeline} />
        ))}
      </div>
    </div>
  );
}

export function LeaderboardScreen({
  onStartGame,
  starting,
}: {
  onStartGame: () => void;
  starting: boolean;
}) {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center text-center">
      <Chip>Winners&apos; Ladder</Chip>
      <h2 className="mt-4 font-londrina text-5xl font-[900] leading-none text-white sm:text-6xl">
        This is the Live Leaderboard
      </h2>
      <p className="mt-3 font-londrina text-base font-[900] text-white/85 sm:text-lg">
        Updated every 30 minutes with the top players of the season.
      </p>

      <div className="mt-8 w-full">
        <Leaderboard limit={5} />
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onStartGame}
        disabled={starting}
        className="mt-8 h-[55px] min-w-[220px] px-8 py-0 font-londrina text-[22px] font-[900] leading-none disabled:opacity-70"
      >
        {starting ? "Starting..." : "Start Game"}
        <span className="flex size-5 scale-[0.7] items-center justify-center">
          <SparkleIcon />
        </span>
      </Button>
      <p className="mt-3 font-londrina text-sm font-[900] text-white/85">
        No practice. No second chances. Play smart.
      </p>
    </div>
  );
}

export interface OnboardingStep {
  key: string;
  popup?: boolean;
  background?: string;
  content?: ReactNode;
}

export const STEPS: OnboardingStep[] = [
  { key: "welcome", popup: true },
  {
    key: "how-to-play",
    background: `${ONB}/how-to-play-bg.png`,
    content: <HowToPlayScreen />,
  },
  {
    key: "game-objective",
    background: `${ONB}/game-objective-bg.png`,
    content: <GameObjectiveScreen />,
  },
  {
    key: "empress-guard",
    background: `${ONB}/empress-guard-bg.png`,
    content: <EmpressGuardScreen />,
  },
  {
    key: "treasury",
    background: `${ONB}/treasury-bg.png`,
    content: <TreasuryScreen />,
  },
  {
    key: "lifelines",
    background: `${ONB}/lifelines-bg.png`,
    content: <LifelinesScreen />,
  },
  {
    // Content is rendered by OnboardingFlow (it needs the Start Game handler).
    key: "leaderboard",
    background: `${ONB}/leaderboard-bg.png`,
  },
];

export const LAST_STEP_INDEX = STEPS.length - 1;
