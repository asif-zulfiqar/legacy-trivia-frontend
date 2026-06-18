"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { SparkleIcon } from "@/app/assets/icons";
import { Button } from "@/components/ui/Button";
import { extractErrorMessage } from "@/lib/api";
import { useJoinWaitlist, useRequestAccess } from "@/lib/waitlist/queries";

const MOTIVATIONS = [
  "Intellectual Challenge",
  "Financial Opportunity",
  "Competition",
];

function AccessBackground({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07143A] px-4 text-white sm:px-8">
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
      <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center pb-8">
        {children}
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  placeholder,
  type = "text",
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "email";
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-londrina text-base font-[900] text-white"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-[58px] w-full rounded-full border-4 border-[#DBDBDB30] bg-transparent px-5 font-londrina text-base font-[900] text-white outline-none transition placeholder:text-white/85 focus:border-[#8F6CFF] focus:ring-2 focus:ring-[#8F6CFF]/30 disabled:opacity-60 sm:h-[67px] sm:px-7 sm:text-lg"
      />
    </div>
  );
}

function QueueStep({
  email,
  setEmail,
  onContinue,
  disabled,
}: {
  email: string;
  setEmail: (email: string) => void;
  onContinue: (event: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}) {
  return (
    <form
      onSubmit={onContinue}
      className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
    >
      <h1 className="font-londrina text-5xl font-[900] leading-none text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:text-7xl">
        Join the Queue
      </h1>
      <p className="mt-4 max-w-3xl font-londrina text-base font-[900] leading-relaxed text-white sm:text-xl">
        The current season is full. Enter your email to join the waitlist for
        the next season and be the first to receive an invitation.
      </p>
      <div className="mt-8 flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
        <input
          type="email"
          value={email}
          placeholder="Enter Email Address"
          disabled={disabled}
          onChange={(event) => setEmail(event.target.value)}
          className="h-[56px] flex-1 rounded-full border border-white/10 bg-white px-6 text-center font-londrina text-base font-[900] text-[#07143A] outline-none placeholder:text-[#07143A]/30 focus:ring-4 focus:ring-[#8F6CFF]/30 disabled:opacity-60"
        />
        <Button
          type="submit"
          size="lg"
          disabled={disabled}
          className="h-[56px] min-w-[210px] px-8 py-0 font-londrina text-xl font-[900]"
        >
          {disabled ? "Saving..." : "Join the Queue"}
          <SparkleIcon />
        </Button>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 font-londrina text-base font-[900] text-white/80 sm:flex-row">
        <span>Already have an account?</span>
        <Link
          href="/login?redirect=/game"
          className="text-white underline-offset-4 transition hover:underline"
        >
          Log In
        </Link>
        <span className="hidden text-white/35 sm:inline">•</span>
        <Link
          href="/signup"
          className="text-white underline-offset-4 transition hover:underline"
        >
          I have an access code
        </Link>
      </div>
    </form>
  );
}

function ApplicationStep({
  email,
  setEmail,
  onSubmitted,
}: {
  email: string;
  setEmail: (email: string) => void;
  onSubmitted: () => void;
}) {
  const requestAccess = useRequestAccess();
  const [fullName, setFullName] = useState("");
  const [motivation, setMotivation] = useState(MOTIVATIONS[0]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestAccess.isPending) return;
    requestAccess.mutate(
      { email, fullName, motivation },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Application submitted.");
          onSubmitted();
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-[720px] rounded-[34px] bg-[#07163A]/95 px-7 py-10 shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:px-12 lg:px-14"
    >
      <h1 className="font-londrina text-[34px] font-[900] leading-none text-white sm:text-[42px]">
        Request Access
      </h1>
      <p className="mt-5 font-londrina text-base font-[900] leading-relaxed text-white sm:text-lg">
        Join the experience crafted for the chosen. Your entry begins here.
      </p>

      <div className="mt-8 space-y-7">
        <Field
          id="fullName"
          label="Full Name"
          value={fullName}
          placeholder="Enter Full Name"
          disabled={requestAccess.isPending}
          onChange={setFullName}
        />
        <Field
          id="email"
          type="email"
          label="Email Address"
          value={email}
          placeholder="Enter Email Address"
          disabled={requestAccess.isPending}
          onChange={setEmail}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="font-londrina text-base font-[900] leading-relaxed text-white sm:text-lg">
          What is your primary motivation for joining The Legacy Trivia?
        </legend>
        <div className="mt-4 space-y-4">
          {MOTIVATIONS.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-4 font-londrina text-base font-[900] text-white sm:text-lg"
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full border-2 ${
                  motivation === item ? "border-[#A783FF]" : "border-white/60"
                }`}
              >
                {motivation === item ? (
                  <span className="size-3 rounded-full bg-[#A783FF]" />
                ) : null}
              </span>
              <input
                type="radio"
                name="motivation"
                value={item}
                checked={motivation === item}
                disabled={requestAccess.isPending}
                onChange={() => setMotivation(item)}
                className="sr-only"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        type="submit"
        size="lg"
        disabled={requestAccess.isPending}
        className="mt-12 h-[58px] w-full px-8 py-0 font-londrina text-[25px] font-[900] sm:h-[68px]"
      >
        {requestAccess.isPending ? "Submitting..." : "Submit Application"}
        <SparkleIcon />
      </Button>
      <div className="mt-5 flex flex-col items-center justify-center gap-2 font-londrina text-base font-[900] text-white/75 sm:flex-row">
        <Link
          href="/login?redirect=/game"
          className="text-white underline-offset-4 transition hover:underline"
        >
          Already have an account? Log In
        </Link>
        <span className="hidden text-white/35 sm:inline">•</span>
        <Link
          href="/signup"
          className="text-white underline-offset-4 transition hover:underline"
        >
          Have an access code?
        </Link>
      </div>
    </form>
  );
}

function Confirmation({
  onClose,
  onKeepEditing,
}: {
  onClose: () => void;
  onKeepEditing: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020411]/65 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[430px] border border-[#39A8FF] bg-[#1B0A63] px-8 py-9 text-center shadow-[0_0_48px_rgba(57,168,255,0.25)]">
        <h2 className="font-londrina text-[30px] font-[900] leading-none text-white">
          You&apos;re on the List
        </h2>
        <p className="mx-auto mt-4 max-w-[320px] font-londrina text-base font-[900] leading-relaxed text-white">
          You&apos;ve been added to our waitlist. Invitations are sent based on
          priority tiers, not first come, first served.
        </p>
        <Button
          type="button"
          size="lg"
          onClick={onClose}
          className="mx-auto mt-8 h-[55px] min-w-[230px] px-8 py-0 font-londrina text-xl font-[900]"
        >
          Stay Notified
          <SparkleIcon />
        </Button>
        <button
          type="button"
          onClick={onKeepEditing}
          className="mt-4 block w-full cursor-pointer font-londrina text-lg font-[900] text-white hover:text-white/80"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function RequestAccessPage() {
  const joinWaitlist = useJoinWaitlist();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"queue" | "application">("queue");
  const [confirmed, setConfirmed] = useState(false);

  const continueToApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (joinWaitlist.isPending) return;
    joinWaitlist.mutate(
      { email },
      {
        onSuccess: () => setStep("application"),
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  return (
    <AccessBackground>
      {step === "queue" ? (
        <QueueStep
          email={email}
          setEmail={setEmail}
          onContinue={continueToApplication}
          disabled={joinWaitlist.isPending}
        />
      ) : (
        <ApplicationStep
          email={email}
          setEmail={setEmail}
          onSubmitted={() => setConfirmed(true)}
        />
      )}
      {confirmed ? (
        <Confirmation
          onClose={() => setConfirmed(false)}
          onKeepEditing={() => setConfirmed(false)}
        />
      ) : null}
    </AccessBackground>
  );
}
