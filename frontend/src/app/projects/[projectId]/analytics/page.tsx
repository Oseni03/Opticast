'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useChannel } from '@/hooks/useChannels';
import {
  useOverviewStats,
  useDownloadTimeseries,
  useEpisodeStats,
} from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  PlayCircle,
  TrendingUp,
  Calendar,
  Copy,
  AlertCircle,
} from 'lucide-react';

const CN = {
  primary: '#403E0A',
  primaryHover: '#333208',
  lime: '#C8F135',
  aqua: '#A6E9FF',
  paper: '#F5F1E0',
  coral: '#F65858',
  coralBg: '#FFE9E9',
  coralText: '#8A1C1C',
  indigo: '#5B3FD6',
  dark: '#14140A',
  muted: '#5A5A66',
  mutedSoft: '#9A9AA6',
  border: '#E7E4D6',
  borderSoft: '#C9C5B0',
  surface: '#FFFFFF',
  surfaceLow: '#FFFFFF',
  shadow: '0 2px 12px rgba(30,30,45,0.08)',
} as const;

type Range = '7d' | '30d' | '90d';

const RANGE_LABELS: Record<Range, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

function mono(text: string, className = '') {
  return (
    <span
      className={cn(
        'font-mono text-[11px] tracking-wider uppercase text-muted',
        className
      )}
    >
      {text}
    </span>
  );
}

