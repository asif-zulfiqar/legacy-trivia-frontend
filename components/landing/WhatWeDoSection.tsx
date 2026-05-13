"use client";

import Image from "next/image";
import { Button } from "../ui/Button";
import tabletMockup from "../../public/images/join-the-queue.png";
import queIcon from "../../public/images/que-icon.png";

export function WhatWeDoSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-[url('/images/whatwedobg.png')] bg-cover bg-center">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 flex flex-col md:flex-row items-center gap-12 md:gap-6">
        {/* ── LEFT: Text ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 text-left">
          {/* Badge */}
          <Button
            variant="ghost"
            className="w-[120px] text-base font-[900] font-londrina uppercase"
          >
            What We Do
          </Button>

          {/* Heading */}
          <h2 className="font-[900] text-white text-4xl md:text-5xl lg:text-[64px] font-londrina">
            Legacy Trivia
          </h2>

          {/* Body */}
          <p className="text-white text-sm md:text-xl font-londrina">
            Flirt meets quiz night. Test how well you actually know love,
            dating, and the glorious mess of human connection. Start with 15
            questions that warm you up; hit 20 in advanced mode if you&apos;re
            brave (or delusional about your &ldquo;emotional
            intelligence&rdquo;). Each round digs deeper funny and encouraging.
          </p>
        </div>

        {/* ── RIGHT: Mockup ─────────────────────────────────────────── */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Comic speech-burst (white spiky blob) */}
          <Image
            src={queIcon}
            width={341}
            height={241}
            alt="chat-bubble-image"
            className="absolute -top-[20%] right-[5%] md:-left-[20%] w-48 md:w-[341px]"
          />

          {/* Tablet mockup card */}
          <Image
            src={tabletMockup}
            width={580}
            height={370}
            alt="table-image"
          />
        </div>
      </div>
    </section>
  );
}
