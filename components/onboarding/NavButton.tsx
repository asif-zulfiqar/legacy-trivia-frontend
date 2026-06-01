"use client";

import { SparkleIcon } from "@/app/assets/icons";

type NavVariant = "back" | "next";

const VARIANT_STYLES: Record<NavVariant, string> = {
  back: "bg-white text-[#0B122D] hover:bg-white/90",
  next: "bg-[#72C1E2] text-[#0B122D] hover:bg-[#bfe6f7]",
};

export function NavButton({
  variant,
  label,
  onClick,
  disabled = false,
}: {
  variant: NavVariant;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-[55px] min-w-[150px] items-center justify-center gap-2 rounded-full px-8 font-londrina text-base md:text-[22px] font-[900] leading-none shadow-[inset_0px_2px_1px_0px_#FFFFFF66,inset_0px_-4px_2px_0px_#00000026] transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${VARIANT_STYLES[variant]}`}
    >
      {label}
      <span className="flex size-5 scale-[0.7] items-center justify-center [&_path]:fill-[#091739]">
        <SparkleIcon />
      </span>
    </button>
  );
}
