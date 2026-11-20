"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
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
  Zap,
  Lightbulb,
  Hash,
} from "lucide-react";

import MathText from "@/components/common/MathText";
import FormulaBox from "@/components/common/FormulaBox";
import { CURRENT_ELECTRICITY_TOPICS } from "./CurrentElectricityTopicsData";

export default function CurrentElectricityChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileTopics, setShowMobileTopics] = useState(false);

  const totalTopics = CURRENT_ELECTRICITY_TOPICS.length;
  const activeTopic = CURRENT_ELECTRICITY_TOPICS[selectedIndex];

  const progress = totalTopics ? ((selectedIndex + 1) / totalTopics) * 100 : 0;

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return CURRENT_ELECTRICITY_TOPICS;

    return CURRENT_ELECTRICITY_TOPICS.filter((topic) =>
      `${topic.title} ${topic.titleEn} ${topic.number}`
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery]);

  const handleSelectTopic = (index: number) => {
    if (index < 0 || index >= totalTopics) return;

    setSelectedIndex(index);
    setShowMobileTopics(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800">
          কোনো টপিক পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Current Electricity অধ্যায়ের ডেটা যুক্ত করো।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Chapter Overview */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 sm:p-7 text-white shadow-sm">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <Zap className="h-3.5 w-3.5" />
              Physics Chapter
            </span>

            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-blue-50">
              বিদ্যুৎ ও চৌম্বকত্ব
            </span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                চল তড়িৎ
              </h1>
              <p className="mt-1 text-sm text-blue-100">Current Electricity</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-50">
                চল তড়িৎ অধ্যায়ের গুরুত্বপূর্ণ ধারণা, সূত্র, ব্যাখ্যা এবং
                গাণিতিক সমস্যাগুলো ধাপে ধাপে শিখে নাও।
              </p>
            </div>

            <div className="flex gap-3">
              <div className="min-w-[90px] rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur">
                <BookOpen className="mx-auto mb-1 h-5 w-5" />
                <p className="text-xl font-extrabold">{totalTopics}</p>
                <p className="text-[11px] text-blue-100">মোট টপিক</p>
              </div>

              <div className="min-w-[90px] rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur">
                <GraduationCap className="mx-auto mb-1 h-5 w-5" />
                <p className="text-xl font-extrabold">{selectedIndex + 1}</p>
                <p className="text-[11px] text-blue-100">বর্তমান টপিক</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-100">
                অধ্যায়ের অগ্রগতি
              </span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Topic navigation progress"
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Topic Selector */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileTopics(!showMobileTopics)}
          aria-expanded={showMobileTopics}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-500">বর্তমান টপিক</p>
              <p className="truncate text-sm font-bold text-slate-800">
                {activeTopic.title}
              </p>
            </div>
          </div>

          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
              showMobileTopics ? "rotate-180" : ""
            }`}
          />
        </button>

        {showMobileTopics && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <TopicSearch value={searchQuery} onChange={setSearchQuery} />

            <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
              {filteredTopics.map((topic) => {
                const index = CURRENT_ELECTRICITY_TOPICS.findIndex(
                  (item) => item.id === topic.id,
                );

                const isActive = index === selectedIndex;

                return (
                  <TopicButton
                    key={topic.id}
                    topic={topic}
                    active={isActive}
                    onClick={() => handleSelectTopic(index)}
                  />
                );
              })}

              {filteredTopics.length === 0 && <EmptySearch />}
            </div>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div
        className={`grid grid-cols-1 gap-5 ${
          showSidebar ? "lg:grid-cols-12" : "lg:grid-cols-1"
        }`}
      >
        {/* Desktop Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      অধ্যায়ের টপিকসমূহ
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {totalTopics} টি টপিক
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSidebar(false)}
                  title="Sidebar বন্ধ করুন"
                  aria-label="Collapse sidebar"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>

              <TopicSearch value={searchQuery} onChange={setSearchQuery} />

              <div className="mt-4 max-h-[65vh] space-y-1.5 overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const index = CURRENT_ELECTRICITY_TOPICS.findIndex(
                    (item) => item.id === topic.id,
                  );

                  return (
                    <TopicButton
                      key={topic.id}
                      topic={topic}
                      active={index === selectedIndex}
                      onClick={() => handleSelectTopic(index)}
                    />
                  );
                })}

                {filteredTopics.length === 0 && <EmptySearch />}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main
          className={
            showSidebar
              ? "lg:col-span-8 min-w-0 space-y-5"
              : "min-w-0 space-y-5"
          }
        >
          {!showSidebar && (
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <PanelLeftOpen className="h-4 w-4" />
              টপিক তালিকা দেখুন
            </button>
          )}

          {/* Topic Header */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  <Hash className="h-3 w-3" />
                  টপিক {activeTopic.number}
                </span>

                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {activeTopic.titleEn}
                </span>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {selectedIndex + 1} / {totalTopics}
              </span>
            </div>

            <h2 className="mt-5 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
              {activeTopic.title}
            </h2>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800">
                <Lightbulb className="h-4 w-4" />
                মূল ধারণা
              </div>

              <div className="text-sm leading-7 text-slate-700">
                <MathText text={activeTopic.summary} />
              </div>
            </div>
          </section>

          {/* Explanation */}
          <ContentSection
            icon={<FileText className="h-5 w-5" />}
            title="বিস্তারিত ব্যাখ্যা"
            subtitle="Concept Explanation"
          >
            <div className="space-y-4">
              {activeTopic.explanation.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-600">
                    {index + 1}
                  </span>

                  <p className="min-w-0 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    <MathText text={paragraph} />
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Key Points */}
          {activeTopic.keyPoints?.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950 sm:text-base">
                    গুরুত্বপূর্ণ তথ্য
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Key Points to Remember
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                {activeTopic.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-emerald-50/60"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div className="text-sm leading-7 text-slate-700">
                      <MathText text={point} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formulas */}
          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <ContentSection
              icon={<Calculator className="h-5 w-5" />}
              title="প্রয়োজনীয় সূত্রসমূহ"
              subtitle="Important Mathematical Formulas"
            >
              <div className="grid grid-cols-1 gap-4">
                {activeTopic.formulas.map((formula, index) => (
                  <div
                    key={index}
                    className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 sm:p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-extrabold text-blue-700">
                        {index + 1}
                      </span>

                      <h4 className="text-sm font-bold text-blue-800">
                        {formula.label}
                      </h4>
                    </div>

                    <div className="overflow-x-auto rounded-lg bg-white p-3">
                      <FormulaBox formula={formula.latex} />
                    </div>

                    {formula.note && (
                      <p className="mt-3 border-t border-blue-100 pt-3 text-xs leading-6 text-slate-600">
                        <MathText text={formula.note} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {/* Solved Example */}
          {activeTopic.example && (
            <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-amber-100 bg-amber-50/70 p-4 sm:p-5">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-amber-950 sm:text-base">
                    গাণিতিক উদাহরণ
                  </h3>
                  <p className="text-xs text-amber-700">
                    Solved Mathematical Example
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-5">
                {/* Question */}
                <div>
                  <span className="mb-2 inline-block rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    প্রশ্ন
                  </span>

                  <p className="text-sm font-semibold leading-7 text-slate-800">
                    <MathText text={activeTopic.example.question} />
                  </p>
                </div>

                {/* Given */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 text-xs font-extrabold text-slate-600">
                    দেওয়া আছে (Given)
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {activeTopic.example.given.map((item, index) => (
                      <span
                        key={index}
                        className="max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <MathText text={item} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formula */}
                <div>
                  <h4 className="mb-2 text-xs font-extrabold text-blue-700">
                    সূত্র (Formula)
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <FormulaBox formula={activeTopic.example.formula} />
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="mb-2 text-xs font-extrabold text-slate-700">
                    সমাধান (Solution)
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="whitespace-pre-line text-sm leading-8 text-slate-800">
                      <MathText text={activeTopic.example.solution} />
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <h4 className="text-sm font-extrabold">
                      চূড়ান্ত উত্তর (Final Answer)
                    </h4>
                  </div>

                  <div className="mt-2 pl-7 text-sm font-bold leading-7 text-emerald-800">
                    <MathText text={activeTopic.example.answer} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Navigation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  টপিক নেভিগেশন
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  অধ্যায়ের পরবর্তী বা পূর্ববর্তী টপিকে যাও
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {selectedIndex + 1}/{totalTopics}
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
                className="inline-flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>পূর্ববর্তী</span>
              </button>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                {Math.round(progress)}% সম্পন্ন
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={selectedIndex === totalTopics - 1}
                className="inline-flex min-w-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
              >
                <span>পরবর্তী টপিক</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------
   Reusable Topic Search
---------------------------------- */

function TopicSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="টপিক খুঁজুন..."
        aria-label="Search topics"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------
   Reusable Topic Button
---------------------------------- */

function TopicButton({
  topic,
  active,
  onClick,
}: {
  topic: (typeof CURRENT_ELECTRICITY_TOPICS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "step" : undefined}
      className={`group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-blue-200 bg-blue-50 shadow-sm"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      <span
        className={`mt-0.5 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg px-1 text-xs font-extrabold ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
        }`}
      >
        {topic.number}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold leading-snug ${
            active ? "text-blue-800" : "text-slate-700"
          }`}
        >
          {topic.title}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {topic.titleEn}
        </p>
      </div>

      {active && (
        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
      )}
    </button>
  );
}

/* ---------------------------------
   Reusable Content Section
---------------------------------- */

function ContentSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ---------------------------------
   Empty Search State
---------------------------------- */

function EmptySearch() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
      <Search className="mx-auto mb-2 h-7 w-7 text-slate-300" />

      <p className="text-sm font-bold text-slate-600">
        কোনো টপিক পাওয়া যায়নি
      </p>

      <p className="mt-1 text-xs text-slate-400">
        অন্য কোনো নামে সার্চ করে দেখুন।
      </p>
    </div>
  );
}
