"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

interface KpiCardProps {
  label: string;
  value: string | number;
  color: string;
  hasBar?: boolean;
  barValue?: number;
  barMax?: number;
}

export function KpiCard({
  label,
  value,
  color,
  hasBar = false,
  barValue = 0,
  barMax = 3,
}: KpiCardProps) {
  const barStyle = {
    width: `${(barValue / barMax) * 100}%`,
  } as React.CSSProperties;

  return (
    <div
      className="p-[24px] rounded-[16px] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(30,30,45,0.08)]"
      style={{ borderBottom: `5px solid ${color}` }}
    >
      <p
        className="m-0 font-mono text-[12px] tracking-[0.06em] uppercase text-[#5A5A66]"
        style={{ letterSpacing: "0.06em" }}
      >
        {label}
      </p>
      <p
        className="m-0 mt-[10px] font-display font-black text-[44px] tracking-[-0.045em] leading-none text-[#14140A]"
        style={{ letterSpacing: "-0.045em" }}
      >
        {value}
      </p>
      {hasBar && (
        <div
          className="mt-[14px] h-[8px] rounded-full bg-[#E7E4D6]"
          style={{ marginTop: "14px" }}
        >
          <div className="h-full rounded-full bg-[#403E0A]" style={barStyle} />
        </div>
      )}
    </div>
  );
}

interface LimitStateProps {
  limit: number;
  connected: number;
  onUpgrade: () => void;
}

