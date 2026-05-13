import Image from "next/image";
import { Button } from "../ui/Button";
import gamePlayIcon from "../../public/images/gameplayimage.png";

/** Category pills shown in the Gameplay section */
const CATEGORIES = [
  "Love History",
  "Flirt Science",
  "Modern Dating",
  "Compatibility Chaos",
];

/**
 * GameplaySection
 *
 * Layout:
 *  Left  – gold trophy/badge illustration (trophy-icon.png)
 *  Right – "HOW TO DO" badge · "Gameplay" heading · body · category pills · tagline
 *
 * Background: deep navy #0B1530 with same subtle grid as WhatWeDoSection
 */
export function GameplaySection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-[url('/images/gameplay-bg.png')] bg-cover bg-center">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center gap-10 md:gap-[95px]">
        {/* ── LEFT: Trophy illustration ──────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src={gamePlayIcon}
            alt="Gold trophy badge"
            width={368}
            height={380}
            className="object-contain "
          />
        </div>

        {/* ── RIGHT: Text content ────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Badge */}
          <Button
            variant="ghost"
            className="w-[120px] text-base font-[900] font-londrina"
          >
            HOW TO DO
          </Button>

          {/* Heading */}
          <h2 className="font-[900] text-white text-4xl sm:text-5xl md:text-[64px] font-londrina">
            Gameplay
          </h2>

          {/* Body */}
          <p className="text-white text-sm md:text-xl font-londrina">
            You play as yourself or whatever version of you survives arguments.
            Every correct answer keeps your streak alive. Wrong ones expose your
            blind spots (and possibly your ex&apos;s point). Unlock new
            categories:
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant="outline"
                className="text-white font-londrina font-[900] !border !border-[#ffffff3d]"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-white text-sm md:text-xl font-londrina mt-1">
            Watch your score climb or your ego implode.
          </p>
        </div>
      </div>
    </section>
  );
}
