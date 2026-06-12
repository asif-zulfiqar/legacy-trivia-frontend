"use client";

import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "./auth/store";
import { API_URL } from "./env";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set?.("Authorization", `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;
  try {
    const res = await axios.post(
      `${API_URL}/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );
    const data = res.data?.data;
    if (data?.accessToken && data?.refreshToken) {
      useAuthStore.getState().setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.accessToken as string;
    }
  } catch {
    // ignore — fall through to clear
  }
  useAuthStore.getState().clear();
  return null;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes("/auth/refresh");

    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      if (!refreshPromise) refreshPromise = performRefresh();
      const newToken = await refreshPromise;
      refreshPromise = null;
      if (newToken) {
        original.headers.set?.("Authorization", `Bearer ${newToken}`);
        return api(original as AxiosRequestConfig);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Pull the most user-facing message out of an axios error. Preference order:
 *   1. `data.message` from the server envelope — the backend's validate
 *      middleware now puts the specific field error here (e.g. "\"email\"
 *      must be a valid email").
 *   2. First entry in `data.details` if present — covers older shapes where
 *      message was generic ("Validation failed") and detail had the real text.
 *   3. axios's own `error.message` (network/timeout/etc).
 *   4. Generic fallback.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          details?: Record<string, string> | string[];
        }
      | string
      | undefined;

    if (typeof data === "string" && data) return data;

    if (data && typeof data === "object") {
      const generic = !data.message || /^validation failed\.?$/i.test(data.message);
      if (!generic && data.message) return data.message;

      if (data.details) {
        if (Array.isArray(data.details) && data.details.length > 0) {
          return data.details[0];
        }
        const first = Object.values(data.details)[0];
        if (typeof first === "string" && first) return first;
      }

      if (data.message) return data.message;
    }

    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
