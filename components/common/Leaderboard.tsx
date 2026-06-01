"use client";

import { User } from "lucide-react";
import {
  useLeaderboard,
  type LeaderboardEntry,
} from "@/lib/leaderboard/queries";

function RankAvatar({ color }: { color: string }) {
  return (
    <span className="relative inline-flex size-11 flex-shrink-0">
      <span
        className="absolute inset-0 rotate-45 rounded-[10px] border-2 border-[#E7B85A] shadow-[inset_0px_2px_2px_0px_#FFFFFF40]"
        style={{ backgroundColor: color }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <User className="size-5 text-[#0E1430]" strokeWidth={2.5} />
      </span>
    </span>
  );
}

const HEAD =
  "px-4 py-3 text-left font-londrina text-xs font-[900] uppercase tracking-[0.1em] text-white/70";
const CELL = "px-4 py-3 font-londrina text-base font-[900] text-white";

function Row({ entry }: { entry: LeaderboardEntry }) {
  return (
    <tr className="bg-[#2A1F52]/70">
      <td className={`${CELL} rounded-l-xl`}>
        <span className="flex items-center gap-3">
          <span className="text-white/90">#{entry.rank}</span>
          <RankAvatar color={entry.avatarColor} />
        </span>
      </td>
      <td className={CELL}>{entry.name}</td>
      <td className={CELL}>{entry.playerId}</td>
      <td className={CELL}>{entry.score.toLocaleString()}</td>
      <td className={CELL}>{entry.matches.toLocaleString()}</td>
      <td className={CELL}>{entry.winrate.toFixed(2)}%</td>
      <td className={`${CELL} rounded-r-xl uppercase`}>{entry.region}</td>
    </tr>
  );
}

export function Leaderboard({ limit = 5 }: { limit?: number }) {
  const { data: entries, isLoading, isError } = useLeaderboard(limit);

  return (
    <div className="w-full rounded-[30px] bg-gradient-to-b from-[#E1B04E] via-[#F6F3BE] to-[#BD8B36] p-[6px] shadow-[0_0_40px_0_rgba(231,184,90,0.25)]">
      <div className="rounded-[26px] bg-[#0E1430] p-3 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#3A2B66]/70">
                <th className={`${HEAD} rounded-l-xl`}>Rank</th>
                <th className={HEAD}>Name</th>
                <th className={HEAD}>ID</th>
                <th className={HEAD}>Scores</th>
                <th className={HEAD}>Matches</th>
                <th className={HEAD}>Winrate</th>
                <th className={`${HEAD} rounded-r-xl`}>Region</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: limit }).map((_, i) => (
                    <tr key={i} className="bg-[#2A1F52]/40">
                      <td className="px-4 py-5 rounded-l-xl" colSpan={7}>
                        <span className="block h-4 w-full animate-pulse rounded bg-white/10" />
                      </td>
                    </tr>
                  ))
                : entries?.map((entry) => (
                    <Row key={entry.playerId} entry={entry} />
                  ))}
            </tbody>
          </table>

          {isError ? (
            <p className="py-6 text-center font-londrina text-sm font-[900] text-white/70">
              Leaderboard is taking a break. Check back soon.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
