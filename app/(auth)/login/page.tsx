import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Log In | Legacy Trivia",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
