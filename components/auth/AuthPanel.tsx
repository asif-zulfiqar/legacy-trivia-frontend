interface AuthPanelProps {
  children: React.ReactNode;
  variant?: "signup" | "login" | "compact" | "reset";
}

const panelHeights = {
  signup: "min-h-[682px] sm:min-h-[713px]",
  login: "min-h-[599px]",
  compact: "min-h-[409px]",
  reset: "min-h-[409px]",
};

const contentOffsets = {
  signup: "px-7 pb-7 pt-10 sm:px-11 sm:pb-7 sm:pt-7",
  login: "px-7 pb-8 pt-12 sm:px-11 sm:pb-8 sm:pt-[34px]",
  compact: "px-7 pb-9 pt-12 sm:px-11 sm:pb-12 sm:pt-[47px]",
  reset: "px-7 pb-8 pt-10 sm:px-11 sm:pb-7 sm:pt-[27px]",
};

export function AuthPanel({ children, variant = "compact" }: AuthPanelProps) {
  return (
    <section
      className={`relative w-full max-w-[511px] ${panelHeights[variant]} overflow-visible rounded-[30px] bg-[#07072E]/82 shadow-[0_24px_90px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md`}
      aria-label="Authentication form"
    >
      <div className={`relative z-10 ${contentOffsets[variant]}`}>
        {children}
      </div>
    </section>
  );
}
