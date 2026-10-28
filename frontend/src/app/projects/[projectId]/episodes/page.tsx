'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { useChannel } from '@/hooks/useChannels';
import { useEpisodes } from '@/hooks/useEpisodes';
import { useCreateEpisode } from '@/hooks/useEpisodes';
import EpisodeRow from '@/components/episodes/EpisodeRow';
import EpisodeRowSkeleton from '@/components/episodes/EpisodeRowSkeleton';
import EpisodesEmpty from '@/components/episodes/EpisodesEmpty';
import SearchBar from '@/components/episodes/SearchBar';
import EpisodesPagination from '@/components/episodes/EpisodesPagination';
import AddEpisodeDialog from '@/components/episodes/AddEpisodeDialog';
import type { EpisodeListItem } from '@/lib/types';

const PAGE_SIZE = 10;

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function EpisodesPage() {
  const { projectId } = useParams() as { projectId: string };
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<'default' | 'error' | 'adding'>('default');
  const [dialogError, setDialogError] = useState<string | undefined>(undefined);
  const [dialogUrl, setDialogUrl] = useState('');

  const {
    data: channel,
    isLoading: channelLoading,
  } = useChannel(projectId);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useEpisodes({
    channel: projectId,
    search: searchQuery || undefined,
    page,
    page_size: PAGE_SIZE,
  });

  const episodes: EpisodeListItem[] = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const hasSearchResults = Boolean(searchQuery);
  const isEmpty = !isLoading && !isError && episodes.length === 0;
  const isRetrying = false;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const createMutation = useCreateEpisode();

  const handleAddEpisode = useCallback(
    (youtubeUrl: string) => {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        setDialogVariant('error');
        setDialogError("We couldn't find that video. Check the link and try again.");
        return;
      }
      setDialogVariant('adding');
      createMutation.mutate(
        { channelId: projectId, videoId },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setDialogVariant('default');
          setDialogError(undefined);
            setDialogUrl('');
            refetch();
          },
          onError: () => {
            setDialogVariant('error');
            setDialogError("We couldn't add that episode. Try again later.");
          },
        }
      );
    },
    [projectId, createMutation, refetch]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  if (channelLoading) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div className="h-10 w-64 bg-[#e7e4d6] rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EpisodeRowSkeleton />
          <EpisodeRowSkeleton />
        </div>
      </div>
    );
  }

  const channelName = channel?.channel_title || 'this channel';
  const podcastTitle = channel?.podcast_title || channel?.channel_title || 'Untitled';

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-20 text-center">
        <div className="size-20 rounded-full bg-[#f65858]/10 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="size-10 text-[#8a1c1c]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-[#14140a] mb-2">
          Failed to load episodes
        </h2>
        <p className="text-[#5a5a66] mb-8 text-sm">
          We couldn't load the episodes for this project. Try again in a moment.
        </p>
        <button
          onClick={() => refetch()}
          className="min-h-[48px] px-[24px] rounded-6 bg-[#c8f135] text-[#403e0a] font-bold text-[15px] cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <AddEpisodeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDialogVariant('default');
          setDialogError(undefined);
          setDialogUrl('');
        }}
        variant={dialogVariant}
        errorMessage={dialogError}
        youtubeUrl={dialogUrl}
        setYoutubeUrl={setDialogUrl}
        onAdd={handleAddEpisode}
        isAdding={dialogVariant === 'adding'}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-[14px] mb-[20px]">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={() => setPage(1)}
        />
        <div className="font-mono text-[12px] tracking-wider uppercase text-[#5a5a66]">
          {totalCount} episode{totalCount !== 1 ? 's' : ''}
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-[8px] min-h-[48px] px-[22px] rounded-6 bg-[#c8f135] text-[#403e0a] font-bold text-[16px] cursor-pointer"
        >
          <Plus className="w-[18px] h-[18px]" strokeWidth="2.5" />
          Add episode
        </button>
      </div>

      {/* Episode list */}
      <ul
        aria-label="Episodes"
        className="list-none m-0 p-0 flex flex-col gap-[12px]"
      >
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <EpisodeRowSkeleton key={i} />
          ))
        ) : isEmpty ? (
          <li>
            <EpisodesEmpty
              channelName={channelName}
              searchQuery={hasSearchResults ? searchQuery : undefined}
              onAdd={() => setDialogOpen(true)}
              onClear={handleClearSearch}
            />
          </li>
        ) : (
          episodes.map((episode) => (
            <EpisodeRow key={episode.id} episode={episode} />
          ))
        )}
      </ul>

      {/* Pagination (only when not empty/searching) */}
      {!isEmpty && !hasSearchResults && totalCount > PAGE_SIZE && (
        <EpisodesPagination
          page={page}
          pageCount={pageCount}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
        />
      )}
    </div>
  );
}
