"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import type { ApiEnvelope } from "../auth/types";
import type { WaitlistEntry } from "../waitlist/queries";

export interface AdminAccessCode {
  code: string;
  used: boolean;
  usedAt?: string;
}

export interface AdminWaitlistEntry extends WaitlistEntry {
  accessCode?: AdminAccessCode | null;
}

export function useAdminWaitlist(status: "pending" | "approved" | "all" = "pending") {
  return useQuery({
    queryKey: ["admin-waitlist", status],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ entries: AdminWaitlistEntry[] }>>(
        `/admin/waitlist?status=${status}`,
      );
      return res.data.data.entries;
    },
  });
}

export function useApproveWaitlistEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<
        ApiEnvelope<{ entry: AdminWaitlistEntry }>
      >(`/admin/waitlist/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-waitlist"] });
    },
  });
}
