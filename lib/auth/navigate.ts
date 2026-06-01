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

/**
 * Where to send a user right after a successful sign-in / verify.
 * First-timers (onboarding not yet completed) go through the tutorial;
 * everyone else lands in the game.
 */
export function destinationForUser(user: {
  onboardingCompleted?: boolean;
}): string {
  return user.onboardingCompleted ? "/game" : "/onboarding";
}
