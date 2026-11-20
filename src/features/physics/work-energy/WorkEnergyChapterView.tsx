'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Sparkles,
  FileText,
} from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';
import { WORK_ENERGY_TOPICS } from './WorkEnergyTopicsData';

export default function WorkEnergyChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeTopic = WORK_ENERGY_TOPICS[selectedIndex];

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (selectedIndex < WORK_ENERGY_TOPICS.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Topic List */}
      <aside className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              অধ্যায়ের টপিকসমূহ ({WORK_ENERGY_TOPICS.length}টি)
            </h2>
          </div>

          <div className="space-y-1.5">
            {WORK_ENERGY_TOPICS.map((topic, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-2xs'
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {topic.number}
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-snug">
                        {topic.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {topic.titleEn}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Right Main Area: Active Topic Content */}
      <main className="lg:col-span-8 space-y-5">
        {/* Header & Summary */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <span>টপিক {activeTopic.number}</span>
            <span>•</span>
            <span>{activeTopic.titleEn}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {activeTopic.title}
          </h2>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">মূল কথা: </strong>
            {activeTopic.summary}
          </div>
        </section>

        {/* Detailed Explanation */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">বিস্তারিত ব্যাখ্যা</h3>
          </div>

          <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            {activeTopic.explanation.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Key Points */}
        <section className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-emerald-950">
              মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
            </h3>
          </div>

          <ul className="space-y-2.5">
            {activeTopic.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Formulas */}
        {activeTopic.formulas && activeTopic.formulas.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">প্রয়োজনীয় সূত্র</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTopic.formulas.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2"
                >
                  <p className="text-xs font-bold text-blue-700">{f.label}</p>
                  <FormulaBox formula={f.latex} />
                  {f.note && (
                    <p className="text-xs text-slate-500 pt-1">{f.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Solved Example */}
        {activeTopic.example && (
          <section className="bg-amber-50/60 rounded-2xl border border-amber-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-amber-950">
              গাণিতিক উদাহরণ (সমাধানসহ)
            </h3>

            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              প্রশ্ন: {activeTopic.example.question}
            </p>

            <div className="bg-white rounded-xl border border-amber-100 p-4 space-y-3 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">দেওয়া আছে:</p>
                <div className="flex flex-wrap gap-2">
                  {activeTopic.example.given.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">সূত্র:</p>
                <FormulaBox formula={activeTopic.example.formula} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">সমাধান:</p>
                <p className="font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg">
                  {activeTopic.example.solution}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-emerald-700">
                  উত্তর: {activeTopic.example.answer}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Prev / Next Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী টপিক</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            {selectedIndex + 1} / {WORK_ENERGY_TOPICS.length}
          </span>

          <button
            onClick={handleNext}
            disabled={selectedIndex === WORK_ENERGY_TOPICS.length - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>পরবর্তী টপিক</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}