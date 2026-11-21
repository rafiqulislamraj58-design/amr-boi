
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
  Menu,
  GraduationCap,
  ListChecks,
  BookMarked,
  ArrowUp,
  PanelLeftClose,
  PanelLeftOpen,
  Microscope,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { CELLS_AND_TISSUES_TOPICS } from './CellsAndTissuesTopicsData';

export default function CellsAndTissuesChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const topics = CELLS_AND_TISSUES_TOPICS;
  const totalTopics = topics.length;

  const activeTopic = topics[selectedIndex];

  // ---------------------------------------------------------
  // SEARCH TOPICS
  // ---------------------------------------------------------

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return topics;

    return topics.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.titleEn.toLowerCase().includes(query) ||
        topic.number.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, topics]);

  // ---------------------------------------------------------
  // PROGRESS
  // ---------------------------------------------------------

  const completedCount = completedTopics.length;

  const progressPercentage =
    totalTopics > 0
      ? Math.round((completedCount / totalTopics) * 100)
      : 0;

  const isCurrentTopicCompleted = activeTopic
    ? completedTopics.includes(activeTopic.id)
    : false;

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    setIsMobileMenuOpen(false);

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

  const toggleCompleted = () => {
    if (!activeTopic) return;

    setCompletedTopics((previous) =>
      previous.includes(activeTopic.id)
        ? previous.filter((id) => id !== activeTopic.id)
        : [...previous, activeTopic.id]
    );
  };

  // ---------------------------------------------------------
  // EMPTY STATE
  // ---------------------------------------------------------

  if (!activeTopic) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />

        <h2 className="text-xl font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          এই অধ্যায়ে বর্তমানে কোনো বিষয়বস্তু যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 sm:p-7">

        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-teal-200/20 blur-3xl" />

        <div className="relative">

          <div className="flex flex-wrap items-center gap-2 mb-4">

            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-700">
              <Microscope className="h-3.5 w-3.5" />
              জীববিজ্ঞান
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <GraduationCap className="h-3.5 w-3.5" />
              নবম-দশম শ্রেণি
            </span>

          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                কোষ ও টিস্যু
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
                Cells and Tissues
              </p>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                জীবকোষের গঠন, কোষীয় অঙ্গাণু এবং উদ্ভিদ ও প্রাণী টিস্যু সম্পর্কে
                বিস্তারিত জানো এবং নিজের শেখার অগ্রগতি অনুসরণ করো।
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 p-3 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xl font-black text-slate-900">
                  {totalTopics}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  মোট টপিক
                </p>
              </div>

            </div>

          </div>

          {/* Progress */}

          <div className="mt-6 rounded-2xl border border-white bg-white/80 p-4">

            <div className="mb-2 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-teal-600" />

                <span className="text-sm font-bold text-slate-800">
                  তোমার শেখার অগ্রগতি
                </span>
              </div>

              <span className="text-sm font-black tabular-nums text-teal-700">
                {progressPercentage}%
              </span>

            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="অধ্যায় সম্পন্ন করার অগ্রগতি"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {completedCount}টি সম্পন্ন / {totalTopics}টি টপিক
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          MOBILE TOPIC BUTTON
      ===================================================== */}

      <div className="flex items-center justify-between gap-3 lg:hidden">

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Menu className="h-4 w-4 text-teal-600" />
          টপিকসমূহ দেখুন
        </button>

        <span className="text-xs font-bold text-slate-500">
          {selectedIndex + 1} / {totalTopics}
        </span>

      </div>

      {/* =====================================================
          MAIN CONTENT LAYOUT
      ===================================================== */}

      <div
        className={`grid grid-cols-1 gap-5 ${
          isSidebarCollapsed
            ? 'lg:grid-cols-1'
            : 'lg:grid-cols-12'
        }`}
      >

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        {!isSidebarCollapsed && (
          <aside className="hidden lg:col-span-4 lg:block">

            <div className="sticky top-5 space-y-4">

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Sidebar Header */}

                <div className="border-b border-slate-100 p-4">

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <BookOpen className="h-4 w-4" />
                      </div>

                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          অধ্যায়ের টপিকসমূহ
                        </h2>

                        <p className="text-xs text-slate-500">
                          {totalTopics}টি পাঠ
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSidebarCollapsed(true)}
                      title="Sidebar বন্ধ করুন"
                      aria-label="Sidebar বন্ধ করুন"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </button>

                  </div>

                  {/* Search */}

                  <div className="relative mt-4">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="টপিক খুঁজুন..."
                      aria-label="টপিক খুঁজুন"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="সার্চ মুছুন"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                  </div>

                </div>

                {/* Topic List */}

                <div className="max-h-[calc(100vh-300px)] space-y-1.5 overflow-y-auto p-3">

                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => {
                      const originalIndex = topics.findIndex(
                        (item) => item.id === topic.id
                      );

                      const isActive = originalIndex === selectedIndex;

                      const isCompleted = completedTopics.includes(
                        topic.id
                      );

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleSelectTopic(originalIndex)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`group w-full rounded-xl border p-3 text-left transition-all ${
                            isActive
                              ? 'border-teal-200 bg-teal-50 shadow-sm'
                              : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            <span
                              className={`flex h-7 min-w-10 shrink-0 items-center justify-center rounded-lg px-2 text-xs font-black ${
                                isActive
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}
                            >
                              {topic.number}
                            </span>

                            <div className="min-w-0 flex-1">

                              <p
                                className={`text-sm font-bold leading-5 ${
                                  isActive
                                    ? 'text-teal-900'
                                    : 'text-slate-700'
                                }`}
                              >
                                {topic.title}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {topic.titleEn}
                              </p>

                              {isCompleted && (
                                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  সম্পন্ন
                                </span>
                              )}

                            </div>

                            {isActive && (
                              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                            )}

                          </div>

                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center">

                      <Search className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        কোনো টপিক পাওয়া যায়নি
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        অন্য কোনো শব্দ দিয়ে খুঁজে দেখো।
                      </p>

                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-bold text-teal-600 hover:text-teal-700"
                      >
                        সার্চ মুছে ফেলো
                      </button>

                    </div>
                  )}

                </div>

              </div>

              {/* Learning Tip */}

              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">

                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />

                  <p className="text-sm font-bold text-amber-900">
                    পড়ার পরামর্শ
                  </p>
                </div>

                <p className="mt-2 text-xs leading-6 text-amber-800">
                  প্রতিটি টপিক পড়ার পর গুরুত্বপূর্ণ তথ্যগুলো
                  পুনরায় পড়ো এবং সম্পন্ন বাটনে ক্লিক করে
                  নিজের অগ্রগতি চিহ্নিত করো।
                </p>

              </div>

            </div>

          </aside>
        )}

        {/* ===================================================
            MOBILE DRAWER
        =================================================== */}

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">

            <button
              type="button"
              aria-label="মেনু বন্ধ করুন"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            <aside
              role="dialog"
              aria-modal="true"
              aria-label="অধ্যায়ের টপিকসমূহ"
              className="absolute bottom-0 left-0 top-0 flex w-[min(88%,360px)] flex-col overflow-hidden bg-white shadow-2xl"
            >

              <div className="flex items-center justify-between border-b border-slate-100 p-4">

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600" />

                  <h2 className="font-bold text-slate-900">
                    অধ্যায়ের টপিকসমূহ
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="বন্ধ করুন"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <div className="border-b border-slate-100 p-3">

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="টপিক খুঁজুন..."
                    aria-label="টপিক খুঁজুন"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-400 focus:bg-white"
                  />
                </div>

              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-3">

                {filteredTopics.map((topic) => {
                  const originalIndex = topics.findIndex(
                    (item) => item.id === topic.id
                  );

                  const isActive = originalIndex === selectedIndex;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(originalIndex)}
                      className={`w-full rounded-xl border p-3 text-left ${
                        isActive
                          ? 'border-teal-200 bg-teal-50'
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <span
                          className={`rounded-lg px-2 py-1 text-xs font-bold ${
                            isActive
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {topic.number}
                        </span>

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-bold text-slate-800">
                            {topic.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {topic.titleEn}
                          </p>

                        </div>

                        {completedTopics.includes(topic.id) && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}

                      </div>

                    </button>
                  );
                })}

                {filteredTopics.length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-500">
                    কোনো টপিক পাওয়া যায়নি।
                  </p>
                )}

              </div>

            </aside>

          </div>
        )}

        {/* ===================================================
            MAIN TOPIC CONTENT
        =================================================== */}

        <main
          className={`min-w-0 space-y-5 ${
            isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'
          }`}
        >

          {/* Collapsed Sidebar Toggle */}

          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 lg:inline-flex"
            >
              <PanelLeftOpen className="h-4 w-4" />
              টপিক লিস্ট দেখুন
            </button>
          )}

          {/* =================================================
              TOPIC HEADER
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5 sm:p-7">

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                  <BookMarked className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {selectedIndex + 1} / {totalTopics}
                </span>

                {isCurrentTopicCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    সম্পন্ন
                  </span>
                )}

              </div>

              <h2 className="mt-4 text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-400">
                {activeTopic.titleEn}
              </p>

              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5">

                <div className="mb-2 flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>

                  <h3 className="text-sm font-bold text-teal-900">
                    মূল ধারণা
                  </h3>

                </div>

                <div className="text-sm leading-7 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </div>

              </div>

              {/* Complete Button */}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                <p className="text-xs text-slate-500">
                  পড়া শেষ হলে নিচের বাটনে ক্লিক করো।
                </p>

                <button
                  type="button"
                  onClick={toggleCompleted}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    isCurrentTopicCompleted
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-teal-600 text-white shadow-sm hover:bg-teal-700'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />

                  {isCurrentTopicCompleted
                    ? 'সম্পন্ন হয়েছে'
                    : 'পড়া সম্পন্ন করো'}
                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              DETAILED EXPLANATION
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>

                <p className="text-xs text-slate-500">
                  সহজ ভাষায় বিষয়বস্তু বুঝে নাও
                </p>
              </div>

              <span className="ml-auto rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {activeTopic.explanation.length}টি অংশ
              </span>

            </div>

            <div className="space-y-4">

              {activeTopic.explanation.map((paragraph, index) => (
                <div
                  key={`${activeTopic.id}-explanation-${index}`}
                  className="group flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-teal-100 hover:bg-teal-50/30 sm:gap-4"
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-teal-700 shadow-sm ring-1 ring-slate-200">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    <MathText text={paragraph} />
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* =================================================
              KEY POINTS
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white p-5 sm:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">
                  মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                </h3>

                <p className="text-xs text-slate-500">
                  পরীক্ষার প্রস্তুতির জন্য গুরুত্বপূর্ণ
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">

              {activeTopic.keyPoints.map((point, index) => (
                <div
                  key={`${activeTopic.id}-keypoint-${index}`}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-100/80 bg-white/80 p-3.5 transition hover:border-amber-300 hover:shadow-sm"
                >

                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                  <div className="text-sm leading-6 text-slate-700">
                    <MathText text={point} />
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* =================================================
              FORMULAS / IMPORTANT INFORMATION
          ================================================= */}

          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">
                    প্রয়োজনীয় তথ্য ও সূত্র
                  </h3>

                  <p className="text-xs text-slate-500">
                    গুরুত্বপূর্ণ সংকেত ও বৈজ্ঞানিক প্রকাশ
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-violet-50/40 p-4"
                  >

                    <p className="text-xs font-bold leading-5 text-violet-700">
                      {formula.label}
                    </p>

                    <div className="my-3 flex min-h-14 items-center justify-center overflow-x-auto rounded-lg border border-violet-100 bg-white p-3">
                      <FormulaBox formula={formula.latex} block />
                    </div>

                    {formula.note && (
                      <p className="text-xs leading-6 text-slate-600">
                        <MathText text={formula.note} />
                      </p>
                    )}

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* =================================================
              STUDY REMINDER
          ================================================= */}

          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  শেখার পরামর্শ
                </h3>

                <p className="mt-1 text-xs leading-6 text-blue-800">
                  এই টপিকের ব্যাখ্যা ও গুরুত্বপূর্ণ তথ্যগুলো মনোযোগ দিয়ে পড়ো।
                  এরপর পরবর্তী টপিকে যাওয়ার আগে নিজের ভাষায় বিষয়টি
                  ব্যাখ্যা করার চেষ্টা করো।
                </p>
              </div>

            </div>

          </section>

          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between gap-3">

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  অধ্যায়ের অগ্রগতি
                </p>

                <p className="mt-1 text-sm font-black text-slate-800">
                  টপিক {selectedIndex + 1} / {totalTopics}
                </p>
              </div>

              <div className="flex items-center gap-1.5">

                {topics.map((topic, index) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    title={`টপিক ${topic.number}`}
                    aria-label={`টপিক ${topic.number} এ যান`}
                    aria-current={selectedIndex === index ? 'step' : undefined}
                    className={`h-2 rounded-full transition-all ${
                      selectedIndex === index
                        ? 'w-7 bg-teal-600'
                        : completedTopics.includes(topic.id)
                          ? 'w-3 bg-emerald-400'
                          : 'w-3 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}

              </div>

            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <span className="hidden text-xs font-semibold text-slate-400 sm:block">
                {selectedIndex === 0
                  ? 'শুরু থেকে শেখা শুরু করো'
                  : selectedIndex === totalTopics - 1
                    ? 'শেষ টপিক'
                    : 'শেখা চালিয়ে যাও'}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>পরবর্তী টপিক</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>

          </section>

          {/* Back to top */}

          <div className="flex justify-center pb-3">

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-teal-200 hover:text-teal-700"
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
