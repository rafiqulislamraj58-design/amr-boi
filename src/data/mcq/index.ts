import { QuizQuestion } from '@/types/curriculum';
import { motionMCQs } from './physics/motion';
import { measurementMCQs } from './physics/measurement';

export const CHAPTER_MCQ_REGISTRY: Record<string, QuizQuestion[]> = {
  // Physics Chapters
  measurement: measurementMCQs,
  'physical-quantities-and-measurement': measurementMCQs, 
  motion: motionMCQs,
};

export function getMCQsByChapter(chapterSlug: string): QuizQuestion[] {
  return CHAPTER_MCQ_REGISTRY[chapterSlug] || [];
}