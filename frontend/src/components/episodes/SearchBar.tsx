'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex-1 min-w-[240px] max-w-[460px] relative"
    >
      <label
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      >
        Search episodes
      </label>
      <Search
        className="absolute left-[16px] top-[14px] w-[20px] h-[20px] text-[#5a5a66]"
        strokeWidth="2"
      />
      <input
        id="q"
        type="search"
        placeholder="Search episodes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[48px] px-[46px] pr-[18px] rounded-full border border-[#c9c5b0] bg-[#ffffff] font-sans text-[#14140a] text-[16px] placeholder:text-[#5a5a66] focus:outline-none"
      />
    </form>
  );
}
