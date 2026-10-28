"use client";

import { AlertCircle, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useLogin, useSignup } from "@/hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "signup";
}

const LogoMark = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 40 40"
    aria-hidden="true"
    className="shrink-0"
  >
    <g transform="rotate(45 20 20)">
      <rect x="3" y="16" width="34" height="8" rx="4" fill="#b9a4f2" />
    </g>
    <g transform="rotate(-45 20 20)">
      <rect x="3" y="16" width="34" height="8" rx="4" fill="#f5f1e0" />
    </g>
  </svg>
);

const loginScatter = [
  { l: "12%", t: "62%", c: "#c8f135", w: "14px", h: "14px" },
  { l: "20%", t: "72%", c: "#a6e9ff", w: "10px", h: "10px" },
  { l: "30%", t: "80%", c: "#f5f1e0", w: "8px", h: "8px" },
  { l: "62%", t: "12%", c: "#c8f135", w: "12px", h: "12px" },
  { l: "68%", t: "8%", c: "#a6e9ff", w: "8px", h: "8px" },
];

const signupScatter = [
  { l: "12%", t: "66%", c: "#c8f135", w: "14px", h: "14px" },
  { l: "22%", t: "76%", c: "#a6e9ff", w: "10px", h: "10px" },
  { l: "34%", t: "84%", c: "#f5f1e0", w: "8px", h: "8px" },
  { l: "60%", t: "10%", c: "#c8f135", w: "12px", h: "12px" },
  { l: "66%", t: "6%", c: "#a6e9ff", w: "8px", h: "8px" },
];

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const isLoading = loginMutation.isPending || signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (isLogin) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => router.push("/projects"),
          onError: (error: unknown) => {
            const err = error as {
              response?: { data?: { error?: string } };
            };
            setFormError(
              err.response?.data?.error || "Invalid email or password.",
            );
          },
        },
      );
    } else {
      if (password !== confirmPassword) {
        setFormError("Passwords don't match.");
        return;
      }
      signupMutation.mutate(
        {
          email,
          password,
          username: email.split("@")[0] || email,
        },
        {
          onSuccess: () => router.push("/onboarding"),
          onError: (error: unknown) => {
            const errData = (
              error as {
                response?: { data?: Record<string, unknown> };
              }
            ).response?.data;
            if (errData && typeof errData === "object") {
              const messages = Object.values(errData).flat() as string[];
              setFormError(messages.join(" ") || "Failed to create account.");
            } else {
              setFormError("Failed to create account.");
            }
          },
        },
      );
    }
  };

  const togglePassword =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () =>
      setter((prev) => !prev);

  return (
    <div
      className="min-h-[860px] bg-[#14140a] text-[#14140a] w-full flex flex-wrap"
      style={{ color: "#14140a" }}
    >
      {/* brand panel */}
      <section className="flex-1 flex-1 [520px] min-w-0 bg-[#403e0a] relative overflow-hidden p-[32px_48px] flex flex-col justify-between min-h-[420px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          {mode === "login"
            ? loginScatter.map((d) => (
                <div
                  key={`${d.l}-${d.t}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: d.l,
                    top: d.t,
                    width: d.w,
                    height: d.h,
                    background: d.c,
                  }}
                />
              ))
            : signupScatter.map((d) => (
                <div
                  key={`${d.l}-${d.t}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: d.l,
                    top: d.t,
                    width: d.w,
                    height: d.h,
                    background: d.c,
                  }}
                />
              ))}
          <div className="absolute right-[-40px] bottom-[120px] w-[340px] h-[72px] rounded-full bg-[#b9a4f2] rotate-[-38deg]" />
          <div className="absolute right-[-40px] bottom-[200px] w-[340px] h-[72px] rounded-full bg-[#f5f1e0] rotate-[38deg]" />
        </div>
        <Link
          href="/"
          aria-label="Opttis home"
          className="relative flex items-center gap-2 text-decoration-none text-[#c8f135]"
        >
          <LogoMark />
          <span className="font-display font-black text-[28px] tracking-[-0.04em]">
            opttis
          </span>
        </Link>
        <div
          className="relative max-w-[460px] pt-[48px] pb-0"
          style={{ maxWidth: isLogin ? 460 : 480 }}
        >
          <h2
            className="font-display font-black text-[clamp(40px,5vw,68px)] leading-[0.98] tracking-[-0.045em] text-[#a6e9ff] mb-0"
            style={{
              fontSize: isLogin
                ? "clamp(40px,5vw,68px)"
                : "clamp(38px,4.6vw,62px)",
            }}
          >
            {isLogin ? "Welcome back." : "One upload. Every format."}
          </h2>
          {isLogin ? (
            <>
              <p className="text-[#f5f1e0] text-[18px] leading-1.5 mt-[20px] mb-0 font-body">
                Your drafts are waiting for approval.
              </p>
              <span className="font-script font-bold text-[32px] text-[#ffc2de] inline-block rotate-[-3deg] mt-[28px] block">
                upload once!
              </span>
            </>
          ) : (
            <ul className="m-0 p-0 list-none flex flex-col gap-[14px] text-[#f5f1e0] text-[17px] mt-[28px] font-body">
              <li className="flex gap-[12px] items-center">
                <span
                  aria-hidden="true"
                  className="w-[10px] h-[10px] shrink-0"
                  style={{ background: "#c8f135" }}
                />
                Podcast episodes, Shorts, blog posts and social posts
              </li>
              <li className="flex gap-[12px] items-center">
                <span
                  aria-hidden="true"
                  className="w-[10px] h-[10px] shrink-0"
                  style={{ background: "#b9a4f2" }}
                />
                Approve by email, Slack or Telegram
              </li>
              <li className="flex gap-[12px] items-center">
                <span
                  aria-hidden="true"
                  className="w-[10px] h-[10px] shrink-0"
                  style={{ background: "#ffc2de" }}
                />
                Only channels you authorize
              </li>
            </ul>
          )}
        </div>
        <p className="relative text-[#cfcb9e] text-[13px] mb-0">
          © 2026 Opttis
        </p>
      </section>

      {/* form panel */}
      <section className="flex-1 flex-1 [480px] min-w-0 bg-[#f5f1e0] p-[48px_24px] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: 420 }}
          aria-busy={isLoading}
        >
          <h1 className="font-display font-black text-[36px] tracking-[-0.04em] mb-0">
            {isLogin ? "Log in" : "Create your account"}
          </h1>
          <p className="text-[#5a5a66] text-[16px] mt-[8px] mb-[28px] font-body">
            {isLogin
              ? "Pick up where you left off."
              : "Free to start. You will connect your YouTube channel next."}
          </p>

          {formError && (
            <div
              role="alert"
              className="flex items-start gap-[10px] p-[12px_14px] rounded-[10px] border border-[1.5px] border-[#f65858] bg-[#ffe9e9] text-[#8a1c1c] text-[14px] leading-1.4 mb-[16px]"
            >
              <AlertCircle className="w-[20px] h-[20px] shrink-0 mt-[1px]" />
              <span>{formError}</span>
            </div>
          )}

          <div
            className="flex flex-col gap-[6px]"
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            <label htmlFor="em" className="font-bold text-[15px]">
              Email
            </label>
            <input
              id="em"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="min-h-[52px] px-[18px] border border-[1.5px] border-[#c9c5b0] rounded-[10px] bg-white font-body text-[16px] text-[#14140a] focus:outline-none"
            />
          </div>

          <div
            className="flex flex-col gap-[6px] mt-[18px]"
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            <label htmlFor="pw" className="font-bold text-[15px]">
              Password
            </label>
            <div className="flex items-center border border-[1.5px] border-[#c9c5b0] rounded-[10px] bg-white pr-[6px]">
              <input
                id="pw"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="flex-1 min-w-0 min-h-[52px] px-[18px] border-0 bg-transparent font-body text-[16px] text-[#14140a] focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePassword(
                  isLogin ? setShowPassword : setShowConfirm,
                )}
                aria-label="Show password"
                className="flex items-center justify-center w-[44px] h-[44px] border-0 rounded-[8px] bg-transparent text-[#5a5a66] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-[20px] h-[20px]" />
                ) : (
                  <Eye className="w-[20px] h-[20px]" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div
              className="flex flex-col gap-[6px] mt-[18px]"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              <label
                htmlFor="confirmPassword"
                className="font-bold text-[15px]"
              >
                Confirm Password
              </label>
              <div className="flex items-center border border-[1.5px] border-[#c9c5b0] rounded-[10px] bg-white pr-[6px]">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 min-w-0 min-h-[52px] px-[18px] border-0 bg-transparent font-body text-[16px] text-[#14140a] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword(setShowConfirm)}
                  aria-label="Show confirm password"
                  className="flex items-center justify-center w-[44px] h-[44px] border-0 rounded-[8px] bg-transparent text-[#5a5a66] cursor-pointer"
                >
                  {showConfirm ? (
                    <EyeOff className="w-[20px] h-[20px]" />
                  ) : (
                    <Eye className="w-[20px] h-[20px]" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-[26px] w-full min-h-[54px] border-0 rounded-[6px] bg-[#c8f135] text-[#403e0a] font-body text-[17px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-[10px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#403e0a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" strokeOpacity={0.25} />
                  <path d="M21 12a9 9 0 0 0-9-9" />
                </svg>
                {isLogin ? "Signing in…" : "Creating account…"}
              </span>
            ) : isLogin ? (
              <>
                Log in <LogIn className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Create account <UserPlus className="w-5 h-5 ml-2" />
              </>
            )}
          </button>

          {isLogin ? (
            <p className="text-[#5a5a66] text-[15px] mt-[22px] text-center">
              New to Opttis?{" "}
              <Link
                href="/signup"
                className="text-[#5b3fd6] font-bold text-decoration-none"
              >
                Create an account
              </Link>
            </p>
          ) : (
            <>
              <p className="text-[#5a5a66] text-[13px] leading-1.5 mt-[16px] text-center">
                By continuing you agree to the{" "}
                <Link
                  href="#"
                  className="text-[#5b3fd6] font-bold text-decoration-none"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-[#5b3fd6] font-bold text-decoration-none"
                >
                  Privacy policy
                </Link>
                .
              </p>
              <p className="text-[#5a5a66] text-[15px] mt-[20px] text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#5b3fd6] font-bold text-decoration-none"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </form>
      </section>
    </div>
  );
}
