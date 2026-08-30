import React from 'react';
import { Plus } from 'lucide-react';
import { sound } from '../utils/sound';

interface DashboardHeaderProps {
  userName: string;
  onOpenCommit: () => void;
  streak: number;
  todayCount: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onOpenCommit,
  streak,
  todayCount,
}) => {
  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${userName}.`;
    if (hour < 18) return `Good afternoon, ${userName}.`;
    return `Good evening, ${userName}.`;
  };

  return (
    <div
      id="dashboard-header"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 sm:py-5 lg:py-6"
    >
      <div className="min-w-0 flex-1">
        {/* Date badge & status */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#1b1c25] text-[#ffdb1a] border border-[#ffdb1a]/20 shrink-0">
            Sunday, August 30, 2026
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#6c6d7d]">
            • Session Active
          </span>
        </div>

        {/* Dynamic Greeting */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
          {getGreeting()}
        </h1>

        {/* Dynamic Context & Concepts Count */}
        <p className="text-xs sm:text-sm md:text-base text-[#9a9ba9] mt-1 font-medium leading-normal">
          Keep building your knowledge.{' '}
          <span className="text-[#ffdb1a] font-mono font-semibold">
            {todayCount} {todayCount === 1 ? 'concept' : 'concepts'}
          </span>{' '}
          committed today.
        </p>
      </div>

      {/* Prominent Primary Action Button */}
      <div className="flex items-center sm:self-center shrink-0 w-full sm:w-auto">
        <button
          id="btn-commit-learning-primary"
          onClick={() => {
            sound.playClick(900);
            onOpenCommit();
          }}
          className="w-full sm:w-auto min-h-[44px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#ffdb1a] text-black font-bold font-display text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(255,219,26,0.35)] hover:shadow-[0_0_30px_rgba(255,219,26,0.6)] hover:bg-[#ffe043] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Commit Learning</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/15 text-black font-mono text-[10px] sm:text-[11px] border border-black/20 ml-1">
            C
          </kbd>
        </button>
      </div>
    </div>
  );
};
