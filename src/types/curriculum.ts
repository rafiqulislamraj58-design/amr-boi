
/**
 * ============================================================
 * NCTB SCIENCE LEARNING PLATFORM
 * Curriculum Type Definitions
 * ============================================================
 *
 * Subjects: Physics, Chemistry, Biology
 * Classes: 9-10
 * Architecture: Modular & Scalable
 */

// ============================================================
// 1. SUBJECT TYPES
// ============================================================

export type SubjectId = 'physics' | 'chemistry' | 'biology';

export type SubjectName = 'Physics' | 'Chemistry' | 'Biology';

// ============================================================
// 2. CHAPTER TYPES
// ============================================================

export interface Chapter {
  /** Unique chapter identifier */
  id: string;

  /** Chapter number according to NCTB curriculum */
  chapterNumber: number;

  /** URL-friendly chapter identifier */
  slug: string;

  /** Bengali chapter title */
  title: string;

  /** English chapter title */
  titleEn: string;

  /** Chapter description */
  description: string;

  /** Estimated learning time in minutes */
  estimatedMinutes: number;

  /** Available learning features */
  has2DAnimation: boolean;
  has3DModel: boolean;
  hasVirtualLab: boolean;

  /** Pilot chapter indicator */
  isPilot?: boolean;

  /** Optional chapter availability */
  isPublished?: boolean;
}

// ============================================================
// 3. SUBJECT TYPES
// ============================================================

export interface Subject {
  /** Unique subject identifier */
  id: SubjectId;

  /** Bengali subject name */
  nameBn: string;

  /** English subject name */
  nameEn: string;

  /** Subject description */
  description: string;

  /** Total number of chapters */
  chapterCount: number;

  /** Subject theme color */
  colorHex: string;

  /** UI styling classes */
  badgeClass: string;
  cardBorderClass: string;
  buttonClass: string;

  /** Subject chapters */
  chapters: Chapter[];

  /** Optional subject availability */
  isActive?: boolean;
}

// ============================================================
// 4. QUIZ TYPES
// ============================================================

export type QuizOptionIndex = 0 | 1 | 2 | 3;

export interface QuizQuestion {
  /** Unique question identifier */
  id: string;

  /** Question text */
  question: string;

  /** Optional mathematical formula */
  formulaLatex?: string;

  /** Exactly four answer options */
  options: [string, string, string, string];

  /** Correct option index (0-3) */
  correctIndex: QuizOptionIndex;

  /**
   * Topic information
   *
   * topicTag: Standard topic identifier or label
   * topic: Legacy compatibility with existing MCQ data
   */
  topicTag?: string;
  topic?: string;

  /** Explanation of the correct answer */
  explanation: string;

  /** Optional difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard';

  /** Optional marks */
  marks?: number;

  /** Optional question type */
  questionType?: 'mcq';

  /** Optional source information */
  source?: string;
}

// ============================================================
// 5. SUBJECT & CHAPTER DATA ALIASES
// ============================================================

/**
 * Backward compatibility:
 * Existing components importing SubjectData will continue working.
 */
export type SubjectData = Subject;

/**
 * Backward compatibility:
 * Existing components importing ChapterData will continue working.
 */
export type ChapterData = Chapter;

// ============================================================
// 6. CURRICULUM COLLECTION TYPES
// ============================================================

/** Complete curriculum containing all subjects */
export type Curriculum = Record<SubjectId, Subject>;

/** Collection of chapters */
export type ChapterList = Chapter[];

/** Collection of quiz questions */
export type QuizQuestionList = QuizQuestion[];

// ============================================================
// 7. HELPER TYPES
// ============================================================

/** Subject ID or subject object */
export type SubjectReference = SubjectId | Subject;

/** Chapter ID or chapter slug */
export type ChapterReference = string;

/** Learning feature types */
export type LearningFeature =
  | 'animation-2d'
  | 'model-3d'
  | 'virtual-lab';

/** Difficulty levels */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// ============================================================
// 8. TYPE GUARDS
// ============================================================

/** Check whether a value is a valid subject ID */
export function isSubjectId(value: string): value is SubjectId {
  return (
    value === 'physics' ||
    value === 'chemistry' ||
    value === 'biology'
  );
}

/** Check whether a value is a valid quiz option index */
export function isQuizOptionIndex(
  value: number
): value is QuizOptionIndex {
  return Number.isInteger(value) && value >= 0 && value <= 3;
}

// ============================================================
// 9. CONSTANTS
// ============================================================

export const SUBJECT_IDS: readonly SubjectId[] = [
  'physics',
  'chemistry',
  'biology',
] as const;

export const QUIZ_OPTION_COUNT = 4;

export const QUIZ_DIFFICULTIES: readonly DifficultyLevel[] = [
  'easy',
  'medium',
  'hard',
] as const;
