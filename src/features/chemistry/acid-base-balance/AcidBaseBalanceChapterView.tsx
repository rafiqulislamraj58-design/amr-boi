
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
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { ACID_BASE_BALANCE_TOPICS } from './AcidBaseBalanceTopicsData';

export default function AcidBaseBalanceChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeTopic = ACID_BASE_BALANCE_TOPICS[selectedIndex];

  const totalTopics = ACID_BASE_BALANCE_TOPICS.length;

  const progress = ((selectedIndex + 1) / totalTopics) * 100;

  // Search Topics
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return ACID_BASE_BALANCE_TOPICS;

    return ACID_BASE_BALANCE_TOPICS.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.titleEn.toLowerCase().includes(query) ||
        topic.number.includes(query) ||
        topic.summary.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Topic Selection
  const handleSelectTopic = (index: number) => {
    setSelectedIndex(index);
    setIsSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Previous Topic
  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleSelectTopic(selectedIndex - 1);
    }
  };

  // Next Topic
  const handleNext = () => {
    if (selectedIndex < totalTopics - 1) {
      handleSelectTopic(selectedIndex + 1);
    }
  };

  // Back to Top
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!activeTopic) return null;

  return (
    <div className="w-full space-y-5">

      {/* ================================================== */}
      {/* CHAPTER HEADER */}
      {/* ================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">

        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl pointer-events-none" />

        <div className="relative p-5 sm:p-7">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FlaskConical className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Chemistry • Chapter 09
                </p>

                <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">
                  এসিড-ক্ষারক সমতা
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Acid-Base Balance | নবম-দশম শ্রেণি
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 self-start sm:self-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">

              <BookMarked className="h-4 w-4 text-emerald-700" />

              <span className="text-xs font-bold text-emerald-800">
                {totalTopics} টি টপিক
              </span>

            </div>

          </div>

          {/* Progress */}

          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between gap-3">

              <span className="text-xs font-semibold text-slate-600">
                অধ্যায় পড়ার অগ্রগতি
              </span>

              <span className="text-xs font-bold tabular-nums text-emerald-700">
                {selectedIndex + 1} / {totalTopics} টপিক
              </span>

            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Chapter navigation progress"
            >
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* MAIN LAYOUT */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">

        {/* ================================================== */}
        {/* LEFT SIDEBAR */}
        {/* ================================================== */}

        <aside className="lg:col-span-4">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-5">

            {/* Sidebar Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    অধ্যায়ের বিষয়বস্তু
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    {totalTopics} টি পাঠ উপলব্ধ
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 lg:hidden"
                aria-label="Toggle topic list"
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

              {/* Search */}

              <div className="border-b border-slate-100 p-3">

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="টপিক খুঁজুন..."
                    aria-label="Search chapter topics"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
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

                <p className="mt-2 px-1 text-[11px] text-slate-400">
                  {filteredTopics.length} টি টপিক পাওয়া গেছে
                </p>

              </div>

              {/* Topic List */}

              <div className="max-h-[550px] space-y-1 overflow-y-auto p-2">

                {filteredTopics.length > 0 ? (

                  filteredTopics.map((topic) => {

                    const index = ACID_BASE_BALANCE_TOPICS.findIndex(
                      (item) => item.id === topic.id
                    );

                    const isActive = index === selectedIndex;

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(index)}
                        aria-current={isActive ? 'step' : undefined}
                        className={`group relative w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                          isActive
                            ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                            : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          {/* Topic Number */}

                          <div
                            className={`flex h-9 min-w-10 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold transition ${
                              isActive
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {topic.number}
                          </div>

                          {/* Topic Information */}

                          <div className="min-w-0 flex-1">

                            <p
                              className={`text-sm font-bold leading-relaxed ${
                                isActive
                                  ? 'text-emerald-900'
                                  : 'text-slate-800'
                              }`}
                            >
                              {topic.title}
                            </p>

                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                              {topic.titleEn}
                            </p>

                          </div>

                          {/* Active Indicator */}

                          {isActive && (
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                          )}

                        </div>

                      </button>
                    );
                  })

                ) : (

                  <div className="flex flex-col items-center justify-center px-4 py-10 text-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-bold text-slate-700">
                      কোনো টপিক পাওয়া যায়নি
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন।
                    </p>

                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      সার্চ মুছে ফেলুন
                    </button>

                  </div>

                )}

              </div>

              {/* Sidebar Footer */}

              <div className="border-t border-slate-100 bg-slate-50/70 p-3">

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <GraduationCap className="h-4 w-4 text-emerald-600" />

                  <span>
                    NCTB Chemistry • Class 9-10
                  </span>

                </div>

              </div>

            </div>

          </div>

        </aside>

        {/* ================================================== */}
        {/* RIGHT CONTENT AREA */}
        {/* ================================================== */}

        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* ================================================== */}
          {/* TOPIC HEADER */}
          {/* ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5 sm:p-6">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />

                  <span className="text-xs font-bold text-emerald-800">
                    টপিক {activeTopic.number}
                  </span>

                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {selectedIndex + 1} of {totalTopics}
                </span>

              </div>

              <h2 className="text-xl font-extrabold leading-relaxed text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
                {activeTopic.titleEn}
              </p>

            </div>

            {/* Summary */}

            <div className="p-5 sm:p-6">

              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">

                  <h3 className="mb-2 text-sm font-extrabold text-emerald-950">
                    মূল ধারণা
                  </h3>

                  <div className="text-sm leading-7 text-slate-700">
                    <MathText text={activeTopic.summary} />
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ================================================== */}
          {/* DETAILED EXPLANATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  বিষয়টি সহজভাবে বুঝে নাও
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {activeTopic.explanation.map((paragraph, i) => (

                <div
                  key={`${activeTopic.id}-explanation-${i}`}
                  className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition hover:border-emerald-100 hover:bg-emerald-50/20 sm:p-4"
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-600 transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 flex-1 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    <MathText text={paragraph} />
                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* ================================================== */}
          {/* KEY POINTS */}
          {/* ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-amber-100 bg-amber-50/70 p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <ListChecks className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  গুরুত্বপূর্ণ তথ্য
                </h3>

                <p className="mt-0.5 text-xs text-amber-800/70">
                  পরীক্ষার আগে অবশ্যই মনে রাখবে
                </p>
              </div>

              <span className="ml-auto rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                {activeTopic.keyPoints.length} Points
              </span>

            </div>

            <div className="space-y-2 p-4 sm:p-5">

              {activeTopic.keyPoints.map((point, i) => (

                <div
                  key={`${activeTopic.id}-point-${i}`}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-amber-50/60"
                >

                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                  <div className="text-sm leading-7 text-slate-700">
                    <MathText text={point} />
                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* ================================================== */}
          {/* FORMULAS & CHEMICAL EQUATIONS */}
          {/* ================================================== */}

          {activeTopic.formulas && activeTopic.formulas.length > 0 && (

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    প্রয়োজনীয় সূত্র ও সমীকরণ
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    গুরুত্বপূর্ণ রাসায়নিক বিক্রিয়া ও সূত্র
                  </p>
                </div>

                <span className="ml-auto rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                  {activeTopic.formulas.length} টি
                </span>

              </div>

              <div className="space-y-3">

                {activeTopic.formulas.map((formula, i) => (

                  <div
                    key={`${activeTopic.id}-formula-${i}`}
                    className="overflow-hidden rounded-xl border border-slate-200 transition hover:border-violet-200"
                  >

                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">

                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-[11px] font-extrabold text-violet-700">
                        {i + 1}
                      </span>

                      <p className="text-xs font-bold leading-relaxed text-slate-700 sm:text-sm">
                        {formula.label}
                      </p>

                    </div>

                    <div className="overflow-x-auto px-3 py-5 sm:px-5">

                      <div className="flex min-h-10 items-center justify-center">
                        <FormulaBox formula={formula.latex} />
                      </div>

                    </div>

                    {formula.note && (

                      <div className="border-t border-slate-100 bg-violet-50/40 px-4 py-3">

                        <p className="text-xs leading-6 text-slate-600">
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

          {/* ================================================== */}
          {/* SOLVED EXAMPLE */}
          {/* ================================================== */}

          {activeTopic.example && (

            <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">

              {/* Example Header */}

              <div className="flex items-center gap-3 border-b border-orange-100 bg-orange-50/70 p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-orange-950">
                    গাণিতিক উদাহরণ
                  </h3>

                  <p className="mt-0.5 text-xs text-orange-800/70">
                    ধাপে ধাপে সমাধানসহ
                  </p>
                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* Question */}

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-xs font-extrabold text-orange-700">
                      Q
                    </span>

                    <h4 className="text-sm font-extrabold text-slate-800">
                      প্রশ্ন
                    </h4>

                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    <MathText text={activeTopic.example.question} />
                  </div>

                </div>

                {/* Given */}

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <FileText className="h-4 w-4" />
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-800">
                      দেওয়া আছে
                    </h4>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {activeTopic.example.given.map((item, i) => (

                      <div
                        key={i}
                        className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold leading-relaxed text-blue-800"
                      >
                        <MathText text={item} />
                      </div>

                    ))}

                  </div>

                </div>

                {/* Formula */}

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <Calculator className="h-4 w-4" />
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-800">
                      প্রয়োজনীয় সূত্র
                    </h4>

                  </div>

                  <div className="overflow-x-auto rounded-xl border border-violet-100 bg-violet-50/40 p-4">

                    <FormulaBox formula={activeTopic.example.formula} />

                  </div>

                </div>

                {/* Solution */}

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <BookOpen className="h-4 w-4" />
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-800">
                      সমাধান
                    </h4>

                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">

                    <div className="whitespace-pre-line text-sm leading-8 text-slate-700">
                      <MathText text={activeTopic.example.solution} />
                    </div>

                  </div>

                </div>

                {/* Answer */}

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />

                    <h4 className="text-sm font-extrabold text-emerald-800">
                      চূড়ান্ত উত্তর
                    </h4>

                  </div>

                  <div className="mt-2 pl-7 text-sm font-bold leading-7 text-emerald-900">
                    <MathText text={activeTopic.example.answer} />
                  </div>

                </div>

              </div>

            </section>

          )}

          {/* ================================================== */}
          {/* NAVIGATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <BookOpen className="h-4 w-4 text-emerald-600" />

                <span className="text-xs font-bold text-slate-700">
                  অধ্যায় নেভিগেশন
                </span>

              </div>

              <span className="text-xs font-bold tabular-nums text-slate-500">
                {selectedIndex + 1} / {totalTopics}
              </span>

            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />

            </div>

            <div className="flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >

                <ChevronLeft className="h-4 w-4" />

                <span>পূর্ববর্তী</span>

              </button>

              <button
                type="button"
                onClick={handleBackToTop}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="Back to top"
                title="উপরে যান"
              >
                <ArrowUp className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >

                <span>পরবর্তী টপিক</span>

                <ChevronRight className="h-4 w-4" />

              </button>

            </div>

            {/* Completion Message */}

            {selectedIndex === totalTopics - 1 && (

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">

                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-xs font-semibold leading-relaxed text-emerald-800">
                  তুমি এই অধ্যায়ের শেষ টপিকে পৌঁছে গেছ। অধ্যায়ের বিষয়গুলো আবার রিভিশন করে নাও।
                </p>

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
}
