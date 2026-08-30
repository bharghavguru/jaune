import React, { useState } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Flame,
  User,
  Plus,
  Compass,
  Layers,
  BookOpen,
  TrendingUp,
  X,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenCommit: () => void;
  streak: number;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenCommit,
  streak,
  user,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: Layers },
    { name: 'Learning', icon: BookOpen },
    { name: 'Insights', icon: TrendingUp },
    { name: 'Spaces', icon: Compass },
    { name: 'Profile', icon: User },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Heatmap cell updated',
      desc: 'August 30 cell reached level 4 brightness with 7 concepts.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: '12-Day streak milestone',
      desc: 'You are 2 days away from a two-week unbroken run.',
      time: '2h ago',
      unread: false,
    },
    {
      id: '3',
      title: 'Domain leveled up',
      desc: 'Data Structures crossed 85 concepts mastered.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#1e1f28]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand JAUNE */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => {
              sound.playClick(900);
              onTabChange('Overview');
            }}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            aria-label="JAUNE Home"
          >
            {/* Geometric Glowing Emblem */}
            <div className="w-6 h-6 rounded-[5px] bg-[#ffdb1a] flex items-center justify-center shadow-[0_0_12px_rgba(255,219,26,0.6)] group-hover:scale-105 transition-transform">
              <div className="w-2.5 h-2.5 bg-black rounded-[2px]" />
            </div>
            <span className="font-extrabold font-display tracking-wider text-base sm:text-lg text-white">
              JAUNE
            </span>
          </button>

          {/* Desktop & Tablet Navigation Tabs (Hidden on mobile <768px) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  id={`nav-tab-${item.name.toLowerCase()}`}
                  onClick={() => {
                    sound.playClick(1100);
                    onTabChange(item.name);
                  }}
                  className={`
                    relative px-2.5 lg:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-[#8a8b9a] hover:text-[#e1e2ee] hover:bg-[#161720]'
                    }
                  `}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#ffdb1a] rounded-full shadow-[0_0_8px_#ffdb1a]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Search, Quick Commit, Streak, Audio, Notifications, Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Command Trigger (Hidden on small mobile) */}
          <button
            id="btn-quick-search"
            onClick={() => {
              sound.playClick(1000);
              onOpenSearch();
            }}
            aria-label="Open Command Palette"
            className="hidden sm:flex items-center gap-1.5 lg:gap-2 px-2.5 py-1.5 rounded-lg bg-[#161720] hover:bg-[#1f202b] text-[#868798] hover:text-white border border-[#242531] text-xs font-medium transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#ffdb1a]" />
            <span className="text-[11px] hidden md:inline">Search...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-[#20212b] text-[10px] font-mono text-[#747585] border border-[#2a2b38]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Commit Button for Mobile (<768px) */}
          <button
            id="btn-mobile-quick-commit"
            onClick={() => {
              sound.playClick(900);
              onOpenCommit();
            }}
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-[#ffdb1a] text-black font-bold shadow-[0_0_10px_rgba(255,219,26,0.4)] active:scale-95 transition-all"
            aria-label="Quick Commit Learning"
            title="Commit Learning"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Streak Badge */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-[#1c1d27] border border-[#ffdb1a]/25 text-xs font-mono text-white shrink-0">
            <Flame className="w-3.5 h-3.5 text-[#ffdb1a]" />
            <span className="font-bold text-[#ffdb1a]">{streak}</span>
            <span className="text-[10px] text-[#787989] hidden sm:inline">d</span>
          </div>

          {/* Audio FX Synth Toggle */}
          <button
            onClick={() => {
              const muted = !sound.toggleMute();
              setIsMuted(muted);
              sound.playClick(800);
            }}
            title={isMuted ? 'Tactile Audio Muted' : 'Tactile Audio Enabled'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-[#161720] hover:bg-[#1f202b] text-[#838495] hover:text-white border border-[#242531] transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#ffdb1a]" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick(1000);
                setShowNotifications(!showNotifications);
              }}
              aria-label="View Notifications"
              aria-expanded={showNotifications}
              className="relative p-1.5 rounded-lg bg-[#161720] hover:bg-[#1f202b] text-[#838495] hover:text-white border border-[#242531] transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ffdb1a]" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-80 rounded-xl bg-[#14151d] border border-[#292a38] shadow-2xl p-3 z-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#20212c] mb-2">
                      <span className="text-xs font-bold text-white font-display">
                        Notifications
                      </span>
                      <span className="text-[10px] font-mono text-[#ffdb1a]">1 unread</span>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs transition-colors ${
                            n.unread ? 'bg-[#1b1c26] border-l-2 border-[#ffdb1a]' : 'bg-[#161720]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium text-white mb-0.5">
                            <span className="truncate pr-1">{n.title}</span>
                            <span className="text-[10px] font-mono text-[#6c6d7d] shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[#8e8f9f] leading-snug">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => {
              sound.playClick(1000);
              onTabChange('Profile');
            }}
            aria-label="View Profile"
            className="flex items-center gap-2 pl-0.5 group cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-[#2f303f] group-hover:ring-[#ffdb1a] transition-all">
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-[#c5c6d5] group-hover:text-white hidden lg:inline max-w-[100px] truncate">
              {user.name}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar (<768px): Compact, Touch-friendly (Min 44px touch height) */}
      <nav
        className="flex md:hidden items-center justify-between border-t border-[#1a1b24] px-1 bg-[#0b0c10]/95"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              id={`mobile-nav-${item.name.toLowerCase()}`}
              onClick={() => {
                sound.playClick(1100);
                onTabChange(item.name);
              }}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 min-h-[44px] text-[11px] font-medium transition-colors relative
                ${
                  isActive
                    ? 'text-[#ffdb1a] font-bold'
                    : 'text-[#7d7e8e] hover:text-white'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#ffdb1a] rounded-full shadow-[0_0_6px_#ffdb1a]" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
