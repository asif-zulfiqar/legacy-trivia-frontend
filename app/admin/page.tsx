import type { Metadata } from "next";
import { AdminPage } from "./screen";

export const metadata: Metadata = {
  title: "Admin | Legacy Trivia",
};

export default function Page() {
  return <AdminPage />;
}
