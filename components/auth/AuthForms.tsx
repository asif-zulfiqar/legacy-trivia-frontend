"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SparkleIcon } from "@/app/assets/icons";
import { Button } from "@/components/ui/Button";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { extractErrorMessage } from "@/lib/api";
import { GOOGLE_CLIENT_ID } from "@/lib/env";
import {
  initGoogleSignIn,
  renderGoogleButton,
  setGoogleCallback,
} from "@/lib/auth/google";
import { navigateAfterAuth, destinationForUser } from "@/lib/auth/navigate";
import {
  useForgotPassword,
  useGoogleAuth,
  useLogin,
  useResendLoginOtp,
  useResendOtp,
  useResetPassword,
  useSignup,
  useVerifyEmail,
  useVerifyLoginOtp,
  useVerifyResetOtp,
} from "@/lib/auth/queries";

type AuthInputType = "text" | "email" | "password";

interface AuthInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: AuthInputType;
  autoComplete?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const RESET_TOKEN_KEY = "lt_reset_token";
const RESET_EMAIL_KEY = "lt_reset_email";
const VERIFY_EMAIL_KEY = "lt_verify_email";
const LOGIN_EMAIL_KEY = "lt_login_email";
const LOGIN_TOKEN_KEY = "lt_login_token";
const LOGIN_REDIRECT_KEY = "lt_login_redirect";

function AuthHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header>
      <h1 className="font-londrina text-xl md:text-[26px] font-[900] leading-none text-white">
        {title}
      </h1>
      <p className="mt-3 max-w-[414px] font-inter text-sm font-[900] font-londrina leading-[21px] text-white">
        {description}
      </p>
    </header>
  );
}

