"use client";

import {
  AlertCircle,
  ArrowRight,
  Copy,
  PodcastIcon,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/useAuth";
import {
  useChannels,
  useConnectChannel,
  useUpdateChannel,
  useYouTubeChannels,
} from "@/hooks/useChannels";
import type { Channel, YouTubeChannel } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMe();

  const [step, setStep] = useState<"select-channel" | "setup-podcast">(
    "select-channel",
  );

  const [selectedChannel, setSelectedChannel] = useState<YouTubeChannel | null>(
    null,
  );
  const [createdChannel, setCreatedChannel] = useState<Channel | null>(null);

  const [podcastTitle, setPodcastTitle] = useState("");
  const [podcastDescription, setPodcastDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: channels } = useChannels();
  const {
    data: ytChannels,
    isLoading: isLoadingYT,
    refetch: refetchYT,
  } = useYouTubeChannels();
  const connectChannel = useConnectChannel();
  const updateChannel = useUpdateChannel();

  // Redirect if account setup is incomplete or limit reached
  useEffect(() => {
    if (!userLoading && user) {
      const isTosAccepted = !!user.tos_accepted_at;
      const isYouTubeConnected = !!user.has_youtube_connected;
      const limitReached = channels && channels.length >= user.channel_limit;

      if (!isTosAccepted || !isYouTubeConnected) {
        router.push("/onboarding");
      } else if (limitReached && step === "select-channel") {
        toast.error("Channel limit reached. Please upgrade your plan.");
        router.push("/projects");
      }
    }
  }, [user, userLoading, channels, step, router]);

  const connecting = connectChannel.isPending;
  const limitReached =
    user && channels && channels.length >= user.channel_limit;

  const handleConnectChannel = async (channel: YouTubeChannel) => {
    setError(null);
    try {
      const result = await connectChannel.mutateAsync(channel.id);
      setCreatedChannel(result);
      setPodcastTitle(result.podcast_title || result.channel_title);
      setPodcastDescription(
        result.podcast_description || result.channel_description,
      );
      setStep("setup-podcast");
      toast.success("Channel connected!");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to connect channel";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    if (selectedChannel) {
      handleConnectChannel(selectedChannel);
    } else {
      refetchYT();
    }
  };

  const handleUpdateRSS = async () => {
    if (!createdChannel) return;
    setError(null);
    try {
      await updateChannel.mutateAsync({
        id: createdChannel.id,
        data: {
          podcast_title: podcastTitle,
          podcast_description: podcastDescription,
        },
      });
      toast.success("Project created successfully!");
      router.push(`/projects/${createdChannel.id}`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update podcast feed";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] flex items-center justify-center p-6">
        <RefreshCcw className="animate-spin size-8 text-[#403E0A]" />
      </div>
    );
  }

  const pageHeader = (
    <nav
      aria-label="Breadcrumb"
      className="text-[14px] text-[#5A5A66] mb-[24px]"
    >
      <Link
        href="/projects"
        className="text-[#5B3FD6] font-bold underline-offset-4 hover:underline"
      >
        Projects
      </Link>{" "}
      <span className="mx-[4px]">/</span> New project
    </nav>
  );

  const stepper = (active: 1 | 2) => (
    <ol
      aria-label="Progress"
      className="list-none m-0 p-0 flex flex-wrap items-center justify-center gap-[12px] gap-y-[14px] mb-[28px]"
    >
      <li
        className="flex items-center gap-[10px]"
        aria-current={active === 1 ? "step" : undefined}
        aria-hidden={active !== 1 ? "true" : undefined}
      >
        <div
          className="flex items-center justify-center size-[36px] rounded-full font-display font-black text-[16px]"
          style={{
            backgroundColor: active === 1 ? "#C8F135" : "transparent",
            color: active === 1 ? "#403E0A" : "#5A5A66",
            border: active === 1 ? undefined : "2px solid #C9C5B0",
          }}
        >
          {active === 1 ? "1" : undefined}
        </div>
        <span
          className={`
            font-bold text-[15px]
            ${active === 1 ? "text-[#14140A]" : "text-[#5A5A66]"}
          `}
        >
          Choose channel
        </span>
      </li>

      {active === 2 ? (
        <div
          className="w-[40px] h-[2px]"
          style={{ backgroundColor: "#C9C5B0" }}
        />
      ) : (
        <div
          className="w-[40px] h-[2px]"
          style={{ backgroundColor: "#403E0A" }}
        />
      )}

      <li
        className="flex items-center gap-[10px]"
        aria-current={active === 2 ? "step" : undefined}
        aria-hidden={active !== 2 ? "true" : undefined}
      >
        <div
          className="flex items-center justify-center size-[36px] rounded-full font-display font-black text-[16px]"
          style={{
            backgroundColor: active === 2 ? "#C8F135" : "transparent",
            color: active === 2 ? "#403E0A" : "#5A5A66",
            border: active === 2 ? undefined : "2px solid #C9C5B0",
          }}
        >
          {active === 2 ? "2" : undefined}
        </div>
        <span
          className={`
            font-bold text-[15px]
            ${active === 2 ? "text-[#14140A]" : "text-[#5A5A66]"}
          `}
        >
          Podcast details
        </span>
      </li>
    </ol>
  );

  // ── Loading your YouTube channels ──
  if (isLoadingYT) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[760px] mx-auto">
          {pageHeader}
          {stepper(1)}
          <form onSubmit={() => false}>
            <h1
              className="m-0 font-display font-black text-[clamp(30px,4vw,42px)] tracking-[-0.045em] leading-none text-[#14140A]"
              style={{ letterSpacing: "-0.045em" }}
            >
              Choose a YouTube channel
            </h1>
            <p className="mt-[10px] text-[17px] leading-1.5 text-[#5A5A66]">
              Pick the channel to turn into a podcast. We confirm you own it
              through YouTube.
            </p>
            <fieldset
              className="mt-[28px] p-0 border-0 flex flex-col gap-[12px]"
              style={{ marginTop: "28px", padding: 0, border: 0 }}
            >
              <legend className="sr-only">YouTube channels</legend>
              <div className="flex flex-col gap-[14px]">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex align-center gap-[16px] p-[14px]_p-[18px] rounded-[14px] bg-[#FFFFFF] border border-[1.5px] border-[#E7E4D6] animate-pulse"
                  >
                    <div className="size-[22px] rounded-full bg-[#E7E4D6]" />
                    <div className="size-[48px] rounded-full bg-[#E7E4D6]" />
                    <div className="flex-1">
                      <div className="h-[14px] w-[55%] rounded-6 bg-[#E7E4D6]" />
                      <div className="h-[12px] w-[30%] mt-[8px] rounded-6 bg-[#E7E4D6]" />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }

  // ── No YouTube channel found ──
  if (!ytChannels || ytChannels.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[760px] mx-auto">
          {pageHeader}
          {stepper(1)}
          <div
            className="p-[28px] rounded-[16px] bg-[#FFFFFF] border border-[2px] border-[#C9C5B0] text-center"
            style={{ padding: "28px" }}
          >
            <h2
              className="m-0 font-display font-black text-[22px] tracking-[-0.035em] text-[#14140A]"
              style={{ letterSpacing: "-0.035em" }}
            >
              No YouTube channel found
            </h2>
            <p className="mt-[8px] mx-auto max-w-[340px] text-[15px] leading-1.5 text-[#5A5A66]">
              The Google account you linked doesn&apos;t have a YouTube channel
              we can use.
            </p>
            <Link
              href="/projects"
              className="mt-[16px] inline-flex items-center min-h-[46px] px-0 py-0 rounded-6 bg-[#403E0A] text-[#FFFFFF] text-decoration-none font-body font-bold text-[15px] cursor-pointer"
              style={{ padding: "0 20px" }}
            >
              Back to projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Connecting / verifying ──
  if (connecting) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[760px] mx-auto">
          {pageHeader}
          {stepper(1)}
          <section
            className="p-[22px] rounded-[16px] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(30,30,45,0.08)]"
            style={{ padding: "22px" }}
          >
            <div
              className="flex align-center gap-[14px] p-[12px]_p-[14px] rounded-[12px] border border-[2px] border-[#403E0A]"
              style={{
                padding: "12px 14px",
                border: "2px solid #403E0A",
              }}
            >
              <div
                className="size-[44px] rounded-full"
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg,#C8F135,#A6E9FF)",
                  flex: "none",
                }}
              />
              <span className="font-bold text-[16px]">
                {selectedChannel?.title || "[Channel name]"}
              </span>
            </div>
            <Button
              disabled
              className="mt-[16px] w-full min-h-[52px] flex align-center justify-center gap-[10px] rounded-6 bg-[#E7E4D6] text-[#403E0A] font-body font-bold text-[16px]"
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
              Verifying channel ownership…
            </Button>
          </section>
        </div>
      </div>
    );
  }

  // ── Verification or limit error ──
  if (error || limitReached) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[760px] mx-auto">
          {pageHeader}
          {stepper(1)}
          <section
            className="p-[22px] rounded-[16px] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(30,30,45,0.08)] flex flex-col gap-[12px]"
            style={{ padding: "22px" }}
          >
            {error && (
              <div
                role="alert"
                className="flex align-flex-start gap-[10px] p-[12px]_p-[14px] rounded-[10px] border border-[1.5px] border-[#F65858] bg-[#FFE9E9] text-[#8A1C1C] text-[14px] leading-1.4"
                style={{
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  border: "1.5px solid #F65858",
                  backgroundColor: "#FFE9E9",
                  color: "#8A1C1C",
                }}
              >
                <AlertCircle
                  className="size-[20px] mt-[1px] shrink-0"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <span>
                  We couldn&apos;t confirm you own this channel. Choose another
                  channel or try again.
                </span>
              </div>
            )}
            {limitReached && !error && (
              <div
                role="alert"
                className="flex align-flex-start gap-[10px] p-[12px]_p-[14px] rounded-[10px] border border-[1.5px] border-[#F65858] bg-[#FFE9E9] text-[#8A1C1C] text-[14px] leading-1.4"
                style={{
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  border: "1.5px solid #F65858",
                  backgroundColor: "#FFE9E9",
                  color: "#8A1C1C",
                }}
              >
                <AlertCircle
                  className="size-[20px] mt-[1px] shrink-0"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <span>
                  You&apos;ve reached your plan&apos;s channel limit.{" "}
                  <Link
                    href="/projects/settings"
                    className="text-[#8A1C1C] font-bold underline-offset-4 hover:underline"
                  >
                    Upgrade plan
                  </Link>
                </span>
              </div>
            )}
            <Button
              type="button"
              onClick={handleTryAgain}
              className="min-h-[50px] rounded-6 bg-[#C8F135] text-[#403E0A] font-body font-bold text-[15px] cursor-pointer"
              style={{ padding: "0 22px" }}
            >
              Try again
            </Button>
          </section>
        </div>
      </div>
    );
  }

  // ── Step 1: Choose channel ──
  if (step === "select-channel") {
    return (
      <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
        <div className="max-w-[760px] mx-auto">
          {pageHeader}
          {stepper(1)}
          <form onSubmit={(e) => e.preventDefault()}>
            <h1
              className="m-0 font-display font-black text-[clamp(30px,4vw,42px)] tracking-[-0.045em] leading-none text-[#14140A]"
              style={{ letterSpacing: "-0.045em" }}
            >
              Choose a YouTube channel
            </h1>
            <p className="mt-[10px] text-[17px] leading-1.5 text-[#5A5A66]">
              Pick the channel to turn into a podcast. We confirm you own it
              through YouTube.
            </p>

            <fieldset
              className="mt-[28px] p-0 border-0 flex flex-col gap-[12px]"
              style={{ marginTop: "28px", padding: 0, border: 0 }}
            >
              <legend className="sr-only">YouTube channels</legend>
              {ytChannels.map((channel) => {
                const isSelected = selectedChannel?.id === channel.id;
                return (
                  <label
                    key={channel.id}
                    className="flex align-center gap-[16px] min-h-[76px] p-[14px]_p-[18px] rounded-[14px] bg-[#FFFFFF] border border-[1.5px] border-[#C9C5B0] cursor-pointer transition-all"
                    style={{
                      borderColor: isSelected ? "#403E0A" : "#C9C5B0",
                      backgroundColor: isSelected
                        ? "linear-gradient(135deg,#C8F135,#A6E9FF)"
                        : "#FFFFFF",
                    }}
                  >
                    <input
                      type="radio"
                      name="yt"
                      checked={isSelected}
                      onChange={() => setSelectedChannel(channel)}
                      className="shrink-0 size-[22px] mt-0"
                      style={{ accentColor: "#403E0A" }}
                    />
                    <span
                      className="size-[48px] rounded-full shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "linear-gradient(135deg,#B9A4F2,#FFC2DE)",
                        flex: "none",
                      }}
                    />
                    <span className="flex-1 min-w-0">
                      <span
                        className="block font-bold text-[17px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={channel.title}
                      >
                        {channel.title}
                      </span>
                      <span className="block text-[14px] text-[#5A5A66]">
                        YouTube channel
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div
              className="mt-[28px] flex flex-wrap gap-[12px] justify-end"
              style={{ marginTop: "28px" }}
            >
              <Link
                href="/projects"
                className="inline-flex align-center min-h-[52px] px-0 py-0 rounded-6 border border-[1.5px] border-[#C9C5B0] text-[#14140A] text-decoration-none font-body font-bold text-[16px] cursor-pointer"
                style={{ padding: "0 24px" }}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={!selectedChannel || connectChannel.isPending}
                onClick={() =>
                  selectedChannel && handleConnectChannel(selectedChannel)
                }
                className="min-h-[52px] px-0 py-0 rounded-6 bg-[#C8F135] text-[#403E0A] font-body font-bold text-[16px] cursor-pointer"
                style={{ padding: "0 28px" }}
              >
                {connecting ? (
                  <span className="flex align-center gap-[2]">Connecting…</span>
                ) : (
                  <span className="flex align-center gap-[2]">
                    Connect channel
                    <ArrowRight className="size-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Step 2: Podcast details ──
  return (
    <div className="min-h-screen bg-[#F5F1E0] text-[#14140A] p-6 md:p-12">
      <div className="max-w-[760px] mx-auto">
        {pageHeader}
        {stepper(2)}
        {createdChannel && (
          <output
            className="flex align-center gap-[12px] p-[14px]_p-[16px] rounded-[12px] bg-[#F0FBC9] border border-[1.5px] border-[#C9E65A]"
            style={{
              padding: "14px 16px",
              border: "1.5px solid #C9E65A",
              backgroundColor: "#F0FBC9",
            }}
          >
            <span
              className="size-[40px] rounded-full shrink-0"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg,#C8F135,#A6E9FF)",
                flex: "none",
              }}
            />
            <div className="min-w-0">
              <p
                className="m-0 font-bold text-[15px]"
                title={createdChannel.channel_title}
              >
                {createdChannel.channel_title} is connected
              </p>
              <p className="mt-[2px] text-[14px] text-[#403E0A]">
                New uploads will be picked up automatically.
              </p>
            </div>
          </output>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <h1
            className="m-0 mt-[28px] font-display font-black text-[clamp(30px,4vw,42px)] tracking-[-0.045em] leading-none text-[#14140A]"
            style={{ letterSpacing: "-0.045em", marginTop: "28px" }}
          >
            Set up your podcast
          </h1>
          <p className="mt-[10px] text-[17px] leading-1.5 text-[#5A5A66]">
            This is how your show appears in podcast apps.
          </p>

          <div
            className="mt-[24px] p-[28px] rounded-[20px] bg-[#FFFFFF] shadow-[0_4px_18px_rgba(30,30,45,0.10)]"
            style={{ marginTop: "24px", padding: "28px" }}
          >
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="pt" className="font-bold text-[15px]">
                Podcast title
              </Label>
              <Input
                id="pt"
                value={podcastTitle}
                onChange={(e) => setPodcastTitle(e.target.value)}
                placeholder="[Podcast title]"
                className="min-h-[52px] px-0 py-0 rounded-[10px] border border-[1.5px] border-[#C9C5B0] bg-[#FFFFFF] font-body text-[16px] text-[#14140A]"
                style={{ padding: "0 18px" }}
              />
            </div>

            <div className="mt-[18px] flex flex-col gap-[6px]">
              <Label htmlFor="pd" className="font-bold text-[15px]">
                Description
              </Label>
              <Textarea
                id="pd"
                value={podcastDescription}
                onChange={(e) => setPodcastDescription(e.target.value)}
                rows={5}
                placeholder="Tell listeners what your show is about."
                className="px-0 py-0 rounded-[10px] border border-[1.5px] border-[#C9C5B0] bg-[#FFFFFF] font-body text-[16px] text-[#14140A] resize-vertical"
                style={{ padding: "14px 18px" }}
              />
            </div>

            <div className="mt-[18px]">
              <p className="m-0 mb-[6px] font-bold text-[15px]">Feed address</p>
              <div
                className="flex align-center gap-[10px] p-[6px]_p-[6px]_p-[6px]_p-[18px] rounded-[10px] bg-[#F5F1E0]"
                style={{ padding: "6px 6px 6px 18px" }}
              >
                <span
                  className="flex-1 min-w-0 font-mono text-[13px] text-[#14140A] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={createdChannel?.rss_slug || ""}
                >
                  {createdChannel?.rss_slug || "[feed-slug]"}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="size-[44px] rounded-[8px] bg-[#FFFFFF] text-[#14140A] cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      createdChannel?.rss_slug || "",
                    );
                    toast.success("Feed address copied");
                  }}
                >
                  <Copy className="size-[18px]" />
                </Button>
              </div>
              <p className="mt-[6px] text-[13px] text-[#5A5A66]">
                Generated for you when the channel was connected.
              </p>
            </div>
          </div>

          <div
            className="mt-[28px] flex flex-wrap gap-[12px] justify-end"
            style={{ marginTop: "28px" }}
          >
            <Button
              type="submit"
              disabled={!podcastTitle || updateChannel.isPending}
              onClick={handleUpdateRSS}
              className="min-h-[52px] px-0 py-0 rounded-6 bg-[#C8F135] text-[#403E0A] font-body font-bold text-[16px] cursor-pointer"
              style={{ padding: "0 28px" }}
            >
              {updateChannel.isPending ? (
                "Finalizing…"
              ) : (
                <span className="flex align-center gap-[2]">
                  Save and open project
                  <PodcastIcon className="size-5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
