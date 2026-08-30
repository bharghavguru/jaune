import { ContributionDay, LearningCommit, LearningSpace, UserProfile, UserStats } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Bharghav',
  handle: 'bharghav',
  role: 'Computer Science • Learning in public',
  bio: 'Building foundational mastery across distributed systems, algorithms, and full-stack software architecture.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  location: 'San Francisco, CA',
  githubHandle: 'bharghav-cs',
  joinedDate: 'September 2025',
};

export const INITIAL_SPACES: LearningSpace[] = [
  {
    id: 'ds',
    name: 'Data Structures',
    conceptCount: 86,
    color: '#FFDB1A',
    description: 'Trees, Graphs, Hash Maps, Heaps, and Dynamic Programming foundations.',
    masteryLevel: 'Advanced',
    lastActive: 'Today, 19:32',
    iconName: 'Binary',
  },
  {
    id: 'java',
    name: 'Java',
    conceptCount: 54,
    color: '#E5B80B',
    description: 'JVM internals, Concurrency, Generics, Memory Model, and Spring.',
    masteryLevel: 'Proficient',
    lastActive: 'Today, 18:14',
    iconName: 'Coffee',
  },
  {
    id: 'sql',
    name: 'SQL',
    conceptCount: 32,
    color: '#B39217',
    description: 'Relational algebra, Query execution plans, B-Trees, and ACID isolation.',
    masteryLevel: 'Intermediate',
    lastActive: 'Today, 15:20',
    iconName: 'Database',
  },
  {
    id: 'networks',
    name: 'Computer Networks',
    conceptCount: 27,
    color: '#E6C020',
    description: 'TCP/IP stack, TLS 1.3 handshakes, DNS propagation, and WebSockets.',
    masteryLevel: 'Intermediate',
    lastActive: 'Today, 17:42',
    iconName: 'Network',
  },
  {
    id: 'react',
    name: 'React',
    conceptCount: 24,
    color: '#FFE24A',
    description: 'Fiber architecture, Server Actions, Suspense boundaries, and Custom Hooks.',
    masteryLevel: 'Proficient',
    lastActive: 'Today, 14:05',
    iconName: 'Layers',
  },
  {
    id: 'ts',
    name: 'TypeScript',
    conceptCount: 19,
    color: '#C7A218',
    description: 'Type gymnastics, Conditional types, Template literals, and AST transforms.',
    masteryLevel: 'Intermediate',
    lastActive: 'Today, 11:30',
    iconName: 'Code2',
  },
  {
    id: 'english',
    name: 'English',
    conceptCount: 18,
    color: '#D4AA10',
    description: 'Technical writing, RFC authoring, and presentation eloquence.',
    masteryLevel: 'Advanced',
    lastActive: 'Yesterday',
    iconName: 'BookOpen',
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    conceptCount: 15,
    color: '#F0C725',
    description: 'Distributed consensus, Raft, Kubernetes orchestration, and S3 consistency.',
    masteryLevel: 'Core',
    lastActive: 'Today, 09:15',
    iconName: 'Cloud',
  },
];

