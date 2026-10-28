"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AcceptTosStep } from "@/components/onboarding/accept-tos-step";
import { ConnectYouTubeStep } from "@/components/onboarding/connect-youtube-step";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { useMe } from "@/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();

  const tosCompleted = !!user?.tos_accepted_at;
  const youtubeConnected = !!user?.has_youtube_connected;

  useEffect(() => {
    if (!isLoading && tosCompleted && youtubeConnected) {
      router.replace("/projects");
    }
  }, [router, isLoading, tosCompleted, youtubeConnected]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] flex items-center justify-center">
        <OnboardingHeader step={1} />
      </div>
    );
  }

  const step = tosCompleted ? 2 : 1;

  return (
    <>
      <OnboardingHeader step={step} />
      {!tosCompleted ? <AcceptTosStep /> : <ConnectYouTubeStep />}
    </>
  );
}
