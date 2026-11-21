
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
  GraduationCap,
  FlaskConical,
  Lightbulb,
  Atom,
  ListChecks,
  ArrowRight,
  Beaker,
  Zap,
  Menu,
  X,
} from 'lucide-react';

import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { CHEMISTRY_AND_ENERGY_TOPICS } from './ChemistryAndEnergyTopicsData';

export default function ChemistryAndEnergyChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMobileTopics, setShowMobileTopics] = useState(false);

  const topics = CHEMISTRY_AND_ENERGY_TOPICS;
  const totalTopics = topics.length;

  const activeTopic = topics[selectedIndex];

  const progress = useMemo(() => {
    if (!totalTopics) return 0;
    return ((selectedIndex + 1) / totalTopics) * 100;
  }, [selectedIndex, totalTopics]);

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
    handleSelectTopic(selectedIndex - 1);
  };

  const handleNext = () => {
    handleSelectTopic(selectedIndex + 1);
  };

  if (!activeTopic) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <FlaskConical className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-900">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Chemistry and Energy অধ্যায়ের ডেটা এখনো যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================================================== */}
      {/* CHAPTER HERO */}
      {/* ================================================== */}

      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-6 text-white shadow-lg sm:p-8">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100">
              <GraduationCap className="h-4 w-4" />
              Class 9–10 Chemistry
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              অধ্যায় ০৮
            </span>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-emerald-300">
                <Atom className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Chemistry Learning
                </span>
              </div>

              <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                রাসায়নিক শক্তি ও
                <span className="text-emerald-300"> এর ব্যবহার</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100/80 sm:text-base">
                রাসায়নিক শক্তি, তড়িৎ বিশ্লেষণ, গ্যালভানিক কোষ এবং নিউক্লীয়
                শক্তির গুরুত্বপূর্ণ ধারণাগুলো সহজভাবে শিখে নাও।
              </p>
            </div>

            <div className="flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm md:self-center">
              <FlaskConical className="h-14 w-14 text-emerald-300" />
            </div>
          </div>

          {/* Chapter Stats */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="flex items-center gap-2 text-emerald-200">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">মোট টপিক</span>
              </div>
              <p className="mt-2 text-2xl font-black">{totalTopics}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">বর্তমান টপিক</span>
              </div>
              <p className="mt-2 text-2xl font-black">
                {selectedIndex + 1}
                <span className="ml-1 text-sm font-medium text-emerald-200">
                  / {totalTopics}
                </span>
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-3 sm:col-span-1">
              <div className="flex items-center gap-2 text-emerald-200">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">অগ্রগতি</span>
              </div>
              <p className="mt-2 text-2xl font-black">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-100">
                অধ্যায় নেভিগেশন
              </span>
              <span className="text-emerald-200">
                {selectedIndex + 1} of {totalTopics}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-200 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* MOBILE TOPIC TOGGLE */}
      {/* ================================================== */}

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileTopics(!showMobileTopics)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="text-xs font-medium text-slate-500">
                বর্তমান টপিক
              </p>
              <p className="text-sm font-bold text-slate-900">
                {activeTopic.number} — {activeTopic.title}
              </p>
            </div>
          </div>

          {showMobileTopics ? (
            <X className="h-5 w-5 text-slate-500" />
          ) : (
            <Menu className="h-5 w-5 text-slate-500" />
          )}
        </button>
      </div>

      {/* ================================================== */}
      {/* MAIN LAYOUT */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================================================== */}
        {/* SIDEBAR */}
        {/* ================================================== */}

        <aside
          className={`space-y-4 lg:col-span-4 ${
            showMobileTopics ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ListChecks className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    অধ্যায়ের টপিকসমূহ
                  </h2>
                  <p className="text-xs text-slate-500">
                    {totalTopics}টি লার্নিং সেকশন
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-slate-50 p-3">
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  বর্তমান অগ্রগতি
                </span>
                <span className="font-bold text-emerald-700">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {topics.map((topic, index) => {
                const isActive = index === selectedIndex;
                const isPrevious = index < selectedIndex;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group relative w-full overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                        : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-emerald-600" />
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : isPrevious
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {isPrevious ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          topic.number
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-bold leading-relaxed ${
                            isActive ? 'text-emerald-900' : 'text-slate-800'
                          }`}
                        >
                          {topic.title}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {topic.titleEn}
                        </p>

                        {isActive && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            এখন পড়ছো
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        className={`mt-1 h-4 w-4 shrink-0 transition-transform ${
                          isActive
                            ? 'translate-x-0.5 text-emerald-600'
                            : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Study Tip */}
            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-3.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-bold text-amber-900">
                  পড়ার পরামর্শ
                </p>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-amber-800">
                প্রতিটি টপিকের ব্যাখ্যা পড়ার পর সূত্র ও উদাহরণগুলো নিজে
                সমাধান করার চেষ্টা করো।
              </p>
            </div>
          </div>
        </aside>

        {/* ================================================== */}
        {/* MAIN CONTENT */}
        {/* ================================================== */}

        <main className="min-w-0 space-y-5 lg:col-span-8">
          {/* TOPIC HEADER */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

            <div className="p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <FlaskConical className="h-3.5 w-3.5" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {activeTopic.titleEn}
                </span>
              </div>

              <h2 className="text-xl font-black leading-relaxed text-slate-900 sm:text-2xl">
                {activeTopic.title}
              </h2>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <h3 className="text-sm font-extrabold text-emerald-900">
                    মূল ধারণা
                  </h3>
                </div>

                <div className="text-sm leading-8 text-slate-700">
                  <MathText text={activeTopic.summary} />
                </div>
              </div>
            </div>
          </section>

          {/* DETAILED EXPLANATION */}
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
                  className="group flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-colors hover:border-emerald-100 hover:bg-emerald-50/30 sm:p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-emerald-700 shadow-sm ring-1 ring-slate-200 group-hover:ring-emerald-200">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 text-sm leading-8 text-slate-700">
                    <MathText text={paragraph} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KEY POINTS */}
          <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-emerald-950">
                  মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
                </h3>
                <p className="text-xs text-emerald-800/70">
                  পরীক্ষার প্রস্তুতির জন্য
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {activeTopic.keyPoints.map((point, index) => (
                <div
                  key={`${activeTopic.id}-key-${index}`}
                  className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-white/80 p-3"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                  <div className="text-sm leading-7 text-slate-700">
                    <MathText text={point} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FORMULAS AND EQUATIONS */}
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
                  <p className="text-xs text-slate-500">
                    গুরুত্বপূর্ণ Formula & Chemical Equations
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={`${activeTopic.id}-formula-${index}`}
                    className="overflow-hidden rounded-xl border border-violet-100 bg-violet-50/30"
                  >
                    <div className="flex items-center gap-2 border-b border-violet-100 bg-violet-50/70 px-4 py-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-[11px] font-extrabold text-violet-700">
                        {index + 1}
                      </span>

                      <h4 className="text-sm font-bold text-violet-950">
                        {formula.label}
                      </h4>
                    </div>

                    <div className="overflow-x-auto px-4 py-5">
                      <div className="min-w-max">
                        <FormulaBox formula={formula.latex} />
                      </div>
                    </div>

                    {formula.note && (
                      <div className="border-t border-violet-100 bg-white/70 px-4 py-3">
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

          {/* SOLVED EXAMPLE */}
          {activeTopic.example && (
            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Calculator className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-amber-950">
                      গাণিতিক উদাহরণ
                    </h3>
                    <p className="text-xs text-amber-800">
                      প্রশ্ন ও সমাধানসহ
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {/* Question */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                      Q
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      প্রশ্ন
                    </h4>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm leading-8 text-slate-700">
                    <MathText text={activeTopic.example.question} />
                  </div>
                </div>

                {/* Given */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      ১
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      প্রদত্ত তথ্য
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeTopic.example.given.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold leading-6 text-slate-700"
                      >
                        <MathText text={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                      ২
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      প্রয়োজনীয় সূত্র
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                    <div className="min-w-max">
                      <FormulaBox formula={activeTopic.example.formula} />
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                      ৩
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      ধাপে ধাপে সমাধান
                    </h4>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="whitespace-pre-line text-sm leading-8 text-slate-700">
                      <MathText text={activeTopic.example.solution} />
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="text-sm font-extrabold text-emerald-900">
                      চূড়ান্ত উত্তর
                    </h4>
                  </div>

                  <div className="text-sm font-bold leading-8 text-emerald-800">
                    <MathText text={activeTopic.example.answer} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STUDY REMINDER */}
          <section className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Lightbulb className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-sky-950">
                নিজের জ্ঞান যাচাই করো
              </h4>
              <p className="mt-1 text-xs leading-6 text-sky-800">
                এই টপিকের গুরুত্বপূর্ণ তথ্যগুলো না দেখে মনে করার চেষ্টা করো।
                সূত্র ও রাসায়নিক সমীকরণ নিজে লিখে অনুশীলন করলে বিষয়টি আরও
                ভালোভাবে বুঝতে পারবে।
              </p>
            </div>
          </section>

          {/* ================================================== */}
          {/* PREVIOUS / NEXT NAVIGATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  অধ্যায়ের নেভিগেশন
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {selectedIndex + 1} / {totalTopics} টপিক
                </p>
              </div>

              <div className="flex items-center gap-1">
                {topics.map((topic, index) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(index)}
                    aria-label={`টপিক ${topic.number}`}
                    aria-current={index === selectedIndex ? 'step' : undefined}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedIndex
                        ? 'w-7 bg-emerald-600'
                        : index < selectedIndex
                          ? 'w-2 bg-emerald-300'
                          : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                পূর্ববর্তী টপিক
              </button>

              {selectedIndex < totalTopics - 1 && (
                <div className="hidden min-w-0 flex-1 px-3 sm:block">
                  <p className="text-center text-[11px] font-medium text-slate-400">
                    পরবর্তী টপিক
                  </p>
                  <p className="mt-1 truncate text-center text-xs font-bold text-slate-600">
                    {topics[selectedIndex + 1]?.title}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                পরবর্তী টপিক
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
