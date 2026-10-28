'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  Play,
  RefreshCw,
  X,
  Loader2,
  Circle,
} from 'lucide-react';
import { useRetryEpisode } from '@/hooks/useEpisodes';
import type { EpisodeListItem } from '@/lib/types';

type EpisodeStatus = EpisodeListItem['processing_status'];

interface EpisodeRowProps {
  episode: EpisodeListItem;
  retryCount?: number;
}

const STATUS_BADGE: Record<EpisodeStatus, { bg: string; color: string; border?: string; label: string }> = {
  queued: {
    bg: 'bg-[#f5f1e0]',
    color: 'text-[#403e0a]',
    border: 'border border-[#c9c5b0]',
    label: 'Queued',
  },
  processing: {
    bg: 'bg-[#e0f6ff]',
    color: 'text-[#403e0a]',
    label: 'Processing',
  },
  done: {
    bg: 'bg-[#f0fbc9]',
    color: 'text-[#403e0a]',
    label: 'Published',
  },
  failed: {
    bg: 'bg-[#ffe9e9]',
    color: 'text-[#8a1c1c]',
    border: 'border border-[#f65858]',
    label: 'Failed',
  },
  skipped: {
    bg: 'bg-[#f5f1e0]',
    color: 'text-[#5a5a66]',
    label: 'Skipped',
  },
};

function ThumbnailPlaceholder({ episode }: { episode: EpisodeListItem }) {
  if (episode.thumbnail_url) {
    return (
      <img
        src={episode.thumbnail_url}
        alt={episode.title}
        className="w-22 h-14 rounded-8 object-cover shrink-0"
      />
    );
  }
  // Fallback gradient swatch matching mock
  const hue = episode.id.length % 3;
  const grad =
    hue === 0
      ? 'linear-gradient(135deg,#a6e9ff,#b9a4f2)'
      : hue === 1
        ? 'linear-gradient(135deg,#ffc2de,#c8f135)'
        : 'linear-gradient(135deg,#b9a4f2,#ffc2de)';
  return (
    <div
      className="w-22 h-14 rounded-8 shrink-0"
      style={{ background: grad }}
    />
  );
}

export default function EpisodeRow({ episode, retryCount = 0 }: EpisodeRowProps) {
  const retryMutation = useRetryEpisode();
  const status = STATUS_BADGE[episode.processing_status];
  const isFailed = episode.processing_status === 'failed';
  const isPublished = episode.processing_status === 'done';
  const isProcessing = episode.processing_status === 'processing';
  const isQueued = episode.processing_status === 'queued';
  const isRetrying = retryMutation.isPending;

  const retriesUsed = isFailed ? Math.min(retryCount, 3) : 0;

  const handleRetry = () => {
    retryMutation.mutate(episode.id);
  };

  const dateText = episode.pub_date
    ? format(new Date(episode.pub_date), 'MMM d, yyyy')
    : episode.youtube_pub_date
      ? format(new Date(episode.youtube_pub_date), 'MMM d, yyyy')
      : '—';

  const metaText = isRetrying && isFailed
    ? 'Re-queuing…'
    : isProcessing
      ? 'Extracting audio'
      : isQueued
        ? 'Waiting in line'
        : isFailed && retriesUsed > 0
          ? `Audio extraction failed. Retry ${retriesUsed} of 3 used.`
          : `${dateText} · ${episode.duration_formatted || '—'}`;

  return (
    <li
      className="flex flex-wrap items-center gap-3 px-4 py-3.5 rounded-[14px] border border-[#e7e4d6] bg-[#ffffff] transition-colors hover:border-primary/20"
      style={{
        borderColor: isFailed ? '#f65858' : '#e7e4d6',
      }}
    >
      <ThumbnailPlaceholder episode={episode} />

      <div className="flex-1 min-w-[200px]">
        <p className="font-semibold text-[#14140a]">{episode.title}</p>
        <p className="mt-[3px] text-xs font-mono tracking-wider uppercase text-[#5a5a66]">
          {metaText}
        </p>
      </div>

      <span
        className={`inline-flex items-center gap-[6px] px-3 py-1 rounded-full text-[13px] font-bold ${status.bg} ${status.color} ${status.border ?? ''}`}
      >
        {isProcessing && (
          <Loader2 className="w-3 h-3 animate-spin" strokeWidth="2.5" />
        )}
        {isQueued && (
          <Circle className="w-3 h-3" stroke="#403e0a" strokeWidth="2" fill="none" />
        )}
        {isFailed && (
          <X className="w-3 h-3" stroke="#8a1c1c" strokeWidth="2" />
        )}
        {status.label}
      </span>

      {isPublished && episode.audio_url ? (
        <button
          type="button"
          aria-label={`Play ${episode.title}`}
          className="inline-flex items-center gap-[8px] min-h-[44px] px-5 py-0 rounded-6 bg-[#403e0a] text-[#ffffff] text-sm font-bold cursor-pointer"
        >
          <Play className="w-4 h-4" stroke="currentColor" strokeWidth="2.5" />
          Play
        </button>
      ) : isFailed ? (
        <button
          type="button"
          aria-label={`Retry ${episode.title}`}
          onClick={handleRetry}
          disabled={retryMutation.isPending}
          className={`inline-flex items-center gap-[8px] min-h-[44px] px-5 py-0 rounded-6 border border-[#403e0a] bg-transparent text-[#403e0a] text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${retryMutation.isPending ? 'cursor-not-allowed' : ''}`}
        >
          {retryMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" stroke="#403e0a" strokeWidth="2.5" />
          ) : (
            <RefreshCw className="w-4 h-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {retryMutation.isPending ? 'Retrying…' : 'Retry'}
        </button>
      ) : null}
    </li>
  );
}
