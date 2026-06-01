"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  BadgeIconOne,
  BadgeIconTwo,
  LifelineCardBgIcon,
  SparkleIcon,
} from "@/app/assets/icons";
import { Leaderboard } from "@/components/common/Leaderboard";
import Image from "next/image";

/**
 * Onboarding tutorial content. Backgrounds and section illustrations are
 * referenced by path under `public/images/onboarding/`; drop the exported
 * Figma assets there to have them appear (missing backgrounds fall back to the
 * base cosmic colour, missing illustrations simply show their alt text).
 */

const ONB = "/images";

function Chip({ children }: { children: ReactNode }) {
  return (
    <Button
      variant="ghost"
      className="w-[150px] text-base font-londrina font-[900] uppercase text-white"
    >
      {children}
    </Button>
  );
}

function HowToPlayScreen() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="Legacy Trivia"
        className="w-40 select-none sm:w-52"
      />
      <h1 className="font-londrina text-5xl md:text-7xl font-[900] leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-8xl">
        How to Play
      </h1>
      <p className="mt-2 font-londrina text-lg font-[900] text-white/85 sm:text-2xl">
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
        <h2 className="mt-5 font-londrina text-4xl md:text-6xl font-[900] leading-none text-white sm:text-6xl">
          Game Objective
        </h2>
        <p className="mt-5 max-w-xl font-londrina text-lg md:text-xl font-[900] leading-relaxed text-white/85">
          Climb the Ladder of Ascent by answering trivia questions. Each correct
          answer moves you up and increases your potential prize.
        </p>
        <ul className="mt-8 space-y-5">
          <li className="flex items-center gap-4">
            <span className="shrink-0 w-[64px]">
              <BadgeIconOne />
            </span>
            <span className="font-londrina text-lg md:text-xl font-[900] text-white">
              Answer 15 questions correctly to win $15.
            </span>
          </li>
          <li className="flex items-center gap-4">
            <span className="shrink-0 w-[64px]">
              <BadgeIconTwo />
            </span>
            <span className="font-londrina text-lg md:text-xl font-[900] text-white">
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
      <Image
        src={`${ONB}/gameplayimage.png`}
        alt="Empress's Guard"
        className="pointer-events-none absolute -top-8 -right-16 hidden w-40 select-none lg:block"
        width={255}
        height={275}
      />
      <Chip>Who We Are</Chip>
      <h2 className="mt-5 font-londrina text-4xl md:text-6xl font-[900] leading-none text-white sm:text-6xl">
        Your Empress&apos;s Guard
      </h2>
      <p className="mx-auto mt-6 max-w-2xl font-londrina text-lg md:text-xl font-[900] leading-relaxed text-white/90">
        This is your one-time safety net. If you answer incorrectly, your Guard
        protects you from dropping and lets you retry the question.
      </p>
      <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl bg-[#B24BE4] px-8 py-5 shadow-[inset_0px_-4px_2px_0px_#8E38C1]">
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
      <div className="flex justify-center order-2 lg:order-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={`${ONB}/yourtreasury.png`}
          alt="Treasury"
          className="w-full max-w-md select-none"
          width={108}
          height={108}
        />
      </div>
      <div className="order-1 lg:order-2">
        <Chip>Balance</Chip>
        <h2 className="mt-5 font-londrina text-4xl md:text-6xl font-[900] leading-none text-white sm:text-6xl">
          Your Treasury
        </h2>
        <p className="mt-6 font-londrina text-lg md:text-xl font-[900] leading-relaxed text-white/85">
          Your balance gem holds your winnings.
        </p>
        <p className="mt-2 font-londrina text-lg md:text-xl font-[900] leading-relaxed text-white/85">
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
    icon: `${ONB}/ask-a-friend.png`,
  },
  {
    title: "Ask the Audience",
    description: "See what the audience picked.",
    icon: `${ONB}/ask-the-audience.png`,
  },
  {
    title: "The Reveal",
    description: "Briefly highlight the correct answer.",
    icon: `${ONB}/reveal.png`,
  },
  {
    title: "Time Freeze",
    description: "Stops the timer for 15 seconds.",
    icon: `${ONB}/freeze.png`,
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
    <div className="rounded-[26px] p-2 relative">
      <div className="flex h-full flex-col items-center rounded-[20px] bg-[url('/images/lifelinecardbg.png')] bg-cover bg-no-repeat px-6 py-10 text-center">
        {/* <div className="absolute inset-0">
          <LifelineCardBgIcon />
        </div> */}
        <div className="mb-5 flex size-[88px] items-center justify-center rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt={title} className="select-none" />
        </div>
        <h3 className="font-londrina text-2xl font-[900] text-white">
          {title}
        </h3>
        <p className="mt-2 font-londrina text-base md:text-lg font-[900] leading-snug text-white/85">
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
      <h2 className="mt-5 font-londrina text-4xl md:text-6xl font-[900] leading-none text-white sm:text-6xl">
        About Lifelines
      </h2>
      <div className="mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
    background: `${ONB}/hero-bg.jpg`,
    content: <HowToPlayScreen />,
  },
  {
    key: "game-objective",
    background: `${ONB}/game-objective-bg.png`,
    content: <GameObjectiveScreen />,
  },
  {
    key: "empress-guard",
    background: `${ONB}/about-bg.png`,
    content: <EmpressGuardScreen />,
  },
  {
    key: "treasury",
    background: `${ONB}/treasury-bg.png`,
    content: <TreasuryScreen />,
  },
  {
    key: "lifelines",
    background: `${ONB}/about-bg.png`,
    content: <LifelinesScreen />,
  },
  {
    // Content is rendered by OnboardingFlow (it needs the Start Game handler).
    key: "leaderboard",
    background: `${ONB}/leaderboard-bg.png`,
  },
];

export const LAST_STEP_INDEX = STEPS.length - 1;
