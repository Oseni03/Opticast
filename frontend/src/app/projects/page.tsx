"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ChannelCard,
  EmptyState,
  KpiCard,
  LimitState,
  ProjectSkeleton,
} from "@/components/projects/cards";
import { useOverviewStats } from "@/hooks/useAnalytics";
import { useMe } from "@/hooks/useAuth";
import { useChannels } from "@/hooks/useChannels";

const headerActions = () => (
  <>
    <Link
      href="/projects/new"
      className="inline-flex items-center gap-[8px] min-h-[50px] rounded-6 bg-[#C8F135] text-[#403E0A] text-decoration-none font-body font-bold text-[16px] cursor-pointer"
      style={{ padding: "0 24px" }}
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
    </Link>
  </>
);

const disabledNewProject = () => (
  <button
    type="button"
    disabled
    className="inline-flex items-center gap-[8px] min-h-[50px] rounded-6 bg-[#E7E4D6] text-[#5A5A66] font-body font-bold text-[16px] cursor-not-allowed"
    style={{ padding: "0 24px" }}
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
);

export default function ProjectsPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const { data: stats, isLoading: statsLoading } = useOverviewStats();

  // Redirect if account setup is incomplete
  useEffect(() => {
    if (!meLoading && me) {
      const isTosAccepted = !!me.tos_accepted_at;
      const isYouTubeConnected = !!me.has_youtube_connected;

      if (!isTosAccepted || !isYouTubeConnected) {
        router.push("/onboarding");
      }
    }
  }, [me, meLoading, router]);

  const isYouTubeConnected = me?.has_youtube_connected ?? false;
  const channelLimit = me?.channel_limit ?? 1;
  const connectedChannels = channels?.length ?? 0;
  const channelLimitReached = connectedChannels >= channelLimit;

  const totalDownloads = stats?.total_downloads ?? 0;
  const totalEpisodes = stats?.total_episodes ?? 0;
  const totalChannels = stats?.total_channels ?? connectedChannels;

  const loading = meLoading || channelsLoading || statsLoading;

  const pageHeader = (
    <div className="flex flex-wrap items-end justify-between gap-[16px] mb-[32px]">
      <div>
        <h1
          className="m-0 font-display font-black text-[clamp(34px,4.5vw,52px)] tracking-[-0.045em] text-[#14140A] leading-none"
          style={{ letterSpacing: "-0.045em" }}
        >
          Projects
        </h1>
        <p className="mt-[8px] text-[17px] text-[#5A5A66]">
          Your connected channels and their podcasts.
        </p>
      </div>
      {isYouTubeConnected ? headerActions() : disabledNewProject()}
    </div>
  );

  const kpiSection = (
    <section
      aria-label="Overview"
      className="mt-[32px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]"
    >
      <KpiCard label="Total downloads" value={totalDownloads} color="#C8F135" />
      <KpiCard
        label="Episodes published"
        value={totalEpisodes}
        color="#B9A4F2"
      />
      <KpiCard
        label="Channels"
        value={`${totalChannels} of ${channelLimit}`}
        color="#A6E9FF"
        hasBar
        barValue={totalChannels}
        barMax={channelLimit}
      />
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[1200px] mx-auto">{pageHeader}</div>
        {kpiSection}
        <ProjectSkeleton count={3} />
      </div>
    );
  }

  if (connectedChannels === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[1200px] mx-auto">{pageHeader}</div>
        {kpiSection}
        <h2
          className="mt-[48px] mb-[20px] font-display font-bold text-[28px] tracking-[-0.035em] text-[#14140A]"
          style={{ letterSpacing: "-0.035em" }}
        >
          Your channels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          <EmptyState onCreate={() => router.push("/projects/new")} />
        </div>
      </div>
    );
  }

  if (channelLimitReached) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[1200px] mx-auto">{pageHeader}</div>
        {kpiSection}
        <LimitState
          limit={channelLimit}
          connected={connectedChannels}
          onUpgrade={() => router.push("/projects/settings")}
        />
      </div>
    );
  }

  // Normal state: show channel cards
  return (
    <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
      <div className="max-w-[1200px] mx-auto">{pageHeader}</div>
      {kpiSection}
      <h2
        className="mt-[48px] mb-[20px] font-display font-bold text-[28px] tracking-[-0.035em] text-[#14140A]"
        style={{ letterSpacing: "-0.035em" }}
      >
        Your channels
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {channels?.map((channel, i) => (
          <ChannelCard key={channel.id} channel={channel} channelIndex={i} />
        ))}
        <Link
          href="/projects/new"
          className="min-h-[240px] p-[22px] rounded-[16px] border border-[2px] border-[#C9C5B0] flex flex-col items-center justify-center gap-[10px] text-center text-decoration-none text-[#14140A]"
          style={{ padding: "22px" }}
        >
          <span
            className="flex items-center justify-center size-[48px] rounded-full bg-[#C8F135]"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#C8F135",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#403E0A"
              strokeWidth={2.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span
            className="font-display font-bold text-[20px] tracking-[-0.025em]"
            style={{ letterSpacing: "-0.025em" }}
          >
            New project
          </span>
          <span className="text-[14px] text-[#5A5A66]">
            Connect another YouTube channel
          </span>
        </Link>
      </div>
    </div>
  );
}
