import React from 'react';
import { UserStats } from '../types';
import { Flame, BookOpen, Layers, Award } from 'lucide-react';

interface MetricsProps {
  stats: UserStats;
  todayCount: number;
}

export const Metrics: React.FC<MetricsProps> = ({ stats, todayCount }) => {
  const currentConcepts = stats.totalConcepts + (todayCount > 7 ? todayCount - 7 : 0);
  const currentContributions = stats.totalContributions + (todayCount > 7 ? todayCount - 7 : 0);

  return (
    <div
      id="key-metrics-section"
      className="w-full rounded-xl bg-[#121318] border border-[#23242c] p-4 sm:p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
    >
      {/* Top subtle section header with metadata */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#1e1f28] text-xs">
        <span className="font-mono text-[#8a8b9a] uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffdb1a] animate-pulse" />
          Core Progress Telemetry
        </span>
        <span className="font-mono text-[#6d6e7e] text-[10px] sm:text-[11px]">Real-time Sync</span>
      </div>

      {/* Responsive 4-Metric Grid: 2x2 on Mobile/Tablet, 4-col on Large Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Metric 1: Current Streak */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#a5a6b5]">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffdb1a] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono tracking-wide truncate">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-display text-white tracking-tight leading-none">
                {stats.streakCurrent}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#ffdb1a] font-semibold">days</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#737484] mt-1.5 truncate">
            <span className="text-[#32d74b] font-medium font-mono">Active</span> • 19d to beat peak
          </p>
        </div>

        {/* Metric 2: Concepts Learned */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#a5a6b5]">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5b80b] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono tracking-wide truncate">Concepts</span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-display text-white tracking-tight leading-none">
                {currentConcepts}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#4ade80] font-semibold">+{todayCount} today</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#737484] mt-1.5 truncate">
            Across 8 knowledge spaces
          </p>
        </div>

        {/* Metric 3: Learning Contributions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#a5a6b5]">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffdb1a] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono tracking-wide truncate">Contributions</span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-display text-white tracking-tight leading-none">
                {currentContributions}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#8a8b9c]">lifetime</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#737484] mt-1.5 truncate">
            <span className="text-[#ffdb1a] font-mono font-medium">{stats.consistencyPercentage}%</span> consistency
          </p>
        </div>

        {/* Metric 4: Longest Streak */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#a5a6b5]">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5b80b] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono tracking-wide truncate">Longest Run</span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-display text-white tracking-tight leading-none">
                {stats.streakLongest}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#a0a1b0]">days peak</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#737484] mt-1.5 truncate">
            Established May 2026
          </p>
        </div>
      </div>
    </div>
  );
};
