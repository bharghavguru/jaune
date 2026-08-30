import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  todayCount: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  todayCount,
}) => {
  // Days of the current week (Monday to Sunday)
  const weekDays = [
    { label: 'M', name: 'Mon', completed: true, count: 4 },
    { label: 'T', name: 'Tue', completed: true, count: 7 },
    { label: 'W', name: 'Wed', completed: true, count: 3 },
    { label: 'T', name: 'Thu', completed: true, count: 5 },
    { label: 'F', name: 'Fri', completed: true, count: 6 },
    { label: 'S', name: 'Sat', completed: true, count: 4 },
    { label: 'S', name: 'Sun', completed: todayCount > 0, count: todayCount, isToday: true },
  ];

  const daysToBeatRecord = Math.max(0, longestStreak - currentStreak);

  return (
    <div
      id="streak-experience-card"
      className="relative rounded-xl bg-gradient-to-b from-[#16171f] to-[#111217] border border-[#262733] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle ambient radiant glow behind the streak number (contained with overflow-hidden) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffdb1a]/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top badge */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div className="px-2.5 py-0.5 sm:py-1 rounded-md bg-[#ffdb1a]/10 border border-[#ffdb1a]/25 text-[#ffdb1a] text-[10px] sm:text-xs font-mono font-medium">
            <span>MOMENTUM VELOCITY</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#787989] flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffdb1a]" />
            Streak Protected
          </span>
        </div>

        {/* Streak Main Numbers */}
        <div className="flex items-baseline gap-2.5 my-2 flex-wrap">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight flex items-center gap-2 leading-none">
            <span className="flame-emoji-animated select-none">🔥</span>
            <span>{currentStreak}</span>
          </span>
          <span className="text-xs sm:text-sm font-bold font-display uppercase tracking-widest text-[#a8a9b8]">
            DAY STREAK
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#9da0b3] font-medium leading-relaxed mt-1">
          You're on a {currentStreak}-day learning run. Every commit compounds into lasting engineering intuition.
        </p>

        {/* 7-Day Week Consistency Bar */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#20212c]">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#7b7c8d] mb-2">
            <span>This Week's Activity</span>
            <span className="text-[#ffdb1a] font-semibold">{todayCount > 0 ? '7 / 7 Active' : '6 / 7 Active'}</span>
          </div>

          {/* Grid of 7 days: compact for 320px mobile screens */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`
                  flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg border transition-all min-w-0
                  ${
                    day.isToday
                      ? 'bg-[#222432] border-[#ffdb1a] shadow-[0_0_10px_rgba(255,219,26,0.25)]'
                      : day.completed
                      ? 'bg-[#1a1b24] border-[#2c2d3c]'
                      : 'bg-[#14151c] border-[#1f202a] opacity-40'
                  }
                `}
              >
                <span className="text-[9px] sm:text-[10px] font-mono text-[#8b8c9c] mb-1 font-semibold">
                  {day.label}
                </span>
                <div
                  className={`
                    w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] shrink-0
                    ${
                      day.completed
                        ? 'bg-[#ffdb1a] text-black font-bold'
                        : 'bg-[#20212a] text-[#616270]'
                    }
                  `}
                >
                  {day.completed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer milestone tracker */}
      <div className="mt-4 sm:mt-5 pt-3 border-t border-[#1d1e26] flex items-center justify-between text-[11px] sm:text-xs text-[#7d7e8e] flex-wrap gap-1">
        <span>
          Peak Record: <strong className="text-white font-mono">{longestStreak} days</strong>
        </span>
        <span className="font-mono text-[#ffdb1a] text-[10px] sm:text-[11px]">
          {daysToBeatRecord > 0 ? `${daysToBeatRecord}d to record` : 'Record broken!'}
        </span>
      </div>
    </div>
  );
};
