'use client';

import React, { useState, useMemo } from 'react';

import type { SubjectId } from '@/types/curriculum';

import { getMCQsByChapter } from '@/data/mcq';

import { saveQuizResult } from '@/database/progressDb';

import FormulaBox from '@/components/common/FormulaBox';

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpenCheck,
} from 'lucide-react';

// ============================================
// CONSTANTS
// ============================================

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ'];

// ============================================
// TYPES
// ============================================

interface Props {
  chapterSlug: string;
  subjectId: SubjectId;
}

type QuizMode = 'quick10' | 'full25';

interface QuestionTopic {
  topicTag?: string;
  topic?: string;
}

// ============================================
// HELPERS
// ============================================

/**
 * Supports both the new topicTag field
 * and the legacy topic field.
 */
const getQuestionTopic = (question: QuestionTopic): string => {
  return (
    question.topicTag?.trim() ||
    question.topic?.trim() ||
    'অন্যান্য'
  );
};

// ============================================
// COMPONENT
// ============================================

export default function ChapterQuizEngine({
  chapterSlug,
  subjectId,
}: Props) {
  // ==========================================
  // LOAD QUESTIONS
  // ==========================================

  const rawQuestions = getMCQsByChapter(chapterSlug);

  // ==========================================
  // STATES
  // ==========================================

  const [quizMode, setQuizMode] = useState<QuizMode>('full25');

  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [score, setScore] = useState<number>(0);

  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ==========================================
  // ACTIVE QUESTIONS
  // ==========================================

  const activeQuestions = useMemo(() => {
    if (rawQuestions.length === 0) return [];

    const cloned = [...rawQuestions];

    // Shuffle questions
    if (shuffleSeed > 0) {
      for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
      }
    }

    // Quick 10 mode
    return quizMode === 'quick10'
      ? cloned.slice(0, 10)
      : cloned;
  }, [rawQuestions, quizMode, shuffleSeed]);

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (activeQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <HelpCircle className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          এই অধ্যায়ের MCQ প্রশ্নব্যাংক প্রস্তুত হচ্ছে
        </h3>

        <p className="mx-auto max-w-md text-sm text-slate-500">
          খুব শীঘ্রই এই অধ্যায়ের গুরুত্বপূর্ণ বোর্ড-স্ট্যান্ডার্ড
          বহুনির্বাচনি প্রশ্ন ও ব্যাখ্যা যুক্ত করা হবে।
        </p>
      </div>
    );
  }

  // ==========================================
  // CURRENT QUESTION
  // ==========================================

  const currentQ = activeQuestions[currentIdx];

  const currentTopic = getQuestionTopic(currentQ);

  const totalQuestions = activeQuestions.length;

  const progressPercent = Math.round(
    ((currentIdx + 1) / totalQuestions) * 100
  );

  // ==========================================
  // RESULT CALCULATION
  // ==========================================

  const accuracy = Math.round((score / totalQuestions) * 100);

  const isPassed = accuracy >= 70;

  // ==========================================
  // SELECT OPTION
  // ==========================================

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || isFinished || isSaving) return;

    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWeakTopics((prev) =>
        prev.includes(currentTopic)
          ? prev
          : [...prev, currentTopic]
      );
    }
  };

  // ==========================================
  // NEXT QUESTION / FINISH QUIZ
  // ==========================================

  const handleNext = async () => {
    if (selectedOption === null || isSaving || isFinished) return;

    // Move to next question
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      return;
    }

    // ========================================
    // LAST QUESTION
    // ========================================

    const isLastAnswerCorrect =
      selectedOption === currentQ.correctIndex;

    const finalScore =
      score + (isLastAnswerCorrect ? 1 : 0);

    const finalWeakTopics = isLastAnswerCorrect
      ? weakTopics
      : Array.from(new Set([...weakTopics, currentTopic]));

    // Update final score and result
    setScore(finalScore);
    setWeakTopics(finalWeakTopics);
    setIsFinished(true);
    setIsSaving(true);

    // Save result
    try {
      await saveQuizResult(
        chapterSlug,
        subjectId,
        finalScore,
        totalQuestions,
        finalWeakTopics
      );
    } catch (error) {
      console.error('Quiz result save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // RESTART QUIZ
  // ==========================================

  const handleRestart = (newShuffle = true) => {
    if (newShuffle) {
      setShuffleSeed((prev) => prev + 1);
    }

    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setWeakTopics([]);
    setIsFinished(false);
    setIsSaving(false);
  };

  // ==========================================
  // CHANGE QUIZ MODE
  // ==========================================

  const handleModeChange = (mode: QuizMode) => {
    setQuizMode(mode);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setWeakTopics([]);
    setIsFinished(false);
    setIsSaving(false);
  };

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  if (isFinished) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8">
        {/* RESULT ICON */}

        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            isPassed
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-amber-100 text-amber-600'
          }`}
        >
          <Award className="h-9 w-9" />
        </div>

        {/* RESULT HEADING */}

        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isPassed
              ? 'দারুণ পারফরম্যান্স!'
              : 'কুইজ সম্পন্ন হয়েছে!'}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {isSaving
              ? 'তোমার ফলাফল সংরক্ষণ করা হচ্ছে...'
              : 'তোমার কুইজের ফলাফল প্রস্তুত।'}
          </p>
        </div>

        {/* SCORE CARDS */}

        <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs text-slate-500">
              প্রাপ্ত স্কোর
            </span>

            <p className="font-sans text-2xl font-bold text-slate-900">
              {score} / {totalQuestions}
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              isPassed
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <span
              className={`text-xs ${
                isPassed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              সঠিকতার হার
            </span>

            <p
              className={`font-sans text-2xl font-bold ${
                isPassed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {accuracy}%
            </p>
          </div>
        </div>

        {/* WEAK TOPICS */}

        {weakTopics.length > 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />

              <span>
                পুনরায় রিভিশন দেওয়ার পরামর্শ (Weak Topics):
              </span>
            </div>

            <ul className="list-inside list-disc space-y-1 text-xs text-amber-800">
              {weakTopics.map((topic, i) => (
                <li key={`${topic}-${i}`}>{topic}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            <Sparkles className="h-4 w-4 text-emerald-600" />

            <span>
              তুমি সবগুলো প্রশ্নের সঠিক উত্তর দিয়েছ!
            </span>
          </div>
        )}

        {/* RESTART BUTTON */}

        <button
          type="button"
          onClick={() => handleRestart(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />

          প্রশ্নগুলো শাফল করে আবার অনুশীলন করো
        </button>
      </div>
    );
  }

  // ==========================================
  // MAIN QUIZ UI
  // ==========================================

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      {/* QUIZ MODE SELECTOR */}

      {rawQuestions.length > 10 && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
          <span className="flex items-center gap-1.5 pl-2 text-xs font-semibold text-slate-600">
            <BookOpenCheck className="h-4 w-4 text-blue-600" />
            কুইজ মোড:
          </span>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleModeChange('quick10')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quizMode === 'quick10'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              ১০টি প্রশ্ন (Quick)
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('full25')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quizMode === 'full25'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              সবগুলো ({rawQuestions.length}টি)
            </button>
          </div>
        </div>
      )}

      {/* PROGRESS HEADER */}

      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
            প্রশ্ন {currentIdx + 1} / {totalQuestions}
          </span>

          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            টপিক: {currentTopic}
          </span>
        </div>

        {/* PROGRESS BAR */}

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={currentIdx + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label="কুইজ অগ্রগতি"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* QUESTION */}

      <h3 className="mb-4 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
        {currentQ.question}
      </h3>

      {/* FORMULA */}

      {currentQ.formulaLatex && (
        <div className="mb-5 inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <FormulaBox formula={currentQ.formulaLatex} />
        </div>
      )}

      {/* OPTIONS */}

      <div className="space-y-3">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle =
            'border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50';

          let badgeStyle =
            'border-slate-200 bg-slate-100 text-slate-700';

          if (selectedOption !== null) {
            if (isCorrect) {
              btnStyle =
                'border-emerald-500 bg-emerald-50 text-emerald-950';

              badgeStyle =
                'border-emerald-600 bg-emerald-600 text-white';
            } else if (isSelected) {
              btnStyle =
                'border-red-400 bg-red-50 text-red-950';

              badgeStyle =
                'border-red-600 bg-red-600 text-white';
            } else {
              btnStyle = 'border-slate-200 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedOption !== null || isSaving}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 text-left font-medium transition-all disabled:cursor-default sm:p-4 ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${badgeStyle}`}
                >
                  {OPTION_LABELS[idx] || idx + 1}
                </span>

                <span className="text-sm sm:text-base">
                  {option}
                </span>
              </div>

              {selectedOption !== null && isCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              )}

              {selectedOption !== null && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* EXPLANATION */}

      {selectedOption !== null && (
        <div className="mt-6 space-y-4">
          <div
            className={`rounded-xl border p-4 text-sm leading-relaxed ${
              selectedOption === currentQ.correctIndex
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            <p className="mb-1 font-bold">
              {selectedOption === currentQ.correctIndex
                ? 'সঠিক উত্তর!'
                : 'উত্তরটি সঠিক নয়।'}
            </p>

            <p>{currentQ.explanation}</p>
          </div>

          {/* NEXT BUTTON */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              disabled={isSaving}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {currentIdx + 1 < totalQuestions
                  ? 'পরবর্তী প্রশ্ন'
                  : 'ফলাফল দেখো'}
              </span>

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}