function AuthInput({
  id,
  label,
  value,
  placeholder,
  type = "text",
  autoComplete,
  disabled = false,
  onChange,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="h-20">
      <label
        htmlFor={id}
        className="block font-londrina text-sm font-[900] leading-5 text-white"
      >
        {label}
      </label>
      <div className="relative mt-3">
        <input
          id={id}
          name={id}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-[50px] w-full rounded-full border-3 border-[#DBDBDB30] bg-transparent px-3 pr-11 font-londrina text-sm font-[900] text-white outline-none transition placeholder:text-white focus:border-[#FFB951] focus:bg-[#08082D] focus:ring-2 focus:ring-[#FFB951]/20 disabled:opacity-60"
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function GoogleButton({
  label,
  onCredential,
  disabled,
}: {
  label: string;
  onCredential: (idToken: string) => void;
  disabled?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const callbackRef = useRef(onCredential);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  // Render Google's GSI button at a fixed size, then apply CSS transform
  // so the rendered button fills the wrapper exactly. Hit-testing follows
  // the transform, so clicks anywhere on the wrapper land on Google's
  // (invisible) button. Works identically in dev and production.
  const GSI_W = 400;
  const GSI_H = 44; // typical "large" GSI button height
  const TARGET_H = 55; // our custom button height

  const fit = useCallback(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !overlay) return;
    const w = wrapper.clientWidth;
    if (w <= 0) return;
    const iframe = overlay.querySelector("iframe");
    const renderedH = iframe?.clientHeight || GSI_H;
    const sx = w / GSI_W;
    const sy = TARGET_H / renderedH;
    overlay.style.transform = `scale(${sx}, ${sy})`;
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    const cleanup = setGoogleCallback((idToken) =>
      callbackRef.current(idToken),
    );
    (async () => {
      try {
        await initGoogleSignIn(GOOGLE_CLIENT_ID);
        if (cancelled || !overlayRef.current) return;
        renderGoogleButton(overlayRef.current, { width: GSI_W });
        // Wait one frame so the iframe is mounted before measuring.
        requestAnimationFrame(() => {
          if (!cancelled) {
            fit();
            setReady(true);
          }
        });
      } catch {
        // GSI failed to load; fallback toast on click
      }
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [fit]);

  // Keep the rendered Google button matching the wrapper as the layout
  // changes (responsive resize, font load shift, etc.).
  useEffect(() => {
    if (!wrapperRef.current || !ready) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready, fit]);

  const handleClickFallback = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error("Google Sign-In is not configured.");
      return;
    }
    if (!ready) {
      toast.error("Google Sign-In is still loading. Please try again.");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-[55px] w-full"
      style={{ cursor: ready && !disabled ? "pointer" : "default" }}
    >
      {/* Visual custom button (behind, gets clicks ONLY when GSI not ready) */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleClickFallback}
        className="absolute inset-0 z-0 flex h-[55px] w-full items-center justify-center gap-2.5 rounded-full font-londrina text-lg font-[900] leading-6 text-[#091739] bg-white transition hover:bg-white/90 cursor-pointer shadow-[inset_0px_2px_1px_0px_#FFFFFF40,inset_0px_-4px_2px_0px_#00000040,0px_0px_1px_4px_#FFFFFF1A,0px_0px_180px_0px_#9917FF] disabled:opacity-70"
      >
        <FcGoogle className="size-[29px]" aria-hidden="true" />
        {label}
      </button>
      {/* Google's real (invisible) button — scaled to fill the wrapper exactly */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute left-0 top-0 z-10 opacity-0"
        style={{
          transformOrigin: "top left",
          pointerEvents: ready && !disabled ? "auto" : "none",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="my-4 flex h-[17px] items-center gap-[25px]">
      <span className="h-px flex-1 bg-[#DBDBDB]" />
      <span className="font-londrina text-sm font-[900] text-white">Or</span>
      <span className="h-px flex-1 bg-[#DBDBDB]" />
    </div>
  );
}

function PrimaryAuthButton({
  children,
  className = "",
  disabled = false,
  type = "submit",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <Button
      type={type}
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={`h-[55px] w-full px-6 py-0 font-londrina text-[24px] font-[900] leading-none disabled:opacity-70 ${className}`}
    >
      {children}
      <span className="flex size-6 scale-[0.72] items-center justify-center">
        <SparkleIcon />
      </span>
    </Button>
  );
}

function AuthSwitchLink({
  prompt,
  href,
  action,
}: {
  prompt: string;
  href: string;
  action: string;
}) {
  return (
    <p className="my-5 text-center font-londrina text-sm font-[900] text-white/70">
      {prompt}{" "}
      <Link
        href={href}
        className="text-white underline-offset-4 hover:underline"
      >
        {action}
      </Link>
    </p>
  );
}

function PolicyLinks() {
  return (
    <div className="mt-3 flex h-[21px] items-center justify-center gap-3 font-londrina text-sm font-[900] text-white/65">
      <Link href="/privacy-policy" className="transition hover:text-white">
        Privacy Policy
      </Link>
      <span className="h-4 w-px bg-white/25" aria-hidden="true" />
      <Link
        href="/terms-and-conditions"
        className="transition hover:text-white"
      >
        Terms and Conditions
      </Link>
    </div>
  );
}

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < value.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    const next = Array.from({ length: 6 }, (_, index) => digits[index] ?? "");
    onChange(next);
    inputsRef.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-[17px] sm:gap-[17px]">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={digit}
          maxLength={1}
          disabled={disabled}
          aria-label={`Verification digit ${index + 1}`}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={(event) => {
            event.preventDefault();
            handlePaste(event.clipboardData.getData("text"));
          }}
          className="h-[50px] min-w-0 rounded-lg border border-[#BFC2FF]/35 bg-[#060625]/75 text-center font-londrina text-[24px] font-[900] text-white outline-none transition focus:border-[#FFB951] focus:ring-2 focus:ring-[#FFB951]/20 disabled:opacity-60 sm:h-[54px]"
        />
      ))}
    </div>
  );
}

function AuthDialog({
  title,
  description,
  buttonLabel,
  icon,
  children,
  size = "compact",
  actionDisabled = false,
  onAction,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon?: "success";
  children?: React.ReactNode;
  size?: "compact" | "wide";
  actionDisabled?: boolean;
  onAction: () => void;
}) {
  const frameSize =
    size === "wide"
      ? "min-h-[439px] max-w-[663px] px-8 py-16 sm:px-[120px] sm:py-[71px]"
      : "min-h-[366px] max-w-[370px] px-9 py-12 sm:px-[35px]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020411]/70 px-4 backdrop-blur-sm">
      <div
        className={`relative flex w-full items-center justify-center text-center ${frameSize}`}
      >
        <ImageFrame />
        <div className="relative z-10 mx-auto max-w-[423px]">
          {icon === "success" ? (
            <div className="flex justify-center mb-5">
              <Image
                src="/images/success.png"
                alt="Success"
                width={172}
                height={101}
              />
            </div>
          ) : null}
          <h2 className="font-londrina text-[30px] font-[900] leading-none text-white">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-[405px] font-londrina text-sm font-[900] leading-[1.7] text-white">
            {description}
          </p>
          {children ? <div className="mt-6">{children}</div> : null}
          <Button
            type="button"
            onClick={onAction}
            disabled={actionDisabled}
            size="lg"
            className="mx-auto mt-8 h-[55px] min-w-[207px] px-8 py-0 font-londrina text-[24px] font-[900] leading-none disabled:opacity-70"
          >
            {buttonLabel}
            <span className="flex size-6 scale-[0.72] items-center justify-center">
              <SparkleIcon />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageFrame() {
  return (
    <Image
      src="/images/form-popup.jpg"
      alt=""
      fill
      sizes="370px"
      className="pointer-events-none select-none"
    />
  );
}

function useGoogleSignIn(
  redirectTo: string,
  options?: {
    requireAccessCode?: boolean;
    getAccessCode?: () => string;
  },
) {
  const googleAuth = useGoogleAuth();

  const onCredential = useCallback(
    (idToken: string) => {
      const accessCode = options?.getAccessCode?.().trim() || "";
      if (options?.requireAccessCode && !accessCode) {
        toast.error("Access code required.");
        return;
      }

      googleAuth.mutate(
        { idToken, accessCode },
        {
          onSuccess: (response) => {
            const data = response.data;
            if ("requiresVerification" in data) {
              toast(response.message || "Please verify your email.");
              if (typeof window !== "undefined") {
                sessionStorage.setItem(VERIFY_EMAIL_KEY, data.email);
              }
              window.location.assign(
                `/verify-email?email=${encodeURIComponent(data.email)}`,
              );
              return;
            }
            if ("requiresLoginVerification" in data) {
              toast(response.message || "Verification code sent.");
              if (typeof window !== "undefined") {
                sessionStorage.setItem(LOGIN_EMAIL_KEY, data.email);
                sessionStorage.setItem(LOGIN_TOKEN_KEY, data.loginToken);
                sessionStorage.setItem(LOGIN_REDIRECT_KEY, redirectTo);
              }
              window.location.assign(
                `/verify-email?purpose=login&email=${encodeURIComponent(data.email)}&redirect=${encodeURIComponent(redirectTo)}`,
              );
              return;
            }
            toast.success("Signed in with Google.");
            if (typeof window !== "undefined") {
              localStorage.setItem("auth", JSON.stringify(response));
            }
            const dest = data.user.onboardingCompleted ? redirectTo : "/onboarding";
            navigateAfterAuth(dest);
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        },
      );
    },
    [googleAuth, options, redirectTo],
  );

  return { onCredential, isPending: googleAuth.isPending };
}

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signup = useSignup();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: searchParams?.get("email") || "",
    password: "",
    accessCode: searchParams?.get("code") || "",
  });

  const { onCredential: onGoogle, isPending: googlePending } =
    useGoogleSignIn("/game", {
      requireAccessCode: true,
      getAccessCode: () => form.accessCode,
    });

  const updateField = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signup.isPending) return;
    signup.mutate(form, {
      onSuccess: (response) => {
        toast.success(response.message || "Verification code sent.");
        if (typeof window !== "undefined") {
          sessionStorage.setItem(VERIFY_EMAIL_KEY, form.email);
        }
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const disabled = signup.isPending || googlePending;

  return (
    <AuthPanel variant="signup">
      <form onSubmit={handleSubmit}>
        <AuthHeading
          title="Sign Up to your Account"
          description="Join the experience crafted for the chosen. Your entry begins here."
        />
        <div className="mt-4">
          <GoogleButton
            label="Continue with Google"
            onCredential={onGoogle}
            disabled={disabled}
          />
        </div>
        <Divider />
        <div className="space-y-4">
          <AuthInput
            id="firstName"
            label="First Name"
            value={form.firstName}
            placeholder="Enter First Name"
            autoComplete="given-name"
            disabled={disabled}
            onChange={updateField("firstName")}
          />
          <AuthInput
            id="lastName"
            label="Last Name"
            value={form.lastName}
            placeholder="Enter Last Name"
            autoComplete="family-name"
            disabled={disabled}
            onChange={updateField("lastName")}
          />
          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            value={form.email}
            placeholder="Enter Email Address"
            autoComplete="email"
            disabled={disabled}
            onChange={updateField("email")}
          />
          <AuthInput
            id="password"
            type="password"
            label="Password"
            value={form.password}
            placeholder="********"
            autoComplete="new-password"
            disabled={disabled}
            onChange={updateField("password")}
          />
          <AuthInput
            id="accessCode"
            label="Access Code"
            value={form.accessCode}
            placeholder="Enter Access Code"
            autoComplete="off"
            disabled={disabled}
            onChange={updateField("accessCode")}
          />
        </div>
        <div className="mt-4">
          <PrimaryAuthButton disabled={disabled}>
            {signup.isPending ? "Signing Up..." : "Sign Up"}
          </PrimaryAuthButton>
          <AuthSwitchLink
            prompt="Already have an account?"
            href="/login"
            action="Log In"
          />
          <PolicyLinks />
        </div>
      </form>
    </AuthPanel>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/game";
  const login = useLogin();
  const { onCredential: onGoogle, isPending: googlePending } =
    useGoogleSignIn(redirect);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (login.isPending) return;
    login.mutate(form, {
      onSuccess: (response) => {
        const data = response.data;
        if (data && "requiresVerification" in data) {
          toast(response.message || "Please verify your email.");
          if (typeof window !== "undefined") {
            sessionStorage.setItem(VERIFY_EMAIL_KEY, form.email);
          }
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
          return;
        }
        if (data && "requiresLoginVerification" in data) {
          toast(response.message || "Verification code sent.");
          if (typeof window !== "undefined") {
            sessionStorage.setItem(LOGIN_EMAIL_KEY, data.email);
            sessionStorage.setItem(LOGIN_TOKEN_KEY, data.loginToken);
            sessionStorage.setItem(LOGIN_REDIRECT_KEY, redirect);
          }
          router.push(
            `/verify-email?purpose=login&email=${encodeURIComponent(data.email)}&redirect=${encodeURIComponent(redirect)}`,
          );
          return;
        }
        toast.success(response.message || "Logged in.");
        const dest =
          redirect.startsWith("/admin") && data.user.role === "admin"
            ? redirect
            : data.user.onboardingCompleted
              ? redirect
              : "/onboarding";
        localStorage.setItem("auth", JSON.stringify(response));
        navigateAfterAuth(dest);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const disabled = login.isPending || googlePending;

  return (
    <AuthPanel variant="login">
      <form onSubmit={handleSubmit}>
        <AuthHeading
          title="Log In to your Account"
          description="Join the experience crafted for the chosen. Your entry begins here."
        />
        <div className="mt-4">
          <GoogleButton
            label="Continue with Google"
            onCredential={onGoogle}
            disabled={disabled}
          />
        </div>
        <Divider />
        <div className="space-y-4">
          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            value={form.email}
            placeholder="Enter Email Address"
            autoComplete="email"
            disabled={disabled}
            onChange={(value) =>
              setForm((current) => ({ ...current, email: value }))
            }
          />
          <AuthInput
            id="password"
            type="password"
            label="Password"
            value={form.password}
            placeholder="****************"
            autoComplete="current-password"
            disabled={disabled}
            onChange={(value) =>
              setForm((current) => ({ ...current, password: value }))
            }
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Link
            href="/forgot-password"
            className="font-londrina text-base font-[900] text-[#936BF0] transition hover:text-white"
          >
            Forget Password?
          </Link>
        </div>
        <div className="mt-[29px]">
          <PrimaryAuthButton disabled={disabled}>
            {login.isPending ? "Logging in..." : "Log In"}
          </PrimaryAuthButton>
          <AuthSwitchLink
            prompt="Don't have an account?"
            href="/signup"
            action="Sign Up"
          />
          <PolicyLinks />
        </div>
      </form>
    </AuthPanel>
  );
}

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyEmail = useVerifyEmail();
  const verifyLogin = useVerifyLoginOtp();
  const resendOtp = useResendOtp();
  const resendLoginOtp = useResendLoginOtp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const filled = useMemo(() => otp.every(Boolean), [otp]);
  const isLoginVerification = searchParams?.get("purpose") === "login";

  const email = useMemo(() => {
    const fromQuery = searchParams?.get("email");
    if (fromQuery) return fromQuery;
    if (typeof window !== "undefined") {
      return (
        sessionStorage.getItem(
          isLoginVerification ? LOGIN_EMAIL_KEY : VERIFY_EMAIL_KEY,
        ) || ""
      );
    }
    return "";
  }, [isLoginVerification, searchParams]);

  const loginToken = useMemo(() => {
    if (!isLoginVerification || typeof window === "undefined") return "";
    return sessionStorage.getItem(LOGIN_TOKEN_KEY) || "";
  }, [isLoginVerification]);

  const loginRedirect = useMemo(() => {
    if (!isLoginVerification) return "";
    const fromQuery = searchParams?.get("redirect");
    if (fromQuery) return fromQuery;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(LOGIN_REDIRECT_KEY) || "";
    }
    return "";
  }, [isLoginVerification, searchParams]);

  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      toast.error(
        isLoginVerification
          ? "Login verification expired. Please sign in again."
          : "Email missing. Please sign up again.",
      );
      router.replace(isLoginVerification ? "/login" : "/signup");
    } else if (isLoginVerification && !loginToken && typeof window !== "undefined") {
      toast.error("Login verification expired. Please sign in again.");
      router.replace("/login");
    }
  }, [email, isLoginVerification, loginToken, router]);

  const pending = isLoginVerification
    ? verifyLogin.isPending
    : verifyEmail.isPending;

  const handleVerify = () => {
    if (!filled || pending || !email) return;
    if (isLoginVerification) {
      if (!loginToken) return;
      verifyLogin.mutate(
        { email, otp: otp.join(""), loginToken },
        {
          onSuccess: (response) => {
            toast.success(response.message || "Logged in.");
            if (typeof window !== "undefined") {
              sessionStorage.removeItem(LOGIN_EMAIL_KEY);
              sessionStorage.removeItem(LOGIN_TOKEN_KEY);
              sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
              localStorage.setItem("auth", JSON.stringify(response));
            }
            const dest =
              loginRedirect.startsWith("/admin") &&
              response.data.user.role === "admin"
                ? loginRedirect
                : destinationForUser(response.data.user);
            navigateAfterAuth(dest);
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        },
      );
      return;
    }

    verifyEmail.mutate(
      { email, otp: otp.join("") },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Email verified.");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(VERIFY_EMAIL_KEY);
            localStorage.setItem("auth", JSON.stringify(response));
          }
          navigateAfterAuth(destinationForUser(response.data.user));
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  const handleResend = () => {
    if (!email) return;
    if (isLoginVerification) {
      if (!loginToken || resendLoginOtp.isPending) return;
      resendLoginOtp.mutate(
        { email, loginToken },
        {
          onSuccess: (response) =>
            toast.success(response.message || "Code resent."),
          onError: (err) => toast.error(extractErrorMessage(err)),
        },
      );
      return;
    }

    if (resendOtp.isPending) return;
    resendOtp.mutate(
      { email, purpose: "email_verification" },
      {
        onSuccess: (response) =>
          toast.success(response.message || "Code resent."),
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleVerify();
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthDialog
        title={isLoginVerification ? "Login Verification" : "Email Verification"}
        description="Check Your Inbox. We've sent a one time password to your email to secure your account."
        buttonLabel={pending ? "Verifying..." : "Verify"}
        size="wide"
        actionDisabled={!filled || pending}
        onAction={handleVerify}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={pending}
        />
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoginVerification ? resendLoginOtp.isPending : resendOtp.isPending}
          className="mt-4 font-londrina text-sm font-[900] text-white/80 transition hover:text-white disabled:opacity-50 cursor-pointer"
        >
          {(isLoginVerification ? resendLoginOtp.isPending : resendOtp.isPending)
            ? "Sending..."
            : "Resend Code"}
        </button>
      </AuthDialog>
    </form>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const forgot = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (forgot.isPending) return;
    forgot.mutate(
      { email },
      {
        onSuccess: (response) => {
          toast.success(
            response.message || "Reset code sent if account exists.",
          );
          if (typeof window !== "undefined") {
            sessionStorage.setItem(RESET_EMAIL_KEY, email);
          }
          router.push(
            `/forgot-password/verify?email=${encodeURIComponent(email)}`,
          );
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  return (
    <AuthPanel variant="compact">
      <form onSubmit={handleSubmit}>
        <AuthHeading
          title="Forgot your password?"
          description="No worries! Enter your registered email address and we'll send you a secure verification code to help you reset your password quickly."
        />
        <div className="mt-4">
          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            value={email}
            placeholder="Enter Email Address"
            autoComplete="email"
            disabled={forgot.isPending}
            onChange={setEmail}
          />
        </div>
        <div className="mt-[45px]">
          <PrimaryAuthButton disabled={forgot.isPending}>
            {forgot.isPending ? "Sending..." : "Send Code"}
          </PrimaryAuthButton>
          <div className="mt-3 flex h-[21px] justify-center">
            <Link
              href="/login"
              className="font-londrina text-sm font-[900] text-white transition hover:text-white/90 flex gap-1 items-center"
            >
              <MoveLeft size={16} className="inline" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </form>
    </AuthPanel>
  );
}

export function ForgotVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyReset = useVerifyResetOtp();
  const resendOtp = useResendOtp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const email = useMemo(() => {
    const fromQuery = searchParams?.get("email");
    if (fromQuery) return fromQuery;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(RESET_EMAIL_KEY) || "";
    }
    return "";
  }, [searchParams]);

  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      toast.error("Email missing. Please request a code again.");
      router.replace("/forgot-password");
    }
  }, [email, router]);

  const filled = otp.every(Boolean);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!filled || verifyReset.isPending || !email) return;
    verifyReset.mutate(
      { email, otp: otp.join("") },
      {
        onSuccess: (response) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(RESET_TOKEN_KEY, response.data.resetToken);
          }
          toast.success(response.message || "Code verified.");
          router.push("/reset-password");
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  const handleResend = () => {
    if (!email || resendOtp.isPending) return;
    resendOtp.mutate(
      { email, purpose: "password_reset" },
      {
        onSuccess: (response) =>
          toast.success(response.message || "Code resent."),
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  return (
    <AuthPanel variant="compact">
      <form onSubmit={handleSubmit} className="pt-[3px]">
        <AuthHeading
          title="Verify your email"
          description="Enter the verification code sent to your registered email to continue."
        />
        <div className="mt-4">
          <label className="mb-3 block font-londrina text-sm font-[900] leading-5 text-white">
            Email Address
          </label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={verifyReset.isPending}
          />
          <span className="mt-3 font-londrina text-sm font-[900] text-white transition hover:text-white/90 text-center block">
            Didn&apos;t Receive Code Yet?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtp.isPending}
              className="cursor-pointer disabled:opacity-50"
            >
              {resendOtp.isPending ? "Sending..." : "Resend Code"}
            </button>
          </span>
        </div>
        <div className="mt-[19px]">
          <PrimaryAuthButton disabled={!filled || verifyReset.isPending}>
            {verifyReset.isPending ? "Verifying..." : "Verify"}
          </PrimaryAuthButton>
          <div className="mt-3 flex h-[21px] justify-center">
            <Link
              href="/forgot-password"
              className="font-londrina text-sm font-[900] text-white transition hover:text-white/90 mt-1"
            >
              Use a different email
            </Link>
          </div>
        </div>
      </form>
    </AuthPanel>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const reset = useResetPassword();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const resetToken = useMemo(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(RESET_TOKEN_KEY) || "";
  }, []);

  useEffect(() => {
    if (!resetToken && typeof window !== "undefined") {
      toast.error("Reset session expired. Please start again.");
      router.replace("/forgot-password");
    }
  }, [resetToken, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reset.isPending) return;
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    reset.mutate(
      { resetToken, newPassword: form.password },
      {
        onSuccess: (response) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(RESET_TOKEN_KEY);
            sessionStorage.removeItem(RESET_EMAIL_KEY);
          }
          toast.success(response.message || "Password updated.");
          setShowSuccess(true);
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  return (
    <>
      <AuthPanel variant="reset">
        <form onSubmit={handleSubmit}>
          <AuthHeading
            title="Create a new password"
            description="Choose a strong password to keep your account protected."
          />
          <div className="mt-4 space-y-4">
            <AuthInput
              id="newPassword"
              type="password"
              label="New Password"
              value={form.password}
              placeholder="********"
              autoComplete="new-password"
              disabled={reset.isPending}
              onChange={(value) =>
                setForm((current) => ({ ...current, password: value }))
              }
            />
            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              value={form.confirmPassword}
              placeholder="********"
              autoComplete="new-password"
              disabled={reset.isPending}
              onChange={(value) =>
                setForm((current) => ({ ...current, confirmPassword: value }))
              }
            />
          </div>
          <div className="mt-[45px]">
            <PrimaryAuthButton disabled={reset.isPending}>
              {reset.isPending ? "Resetting..." : "Reset Password"}
            </PrimaryAuthButton>
          </div>
        </form>
      </AuthPanel>
      {showSuccess ? (
        <AuthDialog
          icon="success"
          title="Password updated successfully!"
          description="You can now sign in with your new password and continue using your account securely without any interruption."
          buttonLabel="Back to Sign In"
          size="wide"
          onAction={() => router.push("/login")}
        />
      ) : null}
    </>
  );
}
