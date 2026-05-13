import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Reset Password | Legacy Trivia",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
