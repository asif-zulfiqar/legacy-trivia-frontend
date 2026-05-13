"use client";

let gisLoadPromise: Promise<void> | null = null;
let initializedClientId: string | null = null;
let activeCallback: ((idToken: string) => void) | null = null;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: Record<string, unknown>,
          ) => void;
          prompt: (notification?: (n: unknown) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisLoadPromise = null;
      reject(new Error("Failed to load Google Identity Services."));
    };
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

export async function initGoogleSignIn(clientId: string): Promise<void> {
  if (!clientId) return;
  await loadGoogleIdentityServices();
  if (!window.google?.accounts?.id) return;
  if (initializedClientId === clientId) return;
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential && activeCallback) {
        activeCallback(response.credential);
      }
    },
    ux_mode: "popup",
  });
  initializedClientId = clientId;
}

export function setGoogleCallback(cb: (idToken: string) => void): () => void {
  activeCallback = cb;
  return () => {
    if (activeCallback === cb) activeCallback = null;
  };
}

export function renderGoogleButton(
  element: HTMLElement,
  config: Record<string, unknown> = {},
) {
  if (!window.google?.accounts?.id) return;
  element.innerHTML = "";
  window.google.accounts.id.renderButton(element, {
    type: "standard",
    theme: "filled_blue",
    size: "large",
    text: "continue_with",
    shape: "pill",
    width: 360,
    ...config,
  });
}
