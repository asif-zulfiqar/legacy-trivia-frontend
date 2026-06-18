"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import type { ApiEnvelope } from "../auth/types";

export interface WaitlistAnswer {
  question: string;
  answer: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  fullName: string;
  answers: WaitlistAnswer[];
  status: "pending" | "approved";
  approvedAt?: string;
  createdAt?: string;
}

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      const res = await api.post<ApiEnvelope<{ entry: WaitlistEntry }>>(
        "/waitlist/join",
        input,
      );
      return res.data;
    },
  });
}

export function useRequestAccess() {
  return useMutation({
    mutationFn: async (input: {
      email: string;
      fullName: string;
      motivation: string;
    }) => {
      const res = await api.post<ApiEnvelope<{ entry: WaitlistEntry }>>(
        "/waitlist/request-access",
        input,
      );
      return res.data;
    },
  });
}
