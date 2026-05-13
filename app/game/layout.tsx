import { AuthGate } from "@/components/auth/AuthGate";

export default function GameLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthGate>{children}</AuthGate>;
}
