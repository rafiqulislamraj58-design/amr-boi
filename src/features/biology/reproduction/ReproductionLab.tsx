'use client';

import React, { useState } from 'react';
import {
  Activity,
  Flower2,
  Info,
  RotateCcw,
  Sparkles,
  Wind,
} from 'lucide-react';

interface FertilizationStep {
  id: string;
  step: number;
  titleBn: string;
  titleEn: string;
  ploidy: string;
  location: string;
  description: string;
  outcome: string;
}

const DOUBLE_FERTILIZATION_STEPS: FertilizationStep[] = [
  {
    id: 'pollen-germination',
    step: 1,
    titleBn: 'পরাগরেণুর অঙ্কুরোদগম',
    titleEn: 'Pollen Germination',
    ploidy: 'পরাগরেণু (n)',
    location: 'গর্ভমুণ্ড (Stigma)',
    description:
      'পরাগায়নের পর গর্ভমুণ্ডের রস শোষণ করে পরাগরেণু ফুলে ওঠে এবং অঙ্কুরিত হয়ে পরাগনালিকা (Pollen tube) তৈরি করে।',
    outcome: 'পরাগনালিকার ভেতরে দুটি পুং গ্যামেট (n + n) ও একটি নালিকা নিউক্লিয়াস থাকে।',
  },
  {
    id: 'tube-entry',
    step: 2,
    titleBn: 'ভ্রূণথলিতে পরাগনালিকার প্রবেশ',
    titleEn: 'Pollen Tube Entry',
    ploidy: '২টি পুং গ্যামেট (n, n)',
    location: 'গর্ভদণ্ড → ডিম্বকরন্ধ্র → ভ্রূণথলি',
    description:
      'পরাগনালিকা গর্ভদণ্ড ভেদ করে ডিম্বকের ডিম্বকরন্ধ্র দিয়ে ভ্রূণথলিতে প্রবেশ করে এবং ফেটে গিয়ে দুটি পুং গ্যামেট মুক্ত করে।',
    outcome: 'ভ্রূণথলির ভেতরে ডিম্বাণু (n) এবং গৌণ নিউক্লিয়াস (2n) নিষেকের জন্য প্রস্তুত থাকে।',
  },
  {
    id: 'syngamy',
    step: 3,
    titleBn: 'প্রথম নিষেক (সিনগ্যামি)',
    titleEn: 'First Fertilization (Syngamy)',
    ploidy: 'n + n → 2n (ডিপ্লয়েড)',
    location: 'ভ্রূণথলির ডিম্বাণু অঞ্চল',
    description:
      'প্রথম পুং গ্যামেট (n) ভ্রূণথলির ডিম্বাণু (n)-এর সাথে মিলিত হয়ে ডিপ্লয়েড জাইগোট (2n) গঠন করে।',
    outcome: 'জাইগোট বিভাজিত হয়ে ভবিষ্যতের ভ্রূণ (Embryo) ও নতুন উদ্ভিদ তৈরি করে।',
  },
  {
    id: 'triple-fusion',
    step: 4,
    titleBn: 'দ্বিতীয় নিষেক (ত্রিমিলন)',
    titleEn: 'Triple Fusion',
    ploidy: 'n + 2n → 3n (ট্রিপ্লয়েড)',
    location: 'ভ্রূণথলির কেন্দ্র (গৌণ নিউক্লিয়াস)',
    description:
      'দ্বিতীয় পুং গ্যামেট (n) ডিপ্লয়েড গৌণ নিউক্লিয়াস (2n)-এর সাথে মিলিত হয়ে ট্রিপ্লয়েড শস্যকোষ (Endosperm, 3n) সৃষ্টি করে।',
    outcome: 'নিষেকের পর গর্ভাশয় → ফল এবং ডিম্বক → বীজে রূপান্তরিত হয়।',
  },
];

