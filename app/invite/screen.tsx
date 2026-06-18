"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { SparkleIcon } from "@/app/assets/icons";
import { Button } from "@/components/ui/Button";

export function InviteScreen() {
  const params = useSearchParams();
  const code = params?.get("code") || "";
  const email = params?.get("email") || "";
  const signupHref = `/signup?code=${encodeURIComponent(code)}${
    email ? `&email=${encodeURIComponent(email)}` : ""
  }`;

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    toast.success("Code copied.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07143A] px-4 py-8 text-white sm:px-8">
      <div
        className="absolute inset-0 bg-[url('/images/auth-bg.png')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#031034]/20" aria-hidden="true" />
      <Link
        href="/"
        aria-label="Legacy Trivia home"
        className="relative z-20 block w-fit"
      >
        <Image
          src="/images/logo.png"
          alt="Legacy Trivia"
          width={251}
          height={160}
          priority
          className="h-auto w-36 drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:w-44 lg:w-52"
        />
      </Link>

      <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center py-8">
        <section className="w-full max-w-[540px] border-4 border-[#0BA4FF] bg-[#1B0A63]/95 px-8 py-10 text-center shadow-[0_0_72px_rgba(11,164,255,0.22)] sm:px-12">
          <h1 className="font-londrina text-[38px] font-[900] leading-none text-white">
            Invite Only. Your Turn
          </h1>
          <p className="mx-auto mt-5 max-w-[390px] font-londrina text-xl font-[900] leading-relaxed text-white">
            You&apos;ve earned a referral code. Share it wisely, each code
            unlocks one entry.
          </p>
          <div className="mt-8 font-londrina text-[52px] font-[900] leading-none tracking-[0.08em] text-white">
            {code || "------"}
          </div>
          <Button
            type="button"
            size="lg"
            onClick={copyCode}
            disabled={!code}
            className="mx-auto mt-9 h-[58px] min-w-[250px] px-8 py-0 font-londrina text-[24px] font-[900]"
          >
            Copy Code
            <SparkleIcon />
          </Button>
          <Link
            href={signupHref}
            className="mt-5 block font-londrina text-2xl font-[900] text-white hover:text-white/80"
          >
            Create Account
          </Link>
        </section>
      </div>
    </main>
  );
}
