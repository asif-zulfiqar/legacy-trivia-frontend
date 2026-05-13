"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0B0B36",
            color: "#fff",
            border: "1px solid #FFB95155",
            fontFamily: "var(--font-londrina), var(--font-inter), sans-serif",
            fontWeight: 700,
            padding: "12px 16px",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "#FFB951", secondary: "#0B0B36" } },
          error: { iconTheme: { primary: "#FF6B6B", secondary: "#0B0B36" } },
        }}
      />
    </QueryClientProvider>
  );
}
