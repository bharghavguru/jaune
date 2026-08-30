import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (commitData: {
    concept: string;
    category: string;
    notes?: string;
    difficulty?: 'Foundational' | 'Intermediate' | 'Advanced';
    tags?: string[];
  }) => void;
  categories: string[];
}

export const CommitModal: React.FC<CommitModalProps> = ({
  isOpen,
  onClose,
  onCommit,
  categories,
}) => {
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Data Structures');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<'Foundational' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConcept('');
      setNotes('');
      setTagsInput('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) {
      setError('Please enter a concept name to commit.');
      sound.playClick(400);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    sound.playCommitSuccess();

    onCommit({
      concept: concept.trim(),
      category,
      notes: notes.trim() || undefined,
      difficulty,
      tags: tags.length > 0 ? tags : undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  const quickConcepts = [
    { label: 'Trie Data Structure', cat: 'Data Structures', diff: 'Intermediate' as const },
    { label: 'Virtual Threads (Loom)', cat: 'Java', diff: 'Advanced' as const },
    { label: 'B-Tree Indexing in PostgreSQL', cat: 'SQL', diff: 'Advanced' as const },
    { label: 'TCP 3-Way Handshake & SYN Floods', cat: 'Computer Networks', diff: 'Foundational' as const },
    { label: 'React 19 Server Actions & Transitions', cat: 'React', diff: 'Intermediate' as const },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-[#14151d] border border-[#2e2f3d] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#22232f] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ffdb1a]/15 text-[#ffdb1a] shadow-[0_0_12px_rgba(255,219,26,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug">
                Commit New Learning
              </h3>
              <p className="text-xs text-[#8c8d9c]">
                Brighten today's contribution cell & strengthen your streak.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick(1000);
              onClose();
            }}
            className="p-1.5 text-[#888998] hover:text-white rounded-lg hover:bg-[#20212d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick suggestions */}
          <div>
            <label className="block text-[11px] font-mono text-[#8a8b9a] mb-1.5">
              Quick Suggestions (Click to fill):
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickConcepts.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    sound.playClick(1100);
                    setConcept(item.label);
                    setCategory(item.cat);
                    setDifficulty(item.diff);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] bg-[#1a1b24] hover:bg-[#232431] text-[#9b9ca8] hover:text-white border border-[#272836] whitespace-nowrap transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Input */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Concept / Topic Name <span className="text-[#ffdb1a]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="e.g., Trie Prefix Matching, CAP Theorem, B-Trees..."
              value={concept}
              onChange={(e) => {
                setConcept(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#1a1b24] border border-[#2d2f3d] text-white text-sm outline-none focus:border-[#ffdb1a] focus:ring-1 focus:ring-[#ffdb1a] transition-all placeholder-[#555666] font-medium"
            />
          </div>

          {/* Category & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Knowledge Space
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-[#1a1b24] border border-[#2d2f3d] text-white text-xs font-mono outline-none focus:border-[#ffdb1a] transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#14151d] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Mastery Level
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#1a1b24] p-1 rounded-xl border border-[#2d2f3d]">
                {(['Foundational', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => {
                      sound.playClick(1000);
                      setDifficulty(lvl);
                    }}
                    className={`py-1.5 text-[10px] font-mono rounded-lg transition-colors truncate px-1 ${
                      difficulty === lvl
                        ? 'bg-[#ffdb1a] text-black font-bold'
                        : 'text-[#8a8b9a] hover:text-white'
                    }`}
                  >
                    {lvl === 'Foundational' ? 'Basic' : lvl === 'Intermediate' ? 'Inter' : 'Adv'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Synthesis Notes & Code Insights{' '}
              <span className="text-[#6d6e7e] font-normal font-mono text-[11px]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="What core intuition did you unlock? Key trade-offs, time complexities, or edge cases..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2d2f3d] text-white text-xs font-mono outline-none focus:border-[#ffdb1a] focus:ring-1 focus:ring-[#ffdb1a] transition-all placeholder-[#555666] resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Tags{' '}
              <span className="text-[#6d6e7e] font-normal font-mono text-[11px]">(Comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="algorithms, trees, system-design"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#1a1b24] border border-[#2d2f3d] text-white text-xs outline-none focus:border-[#ffdb1a] transition-all placeholder-[#555666]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[44px] py-3 rounded-xl bg-[#ffdb1a] text-black font-bold font-display text-sm tracking-wide shadow-[0_0_20px_rgba(255,219,26,0.35)] hover:shadow-[0_0_25px_rgba(255,219,26,0.6)] hover:bg-[#ffe043] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Commit Concept & Brighten Today</span>
            </button>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#101117] border-t border-[#1f202b] flex items-center justify-between text-[11px] font-mono text-[#6c6d7d] shrink-0">
          <span>JAUNE Commit Engine</span>
          <span className="text-[#ffdb1a]">Press ⌘+Enter to submit</span>
        </div>
      </motion.div>
    </div>
  );
};
