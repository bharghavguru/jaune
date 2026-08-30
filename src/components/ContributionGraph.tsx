import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContributionDay } from '../types';

interface ContributionGraphProps {
  days?: ContributionDay[];
  todayCommits?: any[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  categories?: string[];
  onQuickCommit?: () => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  day: ContributionDay | null;
}

/* -------------------------------------------------------
   Constants
------------------------------------------------------- */

const CELL_SIZE = 16;
const CELL_GAP = 5;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  days = [],
  todayCommits = [],
  selectedCategory = 'All',
  onSelectCategory,
  categories = ['All'],
}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    day: null,
  });

  /* -------------------------------------------------------
     Build contribution data
  ------------------------------------------------------- */

  const contributionDays = useMemo(() => {
    if (days.length > 0) {
      return days;
    }

    /*
      Fallback for cases where App passes todayCommits
      but doesn't pass the generated year data.
    */

    const result: ContributionDay[] = [];

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    const current = new Date(start);

    while (current <= end) {
      const dateString = [
        current.getFullYear(),
        String(current.getMonth() + 1).padStart(2, '0'),
        String(current.getDate()).padStart(2, '0'),
      ].join('-');

      const commitsForDay = todayCommits.filter(
        (commit) => commit.dateString === dateString
      );

      const count = commitsForDay.length;

      let intensity: 0 | 1 | 2 | 3 | 4 | 5 = 0;

      if (count === 0) intensity = 0;
      else if (count === 1) intensity = 1;
      else if (count <= 3) intensity = 2;
      else if (count <= 5) intensity = 3;
      else if (count <= 7) intensity = 4;
      else intensity = 5;

      result.push({
        date: dateString,
        dateObj: new Date(current),
        count,
        commits: commitsForDay,
        intensity,
        dayOfWeek: current.getDay(),
        isToday: dateString === new Date().toISOString().slice(0, 10),
        isFuture: current > new Date(),
        monthName: MONTHS[current.getMonth()],
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  }, [days, todayCommits, year]);

  /* -------------------------------------------------------
     Filter by category
  ------------------------------------------------------- */

  const filteredDays = useMemo(() => {
    if (selectedCategory === 'All') {
      return contributionDays;
    }

    return contributionDays.map((day) => {
      const filteredCommits = day.commits.filter(
        (commit) => commit.category === selectedCategory
      );

      const count = filteredCommits.length;

      let intensity: 0 | 1 | 2 | 3 | 4 | 5 = 0;

      if (count === 0) intensity = 0;
      else if (count === 1) intensity = 1;
      else if (count <= 3) intensity = 2;
      else if (count <= 5) intensity = 3;
      else if (count <= 7) intensity = 4;
      else intensity = 5;

      return {
        ...day,
        count,
        commits: filteredCommits,
        intensity,
      };
    });
  }, [contributionDays, selectedCategory]);

  /* -------------------------------------------------------
     Group days by month
  ------------------------------------------------------- */

  const monthData = useMemo(() => {
    const months: ContributionDay[][] = Array.from(
      { length: 12 },
      () => []
    );

    filteredDays.forEach((day) => {
      const month = day.dateObj.getMonth();

      if (month >= 0 && month < 12) {
        months[month].push(day);
      }
    });

    return months;
  }, [filteredDays]);

  /* -------------------------------------------------------
     Stats
  ------------------------------------------------------- */

  const activeDays = filteredDays.filter((day) => day.count > 0).length;

  const totalConcepts = filteredDays.reduce(
    (total, day) => total + day.count,
    0
  );

  const consistency =
    filteredDays.length > 0
      ? ((activeDays / filteredDays.filter((d) => !d.isFuture).length) * 100)
      : 0;

  /* -------------------------------------------------------
     Tooltip handlers
  ------------------------------------------------------- */

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    day: ContributionDay
  ) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      day,
    });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    day: ContributionDay
  ) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      day,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((previous) => ({
      ...previous,
      visible: false,
    }));
  };

  /* -------------------------------------------------------
     Cell color / glow
  ------------------------------------------------------- */

  const getCellStyle = (day: ContributionDay): React.CSSProperties => {
    const intensity = day.intensity;

    if (day.isFuture) {
      return {
        backgroundColor: '#0d0f13',
        border: '1px solid #151820',
        boxShadow: 'none',
      };
    }

    switch (intensity) {
      case 0:
        return {
          backgroundColor: '#15171c',
          border: '1px solid #22252d',
          boxShadow: 'none',
        };

      case 1:
        return {
          backgroundColor: '#51460a',
          border: '1px solid #67580a',
          boxShadow: 'none',
        };

      case 2:
        return {
          backgroundColor: '#786609',
          border: '1px solid #927a0a',
          boxShadow: '0 0 3px rgba(255, 219, 26, 0.12)',
        };

      case 3:
        return {
          backgroundColor: '#a68a0b',
          border: '1px solid #c09e0d',
          boxShadow: '0 0 6px rgba(255, 219, 26, 0.2)',
        };

      case 4:
        return {
          backgroundColor: '#d1ad0f',
          border: '1px solid #e3c21a',
          boxShadow: '0 0 10px rgba(255, 219, 26, 0.35)',
        };

      case 5:
      default:
        return {
          backgroundColor: '#ffdb1a',
          border: '1px solid #ffe76b',
          boxShadow:
            '0 0 7px rgba(255, 219, 26, 0.75), 0 0 18px rgba(255, 219, 26, 0.35)',
        };
    }
  };

  /* -------------------------------------------------------
     Format tooltip date
  ------------------------------------------------------- */

  const formatDate = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /* -------------------------------------------------------
     Tooltip
     
     IMPORTANT:
     createPortal() puts it directly under <body>.
     Therefore it cannot be clipped by the graph container.
  ------------------------------------------------------- */

  const tooltipElement =
    tooltip.visible && tooltip.day
      ? createPortal(
          <div
            className="fixed z-[99999] pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 12,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div
              className="
                relative
                min-w-[150px]
                max-w-[220px]
                rounded-lg
                border
                border-[#3a3518]
                bg-[#111217]
                px-3
                py-2.5
                shadow-[0_10px_35px_rgba(0,0,0,0.55)]
              "
            >
              {/* Date */}
              <div className="text-[11px] font-mono text-[#8f91a1] whitespace-nowrap">
                {formatDate(tooltip.day.date)}
              </div>

              {/* Count */}
              <div className="mt-1 text-[13px] font-semibold text-[#ffdb1a] whitespace-nowrap">
                {tooltip.day.count === 0
                  ? 'No concepts learned'
                  : `${tooltip.day.count} ${
                      tooltip.day.count === 1 ? 'concept' : 'concepts'
                    } learned`}
              </div>

              {/* Tiny arrow */}
              <div
                className="
                  absolute
                  left-1/2
                  -bottom-[5px]
                  h-2.5
                  w-2.5
                  -translate-x-1/2
                  rotate-45
                  border-r
                  border-b
                  border-[#3a3518]
                  bg-[#111217]
                "
              />
            </div>
          </div>,
          document.body
        )
      : null;

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <section
      className="
        w-full
        rounded-2xl
        border
        border-[#24262f]
        bg-[#111217]
        p-4
        sm:p-5
        md:p-6
        overflow-hidden
      "
    >
      {/* ---------------------------------------------------
          Header
      --------------------------------------------------- */}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Learning Contributions
              </h2>

              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-[#63560a]
                  bg-[#171711]
                  px-2.5
                  py-1
                  text-[11px]
                  font-mono
                  font-bold
                  text-[#ffdb1a]
                  hover:bg-[#211f10]
                  transition-colors
                "
              >
                {year}
                <span className="text-[10px]">⌄</span>
              </button>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#5d520c]
                  bg-[#171711]
                  px-2.5
                  py-1
                  text-[10px]
                  font-mono
                  text-[#ffdb1a]
                "
              >
                ✣ Active Cycle
              </span>
            </div>

            <p className="mt-1 text-sm text-[#9b9dab]">
              Every concept leaves a mark. Complete calendar overview for{' '}
              {year}.
            </p>
          </div>

          {/* Category filters */}

          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <span className="mr-1 text-[11px] font-mono text-[#77798a]">
                Filter Space:
              </span>

              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onSelectCategory?.(category)}
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-1.5
                      text-[11px]
                      transition-all
                      ${
                        active
                          ? 'border-[#ffdb1a] bg-[#ffdb1a] text-black font-bold shadow-[0_0_14px_rgba(255,219,26,0.3)]'
                          : 'border-[#292c35] bg-[#15171d] text-[#a0a2b2] hover:border-[#555766] hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-[#24262d]" />
      </div>

      {/* ---------------------------------------------------
          GitHub-style calendar
      --------------------------------------------------- */}

      <div className="mt-6 w-full overflow-x-auto overflow-y-hidden pb-2">
        <div
          className="
            min-w-[920px]
            w-full
          "
        >
          {/* Month names */}

          <div
            className="grid"
            style={{
              gridTemplateColumns: `34px repeat(12, minmax(0, 1fr))`,
              columnGap: 6,
            }}
          >
            <div />

            {MONTHS.map((month, index) => (
              <div
                key={month}
                className="text-center text-[10px] sm:text-[11px] font-mono text-[#858799]"
              >
                {month}
              </div>
            ))}
          </div>

          {/* Calendar body */}

          <div className="mt-2 flex">
            {/* Weekday labels */}

            <div
              className="mr-2 flex shrink-0 flex-col justify-between py-[1px]"
              style={{
                width: 26,
                height: 7 * CELL_SIZE + 6 * CELL_GAP,
              }}
            >
              {WEEKDAYS.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="text-[9px] font-mono text-[#77798a]"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Months */}

            <div className="flex min-w-0 flex-1 gap-2">
              {monthData.map((monthDays, monthIndex) => {
                /*
                  Convert the month into GitHub-style columns.
                  Each column represents one week.
                */

                const columns: ContributionDay[][] = [];

                let currentColumn: ContributionDay[] = [];

                const firstDay = monthDays[0];

                if (firstDay) {
                  const jsDay = firstDay.dateObj.getDay();

                  /*
                    GitHub starts weeks on Sunday.
                    0 = Sunday.
                  */

                  for (let i = 0; i < jsDay; i++) {
                    currentColumn.push(null as unknown as ContributionDay);
                  }
                }

                monthDays.forEach((day) => {
                  currentColumn.push(day);

                  if (currentColumn.length === 7) {
                    columns.push(currentColumn);
                    currentColumn = [];
                  }
                });

                if (currentColumn.length > 0) {
                  while (currentColumn.length < 7) {
                    currentColumn.push(
                      null as unknown as ContributionDay
                    );
                  }

                  columns.push(currentColumn);
                }

                return (
                  <div
                    key={MONTHS[monthIndex]}
                    className="flex flex-1 justify-center"
                  >
                    <div className="flex gap-[5px]">
                      {columns.map((column, columnIndex) => (
                        <div
                          key={`${monthIndex}-${columnIndex}`}
                          className="flex flex-col gap-[5px]"
                        >
                          {column.map((day, rowIndex) => {
                            if (!day) {
                              return (
                                <div
                                  key={`${monthIndex}-${columnIndex}-${rowIndex}-empty`}
                                  style={{
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                  }}
                                />
                              );
                            }

                            return (
                              <div
                                key={day.date}
                                role="gridcell"
                                aria-label={`${formatDate(day.date)}: ${
                                  day.count
                                } concepts learned`}
                                onMouseEnter={(event) =>
                                  handleMouseEnter(event, day)
                                }
                                onMouseMove={(event) =>
                                  handleMouseMove(event, day)
                                }
                                onMouseLeave={handleMouseLeave}
                                style={{
                                  width: CELL_SIZE,
                                  height: CELL_SIZE,
                                  ...getCellStyle(day),
                                }}
                                className="
                                  relative
                                  shrink-0
                                  cursor-pointer
                                  rounded-[3px]
                                  transition-transform
                                  duration-100
                                  hover:scale-[1.18]
                                  hover:z-20
                                "
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------
          Bottom stats
      --------------------------------------------------- */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-4
          border-t
          border-[#24262d]
          pt-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="text-xs font-mono text-[#8a8c9c]">
            <span className="font-bold text-white">{activeDays}</span>{' '}
            active days
          </div>

          <div className="text-xs font-mono text-[#8a8c9c]">
            <span className="font-bold text-white">{totalConcepts}</span>{' '}
            concepts
          </div>

          <div className="text-xs font-mono text-[#8a8c9c]">
            <span className="font-bold text-[#ffdb1a]">
              {Number.isFinite(consistency)
                ? consistency.toFixed(1)
                : '0.0'}
              %
            </span>{' '}
            consistency
          </div>
        </div>

        {/* Legend */}

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#77798a]">
          <span>Less</span>

          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((intensity) => (
              <span
                key={intensity}
                className="h-3 w-3 rounded-[2px]"
                style={getCellStyle({
                  date: '',
                  dateObj: new Date(),
                  count: intensity,
                  commits: [],
                  intensity: intensity as 0 | 1 | 2 | 3 | 4 | 5,
                  dayOfWeek: 0,
                  isToday: false,
                  isFuture: false,
                })}
              />
            ))}
          </div>

          <span>More</span>
        </div>
      </div>

      {/* ---------------------------------------------------
          Tooltip
      --------------------------------------------------- */}

      {tooltipElement}
    </section>
  );
};

export default ContributionGraph;