
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
  ListChecks,
  GraduationCap,
  Clock3,
  Menu,
  CircleCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Bookmark,
  BookMarked,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { CELL_DIVISION_TOPICS } from './CellDivisionTopicsData';

export default function CellDivisionChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  const topics = CELL_DIVISION_TOPICS;
  const activeTopic = topics[selectedIndex];

  const totalTopics = topics.length;
  const completedCount = completedTopics.length;

  const progress = totalTopics
    ? Math.round((completedCount / totalTopics) * 100)
    : 0;

  // Filter topics
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return topics.filter((topic) => {
      const matchesSearch =
        !query ||
        topic.title.toLowerCase().includes(query) ||
        topic.titleEn.toLowerCase().includes(query) ||
        topic.number.includes(query) ||
        topic.summary.toLowerCase().includes(query);

      const matchesCompleted =
        !showCompletedOnly || completedTopics.includes(topic.id);

      return matchesSearch && matchesCompleted;
    });
  }, [topics, searchQuery, showCompletedOnly, completedTopics]);

  // Select topic
  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    setSidebarOpen(false);

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

  // Toggle completion
  const toggleComplete = (topicId: string) => {
    setCompletedTopics((previous) =>
      previous.includes(topicId)
        ? previous.filter((id) => id !== topicId)
        : [...previous, topicId]
    );
  };

  const isCompleted = activeTopic
    ? completedTopics.includes(activeTopic.id)
    : false;

  // Empty state
  if (!activeTopic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          CELL_DIVISION_TOPICS ডেটা চেক করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">

      {/* =========================================
          CHAPTER HEADER
      ========================================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 p-5 sm:p-7 text-white shadow-lg">

        <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-1/3 w-48 h-48 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative z-10">

          <div className="flex items-center gap-2 text-teal-100 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>নবম-দশম শ্রেণি</span>
            <span className="opacity-60">/</span>
            <span>জীববিজ্ঞান</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                CHAPTER 03
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                কোষ বিভাজন
              </h1>

              <p className="text-sm text-teal-100 mt-2">
                Cell Division — Interactive Learning
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="text-xs text-teal-100">মোট টপিক</p>
                <p className="text-2xl font-extrabold">
                  {totalTopics}
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="text-xs text-teal-100">সম্পন্ন</p>
                <p className="text-2xl font-extrabold">
                  {completedCount}
                </p>
              </div>

            </div>
          </div>

          {/* Learning Progress */}
          <div className="mt-6">

            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-teal-50">
                তোমার শেখার অগ্রগতি
              </span>

              <span className="font-bold">
                {progress}%
              </span>
            </div>

            <div className="h-2.5 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          MAIN LAYOUT
      ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* =====================================
            SIDEBAR
        ===================================== */}
        <aside className="lg:col-span-4">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-5">

            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-100">

              <div className="flex items-center justify-between gap-2">

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      অধ্যায়ের টপিক
                    </h2>

                    <p className="text-[11px] text-slate-500">
                      {totalTopics} টি লার্নিং সেকশন
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                  aria-label="Toggle topics"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

              </div>

              {/* Search */}
              <div className="relative mt-4">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="টপিক খুঁজুন..."
                  className="w-full h-10 pl-9 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 mt-3">

                <button
                  type="button"
                  onClick={() => setShowCompletedOnly(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    !showCompletedOnly
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  সব টপিক ({totalTopics})
                </button>

                <button
                  type="button"
                  onClick={() => setShowCompletedOnly(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    showCompletedOnly
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  সম্পন্ন ({completedCount})
                </button>

              </div>

            </div>

            {/* Topic List */}
            <div
              className={`p-3 space-y-1.5 ${
                sidebarOpen ? 'block' : 'hidden lg:block'
              }`}
            >

              <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">

                {filteredTopics.length > 0 ? (

                  filteredTopics.map((topic) => {
                    const originalIndex = topics.findIndex(
                      (item) => item.id === topic.id
                    );

                    const active = originalIndex === selectedIndex;
                    const completed = completedTopics.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(originalIndex)}
                        className={`group w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                          active
                            ? 'bg-teal-50 border-teal-200 shadow-sm'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          <span
                            className={`shrink-0 min-w-9 h-8 flex items-center justify-center rounded-lg text-xs font-extrabold ${
                              active
                                ? 'bg-teal-600 text-white'
                                : completed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {topic.number}
                          </span>

                          <div className="flex-1 min-w-0">

                            <p
                              className={`text-sm font-bold leading-snug ${
                                active
                                  ? 'text-teal-900'
                                  : 'text-slate-700'
                              }`}
                            >
                              {topic.title}
                            </p>

                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                              {topic.titleEn}
                            </p>

                            {completed && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
                                <CheckCircle2 className="w-3 h-3" />
                                সম্পন্ন
                              </span>
                            )}

                          </div>

                          {active && (
                            <ChevronRight className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
                          )}

                        </div>

                      </button>
                    );
                  })

                ) : (

                  <div className="py-10 text-center">

                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                    <p className="text-sm font-bold text-slate-600">
                      কোনো টপিক পাওয়া যায়নি
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      অন্য নামে সার্চ করুন।
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowCompletedOnly(false);
                      }}
                      className="text-xs font-bold text-teal-600 mt-3"
                    >
                      সব টপিক দেখুন
                    </button>

                  </div>
                )}

              </div>

              {/* Sidebar Footer */}
              <div className="pt-3 border-t border-slate-100">

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>সম্পন্ন টপিক</span>

                  <span className="font-bold text-teal-700">
                    {completedCount}/{totalTopics}
                  </span>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

              </div>

            </div>
          </div>
        </aside>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}
        <main className="lg:col-span-8 min-w-0 space-y-5">

          {/* Topic Header */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">

            <div className="flex items-center justify-between flex-wrap gap-3">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">

                <BookOpen className="w-3.5 h-3.5" />

                <span>টপিক {activeTopic.number}</span>

                <span className="text-teal-300">/</span>

                <span>{selectedIndex + 1} of {totalTopics}</span>

              </div>

              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  সম্পন্ন হয়েছে
                </span>
              )}

            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-4">
              {activeTopic.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {activeTopic.titleEn}
            </p>

            {/* Summary */}
            <div className="mt-5 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-4 sm:p-5">

              <div className="flex items-center gap-2 mb-2">

                <Sparkles className="w-4 h-4 text-teal-600" />

                <h3 className="text-sm font-extrabold text-teal-900">
                  মূল ধারণা
                </h3>

              </div>

              <div className="text-sm text-slate-700 leading-7">
                <MathText text={activeTopic.summary} />
              </div>

            </div>

            {/* Topic Complete Button */}
            <div className="mt-4 flex justify-end">

              <button
                type="button"
                onClick={() => toggleComplete(activeTopic.id)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                }`}
              >

                {isCompleted ? (
                  <>
                    <CircleCheck className="w-4 h-4" />
                    সম্পন্ন হয়েছে
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    টপিক সম্পন্ন হিসেবে চিহ্নিত করুন
                  </>
                )}

              </button>

            </div>

          </section>

          {/* =====================================
              DETAILED EXPLANATION
          ===================================== */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed Explanation
                </p>
              </div>

            </div>

            <div className="space-y-4">

              {activeTopic.explanation.map((paragraph, index) => (

                <div
                  key={`${activeTopic.id}-explanation-${index}`}
                  className="flex items-start gap-3 group"
                >

                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 flex items-center justify-center text-xs font-bold transition-colors">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0 text-sm sm:text-[15px] text-slate-700 leading-7 pt-0.5">
                    <MathText text={paragraph} />
                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* =====================================
              KEY POINTS
          ===================================== */}
          <section className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">

            <div className="bg-amber-50/70 px-5 py-4 border-b border-amber-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Key Points & Quick Revision
                  </p>
                </div>

              </div>

            </div>

            <div className="p-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {activeTopic.keyPoints.map((point, index) => (

                  <div
                    key={`${activeTopic.id}-point-${index}`}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-colors"
                  >

                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />

                    <div className="text-sm text-slate-700 leading-6">
                      <MathText text={point} />
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>

          {/* =====================================
              FORMULAS
          ===================================== */}
          {activeTopic.formulas && activeTopic.formulas.length > 0 && (

            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    প্রয়োজনীয় সূত্র ও ধাপ
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Important Formulas & Sequences
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                {activeTopic.formulas.map((formula, index) => (

                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="rounded-xl border border-violet-100 overflow-hidden"
                  >

                    <div className="flex items-center gap-2 px-4 py-3 bg-violet-50/70">

                      <span className="w-6 h-6 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>

                      <h4 className="text-xs sm:text-sm font-bold text-violet-900">
                        {formula.label}
                      </h4>

                    </div>

                    <div className="p-4 space-y-3">

                      <div className="overflow-x-auto py-2 text-center">
                        <FormulaBox
                          formula={formula.latex}
                          block
                        />
                      </div>

                      {formula.note && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50">

                          <BookMarked className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />

                          <div className="text-xs text-slate-600 leading-6">
                            <MathText text={formula.note} />
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}

          {/* =====================================
              LEARNING STATUS
          ===================================== */}
          <section className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 sm:p-5">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                <ListChecks className="w-5 h-5 text-teal-700" />
              </div>

              <div className="flex-1">

                <h3 className="text-sm font-extrabold text-teal-950">
                  তোমার লার্নিং অগ্রগতি
                </h3>

                <p className="text-xs text-slate-600 mt-1">
                  {completedCount} টি টপিক সম্পন্ন হয়েছে।
                  বাকি {totalTopics - completedCount} টি।
                </p>

              </div>

              <span className="text-lg font-extrabold text-teal-700">
                {progress}%
              </span>

            </div>

          </section>

          {/* =====================================
              PREVIOUS / NEXT NAVIGATION
          ===================================== */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

            <div className="flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >

                <ChevronLeft className="w-4 h-4" />

                <span className="hidden sm:inline">
                  পূর্ববর্তী টপিক
                </span>

                <span className="sm:hidden">
                  Previous
                </span>

              </button>

              <div className="text-center">

                <p className="text-sm font-extrabold text-slate-800">
                  {selectedIndex + 1} / {totalTopics}
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Topic Navigation
                </p>

              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-bold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >

                <span className="hidden sm:inline">
                  পরবর্তী টপিক
                </span>

                <span className="sm:hidden">
                  Next
                </span>

                <ChevronRight className="w-4 h-4" />

              </button>

            </div>

          </section>

        </main>
      </div>
    </div>
  );
}
