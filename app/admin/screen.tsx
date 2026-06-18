"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useMe } from "@/lib/auth/queries";
import { useAuthStore } from "@/lib/auth/store";
import { extractErrorMessage } from "@/lib/api";
import {
  useAdminWaitlist,
  useApproveWaitlistEntry,
  type AdminWaitlistEntry,
} from "@/lib/admin/queries";

function AdminGate({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken && !refreshToken) {
      window.location.replace("/login?redirect=/admin");
    }
  }, [accessToken, hydrated, refreshToken]);

  if (!hydrated || (accessToken && isLoading && !user)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#040C1A] text-white">
        <div className="font-londrina text-xl font-[900]">Loading...</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#040C1A] px-4 text-center text-white">
        <div>
          <h1 className="font-londrina text-4xl font-[900]">Session expired</h1>
          <Link
            href="/login?redirect=/admin"
            className="mt-4 block font-londrina text-lg font-[900] text-[#9B5FFF]"
          >
            Sign in again
          </Link>
        </div>
      </main>
    );
  }

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07143A] px-4 text-center text-white">
        <div
          className="absolute inset-0 bg-[url('/images/auth-bg.png')] bg-cover bg-center opacity-70"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-lg rounded-[28px] bg-[#07072E]/90 p-8">
          <h1 className="font-londrina text-4xl font-[900]">Admin only</h1>
          <p className="mt-3 font-londrina text-lg font-[900] text-white/80">
            Your account does not have access to this page.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

function AnswerList({ entry }: { entry: AdminWaitlistEntry }) {
  if (!entry.answers?.length) return <span className="text-white/45">No answers yet</span>;
  return (
    <div className="space-y-1">
      {entry.answers.map((answer) => (
        <p key={`${entry.id}-${answer.question}`} className="text-white/80">
          <span className="text-white/50">{answer.question}</span>
          <br />
          <span>{answer.answer}</span>
        </p>
      ))}
    </div>
  );
}

function WaitlistCard({
  entry,
  onApprove,
  approving,
}: {
  entry: AdminWaitlistEntry;
  onApprove: (id: string) => void;
  approving: boolean;
}) {
  return (
    <article className="rounded-[22px] border border-white/10 bg-[#0A1638]/85 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-londrina text-2xl font-[900] text-white">
              {entry.fullName || "Name pending"}
            </h2>
            <span className="rounded-full border border-[#9B5FFF]/50 px-3 py-1 font-londrina text-sm font-[900] uppercase text-white/80">
              {entry.status}
            </span>
          </div>
          <p className="mt-1 font-londrina text-lg font-[900] text-[#9BCEFF]">
            {entry.email}
          </p>
          <div className="mt-4 font-londrina text-base font-[900]">
            <AnswerList entry={entry} />
          </div>
          {entry.accessCode ? (
            <p className="mt-4 font-londrina text-base font-[900] text-white/80">
              Access code:{" "}
              <span className="tracking-[0.12em] text-[#FFB951]">
                {entry.accessCode.code}
              </span>
              {entry.accessCode.used ? " (used)" : " (unused)"}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          size="lg"
          disabled={approving || entry.status === "approved"}
          onClick={() => onApprove(entry.id)}
          className="h-[52px] min-w-[150px] px-6 py-0 font-londrina text-lg font-[900]"
        >
          {entry.status === "approved"
            ? "Approved"
            : approving
              ? "Approving..."
              : "Approve"}
        </Button>
      </div>
    </article>
  );
}

export function AdminPage() {
  const [status, setStatus] = useState<"pending" | "approved" | "all">("pending");
  const { data: entries = [], isLoading, isError } = useAdminWaitlist(status);
  const approve = useApproveWaitlistEntry();

  const approveEntry = (id: string) => {
    approve.mutate(id, {
      onSuccess: (response) =>
        toast.success(response.message || "Applicant approved."),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  return (
    <AdminGate>
      <main className="relative min-h-screen overflow-hidden bg-[#07143A] px-4 py-8 text-white sm:px-8">
        <div
          className="absolute inset-0 bg-[url('/images/auth-bg.png')] bg-cover bg-center opacity-60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#02071A]/55" aria-hidden="true" />
        <section className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-londrina text-base font-[900] uppercase tracking-[0.15em] text-[#FFB951]">
                Admin
              </p>
              <h1 className="mt-2 font-londrina text-5xl font-[900] leading-none text-white">
                Waitlist Approvals
              </h1>
              <p className="mt-3 max-w-2xl font-londrina text-lg font-[900] text-white/75">
                Review request-access submissions, approve selected users, and
                send invite-only access codes.
              </p>
            </div>
            <div className="flex rounded-full border border-white/10 bg-white/10 p-1">
              {(["pending", "approved", "all"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  className={`cursor-pointer rounded-full px-4 py-2 font-londrina text-base font-[900] capitalize transition ${
                    status === item
                      ? "bg-white text-[#07143A]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[22px] bg-white/10"
                />
              ))
            ) : isError ? (
              <div className="rounded-[22px] bg-[#0A1638]/85 p-8 text-center font-londrina text-xl font-[900] text-white/80">
                Could not load waitlist.
              </div>
            ) : entries.length ? (
              entries.map((entry) => (
                <WaitlistCard
                  key={entry.id}
                  entry={entry}
                  onApprove={approveEntry}
                  approving={approve.isPending}
                />
              ))
            ) : (
              <div className="rounded-[22px] bg-[#0A1638]/85 p-8 text-center font-londrina text-xl font-[900] text-white/80">
                No waitlist entries found.
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminGate>
  );
}
