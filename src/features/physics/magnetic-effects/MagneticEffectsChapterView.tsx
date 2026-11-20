
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
  Menu,
  Hash,
  ArrowUpRight,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { MAGNETIC_EFFECTS_TOPICS } from './MagneticEffectsTopicsData';

export default function MagneticEffectsChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const topics = MAGNETIC_EFFECTS_TOPICS;
  const activeTopic = topics[selectedIndex];

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return topics;

    return topics.filter((topic) =>
      `${topic.title} ${topic.titleEn} ${topic.number}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, topics]);

  const progress = topics.length
    ? ((selectedIndex + 1) / topics.length) * 100
    : 0;

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= topics.length) return;

    setSelectedIndex(index);
    setShowSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleSelectTopic(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < topics.length - 1) {
      handleSelectTopic(selectedIndex + 1);
    }
  };

  if (!topics.length || !activeTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <h2 className="text-lg font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          এই অধ্যায়ের কনটেন্ট শীঘ্রই যুক্ত করা হবে।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Chapter Progress */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                চৌম্বক ক্রিয়া
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                অধ্যায়ের পড়াশোনার অগ্রগতি
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">
                বর্তমান অগ্রগতি
              </p>
              <p className="text-sm font-bold text-blue-600">
                {selectedIndex + 1} / {topics.length} টপিক
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-blue-100 text-xs font-bold text-blue-700">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full rounded-r-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Mobile Topic Toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Menu className="h-4 w-4 text-blue-600" />
            অধ্যায়ের টপিকসমূহ
          </span>

          <span className="flex items-center gap-2 text-xs text-blue-600">
            {activeTopic.number}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                showSidebar ? 'rotate-90' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">

        {/* Sidebar */}
        <aside
          className={`space-y-3 lg:sticky lg:top-5 lg:col-span-4 lg:block ${
            showSidebar ? 'block' : 'hidden'
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    অধ্যায়ের টপিকসমূহ
                  </h3>
                </div>

                <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                  {topics.length}টি
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="টপিক খুঁজুন..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
            </div>

            <div className="max-h-[65vh] space-y-1 overflow-y-auto p-2">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const index = topics.findIndex(
                    (item) => item.id === topic.id
                  );

                  const isActive = index === selectedIndex;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(index)}
                      className={`group w-full rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? 'border-blue-200 bg-blue-50 shadow-sm'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        <span
                          className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg px-1.5 text-xs font-bold ${
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
                              isActive
                                ? 'text-blue-800'
                                : 'text-slate-700'
                            }`}
                          >
                            {topic.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {topic.titleEn}
                          </p>
                        </div>

                        {isActive && (
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <Search className="mx-auto mb-2 h-7 w-7 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">
                    কোনো টপিক পাওয়া যায়নি
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-bold text-blue-600"
                  >
                    সার্চ মুছে ফেলুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 space-y-5 lg:col-span-8">

          {/* Topic Header */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5 sm:p-6">

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  <Hash className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {activeTopic.titleEn}
                </span>
              </div>

              <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-extrabold text-blue-800">
                    মূল কথা
                  </span>
                </div>

                <div className="text-sm leading-7 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50/70 px-5 py-3 text-xs font-semibold text-slate-500 sm:px-6">
              <span>অধ্যায়ের পাঠ {selectedIndex + 1}</span>
              <span>{Math.round(progress)}% সম্পন্ন</span>
            </div>
          </section>

          {/* Explanation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  বিস্তারিত ব্যাখ্যা
                </h3>
                <p className="text-xs text-slate-500">
                  বিষয়টি সহজভাবে বুঝে নাও
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeTopic.explanation.map((paragraph, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-[15px]"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>

                  <p className="min-w-0 flex-1">
                    <MathText text={paragraph} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Points */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ListChecks className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-emerald-950">
                  গুরুত্বপূর্ণ তথ্য
                </h3>
                <p className="text-xs text-emerald-700">
                  পরীক্ষার আগে অবশ্যই মনে রাখবে
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {activeTopic.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white/80 p-3.5"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                  <div className="text-sm leading-7 text-slate-700">
                    <MathText text={point} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Formulas */}
          {activeTopic.formulas &&
            activeTopic.formulas.length > 0 && (
              <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5 flex items-center gap-3">
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

                <div className="space-y-4">
                  {activeTopic.formulas.map((formula, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40"
                    >
                      <div className="border-b border-blue-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                            {i + 1}
                          </span>

                          <p className="text-sm font-bold text-blue-900">
                            {formula.label}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto px-4 py-5">
                        <FormulaBox formula={formula.latex} />
                      </div>

                      {formula.note && (
                        <div className="border-t border-blue-100 bg-white/70 px-4 py-3">
                          <p className="text-xs leading-6 text-slate-600">
                            <span className="font-bold text-slate-800">
                              ব্যাখ্যা:
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
            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">

              <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-950">
                    গাণিতিক উদাহরণ
                  </h3>
                  <p className="text-xs text-amber-800">
                    ধাপে ধাপে সমাধান
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">

                {/* Question */}
                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-amber-800">
                    প্রশ্ন
                  </p>

                  <div className="rounded-xl border border-amber-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </div>
                </div>

                {/* Given */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-xs font-extrabold text-slate-500">
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
                <div className="rounded-xl border border-blue-100 bg-white p-4">
                  <p className="mb-3 text-xs font-extrabold text-blue-700">
                    ব্যবহৃত সূত্র
                  </p>

                  <div className="overflow-x-auto">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>
                </div>

                {/* Solution */}
                <div className="rounded-xl border border-indigo-100 bg-white p-4">
                  <p className="mb-3 text-xs font-extrabold text-indigo-700">
                    সমাধান
                  </p>

                  <div className="overflow-x-auto rounded-lg bg-slate-50 p-4 font-mono text-sm leading-8 text-slate-800">
                    <MathText text={activeTopic.example.solution} />
                  </div>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-xs font-extrabold text-emerald-700">
                      চূড়ান্ত উত্তর
                    </p>

                    <div className="mt-1 text-sm font-bold leading-7 text-emerald-900">
                      <MathText text={activeTopic.example.answer} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Navigation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  অধ্যায় নেভিগেশন
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedIndex + 1} / {topics.length} টপিক
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === topics.length - 1}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>পরবর্তী টপিক</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>

            {selectedIndex === topics.length - 1 && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                তুমি এই অধ্যায়ের শেষ টপিকে পৌঁছে গেছ!
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