interface PollinationAgent {
  id: string;
  nameBn: string;
  nameEn: string;
  flowerTraits: string;
  pollenTraits: string;
  examples: string;
}

const POLLINATION_AGENTS: PollinationAgent[] = [
  {
    id: 'insect',
    nameBn: 'পতঙ্গপরাগী',
    nameEn: 'Entomophilous (Insect)',
    flowerTraits: 'ফুল বড়, উজ্জ্বল রঙিন, সুগন্ধি এবং মধুগ্রন্থিযুক্ত হয়।',
    pollenTraits: 'পরাগরেণু ও গর্ভমুণ্ড আঠালো হয়, যাতে পতঙ্গের গায়ে সহজে লেগে যায়।',
    examples: 'জবা, কুমড়া, সরিষা।',
  },
  {
    id: 'wind',
    nameBn: 'বায়ুপরাগী',
    nameEn: 'Anemophilous (Wind)',
    flowerTraits: 'ফুল সাধারণত ছোট, বর্ণহীন, গন্ধহীন ও মধুগ্রন্থিবিহীন হয়।',
    pollenTraits: 'পরাগরেণু অত্যন্ত হালকা ও অসংখ্য; গর্ভমুণ্ড পালকের মতো ও আঠালো হয়।',
    examples: 'ধান, গম, ভুট্টা।',
  },
  {
    id: 'water',
    nameBn: 'পানিপরাগী',
    nameEn: 'Hydrophilous (Water)',
    flowerTraits: 'ফুল ছোট, হালকা এবং পানিতে ভাসতে পারে; সুগন্ধ থাকে না।',
    pollenTraits: 'স্ত্রী ফুলের বৃন্ত লম্বা হয়ে পানির উপরিভাগে আসে এবং পরাগরেণু পানিতে ভেসে যায়।',
    examples: 'পাতাশ্যাওলা (Vallisneria)।',
  },
  {
    id: 'animal',
    nameBn: 'প্রাণিপরাগী',
    nameEn: 'Zoophilous (Animal)',
    flowerTraits: 'ফুল মোটামুটি বড়, আকর্ষণীয় রঙের ও মধুসমৃদ্ধ হয় (যেমন পাখি বা বাদুড় আকৃষ্ট করতে)।',
    pollenTraits: 'পরাগরেণু প্রাণীর ঠোঁট বা দেহে লেগে অন্য ফুলে স্থানান্তরিত হয়।',
    examples: 'কদম, শিমুল, কচু।',
  },
];

