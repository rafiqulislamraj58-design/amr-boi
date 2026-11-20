
'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Sparkles,
  FileText,
  GraduationCap,
  ListChecks,
  Menu,
  X,
  Lightbulb,
  BookMarked,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { REFLECTION_OF_LIGHT_TOPICS } from './ReflectionOfLightTopicsData';

export default function ReflectionOfLightChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMobileTopics, setShowMobileTopics] = useState(false);

  const totalTopics = REFLECTION_OF_LIGHT_TOPICS.length;
  const activeTopic = REFLECTION_OF_LIGHT_TOPICS[selectedIndex];

  const progress = totalTopics > 0
    ? ((selectedIndex + 1) / totalTopics) * 100
    : 0;

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    setShowMobileTopics(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
          এই অধ্যায়ের টপিকগুলো এখনো যোগ করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ==========================================
          CHAPTER OVERVIEW
      ========================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-sm sm:p-7">

        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10">

          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-xl bg-white/15 p-2">
              <GraduationCap className="h-5 w-5" />
            </div>

            <span className="text-xs font-semibold tracking-wide text-blue-100">
              CLASS 9–10 • PHYSICS
            </span>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            অষ্টম অধ্যায়: আলোর প্রতিফলন
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
            NCTB পাঠ্যক্রম অনুসারে আলোর প্রতিফলন, দর্পণ, প্রতিবিম্ব,
            প্রয়োজনীয় সূত্র এবং গাণিতিক উদাহরণ শিখে নাও।
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">

            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <div className="flex items-center gap-2 text-blue-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">মোট টপিক</span>
              </div>

              <p className="mt-1 text-2xl font-extrabold">
                {totalTopics}
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <div className="flex items-center gap-2 text-blue-100">
                <BookMarked className="h-4 w-4" />
                <span className="text-xs font-medium">বর্তমান টপিক</span>
              </div>

              <p className="mt-1 text-2xl font-extrabold">
                {selectedIndex + 1}
                <span className="ml-1 text-sm font-medium text-blue-100">
                  / {totalTopics}
                </span>
              </p>
            </div>

          </div>

          {/* Reading Progress */}

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-100">
                অধ্যায়ের অগ্রগতি
              </span>

              <span className="font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-label="বর্তমান টপিক অনুযায়ী অগ্রগতি"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          MOBILE TOPIC SELECTOR
      ========================================== */}

      <div className="lg:hidden">

        <button
          type="button"
          onClick={() => setShowMobileTopics((prev) => !prev)}
          aria-expanded={showMobileTopics}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
        >

          <div className="flex min-w-0 items-center gap-3">

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Menu className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                বর্তমান অধ্যায়ের টপিক
              </p>

              <p className="truncate text-sm font-bold text-slate-900">
                {activeTopic.number} — {activeTopic.title}
              </p>
            </div>

          </div>

          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
              showMobileTopics ? 'rotate-180' : ''
            }`}
          />

        </button>

        {showMobileTopics && (
          <div className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-xs font-bold text-slate-500">
                অধ্যায়ের সব টপিক
              </p>

              <button
                type="button"
                onClick={() => setShowMobileTopics(false)}
                aria-label="টপিক তালিকা বন্ধ করুন"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {REFLECTION_OF_LIGHT_TOPICS.map((topic, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(index)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                    isActive
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >

                  <span
                    className={`mt-0.5 shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {topic.number}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        isActive ? 'text-blue-800' : 'text-slate-800'
                      }`}
                    >
                      {topic.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {topic.titleEn}
                    </p>
                  </div>

                  {isActive && (
                    <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  )}

                </button>
              );
            })}

          </div>
        )}
      </div>

      {/* ==========================================
          MAIN LAYOUT
      ========================================== */}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">

        {/* DESKTOP SIDEBAR */}

        <aside className="hidden lg:col-span-4 lg:block">

          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 flex items-center justify-between px-1">

              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />

                <h2 className="text-sm font-bold text-slate-900">
                  অধ্যায়ের টপিকসমূহ
                </h2>
              </div>

              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                {totalTopics} টি
              </span>

            </div>

            <div className="space-y-1.5">

              {REFLECTION_OF_LIGHT_TOPICS.map((topic, index) => {
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 shadow-sm'
                        : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <span
                        className={`mt-0.5 flex h-7 min-w-9 shrink-0 items-center justify-center rounded-lg px-1 text-xs font-bold ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {topic.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-bold leading-snug ${
                            isActive ? 'text-blue-800' : 'text-slate-700'
                          }`}
                        >
                          {topic.title}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {topic.titleEn}
                        </p>
                      </div>

                      {isActive && (
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                      )}

                    </div>

                  </button>
                );
              })}

            </div>

            {/* Sidebar Progress */}

            <div className="mt-5 border-t border-slate-100 pt-4">

              <div className="mb-2 flex justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  বর্তমান অগ্রগতি
                </span>

                <span className="font-bold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

            </div>

          </div>
        </aside>

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* TOPIC HEADER */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5 sm:p-6">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  টপিক {activeTopic.number}
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {activeTopic.titleEn}
                </span>

              </div>

              <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">

                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />

                  <h3 className="text-sm font-bold text-blue-900">
                    মূল ধারণা
                  </h3>
                </div>

                <div className="text-sm leading-7 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </div>

              </div>

            </div>

            {/* Topic bottom information */}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">

              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <BookOpen className="h-3.5 w-3.5" />
                পাঠ্যবিষয়
              </span>

              <span className="text-xs font-bold text-slate-600">
                টপিক {selectedIndex + 1} / {totalTopics}
              </span>

            </div>

          </section>

          {/* ==========================================
              DETAILED EXPLANATION
          ========================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-blue-50 p-2.5">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  বিষয়টি ধাপে ধাপে বুঝে নাও
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {activeTopic.explanation.map((paragraph, index) => (
                <div
                  key={`${activeTopic.id}-explanation-${index}`}
                  className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50 sm:p-3"
                >

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    <MathText text={paragraph} />
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* ==========================================
              KEY POINTS
          ========================================== */}

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-2.5">
                <Sparkles className="h-5 w-5 text-emerald-700" />
              </div>

              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                </h3>

                <p className="mt-0.5 text-xs text-emerald-800/70">
                  পরীক্ষার প্রস্তুতির জন্য গুরুত্বপূর্ণ পয়েন্ট
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              {activeTopic.keyPoints.map((point, index) => (
                <div
                  key={`${activeTopic.id}-point-${index}`}
                  className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-white p-3"
                >

                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                  <div className="min-w-0 text-sm leading-6 text-slate-700">
                    <MathText text={point} />
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* ==========================================
              FORMULAS
          ========================================== */}

          {activeTopic.formulas && activeTopic.formulas.length > 0 && (

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="rounded-xl bg-violet-50 p-2.5">
                  <Calculator className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    প্রয়োজনীয় সূত্রসমূহ
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    সূত্র ও প্রতীকের পরিচিতি
                  </p>
                </div>

                <span className="ml-auto rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                  {activeTopic.formulas.length} টি সূত্র
                </span>

              </div>

              <div className="grid grid-cols-1 gap-3">

                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-violet-50/40 p-4"
                  >

                    <p className="mb-3 text-sm font-bold text-violet-800">
                      {index + 1}. {formula.label}
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-violet-100 bg-white px-2 py-3">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <div className="mt-3 flex items-start gap-2 text-xs leading-6 text-slate-600">

                        <Lightbulb className="mt-1 h-3.5 w-3.5 shrink-0 text-violet-500" />

                        <div className="min-w-0">
                          <MathText text={formula.note} />
                        </div>

                      </div>
                    )}

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ==========================================
              SOLVED EXAMPLE
          ========================================== */}

          {activeTopic.example && (

            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm">

              <div className="border-b border-amber-200 bg-amber-100/50 p-4 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-white p-2.5">
                    <Calculator className="h-5 w-5 text-amber-700" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-amber-950">
                      গাণিতিক উদাহরণ
                    </h3>

                    <p className="mt-0.5 text-xs text-amber-800/70">
                      ধাপে ধাপে সমাধানসহ
                    </p>
                  </div>

                </div>

              </div>

              <div className="space-y-4 p-4 sm:p-5">

                {/* Question */}

                <div className="rounded-xl border border-amber-200 bg-white p-4">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700">
                    প্রশ্ন
                  </p>

                  <div className="text-sm font-medium leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </div>

                </div>

                {/* Given */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <div className="mb-3 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-blue-600" />

                    <p className="text-sm font-bold text-slate-800">
                      দেওয়া আছে
                    </p>
                  </div>

                  <div className="space-y-2">

                    {activeTopic.example.given.map((item, index) => (
                      <div
                        key={`${activeTopic.id}-given-${index}`}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                      >

                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                        <div className="min-w-0">
                          <MathText text={item} />
                        </div>

                      </div>
                    ))}

                  </div>

                </div>

                {/* Formula */}

                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">

                  <p className="mb-3 text-sm font-bold text-blue-800">
                    প্রয়োজনীয় সূত্র
                  </p>

                  <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white px-2 py-3">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>

                </div>

                {/* Solution */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="mb-3 text-sm font-bold text-slate-800">
                    সমাধান
                  </p>

                  <div className="whitespace-pre-line break-words rounded-lg bg-slate-50 p-3 text-sm leading-7 text-slate-700">
                    <MathText text={activeTopic.example.solution} />
                  </div>

                </div>

                {/* Answer */}

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                    <p className="text-sm font-bold text-emerald-800">
                      চূড়ান্ত উত্তর
                    </p>
                  </div>

                  <div className="text-sm font-semibold leading-7 text-emerald-900">
                    <MathText text={activeTopic.example.answer} />
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* ==========================================
              PREVIOUS / NEXT NAVIGATION
          ========================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                অধ্যায়ের নেভিগেশন
              </p>

              <p className="text-xs font-bold text-blue-600">
                {selectedIndex + 1} / {totalTopics}
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:text-sm"
              >

                <ChevronLeft className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  পূর্ববর্তী টপিক
                </span>

              </button>

              <div className="hidden shrink-0 text-center sm:block">
                <p className="text-[10px] font-medium text-slate-400">
                  বর্তমান
                </p>

                <p className="text-xs font-bold text-slate-700">
                  {activeTopic.number}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:text-sm"
              >

                <span className="truncate">
                  পরবর্তী টপিক
                </span>

                <ChevronRight className="h-4 w-4 shrink-0" />

              </button>

            </div>

            {selectedIndex === totalTopics - 1 && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">

                <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  অধ্যায়ের শেষ টপিকে পৌঁছে গেছ!
                </div>

                <p className="mt-1 text-xs text-emerald-700">
                  শেখা বিষয়গুলো ভালোভাবে অনুশীলন করে নাও।
                </p>

              </div>
            )}

          </section>

        </main>

      </div>

    </div>
  );
}
