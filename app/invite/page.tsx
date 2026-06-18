import { Suspense } from "react";
import type { Metadata } from "next";
import { InviteScreen } from "./screen";

export const metadata: Metadata = {
  title: "Invite Only | Legacy Trivia",
};

export default function InvitePage() {
  return (
    <Suspense>
      <InviteScreen />
    </Suspense>
  );
}
