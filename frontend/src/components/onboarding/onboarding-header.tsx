"use client";

import { Check } from "lucide-react";

interface OnboardingHeaderProps {
  step: 1 | 2;
}

export function OnboardingHeader({ step }: OnboardingHeaderProps) {
  const step1Done = step === 2;
  const step1Active = step === 1;
  const step2Active = step === 2;

  return (
    <>
      <header
        className="relative overflow-hidden"
        style={{ backgroundColor: "#403E0A" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute"
            style={{
              left: "62%",
              top: "30%",
              width: "12px",
              height: "12px",
              backgroundColor: "#C8F135",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "66%",
              top: "58%",
              width: "8px",
              height: "8px",
              backgroundColor: "#A6E9FF",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "90%",
              top: "40%",
              width: "10px",
              height: "10px",
              backgroundColor: "#F5F1E0",
            }}
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-4 relative z-10">
          <a
            href="/"
            aria-label="Opttis home"
            className="inline-flex items-center gap-[10px] text-decoration-none text-[#C8F135]"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              aria-hidden="true"
              className="shrink-0"
            >
              <g transform="rotate(45 20 20)">
                <rect
                  x="3"
                  y="16"
                  width="34"
                  height="8"
                  rx="4"
                  fill="#B9A4F2"
                />
              </g>
              <g transform="rotate(-45 20 20)">
                <rect
                  x="3"
                  y="16"
                  width="34"
                  height="8"
                  rx="4"
                  fill="#F5F1E0"
                />
              </g>
            </svg>
            <span
              className="font-display font-black text-[26px] tracking-[-0.04em]"
              style={{ letterSpacing: "-0.04em" }}
            >
              opttis
            </span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <ol
          aria-label="Setup progress"
          className="list-none m-0 p-0 flex flex-wrap items-center justify-center gap-[12px] gap-y-[14px] pt-[56px] pb-[32px] px-[24px]"
        >
          <li
            className="flex items-center gap-[10px]"
            aria-current={step1Active ? "step" : undefined}
            aria-hidden={!step1Active ? "true" : undefined}
          >
            {step1Done ? (
              <div
                className="flex items-center justify-center size-[36px] rounded-full"
                style={{
                  backgroundColor: "#403E0A",
                }}
              >
                <Check
                  className="size-[18px]"
                  stroke="#C8F135"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center size-[36px] rounded-full font-display font-black text-[16px]"
                style={{
                  backgroundColor: step1Active ? "#C8F135" : "transparent",
                  color: step1Active ? "#403E0A" : "#5A5A66",
                  border: step1Active ? undefined : "2px solid #C9C5B0",
                }}
              >
                {step1Active ? "1" : undefined}
              </div>
            )}
            <span
              className={`
                font-bold text-[15px]
                ${
                  step1Done || step1Active
                    ? step1Active
                      ? "text-[#14140a]"
                      : "text-[#5a5a66]"
                    : "text-[#5a5a66]"
                }
              `}
            >
              {step1Done
                ? "Accept terms"
                : step1Active
                  ? "Accept terms"
                  : "Accept terms"}
            </span>
          </li>

          {step1Done || step2Active ? (
            <div
              className="w-[48px] h-[2px]"
              style={{
                backgroundColor: step2Active ? "#C8F135" : "#403E0A",
              }}
            />
          ) : (
            <div
              className="w-[48px] h-[2px]"
              style={{ backgroundColor: "#C9C5B0" }}
            />
          )}

          <li
            className="flex items-center gap-[10px]"
            aria-current={step2Active ? "step" : undefined}
            aria-hidden={!step2Active ? "true" : undefined}
          >
            <div
              className="flex items-center justify-center size-[36px] rounded-full font-display font-black text-[16px]"
              style={{
                backgroundColor: step2Active ? "#C8F135" : "transparent",
                color: step2Active ? "#403E0A" : "#5A5A66",
                border: step2Active ? undefined : "2px solid #C9C5B0",
              }}
            >
              {step2Active ? "2" : undefined}
            </div>
            <span
              className={`
                font-bold text-[15px]
                ${step2Active ? "text-[#14140a]" : "text-[#5a5a66]"}
              `}
            >
              Connect YouTube
            </span>
          </li>
        </ol>
      </main>
    </>
  );
}
