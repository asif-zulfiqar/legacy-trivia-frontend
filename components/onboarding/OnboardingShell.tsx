"use client";

import { ReactNode } from "react";

/**
 * Full-screen onboarding frame: a per-step background plus a fixed bottom
 * navigation row (Back on the left, Next / Start Game on the right).
 * Background images are referenced by path; drop the files into
 * `public/images/onboarding/` to have them appear.
 */
export function OnboardingShell({
  background,
  children,
  left,
  right,
}: {
  background?: string;
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-[#081738] text-white"
      style={
        background
          ? {
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-6 py-12 md:py-24 sm:px-10 lg:px-16">
          {children}
        </div>

        <div className="pointer-events-none flex items-center justify-between px-6 pb-8 sm:px-10 lg:px-16 mt-5">
          <div className="pointer-events-auto">{left}</div>
          <div className="pointer-events-auto">{right}</div>
        </div>
      </div>
    </div>
  );
}
