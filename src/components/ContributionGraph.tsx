import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ContributionDay, LearningCommit } from '../types';
import { ContributionCell } from './ContributionCell';
import { generateContributionsForYear } from '../data/initialData';
import { Calendar, ChevronDown, Sparkles, X, Check, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface ContributionGraphProps {
  days?: ContributionDay[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  onQuickCommit: () => void;
  todayCommits?: LearningCommit[];
}

interface HoverState {
  day: ContributionDay | null;
  x: number;
  y: number;
}

// GitHub-standard month names
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  days: initialDays,
  selectedCategory,
  onSelectCategory,
  categories,
  onQuickCommit,
  todayCommits = [],
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [hover, setHover] = useState<HoverState>({ day: null, x: 0, y: 0 });
  const [activeTouchDay, setActiveTouchDay] = useState<ContributionDay | null>(null);
  const [inspectedDay, setInspectedDay] = useState<ContributionDay | null>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mobile view to current active month (August for 2026) on initial load
  useEffect(() => {
    if (scrollViewportRef.current && selectedYear === 2026) {
      // Scroll ~60% to show current month (August) on small mobile screens
      const targetScroll = scrollViewportRef.current.scrollWidth * 0.55;
      scrollViewportRef.current.scrollLeft = targetScroll;
    }
  }, [selectedYear]);

  // Generate real calendar days for the selected year
  const rawYearDays = useMemo(() => {
    return generateContributionsForYear(selectedYear, todayCommits);
  }, [selectedYear, todayCommits]);

  // Process category filters and assemble the continuous week-column calendar structure
  const { weeks, monthLabels, stats } = useMemo(() => {
    // Apply space filter if chosen
    const processedDays = rawYearDays.map((d) => {
      if (selectedCategory === 'All') return d;
      const filteredCommits = d.commits.filter((c) => c.category === selectedCategory);
      const filteredCount = filteredCommits.length;
      let intensity: 0 | 1 | 2 | 3 | 4 | 5 = 0;
      if (filteredCount > 0) {
        if (filteredCount <= 2) intensity = 1;
        else if (filteredCount <= 4) intensity = 2;
        else if (filteredCount <= 6) intensity = 3;
        else if (filteredCount <= 8) intensity = 4;
        else intensity = 5;
      }
      return {
        ...d,
        count: filteredCount,
        commits: filteredCommits,
        intensity: d.isFuture ? 0 : intensity,
      };
    });

    // Calendar logic:
    // We map days into 52/53 week columns.
    // Each column has 7 row slots (0 to 6).
    const columns: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // The first day of the year (Jan 1)
    const firstDay = processedDays[0];
    const startDayOfWeek = firstDay ? firstDay.dayOfWeek : 0; // 0 is Sunday

    // Pad the first week column with nulls for days prior to Jan 1
    for (let p = 0; p < startDayOfWeek; p++) {
      currentWeek.push(null);
    }

    processedDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        columns.push(currentWeek);
        currentWeek = [];
      }
    });

    // Pad the final week if it ends before Saturday
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      columns.push(currentWeek);
    }

    // Accurately compute Month Labels with NO collision:
    const computedMonths: { label: string; colIndex: number }[] = [];
    const recordedMonths = new Set<number>();

    columns.forEach((week, colIdx) => {
      for (const day of week) {
        if (day) {
          const monthIdx = day.dateObj.getUTCMonth();
          if (!recordedMonths.has(monthIdx)) {
            recordedMonths.add(monthIdx);
            computedMonths.push({
              label: MONTH_NAMES[monthIdx],
              colIndex: colIdx,
            });
            break;
          }
        }
      }
    });

    // Calculate real stats for this year
    const pastOrTodayDays = processedDays.filter((d) => !d.isFuture);
    const activeDays = pastOrTodayDays.filter((d) => d.count > 0).length;
    const totalConcepts = pastOrTodayDays.reduce((acc, d) => acc + d.count, 0);
    const activePercentage = pastOrTodayDays.length > 0 
      ? ((activeDays / pastOrTodayDays.length) * 100).toFixed(1)
      : '0.0';

    return {
      weeks: columns,
      monthLabels: computedMonths,
      stats: { activeDays, totalConcepts, activePercentage },
    };
  }, [rawYearDays, selectedCategory]);

  const handleCellHover = (day: ContributionDay, event: React.MouseEvent<HTMLDivElement>) => {
    sound.playClick(1200);
    const rect = event.currentTarget.getBoundingClientRect();
    const container = graphContainerRef.current?.getBoundingClientRect();
    if (container) {
      const cellCenterX = rect.left - container.left + rect.width / 2;
      const cellTopY = rect.top - container.top;
      // Clamp X position so tooltip is never clipped at left or right boundaries
      const minX = 75;
      const maxX = Math.max(minX, container.width - 75);
      const clampedX = Math.min(Math.max(cellCenterX, minX), maxX);

      setHover({
        day,
        x: clampedX,
        y: cellTopY,
      });
    } else {
      setHover({
        day,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  };

  const handleCellLeave = () => {
    setHover({ day: null, x: 0, y: 0 });
  };

  const handleCellClick = (day: ContributionDay) => {
    if (day.isFuture) return;
    sound.playClick(900);
    // On touch or click, update active touch day & inspected modal
    setActiveTouchDay((prev) => (prev?.date === day.date ? null : day));
  };

  // Format date for tooltip (e.g. Aug 30, 2026)
  const formatTooltipDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  // Format concept count label
  const getConceptCountLabel = (count: number, isFuture: boolean) => {
    if (isFuture) return 'Future date';
    if (count === 0) return '0 concepts learned';
    if (count === 1) return '1 concept learned';
    return `${count} concepts learned`;
  };

  // Format date helper for modal
  const formatDateFull = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const availableYears = [2026, 2025, 2024];

  return (
    <div
      id="contribution-graph-section"
      ref={graphContainerRef}
      className="relative w-full rounded-xl bg-[#121318] border border-[#23242c] p-4 sm:p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
    >
      {/* Header section with Year Selector and Categories */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-[#202129]">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              Learning Contributions
            </h2>

            {/* Year Selector Dropdown Pill */}
            <div className="relative">
              <button
                id="year-selector-btn"
                onClick={() => {
                  sound.playClick(1100);
                  setIsYearDropdownOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#1a1b22] text-[#ffdb1a] border border-[#ffdb1a]/30 hover:border-[#ffdb1a]/60 hover:bg-[#22232d] transition-all shadow-[0_0_10px_rgba(255,219,26,0.1)]"
                aria-haspopup="listbox"
                aria-expanded={isYearDropdownOpen}
              >
                <span>{selectedYear}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isYearDropdownOpen ? 'rotate-180 text-white' : 'text-[#ffdb1a]'
                  }`}
                />
              </button>

              <AnimatePresence>
                {isYearDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsYearDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 2, scale: 0.96 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 mt-1.5 w-32 rounded-lg bg-[#181922] border border-[#2e2f3d] shadow-xl py-1 z-40 overflow-hidden"
                    >
                      {availableYears.map((year) => {
                        const isSelected = year === selectedYear;
                        return (
                          <button
                            key={year}
                            id={`year-option-${year}`}
                            onClick={() => {
                              sound.playClick(1000);
                              setSelectedYear(year);
                              setIsYearDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors ${
                              isSelected
                                ? 'bg-[#ffdb1a]/15 text-[#ffdb1a] font-bold'
                                : 'text-[#9b9ca8] hover:bg-[#22232f] hover:text-white'
                            }`}
                          >
                            <span>{year}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#ffdb1a]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {selectedYear === 2026 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#ffdb1a]/10 text-[#ffdb1a] border border-[#ffdb1a]/25">
                <Sparkles className="w-3 h-3" />
                Active Cycle
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#9b9ca8] mt-1">
            Every concept leaves a mark. Complete calendar overview for {selectedYear}.
          </p>
        </div>

        {/* Space / Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#717282] font-mono mr-1 hidden xl:inline">Filter Space:</span>
          {['All', 'Data Structures', 'Java', 'SQL', 'Computer Networks', 'React'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  sound.playClick(1000);
                  onSelectCategory(cat);
                }}
                className={`
                  px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs rounded-md transition-all font-medium whitespace-nowrap
                  ${
                    isSelected
                      ? 'bg-[#ffdb1a] text-black font-semibold shadow-[0_0_12px_rgba(255,219,26,0.35)]'
                      : 'bg-[#181920] text-[#a0a1af] hover:text-white hover:bg-[#22232c] border border-[#272832]'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Grid Viewport: Controlled horizontal scrolling for mobile / tablet only if width < 720px */}
      <div
        ref={scrollViewportRef}
        id="heatmap-scroll-viewport"
        className="graph-viewport-scroll relative mt-4 sm:mt-6 select-none pb-2 pt-1 -mx-2 px-2 sm:mx-0 sm:px-0"
      >
        <div className="min-w-[680px] w-full select-none">
          {/* Calendar Layout Container */}
          <div className="flex items-start">
            {/* Weekday labels on the left (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between pt-[22px] pr-2 text-[10px] font-mono text-[#787989] select-none shrink-0 w-7 sm:w-8">
              <span className="h-[10px] sm:h-[11px] leading-none opacity-0">Sun</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px]">Mon</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px] opacity-0">Tue</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px]">Wed</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px] opacity-0">Thu</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px]">Fri</span>
              <span className="h-[10px] sm:h-[11px] leading-none mt-[3px] sm:mt-[4px] opacity-0">Sat</span>
            </div>

            {/* Grid & Month Labels Header Container */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Month Labels row positioned above corresponding week columns */}
              <div className="relative h-5 text-[10px] sm:text-[11px] font-mono text-[#8b8c9d] pointer-events-none mb-1">
                {monthLabels.map((m, idx) => (
                  <span
                    key={`${m.label}-${idx}`}
                    className="absolute top-0 font-medium whitespace-nowrap"
                    style={{
                      left: `${(m.colIndex / weeks.length) * 100}%`,
                    }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Week Columns Grid: 53 columns spaced evenly */}
              <div className="flex justify-between items-center w-full gap-[2px] sm:gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div
                    key={`week-${wIdx}`}
                    className="flex flex-col gap-[3px] sm:gap-[4px] flex-1 items-center"
                  >
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div
                            key={`empty-${wIdx}-${dIdx}`}
                            className="w-full max-w-[12px] sm:max-w-[13px] aspect-square opacity-0 pointer-events-none"
                          />
                        );
                      }
                      const isSelected = activeTouchDay?.date === day.date;
                      return (
                        <div key={day.date} className="w-full max-w-[12px] sm:max-w-[13px] aspect-square flex items-center justify-center">
                          <ContributionCell
                            day={day}
                            onHover={handleCellHover}
                            onLeave={handleCellLeave}
                            onClick={handleCellClick}
                            isSelected={isSelected}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Hover Tooltip */}
        <AnimatePresence>
          {hover.day && !activeTouchDay && (
            <motion.div
              initial={{ opacity: 0, y: 3, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.96 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2"
              style={{
                left: `${hover.x}px`,
                top: `${hover.y}px`,
              }}
            >
              <div className="bg-[#171822]/95 backdrop-blur-md border border-[#2e2f3d] shadow-[0_6px_20px_rgba(0,0,0,0.65)] rounded-md px-3 py-2 text-center whitespace-nowrap">
                <div className="text-[11px] font-mono text-[#9b9ca8] leading-tight mb-0.5">
                  {formatTooltipDate(hover.day.date)}
                </div>
                <div className="text-xs font-semibold font-display">
                  <span
                    className={
                      hover.day.isFuture
                        ? 'text-[#6c6d7d]'
                        : hover.day.count > 0
                        ? 'text-[#ffdb1a]'
                        : 'text-[#828393]'
                    }
                  >
                    {getConceptCountLabel(hover.day.count, hover.day.isFuture)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile/Tablet Touch Popover Banner (Tapping on touch devices) */}
      <AnimatePresence>
        {activeTouchDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3 p-3 rounded-lg bg-[#1a1b24] border border-[#ffdb1a]/40 shadow-lg flex items-center justify-between gap-3 flex-wrap text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[2px] bg-[#ffdb1a] shadow-[0_0_8px_#ffdb1a]" />
              <div>
                <span className="font-bold text-white">
                  {formatTooltipDate(activeTouchDay.date)}:
                </span>{' '}
                <span className="font-mono text-[#ffdb1a]">
                  {getConceptCountLabel(activeTouchDay.count, activeTouchDay.isFuture)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick(1000);
                  setInspectedDay(activeTouchDay);
                  setActiveTouchDay(null);
                }}
                className="px-2.5 py-1 rounded bg-[#ffdb1a] text-black font-semibold text-[11px] flex items-center gap-1 hover:bg-[#ffe043] transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => setActiveTouchDay(null)}
                className="p-1 text-[#8b8c9d] hover:text-white rounded"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer: Year Insights & Intensity Legend */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#1e1f27] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Quick Insights Row */}
        <div className="flex items-center gap-3 sm:gap-6 text-[#9a9ba8] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold font-mono">{stats.activeDays}</span>
            <span className="text-[11px] sm:text-xs">active days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold font-mono">{stats.totalConcepts}</span>
            <span className="text-[11px] sm:text-xs">concepts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#ffdb1a] font-semibold font-mono">{stats.activePercentage}%</span>
            <span className="text-[11px] sm:text-xs">consistency</span>
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto text-[10px] sm:text-[11px] text-[#787989] font-mono">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#17181e] border border-[#22232a]" title="0 concepts" />
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#473b12] border border-[#665416]" title="1-2 concepts" />
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#705c12] border border-[#947a16]" title="3-4 concepts" />
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#ab890e] border border-[#cfa40e]" title="5-6 concepts" />
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#e5b80b] border-[#ffd426]" title="7-8 concepts" />
            <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] bg-[#ffdb1a] border-white shadow-[0_0_6px_rgba(255,219,26,0.8)]" title="9+ concepts" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Inspected Day Detail Modal (Responsive centered/bottom modal) */}
      <AnimatePresence>
        {inspectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#15161d] border border-[#2e2f3b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#242531]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#ffdb1a]/10 text-[#ffdb1a]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-display leading-snug">
                      {formatDateFull(inspectedDay.date)}
                    </h3>
                    <p className="text-xs text-[#8d8e9d]">
                      {inspectedDay.count} {inspectedDay.count === 1 ? 'concept' : 'concepts'} committed
                      {inspectedDay.isToday && ' • Today'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedDay(null)}
                  className="p-1.5 text-[#888998] hover:text-white rounded-md hover:bg-[#20212c] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Commits List */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                {inspectedDay.commits.length > 0 ? (
                  inspectedDay.commits.map((commit, idx) => (
                    <div
                      key={commit.id || idx}
                      className="p-3 sm:p-3.5 rounded-lg bg-[#1a1b24] border border-[#272836] hover:border-[#38394a] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-[#ffdb1a] bg-[#ffdb1a]/10 px-1.5 py-0.5 rounded">
                            {commit.timestamp}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-white">{commit.concept}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#252634] text-[#b0b1c0] border border-[#303142] shrink-0">
                          {commit.category}
                        </span>
                      </div>
                      {commit.notes && (
                        <p className="text-xs text-[#a2a3b4] leading-relaxed pl-2 border-l-2 border-[#ffdb1a]/40 mt-2 font-mono text-[11px]">
                          {commit.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[#747585]">
                    <p className="text-xs sm:text-sm">No learning activities recorded for this date.</p>
                    {inspectedDay.isToday && (
                      <button
                        onClick={() => {
                          setInspectedDay(null);
                          onQuickCommit();
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#ffdb1a] hover:underline"
                      >
                        + Commit your first concept today
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-[#111218] border-t border-[#20212c] flex items-center justify-between text-xs">
                <span className="text-[#727382] font-mono text-[11px]">
                  Heatmap Tier: Level {inspectedDay.intensity} / 5
                </span>
                <button
                  onClick={() => setInspectedDay(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#22232e] text-white hover:bg-[#2b2c3a] transition-colors font-medium text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