export const INITIAL_TODAY_COMMITS: LearningCommit[] = [
  {
    id: 'commit-1',
    concept: 'Binary Search',
    category: 'Data Structures',
    notes: 'Understood logarithmic time boundary division O(log n) and edge case handling for integer overflow (low + (high - low) / 2).',
    timestamp: '19:32',
    dateString: '2026-08-30',
    difficulty: 'Core',
    tags: ['Algorithms', 'Divide & Conquer', 'Search'],
  },
  {
    id: 'commit-2',
    concept: 'HashMap',
    category: 'Java',
    notes: 'Reviewed bucket collisions, load factor (0.75 threshold), and treeification into Red-Black trees when bucket length exceeds 8.',
    timestamp: '18:14',
    dateString: '2026-08-30',
    difficulty: 'Core',
    tags: ['Collections', 'Hash Table', 'Memory'],
  },
  {
    id: 'commit-3',
    concept: 'TCP Three-Way Handshake',
    category: 'Computer Networks',
    notes: 'Analyzed SYN, SYN-ACK, ACK sequence numbers, ISN generation, and state transitions from LISTEN to ESTABLISHED.',
    timestamp: '17:42',
    dateString: '2026-08-30',
    difficulty: 'Deep Dive',
    tags: ['Protocols', 'Transport Layer', 'TCP'],
  },
  {
    id: 'commit-4',
    concept: 'SQL Indexes & B+ Trees',
    category: 'SQL',
    notes: 'Covered clustered vs non-clustered index pages, seek vs scan mechanics, and multi-column index prefix matching.',
    timestamp: '15:20',
    dateString: '2026-08-30',
    difficulty: 'Deep Dive',
    tags: ['Database', 'Optimization', 'Storage'],
  },
  {
    id: 'commit-5',
    concept: 'React 19 Action Hooks',
    category: 'React',
    notes: 'Explored useActionState, useFormStatus, and optimistic updates via useOptimistic with non-blocking transitions.',
    timestamp: '14:05',
    dateString: '2026-08-30',
    difficulty: 'Core',
    tags: ['UI', 'State', 'Async'],
  },
  {
    id: 'commit-6',
    concept: 'TypeScript Generics Constraint',
    category: 'TypeScript',
    notes: 'Implemented `T extends Record<string, unknown>` and `keyof` narrowing for compile-time type invariance.',
    timestamp: '11:30',
    dateString: '2026-08-30',
    difficulty: 'Quick',
    tags: ['Type Safety', 'Generics'],
  },
  {
    id: 'commit-7',
    concept: 'Distributed Locks with Redis',
    category: 'Cloud Computing',
    notes: 'Reviewed Redlock algorithm safety guarantees, fencing tokens, and lease timeouts to avoid split-brain execution.',
    timestamp: '09:15',
    dateString: '2026-08-30',
    difficulty: 'Deep Dive',
    tags: ['Distributed Systems', 'Concurrency', 'Redis'],
  },
];

// Helper to determine contribution intensity strictly based on concept count
export function calculateIntensity(count: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (count <= 0) return 0; // 0 concepts -> empty/almost black
  if (count <= 2) return 1; // 1-2 concepts -> very pale yellow
  if (count <= 4) return 2; // 3-4 concepts -> soft yellow
  if (count <= 6) return 3; // 5-6 concepts -> golden yellow
  if (count <= 8) return 4; // 7-8 concepts -> bright yellow
  return 5; // 9+ concepts -> intense golden yellow with subtle glow
}

const CONCEPT_POOL: { concept: string; category: string }[] = [
  { concept: 'Binary Search Trees', category: 'Data Structures' },
  { concept: 'AVL Tree Rotations', category: 'Data Structures' },
  { concept: 'LRU Cache Invalidation', category: 'Data Structures' },
  { concept: 'Trie Auto-complete', category: 'Data Structures' },
  { concept: 'Graph BFS & DFS', category: 'Data Structures' },
  { concept: 'Dijkstra Shortest Path', category: 'Data Structures' },
  { concept: 'Topological Sort', category: 'Data Structures' },
  { concept: 'Dynamic Programming Knapsack', category: 'Data Structures' },
  { concept: 'JVM Garbage Collection G1', category: 'Java' },
  { concept: 'Java Virtual Threads & Loom', category: 'Java' },
  { concept: 'CompletableFuture Pipeline', category: 'Java' },
  { concept: 'AtomicReference & CAS', category: 'Java' },
  { concept: 'SQL Window Functions', category: 'SQL' },
  { concept: 'PostgreSQL EXPLAIN ANALYZE', category: 'SQL' },
  { concept: 'ACID Serializability Anomalies', category: 'SQL' },
  { concept: 'TCP Slow Start & Congestion Control', category: 'Computer Networks' },
  { concept: 'TLS 1.3 Zero-RTT Handshake', category: 'Computer Networks' },
  { concept: 'HTTP/3 over QUIC & UDP', category: 'Computer Networks' },
  { concept: 'DNS Anycast Routing', category: 'Computer Networks' },
  { concept: 'React Concurrent Rendering', category: 'React' },
  { concept: 'Zustand State Slices', category: 'React' },
  { concept: 'TypeScript Mapped Types', category: 'TypeScript' },
  { concept: 'Distributed Consensus with Raft', category: 'Cloud Computing' },
  { concept: 'Event Sourcing & CQRS', category: 'Cloud Computing' },
  { concept: 'Technical RFC Writing', category: 'English' },
  { concept: 'Concise Engineering Docs', category: 'English' },
  { concept: 'Database Sharding Strategies', category: 'SQL' },
  { concept: 'Rate Limiting Algorithms (Token Bucket)', category: 'Cloud Computing' },
  { concept: 'React Server Components Lifecycle', category: 'React' },
  { concept: 'B-Tree Node Splitting', category: 'Data Structures' },
];

