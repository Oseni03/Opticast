"use client";

import { BookCheckIcon, CheckIcon, YoutubeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAcceptTOS, useMe } from "@/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: user } = useMe();
  const acceptTOS = useAcceptTOS();

  const [isTOSModalOpen, setIsTOSModalOpen] = useState(false);

  const tosCompleted = !!user?.tos_accepted_at;
  const youtubeConnected = !!user?.has_youtube_connected;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

  const handleGoogleLogin = () => {
    if (!tosCompleted) {
      toast.error("You must accept the Terms of Service first");
      setIsTOSModalOpen(true);
      return;
    }
    try {
      localStorage.setItem("auth_return_to", "/onboarding");
      const token = localStorage.getItem("access_token");
      const authUrl = `${apiUrl}/auth/google/authorize/?token=${token || ""}`;
      window.location.href = authUrl;
    } catch (err) {
      toast.error("Failed to initiate Google login");
      console.error(err);
    }
  };

  const handleAcceptTOS = async () => {
    try {
      await acceptTOS.mutateAsync(true);
      setIsTOSModalOpen(false);
      toast.success("Terms of Service accepted!");
    } catch (err) {
      toast.error("Failed to accept Terms of Service");
      console.error(err);
    }
  };

  const allCompleted = tosCompleted && youtubeConnected;

  return (
    <div className="min-h-screen bg-white text-[#14140a] flex items-center justify-center p-6 md:p-12 selection:bg-[#c8f135] selection:text-[#403e0a]">
      <div className="max-w-3xl w-full bg-white rounded-[32px] border border-[#e7e4d6] overflow-hidden">
        <div className="p-10 md:p-16">
          <div className="flex items-center gap-2 mb-16">
            <div className="size-10 bg-[#c8f135] rounded-6 flex items-center justify-center text-[#403e0a] shadow-sm">
              <BookCheckIcon className="size-5" />
            </div>
            <span className="font-display font-black text-[clamp(24px,5vw,40px)] tracking-tight text-[#a6e9ff]">
              Opticast
            </span>
          </div>

          <div className="mb-16">
            <h2 className="font-display font-black text-[clamp(40px,6vw,80px)] leading-1 tracking-[-0.045em] text-[#14140a] mb-6">
              Get your account <br />
              <span className="text-[#c8f135]">setup for success.</span>
            </h2>
            <p className="text-[#5a5a66] text-[19px] leading-1.5 font-body max-w-xl">
              Complete these simple steps to link your YouTube account and start
              creating podcast projects.
            </p>
          </div>

          <div className="space-y-6 mb-16">
            {/* Step 0: TOS */}
            <button
              type="button"
              onClick={() => !tosCompleted && setIsTOSModalOpen(true)}
              className={`flex items-start gap-4 p-6 rounded-[16px] transition-all cursor-pointer relative overflow-hidden border border-[#e7e4d6] bg-white ${
                tosCompleted ? "bg-[#f5f1e0]" : "hover:bg-[#f5f1e0]/50"
              }`}
            >
              <div
                className={`size-10 rounded-[6px] flex items-center justify-center transition-all shrink-0 ${
                  tosCompleted
                    ? "bg-[#c8f135] text-[#403e0a]"
                    : "bg-[#f5f1e0] text-[#c8f135] shadow-sm"
                }`}
              >
                <BookCheckIcon className="size-5" />
              </div>
              <div className="flex-1 pt-1">
                <h4
                  className={`font-display font-bold text-[20px] tracking-[-0.03em] text-[#14140a] mb-1`}
                >
                  Accept Terms of Service
                </h4>
                <p className="text-sm font-body text-[#5a5a66] leading-relaxed">
                  Review and agree to our terms to start using Opticast
                  services.
                </p>
              </div>
              <div
                className={`size-8 rounded-full flex flex-col items-center justify-center transition-all shrink-0 ${
                  tosCompleted ? "bg-[#b9a4f2] text-white" : "bg-transparent"
                }`}
              >
                {tosCompleted && (
                  <CheckIcon strokeWidth={3} className="size-4" />
                )}
              </div>
            </button>

            {/* Step 1: YouTube */}
            <button
              type="button"
              onClick={() => !youtubeConnected && handleGoogleLogin()}
              className={`flex items-start gap-4 p-6 rounded-[16px] transition-all cursor-pointer relative overflow-hidden border border-[#e7e4d6] bg-white ${
                youtubeConnected
                  ? "bg-[#f5f1e0]"
                  : !tosCompleted
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#f5f1e0]/50"
              }`}
            >
              <div
                className={`size-10 rounded-[6px] flex items-center justify-center transition-all shrink-0 ${
                  youtubeConnected
                    ? "bg-[#f65858] text-white"
                    : "bg-[#f5f1e0] text-[#f65858] shadow-sm"
                }`}
              >
                <YoutubeIcon size={20} />
              </div>
              <div className="flex-1 pt-1">
                <h4
                  className={`font-display font-bold text-[20px] tracking-[-0.03em] text-[#14140a] mb-1`}
                >
                  Connect YouTube Account
                </h4>
                <p className="text-sm font-body text-[#5a5a66] leading-relaxed">
                  {youtubeConnected
                    ? "Your YouTube account is successfully connected."
                    : "Authorize Opticast to access your YouTube channel data."}
                </p>
              </div>
              <div
                className={`size-8 rounded-full flex flex-col items-center justify-center transition-all shrink-0 ${
                  youtubeConnected
                    ? "bg-[#b9a4f2] text-white"
                    : "bg-transparent"
                }`}
              >
                {youtubeConnected && (
                  <CheckIcon strokeWidth={3} className="size-4" />
                )}
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/projects")}
            disabled={!allCompleted}
            className={`w-full py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] transition-all flex items-center justify-center gap-2 ${
              allCompleted
                ? "hover:opacity-90"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Continue to Projects
          </button>
        </div>
      </div>

      {/* TOS Modal */}
      <Dialog open={isTOSModalOpen} onOpenChange={setIsTOSModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-[#e7e4d6] rounded-[32px] shadow-[0_2px_12px_rgba(30,30,45,0.10)] p-10 select-none">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-[24px] tracking-tight text-[#14140a] mb-2">
              Terms of Service
            </DialogTitle>
            <DialogDescription className="font-body text-[#5a5a66] text-[14px]">
              Please review and accept our terms to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 p-6 rounded-[16px] bg-[#f5f1e0] max-h-[40vh] overflow-y-auto text-sm font-body text-[#5a5a66] leading-relaxed">
            <h3 className="font-display font-bold text-[#14140a] mb-2">
              1. Content Ownership
            </h3>
            <p className="mb-5">
              You retain all ownership rights to your content. By using
              Opticast, you grant us a limited license to process and distribute
              your content as necessary to provide the service.
            </p>

            <h3 className="font-display font-bold text-[#14140a] mb-2">
              2. Usage Limits
            </h3>
            <p className="mb-5">
              Our service is subject to limits based on your selected plan.
              Misuse or attempts to circumvent these limits may result in
              account suspension.
            </p>

            <h3 className="font-display font-bold text-[#14140a] mb-2">
              3. Data Privacy
            </h3>
            <p className="mb-2">
              We respect your privacy and handle your data in accordance with
              our Privacy Policy. Google user data is accessed only as required
              for YouTube integration.
            </p>
          </div>

          <DialogFooter className="sm:justify-start gap-3 flex-col sm:flex-row">
            <Button
              onClick={handleAcceptTOS}
              disabled={acceptTOS.isPending}
              className="flex-1 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] rounded-6 h-[42px] hover:opacity-90"
            >
              {acceptTOS.isPending ? "Accepting..." : "I Accept the Terms"}
            </Button>
            <Button
              variant="link"
              onClick={() => setIsTOSModalOpen(false)}
              className="h-[42px] rounded-6"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
