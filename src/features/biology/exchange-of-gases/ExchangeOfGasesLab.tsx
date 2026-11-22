'use client';

import React, { useState } from 'react';
import {
  Activity,
  Info,
  RotateCcw,
  ShieldAlert,
  Wind,
} from 'lucide-react';

type BreathingPhase = 'inspiration' | 'expiration';

interface RespiratoryDisease {
  id: string;
  nameBn: string;
  nameEn: string;
  cause: string;
  affectedPart: string;
  symptoms: string;
  prevention: string;
}

const RESPIRATORY_DISEASES: RespiratoryDisease[] = [
  {
    id: 'bronchitis',
    nameBn: 'ব্রংকাইটিস',
    nameEn: 'Bronchitis',
    cause: 'ধূমপান, ধোঁয়া, বায়ুদূষণ এবং ভাইরাস বা ব্যাকটেরিয়ার সংক্রমণ।',
    affectedPart: 'ব্রংকাই ও ব্রংকিওল (শ্বাসনালির শাখা)।',
    symptoms: 'দীর্ঘস্থায়ী কাশি, শ্লেষ্মা উৎপাদন, বুকে অস্বস্তি ও শ্বাসকষ্ট।',
    prevention: 'ধূমপান ও দূষিত বায়ু এড়িয়ে চলা, পরিচ্ছন্ন পরিবেশ ও সময়মতো চিকিৎসা।',
  },
  {
    id: 'pneumonia',
    nameBn: 'নিউমোনিয়া',
    nameEn: 'Pneumonia',
    cause: 'প্রধানত Streptococcus pneumoniae ব্যাকটেরিয়া, এছাড়া ভাইরাস বা ছত্রাক।',
    affectedPart: 'ফুসফুসের অ্যালভিওলাস ও বায়ুথলিতে তরল/পুঁজ জমে।',
    symptoms: 'উচ্চ জ্বর, কাশি, বুকে ব্যথা, দ্রুত শ্বাস-প্রশ্বাস ও শ্বাসকষ্ট।',
    prevention: 'নিউমোনিয়ার টিকা, শিশুর যত্ন, পরিচ্ছন্নতা ও চিকিৎসকের পরামর্শে অ্যান্টিবায়োটিক।',
  },
  {
    id: 'asthma',
    nameBn: 'হাঁপানি বা অ্যাজমা',
    nameEn: 'Asthma',
    cause: 'ধুলাবালি, পরাগরেণু, ধোঁয়া, ঠান্ডা বাতাস বা খাদ্যের মতো অ্যালার্জেন ও বংশগত সংবেদনশীলতা।',
    affectedPart: 'শ্বাসনালি সংকুচিত হয়ে বাতাস চলাচলে বাধা সৃষ্টি করে।',
    symptoms: 'শ্বাসকষ্ট, শ্বাস নেওয়ার সময় বাঁশির মতো শব্দ (Wheezing) ও কাশি।',
    prevention: 'অ্যালার্জেন থেকে দূরে থাকা, চিকিৎসকের পরামর্শ অনুযায়ী ইনহেলার ও ওষুধ ব্যবহার।',
  },
  {
    id: 'tuberculosis',
    nameBn: 'যক্ষ্মা',
    nameEn: 'Tuberculosis (TB)',
    cause: 'Mycobacterium tuberculosis ব্যাকটেরিয়া (হাঁচি, কাশি বা থুতুর মাধ্যমে ছড়ায়)।',
    affectedPart: 'প্রধানত ফুসফুস; তবে দেহের অন্যান্য অঙ্গেও হতে পারে।',
    symptoms: '৩ সপ্তাহের বেশি কাশি, সন্ধ্যায় জ্বর, রাতের ঘাম, ক্ষুধামান্দ্য ও ওজন হ্রাস।',
    prevention: 'জন্মের পর BCG টিকা দেওয়া এবং আক্রান্ত হলে DOTS পদ্ধতিতে পূর্ণ মেয়াদে ওষুধ সেবন।',
  },
];

