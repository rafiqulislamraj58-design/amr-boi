
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
  PanelTop,
  Zap,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { STATIC_ELECTRICITY_TOPICS } from './StaticElectricityTopicsData';

export default function StaticElectricityChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeTopic = STATIC_ELECTRICITY_TOPICS[selectedIndex];
  const totalTopics = STATIC_ELECTRICITY_TOPICS.length;

  const progress = totalTopics > 0
    ? ((selectedIndex + 1) / totalTopics) * 100
    : 0;

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    handleSelectTopic(selectedIndex - 1);
  };

  const handleNext = () => {
    handleSelectTopic(selectedIndex + 1);
  };

  if (!activeTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Static Electricity topics data পরীক্ষা করো।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Chapter Progress */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Zap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold text-blue-600">
                PHYSICS • CHAPTER LEARNING
              </p>
              <h2 className="text-base font-bold text-slate-900">
                স্থির বিদ্যুৎ
              </h2>
              <p className="text-xs text-slate-500">
                {totalTopics}টি টপিক • ধাপে ধাপে শিখুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xl font-extrabold tabular-nums text-blue-700">
                {Math.round(progress)}%
              </p>
              <p className="text-xs text-slate-500">
                অধ্যায়ের অগ্রগতি
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-blue-100">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full rounded-r-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-5">

            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-600" />

                <h3 className="text-sm font-bold text-slate-900">
                  অধ্যায়ের টপিকসমূহ
                </h3>
              </div>

              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {totalTopics} Topics
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:max-h-[calc(100vh-220px)] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">

              {STATIC_ELECTRICITY_TOPICS.map((topic, index) => {
                const isActive = index === selectedIndex;
                const isCompleted = index < selectedIndex;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`
                      group flex min-w-[210px] flex-1 items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200
                      lg:min-w-0 lg:flex-none
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      ${
                        isActive
                          ? 'border-blue-200 bg-blue-50 shadow-sm'
                          : 'border-transparent bg-slate-50/70 hover:border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold transition-colors
                        ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-white text-slate-500 ring-1 ring-slate-200'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        topic.number
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold leading-snug ${
                          isActive ? 'text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        {topic.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {topic.titleEn}
                      </p>
                    </div>

                    {isActive && (
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden rounded-xl bg-slate-50 p-3 lg:block">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Learning Progress
                </span>
                <span className="font-bold text-blue-700">
                  {selectedIndex + 1}/{totalTopics}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* Topic Header */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5 sm:p-7">

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  <BookOpen className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {activeTopic.titleEn}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                {activeTopic.title}
              </h1>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-900">
                    মূল ধারণা
                  </h3>
                </div>

                <div className="text-sm leading-7 text-slate-700 sm:text-base">
                  <MathText text={activeTopic.summary} />
                </div>
              </div>

            </div>
          </section>

          {/* Explanation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>
                <p className="text-xs text-slate-500">
                  সহজ ভাষায় বিষয়টি বুঝে নাও
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-8 text-slate-700 sm:text-base">
              {activeTopic.explanation.map((paragraph, index) => (
                <p key={index}>
                  <MathText text={paragraph} />
                </p>
              ))}
            </div>

          </section>

          {/* Key Points */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-bold text-emerald-950">
                  গুরুত্বপূর্ণ তথ্য
                </h3>
                <p className="text-xs text-emerald-700">
                  পরীক্ষার আগে অবশ্যই মনে রাখবে
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {activeTopic.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white/80 p-3 text-sm leading-7 text-slate-700"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                  </span>

                  <div className="min-w-0">
                    <MathText text={point} />
                  </div>
                </li>
              ))}
            </ul>

          </section>

          {/* Formulas */}
          {activeTopic.formulas?.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                  <Calculator className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    প্রয়োজনীয় সূত্রসমূহ
                  </h3>
                  <p className="text-xs text-slate-500">
                    গুরুত্বপূর্ণ গাণিতিক সূত্র
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-violet-100 bg-violet-50/40 p-4"
                  >
                    <p className="mb-3 text-xs font-bold text-violet-800">
                      {formula.label}
                    </p>

                    <div className="overflow-x-auto rounded-lg bg-white p-3">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <p className="mt-3 text-xs leading-6 text-slate-600">
                        <MathText text={formula.note} />
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </section>
          ) : null}

          {/* Solved Example */}
          {activeTopic.example && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 sm:p-6">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Calculator className="h-5 w-5 text-amber-700" />
                </div>

                <div>
                  <h3 className="font-bold text-amber-950">
                    গাণিতিক উদাহরণ
                  </h3>
                  <p className="text-xs text-amber-700">
                    ধাপে ধাপে সমাধান
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-amber-100 bg-white p-4 sm:p-5">

                {/* Question */}
                <div>
                  <p className="mb-2 text-xs font-bold text-amber-700">
                    প্রশ্ন
                  </p>

                  <p className="text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                {/* Given */}
                <div>
                  <p className="mb-2 text-xs font-bold text-slate-500">
                    দেওয়া আছে
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {activeTopic.example.given.map((item, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <MathText text={item} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formula */}
                <div>
                  <p className="mb-2 text-xs font-bold text-slate-500">
                    সূত্র
                  </p>

                  <div className="overflow-x-auto rounded-xl bg-blue-50/70 p-3">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <p className="mb-2 text-xs font-bold text-slate-500">
                    সমাধান
                  </p>

                  <div className="overflow-x-auto whitespace-pre-line rounded-xl bg-slate-50 p-4 font-mono text-sm leading-8 text-slate-800">
                    <MathText text={activeTopic.example.solution} />
                  </div>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-xs font-bold text-emerald-700">
                      চূড়ান্ত উত্তর
                    </p>

                    <p className="mt-1 text-sm font-bold leading-7 text-emerald-900">
                      <MathText text={activeTopic.example.answer} />
                    </p>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* Navigation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  YOUR LEARNING JOURNEY
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {selectedIndex + 1} / {totalTopics} টপিক
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {Math.round(progress)}% Complete
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <div className="hidden flex-1 px-3 sm:block">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>
                  {selectedIndex === totalTopics - 1
                    ? 'শেষ টপিক'
                    : 'পরবর্তী টপিক'}
                </span>

                {selectedIndex !== totalTopics - 1 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
