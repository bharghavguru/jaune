import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Flame, Compass, Layers, Volume2, VolumeX, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenCommit: () => void;
  onSelectSpace: (space: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCommit,
  onSelectSpace,
}) => {
  const [query, setQuery] = useState('');
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick(1000);
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'c' && !isOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        sound.playClick(1000);
        onOpenCommit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onOpenCommit]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'commit',
      title: 'Commit New Learning',
      subtitle: 'Log a concept and brighten today\'s contribution cell',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenCommit();
      },
      badge: 'C',
    },
    {
      id: 'overview',
      title: 'Go to Overview Dashboard',
      subtitle: 'Heatmap, metrics, streak, and timeline',
      icon: Layers,
      action: () => {
        onClose();
        onNavigate('Overview');
      },
      badge: '1',
    },
    {
      id: 'learning',
      title: 'View Learning Timeline',
      subtitle: 'Chronological concepts and notes stream',
      icon: BookOpen,
      action: () => {
        onClose();
        onNavigate('Learning');
      },
      badge: '2',
    },
    {
      id: 'insights',
      title: 'Explore Learning Analytics',
      subtitle: 'Velocity curves, peak days, and consistency',
      icon: Flame,
      action: () => {
        onClose();
        onNavigate('Insights');
      },
      badge: '3',
    },
    {
      id: 'spaces',
      title: 'Browse Learning Spaces',
      subtitle: 'Data Structures, Java, SQL, Networks, React...',
      icon: Compass,
      action: () => {
        onClose();
        onNavigate('Spaces');
      },
      badge: '4',
    },
    {
      id: 'filter-ds',
      title: 'Filter Space: Data Structures',
      subtitle: 'Highlight 86 data structures concepts',
      icon: ArrowRight,
      action: () => {
        onClose();
        onNavigate('Overview');
        onSelectSpace('Data Structures');
      },
      badge: 'DS',
    },
    {
      id: 'filter-java',
      title: 'Filter Space: Java',
      subtitle: 'Highlight 54 Java JVM & concurrency concepts',
      icon: ArrowRight,
      action: () => {
        onClose();
        onNavigate('Overview');
        onSelectSpace('Java');
      },
      badge: 'JAVA',
    },
    {
      id: 'audio-toggle',
      title: isMuted ? 'Enable Tactile Audio Synth FX' : 'Mute Tactile Audio Synth FX',
      subtitle: 'Synthesizer clicks and glowing commit chords',
      icon: isMuted ? Volume2 : VolumeX,
      action: () => {
        const newState = sound.toggleMute();
        setIsMuted(!newState);
        sound.playClick(800);
      },
      badge: 'M',
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-xl bg-[#13141b] border border-[#2d2f3d] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#22232f]">
          <Search className="w-4 h-4 text-[#ffdb1a]" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, search concepts, or jump to space..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#555666] font-medium"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#1e1f2b] text-[10px] font-mono text-[#8a8b9a] border border-[#2c2d3c]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#717282]">
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick(1000);
                    item.action();
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#1a1b26] group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1f202c] text-[#8e8f9e] group-hover:text-[#ffdb1a] group-hover:bg-[#ffdb1a]/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#ffdb1a] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#717282]">{item.subtitle}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-[#1c1d28] border border-[#2b2c3c] text-[10px] font-mono text-[#8a8b9c]">
                    {item.badge}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Quick Footer */}
        <div className="px-4 py-2.5 bg-[#101117] border-t border-[#20212d] flex items-center justify-between text-[11px] font-mono text-[#6c6d7d]">
          <span>Navigation • JAUNE Core Engine</span>
          <span className="text-[#ffdb1a]">Press C to commit anywhere</span>
        </div>
      </motion.div>
    </div>
  );
};
