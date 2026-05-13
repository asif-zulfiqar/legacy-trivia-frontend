import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Sign Up | Legacy Trivia",
};

export default function SignupPage() {
  return <SignupForm />;
}
