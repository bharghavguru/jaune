import {
  LearningCommit,
  LearningSpace,
  UserStats,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  commits: 'jaune_commits',
  spaces: 'jaune_spaces',
  stats: 'jaune_stats',
  user: 'jaune_user',
} as const;

function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  );
}

// =====================================================
// LEARNING COMMITS
// =====================================================

export function loadLearningCommits(
  fallback: LearningCommit[] = []
): LearningCommit[] {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.commits);

    if (!saved) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return fallback;
    }

    return parsed as LearningCommit[];
  } catch (error) {
    console.error('JAUNE: Failed to load learning commits.', error);
    return fallback;
  }
}

export function saveLearningCommits(
  commits: LearningCommit[]
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.commits,
      JSON.stringify(commits)
    );
  } catch (error) {
    console.error('JAUNE: Failed to save learning commits.', error);
  }
}

// =====================================================
// LEARNING SPACES
// =====================================================

export function loadSpaces(
  fallback: LearningSpace[] = []
): LearningSpace[] {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.spaces);

    if (!saved) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return fallback;
    }

    return parsed as LearningSpace[];
  } catch (error) {
    console.error('JAUNE: Failed to load learning spaces.', error);
    return fallback;
  }
}

export function saveSpaces(
  spaces: LearningSpace[]
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.spaces,
      JSON.stringify(spaces)
    );
  } catch (error) {
    console.error('JAUNE: Failed to save learning spaces.', error);
  }
}

// =====================================================
// USER STATS
// =====================================================

export function loadStats(
  fallback: UserStats
): UserStats {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.stats);

    if (!saved) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    return {
      ...fallback,
      ...(parsed as Partial<UserStats>),
    };
  } catch (error) {
    console.error('JAUNE: Failed to load stats.', error);
    return fallback;
  }
}

export function saveStats(
  stats: UserStats
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.stats,
      JSON.stringify(stats)
    );
  } catch (error) {
    console.error('JAUNE: Failed to save stats.', error);
  }
}

// =====================================================
// USER PROFILE
// =====================================================

export function loadUser(
  fallback: UserProfile
): UserProfile {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.user);

    if (!saved) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    return {
      ...fallback,
      ...(parsed as Partial<UserProfile>),
    };
  } catch (error) {
    console.error('JAUNE: Failed to load user profile.', error);
    return fallback;
  }
}

export function saveUser(
  user: UserProfile
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error('JAUNE: Failed to save user profile.', error);
  }
}

// =====================================================
// CLEAR ALL JAUNE LOCAL DATA
// =====================================================

export function clearJauneStorage(): void {
  if (!isBrowser()) {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}