'use client';

export default function EpisodeRowSkeleton() {
  return (
    <li
      className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] border border-[#e7e4d6] bg-[#ffffff] animate-pulse"
    >
      <div className="w-22 h-14 rounded-8 bg-[#e7e4d6] shrink-0" />
      <div className="flex-1 min-w-[200px] space-y-2">
        <div className="h-[18px] w-3/4 bg-[#e7e4d6] rounded" />
        <div className="h-[14px] w-1/2 bg-[#e7e4d6]/60 rounded" />
      </div>
      <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#f5f1e0] text-[#5a5a66] border border-[#c9c5b0]">
        Queued
      </span>
      <div className="w-24 h-[44px] rounded-6 bg-[#e7e4d6]" />
    </li>
  );
}
