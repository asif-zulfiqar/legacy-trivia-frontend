import { Suspense } from "react";
import type { Metadata } from "next";
import { ForgotVerifyForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Verify Email | Legacy Trivia",
};

export default function ForgotPasswordVerifyPage() {
  return (
    <Suspense>
      <ForgotVerifyForm />
    </Suspense>
  );
}
