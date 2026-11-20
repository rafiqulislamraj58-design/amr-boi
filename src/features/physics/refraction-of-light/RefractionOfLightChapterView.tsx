
'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Sparkles,
  FileText,
  Search,
  X,
  GraduationCap,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { REFRACTION_OF_LIGHT_TOPICS } from './RefractionOfLightTopicsData';

export default function RefractionOfLightChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const topics = REFRACTION_OF_LIGHT_TOPICS;
  const totalTopics = topics.length;

  const activeTopic = topics[selectedIndex];

  const progress = totalTopics
    ? Math.round((completedTopics.length / totalTopics) * 100)
    : 0;

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return topics.map((topic, index) => ({
      topic,
      index,
    }));

    return topics
      .map((topic, index) => ({ topic, index }))
      .filter(({ topic }) =>
        `${topic.title} ${topic.titleEn} ${topic.number}`
          .toLowerCase()
          .includes(query)
      );
  }, [topics, searchQuery]);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    handleSelectTopic(selectedIndex - 1);
  };

  const handleNext = () => {
    handleSelectTopic(selectedIndex + 1);
  };

  // ==========================================
  // COMPLETION
  // ==========================================

  const isCompleted = activeTopic
    ? completedTopics.includes(activeTopic.id)
    : false;

  const toggleCompleted = () => {
    if (!activeTopic) return;

    setCompletedTopics((prev) =>
      prev.includes(activeTopic.id)
        ? prev.filter((id) => id !== activeTopic.id)
        : [...prev, activeTopic.id]
    );
  };

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!activeTopic || totalTopics === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />

        <h2 className="text-lg font-bold text-slate-900">
          কোনো টপিক পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          এই অধ্যায়ের বিষয়বস্তু এখনো যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ====================================== */}
      {/* CHAPTER OVERVIEW */}
      {/* ====================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-7">

        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative">

          <div className="mb-4 flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              <GraduationCap className="h-3.5 w-3.5" />
              পদার্থবিজ্ঞান
            </span>

            <span className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
              আলোর প্রতিসরণ
            </span>

          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            আলোর প্রতিসরণ
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            এই অধ্যায়ের প্রতিটি টপিক ধাপে ধাপে পড়ো,
            গুরুত্বপূর্ণ সূত্র শেখো এবং গাণিতিক সমস্যা সমাধান করো।
          </p>

          {/* Progress */}

          <div className="mt-6 rounded-xl border border-blue-100 bg-white/80 p-4">

            <div className="mb-2 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <ListChecks className="h-4 w-4 text-blue-600" />
                তোমার শেখার অগ্রগতি
              </div>

              <span className="text-sm font-extrabold tabular-nums text-blue-700">
                {progress}%
              </span>

            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="অধ্যায় সম্পন্ন করার অগ্রগতি"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>
                {completedTopics.length}টি সম্পন্ন
              </span>

              <span>
                মোট {totalTopics}টি টপিক
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================== */}
      {/* MAIN LAYOUT */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">

        {/* ====================================== */}
        {/* SIDEBAR */}
        {/* ====================================== */}

        <aside className="lg:col-span-4">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Sidebar Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    অধ্যায়ের টপিকসমূহ
                  </h3>

                  <p className="text-xs text-slate-500">
                    {totalTopics}টি লেসন
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
                aria-label="টপিক তালিকা দেখান বা লুকান"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>

            </div>

            {sidebarOpen && (
              <div className="p-3">

                {/* Search */}

                <div className="relative mb-3">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="টপিক খুঁজুন..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    aria-label="টপিক খুঁজুন"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label="সার্চ মুছুন"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                </div>

                {/* Topic List */}

                <div className="max-h-[520px] space-y-1.5 overflow-y-auto pr-1">

                  {filteredTopics.length > 0 ? (
                    filteredTopics.map(({ topic, index }) => {

                      const isActive = selectedIndex === index;

                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleSelectTopic(index)}
                          aria-current={isActive ? 'step' : undefined}
                          className={`group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                            isActive
                              ? 'border-blue-200 bg-blue-50 shadow-sm'
                              : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >

                          <span
                            className={`flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-extrabold ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : isDone
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              topic.number
                            )}
                          </span>

                          <span className="min-w-0 flex-1">

                            <span
                              className={`block text-sm font-bold leading-snug ${
                                isActive
                                  ? 'text-blue-800'
                                  : 'text-slate-800'
                              }`}
                            >
                              {topic.title}
                            </span>

                            <span className="mt-1 block text-xs text-slate-500">
                              {topic.titleEn}
                            </span>

                          </span>

                          {isActive && (
                            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                          )}

                        </button>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center">

                      <Search className="mx-auto mb-2 h-6 w-6 text-slate-300" />

                      <p className="text-sm font-semibold text-slate-600">
                        কোনো টপিক পাওয়া যায়নি
                      </p>

                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                      >
                        সার্চ রিসেট করুন
                      </button>

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </aside>

        {/* ====================================== */}
        {/* MAIN CONTENT */}
        {/* ====================================== */}

        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* Topic Header */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <span>টপিক {activeTopic.number}</span>
                <span className="text-blue-300">/</span>
                <span>{activeTopic.titleEn}</span>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                {selectedIndex + 1} / {totalTopics}
              </span>

            </div>

            <h2 className="mt-4 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
              {activeTopic.title}
            </h2>

            {/* Summary */}

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-blue-900">

                <Sparkles className="h-4 w-4 text-blue-600" />

                মূল কথা

              </div>

              <div className="text-sm leading-7 text-slate-700">
                <MathText text={activeTopic.summary} />
              </div>

            </div>

            {/* Completion Button */}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

              <span className="text-xs text-slate-500">
                এই টপিকটি পড়া শেষ হলে সম্পন্ন হিসেবে চিহ্নিত করো।
              </span>

              <button
                type="button"
                onClick={toggleCompleted}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  isCompleted
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />

                {isCompleted ? 'সম্পন্ন হয়েছে' : 'পড়া শেষ করেছি'}

              </button>

            </div>

          </section>

          {/* Detailed Explanation */}

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>

                <p className="text-xs text-slate-500">
                  সহজ ভাষায় বিষয়টি বুঝে নাও
                </p>
              </div>

            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 text-sm leading-8 text-slate-700 sm:text-base">

              {activeTopic.explanation.map((paragraph, i) => (
                <p key={i}>
                  <MathText text={paragraph} />
                </p>
              ))}

            </div>

          </section>

          {/* Key Points */}

          {activeTopic.keyPoints?.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                  </h3>

                  <p className="text-xs text-emerald-700">
                    পরীক্ষার প্রস্তুতির জন্য
                  </p>
                </div>

              </div>

              <ul className="space-y-3">

                {activeTopic.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white/80 p-3 text-sm leading-relaxed text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <span className="min-w-0">
                      <MathText text={point} />
                    </span>

                  </li>
                ))}

              </ul>

            </section>
          )}

          {/* Formulas */}

          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    প্রয়োজনীয় সূত্রসমূহ
                  </h3>

                  <p className="text-xs text-slate-500">
                    গুরুত্বপূর্ণ গাণিতিক সূত্র
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-3">

                {activeTopic.formulas.map((formula, i) => (
                  <div
                    key={i}
                    className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-4"
                  >

                    <p className="mb-3 text-xs font-extrabold text-blue-700">
                      {formula.label}
                    </p>

                    <div className="min-w-0 overflow-x-auto rounded-lg bg-white p-3">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        <MathText text={formula.note} />
                      </p>
                    )}

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* Solved Example */}

          {activeTopic.example && (
            <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-950">
                    গাণিতিক উদাহরণ
                  </h3>

                  <p className="text-xs text-amber-700">
                    ধাপে ধাপে সমাধান
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-amber-100 bg-white p-4 sm:p-5">

                {/* Question */}

                <div className="mb-5">

                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-amber-700">
                    প্রশ্ন
                  </p>

                  <p className="text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </p>

                </div>

                {/* Given */}

                <div className="mb-5">

                  <p className="mb-2 text-xs font-extrabold text-slate-500">
                    দেওয়া আছে
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {activeTopic.example.given.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <MathText text={item} />
                      </span>
                    ))}

                  </div>

                </div>

                {/* Formula */}

                <div className="mb-5">

                  <p className="mb-2 text-xs font-extrabold text-slate-500">
                    ব্যবহৃত সূত্র
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>

                </div>

                {/* Solution */}

                <div className="mb-5">

                  <p className="mb-2 text-xs font-extrabold text-slate-500">
                    সমাধান
                  </p>

                  <div className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-sm leading-8 text-slate-800">

                    <MathText text={activeTopic.example.solution} />

                  </div>

                </div>

                {/* Answer */}

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <p className="mb-1 text-xs font-extrabold text-emerald-700">
                    চূড়ান্ত উত্তর
                  </p>

                  <p className="text-sm font-extrabold leading-relaxed text-emerald-800">
                    <MathText text={activeTopic.example.answer} />
                  </p>

                </div>

              </div>

            </section>
          )}

          {/* ====================================== */}
          {/* PREVIOUS / NEXT NAVIGATION */}
          {/* ====================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-xs font-bold text-slate-500">
                অধ্যায় নেভিগেশন
              </span>

              <span className="text-xs font-extrabold tabular-nums text-blue-700">
                {selectedIndex + 1} / {totalTopics}
              </span>

            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((selectedIndex + 1) / totalTopics) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />

                <span>পূর্ববর্তী</span>

              </button>

              {selectedIndex === totalTopics - 1 ? (

                <span className="text-xs font-bold text-emerald-600">
                  অধ্যায়ের শেষ টপিক
                </span>

              ) : (

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 sm:px-5 sm:text-sm"
                >
                  <span>পরবর্তী টপিক</span>

                  <ChevronRight className="h-4 w-4 shrink-0" />

                </button>

              )}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}
