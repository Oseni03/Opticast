"use client";

import { AlertCircle, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";

type ConnectionStatus = "idle" | "redirecting" | "connected" | "error";

export function ConnectYouTubeStep() {
  const { data: user } = useMe();
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const youtubeConnected = !!user?.has_youtube_connected;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
      setStatus("error");
      return;
    }
    if (youtubeConnected) {
      setStatus("connected");
    }
  }, [youtubeConnected]);

  const handleConnectGoogle = () => {
    try {
      localStorage.setItem("auth_return_to", "/onboarding");
      const token = localStorage.getItem("access_token");
      const authUrl = `${apiUrl}/auth/google/authorize/?token=${token || ""}`;
      setStatus("redirecting");
      window.location.href = authUrl;
    } catch {
      toast.error("Failed to initiate Google login");
      setStatus("error");
    }
  };

  const handleTryAgain = () => {
    setStatus("idle");
  };

  const redirecting = status === "redirecting";
  const connected = status === "connected";
  const error = status === "error";

  return (
    <section className="w-full max-w-[640px] p-[40px] rounded-[20px] bg-[#FFFFFF] shadow-[0_4px_18px_rgba(30,30,45,0.10)]">
      <p
        className="m-0 font-mono text-[12px] tracking-[0.06em] uppercase text-[#5A5A66]"
        style={{ letterSpacing: "0.06em" }}
      >
        Step 2 of 2
      </p>
      <h1
        className="m-0 mt-[10px] font-display font-black text-[clamp(30px,4vw,40px)] tracking-[-0.04em] leading-none text-[#14140A]"
        style={{ letterSpacing: "-0.04em" }}
      >
        Connect your YouTube channel
      </h1>
      <p className="mt-[10px] text-[17px] leading-1.5 text-[#5A5A66]">
        Sign in with Google to authorize your channel. You choose which channel
        to use.
      </p>

      <ul className="mt-[24px] p-[20px] list-none rounded-[14px] bg-[#F5F1E0] flex flex-col gap-[14px] text-[16px] leading-1.4">
        <li className="flex gap-[12px] items-start">
          <span
            className="shrink-0 size-[10px] mt-[6px] rounded-full"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#C8F135",
              border: "1.5px solid #403E0A",
            }}
            aria-hidden="true"
          />
          See your channel and its new uploads.
        </li>
        <li className="flex gap-[12px] items-start">
          <span
            className="shrink-0 size-[10px] mt-[6px] rounded-full"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#B9A4F2",
              border: "1.5px solid #403E0A",
            }}
            aria-hidden="true"
          />
          Turn each upload into audio and drafts for you to review.
        </li>
        <li className="flex gap-[12px] items-start">
          <span
            className="shrink-0 size-[10px] mt-[6px] rounded-full"
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#A6E9FF",
              border: "1.5px solid #403E0A",
            }}
            aria-hidden="true"
          />
          Nothing goes live until you approve it.
        </li>
      </ul>

      {redirecting ? (
        <div className="mt-[28px]">
          <Button
            disabled
            className="w-full min-h-[54px] rounded-6 font-body font-bold text-[17px] flex items-center justify-center gap-[10px]"
            style={{
              backgroundColor: "#E7E4D6",
              color: "#403E0A",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#403E0A"
              strokeWidth={3}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" strokeOpacity={0.25} />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Opening Google…
          </Button>
          <Button
            disabled
            className="mt-[16px] w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
            style={{
              backgroundColor: "#E7E4D6",
              color: "#5A5A66",
            }}
          >
            Continue to Projects
          </Button>
        </div>
      ) : connected ? (
        <div className="mt-[20px]">
          <output className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[14px] border border-[1.5px] border-[#C8F135] bg-[#F0FBC9]">
            <span
              className="flex items-center justify-center size-[36px] rounded-full shrink-0"
              style={{ backgroundColor: "#403E0A" }}
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8F135"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="m-0 font-bold text-[15px]">YouTube connected</p>
              <p className="mt-[2px] text-[14px] text-[#403E0A]">
                {user?.username || "[Channel name]"}
              </p>
            </div>
          </output>
          <Button
            className="mt-[24px] w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
            style={{
              backgroundColor: "#C8F135",
              color: "#403E0A",
            }}
            onClick={() => {
              // Fallback; page auto-redirects when both steps complete
            }}
          >
            Continue to Projects
          </Button>
        </div>
      ) : error ? (
        <div className="mt-[20px]">
          <div
            role="alert"
            className="flex items-start gap-[10px] rounded-[10px] px-[12px] py-[12px] border border-[1.5px] border-[#F65858] bg-[#FFE9E9] text-[#8A1C1C] text-[14px] leading-1.4"
          >
            <AlertCircle className="shrink-0 size-[20px] mt-[1px]" />
            <span>
              We couldn&apos;t link your Google account. Please try again.
            </span>
          </div>
          <Button
            className="mt-[20px] w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
            onClick={handleTryAgain}
            style={{
              backgroundColor: "#1E1E2D",
              color: "#FFFFFF",
            }}
          >
            Try again
          </Button>
          <Button
            disabled
            className="mt-[16px] w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
            style={{
              backgroundColor: "#E7E4D6",
              color: "#5A5A66",
            }}
          >
            Continue to Projects
          </Button>
        </div>
      ) : (
        <div className="mt-[28px]">
          <Button
            className="w-full min-h-[54px] rounded-6 font-body font-bold text-[17px] flex items-center justify-center gap-[10px]"
            onClick={handleConnectGoogle}
            style={{
              backgroundColor: "#1E1E2D",
              color: "#FFFFFF",
            }}
          >
            <LogOut
              className="size-[20px]"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            Connect with Google
          </Button>
          <div className="mt-[24px] pt-[24px] border-t border-[#E7E4D6]">
            <Button
              disabled
              className="w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
              style={{
                backgroundColor: "#E7E4D6",
                color: "#5A5A66",
              }}
            >
              Continue to Projects
            </Button>
            <p className="mt-[12px] text-center text-[13px] text-[#5A5A66]">
              Connect YouTube to continue.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