/**
 * Generates an accurate, complete calendar year of contributions (Jan 1 to Dec 31).
 * Respects leap years, day-of-week offsets, and realistic learning distributions.
 */
export function generateContributionsForYear(
  year: number,
  todayCommits: LearningCommit[] = []
): ContributionDay[] {
  const days: ContributionDay[] = [];
  const isCurrentYear = year === 2026;
  const todayStr = '2026-08-30';

  // Check leap year
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  const startDate = new Date(Date.UTC(year, 0, 1, 12, 0, 0));

  for (let i = 0; i < daysInYear; i++) {
    const d = new Date(startDate);
    d.setUTCDate(startDate.getUTCDate() + i);

    const yearStr = d.getUTCFullYear().toString();
    const monthStr = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const dayStr = d.getUTCDate().toString().padStart(2, '0');
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

    const isToday = isCurrentYear && dateStr === todayStr;
    const isFuture = isCurrentYear && dateStr > todayStr;

    let dayCommits: LearningCommit[] = [];
    let count = 0;

    if (isToday) {
      dayCommits = todayCommits;
      count = todayCommits.length;
    } else if (isFuture) {
      count = 0;
      dayCommits = [];
    } else {
      // Seed based on year and day of year for deterministic, realistic pattern
      const dayOfYear = i + 1;
      const seed = Math.sin(year * 7919 + dayOfYear * 997 + 31) * 10000;
      const pseudoRand = seed - Math.floor(seed);

      const dayOfWeek = d.getUTCDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Active learning probability: ~62% for weekdays, ~75% for weekends
      const activeProbability = isWeekend ? 0.76 : 0.62;

      // In 2026, generate an active streak leading up to today (August 30)
      const isRecentStreak2026 =
        isCurrentYear && dateStr >= '2026-08-18' && dateStr < '2026-08-30';

      if (isRecentStreak2026) {
        // High active streak
        count = Math.floor(pseudoRand * 6) + 2; // 2 to 7 concepts
      } else if (pseudoRand < activeProbability) {
        // Realistic distribution across concepts (0, 1-2, 3-4, 5-6, 7-8, 9+)
        const intensitySeed = (pseudoRand * 17) % 1;
        if (intensitySeed < 0.35) {
          count = Math.floor(intensitySeed * 5) + 1; // 1-2
        } else if (intensitySeed < 0.68) {
          count = Math.floor(intensitySeed * 5) + 3; // 3-4
        } else if (intensitySeed < 0.88) {
          count = Math.floor(intensitySeed * 5) + 5; // 5-6
        } else if (intensitySeed < 0.96) {
          count = Math.floor(intensitySeed * 5) + 7; // 7-8
        } else {
          count = Math.floor(intensitySeed * 4) + 9; // 9-12 (intense glow)
        }
      } else {
        count = 0;
      }

      // Generate mock concept commit items
      for (let c = 0; c < count; c++) {
        const item = CONCEPT_POOL[(i * 3 + c * 7 + year * 5) % CONCEPT_POOL.length];
        const hour = (9 + (c * 2) % 14).toString().padStart(2, '0');
        const min = ((c * 17) % 60).toString().padStart(2, '0');
        dayCommits.push({
          id: `hist-${year}-${i}-${c}`,
          concept: item.concept,
          category: item.category,
          timestamp: `${hour}:${min}`,
          dateString: dateStr,
          difficulty: c % 3 === 0 ? 'Deep Dive' : c % 2 === 0 ? 'Core' : 'Quick',
        });
      }
    }

    days.push({
      date: dateStr,
      dateObj: d,
      count,
      commits: dayCommits,
      intensity: isFuture ? 0 : calculateIntensity(count),
      dayOfWeek: d.getUTCDay(),
      isToday,
      isFuture,
    });
  }

  return days;
}

// Backward compatibility alias for any existing imports
export function generateYearContributions(todayCommits: LearningCommit[]): ContributionDay[] {
  return generateContributionsForYear(2026, todayCommits);
}

export const INITIAL_STATS: UserStats = {
  streakCurrent: 12,
  streakLongest: 31,
  totalConcepts: 184,
  totalContributions: 427,
  conceptsThisWeek: 34,
  conceptsThisMonth: 98,
  mostActiveDay: 'Tuesday & Sunday',
  consistencyPercentage: 94.2,
};