export default function ReproductionLab() {
  // Section 1: Double Fertilization Simulator
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Section 2: Pollination Agent Explorer
  const [selectedAgentId, setSelectedAgentId] = useState<string>('insect');

  const activeStep = DOUBLE_FERTILIZATION_STEPS[stepIndex];
  const activeAgent =
    POLLINATION_AGENTS.find((a) => a.id === selectedAgentId) ?? POLLINATION_AGENTS[0];

  const handleReset = () => {
    setStepIndex(0);
    setSelectedAgentId('insect');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE REPRODUCTION &amp; POLLINATION LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            দ্বিনিষেক সিমুলেটর ও পরাগায়ন এক্সপ্লোরার ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            আবৃতবীজী উদ্ভিদের দ্বিনিষেকের ৪টি ধাপ পর্যবেক্ষণ করো এবং বিভিন্ন বাহকনির্ভর পরাগায়নের বৈশিষ্ট্য তুলনা করো।
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট</span>
        </button>
      </div>

      {/* Section 1: Double Fertilization Step-by-Step Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              আবৃতবীজী উদ্ভিদের দ্বিনিষেক (Double Fertilization) সিমুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            ধাপ {activeStep.step} / {DOUBLE_FERTILIZATION_STEPS.length}
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOUBLE_FERTILIZATION_STEPS.map((item, idx) => {
            const isSelected = idx === stepIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-left ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[10px] opacity-80">ধাপ {item.step}</span>
                <span className="line-clamp-1">{item.titleBn}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content + Visual SVG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                {activeStep.titleBn} ({activeStep.titleEn})
              </h4>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
                {activeStep.ploidy}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              স্থান: {activeStep.location}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeStep.description}
            </p>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>ফলাফল:</strong> {activeStep.outcome}
              </span>
            </div>
          </div>

          {/* Interactive Carpel & Embryo Sac SVG */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 220 210"
              className="w-full max-w-[220px] h-auto"
              role="img"
              aria-label="দ্বিনিষেক প্রক্রিয়ার চিত্র"
            >
              {/* Stigma & Style & Ovary */}
              <path
                d="M 88 26 Q 110 14 132 26 Q 124 44 120 82 Q 158 106 154 148 Q 148 186 110 186 Q 72 186 66 148 Q 62 106 100 82 Q 96 44 88 26 Z"
                fill="#ecfdf5"
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Embryo Sac inside Ovary */}
              <ellipse
                cx="110"
                cy="140"
                rx="28"
                ry="34"
                fill="#ffffff"
                stroke="#14b8a6"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />

              {/* Pollen Grain on Stigma */}
              <circle cx="110" cy="18" r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

              {/* Pollen Tube Growth based on stepIndex */}
              {stepIndex === 0 && (
                <line
                  x1="110"
                  y1="25"
                  x2="110"
                  y2="58"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {stepIndex >= 1 && (
                <path
                  d="M 110 25 L 110 105 Q 110 124 110 154"
                  stroke="#d97706"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              )}

              {/* Polar Nuclei / Secondary Nucleus (Center) */}
              <circle
                cx="110"
                cy="136"
                r={stepIndex === 3 ? 10 : 7}
                fill={stepIndex === 3 ? '#0d9488' : '#99f6e4'}
                stroke="#0f766e"
                strokeWidth="1.5"
              />
              <text
                x="110"
                y="139"
                textAnchor="middle"
                className="fill-slate-900 text-[7px] font-bold"
              >
                {stepIndex === 3 ? '3n' : '2n'}
              </text>

              {/* Egg Cell (Bottom of Embryo Sac) */}
              <circle
                cx="110"
                cy="160"
                r={stepIndex >= 2 ? 9 : 7}
                fill={stepIndex >= 2 ? '#e11d48' : '#fecdd3'}
                stroke="#be123c"
                strokeWidth="1.5"
              />
              <text
                x="110"
                y="163"
                textAnchor="middle"
                className="fill-white text-[7px] font-bold"
              >
                {stepIndex >= 2 ? '2n' : 'n'}
              </text>

              <text
                x="110"
                y="202"
                textAnchor="middle"
                className="fill-slate-600 text-[9px] font-bold"
              >
                {stepIndex === 0 && 'পরাগরেণু থেকে পরাগনালিকা সৃষ্টি'}
                {stepIndex === 1 && 'ভ্রূণথলিতে ২টি পুং গ্যামেট প্রবেশ'}
                {stepIndex === 2 && 'জাইগোট (2n) গঠন — প্রথম নিষেক'}
                {stepIndex === 3 && 'শস্যকোষ (3n) গঠন — ত্রিমিলন'}
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Pollination Agents Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              পরাগায়নের মাধ্যম ও ফুলের অভিযোজন এক্সপ্লোরার
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {activeAgent.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POLLINATION_AGENTS.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgentId(agent.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {agent.nameBn}
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-lg font-extrabold text-slate-900">
            {activeAgent.nameBn} ফুল ({activeAgent.nameEn})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">ফুলের বৈশিষ্ট্য:</strong>
              {activeAgent.flowerTraits}
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">পরাগরেণু ও গর্ভমুণ্ড:</strong>
              {activeAgent.pollenTraits}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              <strong>উদাহরণ:</strong> {activeAgent.examples}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}