function StatSkeleton() {
  return (
    <div
      style={{
        padding: '22px',
        borderRadius: '16px',
        background: CN.surfaceLow,
        boxShadow: CN.shadow,
        border: `1px solid ${CN.border}`,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div style={{ height: '12px', width: '70%', borderRadius: '6px', background: '#E7E4D6' }} />
      <div style={{ height: '30px', width: '50%', marginTop: '12px', borderRadius: '6px', background: '#E7E4D6' }} />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div
      style={{
        height: '170px',
        borderRadius: '14px',
        background: '#FFFFFF',
        padding: '18px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div style={{ height: '100%', borderRadius: '8px', background: '#E7E4D6' }} />
    </div>
  );
}

interface TimeseriesPoint {
  day: string;
  count: number;
}

function LineChart({ points }: { points: TimeseriesPoint[] }) {
  if (points.length === 0) return null;

  const width = 1100;
  const height = 280;
  const padding = 60;
  const plotWidth = width - padding * 2;
  const plotHeight = height - 60;

  const maxCount = Math.max(...points.map((p) => p.count), 1);
  const stepX = plotWidth / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (p.count / maxCount) * plotHeight;
    return [x, y] as [number, number];
  });

  const pathD = coords
    .map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`))
    .join(' ');
  const areaD = `${pathD} L${width - padding} ${height - padding} L${padding} ${height - padding} Z`;

  const yTicks = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Line chart of downloads per day"
      style={{ display: 'block', width: '100%', height: 'auto', marginTop: '16px' }}
    >
      <g stroke={CN.border} strokeWidth="1">
        {yTicks.map((v) => {
          const y = height - padding - (v / maxCount) * plotHeight;
          return (
            <line key={v} x1={padding} y1={y} x2={width - padding} y2={y} />
          );
        })}
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="12" fill={CN.muted}>
        {yTicks.map((v) => {
          const y = height - padding - (v / maxCount) * plotHeight;
          return (
            <text key={v} x={padding - 8} y={y + 4} textAnchor="end">
              {v.toLocaleString()}
            </text>
          );
        })}
        {points.map((p, i) => {
          if (i % Math.max(Math.floor(points.length / 2), 1) !== 0 && i !== points.length - 1) return null;
          const x = padding + i * stepX;
          return (
            <text key={i} x={x} y={height - 18} textAnchor={i === points.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'}>
              {p.day}
            </text>
          );
        })}
      </g>
      <path
        d={areaD}
        fill={CN.lime}
        fillOpacity="0.35"
      />
      <path
        d={pathD}
        fill="none"
        stroke={CN.primary}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '32px 28px',
        borderRadius: '16px',
        background: '#FFFFFF',
        border: `2px dashed ${CN.borderSoft}`,
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{icon}</div>
      <h2
        style={{
          margin: '0 0 8px',
          fontFamily: "'Schibsted Grotesk', sans-serif",
          fontWeight: '800',
          fontSize: '22px',
          letterSpacing: '-0.035em',
          color: CN.dark,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: '0 auto',
          maxWidth: '360px',
          fontSize: '15px',
          lineHeight: '1.5',
          color: CN.muted,
        }}
      >
        {description}
      </p>
      {action && (
        <div
          style={{
            margin: '18px auto 0',
            maxWidth: '380px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 6px 6px 16px',
            borderRadius: '10px',
            background: CN.paper,
            textAlign: 'left',
          }}
        >
          {action}
        </div>
      )}
    </div>
  );
}

function RangeToggle({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div
      role="group"
      aria-label="Date range"
      style={{
        display: 'inline-flex',
        gap: '6px',
        padding: '4px',
        borderRadius: '999px',
        background: CN.paper,
      }}
    >
      {(['7d', '30d', '90d'] as Range[]).map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={value === r}
          onClick={() => onChange(r)}
          style={{
            minHeight: '40px',
            padding: '0 16px',
            border: 0,
            borderRadius: '999px',
            background: value === r ? CN.primary : 'transparent',
            color: value === r ? CN.lime : CN.muted,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: value === r ? 700 : 400,
            cursor: 'pointer',
          }}
        >
          {RANGE_LABELS[r]}
        </button>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { projectId } = useParams() as { projectId: string };
  const [range, setRange] = useState<Range>('30d');

  const { data: channel, isLoading: channelLoading } = useChannel(projectId);
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useOverviewStats({ channel: projectId });
  const {
    data: timeseries,
    isLoading: timeseriesLoading,
    isError: timeseriesError,
  } = useDownloadTimeseries({
    channel: projectId,
    days: range === '7d' ? 7 : range === '30d' ? 30 : 90,
  });
  const {
    data: episodeStats,
    isLoading: episodesLoading,
    isError: episodesError,
  } = useEpisodeStats({ channel: projectId });

  const loading = channelLoading || statsLoading || timeseriesLoading || episodesLoading;
  const error = statsError || timeseriesError || episodesError;

  const totalDownloads = stats?.total_downloads ?? 0;
  const totalEpisodes = stats?.total_episodes ?? 0;
  const hasData = totalDownloads > 0;

  const tsData = timeseries ?? [];
  const tsEmpty = tsData.length === 0;

  const podcastTitle = channel?.podcast_title || channel?.channel_title || 'Untitled';
  const channelName = channel?.channel_title || 'Podcast channel';
  const artworkUrl = channel?.effective_artwork_url;

  // ── LOADING STATE ──
        if (loading) {
    return (
      <div style={{ padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 28px', alignContent: 'start', minHeight: '780px', fontFamily: "'DM Sans', system-ui, sans-serif", color: CN.dark, background: CN.paper }}>
        <div>
          {mono('1 · Loading stats')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[1, 2, 3].map((i) => (
                <StatSkeleton key={i} />
              ))}
            </div>
            <ChartSkeleton />
          </div>
        </div>
        <EmptyState title="Loading stats" description="Fetching your download data..." icon={<TrendingUp style={{ width: 40, height: 40, color: CN.primary, marginBottom: 0 }} />} />
        <EmptyState title="No downloads yet" description="Stats appear once listeners start playing your episodes." icon={<PlayCircle style={{ width: 40, height: 40, color: CN.primary }} />} />
        <EmptyState title="No data in this range" description="Try a longer range to see older activity." icon={<Calendar style={{ width: 40, height: 40, color: CN.primary }} />} />
      </div>
    );
  }

  // ── ERROR STATE ──
  if (error) {
    return (
      <div style={{ padding: '48px', minHeight: '780px', fontFamily: "'DM Sans', system-ui, sans-serif", color: CN.dark, background: CN.paper }}>
        {mono('4 · Couldn\'t load stats')}
        <div
          style={{
            padding: '22px',
            borderRadius: '16px',
            background: '#FFFFFF',
            boxShadow: CN.shadow,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '420px',
          }}
        >
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: `1.5px solid ${CN.coral}`,
              background: CN.coralBg,
              color: CN.coralText,
              fontSize: '14px',
              lineHeight: '1.4',
            }}
          >
            <AlertCircle style={{ width: 20, height: 20, flex: 'none', marginTop: '1px', stroke: CN.coralText }} />
            <span>We couldn't load your analytics. Try again in a moment.</span>
          </div>
          <Button
            onClick={() => window.location.reload()}
            style={{
              minHeight: '50px',
              border: 0,
              borderRadius: '6px',
              background: CN.lime,
              color: CN.primary,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // ── NO DOWNLOADS STATE ──
  if (!hasData) {
    const feedText = channel?.rss_feed_url ? channel.rss_feed_url.replace('https://', '') : '[feed-domain]/[feed-slug]';
    return (
      <div style={{ padding: '48px', minHeight: '780px', fontFamily: "'DM Sans', system-ui, sans-serif", color: CN.dark, background: CN.paper }}>
        {mono('2 · No downloads yet')}
        <EmptyState
          title="No downloads yet"
          description="Stats appear once listeners start playing your episodes. Submit your feed to a podcast app to get going."
          icon={<PlayCircle style={{ width: 40, height: 40, color: CN.primary }} />}
          action={
            <>
              <span style={{ flex: 1, minWidth: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {feedText}
              </span>
              <button
                type="button"
                aria-label="Copy feed address"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  border: 0,
                  borderRadius: '8px',
                  background: CN.surface,
                  color: CN.dark,
                  cursor: 'pointer',
                }}
              >
                <Copy style={{ width: 18, height: 18 }} />
              </button>
            </>
          }
        />
      </div>
    );
  }

  // ── NO DATA IN RANGE STATE ──
  if (tsEmpty && (!timeseriesLoading || tsData.length === 0)) {
    return (
      <div style={{ padding: '48px', minHeight: '780px', fontFamily: "'DM Sans', system-ui, sans-serif", color: CN.dark, background: CN.paper }}>
        {mono('3 · No data in this range')}
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: '#FFFFFF',
            boxShadow: CN.shadow,
            maxWidth: '420px',
          }}
        >
          <RangeToggle value={range} onChange={setRange} />
          <p style={{ margin: '18px 0 0', fontWeight: 700, fontSize: '16px', color: CN.dark }}>
            No downloads in the last {RANGE_LABELS[range]}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: CN.muted }}>
            Try a longer range to see older activity.
          </p>
        </div>
      </div>
    );
  }

  // ── FULL ANALYTICS PAGE ──
  const recentPoints = timeseries?.slice(-12) ?? [];
  const sumDownloads = timeseries?.reduce((acc, p) => acc + p.count, 0) ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'DM Sans', system-ui, sans-serif", color: CN.dark }}>
      {/* Header */}
      <header style={{ background: CN.primary }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px' }}>
          <Link href="/projects" aria-label="Opttis home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: CN.lime }}>
            <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true">
              <g transform="rotate(45 20 20)">
                <rect x="3" y="16" width="34" height="8" rx="4" fill="#B9A4F2" />
              </g>
              <g transform="rotate(-45 20 20)">
                <rect x="3" y="16" width="34" height="8" rx="4" fill="#F5F1E0" />
              </g>
            </svg>
            <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.04em' }}>opttis</span>
          </Link>
          <nav aria-label="Primary">
            <Link
              href="/projects"
              aria-current="page"
              style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 18px', borderRadius: '999px', background: CN.lime, color: CN.primary, textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}
            >
              Projects
            </Link>
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '6px 12px', borderRadius: '999px', background: `rgba(245,241,224,0.14)`, color: '#F5F1E0', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              [PLAN]
            </span>
            <button
              type="button"
              style={{
                minHeight: '40px',
                padding: '0 18px',
                border: 0,
                borderRadius: '999px',
                background: `linear-gradient(110deg,#1E1E2D 35%,#4A4A66 50%,#1E1E2D 65%)`,
                color: '#FFFFFF',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              feedback
            </button>
            <button
              type="button"
              aria-label="Account menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                border: 0,
                borderRadius: '50%',
                background: '#B9A4F2',
                color: CN.dark,
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Page header + nav */}
      <div style={{ background: CN.surface, borderBottom: `1px solid ${CN.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 0' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: '14px', color: CN.mutedSoft }}>
            <Link href="/projects" style={{ color: CN.indigo, fontWeight: 700, textDecoration: 'none' }}>Projects</Link>
            <span style={{ margin: '0 6px', color: CN.mutedSoft }}>/</span>
            <span style={{ color: CN.dark, fontWeight: 700 }}>{podcastTitle}</span>
          </nav>
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
            {artworkUrl ? (
              <img src={artworkUrl} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8F135,#A6E9FF)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8F135,#A6E9FF)', flexShrink: 0 }} />
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.4vw,36px)', letterSpacing: '-0.04em', color: CN.dark }}>
                {podcastTitle}
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '15px', color: CN.muted }}>{channelName}</p>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: '#F0FBC9',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CN.primary }} />
              Active
            </span>
          </div>
          <nav
            aria-label="Project"
            style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}
          >
            <Link
              href={`/projects/${projectId}/episodes`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '48px',
                padding: '0 18px',
                borderBottom: '3px solid transparent',
                color: CN.muted,
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Episodes
            </Link>
            <Link
              href={`/projects/${projectId}/analytics`}
              aria-current="page"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '48px',
                padding: '0 18px',
                borderBottom: `3px solid ${CN.primary}`,
                color: CN.dark,
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              Analytics
            </Link>
            <Link
              href={`/projects/${projectId}/settings`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '48px',
                padding: '0 18px',
                borderBottom: '3px solid transparent',
                color: CN.muted,
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 72px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* KPIs */}
        <section aria-label="Overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '16px' }}>
          <div style={{ padding: '22px', borderRadius: '16px', background: '#FFFFFF', boxShadow: CN.shadow }}>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: CN.muted }}>Total downloads</p>
            <p style={{ margin: '8px 0 0', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '44px', letterSpacing: '-0.045em', color: CN.dark }}>
              {totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(1)}k` : totalDownloads.toLocaleString()}
            </p>
          </div>
          <div style={{ padding: '22px', borderRadius: '16px', background: '#FFFFFF', boxShadow: CN.shadow }}>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: CN.muted }}>Last 30 days</p>
            <p style={{ margin: '8px 0 0', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '44px', letterSpacing: '-0.045em', color: CN.dark }}>
              {sumDownloads >= 1000 ? `${(sumDownloads / 1000).toFixed(1)}k` : sumDownloads.toLocaleString()}
            </p>
          </div>
          <div style={{ padding: '22px', borderRadius: '16px', background: '#FFFFFF', boxShadow: CN.shadow }}>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: CN.muted }}>Episodes published</p>
            <p style={{ margin: '8px 0 0', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '44px', letterSpacing: '-0.045em', color: CN.dark }}>
              {totalEpisodes}
            </p>
          </div>
        </section>

        {/* Timeseries */}
        <section
          aria-labelledby="ts"
          style={{
            padding: '24px 28px',
            borderRadius: '20px',
            background: '#FFFFFF',
            boxShadow: CN.shadow,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <h2 id="ts" style={{ margin: 0, fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.035em', color: CN.dark }}>
              Downloads over time
            </h2>
            <RangeToggle value={range} onChange={setRange} />
          </div>
          {recentPoints.length > 0 ? <LineChart points={recentPoints} /> : <div style={{ marginTop: '16px', color: CN.muted }}>Shape shown is a placeholder.</div>}
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: CN.muted }}>Shape shown is a placeholder.</p>
        </section>

        {/* Top episodes */}
        <section
          aria-labelledby="te"
          style={{
            padding: '24px 28px',
            borderRadius: '20px',
            background: '#FFFFFF',
            boxShadow: CN.shadow,
          }}
        >
          <h2 id="te" style={{ margin: '0 0 12px', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.035em', color: CN.dark }}>
            Top episodes
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: CN.muted }}>
                  <th scope="col" style={{ padding: '10px 8px', width: '48px', fontWeight: 500 }}>#</th>
                  <th scope="col" style={{ padding: '10px 8px', fontWeight: 500 }}>Episode</th>
                  <th scope="col" style={{ padding: '10px 8px', fontWeight: 500 }}>Published</th>
                  <th scope="col" style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 500 }}>Downloads</th>
                </tr>
              </thead>
              <tbody>
                {(episodeStats ?? []).slice(0, 5).map((ep, i) => (
                  <tr key={ep.id} style={{ borderTop: `1px solid ${CN.border}` }}>
                    <td style={{ padding: '14px 8px', fontFamily: "'JetBrains Mono', monospace", color: CN.mutedSoft }}>{i + 1}</td>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: CN.dark }}>{ep.title}</td>
                    <td style={{ padding: '14px 8px', color: CN.muted }}>{ep.pub_date ? new Date(ep.pub_date).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{ep.download_count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Geo + Apps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: '24px' }}>
          <section
            aria-labelledby="geo"
            style={{
              padding: '24px 28px',
              borderRadius: '20px',
              background: '#FFFFFF',
              boxShadow: CN.shadow,
            }}
          >
            <h2 id="geo" style={{ margin: '0 0 16px', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.035em', color: CN.dark }}>
              Where listeners are
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['US', 'GB', 'CA', 'AU'].map((country, i) => {
                const width = [72, 48, 30, 18][i];
                return (
                  <li key={country}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                      <span style={{ fontWeight: 700 }}>{country}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: CN.muted }}>{[45, 22, 15, 8][i]}%</span>
                    </div>
                    <div style={{ marginTop: '6px', height: '10px', borderRadius: '999px', background: CN.paper }}>
                      <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', background: CN.primary }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <section
            aria-labelledby="app"
            style={{
              padding: '24px 28px',
              borderRadius: '20px',
              background: '#FFFFFF',
              boxShadow: CN.shadow,
            }}
          >
            <h2 id="app" style={{ margin: '0 0 16px', fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.035em', color: CN.dark }}>
              Listening apps
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Apple Podcasts', 'Spotify', 'YouTube Music', 'Overcast'].map((app, i) => {
                const width = [64, 42, 26, 12][i];
                return (
                  <li key={app}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                      <span style={{ fontWeight: 700 }}>{app}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: CN.muted }}>{[38, 25, 16, 9][i]}%</span>
                    </div>
                    <div style={{ marginTop: '6px', height: '10px', borderRadius: '999px', background: CN.paper }}>
                      <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', background: CN.indigo }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
