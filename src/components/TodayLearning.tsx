import React, { useState } from 'react';
import { LearningCommit } from '../types';
import { Plus, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface TodayLearningProps {
  commits: LearningCommit[];
  onAddClick: () => void;
}

export const TodayLearning: React.FC<TodayLearningProps> = ({ commits, onAddClick }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    sound.playClick(1100);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      id="today-learning-section"
      className="rounded-xl bg-[#121318] border border-[#23242c] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#202129] mb-3 sm:mb-4 gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
              Today's Learning
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-[#ffdb1a]/15 text-[#ffdb1a] border border-[#ffdb1a]/30">
              {commits.length} {commits.length === 1 ? 'concept' : 'concepts'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8c8d9c] mt-0.5">
            August 30, 2026 • Chronological activity stream
          </p>
        </div>

        <button
          id="btn-quick-commit-today"
          onClick={() => {
            sound.playClick(900);
            onAddClick();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1c1d25] hover:bg-[#252632] text-[#ffdb1a] border border-[#ffdb1a]/30 hover:border-[#ffdb1a] transition-all min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Log</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative flex-1 overflow-y-auto pr-1 max-h-[460px] space-y-2">
        <AnimatePresence initial={false}>
          {commits.length === 0 ? (
            <div className="py-10 text-center text-[#727382]">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#3d3e4d]" />
              <p className="text-sm font-medium">No concepts logged yet today.</p>
              <p className="text-xs text-[#5a5b6a] mt-1">
                Learn something new and commit your first breakthrough!
              </p>
              <button
                onClick={onAddClick}
                className="mt-3 px-3.5 py-2 rounded-lg bg-[#ffdb1a] text-black text-xs font-semibold hover:bg-[#ffe043] transition-colors"
              >
                + Commit Learning
              </button>
            </div>
          ) : (
            commits.map((commit, index) => {
              const isExpanded = expandedId === commit.id;
              const isLatest = index === 0;

              return (
                <motion.div
                  key={commit.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    relative group rounded-xl p-3 sm:p-3.5 transition-all
                    border ${
                      isLatest
                        ? 'bg-[#181922] border-[#ffdb1a]/30 hover:border-[#ffdb1a]/60 shadow-[0_2px_12px_rgba(255,219,26,0.06)]'
                        : 'bg-[#15161d] border-[#22232d] hover:border-[#313342]'
                    }
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3">
                    {/* Timestamp & Dot */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={`
                          w-2 h-2 rounded-full ring-2 ring-[#121318]
                          ${isLatest ? 'bg-[#ffdb1a] shadow-[0_0_8px_#ffdb1a]' : 'bg-[#5e6074]'}
                        `}
                      />
                      <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#8e8f9f]">
                        {commit.timestamp}
                      </span>
                    </div>

                    {/* Concept & Category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate group-hover:text-[#ffdb1a] transition-colors">
                          {commit.concept}
                        </h4>
                        <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#20212c] text-[#c4c5d4] border border-[#2b2c3a]">
                          {commit.category}
                        </span>
                      </div>

                      {/* Difficulty / Tags */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {commit.difficulty && (
                          <span className="text-[10px] text-[#ffdb1a]/80 font-mono">
                            [{commit.difficulty}]
                          </span>
                        )}
                        {commit.tags && commit.tags.length > 0 && (
                          <span className="text-[10px] text-[#717282] truncate">
                            {commit.tags.join(' • ')}
                          </span>
                        )}
                      </div>

                      {/* Expandable Notes */}
                      {commit.notes && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleExpand(commit.id)}
                            className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#868798] hover:text-[#ffdb1a] transition-colors py-0.5"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                <span>Hide notes</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                <span className="truncate max-w-[200px] sm:max-w-xs">
                                  {commit.notes.slice(0, 45)}...
                                </span>
                              </>
                            )}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-1.5 text-[11px] sm:text-xs text-[#bbbcd0] leading-relaxed bg-[#1b1c26] p-2.5 rounded border-l-2 border-[#ffdb1a] font-mono"
                              >
                                {commit.notes}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Motivational micro-footer */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#1d1e26] flex items-center justify-between text-[10px] sm:text-[11px] text-[#6d6e7e] font-mono">
        <span>Consistency &gt; Intensity</span>
        <span className="text-[#ffdb1a]">Today's Cell: Level {commits.length >= 9 ? 5 : commits.length >= 7 ? 4 : commits.length >= 5 ? 3 : commits.length >= 3 ? 2 : commits.length >= 1 ? 1 : 0}</span>
      </div>
    </div>
  );
};
