import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhatWeDoSection } from "@/components/landing/WhatWeDoSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { GameplaySection } from "@/components/landing/GameplaySection";
import { HowToPlaySection } from "@/components/landing/HowToPlaySection";
import { DetailsSection } from "@/components/landing/DetailsSection";

/**
 * Landing Page – composes all landing sections in order.
 */
export default function Home() {
  return (
    <>
      <main className="flex flex-col">
        {/* ── Navbar (absolute, overlays Hero) ────────────────────── */}
        <Navbar />

        {/* ── Section 1: Hero ─────────────────────────────────────── */}
        <HeroSection />

        {/* ── Section 2: What We Do ───────────────────────────────── */}
        <WhatWeDoSection />

        {/* ── Section 3: About ────────────────────────────────────── */}
        <AboutSection />

        {/* ── Section 4: Gameplay ─────────────────────────────────── */}
        <GameplaySection />

        {/* ── Section 5: How to Play ──────────────────────────────── */}
        <HowToPlaySection />

        {/* ── Section 6: Details ──────────────────────────────────── */}
        <DetailsSection />
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
