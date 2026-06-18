export interface LevelProgress {
  level1Completed: boolean;
  level2Completed: boolean;
  level1CompletedAt?: string;
  level2CompletedAt?: string;
  highestLevelUnlocked: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  authProvider: "local" | "google";
  isVerified: boolean;
  role: "user" | "admin";
  approved?: boolean;
  onboardingCompleted: boolean;
  treasury: number;
  levelProgress: LevelProgress;
  soundOn: boolean;
  btcAddress?: string;
}

export interface AuthSuccessData {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt?: string;
}

export interface EmailVerificationRequiredData {
  email: string;
  requiresVerification: true;
}

export interface LoginVerificationRequiredData {
  email: string;
  loginToken: string;
  requiresLoginVerification: true;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type OtpPurpose = "email_verification" | "password_reset";
