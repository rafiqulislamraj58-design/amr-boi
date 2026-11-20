
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
  List,
  Menu,
  X,
  GraduationCap,
  Lightbulb,
  BookMarked,
  Hash,
  ArrowUp,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { WAVES_AND_SOUND_TOPICS } from './WavesAndSoundTopicsData';

export default function WavesAndSoundChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMobileTopics, setShowMobileTopics] = useState(false);

  const activeTopic = WAVES_AND_SOUND_TOPICS[selectedIndex];

  const totalTopics = WAVES_AND_SOUND_TOPICS.length;
  const progress = ((selectedIndex + 1) / totalTopics) * 100;

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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      {/* ========================================
          CHAPTER OVERVIEW
      ======================================== */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 sm:p-7 text-white shadow-lg shadow-blue-900/10">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-indigo-300/10 blur-2xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
            <GraduationCap className="h-4 w-4" />
            SSC Physics Learning
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">
                পদার্থবিজ্ঞান · অধ্যায় ০৭
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                তরঙ্গ ও শব্দ
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
                তরঙ্গ, কম্পন, শব্দের বেগ, প্রতিধ্বনি এবং শব্দের বিভিন্ন
                বৈশিষ্ট্য সম্পর্কে বিস্তারিত শেখো।
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <BookOpen className="h-5 w-5 text-blue-100" />
              <div>
                <p className="text-lg font-bold leading-none">
                  {totalTopics}টি
                </p>
                <p className="mt-1 text-xs text-blue-100">
                  শেখার টপিক
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-blue-100">পাঠের অগ্রগতি</span>
              <span>{selectedIndex + 1} / {totalTopics}</span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-label="Topic navigation progress"
              aria-valuenow={selectedIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalTopics}
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          MOBILE TOPIC SELECTOR
      ======================================== */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileTopics(!showMobileTopics)}
          aria-expanded={showMobileTopics}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <List className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                বর্তমান টপিক · {activeTopic.number}
              </p>
              <p className="truncate text-sm font-bold text-slate-900">
                {activeTopic.title}
              </p>
            </div>
          </div>

          {showMobileTopics ? (
            <X className="h-5 w-5 shrink-0 text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
          )}
        </button>

        {showMobileTopics && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            {WAVES_AND_SOUND_TOPICS.map((topic, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(index)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {topic.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                      {topic.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {topic.titleEn}
                    </span>
                  </span>

                  {isActive && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================
          MAIN CONTENT LAYOUT
      ======================================== */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">

        {/* ======================================
            DESKTOP SIDEBAR
        ====================================== */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    অধ্যায়ের বিষয়বস্তু
                  </h2>
                  <p className="text-xs text-slate-500">
                    {totalTopics}টি টপিক উপলব্ধ
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  বর্তমান অগ্রগতি
                </span>
                <span className="font-bold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <nav className="max-h-[calc(100vh-250px)] space-y-1 overflow-y-auto p-3">
              {WAVES_AND_SOUND_TOPICS.map((topic, index) => {
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group relative flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 shadow-sm'
                        : 'border-transparent hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-8 min-w-9 shrink-0 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {topic.number}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-bold leading-snug ${
                          isActive ? 'text-blue-800' : 'text-slate-800'
                        }`}
                      >
                        {topic.title}
                      </span>

                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                        {topic.titleEn}
                      </span>
                    </span>

                    {isActive && (
                      <span className="absolute right-2 top-3">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>প্রতিটি টপিক ভালোভাবে পড়ে অনুশীলন করো।</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================
            RIGHT CONTENT
        ====================================== */}
        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* TOPIC HEADER */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700">
                  <Hash className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  {activeTopic.titleEn}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl lg:text-3xl">
                {activeTopic.title}
              </h2>

              <div className="mt-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wide text-blue-800">
                    মূল ধারণা
                  </h3>
                </div>

                <div className="text-sm leading-7 text-slate-700 sm:text-base">
                  <MathText text={activeTopic.summary} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-7">
              <span className="text-xs font-medium text-slate-500">
                অধ্যায় ০৭ · তরঙ্গ ও শব্দ
              </span>

              <span className="text-xs font-bold text-blue-600">
                {selectedIndex + 1} / {totalTopics}
              </span>
            </div>
          </section>

          {/* DETAILED EXPLANATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  বিষয়টি ধাপে ধাপে বুঝে নাও
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeTopic.explanation.map((paragraph, index) => (
                <div
                  key={`${activeTopic.id}-explanation-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="min-w-0 flex-1 text-sm leading-7 text-slate-700 sm:text-[15px] sm:leading-8">
                    <MathText text={paragraph} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* KEY POINTS */}
          <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-emerald-950">
                  মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                </h3>
                <p className="mt-0.5 text-xs text-emerald-700">
                  পরীক্ষার প্রস্তুতির জন্য গুরুত্বপূর্ণ
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeTopic.keyPoints.map((point, index) => (
                <li
                  key={`${activeTopic.id}-point-${index}`}
                  className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-white/80 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <span className="text-sm leading-6 text-slate-700">
                    <MathText text={point} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* FORMULAS */}
          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    প্রয়োজনীয় সূত্রসমূহ
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    এই টপিকের গুরুত্বপূর্ণ গাণিতিক সূত্র
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="flex min-w-0 flex-col rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/70"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold leading-relaxed text-indigo-800">
                        {formula.label}
                      </p>

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-bold text-indigo-600">
                        {index + 1}
                      </span>
                    </div>

                    <div className="my-3 min-w-0 overflow-x-auto rounded-lg border border-indigo-100/70 bg-white px-2 py-3 text-center">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <p className="mt-auto text-xs leading-6 text-slate-500">
                        <MathText text={formula.note} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SOLVED EXAMPLE */}
          {activeTopic.example && (
            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Calculator className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-amber-950">
                      গাণিতিক উদাহরণ
                    </h3>
                    <p className="mt-0.5 text-xs text-amber-800">
                      ধাপে ধাপে সমাধানসহ
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {/* Question */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                      ১
                    </span>

                    <h4 className="text-xs font-bold text-slate-500">
                      প্রশ্ন
                    </h4>
                  </div>

                  <p className="rounded-xl bg-amber-50/60 p-4 text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </p>
                </div>

                {/* Given */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                      ২
                    </span>

                    <h4 className="text-xs font-bold text-slate-600">
                      দেওয়া আছে
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {activeTopic.example.given.map((item, index) => (
                      <div
                        key={`${activeTopic.id}-given-${index}`}
                        className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs font-semibold leading-6 text-slate-700"
                      >
                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-blue-600" />
                        <MathText text={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                      ৩
                    </span>

                    <h4 className="text-xs font-bold text-slate-600">
                      প্রয়োজনীয় সূত্র
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-center">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                      ৪
                    </span>

                    <h4 className="text-xs font-bold text-slate-600">
                      সমাধান
                    </h4>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="whitespace-pre-line break-words text-sm leading-8 text-slate-700">
                      <MathText text={activeTopic.example.solution} />
                    </p>
                  </div>
                </div>

                {/* Answer */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <h4 className="text-sm font-extrabold text-emerald-800">
                      চূড়ান্ত উত্তর
                    </h4>
                  </div>

                  <p className="mt-2 pl-7 text-sm font-semibold leading-7 text-emerald-900">
                    <MathText text={activeTopic.example.answer} />
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ====================================
              BOTTOM NAVIGATION
          ==================================== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <BookMarked className="h-4 w-4" />
                টপিক নেভিগেশন
              </div>

              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {selectedIndex + 1} / {totalTopics}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
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
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {selectedIndex === totalTopics - 1 && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                <p className="text-sm font-bold text-emerald-800">
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  সবগুলো টপিক দেখে ফেলেছ!
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  এবার সূত্রগুলো অনুশীলন করে নিজের প্রস্তুতি যাচাই করো।
                </p>
              </div>
            )}
          </section>

          {/* BACK TO TOP */}
          <div className="flex justify-center pb-3">
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              উপরে ফিরে যাও
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
