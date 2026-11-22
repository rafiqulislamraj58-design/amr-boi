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
import MathText from '@/components/common/MathText';
import FormulaBox from '@/components/common/FormulaBox';
import { ENVIRONMENT_OF_LIFE_TOPICS } from './EnvironmentOfLifeTopicsData';

export default function EnvironmentOfLifeChapterView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeTopic = ENVIRONMENT_OF_LIFE_TOPICS[selectedIndex];

  const handleSelectTopic = (index: number) => {
    setSelectedIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) handleSelectTopic(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < ENVIRONMENT_OF_LIFE_TOPICS.length - 1) {
      handleSelectTopic(selectedIndex + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Topic List */}
      <aside className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              অধ্যায়ের টপিকসমূহ ({ENVIRONMENT_OF_LIFE_TOPICS.length}টি)
            </h2>
          </div>

          <div className="space-y-1.5">
            {ENVIRONMENT_OF_LIFE_TOPICS.map((topic, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(index)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-2xs'
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-teal-600 text-white'
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-3">
            <span>টপিক {activeTopic.number}</span>
            <span>•</span>
            <span>{activeTopic.titleEn}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {activeTopic.title}
          </h2>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">মূল কথা: </strong>
            <MathText text={activeTopic.summary} />
          </div>
        </section>

        {/* Detailed Explanation */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">বিস্তারিত ব্যাখ্যা</h3>
          </div>

          <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            {activeTopic.explanation.map((paragraph, i) => (
              <p key={i}>
                <MathText text={paragraph} />
              </p>
            ))}
          </div>
        </section>

        {/* Key Points */}
        <section className="bg-teal-50/60 rounded-2xl border border-teal-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-teal-950">
              মনে রাখার মতো গুরুত্বপূর্ণ তথ্য
            </h3>
          </div>

          <ul className="space-y-2.5">
            {activeTopic.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <MathText text={point} />
              </li>
            ))}
          </ul>
        </section>

        {/* Formulas / Equations */}
        {activeTopic.formulas && activeTopic.formulas.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">প্রয়োজনীয় সূত্র ও তথ্য</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeTopic.formulas.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-2 overflow-x-auto"
                >
                  <p className="text-xs font-bold text-teal-700">{f.label}</p>
                  <div className="py-1">
                    <FormulaBox formula={f.latex} block />
                  </div>
                  {f.note && (
                    <p className="text-xs text-slate-500 pt-1">
                      <MathText text={f.note} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Prev / Next Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী টপিক</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            {selectedIndex + 1} / {ENVIRONMENT_OF_LIFE_TOPICS.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={selectedIndex === ENVIRONMENT_OF_LIFE_TOPICS.length - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>পরবর্তী টপিক</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}