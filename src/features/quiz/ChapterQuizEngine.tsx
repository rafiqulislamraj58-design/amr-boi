
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
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-2xl mx-auto text-center space-y-3">

        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          এই অধ্যায়ের MCQ প্রশ্নব্যাংক প্রস্তুত হচ্ছে
        </h3>

        <p className="text-sm text-slate-500 max-w-md mx-auto">
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
        prev.includes(currentQ.topicTag)
          ? prev
          : [...prev, currentQ.topicTag]
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

    // Final score includes the answer just selected.
    // State updates may not have been reflected yet.
    const finalScore =
      score + (selectedOption === currentQ.correctIndex ? 1 : 0);

    const finalWeakTopics =
      selectedOption === currentQ.correctIndex
        ? weakTopics
        : Array.from(new Set([...weakTopics, currentQ.topicTag]));

    // Show result immediately
    setIsFinished(true);

    // Save result in background
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
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-2xl mx-auto text-center space-y-6">

        {/* Result Icon */}

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
            isPassed
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-amber-100 text-amber-600'
          }`}
        >
          <Award className="w-9 h-9" />
        </div>

        {/* Result Heading */}

        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isPassed
              ? 'দারুণ পারফরম্যান্স!'
              : 'কুইজ সম্পন্ন হয়েছে!'}
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            {isSaving
              ? 'তোমার ফলাফল সংরক্ষণ করা হচ্ছে...'
              : 'তোমার কুইজের ফলাফল প্রস্তুত।'}
          </p>
        </div>

        {/* Score Cards */}

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

            <span className="text-xs text-slate-500">
              প্রাপ্ত স্কোর
            </span>

            <p className="text-2xl font-bold text-slate-900 font-sans">
              {score} / {totalQuestions}
            </p>

          </div>

          <div
            className={`p-4 rounded-xl border ${
              isPassed
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
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
              className={`text-2xl font-bold font-sans ${
                isPassed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {accuracy}%
            </p>

          </div>

        </div>

        {/* Weak Topics */}

        {weakTopics.length > 0 ? (
          <div className="text-left p-4 rounded-xl bg-amber-50 border border-amber-200">

            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-2">

              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />

              <span>
                পুনরায় রিভিশন দেওয়ার পরামর্শ (Weak Topics):
              </span>

            </div>

            <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
              {weakTopics.map((topic, i) => (
                <li key={`${topic}-${i}`}>
                  {topic}
                </li>
              ))}
            </ul>

          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2">

            <Sparkles className="w-4 h-4 text-emerald-600" />

            <span>
              তুমি সবগুলো টপিকের প্রশ্নের সঠিক উত্তর দিয়েছ!
            </span>

          </div>
        )}

        {/* Restart Button */}

        <button
          type="button"
          onClick={() => handleRestart(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />

          প্রশ্নগুলো শাফল করে আবার অনুশীলন করো
        </button>

      </div>
    );
  }

  // ==========================================
  // MAIN QUIZ UI
  // ==========================================

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-2xl mx-auto">

      {/* QUIZ MODE SELECTOR */}

      {rawQuestions.length > 10 && (
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 mb-5">

          <span className="text-xs font-semibold text-slate-600 pl-2 flex items-center gap-1.5">

            <BookOpenCheck className="w-4 h-4 text-blue-600" />

            কুইজ মোড:

          </span>

          <div className="flex gap-1.5">

            <button
              type="button"
              onClick={() => handleModeChange('quick10')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                quizMode === 'quick10'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ১০টি প্রশ্ন (Quick)
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('full25')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                quizMode === 'full25'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সবগুলো ({rawQuestions.length}টি)
            </button>

          </div>
        </div>
      )}

      {/* PROGRESS HEADER */}

      <div className="space-y-3 mb-5">

        <div className="flex items-center justify-between">

          <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            প্রশ্ন {currentIdx + 1} / {totalQuestions}
          </span>

          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            টপিক: {currentQ.topicTag}
          </span>

        </div>

        {/* Progress Bar */}

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />

        </div>

      </div>

      {/* QUESTION */}

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">
        {currentQ.question}
      </h3>

      {/* FORMULA */}

      {currentQ.formulaLatex && (
        <div className="mb-5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 inline-block">
          <FormulaBox formula={currentQ.formulaLatex} />
        </div>
      )}

      {/* OPTIONS */}

      <div className="space-y-3">

        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;

          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle =
            'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800';

          let badgeStyle =
            'bg-slate-100 text-slate-700 border-slate-200';

          if (selectedOption !== null) {
            if (isCorrect) {
              btnStyle =
                'border-emerald-500 bg-emerald-50 text-emerald-950';

              badgeStyle =
                'bg-emerald-600 text-white border-emerald-600';

            } else if (isSelected) {
              btnStyle =
                'border-red-400 bg-red-50 text-red-950';

              badgeStyle =
                'bg-red-600 text-white border-red-600';

            } else {
              btnStyle =
                'border-slate-200 opacity-60 text-slate-500';
            }
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
            >

              <div className="flex items-center gap-3">

                <span
                  className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                >
                  {OPTION_LABELS[idx] || idx + 1}
                </span>

                <span className="text-sm sm:text-base">
                  {option}
                </span>

              </div>

              {selectedOption !== null && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}

              {selectedOption !== null && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}

            </button>
          );
        })}

      </div>

      {/* EXPLANATION */}

      {selectedOption !== null && (
        <div className="mt-6 space-y-4">

          <div
            className={`p-4 rounded-xl text-sm border leading-relaxed ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >

            <p className="font-bold mb-1">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-60"
            >

              <span>
                {currentIdx + 1 < totalQuestions
                  ? 'পরবর্তী প্রশ্ন'
                  : 'ফলাফল দেখো'}
              </span>

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </div>
      )}

    </div>
  );
}
