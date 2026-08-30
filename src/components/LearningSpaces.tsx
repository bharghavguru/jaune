import React, { useState } from 'react';
import { LearningSpace } from '../types';
import { Search, Compass, Clock, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface LearningSpacesProps {
  spaces: LearningSpace[];
  onSelectSpace: (spaceName: string) => void;
  onOpenCommit: () => void;
}

export const LearningSpaces: React.FC<LearningSpacesProps> = ({
  spaces,
  onSelectSpace,
  onOpenCommit,
}) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const filtered = spaces.filter((s) => {
    const tags = s.tags || [s.name.toLowerCase().replace(/\s+/g, '-')];
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    
    const currentLevel = s.level || s.masteryLevel || 'Intermediate';
    const matchesLevel =
      levelFilter === 'All' || currentLevel.toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#1f202a]">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffdb1a]" />
            Learning Spaces
          </h2>
          <p className="text-xs sm:text-sm text-[#9192a2] mt-0.5">
            Organized knowledge tracks. Focus your daily commits into deep conceptual mastery.
          </p>
        </div>

        {/* Search & Level Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#737485] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#14151d] border border-[#262734] text-xs text-white placeholder-[#555666] outline-none focus:border-[#ffdb1a] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#14151d] p-1 rounded-lg border border-[#262734] text-xs font-mono">
            {['All', 'Proficient', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sound.playClick(1000);
                  setLevelFilter(lvl);
                }}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] transition-colors ${
                  levelFilter === lvl
                    ? 'bg-[#ffdb1a] text-black font-bold'
                    : 'text-[#8b8c9c] hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spaces Grid: 1 col on Mobile, 2 on Tablet, 3-4 on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((space) => {
          const count = space.conceptsLearned ?? space.conceptCount ?? 0;
          const goal = space.totalConceptsGoal ?? 100;
          const progressPercent = Math.min(100, Math.round((count / goal) * 100));
          const tags = space.tags || [space.name.toLowerCase().replace(/\s+/g, '-')];

          return (
            <div
              key={space.id}
              onClick={() => {
                sound.playClick(1100);
                onSelectSpace(space.name);
              }}
              className="group rounded-xl bg-[#121319] border border-[#242531] hover:border-[#ffdb1a]/60 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(255,219,26,0.1)] hover:-translate-y-0.5"
            >
              <div>
                {/* Space Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: space.color || '#FFDB1A' }}
                    />
                    <h3 className="text-sm sm:text-base font-bold font-display text-white group-hover:text-[#ffdb1a] transition-colors">
                      {space.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1d27] text-[#9b9ca8] border border-[#2b2c3a]">
                    {space.masteryLevel || space.level || 'Core'}
                  </span>
                </div>

                <p className="text-xs text-[#8c8d9d] leading-relaxed line-clamp-2 mb-3">
                  {space.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#6e6f7f]">Progress</span>
                    <span className="text-white font-semibold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1e1f29] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#ffdb1a] shadow-[0_0_8px_rgba(255,219,26,0.8)] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181923] text-[#8e8f9e] border border-[#232432]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Space Footer */}
              <div className="mt-4 pt-3 border-t border-[#1d1e27] flex items-center justify-between text-xs text-[#7e7f90]">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-[#ffdb1a]" />
                  <span>
                    <strong className="text-white">{count}</strong> concepts
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#676878]">
                  <Clock className="w-3 h-3" />
                  <span>{space.lastActive}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-[#747585]">
          <p className="text-sm font-medium">No learning spaces match your filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setLevelFilter('All');
            }}
            className="mt-2 text-xs text-[#ffdb1a] hover:underline font-mono"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
