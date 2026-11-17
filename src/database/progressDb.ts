import Dexie, { type Table } from 'dexie';
import { SubjectId } from '@/types/curriculum';

export interface ChapterProgress {
  chapterSlug: string;
  subjectId: SubjectId;
  completed: boolean;
  labVisited: boolean;
  bestQuizScore: number;
  totalQuestions: number;
  weakTopics: string[];
  updatedAt: string;
}

class SciencePlatformDB extends Dexie {
  chapterProgress!: Table<ChapterProgress, string>;

  constructor() {
    super('ScienceLearningPlatformDB');
    this.version(1).stores({
      chapterProgress: 'chapterSlug, subjectId, completed, updatedAt',
    });
  }
}

export const db = new SciencePlatformDB();

// Helper functions for saving progress
export async function markLabVisited(chapterSlug: string, subjectId: SubjectId) {
  const existing = await db.chapterProgress.get(chapterSlug);
  await db.chapterProgress.put({
    chapterSlug,
    subjectId,
    completed: existing?.completed ?? false,
    labVisited: true,
    bestQuizScore: existing?.bestQuizScore ?? 0,
    totalQuestions: existing?.totalQuestions ?? 0,
    weakTopics: existing?.weakTopics ?? [],
    updatedAt: new Date().toISOString(),
  });
}

export async function saveQuizResult(
  chapterSlug: string,
  subjectId: SubjectId,
  score: number,
  total: number,
  weakTopics: string[]
) {
  const existing = await db.chapterProgress.get(chapterSlug);
  const bestScore = Math.max(score, existing?.bestQuizScore ?? 0);
  const isCompleted = bestScore >= Math.ceil(total * 0.6); // ৬০% পেলে অধ্যায় সম্পন্ন ধরা হবে

  await db.chapterProgress.put({
    chapterSlug,
    subjectId,
    completed: isCompleted,
    labVisited: existing?.labVisited ?? true,
    bestQuizScore: bestScore,
    totalQuestions: total,
    weakTopics,
    updatedAt: new Date().toISOString(),
  });
}