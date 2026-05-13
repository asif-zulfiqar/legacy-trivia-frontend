import Image from "next/image";
import { Button } from "../ui/Button";

export function HowToPlaySection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-[url('/images/howtoplay-bg.png')] bg-cover bg-center">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center gap-10 md:gap-12">
        {/* ── LEFT: Text ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 max-w-md">
          {/* Badge */}
          <Button
            variant="outline"
            className="text-[#FFDB76] font-londrina font-[900] !border !border-[#FFDB76] w-[120px]"
          >
            HOW TO DO
          </Button>

          {/* Heading */}
          <h2 className="font-[900] text-white text-4xl sm:text-5xl md:text-[64px] font-londrina">
            How to Play
          </h2>

          {/* Body */}
          <p className="text-white text-sm md:text-xl font-londrina">
            Read each question carefully; love isn&apos;t always what it looks
            like. Read before you answer, half the fun is realizing how
            differently you think. Move through 15 starter questions to prove
            you belong in Healthy Relationships 101. Hit 20 in advanced mode for
            full &ldquo;Certified Lover Genius&rdquo; status.
          </p>
        </div>

        {/* ── RIGHT: Game preview card ────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/images/howtoplay.png"
            alt="Starry night background"
            width={579}
            height={429}
          />
        </div>
      </div>
    </section>
  );
}
