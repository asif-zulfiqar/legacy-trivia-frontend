"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { ApiEnvelope } from "../auth/types";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  playerId: string;
  score: number;
  matches: number;
  winrate: number;
  region: string;
  avatarColor: string;
}

export function useLeaderboard(limit = 5) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ entries: LeaderboardEntry[] }>>(
        `/leaderboard?limit=${limit}`,
      );
      return res.data.data.entries;
    },
    staleTime: 60 * 1000,
  });
}
