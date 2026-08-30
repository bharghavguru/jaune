import React from 'react';
import { ContributionDay } from '../types';

interface ContributionCellProps {
  day: ContributionDay;
  onHover: (day: ContributionDay, event: React.MouseEvent<HTMLDivElement>) => void;
  onLeave: () => void;
  onClick: (day: ContributionDay) => void;
  isSelected?: boolean;
  isFiltered?: boolean;
}

export const ContributionCell: React.FC<ContributionCellProps> = ({
  day,
  onHover,
  onLeave,
  onClick,
  isSelected = false,
  isFiltered = false,
}) => {
  // Determine color styling strictly according to the specified JAUNE concept intensity tiers
  const getIntensityStyles = (intensity: number, count: number, isToday: boolean, isFuture: boolean) => {
    if (isFuture) {
      return 'bg-[#14151a]/40 border-[#1c1d24]/50 cursor-default opacity-40';
    }

    if (isFiltered) {
      return 'bg-[#181920] border-[#22232c] opacity-35';
    }

    if (count === 0) {
      return isToday
        ? 'bg-[#1b1d24] border-[#ffe043] border-dashed ring-1 ring-[#ffe043]/30'
        : 'bg-[#17181e] border-[#22232a] hover:border-[#3d3f4e]';
    }

    switch (intensity) {
      case 1: // 1-2 concepts: very pale yellow
        return 'bg-[#473b12] border-[#665416] text-[#ffeb80] hover:border-[#ffe043]';
      case 2: // 3-4 concepts: soft yellow
        return 'bg-[#705c12] border-[#947a16] text-[#fff099] hover:border-[#ffe043]';
      case 3: // 5-6 concepts: golden yellow
        return 'bg-[#ab890e] border-[#cfa40e] text-[#fff7cc] hover:border-[#ffea66] shadow-[0_0_6px_rgba(207,164,14,0.25)]';
      case 4: // 7-8 concepts: bright yellow
        return 'bg-[#e5b80b] border-[#ffd426] text-black hover:border-white shadow-[0_0_8px_rgba(229,184,11,0.4)]';
      case 5: // 9+ concepts: intense golden yellow with subtle glow
      default:
        return 'bg-[#ffdb1a] border-[#ffffff] text-black shadow-[0_0_12px_rgba(255,219,26,0.65)] hover:shadow-[0_0_16px_rgba(255,219,26,0.85)]';
    }
  };

  const isLuminous = day.intensity >= 4 && !isFiltered && !day.isFuture;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(day);
    }
  };

  return (
    <div
      id={`cell-${day.date}`}
      role="button"
      tabIndex={day.isFuture ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseEnter={(e) => onHover(day, e)}
      onMouseLeave={onLeave}
      onClick={() => onClick(day)}
      className={`
        relative w-full h-full rounded-[2px] border transition-all duration-150 transform outline-none
        ${!day.isFuture ? 'cursor-pointer hover:scale-[1.35] hover:z-30 focus-visible:ring-2 focus-visible:ring-white focus-visible:z-30' : ''}
        ${getIntensityStyles(day.intensity, day.count, day.isToday, day.isFuture)}
        ${day.isToday ? 'ring-1 ring-[#ffdb1a]' : ''}
        ${isSelected ? 'ring-2 ring-white scale-[1.3] z-20 shadow-[0_0_10px_#ffffff]' : ''}
      `}
      aria-label={`${day.date}: ${day.count} concepts learned`}
    >
      {/* Indicator for today */}
      {day.isToday && (
        <span className="absolute -top-[1.5px] -right-[1.5px] w-[4px] h-[4px] rounded-full bg-[#ffdb1a] animate-ping opacity-75" />
      )}

      {/* Subtle luminous sparkle overlay for intense days */}
      {isLuminous && (
        <span className="absolute inset-0 rounded-[1px] bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />
      )}
    </div>
  );
};
