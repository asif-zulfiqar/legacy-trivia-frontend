import React from "react";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "relative overflow-hidden bg-[radial-gradient(50%_50%_at_50%_50%,#A47CF3_0%,#683FEA_100%)] text-white shadow-[inset_0px_2.76px_1.38px_0px_#FFFFFF40,inset_0px_-5.53px_2.76px_0px_#00000040,0px_0px_1.38px_5.53px_#FFFFFF1A,0px_0px_248.73px_0px_#9917FF] hover:shadow-[0_0_48px_15px_rgba(153,23,255,0.9)] active:scale-95 before:absolute before:inset-0 before:bg-[radial-gradient(50%_50%_at_50%_50%,#D1B0FF_0%,#683FEA_100%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:ease-out before:rounded-full text-white",
    ghost:
      "shadow-[inset_0px_4px_24px_0px_#FFFFFF4D] backdrop-blur-[0px] hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-95",
    outline:
      "bg-transparent border border-[#6B2FE8] text-[#9B6FFF] hover:bg-[#6B2FE8]/10 active:scale-95",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
