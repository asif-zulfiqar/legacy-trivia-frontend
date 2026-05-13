import type { Metadata } from "next";
import { VerifyEmailForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Email Verification | Legacy Trivia",
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
