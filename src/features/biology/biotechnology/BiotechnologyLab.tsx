'use client';

import React, { useState } from 'react';
import {
  Activity,
  Dna,
  FlaskConical,
  Info,
  RotateCcw,
  Scissors,
  Sparkles,
} from 'lucide-react';

interface RdnaStep {
  id: string;
  step: number;
  titleBn: string;
  titleEn: string;
  toolUsed: string;
  description: string;
  outcome: string;
}

const RDNA_STEPS: RdnaStep[] = [
  {
    id: 'isolation',
    step: 1,
    titleBn: 'কাঙ্ক্ষিত জিন ও প্লাজমিড সংগ্রহ',
    titleEn: 'Gene & Plasmid Isolation',
    toolUsed: 'মানবকোষ (ইনসুলিন জিন) + E. coli (প্লাজমিড)',
    description:
      'মানুষের অগ্ন্যাশয় কোষের DNA থেকে ইনসুলিন তৈরির কাঙ্ক্ষিত জিন এবং E. coli ব্যাকটেরিয়া থেকে বৃত্তাকার প্লাজমিড DNA পৃথক করা হয়।',
    outcome: 'দাতা জিন এবং বাহক (Vector) প্লাজমিড উভয়ই কাটার জন্য প্রস্তুত।',
  },
  {
    id: 'cutting',
    step: 2,
    titleBn: 'রেস্ট্রিকশন এনজাইম দিয়ে কর্তন',
    titleEn: 'Cutting with Restriction Enzyme',
    toolUsed: 'রেস্ট্রিকশন এনজাইম (আণবিক কাঁচি)',
    description:
      'একই নির্দিষ্ট রেস্ট্রিকশন এনজাইম ব্যবহার করে কাঙ্ক্ষিত ইনসুলিন জিন এবং বৃত্তাকার প্লাজমিডের নির্দিষ্ট স্থান কেটে আঠালো প্রান্ত (Sticky ends) তৈরি করা হয়।',
    outcome: 'প্লাজমিডের বৃত্তাকার বলয়ে কাঙ্ক্ষিত জিন বসানোর উপযোগী ফাঁকা স্থান তৈরি হয়।',
  },
  {
    id: 'ligation',
    step: 3,
    titleBn: 'লাইগেজ এনজাইম দিয়ে জোড়া লাগানো',
    titleEn: 'Ligation (Recombinant DNA)',
    toolUsed: 'লাইগেজ এনজাইম (আণবিক আঠা)',
    description:
      'কাটা প্লাজমিডের ফাঁকা স্থানে কাঙ্ক্ষিত ইনসুলিন জিন বসিয়ে DNA লাইগেজ এনজাইমের সাহায্যে জোড়া লাগানো হয়।',
    outcome: 'নতুন বৈশিষ্ট্যসম্পন্ন রিকম্বিনেন্ট DNA (rDNA) বা রিকম্বিনেন্ট প্লাজমিড গঠিত হয়।',
  },
  {
    id: 'transformation',
    step: 4,
    titleBn: 'পোষক ব্যাকটেরিয়ায় প্রবেশ ও ক্লোনিং',
    titleEn: 'Transformation & Insulin Production',
    toolUsed: 'পোষক E. coli ব্যাকটেরিয়া ও ফার্মেন্টার',
    description:
      'রিকম্বিনেন্ট প্লাজমিডকে পোষক E. coli ব্যাকটেরিয়ায় প্রবেশ করানো হয়। ব্যাকটেরিয়া দ্রুত বিভাজিত হয়ে অসংখ্য কপি তৈরি করে এবং খাঁটি মানব ইনসুলিন উৎপাদন শুরু করে।',
    outcome: 'স্বল্প খরচে বাণিজ্যিকভাবে বিপুল পরিমাণ নিরাপদ মানব ইনসুলিন পাওয়া যায়।',
  },
];

