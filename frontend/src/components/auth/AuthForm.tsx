"use client";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { useLogin, useSignup } from "@/hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
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
        { email, password, username },
        {
          onSuccess: () => router.push("/onboarding"),
          onError: (error: unknown) => {
            const err = error as {
              response?: { data?: Record<string, unknown> };
            };
            const errData = err.response?.data;
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

  return (
    <div className="min-h-screen bg-white text-[#14140a] flex items-center justify-center p-6 selection:bg-[#c8f135] selection:text-[#403e0a]">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[#5a5a66] hover:text-[#c8f135] transition-colors duration-200 text-sm font-display font-bold uppercase tracking-[0.06em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[16px] border border-[#e7e4d6] p-8 md:p-10 shadow-[0_2px_12px_rgba(30,30,45,0.10)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 w-fit group">
            <div className="size-10 bg-[#c8f135] rounded-6 flex items-center justify-center text-[#403e0a] shadow-sm">
              <AppLogo width={24} height={24} className="object-contain" />
            </div>
            <span className="font-display font-black text-[clamp(24px,5vw,40px)] tracking-tight text-[#a6e9ff]">
              Opticast
            </span>
          </Link>

          {/* Heading */}
          <h1 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] text-[#14140a] mb-3 leading-[0.98]">
            {isLogin ? "Welcome Back" : "Join the Club"}
          </h1>
          <p className="text-[#5a5a66] text-[14px] leading-1.4 font-body mb-8">
            {isLogin
              ? "Sign in to access your podcast studio."
              : "Create an account to start converting your content."}
          </p>

          {/* Error Banner */}
          {formError && (
            <div className="mb-6 p-4 rounded-[16px] bg-[#f65858]/10 flex items-start gap-3 text-[#f65858]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-[2px]" />
              <p className="text-sm font-display font-semibold leading-relaxed">
                {formError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username — signup only */}
            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-[12px] font-mono font-bold uppercase tracking-[0.06em] text-[#5a5a66] ml-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-[#e7e4d6] pb-2 text-[#14140a] font-body text-[16px] focus:outline-none focus:border-[#5b3fd6] focus:ring-0 transition-colors placeholder:text-[#5a5a66]/60"
                  placeholder="yourchannel"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[12px] font-mono font-bold uppercase tracking-[0.06em] text-[#5a5a66] ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#e7e4d6] pb-2 text-[#14140a] font-body text-[16px] focus:outline-none focus:border-[#5b3fd6] focus:ring-0 transition-colors placeholder:text-[#5a5a66]/60"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[12px] font-mono font-bold uppercase tracking-[0.06em] text-[#5a5a66] ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-[#e7e4d6] pb-2 pr-14 text-[#14140a] font-body text-[16px] focus:outline-none focus:border-[#5b3fd6] focus:ring-0 transition-colors placeholder:text-[#5a5a66]/60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5a5a66] hover:text-[#c8f135] transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password — signup only */}
            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[12px] font-mono font-bold uppercase tracking-[0.06em] text-[#5a5a66] ml-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-[#e7e4d6] pb-2 pr-14 text-[#14140a] font-body text-[16px] focus:outline-none focus:border-[#5b3fd6] focus:ring-0 transition-colors placeholder:text-[#5a5a66]/60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5a5a66] hover:text-[#c8f135] transition-colors duration-200"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? (
                <div className="size-5 border-[3px] border-[#14140a]/30 border-t-[#14140a] animate-spin rounded-full" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  {isLogin ? (
                    <LogIn className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="mt-8 pt-6 border-t border-[#e7e4d6] text-center">
            <p className="text-[14px] font-display font-bold text-[#5a5a66] mb-3">
              {isLogin
                ? "Don't have an account yet?"
                : "Already have an account?"}
            </p>
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="text-[#5b3fd6] font-display font-bold hover:underline underline-offset-4 transition-colors"
            >
              {isLogin ? "Create a New Account →" : "← Sign In Instead"}
            </Link>
          </div>
        </div>

        {/* Legal */}
        <p className="mt-8 text-center text-[12px] font-mono font-bold uppercase tracking-[0.06em] text-[#5a5a66] leading-relaxed max-w-sm mx-auto">
          By continuing, you agree to OPTICAST's{" "}
          <Link
            href="#"
            className="text-[#5b3fd6] hover:underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-[#5b3fd6] hover:underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
