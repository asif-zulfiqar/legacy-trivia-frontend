"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { useAuthStore } from "./store";
import type {
  ApiEnvelope,
  AuthSuccessData,
  OtpPurpose,
  User,
} from "./types";

export function useSignup() {
  return useMutation({
    mutationFn: async (input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      referralCode?: string;
    }) => {
      const res = await api.post<ApiEnvelope<{ email: string }>>(
        "/auth/signup",
        input,
      );
      return res.data;
    },
  });
}

export function useVerifyEmail() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: { email: string; otp: string }) => {
      const res = await api.post<ApiEnvelope<AuthSuccessData>>(
        "/auth/verify-email",
        input,
      );
      const data = res.data.data;
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return res.data;
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (input: { email: string; purpose: OtpPurpose }) => {
      const res = await api.post<ApiEnvelope<{ email: string }>>(
        "/auth/resend-otp",
        input,
      );
      return res.data;
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await api.post<
        ApiEnvelope<AuthSuccessData | { email: string; requiresVerification: true }>
      >("/auth/login", input);
      return res.data;
    },
    onSuccess: (response) => {
      const data = response?.data;
      if (data && "accessToken" in data) {
        setSession({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }
    },
  });
}

export function useGoogleAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: { idToken: string; referralCode?: string }) => {
      const res = await api.post<ApiEnvelope<AuthSuccessData>>(
        "/auth/google",
        input,
      );
      const data = res.data.data;
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return res.data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      const res = await api.post<ApiEnvelope<{ email: string }>>(
        "/auth/forgot-password",
        input,
      );
      return res.data;
    },
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: async (input: { email: string; otp: string }) => {
      const res = await api.post<ApiEnvelope<{ resetToken: string }>>(
        "/auth/verify-reset-otp",
        input,
      );
      return res.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: { resetToken: string; newPassword: string }) => {
      const res = await api.post<ApiEnvelope<null>>(
        "/auth/reset-password",
        input,
      );
      return res.data;
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch {
        // ignore network failure on logout
      }
      clear();
    },
  });
}

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");
      const user = res.data.data.user;
      setUser(user);
      return user;
    },
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });
}
