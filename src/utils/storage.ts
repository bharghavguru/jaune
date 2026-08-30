import { LearningCommit } from '../types';

const LEARNING_COMMITS_KEY = 'jaune-learning-commits';

/**
 * Load all learning commits saved in JAUNE.
 */
export function loadLearningCommits(): LearningCommit[] {
  try {
    const saved = localStorage.getItem(LEARNING_COMMITS_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as LearningCommit[];
  } catch (error) {
    console.error(
      'Failed to load learning commits:',
      error
    );

    return [];
  }
}

/**
 * Save all learning commits.
 */
export function saveLearningCommits(
  commits: LearningCommit[]
): void {
  try {
    localStorage.setItem(
      LEARNING_COMMITS_KEY,
      JSON.stringify(commits)
    );
  } catch (error) {
    console.error(
      'Failed to save learning commits:',
      error
    );
  }
}

/**
 * Add one new learning commit to history.
 */
export function addLearningCommit(
  commit: LearningCommit
): LearningCommit[] {
  const existingCommits = loadLearningCommits();

  const updatedCommits = [
    commit,
    ...existingCommits,
  ];

  saveLearningCommits(updatedCommits);

  return updatedCommits;
}

/**
 * Clear all saved learning history.
 *
 * Useful during development/testing.
 */
export function clearLearningHistory(): void {
  localStorage.removeItem(
    LEARNING_COMMITS_KEY
  );
}