export default function ExchangeOfGasesLab() {
  // Section 1: Breathing & Thoracic Pressure Simulator
  const [phase, setPhase] = useState<BreathingPhase>('inspiration');
  const [breathRate, setBreathRate] = useState<number>(16);

  // Section 2: Respiratory Diseases Explorer
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('pneumonia');

  const activeDisease =
    RESPIRATORY_DISEASES.find((d) => d.id === selectedDiseaseId) ??
    RESPIRATORY_DISEASES[0];

  const isInspiring = phase === 'inspiration';

  const getRateNote = (rate: number) => {
    if (rate < 12) return 'স্বাভাবিকের চেয়ে কম শ্বাসহার (বিশ্রাম বা ঘুমন্ত অবস্থায় দেখা যায়)।';
    if (rate <= 20) return 'স্বাভাবিক শ্বাসহার (প্রাপ্তবয়স্ক সুস্থ মানুষের স্বাভাবিক হার ১৪–১৮ বার/মিনিট)।';
    return 'বর্ধিত শ্বাসহার (ব্যায়াম, জ্বর বা শ্বাসকষ্টের সময় শ্বাসহার বেড়ে যায়)।';
  };

  const handleReset = () => {
    setPhase('inspiration');
    setBreathRate(16);
    setSelectedDiseaseId('pneumonia');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE RESPIRATION &amp; LUNG LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            শ্বাস-প্রশ্বাস সিমুলেটর ও শ্বসনতন্ত্রের রোগ ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            শ্বাস গ্রহণ ও শ্বাস ত্যাগের সময় মধ্যচ্ছদা ও বক্ষগহ্বরের চাপের পরিবর্তন দেখো এবং শ্বসনতন্ত্রের রোগগুলোর কারণ ও প্রতিরোধ যাচাই করো।
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

      {/* Section 1: Inspiration vs Expiration Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              শ্বাস গ্রহণ (ইনস্পিরেশন) বনাম শ্বাস ত্যাগ (এক্সপিরেশন)
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isInspiring
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}
          >
            {isInspiring ? 'শ্বাস গ্রহণ (বাতাস ভেতরে যাচ্ছে)' : 'শ্বাস ত্যাগ (বাতাস বাইরে যাচ্ছে)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls & Mechanics */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPhase('inspiration')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                  isInspiring
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ১. শ্বাস গ্রহণ (Inspiration)
              </button>
              <button
                type="button"
                onClick={() => setPhase('expiration')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                  !isInspiring
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ২. শ্বাস ত্যাগ (Expiration)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                <strong className="text-slate-900 block mb-1">মধ্যচ্ছদা (ডায়াফ্রাম) ও পাঁজর:</strong>
                {isInspiring
                  ? 'পেশি সংকুচিত হয়ে মধ্যচ্ছদা নিচে নামে এবং পাঁজর ওপরে ও বাইরে ওঠে।'
                  : 'পেশি শিথিল হয়ে মধ্যচ্ছদা গম্বুজের মতো ওপরে ওঠে এবং পাঁজর নিচে নামে।'}
              </div>
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 leading-relaxed">
                <strong className="block mb-1">বক্ষগহ্বরের আয়তন ও বায়ুচাপ:</strong>
                {isInspiring
                  ? 'আয়তন বাড়ে ও ভেতরের চাপ কমে; বাইরের বায়ু ফুসফুসে প্রবেশ করে।'
                  : 'আয়তন কমে ও ভেতরের চাপ বাড়ে; ফুসফুসের CO₂-সমৃদ্ধ বায়ু বেরিয়ে যায়।'}
              </div>
            </div>

            {/* Breath Rate Slider */}
            <div className="pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>শ্বাস-প্রশ্বাসের হার (প্রতি মিনিটে)</span>
                <span className="font-mono text-teal-700">{breathRate} বার/মিনিট</span>
              </div>
              <input
                type="range"
                min={8}
                max={36}
                value={breathRate}
                onChange={(e) => setBreathRate(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">{getRateNote(breathRate)}</p>
            </div>
          </div>

          {/* Visual Lung & Diaphragm SVG */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 240 200"
              className="w-full max-w-[240px] h-auto"
              role="img"
              aria-label="ফুসফুস ও মধ্যচ্ছদার সিমুলেশন"
            >
              {/* Trachea */}
              <rect
                x="112"
                y="16"
                width="16"
                height="42"
                rx="4"
                fill="#e2e8f0"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Lungs (expand on inspiration, contract on expiration) */}
              <ellipse
                cx="86"
                cy="102"
                rx={isInspiring ? 34 : 26}
                ry={isInspiring ? 44 : 36}
                fill="#fda4af"
                stroke="#e11d48"
                strokeWidth="2"
              />
              <ellipse
                cx="154"
                cy="102"
                rx={isInspiring ? 34 : 26}
                ry={isInspiring ? 44 : 36}
                fill="#fda4af"
                stroke="#e11d48"
                strokeWidth="2"
              />

              {/* Airflow Arrows */}
              {isInspiring ? (
                <g stroke="#0d9488" strokeWidth="2.5" fill="none">
                  <line x1="120" y1="8" x2="120" y2="48" />
                  <polyline points="113,41 120,49 127,41" />
                </g>
              ) : (
                <g stroke="#0284c7" strokeWidth="2.5" fill="none">
                  <line x1="120" y1="48" x2="120" y2="8" />
                  <polyline points="113,15 120,7 127,15" />
                </g>
              )}

              {/* Diaphragm (moves down on inspiration, domes up on expiration) */}
              <path
                d={
                  isInspiring
                    ? 'M 42 154 Q 120 172 198 154'
                    : 'M 42 158 Q 120 132 198 158'
                }
                stroke="#0f766e"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              <text
                x="120"
                y="188"
                textAnchor="middle"
                className="fill-slate-600 text-[10px] font-bold"
              >
                {isInspiring ? 'মধ্যচ্ছদা নিচে → ফুসফুস প্রসারিত' : 'মধ্যচ্ছদা ওপরে → ফুসফুস সংকুচিত'}
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Respiratory Diseases Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              শ্বসনতন্ত্রের প্রধান রোগ ও প্রতিরোধ গাইড
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {activeDisease.nameEn}
          </span>
        </div>

        {/* Disease Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RESPIRATORY_DISEASES.map((disease) => {
            const isSelected = disease.id === selectedDiseaseId;
            return (
              <button
                key={disease.id}
                type="button"
                onClick={() => setSelectedDiseaseId(disease.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {disease.nameBn}
              </button>
            );
          })}
        </div>

        {/* Disease Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-lg font-extrabold text-slate-900">
            {activeDisease.nameBn} ({activeDisease.nameEn})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">কারণ / জীবাণু:</strong>
              {activeDisease.cause}
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">আক্রান্ত অংশ ও প্রভাব:</strong>
              {activeDisease.affectedPart}
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">প্রধান লক্ষণ:</strong>
              {activeDisease.symptoms}
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 leading-relaxed flex items-start gap-1.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">প্রতিরোধ ও প্রতিকার:</strong>
                {activeDisease.prevention}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}