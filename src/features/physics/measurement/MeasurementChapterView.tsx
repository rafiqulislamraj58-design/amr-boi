'use client';

import React, { useState } from 'react';
import { MEASUREMENT_TOPICS } from './MeasurementTopicsData';
import VernierCaliperLab from '../VernierCaliperLab';
import FormulaBox from '@/components/common/FormulaBox';
import { BookOpen, ChevronRight, FlaskConical } from 'lucide-react';

export default function MeasurementChapterView() {
  const [activeTopicId, setActiveTopicId] = useState<string>(MEASUREMENT_TOPICS[0].id);

  const currentTopic =
    MEASUREMENT_TOPICS.find((t) => t.id === activeTopicId) || MEASUREMENT_TOPICS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Topics List */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
          অধ্যায়ের টপিকসমূহ (Topics)
        </h3>
        <div className="space-y-1.5">
          {MEASUREMENT_TOPICS.map((topic) => {
            const isActive = topic.id === activeTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{topic.title}</span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content Area: Detailed Lesson & Interactive Lab */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" /> পদার্থবিজ্ঞান • অধ্যায় ১ (ভৌত রাশি এবং পরিমাপ)
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentTopic.title}</h2>

          <p className="text-slate-600 font-medium mb-6 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            {currentTopic.summary}
          </p>

          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base mb-6">
            {currentTopic.content}
          </div>

          {currentTopic.formula && (
            <div className="p-4 rounded-xl bg-slate-900 text-white my-4 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-semibold">গুরুত্বপূর্ণ সূত্র:</span>
              <div className="text-lg font-sans">
                <FormulaBox formula={currentTopic.formula} />
              </div>
            </div>
          )}
        </div>

        {/* Interactive Vernier Caliper Lab */}
        {currentTopic.hasInteractiveLab && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                হাতে-কলমে স্লাইড ক্যালিপার্স সিমুলেশন ল্যাব (Interactive Lab)
              </h3>
            </div>
            <VernierCaliperLab />
          </div>
        )}
      </div>
    </div>
  );
}