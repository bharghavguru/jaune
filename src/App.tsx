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

export default function App() {
  const [user] = useState(INITIAL_USER);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [todayCommits, setTodayCommits] = useState<LearningCommit[]>(INITIAL_TODAY_COMMITS);
  const [spaces, setSpaces] = useState<LearningSpace[]>(INITIAL_SPACES);
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate the year contribution days tied to today's commits
  const contributionDays = useMemo(() => {
    return generateYearContributions(todayCommits);
  }, [todayCommits]);

  // Handle keyboard shortcuts globally
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'c' && !isInput && !isCommitModalOpen && !isCommandPaletteOpen) {
        e.preventDefault();
        sound.playClick(1000);
        setIsCommitModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommitModalOpen, isCommandPaletteOpen]);

  // Handle committing new concept
  const handleCommitLearning = (
    newCommitData: {
      concept: string;
      category: string;
      notes?: string;
      difficulty?: 'Foundational' | 'Intermediate' | 'Advanced';
      tags?: string[];
    }
  ) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;

    const newCommit: LearningCommit = {
      id: `commit-live-${Date.now()}`,
      concept: newCommitData.concept,
      category: newCommitData.category,
      notes: newCommitData.notes,
      difficulty: newCommitData.difficulty,
      tags: newCommitData.tags,
      timestamp: timeFormatted,
      dateString: '2026-08-30',
    };

    // 1. Prepend to today's commits
    setTodayCommits((prev) => [newCommit, ...prev]);

    // 2. Increment spaces count & last active
    setSpaces((prevSpaces) => {
      const exists = prevSpaces.some((s) => s.name === newCommitData.category);
      if (exists) {
        return prevSpaces.map((s) =>
          s.name === newCommitData.category
            ? {
                ...s,
                conceptsLearned: s.conceptsLearned + 1,
                lastActivity: `Today, ${timeFormatted}`,
              }
            : s
        );
      } else {
        // Add new space dynamically if custom
        const newSpace: LearningSpace = {
          id: `space-${Date.now()}`,
          name: newCommitData.category,
          conceptCount: 1,
          conceptsLearned: 1,
          totalConceptsGoal: 100,
          color: '#FFDB1A',
          description: `Custom domain created for ${newCommitData.category}.`,
          masteryLevel: 'Core',
          level: 'Core',
          lastActive: `Today, ${timeFormatted}`,
          tags: [newCommitData.category.toLowerCase().replace(/\s+/g, '-')],
        };
        return [...prevSpaces, newSpace];
      }
    });

    // 3. Update lifetime metrics
    setStats((prev) => ({
      ...prev,
      totalConcepts: prev.totalConcepts + 1,
      totalContributions: prev.totalContributions + 1,
    }));

    // 4. Show celebratory toast
    setToastMessage(`Committed "${newCommit.concept}" to ${newCommit.category}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectSpace = (spaceName: string) => {
    setSelectedCategoryFilter(spaceName);
    setActiveTab('Overview');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const categoriesList = useMemo(() => {
    return ['All', ...spaces.map((s) => s.name)];
  }, [spaces]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0c0d10] text-[#f3f3ee] flex flex-col selection:bg-[#ffdb1a] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenCommit={() => setIsCommitModalOpen(true)}
        streak={stats.streakCurrent}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        {/* Dynamic Greeting & Primary Commit CTA */}
        <DashboardHeader
          userName={user.name}
          onOpenCommit={() => setIsCommitModalOpen(true)}
          streak={stats.streakCurrent}
          todayCount={todayCommits.length}
        />

        {/* Tab 1: Overview (Hero Dashboard View) */}
        {activeTab === 'Overview' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* 1. Key Metrics Section */}
            <Metrics stats={stats} todayCount={todayCommits.length} />

            {/* 2. Hero Feature: Year Contribution Heatmap */}
            <ContributionGraph
              todayCommits={todayCommits}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              categories={categoriesList}
              onQuickCommit={() => setIsCommitModalOpen(true)}
            />

            {/* 3. Dual Section: Today's Learning Timeline + Streak Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Today's Learning Stream (7 columns on desktop) */}
              <div className="lg:col-span-7 h-full">
                <TodayLearning
                  commits={todayCommits}
                  onAddClick={() => setIsCommitModalOpen(true)}
                />
              </div>

              {/* Streak Experience Card (5 columns on desktop) */}
              <div className="lg:col-span-5 h-full">
                <StreakCard
                  currentStreak={stats.streakCurrent}
                  longestStreak={stats.streakLongest}
                  todayCount={todayCommits.length}
                />
              </div>
            </div>

            {/* 4. Learning Spaces Section */}
            <LearningSpaces
              spaces={spaces}
              onSelectSpace={handleSelectSpace}
              onOpenCommit={() => setIsCommitModalOpen(true)}
            />

            {/* 5. Learning Analytics & Insights Section */}
            <LearningInsights stats={stats} />
          </motion.div>
        )}

        {/* Tab 2: Learning Timeline View */}
        {activeTab === 'Learning' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              <div className="lg:col-span-8">
                <TodayLearning
                  commits={todayCommits}
                  onAddClick={() => setIsCommitModalOpen(true)}
                />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <StreakCard
                  currentStreak={stats.streakCurrent}
                  longestStreak={stats.streakLongest}
                  todayCount={todayCommits.length}
                />
                <div className="p-4 sm:p-5 rounded-xl bg-[#121318] border border-[#23242c]">
                  <h4 className="text-sm font-bold text-white font-display mb-2">
                    Learning Commit Guidelines
                  </h4>
                  <p className="text-xs text-[#8c8d9d] leading-relaxed">
                    Commit concepts when you reach functional comprehension — after implementing, writing, or explaining the core theorem.
                  </p>
                  <button
                    onClick={() => setIsCommitModalOpen(true)}
                    className="mt-4 w-full py-2.5 min-h-[44px] rounded-lg bg-[#ffdb1a] text-black font-semibold text-xs hover:bg-[#ffe043] transition-colors"
                  >
                    + Commit New Concept
                  </button>
                </div>
              </div>
            </div>

            <ContributionGraph
              todayCommits={todayCommits}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              categories={categoriesList}
              onQuickCommit={() => setIsCommitModalOpen(true)}
            />
          </motion.div>
        )}

        {/* Tab 3: Insights View */}
        {activeTab === 'Insights' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-8"
          >
            <Metrics stats={stats} todayCount={todayCommits.length} />
            <LearningInsights stats={stats} />
            <ContributionGraph
              days={contributionDays}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              categories={categoriesList}
              onQuickCommit={() => setIsCommitModalOpen(true)}
            />
          </motion.div>
        )}

        {/* Tab 4: Spaces View */}
        {activeTab === 'Spaces' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-8"
          >
            <LearningSpaces
              spaces={spaces}
              onSelectSpace={handleSelectSpace}
              onOpenCommit={() => setIsCommitModalOpen(true)}
            />
            <ContributionGraph
              days={contributionDays}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              categories={categoriesList}
              onQuickCommit={() => setIsCommitModalOpen(true)}
            />
          </motion.div>
        )}

        {/* Tab 5: Profile View */}
        {activeTab === 'Profile' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-8"
          >
            <ProfilePreview
              user={user}
              stats={stats}
              onOpenCommit={() => setIsCommitModalOpen(true)}
            />
            <ContributionGraph
              days={contributionDays}
              selectedCategory="All"
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              categories={categoriesList}
              onQuickCommit={() => setIsCommitModalOpen(true)}
            />
          </motion.div>
        )}
      </main>

      {/* Futuristic Editorial Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-[#1a1b24] bg-[#090a0d] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-[#707182]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-[4px] bg-[#ffdb1a] flex items-center justify-center text-black font-extrabold text-[10px]">
              J
            </div>
            <span className="font-bold text-white tracking-wider font-display">JAUNE</span>
            <span className="text-[#4e4f5e]">/</span>
            <span className="font-mono text-[#a5a6b5]">Visual Learning-Progress Platform</span>
          </div>

          {/* Philosophy Banner */}
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-[#9192a3] flex-wrap justify-center">
            <span>Consistency &gt; Intensity</span>
            <span className="text-[#4e4f5e]">•</span>
            <span>Progress &gt; Perfection</span>
            <span className="text-[#4e4f5e]">•</span>
            <span className="text-[#ffdb1a]">Every concept counts.</span>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-[#5c5d6e]">
            2026 Engine • Designed for Serious Learners
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onCommit={handleCommitLearning}
        categories={spaces.map((s) => s.name)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCommit={() => {
          setIsCommandPaletteOpen(false);
          setIsCommitModalOpen(true);
        }}
        onSelectSpace={(sp) => setSelectedCategoryFilter(sp)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
