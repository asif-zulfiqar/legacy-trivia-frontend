"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "default" | "warning" | "success" | "error";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
}: ModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    default:
      "border-[#9B5FFF]/30 bg-gradient-to-br from-[#070F22] to-[#0B1535]",
    warning:
      "border-[#FF9B5F]/30 bg-gradient-to-br from-[#2a1810] to-[#1a0f08]",
    success:
      "border-[#5FFF9B]/30 bg-gradient-to-br from-[#0B2a1a] to-[#081510]",
    error: "border-[#FF5F5F]/30 bg-gradient-to-br from-[#2a0f0f] to-[#1a0808]",
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <div
          className={`relative w-full max-w-md rounded-2xl border ${variantStyles[variant]} shadow-[0_0_60px_15px_rgba(153,23,255,0.3)] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Glow effect background ────────────────────────── */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(155, 95, 255, 0.4) 0%, transparent 100%)",
            }}
          />

          {/* ── Content ───────────────────────────────────────── */}
          <div className="relative z-10 p-6 md:p-8">
            {/* ── Header ────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 mb-6">
              {title && (
                <h2 className="text-xl md:text-2xl font-[900] font-londrina text-white">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-[#9B5FFF] hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* ── Body ──────────────────────────────────────────── */}
            <div className="text-white/90 font-inter text-base md:text-lg leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
