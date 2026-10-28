"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAcceptTOS, useMe } from "@/hooks/useAuth";

export function AcceptTosStep() {
  const { data: user } = useMe();
  const acceptTOS = useAcceptTOS();
  const [agreed, setAgreed] = useState(false);

  const tosCompleted = !!user?.tos_accepted_at;
  const canContinue = agreed && !tosCompleted;

  const handleAccept = async () => {
    try {
      await acceptTOS.mutateAsync(true);
      toast.success("Terms of Service accepted");
    } catch {
      toast.error("Failed to accept Terms of Service");
    }
  };

  return (
    <form
      className="w-full max-w-[640px] p-[40px] rounded-[20px] bg-[#FFFFFF] shadow-[0_4px_18px_rgba(30,30,45,0.10)]"
      onSubmit={(e) => {
        e.preventDefault();
        if (agreed) handleAccept();
      }}
    >
      <p
        className="m-0 font-mono text-[12px] tracking-[0.06em] uppercase text-[#5A5A66]"
        style={{ letterSpacing: "0.06em" }}
      >
        Step 1 of 2
      </p>
      <h1
        className="m-0 mt-[10px] font-display font-black text-[clamp(30px,4vw,40px)] tracking-[-0.04em] leading-none text-[#14140A]"
        style={{ letterSpacing: "-0.04em" }}
      >
        Welcome to Opttis
      </h1>
      <p className="mt-[10px] text-[17px] leading-1.5 text-[#5A5A66]">
        Two quick steps, then you can connect your channel.
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
          Opttis only works on channels you connect.
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
          Nothing is published until you approve it.
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
          Content is processed within YouTube&apos;s Terms of Service.
        </li>
      </ul>

      <label className="mt-[24px] flex gap-[14px] items-start cursor-pointer text-[16px] leading-1.4 select-none">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="shrink-0 size-[24px] mt-0"
          style={{ accentColor: "#403E0A" }}
        />
        <span className="leading-1.4">
          I agree to the{" "}
          <button
            type="button"
            className="text-[#5B3FD6] font-bold underline-offset-4 hover:underline p-0 m-0 bg-none border-none cursor-pointer"
            onClick={() => toast.info("Terms of Service")}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-[#5B3FD6] font-bold underline-offset-4 hover:underline p-0 m-0 bg-none border-none cursor-pointer"
            onClick={() => toast.info("Privacy policy")}
          >
            Privacy policy
          </button>
          .
        </span>
      </label>

      <Button
        type="submit"
        disabled={!canContinue || acceptTOS.isPending}
        className="mt-[28px] w-full min-h-[54px] rounded-6 font-body font-bold text-[17px]"
        style={{
          backgroundColor: canContinue ? "#C8F135" : "#E7E4D6",
          color: canContinue ? "#403E0A" : "#5A5A66",
        }}
      >
        {acceptTOS.isPending ? "Accepting…" : "Continue"}
      </Button>

      <p className="mt-[12px] text-center text-[13px] text-[#5A5A66]">
        Tick the box to continue.
      </p>
    </form>
  );
}
