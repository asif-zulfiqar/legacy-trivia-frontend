import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Forgot Password | Legacy Trivia",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