export function LimitState({ limit, connected, onUpgrade }: LimitStateProps) {
  const pct = limit > 0 ? Math.min(100, (connected / limit) * 100) : 0;

  return (
    <>
      <div
        className="p-[24px] rounded-[16px] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(30,30,45,0.08)]"
        style={{ borderBottom: "5px solid #A6E9FF" }}
      >
        <p
          className="m-0 font-mono text-[12px] tracking-[0.06em] uppercase text-[#5A5A66]"
          style={{ letterSpacing: "0.06em" }}
        >
          Channels
        </p>
        <p
          className="m-0 mt-[10px] font-display font-black text-[40px] tracking-[-0.045em] leading-none text-[#14140A]"
          style={{ letterSpacing: "-0.045em" }}
        >
          {connected} of {limit}
        </p>
        <div
          className="mt-[14px] h-[8px] rounded-full bg-[#E7E4D6]"
          style={{ marginTop: "14px" }}
        >
          <div
            className="h-full rounded-full bg-[#403E0A]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <output className="mt-[16px] p-[16px] rounded-[12px] bg-[#E4DBFB] text-[15px] leading-1.5">
        Your plan includes {limit} channels. Upgrade to connect more.
      </output>

      <div className="mt-[16px] flex flex-wrap gap-[10px]">
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-[8px] min-h-[50px] rounded-6 bg-[#E7E4D6] text-[#5A5A66] font-body font-bold text-[15px] cursor-not-allowed"
          style={{ padding: "0 22px" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New project
        </button>
        <button
          type="button"
          onClick={onUpgrade}
          className="inline-flex items-center min-h-[50px] rounded-6 bg-[#1E1E2D] text-[#FFFFFF] text-decoration-none font-body font-bold text-[15px] cursor-pointer"
          style={{ padding: "0 22px" }}
        >
          Upgrade plan
        </button>
      </div>
    </>
  );
}

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div
      className="p-[40px]_p-[28px] rounded-[16px] bg-[#FFFFFF] border border-[2px] border-[#C9C5B0] min-h-[360px] flex flex-col items-center justify-center gap-[8px] text-center"
      style={{ padding: "40px 28px" }}
    >
      <div
        className="relative size-[96px] h-[64px] mb-[8px]"
        style={{ width: "96px", height: "64px", marginBottom: "8px" }}
        aria-hidden="true"
      >
        <div
          className="absolute"
          style={{
            left: "8px",
            top: "26px",
            width: "80px",
            height: "14px",
            borderRadius: "9999px",
            backgroundColor: "#B9A4F2",
            transform: "rotate(-38deg)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: "8px",
            top: "26px",
            width: "80px",
            height: "14px",
            borderRadius: "9999px",
            backgroundColor: "#403E0A",
            transform: "rotate(38deg)",
          }}
        />
      </div>
      <h2
        className="m-0 font-display font-black text-[24px] tracking-[-0.035em] text-[#14140A]"
        style={{ letterSpacing: "-0.035em" }}
      >
        No projects yet
      </h2>
      <p className="m-0 max-w-[280px] text-[15px] leading-1.5 text-[#5A5A66]">
        Connect a YouTube channel to start turning uploads into a podcast.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-[14px] inline-flex items-center gap-[8px] min-h-[48px] rounded-6 bg-[#C8F135] text-[#403E0A] text-decoration-none font-body font-bold text-[15px] cursor-pointer"
        style={{ padding: "0 22px" }}
      >
        <Plus className="size-[18px]" strokeWidth={2.5} strokeLinecap="round" />
        Create your first project
      </button>
    </div>
  );
}

function ChannelAvatar({ channelIndex = 0 }: { channelIndex?: number }) {
  const gradients: string[] = [
    "linear-gradient(135deg,#C8F135,#A6E9FF)",
    "linear-gradient(135deg,#B9A4F2,#FFC2DE)",
    "linear-gradient(135deg,#A6E9FF,#B9A4F2)",
    "linear-gradient(135deg,#FFC2DE,#C8F135)",
  ];
  return (
    <div
      className="size-[56px] rounded-full shrink-0"
      style={{
        width: "56px",
        height: "56px",
        background: gradients[channelIndex % gradients.length],
      }}
    />
  );
}

interface ChannelCardProps {
  channel: {
    id: string;
    channel_title: string;
    podcast_title: string | null;
    rss_slug: string;
    monitoring_active: boolean;
    episode_count: number;
    download_count?: number;
  };
  channelIndex: number;
}

export function ChannelCard({ channel, channelIndex }: ChannelCardProps) {
  const displayName = channel.podcast_title || channel.channel_title;
  const status = channel.monitoring_active ? "Active" : "Syncing";
  const chipBg = channel.monitoring_active ? "#F0FBC9" : "#E4DBFB";

  return (
    <article className="p-[22px] rounded-[16px] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(30,30,45,0.08)] flex flex-col gap-[18px]">
      <div className="flex items-center gap-[14px]">
        <ChannelAvatar channelIndex={channelIndex} />
        <div className="flex-1 min-w-0">
          <h3
            className="m-0 font-display font-bold text-[20px] tracking-[-0.025em] text-[#14140A] overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ letterSpacing: "-0.025em" }}
            title={displayName}
          >
            {channel.channel_title}
          </h3>
          <p
            className="mt-[2px] text-[14px] text-[#5A5A66] overflow-hidden text-ellipsis whitespace-nowrap"
            title={displayName}
          >
            {displayName}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-[6px] rounded-full"
          style={{
            padding: "5px 12px",
            backgroundColor: chipBg,
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          <span
            className="size-[8px] rounded-full bg-[#403E0A]"
            style={{ width: "8px", height: "8px", backgroundColor: "#403E0A" }}
            aria-hidden="true"
          />
          {status}
        </span>
      </div>

      <div className="flex gap-[32px]">
        <div>
          <p
            className="m-0 font-mono text-[11px] tracking-[0.06em] uppercase text-[#5A5A66]"
            style={{ letterSpacing: "0.06em" }}
          >
            Downloads
          </p>
          <p
            className="mt-[4px] font-display font-bold text-[26px] tracking-[-0.04em] text-[#14140A]"
            style={{ letterSpacing: "-0.04em" }}
          >
            {channel.download_count ?? 0}
          </p>
        </div>
        <div>
          <p
            className="m-0 font-mono text-[11px] tracking-[0.06em] uppercase text-[#5A5A66]"
            style={{ letterSpacing: "0.06em" }}
          >
            Episodes
          </p>
          <p
            className="mt-[4px] font-display font-bold text-[26px] tracking-[-0.04em] text-[#14140A]"
            style={{ letterSpacing: "-0.04em" }}
          >
            {channel.episode_count}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-[12px] pt-[16px] border-t border-[#E7E4D6]"
        style={{ paddingTop: "16px", borderTop: "1px solid #E7E4D6" }}
      >
        <span
          className="font-mono text-[12px] text-[#5A5A66] overflow-hidden text-ellipsis whitespace-nowrap"
          title={channel.rss_slug}
        >
          {channel.rss_slug}
        </span>
        <Link
          href={`/projects/${channel.id}`}
          className="shrink-0 inline-flex items-center gap-[6px] min-h-[44px] rounded-6 bg-[#403E0A] text-[#FFFFFF] text-decoration-none font-body font-bold text-[15px]"
          style={{ padding: "0 20px" }}
        >
          Open
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

interface ProjectSkeletonProps {
  count?: number;
}

export function ProjectSkeleton({ count = 3 }: ProjectSkeletonProps) {
  return (
    <div className="flex flex-col gap-[14px]">
      {[1, 2, 3].slice(0, count).map((n) => (
        <div
          key={String(n)}
          className="p-[20px] rounded-[14px] bg-[#FFFFFF] animate-pulse"
          style={{ padding: "20px" }}
        >
          <div className="flex gap-[12px] items-center">
            <div className="size-[48px] rounded-full bg-[#E7E4D6]" />
            <div className="flex-1">
              <div className="h-[14px] w-[60%] rounded-6 bg-[#E7E4D6]" />
              <div className="h-[12px] w-[40%] mt-[8px] rounded-6 bg-[#E7E4D6]" />
            </div>
          </div>
          <div className="h-[40px] mt-[18px] rounded-[8px] bg-[#E7E4D6]" />
        </div>
      ))}
    </div>
  );
}
