
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
  FlaskConical,
  ArrowUp,
  BookMarked,
  Layers3,
  CircleCheck,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { MINERAL_RESOURCES_METAL_TOPICS } from './MineralResourcesMetalTopicsData';

export default function MineralResourcesMetalChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const activeTopic = MINERAL_RESOURCES_METAL_TOPICS[selectedIndex];

  const totalTopics = MINERAL_RESOURCES_METAL_TOPICS.length;

  const progress =
    totalTopics > 0
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;

  // Search topics
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return MINERAL_RESOURCES_METAL_TOPICS;

    return MINERAL_RESOURCES_METAL_TOPICS.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.titleEn.toLowerCase().includes(query) ||
        topic.number.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.explanation.some((item) =>
          item.toLowerCase().includes(query)
        )
      );
    });
  }, [searchQuery]);

  // Select topic
  const handleSelectTopic = (index: number) => {
    setSelectedIndex(index);
    setIsSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Previous topic
  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleSelectTopic(selectedIndex - 1);
    }
  };

  // Next topic
  const handleNext = () => {
    if (selectedIndex < totalTopics - 1) {
      handleSelectTopic(selectedIndex + 1);
    }
  };

  // Mark topic as completed
  const toggleComplete = () => {
    if (!activeTopic) return;

    setCompletedTopics((previous) =>
      previous.includes(activeTopic.id)
        ? previous.filter((id) => id !== activeTopic.id)
        : [...previous, activeTopic.id]
    );
  };

  // Back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!activeTopic) return null;

  const isCompleted = completedTopics.includes(activeTopic.id);

  return (
    <div className="space-y-5">
      {/* =========================================
          CHAPTER HEADER
      ========================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-7">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-teal-100/60 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <GraduationCap className="h-3.5 w-3.5" />
              নবম-দশম শ্রেণি
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-emerald-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <BookOpen className="h-3.5 w-3.5" />
              রসায়ন
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                Chapter 10
              </p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                খনিজ সম্পদ ও ধাতু
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                খনিজ সম্পদ, আকরিক, ধাতু নিষ্কাশন, সংকর ধাতু এবং
                সালফারের গুরুত্বপূর্ণ রাসায়নিক প্রক্রিয়া সম্পর্কে
                বিস্তারিত শেখো।
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:min-w-[150px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Layers3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-extrabold text-slate-900">
                  {totalTopics}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  মোট টপিক
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-7 rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <ListChecks className="h-4 w-4 text-emerald-600" />
                তোমার শেখার অগ্রগতি
              </div>

              <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                {progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {completedTopics.length}টি টপিক সম্পন্ন হয়েছে, বাকি{' '}
              {totalTopics - completedTopics.length}টি।
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN GRID
      ========================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* =========================================
            SIDEBAR
        ========================================= */}
        <aside className="lg:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-5">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <BookMarked className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    অধ্যায়ের টপিকসমূহ
                  </h2>
                  <p className="text-xs text-slate-500">
                    {totalTopics}টি লেসন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:hidden"
                aria-label="Toggle topic sidebar"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Sidebar Content */}
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="p-3">
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="টপিক খুঁজুন..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Topic count */}
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-slate-500">
                    সব লেসন
                  </span>

                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    {filteredTopics.length} পাওয়া গেছে
                  </span>
                </div>

                {/* Topic List */}
                <div className="max-h-[65vh] space-y-1.5 overflow-y-auto pr-1">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => {
                      const originalIndex =
                        MINERAL_RESOURCES_METAL_TOPICS.findIndex(
                          (item) => item.id === topic.id
                        );

                      const isActive = originalIndex === selectedIndex;
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleSelectTopic(originalIndex)}
                          className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                            isActive
                              ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                              : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 flex h-7 min-w-10 items-center justify-center rounded-lg px-1.5 text-[11px] font-extrabold ${
                                isActive
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}
                            >
                              {topic.number}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-bold leading-snug ${
                                  isActive
                                    ? 'text-emerald-900'
                                    : 'text-slate-700'
                                }`}
                              >
                                {topic.title}
                              </p>

                              <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">
                                {topic.titleEn}
                              </p>
                            </div>

                            {isDone && (
                              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                      <Search className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">
                        কোনো টপিক পাওয়া যায়নি
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        অন্য কোনো শব্দ দিয়ে চেষ্টা করো।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}
        <main className="min-w-0 space-y-5 lg:col-span-8">
          {/* Topic Header */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {selectedIndex + 1} / {totalTopics}
                </span>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    সম্পন্ন
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <p className="mt-2 text-xs font-medium tracking-wide text-slate-400">
                {activeTopic.titleEn}
              </p>

              {/* Summary */}
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-800">
                    মূল ধারণা
                  </span>
                </div>

                <p className="text-sm leading-7 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </p>
              </div>
            </div>

            {/* Topic Completion */}
            <div className="flex flex-col gap-3 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                এই টপিকটি পড়া শেষ হলে সম্পন্ন হিসেবে চিহ্নিত করো।
              </p>

              <button
                type="button"
                onClick={toggleComplete}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  isCompleted
                    ? 'border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <CircleCheck className="h-4 w-4" />
                {isCompleted ? 'সম্পন্ন হয়েছে' : 'টপিক সম্পন্ন করো'}
              </button>
            </div>
          </section>

          {/* Detailed Explanation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>
                <p className="text-xs text-slate-500">
                  বিষয়টি ধাপে ধাপে বুঝে নাও
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeTopic.explanation.map((paragraph, index) => (
                <div
                  key={`${activeTopic.id}-explanation-${index}`}
                  className="group flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-emerald-100 hover:bg-emerald-50/30 sm:p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-emerald-700 shadow-sm ring-1 ring-slate-100">
                    {index + 1}
                  </span>

                  <p className="min-w-0 flex-1 text-sm leading-7 text-slate-700">
                    <MathText text={paragraph} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Points */}
          {activeTopic.keyPoints.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-950">
                    মনে রাখার মতো তথ্য
                  </h3>
                  <p className="text-xs text-amber-800/70">
                    পরীক্ষার প্রস্তুতির জন্য গুরুত্বপূর্ণ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {activeTopic.keyPoints.map((point, index) => (
                  <div
                    key={`${activeTopic.id}-point-${index}`}
                    className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-white/80 p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-sm leading-6 text-slate-700">
                      <MathText text={point} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formulas */}
          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    প্রয়োজনীয় সমীকরণ
                  </h3>
                  <p className="text-xs text-slate-500">
                    গুরুত্বপূর্ণ রাসায়নিক বিক্রিয়া ও সংকেত
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="overflow-hidden rounded-xl border border-purple-100 bg-purple-50/30"
                  >
                    <div className="flex items-center gap-2 border-b border-purple-100 bg-purple-50/70 px-4 py-3">
                      <FlaskConical className="h-4 w-4 text-purple-600" />

                      <p className="text-xs font-extrabold text-purple-900">
                        {formula.label}
                      </p>
                    </div>

                    <div className="overflow-x-auto p-4">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <div className="border-t border-purple-100 bg-white/70 px-4 py-3">
                        <p className="text-xs leading-6 text-slate-600">
                          <MathText text={formula.note} />
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Solved Example */}
          {activeTopic.example && (
            <section className="overflow-hidden rounded-2xl border border-orange-200 bg-orange-50/40 shadow-sm">
              <div className="flex items-center gap-3 border-b border-orange-100 bg-orange-50/80 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-orange-950">
                    উদাহরণ ও সমাধান
                  </h3>
                  <p className="text-xs text-orange-800/70">
                    ধাপে ধাপে সমাধান বুঝে নাও
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {/* Question */}
                <div className="rounded-xl border border-orange-100 bg-white p-4">
                  <p className="mb-2 text-xs font-extrabold text-orange-700">
                    প্রশ্ন
                  </p>

                  <p className="text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </p>
                </div>

                {/* Given */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-xs font-extrabold text-slate-500">
                    দেওয়া আছে
                  </p>

                  <div className="space-y-2">
                    {activeTopic.example.given.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                        <MathText text={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula */}
                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                  <p className="mb-3 text-xs font-extrabold text-purple-800">
                    প্রয়োজনীয় সূত্র / সমীকরণ
                  </p>

                  <div className="overflow-x-auto">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>
                </div>

                {/* Solution */}
                <div className="rounded-xl border border-blue-100 bg-white p-4">
                  <p className="mb-2 text-xs font-extrabold text-blue-700">
                    সমাধান
                  </p>

                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    <MathText text={activeTopic.example.solution} />
                  </p>
                </div>

                {/* Answer */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />

                    <p className="text-xs font-extrabold text-emerald-800">
                      চূড়ান্ত উত্তর
                    </p>
                  </div>

                  <p className="whitespace-pre-line text-sm font-bold leading-7 text-emerald-950">
                    <MathText text={activeTopic.example.answer} />
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =========================================
              BOTTOM NAVIGATION
          ========================================= */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">
                  অধ্যায়ের অগ্রগতি
                </p>

                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  টপিক {selectedIndex + 1} / {totalTopics}
                </p>
              </div>

              <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                {Math.round(((selectedIndex + 1) / totalTopics) * 100)}%
              </span>
            </div>

            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <button
                type="button"
                onClick={scrollToTop}
                className="hidden items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:inline-flex"
              >
                <ArrowUp className="h-4 w-4" />
                উপরে যাও
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Chapter Completed */}
          {selectedIndex === totalTopics - 1 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <GraduationCap className="h-6 w-6" />
              </div>

              <h3 className="text-base font-extrabold text-emerald-950">
                তুমি অধ্যায়ের শেষ টপিকে পৌঁছে গেছ!
              </h3>

              <p className="mt-1 text-sm text-emerald-800/80">
                সবগুলো বিষয় ভালোভাবে রিভিশন করে নিজের প্রস্তুতি যাচাই করো।
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