interface TissueCultureStage {
  id: string;
  stage: number;
  nameBn: string;
  nameEn: string;
  condition: string;
  detail: string;
}

const TISSUE_CULTURE_STAGES: TissueCultureStage[] = [
  {
    id: 'explant',
    stage: 1,
    nameBn: 'এক্সপ্ল্যান্ট সংগ্রহ',
    nameEn: 'Explant Selection',
    condition: 'সুস্থ ও রোগমুক্ত মাতৃউদ্ভিদ',
    detail:
      'উন্নত জাতের উদ্ভিদের শীর্ষমুকুল, পার্শ্বমুকুল বা কচি পাতার বিভাজনক্ষম অংশ কেটে জীবাণুমুক্ত করা হয়—একে এক্সপ্ল্যান্ট বলে।',
  },
  {
    id: 'media',
    stage: 2,
    nameBn: 'আবাদ মাধ্যম ও অটোক্লেভ',
    nameEn: 'Culture Medium & Sterilization',
    condition: '১২১°C তাপমাত্রা, ১৫ মিনিট (অটোক্লেভ)',
    detail:
      'খনিজ পুষ্টি, সুক্রোজ, ভিটামিন, অ্যাগার ও ফাইটোহরমোন মিশিয়ে আবাদ মাধ্যম তৈরি করে অটোক্লেভ যন্ত্রে জীবাণুমুক্ত করা হয়।',
  },
  {
    id: 'callus',
    stage: 3,
    nameBn: 'ক্যালাস (Callus) সৃষ্টি',
    nameEn: 'Callus Formation',
    condition: 'নিয়ন্ত্রিত আলো ও তাপমাত্রা',
    detail:
      'আবাদ মাধ্যমে এক্সপ্ল্যান্ট স্থাপনের পর কোষগুলো বারবার বিভাজিত হয়ে অবয়বহীন কোষপিণ্ড বা ক্যালাস তৈরি করে।',
  },
  {
    id: 'plantlets',
    stage: 4,
    nameBn: 'চারা ও মূল সৃষ্টি',
    nameEn: 'Plantlet & Root Formation',
    condition: 'অক্সিন ও সাইটোকাইনিন হরমোন',
    detail:
      'উপযুক্ত ফাইটোহরমোনের প্রভাবে ক্যালাস থেকে অসংখ্য ক্ষুদ্র চারা (Plantlets) এবং মূল গজায়।',
  },
  {
    id: 'field',
    stage: 5,
    nameBn: 'মাঠ পর্যায়ে স্থানান্তর',
    nameEn: 'Field Transplantation',
    condition: 'প্রাকৃতিক পরিবেশে অভিযোজন',
    detail:
      'মূলসহ চারাগুলোকে প্রথমে টবে রেখে পরিবেশের সাথে খাপ খাইয়ে পরে মূল মাঠে রোপণ করা হয়।',
  },
];

