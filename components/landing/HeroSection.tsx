"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import herBg from "@/public/images/hero-bg.jpg";
import { SparkleIcon } from "@/app/assets/icons";
import appStoreImg from "@/public/images/app-store.png";
import playStoreImg from "@/public/images/google-play.png";

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between gap-8 overflow-hidden px-5">
      {/* ── Background Image ──────────────────────────────────────── */}
      <Image
        src={herBg}
        alt="Starry night mountain landscape"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center select-none"
      />

      {/* ── Dark overlay gradient (top-down vignette) ─────────────── */}
      <div className="h-36" aria-hidden="true" />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="font-[900] font-londrina text-white text-4xl sm:text-5xl md:text-6xl lg:text-[70px]">
          Master the Art of Connection.
        </h1>

        {/* Sub-headline */}
        <p className="text-white text-base sm:text-lg md:text-2xl font-[900] font-londrina leading-relaxed">
          A trivia experience that challenges your mind, sharpens your
          intuition, and rewards your knowledge. This is not just a game.
          It&apos;s a seasonal challenge.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/request-access">
            <Button
              variant="primary"
              size="lg"
              className="text-base md:text-[27px] font-[900] font-londrina px-10 py-4 rounded-full"
            >
              Request Access
              <SparkleIcon />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Store Badges ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pb-14 px-6">
        {/* App Store */}
        <Link
          className="w-28 md:w-[233px] cursor-pointer hover:opacity-80 transition-opacity"
          href="#"
          onClick={handleStoreClick}
          aria-label="Download on the App Store"
        >
          {/* Apple logo */}
          <Image
            src={appStoreImg}
            alt="app-store-img"
            width={233}
            height={78}
          />
        </Link>

        {/* Google Play */}
        <Link
          className="w-28 md:w-[263px] cursor-pointer hover:opacity-80 transition-opacity"
          href="#"
          onClick={handleStoreClick}
          aria-label="Get it on Google Play"
        >
          {/* Play Store */}
          <Image
            src={playStoreImg}
            alt="play-store-img"
            width={263}
            height={78}
          />
        </Link>
      </div>

      {/* ── Unsupported Region Modal ──────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Region Not Supported"
      >
        <p className="text-white text-sm md:text-xl font-londrina">
          App not supported in your region
        </p>
      </Modal>
    </section>
  );
}
