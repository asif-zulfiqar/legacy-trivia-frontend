"use client";

/**
 * Reliable post-auth navigation.
 *
 * Why a hard navigation: Next.js App Router prefetches linked routes and
 * caches middleware responses. Before the user logs in, the prefetch of
 * `/game` is rewritten by middleware to `/login` (no auth cookie). After
 * login, `router.push("/game")` may follow that stale cached redirect and
 * leave the user stuck on `/login`. `window.location.assign` bypasses the
 * RSC/router cache and gives the server a fresh request with the new
 * auth cookie, so middleware allows the route.
 */
export function navigateAfterAuth(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}
