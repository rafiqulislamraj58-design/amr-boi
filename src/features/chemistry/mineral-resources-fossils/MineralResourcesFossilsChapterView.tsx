
'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  Bookmark,
  BookmarkCheck,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ListChecks,
  Atom,
  Lightbulb,
  FlaskConical,
  Copy,
  Check,
  ArrowUp,
  BookMarked,
  Clock,
  Target,
  Library,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';

import {
  MINERAL_RESOURCES_FOSSILS_TOPICS,
} from './MineralResourcesFossilsTopicsData';

export default function MineralResourcesFossilsChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const topics = MINERAL_RESOURCES_FOSSILS_TOPICS;
  const activeTopic = topics[selectedIndex];

  const totalTopics = topics.length;
  const completedCount = completedTopics.length;
  const progress = totalTopics
    ? Math.round((completedCount / totalTopics) * 100)
    : 0;

  const isBookmarked = bookmarks.includes(activeTopic.id);
  const isCompleted = completedTopics.includes(activeTopic.id);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.number.includes(searchQuery);

      const matchesBookmark =
        !showBookmarksOnly || bookmarks.includes(topic.id);

      return matchesSearch && matchesBookmark;
    });
  }, [topics, searchQuery, showBookmarksOnly, bookmarks]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedIndex]);

  const handleSelectTopic = (index: number) => {
    setSelectedIndex(index);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < totalTopics - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const toggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(activeTopic.id)
        ? prev.filter((id) => id !== activeTopic.id)
        : [...prev, activeTopic.id]
    );
  };

  const toggleCompleted = () => {
    setCompletedTopics((prev) =>
      prev.includes(activeTopic.id)
        ? prev.filter((id) => id !== activeTopic.id)
        : [...prev, activeTopic.id]
    );
  };

  const handleCopyFormula = async (formula: string, index: number) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      setCopiedIndex(null);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!activeTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">

      {/* ================================================= */}
      {/* CHAPTER HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-5 sm:p-7 text-white shadow-sm">

        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100">
              <GraduationCap className="h-4 w-4" />
              SSC Chemistry
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              Class 9–10
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              অধ্যায় ১১
            </span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2 text-emerald-200">
                <Atom className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Chemistry Learning Module
                </span>
              </div>

              <h1 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                খনিজ সম্পদ: জীবাশ্ম
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
                জীবাশ্ম জ্বালানি, হাইড্রোকার্বন, জৈব যৌগ এবং পলিমার সম্পর্কে বিস্তারিত শেখো।
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center min-w-[105px]">
                <p className="text-3xl font-black tabular-nums">
                  {totalTopics}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-100">
                  মোট টপিক
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center min-w-[105px]">
                <p className="text-3xl font-black tabular-nums">
                  {completedCount}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-100">
                  সম্পন্ন
                </p>
              </div>
            </div>

          </div>

          {/* Overall Progress */}

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-100">
                তোমার শেখার অগ্রগতি
              </span>

              <span className="font-black text-white tabular-nums">
                {progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN LAYOUT */}
      {/* ================================================= */}

      <div className={`grid grid-cols-1 gap-5 ${
        readingMode
          ? 'lg:grid-cols-1'
          : 'lg:grid-cols-12'
      }`}>

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        {!readingMode && sidebarOpen && (
          <aside className="lg:col-span-4">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-5">

              {/* Sidebar Header */}

              <div className="border-b border-slate-100 p-4">

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <Library className="h-4 w-4 text-emerald-600" />
                    </div>

                    <div>
                      <h2 className="text-sm font-black text-slate-900">
                        অধ্যায়ের পাঠসমূহ
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {totalTopics}টি শেখার বিষয়
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:block"
                    aria-label="Sidebar বন্ধ করুন"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>

                {/* Search */}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="টপিক খুঁজে দেখো..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label="Search মুছুন"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filters */}

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookmarksOnly(false)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      !showBookmarksOnly
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    সব টপিক
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBookmarksOnly(true)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      showBookmarksOnly
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    বুকমার্ক ({bookmarks.length})
                  </button>
                </div>

              </div>

              {/* Topic List */}

              <div className="max-h-[65vh] space-y-1.5 overflow-y-auto p-3">

                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => {
                    const originalIndex = topics.findIndex(
                      (item) => item.id === topic.id
                    );

                    const active = selectedIndex === originalIndex;
                    const completed = completedTopics.includes(topic.id);
                    const bookmarked = bookmarks.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(originalIndex)}
                        className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                          active
                            ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                            : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          <div
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg text-xs font-black ${
                              active
                                ? 'bg-emerald-600 text-white'
                                : completed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {completed && !active ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              topic.number
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className={`text-sm font-bold leading-snug ${
                                active
                                  ? 'text-emerald-900'
                                  : 'text-slate-800'
                              }`}>
                                {topic.title}
                              </p>

                              {bookmarked && (
                                <BookmarkCheck className="h-4 w-4 shrink-0 text-amber-500" />
                              )}

                            </div>

                            <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">
                              {topic.titleEn}
                            </p>

                            {active && (
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                বর্তমানে পড়ছো
                              </div>
                            )}

                          </div>

                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-10 text-center">
                    <Search className="mx-auto mb-2 h-7 w-7 text-slate-300" />
                    <p className="text-sm font-bold text-slate-600">
                      কোনো টপিক পাওয়া যায়নি
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      অন্য নামে সার্চ করে দেখো।
                    </p>
                  </div>
                )}

              </div>

              {/* Sidebar Footer */}

              <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    সম্পন্ন টপিক
                  </span>
                  <span className="font-black text-emerald-700">
                    {completedCount}/{totalTopics}
                  </span>
                </div>
              </div>

            </div>
          </aside>
        )}

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <main className={`min-w-0 space-y-5 ${
          readingMode || !sidebarOpen
            ? 'lg:col-span-12'
            : 'lg:col-span-8'
        }`}>

          {/* Content Toolbar */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              {!sidebarOpen && !readingMode && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                  টপিক তালিকা
                </button>
              )}

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <BookOpen className="h-4 w-4" />
                <span>অধ্যায় ১১</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-emerald-700">
                  টপিক {activeTopic.number}
                </span>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={toggleBookmark}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  isBookmarked
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span>
                  {isBookmarked ? 'সংরক্ষিত' : 'বুকমার্ক'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReadingMode(!readingMode)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <BookMarked className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {readingMode ? 'স্বাভাবিক মোড' : 'রিডিং মোড'}
                </span>
              </button>

            </div>

          </div>

          {/* Topic Header */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5 sm:p-7">

              <div className="mb-4 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                  <Atom className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  SSC Chemistry
                </span>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    সম্পন্ন
                  </span>
                )}

              </div>

              <h2 className="text-xl font-black leading-snug text-slate-900 sm:text-2xl lg:text-3xl">
                {activeTopic.title}
              </h2>

              <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
                {activeTopic.titleEn}
              </p>

              {/* Summary */}

              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">

                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-emerald-900">
                    মূল ধারণা
                  </h3>
                </div>

                <div className="text-sm leading-7 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </div>

              </div>

              {/* Topic Progress */}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span>
                    পাঠ {selectedIndex + 1} / {totalTopics}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleCompleted}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    isCompleted
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isCompleted ? 'পাঠ সম্পন্ন হয়েছে' : 'পাঠ সম্পন্ন করো'}
                </button>

              </div>

            </div>

          </section>

          {/* Detailed Explanation */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">
                    বিস্তারিত আলোচনা
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    প্রতিটি বিষয় মনোযোগ দিয়ে পড়ো
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                {activeTopic.explanation.length}টি বিষয়
              </span>

            </div>

            <div className="space-y-4">

              {activeTopic.explanation.map((paragraph, index) => (

                <article
                  key={`${activeTopic.id}-${index}`}
                  className="group flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/30 sm:p-5"
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-emerald-700 shadow-sm ring-1 ring-slate-200">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    <MathText text={paragraph} />
                  </div>

                </article>

              ))}

            </div>

          </section>

          {/* Key Points */}

          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">

            <div className="border-b border-amber-100 bg-amber-50/70 p-5">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2.5">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-base font-black text-amber-950">
                    পরীক্ষার জন্য গুরুত্বপূর্ণ তথ্য
                  </h3>
                  <p className="mt-0.5 text-xs text-amber-800/70">
                    Quick Revision & SSC Preparation
                  </p>
                </div>
              </div>

            </div>

            <div className="space-y-3 p-5 sm:p-6">

              {activeTopic.keyPoints.map((point, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-amber-50/60"
                >

                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div className="text-sm leading-7 text-slate-700">
                    <MathText text={point} />
                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* Chemical Equations */}

          {activeTopic.formulas && activeTopic.formulas.length > 0 && (

            <section className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-violet-50 p-2.5">
                  <FlaskConical className="h-5 w-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">
                    রাসায়নিক সমীকরণ ও সূত্র
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Important Chemical Equations
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                {activeTopic.formulas.map((formula, index) => (

                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-violet-100 bg-violet-50/30"
                  >

                    <div className="flex items-center justify-between gap-3 border-b border-violet-100 bg-white/70 px-4 py-3">

                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-xs font-black text-violet-700">
                          {index + 1}
                        </span>

                        <p className="text-xs font-black leading-relaxed text-slate-800 sm:text-sm">
                          {formula.label}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyFormula(formula.latex, index)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 transition hover:border-violet-200 hover:text-violet-700"
                        title="সূত্র কপি করো"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            কপি হয়েছে
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            কপি
                          </>
                        )}
                      </button>

                    </div>

                    <div className="overflow-x-auto px-4 py-5 text-center">
                      <FormulaBox
                        formula={formula.latex}
                        block
                      />
                    </div>

                    {formula.note && (
                      <div className="border-t border-violet-100 bg-white/60 px-4 py-3">
                        <p className="text-xs leading-6 text-slate-500">
                          <span className="font-bold text-violet-700">
                            নোট:
                          </span>{' '}
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

            <section className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">

              <div className="border-b border-sky-100 bg-sky-50/70 p-5">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-100 p-2.5">
                    <Calculator className="h-5 w-5 text-sky-700" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-sky-950">
                      উদাহরণ ও সমাধান
                    </h3>
                    <p className="mt-0.5 text-xs text-sky-800/70">
                      Step-by-step Solved Example
                    </p>
                  </div>
                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* Question */}

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-sky-100 px-2 py-1 text-[10px] font-black text-sky-700">
                      QUESTION
                    </span>

                    <h4 className="text-xs font-black text-slate-500">
                      প্রশ্ন
                    </h4>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </div>
                </div>

                {/* Given */}

                <div>
                  <h4 className="mb-3 text-xs font-black text-slate-600">
                    ০১. দেওয়া আছে
                  </h4>

                  <div className="space-y-2">
                    {activeTopic.example.given.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <MathText text={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula */}

                <div>
                  <h4 className="mb-3 text-xs font-black text-slate-600">
                    ০২. প্রয়োজনীয় সূত্র
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                    <FormulaBox
                      formula={activeTopic.example.formula}
                      block
                    />
                  </div>
                </div>

                {/* Solution */}

                <div>
                  <h4 className="mb-3 text-xs font-black text-slate-600">
                    ০৩. ধাপে ধাপে সমাধান
                  </h4>

                  <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">

                    <div className="whitespace-pre-line text-sm leading-8 text-slate-700">
                      <MathText text={activeTopic.example.solution} />
                    </div>

                  </div>
                </div>

                {/* Answer */}

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="text-sm font-black text-emerald-800">
                      চূড়ান্ত উত্তর
                    </h4>
                  </div>

                  <div className="text-sm font-bold leading-7 text-emerald-950">
                    <MathText text={activeTopic.example.answer} />
                  </div>

                </div>

              </div>

            </section>

          )}

          {/* Learning Reminder */}

          <section className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">

            <div className="rounded-xl bg-indigo-100 p-2">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h3 className="text-sm font-black text-indigo-950">
                পড়াশোনার পরামর্শ
              </h3>

              <p className="mt-1 text-xs leading-6 text-indigo-900/70">
                এই টপিকের গুরুত্বপূর্ণ সংজ্ঞা, রাসায়নিক সংকেত ও বিক্রিয়াগুলো নিজের খাতায় লিখে অনুশীলন করো। এরপর পরবর্তী টপিকে যাও।
              </p>
            </div>

          </section>

          {/* Previous / Next */}

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>পূর্ববর্তী</span>
            </button>

            <div className="min-w-0 text-center">
              <p className="text-xs font-black text-slate-800">
                {selectedIndex + 1} / {totalTopics}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                টপিক নেভিগেশন
              </p>
            </div>

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

        </main>

      </div>

      {/* ================================================= */}
      {/* FLOATING BACK TO TOP */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="উপরে যাও"
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-lg transition hover:-translate-y-1 hover:bg-emerald-50"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

    </div>
  );
}
