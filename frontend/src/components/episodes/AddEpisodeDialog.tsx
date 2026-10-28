'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

type AddEpisodeVariant = 'default' | 'error' | 'adding';

interface AddEpisodeDialogProps {
  open: boolean;
  onClose: () => void;
  variant?: AddEpisodeVariant;
  errorMessage?: string;
  youtubeUrl: string;
  setYoutubeUrl: (value: string) => void;
  onAdd: (youtubeUrl: string) => void;
  isAdding: boolean;
}

export default function AddEpisodeDialog({
  open,
  onClose,
  variant = 'default',
  errorMessage,
  youtubeUrl,
  setYoutubeUrl,
  onAdd,
  isAdding,
}: AddEpisodeDialogProps) {
  const isDisabled = isAdding || !youtubeUrl.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    onAdd(youtubeUrl);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1e1e2d]/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Add episode"
    >
      <div
        className="w-full max-w-lg p-[28px] rounded-[20px] bg-[#ffffff] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-start justify-between gap-[12px]">
          <h2
            className="m-0 font-display font-bold text-[#14140a] text-[24px] leading-tight"
            style={{ letterSpacing: '-0.035em' }}
          >
            Add episode
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#f5f1e0] text-[#14140a] cursor-pointer"
          >
            <X className="w-[18px] h-[18px]" strokeWidth="2.5" />
          </button>
        </div>

        <p className="mt-[6px] text-[#5a5a66] text-[15px] leading-1.5">
          Paste a YouTube video link. We'll fetch its details and extract the audio.
        </p>

        {variant === 'error' && errorMessage && (
          <div
            role="alert"
            className="mt-[14px] flex items-start gap-[10px] px-[12px] py-[14px] rounded-[10px] border border-[#f65858] bg-[#ffe9e9] text-[#8a1c1c] text-xs leading-1.4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="flex-none mt-[1px]"
            >
              <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form id="add-episode-form" onSubmit={handleSubmit}>
          <div className="mt-[16px] flex flex-col gap-[6px]">
            <label
              htmlFor="youtube-link"
              className="font-bold text-[#14140a] text-[15px]"
            >
              YouTube video link
            </label>
            <input
              id="youtube-link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=…"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className={`min-h-[52px] px-[18px] rounded-[10px] font-sans text-[16px] focus:outline-none ${
                variant === 'error'
                  ? 'border-2 border-[#f65858]'
                  : 'border border-[#c9c5b0]'
              }`}
              aria-invalid={variant === 'error' ? 'true' : 'false'}
            />
          </div>

          <div className="mt-[20px] flex flex-wrap gap-[10px] justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isAdding}
              className="min-h-[48px] px-[22px] rounded-6 border border-[#c9c5b0] bg-transparent text-[#14140a] font-bold text-[15px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className={`min-h-[48px] px-[24px] rounded-6 font-bold text-[15px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdding
                  ? 'bg-[#e7e4d6] text-[#403e0a]'
                  : 'bg-[#c8f135] text-[#403e0a]'
              }`}
            >
              {isAdding ? (
                <>
                  <Loader2
                    className="w-[18px] h-[18px] animate-spin"
                    stroke="#403e0a"
                    strokeWidth="3"
                  />
                  Adding…
                </>
              ) : (
                'Add episode'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
