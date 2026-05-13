"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/Button";
import { StarIcon } from "@/app/assets/icons";
import { RiSendPlaneFill } from "react-icons/ri";

/** A single metadata row */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-white text-sm md:text-xl font-londrina">
      {label}: <span className="font-bold">{value}</span>
    </p>
  );
}

export function DetailsSection() {
  const [likeState, setLikeState] = useState<"like" | "dislike" | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24"
      style={{
        backgroundColor: "#0B1530",
        /* Diagonal line mesh */
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 28px,
          rgba(255,255,255,0.025) 28px,
          rgba(255,255,255,0.025) 29px
        )`,
      }}
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center gap-12 md:gap-14">
        {/* ── LEFT: App card ─────────────────────────────────────── */}

        <div className="flex-shrink-0">
          <Image
            src="/images/quiz-image.png"
            alt="App preview screenshot"
            width={579}
            height={517}
          />
        </div>

        {/* ── RIGHT: Details ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 max-w-lg">
          {/* Badge */}
          <Button
            variant="ghost"
            className="w-[120px] text-base font-[900] font-londrina uppercase"
          >
            Details
          </Button>

          {/* Title */}
          <h2 className="font-[900] text-white text-4xl sm:text-5xl md:text-[64px] font-londrina">
            Legacy Trivia – Quiz
          </h2>

          {/* Star rating */}
          <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
            <span className="text-white text-sm md:text-xl font-londrina">
              4.8 (12 k votes)
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2 mt-1">
            <DetailRow label="Age" value="E18+" />
            <DetailRow label="Orientation" value="Landscape" />
            <DetailRow label="Platforms" value="Android / iOS Engine, Web" />
            <DetailRow label="Last Update" value="Feb 2026" />
            <DetailRow label="Languages" value="EN, HU, ES, FR, DE" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-2">
            {/* Like */}
            <div className="w-[135px] text-xl font-[900] font-londrina uppercase shadow-[inset_0px_4px_24px_0px_#FFFFFF4D] backdrop-blur-[0px] hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-95 inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none px-6 py-2.5 text-base cursor-pointer">
              <button 
                className={`cursor-pointer transition-all ${likeState === "like" ? "opacity-100 drop-shadow-[0_0_8px_rgba(155,95,255,0.8)]" : "opacity-50"}`}
                onClick={() => setLikeState(likeState === "like" ? null : "like")}
              >
                <Image
                  src="/images/likeicon.png"
                  alt="Like"
                  width={20}
                  height={20}
                />
              </button>
              6k+
              <span className="ml-2 rotate-180 relative">
                <button 
                  className={`cursor-pointer transition-all ${likeState === "dislike" ? "opacity-100 drop-shadow-[0_0_8px_rgba(155,95,255,0.8)]" : "opacity-50"}`}
                  onClick={() => setLikeState(likeState === "dislike" ? null : "dislike")}
                >
                  <Image
                    src="/images/likeicon.png"
                    alt="Dislike"
                    width={20}
                    height={20}
                  />
                </button>
                <span className="absolute -top-[10px] left-[23px] w-[1px] h-[48px] bg-[#FFFFFF1A]"></span>
              </span>
            </div>

            {/* Share */}
            <Button
              variant="ghost"
              className="w-[135px] text-xl font-[900] font-londrina uppercase"
            >
              <RiSendPlaneFill />
              Share
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
