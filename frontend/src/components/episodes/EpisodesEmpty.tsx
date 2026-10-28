'use client';

import { Play, Search } from 'lucide-react';

interface EpisodesEmptyProps {
  channelName?: string;
  searchQuery?: string;
  onAdd?: () => void;
  onClear?: () => void;
}

export default function EpisodesEmpty({
  channelName,
  searchQuery,
  onAdd,
  onClear,
}: EpisodesEmptyProps) {
  const hasSearch = Boolean(searchQuery);

  return (
    <div
      className="px-4 py-[28px] rounded-[16px] border-2 border-[#c9c5b0] bg-[#ffffff] text-center"
    >
      <h2
        className="m-0 font-display font-bold text-[#14140a] text-[22px] leading-tight"
        style={{ letterSpacing: '-0.035em' }}
      >
        {hasSearch ? `Nothing matches “${searchQuery}”` : 'No episodes yet'}
      </h2>
      <p
        className="mt-[8px] mx-auto max-w-[340px] text-[#5a5a66] text-[15px] leading-1.5"
      >
        {hasSearch
          ? 'Check the spelling or try a shorter search.'
          : `New uploads on ${channelName || 'this channel'} show up here automatically. You can also add an older video by hand.`}
      </p>
      {hasSearch ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-[16px] min-h-[46px] px-[22px] rounded-6 border border-[#403e0a] bg-transparent text-[#403e0a] font-bold text-[15px] cursor-pointer"
        >
          Clear search
        </button>
      ) : onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="mt-[18px] min-h-[46px] px-[22px] rounded-6 bg-[#c8f135] text-[#403e0a] font-bold text-[15px] cursor-pointer"
        >
          Add episode
        </button>
      ) : null}
    </div>
  );
}
