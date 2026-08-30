import React from 'react';
import { UserStats } from '../types';
import { TrendingUp, Award, Zap, Activity, Clock } from 'lucide-react';

interface LearningInsightsProps {
  stats: UserStats;
}

export const LearningInsights: React.FC<LearningInsightsProps> = ({ stats }) => {
  // Day of week distribution calculation
  const dayDistribution = [
    { day: 'Mon', count: 28, pct: 75 },
    { day: 'Tue', count: 34, pct: 90 },
    { day: 'Wed', count: 22, pct: 60 },
    { day: 'Thu', count: 31, pct: 84 },
    { day: 'Fri', count: 38, pct: 100, isPeak: true },
    { day: 'Sat', count: 19, pct: 50 },
    { day: 'Sun', count: 12, pct: 32 },
  ];

  // Time of day buckets
  const timeBuckets = [
    { label: 'Dawn (05-09h)', count: 18, pct: 35 },
    { label: 'Morning (09-12h)', count: 42, pct: 80 },
    { label: 'Afternoon (12-18h)', count: 36, pct: 68 },
    { label: 'Evening (18-22h)', count: 64, pct: 100, isPeak: true },
    { label: 'Night (22-02h)', count: 24, pct: 45 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1f202a]">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffdb1a]" />
          Learning Analytics & Insights
        </h2>
        <p className="text-xs sm:text-sm text-[#9192a2] mt-0.5">
          Mathematical telemetry of your conceptual acquisition, cadence, and momentum.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Total Concepts</span>
          <span className="text-xl sm:text-2xl font-bold font-display text-white mt-1">184</span>
          <span className="text-[10px] font-mono text-[#4ade80] mt-1">+14 this week</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Total Commits</span>
          <span className="text-xl sm:text-2xl font-bold font-display text-white mt-1">427</span>
          <span className="text-[10px] font-mono text-[#ffdb1a] mt-1">2.3 avg / day</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Year Velocity</span>
          <span className="text-xl sm:text-2xl font-bold font-display text-white mt-1">88.4%</span>
          <span className="text-[10px] font-mono text-[#868798] mt-1">Consistency index</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Peak Day</span>
          <span className="text-xl sm:text-2xl font-bold font-display text-[#ffdb1a] mt-1">11</span>
          <span className="text-[10px] font-mono text-[#868798] mt-1">Aug 14, 2026</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Longest Streak</span>
          <span className="text-xl sm:text-2xl font-bold font-display text-white mt-1">31d</span>
          <span className="text-[10px] font-mono text-[#e5b80b] mt-1">All-time record</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#8a8b9a]">Dominant Space</span>
          <span className="text-sm sm:text-base font-bold font-display text-white truncate mt-1">Data Structures</span>
          <span className="text-[10px] font-mono text-[#ffdb1a] mt-1">86 concepts</span>
        </div>
      </div>

      {/* Main Charts: 2-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Chart 1: Day of Week Cadence */}
        <div className="p-4 sm:p-6 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f202a] mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ffdb1a]" />
                <h3 className="text-sm sm:text-base font-bold font-display text-white">
                  Weekly Cadence & Rhythm
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#ffdb1a]">Friday Peak</span>
            </div>

            <div className="space-y-2.5">
              {dayDistribution.map((d) => (
                <div key={d.day} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-mono text-[#8a8b9a] font-semibold">{d.day}</span>
                  <div className="flex-1 h-3 rounded-full bg-[#1b1c26] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.isPeak
                          ? 'bg-[#ffdb1a] shadow-[0_0_8px_#ffdb1a]'
                          : 'bg-[#b39217]'
                      }`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-white font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#717282] mt-4 pt-3 border-t border-[#1e1f29] font-mono">
            You learn most aggressively mid-week into Friday evenings.
          </p>
        </div>

        {/* Chart 2: Cumulative Growth Curve */}
        <div className="p-4 sm:p-6 rounded-xl bg-[#121319] border border-[#232431] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f202a] mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ffdb1a]" />
                <h3 className="text-sm sm:text-base font-bold font-display text-white">
                  Cumulative Concept Trajectory
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#4ade80]">+184 Total</span>
            </div>

            {/* Responsive Vector Chart */}
            <div className="h-44 w-full flex items-end pt-4 pb-2 px-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffdb1a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ffdb1a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M 0 120 Q 80 110, 140 85 T 260 50 T 400 10 L 400 130 L 0 130 Z"
                  fill="url(#curveGradient)"
                />
                {/* Smooth Curve Line */}
                <path
                  d="M 0 120 Q 80 110, 140 85 T 260 50 T 400 10"
                  fill="none"
                  stroke="#ffdb1a"
                  strokeWidth="2.5"
                />
                {/* Glowing Dot on Latest Point */}
                <circle cx="400" cy="10" r="4" fill="#ffffff" stroke="#ffdb1a" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#6c6d7d] px-1 mt-2">
              <span>Jan 2026 (0)</span>
              <span>May 2026 (92)</span>
              <span className="text-[#ffdb1a] font-semibold">Today (184)</span>
            </div>
          </div>

          <p className="text-[11px] text-[#717282] mt-4 pt-3 border-t border-[#1e1f29] font-mono">
            Compounding rate: +1.2 concepts/day acceleration over the last 90 days.
          </p>
        </div>
      </div>

      {/* Time of Day Distribution */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#121319] border border-[#232431]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f202a] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ffdb1a]" />
            <h3 className="text-sm sm:text-base font-bold font-display text-white">
              Diurnal Focus Windows
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#8a8b9b]">Time-of-day distribution</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {timeBuckets.map((b) => (
            <div
              key={b.label}
              className={`p-3 rounded-lg border flex flex-col justify-between ${
                b.isPeak
                  ? 'bg-[#1e1f2b] border-[#ffdb1a]/40 shadow-[0_0_12px_rgba(255,219,26,0.15)]'
                  : 'bg-[#15161e] border-[#22232e]'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-[#868798]">{b.label}</span>
                <div className="text-lg sm:text-xl font-bold font-display text-white mt-1">
                  {b.count} <span className="text-[10px] font-mono text-[#777888]">commits</span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#20212d] mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.isPeak ? 'bg-[#ffdb1a]' : 'bg-[#7a6518]'}`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