export default function BiotechnologyLab() {
  // Section 1: Recombinant DNA / Insulin Simulator
  const [rdnaIndex, setRdnaIndex] = useState<number>(0);

  // Section 2: Tissue Culture Step Explorer
  const [tissueIndex, setTissueIndex] = useState<number>(0);

  const activeRdna = RDNA_STEPS[rdnaIndex];
  const activeTissue = TISSUE_CULTURE_STAGES[tissueIndex];

  const handleReset = () => {
    setRdnaIndex(0);
    setTissueIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE BIOTECHNOLOGY LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            রিকম্বিনেন্ট DNA (ইনসুলিন) ও টিস্যু কালচার সিমুলেটর ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            ধাপে ধাপে রিকম্বিনেন্ট DNA প্রযুক্তিতে মানব ইনসুলিন তৈরি এবং টিস্যু কালচারের মাধ্যমে রোগমুক্ত চারা উৎপাদন প্রক্রিয়া পর্যবেক্ষণ করো।
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

      {/* Section 1: Recombinant DNA & Insulin Production Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              রিকম্বিনেন্ট DNA প্রযুক্তি (ইনসুলিন উৎপাদন) সিমুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            ধাপ {activeRdna.step} / {RDNA_STEPS.length}
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RDNA_STEPS.map((item, idx) => {
            const isSelected = idx === rdnaIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRdnaIndex(idx)}
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

        {/* Content + Plasmid Visual SVG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                {activeRdna.titleBn}
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
                <Scissors className="w-3.5 h-3.5" />
                {activeRdna.toolUsed}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeRdna.description}
            </p>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>ফলাফল:</strong> {activeRdna.outcome}
              </span>
            </div>
          </div>

          {/* Interactive Plasmid SVG */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 220 190"
              className="w-full max-w-[220px] h-auto"
              role="img"
              aria-label="রিকম্বিনেন্ট প্লাজমিড গঠনের চিত্র"
            >
              {/* Host Bacteria Outline in Step 4 */}
              {rdnaIndex === 3 && (
                <rect
                  x="22"
                  y="24"
                  width="176"
                  height="136"
                  rx="68"
                  fill="#ecfdf5"
                  stroke="#0f766e"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />
              )}

              {/* Plasmid Ring */}
              <circle
                cx="110"
                cy="92"
                r="44"
                fill="none"
                stroke="#0d9488"
                strokeWidth="8"
                strokeDasharray={rdnaIndex === 1 ? '215 62' : 'none'}
                strokeDashoffset={rdnaIndex === 1 ? '-15' : '0'}
              />

              {/* Desired Insulin Gene */}
              {rdnaIndex === 0 && (
                <line
                  x1="168"
                  y1="62"
                  x2="168"
                  y2="122"
                  stroke="#e11d48"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              )}

              {rdnaIndex === 1 && (
                <line
                  x1="158"
                  y1="72"
                  x2="188"
                  y2="108"
                  stroke="#e11d48"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              )}

              {rdnaIndex >= 2 && (
                <path
                  d="M 148 70 A 44 44 0 0 1 148 114"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              )}

              {/* Labels */}
              <text
                x="110"
                y="96"
                textAnchor="middle"
                className="fill-slate-800 text-[10px] font-extrabold"
              >
                {rdnaIndex >= 2 ? 'rDNA প্লাজমিড' : 'প্লাজমিড'}
              </text>

              <text
                x="110"
                y="176"
                textAnchor="middle"
                className="fill-slate-600 text-[9px] font-bold"
              >
                {rdnaIndex === 0 && 'প্লাজমিড (সবুজ) ও ইনসুলিন জিন (লাল)'}
                {rdnaIndex === 1 && 'রেস্ট্রিকশন এনজাইম দিয়ে কাটা অংশ'}
                {rdnaIndex === 2 && 'লাইগেজ এনজাইম দিয়ে জোড়া লাগানো rDNA'}
                {rdnaIndex === 3 && 'E. coli ব্যাকটেরিয়ায় rDNA ক্লোনিং'}
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Tissue Culture Step Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              টিস্যু কালচার (Tissue Culture) ধাপ এক্সপ্লোরার
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ধাপ {activeTissue.stage} / {TISSUE_CULTURE_STAGES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TISSUE_CULTURE_STAGES.map((stage, idx) => {
            const isSelected = idx === tissueIndex;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setTissueIndex(idx)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-left ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[10px] opacity-80">ধাপ {stage.stage}</span>
                <span className="line-clamp-1">{stage.nameBn}</span>
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              {activeTissue.nameBn} ({activeTissue.nameEn})
            </h4>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
              শর্ত: {activeTissue.condition}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeTissue.detail}
          </p>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              সঠিক ক্রম: <strong>এক্সপ্ল্যান্ট → আবাদ মাধ্যম (অটোক্লেভ) → ক্যালাস → চারা ও মূল → মাঠ পর্যায়ে স্থানান্তর</strong>।
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}