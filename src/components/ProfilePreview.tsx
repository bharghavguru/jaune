import React from 'react';
import { UserProfile, UserStats } from '../types';
import { Award, Flame, Calendar, BookOpen, Layers, CheckCircle2, Shield } from 'lucide-react';

interface ProfilePreviewProps {
  user: UserProfile;
  stats: UserStats;
  onOpenCommit: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  user,
  stats,
  onOpenCommit,
}) => {
  const badges = [
    { title: 'Consistency Architect', desc: 'Maintained an 85%+ consistency index for 6 months', icon: Award, unlocked: true },
    { title: 'Tree Master', desc: 'Mastered 30+ Binary & Balanced Tree concepts', icon: Layers, unlocked: true },
    { title: 'Luminous Day', desc: 'Achieved 9+ concepts logged in a single day', icon: Flame, unlocked: true },
    { title: 'Centurion', desc: 'Surpassed 100 verified conceptual commits', icon: CheckCircle2, unlocked: true },
    { title: 'Night Owl Scholar', desc: 'Logged 20+ concepts during evening peak hours', icon: Shield, unlocked: true },
    { title: 'One Year Horizon', desc: 'Maintain an active streak for 365 calendar days', icon: Calendar, unlocked: false },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Banner & Info */}
      <div className="rounded-xl bg-[#121319] border border-[#232431] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-[#1f202a]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden ring-2 ring-[#ffdb1a] shadow-[0_0_20px_rgba(255,219,26,0.3)]">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#ffdb1a] rounded-full text-black">
                <Flame className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-white">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-[#ffdb1a]/15 text-[#ffdb1a] border border-[#ffdb1a]/30">
                  PRO MEMBER
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#8b8c9c] mt-0.5">{user.handle}</p>
              <p className="text-xs text-[#b8b9c8] mt-1.5 max-w-md">{user.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={onOpenCommit}
              className="px-4 py-2 rounded-xl bg-[#ffdb1a] text-black font-bold text-xs sm:text-sm hover:bg-[#ffe043] transition-colors"
            >
              + Commit Concept
            </button>
          </div>
        </div>

        {/* Lifetime Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="p-3 rounded-lg bg-[#181922] border border-[#262734]">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#787989]">Joined JAUNE</span>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1">{user.joinedDate}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#181922] border border-[#262734]">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#787989]">Current Run</span>
            <div className="text-sm sm:text-base font-bold text-[#ffdb1a] font-mono mt-1">{stats.streakCurrent} days</div>
          </div>
          <div className="p-3 rounded-lg bg-[#181922] border border-[#262734]">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#787989]">Total Concepts</span>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1">{stats.totalConcepts}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#181922] border border-[#262734]">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#787989]">All-Time Commits</span>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-1">{stats.totalContributions}</div>
          </div>
        </div>
      </div>

      {/* Badges & Milestones */}
      <div className="rounded-xl bg-[#121319] border border-[#232431] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f202a] mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ffdb1a]" />
            <h3 className="text-base sm:text-lg font-bold font-display text-white">
              Earned Milestones & Achievements
            </h3>
          </div>
          <span className="text-xs font-mono text-[#ffdb1a]">5 / 6 Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  b.unlocked
                    ? 'bg-[#181923] border-[#2c2d3c] hover:border-[#ffdb1a]/50'
                    : 'bg-[#13141b] border-[#1f202a] opacity-50'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    b.unlocked ? 'bg-[#ffdb1a]/15 text-[#ffdb1a]' : 'bg-[#1f202b] text-[#555666]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-[#868798] mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
