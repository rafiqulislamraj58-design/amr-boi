
'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Sparkles,
  FileText,
  GraduationCap,
  ListChecks,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { STATES_OF_MATTER_TOPICS } from './StatesOfMatterTopicsData';

export default function StatesOfMatterChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeTopic = STATES_OF_MATTER_TOPICS[selectedIndex];

  const totalTopics = STATES_OF_MATTER_TOPICS.length;
  const progress = totalTopics > 0
    ? ((selectedIndex + 1) / totalTopics) * 100
    : 0;

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleSelectTopic(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < totalTopics - 1) {
      handleSelectTopic(selectedIndex + 1);
    }
  };

  if (!activeTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          এই অধ্যায়ের কনটেন্ট এখনো যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-12">

      {/* ========================================
          LEFT SIDEBAR - TOPIC NAVIGATION
      ======================================== */}

      <aside className="min-w-0 lg:col-span-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">

          {/* Sidebar Header */}

          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                    অধ্যায়ের টপিকসমূহ
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {totalTopics}টি টপিক রয়েছে
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                {selectedIndex + 1}/{totalTopics}
              </span>

            </div>

            {/* Progress Bar */}

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  শেখার অগ্রগতি
                </span>

                <span className="font-bold text-emerald-700">
                  {Math.round(progress)}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="টপিক নেভিগেশন অগ্রগতি"
              >
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

          </div>

          {/* Topic List */}

          <div className="max-h-[340px] space-y-1.5 overflow-y-auto overscroll-contain p-3 sm:max-h-[480px] sm:p-4 lg:max-h-[calc(100vh-230px)]">

            {STATES_OF_MATTER_TOPICS.map((topic, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(index)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`টপিক ${topic.number}: ${topic.title}`}
                  className={`group relative flex w-full min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                      : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >

                  {/* Active Indicator */}

                  {isActive && (
                    <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-emerald-500" />
                  )}

                  {/* Number */}

                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {topic.number}
                  </span>

                  {/* Topic Information */}

                  <span className="min-w-0 flex-1">

                    <span
                      className={`block break-words text-sm font-bold leading-relaxed ${
                        isActive
                          ? 'text-emerald-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {topic.title}
                    </span>

                    <span className="mt-1 block break-words text-xs leading-relaxed text-slate-500">
                      {topic.titleEn}
                    </span>

                  </span>

                  {/* Active Icon */}

                  {isActive && (
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  )}

                </button>
              );
            })}

          </div>

          {/* Sidebar Footer */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>মনোযোগ দিয়ে প্রতিটি টপিক পড়ুন</span>
            </div>
          </div>

        </div>
      </aside>

      {/* ========================================
          RIGHT CONTENT AREA
      ======================================== */}

      <main className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-8">

        {/* ========================================
            TOPIC HEADER & SUMMARY
        ======================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-4 sm:p-6">

            {/* Topic Badge */}

            <div className="mb-4 flex flex-wrap items-center gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <BookOpen className="h-3.5 w-3.5" />
                টপিক {activeTopic.number}
              </span>

              <span className="text-xs text-slate-300">/</span>

              <span className="max-w-full break-words text-xs font-medium text-slate-500">
                {activeTopic.titleEn}
              </span>

            </div>

            {/* Title */}

            <h2 className="break-words text-xl font-extrabold leading-relaxed text-slate-900 sm:text-2xl lg:text-3xl">
              {activeTopic.title}
            </h2>

          </div>

          {/* Summary */}

          <div className="p-4 sm:p-6">

            <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-4 sm:p-5">

              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />

                <h3 className="text-sm font-bold text-emerald-900">
                  মূল কথা
                </h3>
              </div>

              <div className="break-words text-sm leading-8 text-slate-700 sm:text-base">
                <MathText text={activeTopic.summary} />
              </div>

            </div>

          </div>

        </section>

        {/* ========================================
            DETAILED EXPLANATION
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                বিস্তারিত ব্যাখ্যা
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                বিষয়টি ধাপে ধাপে বুঝে নাও
              </p>
            </div>

          </div>

          <div className="space-y-4">

            {activeTopic.explanation.map((paragraph, i) => (
              <div
                key={i}
                className="flex min-w-0 items-start gap-3"
              >

                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                  {i + 1}
                </span>

                <p className="min-w-0 flex-1 break-words text-sm leading-8 text-slate-700 sm:text-base">
                  <MathText text={paragraph} />
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* ========================================
            IMPORTANT KEY POINTS
        ======================================== */}

        <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-4 sm:p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ListChecks className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-emerald-950 sm:text-lg">
                মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
              </h3>

              <p className="mt-0.5 text-xs text-emerald-700/70">
                পরীক্ষার জন্য গুরুত্বপূর্ণ পয়েন্ট
              </p>
            </div>

          </div>

          <ul className="space-y-3">

            {activeTopic.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-emerald-100/80 bg-white/80 p-3 transition-colors hover:bg-white sm:p-4"
              >

                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                <span className="min-w-0 flex-1 break-words text-sm leading-7 text-slate-700 sm:text-base">
                  <MathText text={point} />
                </span>

              </li>
            ))}

          </ul>

        </section>

        {/* ========================================
            FORMULAS
        ======================================== */}

        {activeTopic.formulas && activeTopic.formulas.length > 0 && (

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Calculator className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  প্রয়োজনীয় সূত্র ও প্রক্রিয়া
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  গুরুত্বপূর্ণ সূত্রগুলো ভালোভাবে বুঝে নাও
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4">

              {activeTopic.formulas.map((f, i) => (

                <div
                  key={i}
                  className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-4 sm:p-5"
                >

                  <div className="mb-3 flex items-center gap-2">

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                      {i + 1}
                    </span>

                    <p className="min-w-0 break-words text-sm font-bold text-violet-800">
                      {f.label}
                    </p>

                  </div>

                  <div className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-violet-100/70 bg-white p-3">
                    <FormulaBox formula={f.latex} />
                  </div>

                  {f.note && (

                    <div className="mt-3 flex items-start gap-2 border-t border-violet-100 pt-3">

                      <span className="mt-0.5 shrink-0 text-xs font-bold text-violet-600">
                        নোট:
                      </span>

                      <p className="min-w-0 break-words text-xs leading-7 text-slate-600 sm:text-sm">
                        <MathText text={f.note} />
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </section>

        )}

        {/* ========================================
            SOLVED MATHEMATICAL EXAMPLE
        ======================================== */}

        {activeTopic.example && (

          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-white p-4 sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Calculator className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-amber-950 sm:text-lg">
                  গাণিতিক উদাহরণ
                </h3>

                <p className="mt-0.5 text-xs text-amber-800/70">
                  ধাপে ধাপে সমাধানসহ
                </p>
              </div>

            </div>

            {/* Question */}

            <div className="mb-4 rounded-xl border border-amber-200 bg-white p-4">

              <p className="mb-2 text-xs font-bold text-amber-700">
                প্রশ্ন
              </p>

              <div className="break-words text-sm font-semibold leading-8 text-slate-800 sm:text-base">
                <MathText text={activeTopic.example.question} />
              </div>

            </div>

            <div className="space-y-4 rounded-xl border border-amber-100 bg-white p-4 sm:p-5">

              {/* Given */}

              <div>

                <p className="mb-2 text-xs font-bold text-slate-500">
                  ০১. দেওয়া আছে
                </p>

                <div className="flex flex-wrap gap-2">

                  {activeTopic.example.given.map((item, i) => (

                    <span
                      key={i}
                      className="max-w-full break-words rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <MathText text={item} />
                    </span>

                  ))}

                </div>

              </div>

              <div className="border-t border-slate-100" />

              {/* Formula */}

              <div>

                <p className="mb-2 text-xs font-bold text-slate-500">
                  ০২. প্রয়োজনীয় সূত্র
                </p>

                <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                  <FormulaBox formula={activeTopic.example.formula} />
                </div>

              </div>

              <div className="border-t border-slate-100" />

              {/* Solution */}

              <div>

                <p className="mb-2 text-xs font-bold text-slate-500">
                  ০৩. সমাধান
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">

                  <div className="whitespace-pre-line break-words text-sm leading-8 text-slate-800">
                    <MathText text={activeTopic.example.solution} />
                  </div>

                </div>

              </div>

              {/* Answer */}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="mb-2 flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-sm font-bold text-emerald-800">
                    চূড়ান্ত উত্তর
                  </p>

                </div>

                <div className="break-words text-sm font-bold leading-7 text-emerald-900 sm:text-base">
                  <MathText text={activeTopic.example.answer} />
                </div>

              </div>

            </div>

          </section>

        )}

        {/* ========================================
            BOTTOM NAVIGATION
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">

          {/* Navigation Progress */}

          <div className="mb-4 flex items-center justify-between gap-3">

            <span className="text-xs font-medium text-slate-500">
              অধ্যায়ের অগ্রগতি
            </span>

            <span className="text-xs font-bold text-slate-700">
              {selectedIndex + 1} / {totalTopics}
            </span>

          </div>

          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">

            {/* Previous */}

            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-sm"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />

              <span className="truncate">
                পূর্ববর্তী টপিক
              </span>

            </button>

            {/* Counter */}

            <span className="shrink-0 text-xs font-bold tabular-nums text-slate-500">
              {selectedIndex + 1} / {totalTopics}
            </span>

            {/* Next */}

            <button
              type="button"
              onClick={handleNext}
              disabled={selectedIndex === totalTopics - 1}
              className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-sm"
            >
              <span className="truncate">
                পরবর্তী টপিক
              </span>

              <ChevronRight className="h-4 w-4 shrink-0" />

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}
