import { OnboardingGate } from "@/components/onboarding/OnboardingGate";

export default function OnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <OnboardingGate>{children}</OnboardingGate>;
}
