import Image from "next/image";
import Link from "next/link";
import authBg from "@/public/images/auth-bg.png";
import logo from "@/public/images/logo.png";

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#081339] px-4 py-8 text-white sm:px-6 lg:px-8">
      <Image
        src={authBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center select-none"
      />
      <div className="absolute inset-0 bg-[#03081A]/10" aria-hidden="true" />

      <Link
        href="/"
        aria-label="Legacy Trivia home"
        className="absolute left-5 top-5 z-20 block sm:left-8 sm:top-6"
      >
        <Image
          src={logo}
          alt="Legacy Trivia"
          width={252}
          height={142}
          priority
          className="h-auto w-28 drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:w-36 lg:w-40"
        />
      </Link>

      <div className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center pt-20 sm:pt-24">
        {children}
      </div>
    </main>
  );
}
