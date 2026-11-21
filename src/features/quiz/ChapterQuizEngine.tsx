
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
  Target,
  Trophy,
  Brain,
  ChevronRight,
  CircleCheck,
  CircleX,
  Lightbulb,
  BarChart3,
} from 'lucide-react';

// ============================================
// CONSTANTS
// ============================================

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ'];

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
  const rawQuestions = getMCQsByChapter(chapterSlug);

  // ==========================================
  // STATES
  // ==========================================

  const [quizMode, setQuizMode] = useState<QuizMode>('full25');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // ACTIVE QUESTIONS
  // ==========================================

  const activeQuestions = useMemo(() => {
    if (!rawQuestions.length) return [];

    const cloned = [...rawQuestions];

    if (shuffleSeed > 0) {
      for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
      }
    }

    return quizMode === 'quick10'
      ? cloned.slice(0, 10)
      : cloned;
  }, [rawQuestions, quizMode, shuffleSeed]);

  const totalQuestions = activeQuestions.length;

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!totalQuestions) {
    return (
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <HelpCircle className="h-8 w-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            প্রশ্নব্যাংক প্রস্তুত হচ্ছে
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            এই অধ্যায়ের MCQ প্রশ্নগুলো খুব শীঘ্রই যুক্ত করা হবে।
            নতুন প্রশ্ন যুক্ত হলে এখান থেকেই অনুশীলন করতে পারবে।
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
            <BookOpenCheck className="h-4 w-4" />
            প্রশ্নব্যাংক আপডেট চলছে
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CURRENT QUESTION
  // ==========================================

  const currentQ = activeQuestions[currentIdx];
  const currentTopic = getQuestionTopic(currentQ);

  const progressPercent = Math.round(
    ((currentIdx + 1) / totalQuestions) * 100
  );

  const accuracy = Math.round(
    (score / totalQuestions) * 100
  );

  const isPassed = accuracy >= 70;

  const isCorrectAnswer =
    selectedOption === currentQ.correctIndex;

  // ==========================================
  // SELECT OPTION
  // ==========================================

  const handleSelectOption = (idx: number) => {
    if (
      selectedOption !== null ||
      isFinished ||
      isSaving
    ) return;

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
  // NEXT QUESTION
  // ==========================================

  const handleNext = async () => {
    if (
      selectedOption === null ||
      isSaving ||
      isFinished
    ) return;

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      return;
    }

    const isLastAnswerCorrect =
      selectedOption === currentQ.correctIndex;

    const finalScore =
      score + (isLastAnswerCorrect ? 1 : 0);

    const finalWeakTopics = isLastAnswerCorrect
      ? weakTopics
      : Array.from(
          new Set([...weakTopics, currentTopic])
        );

    setScore(finalScore);
    setWeakTopics(finalWeakTopics);
    setIsFinished(true);
    setIsSaving(true);

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
  // RESTART
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
  // CHANGE MODE
  // ==========================================

  const handleModeChange = (mode: QuizMode) => {
    if (mode === quizMode) return;

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
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
            <div
              className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {isPassed ? (
                <Trophy className="h-10 w-10" />
              ) : (
                <Target className="h-10 w-10" />
              )}
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Lightbulb className="h-3.5 w-3.5" />
              )}

              {isPassed ? 'লক্ষ্য অর্জিত' : 'আরও অনুশীলন প্রয়োজন'}
            </span>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {isPassed
                ? 'দারুণ পারফরম্যান্স!'
                : 'কুইজ সম্পন্ন হয়েছে!'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isSaving
                ? 'তোমার ফলাফল সংরক্ষণ করা হচ্ছে...'
                : isPassed
                  ? 'অসাধারণ! এভাবেই নিয়মিত অনুশীলন চালিয়ে যাও।'
                  : 'ভুলগুলো রিভিশন দিয়ে আবার চেষ্টা করো।'}
            </p>

            {/* SCORE CIRCLE */}

            <div className="mx-auto my-8 flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-slate-100 sm:h-48 sm:w-48">
              <div
                className={`flex h-full w-full flex-col items-center justify-center rounded-full ${
                  isPassed
                    ? 'bg-emerald-50'
                    : 'bg-amber-50'
                }`}
              >
                <span
                  className={`text-4xl font-black tracking-tight sm:text-5xl ${
                    isPassed
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {accuracy}%
                </span>

                <span className="mt-1 text-xs font-semibold text-slate-500">
                  সঠিকতার হার
                </span>
              </div>
            </div>

            {/* SCORE CARDS */}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    প্রাপ্ত স্কোর
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  {score}
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    / {totalQuestions}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <Brain className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    ভুল উত্তর
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  {totalQuestions - score}
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    টি
                  </span>
                </p>
              </div>
            </div>

            {/* PERFORMANCE MESSAGE */}

            <div
              className={`mt-4 rounded-2xl border p-4 text-left ${
                isPassed
                  ? 'border-emerald-100 bg-emerald-50/70'
                  : 'border-amber-100 bg-amber-50/70'
              }`}
            >
              <div className="flex items-start gap-3">
                <Sparkles
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    isPassed
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                />

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {isPassed
                      ? 'তোমার প্রস্তুতি ভালো!'
                      : 'আরেকটু প্রস্তুতি নাও'}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-slate-600">
                    {isPassed
                      ? 'তুমি ৭০% বা তার বেশি নম্বর পেয়েছ। এখন পরবর্তী অধ্যায়ের প্রস্তুতি নিতে পারো।'
                      : '৭০% নম্বর অর্জনের জন্য ভুল হওয়া প্রশ্নগুলোর বিষয়গুলো ভালোভাবে রিভিশন করো।'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WEAK TOPICS */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                দুর্বল টপিক বিশ্লেষণ
              </h3>

              <p className="text-xs text-slate-500">
                যেসব বিষয়ে আরও অনুশীলন প্রয়োজন
              </p>
            </div>
          </div>

          {weakTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic, i) => (
                <span
                  key={`${topic}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600" />

              <p className="text-sm font-medium text-emerald-800">
                অসাধারণ! কোনো দুর্বল টপিক পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>

        {/* ACTION */}

        <button
          type="button"
          onClick={() => handleRestart(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          নতুন করে অনুশীলন শুরু করো
        </button>
      </div>
    );
  }

  // ==========================================
  // MAIN QUIZ UI
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      {/* TOP HEADER */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <BookOpenCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  অধ্যায়ভিত্তিক কুইজ
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  নিজের প্রস্তুতি যাচাই করো
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-white/80 bg-white/80 px-3 py-2 sm:self-auto">
              <Target className="h-4 w-4 text-blue-600" />

              <span className="text-xs font-bold text-slate-700">
                {totalQuestions} টি প্রশ্ন
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* QUIZ MODE */}

          {rawQuestions.length > 10 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  অনুশীলনের ধরন
                </span>

                <span className="text-[11px] text-slate-400">
                  পছন্দমতো মোড নির্বাচন করো
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => handleModeChange('quick10')}
                  aria-pressed={quizMode === 'quick10'}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                    quizMode === 'quick10'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Quick 10
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('full25')}
                  aria-pressed={quizMode === 'full25'}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                    quizMode === 'full25'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Full Quiz ({rawQuestions.length})
                </button>
              </div>
            </div>
          )}

          {/* PROGRESS */}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  তোমার অগ্রগতি
                </p>

                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  প্রশ্ন {currentIdx + 1}
                  <span className="font-medium text-slate-400">
                    {' '} / {totalQuestions}
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
                <p className="text-[10px] font-semibold text-blue-500">
                  Progress
                </p>

                <p className="text-lg font-black leading-tight text-blue-700">
                  {progressPercent}%
                </p>
              </div>
            </div>

            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={currentIdx + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
              aria-label="কুইজ অগ্রগতি"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex max-w-[70%] items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
                <Brain className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                <span className="truncate">{currentTopic}</span>
              </span>

              <span className="text-[11px] font-medium text-slate-400">
                {totalQuestions - currentIdx - 1} টি বাকি
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm shadow-blue-200">
            {currentIdx + 1}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              প্রশ্ন {currentIdx + 1}
            </span>

            <h3 className="mt-1 text-base font-bold leading-8 text-slate-900 sm:text-lg sm:leading-9">
              {currentQ.question}
            </h3>
          </div>
        </div>

        {/* FORMULA */}

        {currentQ.formulaLatex && (
          <div className="mb-5 overflow-x-auto rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 sm:p-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              <Lightbulb className="h-3.5 w-3.5" />
              প্রয়োজনীয় সূত্র
            </div>

            <FormulaBox formula={currentQ.formulaLatex} />
          </div>
        )}

        {/* OPTIONS HEADER */}

        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700">
            সঠিক উত্তরটি নির্বাচন করো
          </p>

          {selectedOption === null && (
            <span className="text-[10px] text-slate-400">
              একটি অপশন বেছে নাও
            </span>
          )}
        </div>

        {/* OPTIONS */}

        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let optionStyle =
              'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40';

            let labelStyle =
              'border-slate-200 bg-slate-50 text-slate-600';

            if (selectedOption !== null) {
              if (isCorrect) {
                optionStyle =
                  'border-emerald-400 bg-emerald-50/70 ring-1 ring-emerald-100';

                labelStyle =
                  'border-emerald-500 bg-emerald-500 text-white';
              } else if (isSelected) {
                optionStyle =
                  'border-red-300 bg-red-50/70 ring-1 ring-red-100';

                labelStyle =
                  'border-red-500 bg-red-500 text-white';
              } else {
                optionStyle =
                  'border-slate-100 bg-slate-50/60 opacity-60';

                labelStyle =
                  'border-slate-200 bg-white text-slate-400';
              }
            }

            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={selectedOption !== null || isSaving}
                aria-pressed={isSelected}
                className={`group flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-default sm:p-4 ${optionStyle}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold transition-colors ${labelStyle}`}
                  >
                    {OPTION_LABELS[idx] || idx + 1}
                  </span>

                  <span className="text-sm font-medium leading-6 text-slate-800 sm:text-base">
                    {option}
                  </span>
                </div>

                {selectedOption !== null && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                )}

                {selectedOption !== null && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}

                {selectedOption === null && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* EXPLANATION */}

        {selectedOption !== null && (
          <div
            className="mt-5 space-y-4"
            aria-live="polite"
          >
            <div
              className={`overflow-hidden rounded-2xl border ${
                isCorrectAnswer
                  ? 'border-emerald-200 bg-emerald-50/60'
                  : 'border-amber-200 bg-amber-50/60'
              }`}
            >
              <div
                className={`flex items-center gap-2 border-b px-4 py-3 ${
                  isCorrectAnswer
                    ? 'border-emerald-100 text-emerald-800'
                    : 'border-amber-100 text-amber-800'
                }`}
              >
                {isCorrectAnswer ? (
                  <CircleCheck className="h-5 w-5" />
                ) : (
                  <CircleX className="h-5 w-5" />
                )}

                <p className="text-sm font-extrabold">
                  {isCorrectAnswer
                    ? 'অভিনন্দন! সঠিক উত্তর'
                    : 'সঠিক উত্তরটি দেখে নাও'}
                </p>
              </div>

              <div className="space-y-2 p-4">
                {!isCorrectAnswer && (
                  <p className="text-xs font-semibold text-emerald-700">
                    সঠিক উত্তর: {OPTION_LABELS[currentQ.correctIndex] || currentQ.correctIndex + 1}.{' '}
                    {currentQ.options[currentQ.correctIndex]}
                  </p>
                )}

                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                  <div>
                    <p className="mb-1 text-xs font-bold text-slate-700">
                      ব্যাখ্যা
                    </p>

                    <p className="text-sm leading-7 text-slate-700">
                      {currentQ.explanation || 'এই প্রশ্নের জন্য কোনো ব্যাখ্যা যুক্ত করা হয়নি।'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEXT BUTTON */}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ফলাফল সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <span>
                    {currentIdx + 1 < totalQuestions
                      ? 'পরবর্তী প্রশ্ন'
                      : 'ফলাফল দেখো'}
                  </span>

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* QUIZ FOOTER */}

      <div className="flex flex-col items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <BarChart3 className="h-4 w-4 text-slate-400" />
          <span>
            নিয়মিত অনুশীলন তোমার প্রস্তুতি আরও ভালো করবে।
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleRestart(false)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          শুরু থেকে
        </button>
      </div>
    </div>
  );
}
