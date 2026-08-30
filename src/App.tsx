import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_SPACES,
  INITIAL_TODAY_COMMITS,
  INITIAL_STATS,
  generateYearContributions,
} from './data/initialData';
import { LearningCommit, LearningSpace } from './types';
import { Navbar } from './components/Navbar';
import { DashboardHeader } from './components/DashboardHeader';
import { Metrics } from './components/Metrics';
import { ContributionGraph } from './components/ContributionGraph';
import { TodayLearning } from './components/TodayLearning';
import { StreakCard } from './components/StreakCard';
import { LearningSpaces } from './components/LearningSpaces';
import { LearningInsights } from './components/LearningInsights';
import { ProfilePreview } from './components/ProfilePreview';
import { CommitModal } from './components/CommitModal';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { motion } from 'motion/react';
import { sound } from './utils/sound';
import {
  loadLearningCommits,
  saveLearningCommits,
} from './utils/storage';

export default function App() {
  const [user] = useState(INITIAL_USER);

  const [stats, setStats] = useState(INITIAL_STATS);

  /*
   * Complete learning history.
   *
   * This is now the main source of truth for
   * all learning commits in JAUNE.
   */
  const [learningCommits, setLearningCommits] =
    useState<LearningCommit[]>(() => {
      const savedCommits = loadLearningCommits();

      return savedCommits.length > 0
        ? savedCommits
        : INITIAL_TODAY_COMMITS;
    });

  /*
   * Today's commits are derived from the
   * complete learning history.
   *
   * We don't store today's commits separately.
   */
  const todayCommits = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();

    const month = (now.getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const day = now
      .getDate()
      .toString()
      .padStart(2, '0');

    const today = `${year}-${month}-${day}`;

    return learningCommits.filter(
      (commit) => commit.dateString === today
    );
  }, [learningCommits]);

  const [spaces, setSpaces] =
    useState<LearningSpace[]>(INITIAL_SPACES);

  const [activeTab, setActiveTab] =
    useState<string>('Overview');

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('All');

  const [isCommitModalOpen, setIsCommitModalOpen] =
    useState(false);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /*
   * Save complete learning history
   * whenever it changes.
   */
  useEffect(() => {
    saveLearningCommits(learningCommits);
  }, [learningCommits]);

  /*
   * Generate contribution graph from
   * ALL learning history.
   */
  const contributionDays = useMemo(() => {
    return generateYearContributions(
      learningCommits
    );
  }, [learningCommits]);

  /*
   * Global keyboard shortcuts.
   *
   * Ctrl + K / Cmd + K → Command Palette
   * C → Commit new concept
   */
  useEffect(() => {
    const handleGlobalKeyDown = (
      e: KeyboardEvent
    ) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      /*
       * Command Palette
       */
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'k'
      ) {
        e.preventDefault();

        setIsCommandPaletteOpen(
          (prev) => !prev
        );

        return;
      }

      /*
       * Quick Commit
       */
      if (
        e.key.toLowerCase() === 'c' &&
        !isInput &&
        !isCommitModalOpen &&
        !isCommandPaletteOpen
      ) {
        e.preventDefault();

        sound.playClick(1000);

        setIsCommitModalOpen(true);
      }
    };

    window.addEventListener(
      'keydown',
      handleGlobalKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleGlobalKeyDown
      );
    };
  }, [
    isCommitModalOpen,
    isCommandPaletteOpen,
  ]);

  /*
   * Create a new learning commit.
   */
  const handleCommitLearning = (
    newCommitData: {
      concept: string;
      category: string;
      notes?: string;
      difficulty?:
        | 'Foundational'
        | 'Intermediate'
        | 'Advanced';
      tags?: string[];
    }
  ) => {
    const now = new Date();

    /*
     * Current time
     */
    const hours = now
      .getHours()
      .toString()
      .padStart(2, '0');

    const minutes = now
      .getMinutes()
      .toString()
      .padStart(2, '0');

    const timeFormatted =
      `${hours}:${minutes}`;

    /*
     * Current local date
     *
     * Format:
     * YYYY-MM-DD
     */
    const year =
      now.getFullYear();

    const month =
      (now.getMonth() + 1)
        .toString()
        .padStart(2, '0');

    const day =
      now.getDate()
        .toString()
        .padStart(2, '0');

    const dateString =
      `${year}-${month}-${day}`;

    /*
     * Create learning commit
     */
    const newCommit: LearningCommit = {
      id: `commit-live-${Date.now()}`,

      concept:
        newCommitData.concept.trim(),

      category:
        newCommitData.category,

      notes:
        newCommitData.notes,

      difficulty:
        newCommitData.difficulty,

      tags:
        newCommitData.tags,

      timestamp:
        timeFormatted,

      dateString,
    };

    /*
     * Add commit to COMPLETE history.
     */
    setLearningCommits((prev) => [
      newCommit,
      ...prev,
    ]);

    /*
     * Update Learning Spaces.
     */
    setSpaces((prevSpaces) => {
      const existingSpace =
        prevSpaces.find(
          (space) =>
            space.name ===
            newCommitData.category
        );

      /*
       * Existing space
       */
      if (existingSpace) {
        return prevSpaces.map(
          (space) => {
            if (
              space.name !==
              newCommitData.category
            ) {
              return space;
            }

            return {
              ...space,

              conceptsLearned:
                (space.conceptsLearned ?? 0) +
                1,

              conceptCount:
                (space.conceptCount ?? 0) +
                1,

              lastActive:
                `Today, ${timeFormatted}`,
            };
          }
        );
      }

      /*
       * Create a new custom space.
       */
      const newSpace: LearningSpace = {
        id:
          `space-${Date.now()}`,

        name:
          newCommitData.category,

        conceptCount: 1,

        conceptsLearned: 1,

        totalConceptsGoal: 100,

        color: '#FFDB1A',

        description:
          `Custom domain created for ${newCommitData.category}.`,

        masteryLevel:
          'Core',

        level:
          'Core',

        lastActive:
          `Today, ${timeFormatted}`,

        tags: [
          newCommitData.category
            .toLowerCase()
            .replace(/\s+/g, '-'),
        ],
      };

      return [
        ...prevSpaces,
        newSpace,
      ];
    });

    /*
     * Update statistics.
     */
    setStats((prevStats) => ({
      ...prevStats,

      totalConcepts:
        prevStats.totalConcepts + 1,

      totalContributions:
        prevStats.totalContributions + 1,

      conceptsThisWeek:
        prevStats.conceptsThisWeek + 1,

      conceptsThisMonth:
        prevStats.conceptsThisMonth + 1,
    }));

    /*
     * Success toast.
     */
    setToastMessage(
      `Committed "${newCommit.concept}" to ${newCommit.category}`
    );

    /*
     * Close commit modal.
     */
    setIsCommitModalOpen(false);

    /*
     * Remove toast.
     */
    window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /*
   * Select a learning space.
   */
  const handleSelectSpace = (
    spaceName: string
  ) => {
    setSelectedCategoryFilter(
      spaceName
    );

    setActiveTab('Overview');

    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
  };

  /*
   * Categories for filtering.
   */
  const categoriesList = useMemo(() => {
    return [
      'All',
      ...spaces.map(
        (space) => space.name
      ),
    ];
  }, [spaces]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0c0d10] text-[#f3f3ee] flex flex-col selection:bg-[#ffdb1a] selection:text-black">

      {/* =========================
          NAVBAR
      ========================== */}

      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) =>
          setActiveTab(tab)
        }
        onOpenSearch={() =>
          setIsCommandPaletteOpen(true)
        }
        onOpenCommit={() =>
          setIsCommitModalOpen(true)
        }
        streak={
          stats.streakCurrent
        }
        user={user}
      />

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">

        {/* Dashboard Header */}

        <DashboardHeader
          userName={user.name}
          onOpenCommit={() =>
            setIsCommitModalOpen(true)
          }
          streak={
            stats.streakCurrent
          }
          todayCount={
            todayCommits.length
          }
        />

        {/* =========================
            OVERVIEW
        ========================== */}

        {activeTab === 'Overview' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.18,
            }}
            className="space-y-6 sm:space-y-8"
          >

            <Metrics
              stats={stats}
              todayCount={
                todayCommits.length
              }
            />

            <ContributionGraph
              todayCommits={
                todayCommits
              }
              selectedCategory={
                selectedCategoryFilter
              }
              onSelectCategory={(cat) =>
                setSelectedCategoryFilter(cat)
              }
              categories={
                categoriesList
              }
              onQuickCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

              <div className="lg:col-span-7 h-full">

                <TodayLearning
                  commits={
                    todayCommits
                  }
                  onAddClick={() =>
                    setIsCommitModalOpen(true)
                  }
                />

              </div>

              <div className="lg:col-span-5 h-full">

                <StreakCard
                  currentStreak={
                    stats.streakCurrent
                  }
                  longestStreak={
                    stats.streakLongest
                  }
                  todayCount={
                    todayCommits.length
                  }
                />

              </div>

            </div>

            <LearningSpaces
              spaces={spaces}
              onSelectSpace={
                handleSelectSpace
              }
              onOpenCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

            <LearningInsights
              stats={stats}
            />

          </motion.div>
        )}

        {/* =========================
            LEARNING
        ========================== */}

        {activeTab === 'Learning' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.18,
            }}
            className="space-y-6 sm:space-y-8"
          >

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

              <div className="lg:col-span-8">

                <TodayLearning
                  commits={
                    todayCommits
                  }
                  onAddClick={() =>
                    setIsCommitModalOpen(true)
                  }
                />

              </div>

              <div className="lg:col-span-4 space-y-6">

                <StreakCard
                  currentStreak={
                    stats.streakCurrent
                  }
                  longestStreak={
                    stats.streakLongest
                  }
                  todayCount={
                    todayCommits.length
                  }
                />

                <div className="p-4 sm:p-5 rounded-xl bg-[#121318] border border-[#23242c]">

                  <h4 className="text-sm font-bold text-white font-display mb-2">
                    Learning Commit Guidelines
                  </h4>

                  <p className="text-xs text-[#8c8d9d] leading-relaxed">
                    Commit concepts when you reach functional comprehension — after implementing, writing, or explaining the core theorem.
                  </p>

                  <button
                    onClick={() =>
                      setIsCommitModalOpen(true)
                    }
                    className="mt-4 w-full py-2.5 min-h-[44px] rounded-lg bg-[#ffdb1a] text-black font-semibold text-xs hover:bg-[#ffe043] transition-colors"
                  >
                    + Commit New Concept
                  </button>

                </div>

              </div>

            </div>

            <ContributionGraph
              todayCommits={
                todayCommits
              }
              selectedCategory={
                selectedCategoryFilter
              }
              onSelectCategory={(cat) =>
                setSelectedCategoryFilter(cat)
              }
              categories={
                categoriesList
              }
              onQuickCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

          </motion.div>
        )}

        {/* =========================
            INSIGHTS
        ========================== */}

        {activeTab === 'Insights' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.18,
            }}
            className="space-y-6 sm:space-y-8"
          >

            <Metrics
              stats={stats}
              todayCount={
                todayCommits.length
              }
            />

            <LearningInsights
              stats={stats}
            />

            <ContributionGraph
              days={
                contributionDays
              }
              selectedCategory={
                selectedCategoryFilter
              }
              onSelectCategory={(cat) =>
                setSelectedCategoryFilter(cat)
              }
              categories={
                categoriesList
              }
              onQuickCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

          </motion.div>
        )}

        {/* =========================
            SPACES
        ========================== */}

        {activeTab === 'Spaces' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.18,
            }}
            className="space-y-6 sm:space-y-8"
          >

            <LearningSpaces
              spaces={spaces}
              onSelectSpace={
                handleSelectSpace
              }
              onOpenCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

            <ContributionGraph
              days={
                contributionDays
              }
              selectedCategory={
                selectedCategoryFilter
              }
              onSelectCategory={(cat) =>
                setSelectedCategoryFilter(cat)
              }
              categories={
                categoriesList
              }
              onQuickCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

          </motion.div>
        )}

        {/* =========================
            PROFILE
        ========================== */}

        {activeTab === 'Profile' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.18,
            }}
            className="space-y-6 sm:space-y-8"
          >

            <ProfilePreview
              user={user}
              stats={stats}
              onOpenCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

            <ContributionGraph
              days={
                contributionDays
              }
              selectedCategory="All"
              onSelectCategory={(cat) =>
                setSelectedCategoryFilter(cat)
              }
              categories={
                categoriesList
              }
              onQuickCommit={() =>
                setIsCommitModalOpen(true)
              }
            />

          </motion.div>
        )}

      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="mt-12 sm:mt-16 border-t border-[#1a1b24] bg-[#090a0d] py-8 sm:py-10">

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-[#707182]">

          <div className="flex items-center gap-3">

            <div className="w-5 h-5 rounded-[4px] bg-[#ffdb1a] flex items-center justify-center text-black font-extrabold text-[10px]">
              J
            </div>

            <span className="font-bold text-white tracking-wider font-display">
              JAUNE
            </span>

            <span className="text-[#4e4f5e]">
              /
            </span>

            <span className="font-mono text-[#a5a6b5]">
              Visual Learning-Progress Platform
            </span>

          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-[#9192a3] flex-wrap justify-center">

            <span>
              Consistency &gt; Intensity
            </span>

            <span className="text-[#4e4f5e]">
              •
            </span>

            <span>
              Progress &gt; Perfection
            </span>

            <span className="text-[#4e4f5e]">
              •
            </span>

            <span className="text-[#ffdb1a]">
              Every concept counts.
            </span>

          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-[#5c5d6e]">
            2026 Engine • Designed for Serious Learners
          </div>

        </div>

      </footer>

      {/* =========================
          COMMIT MODAL
      ========================== */}

      <CommitModal
        isOpen={
          isCommitModalOpen
        }
        onClose={() =>
          setIsCommitModalOpen(false)
        }
        onCommit={
          handleCommitLearning
        }
        categories={spaces.map(
          (space) => space.name
        )}
      />

      {/* =========================
          COMMAND PALETTE
      ========================== */}

      <CommandPalette
        isOpen={
          isCommandPaletteOpen
        }
        onClose={() =>
          setIsCommandPaletteOpen(false)
        }
        onNavigate={(tab) =>
          setActiveTab(tab)
        }
        onOpenCommit={() => {
          setIsCommandPaletteOpen(false);
          setIsCommitModalOpen(true);
        }}
        onSelectSpace={(space) =>
          setSelectedCategoryFilter(
            space
          )
        }
      />

      {/* =========================
          TOAST
      ========================== */}

      <Toast
        message={
          toastMessage
        }
        onClose={() =>
          setToastMessage(null)
        }
      />

    </div>
  );
}