'use client';

import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Info,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface NephronStep {
  id: string;
  step: number;
  nameBn: string;
  nameEn: string;
  location: string;
  retained: string;
  eliminatedOrMoved: string;
  summary: string;
}

const NEPHRON_STEPS: NephronStep[] = [
  {
    id: 'ultrafiltration',
    step: 1,
    nameBn: 'আল্ট্রাফিল্ট্রেশন (অতিসূক্ষ্ম পরিস্রাবণ)',
    nameEn: 'Ultrafiltration',
    location: 'গ্লোমেরুলাস → বোম্যান্স ক্যাপসুল',
    retained: 'রক্তকণিকা ও বড় প্রোটিন অণু রক্তনালিতেই থেকে যায়।',
    eliminatedOrMoved: 'পানি, গ্লুকোজ, অ্যামিনো এসিড, ইউরিয়া ও খনিজ লবণ ছাঁকিত হয়ে বোম্যান্স ক্যাপসুলে ঢোকে।',
    summary: 'গ্লোমেরুলাসের উচ্চ রক্তচাপের ফলে রক্ত ছাঁকিত হয়ে গ্লোমেরুলার ফিলট্রেট তৈরি করে।',
  },
  {
    id: 'reabsorption',
    step: 2,
    nameBn: 'নির্বাচনী পুনঃশোষণ',
    nameEn: 'Selective Reabsorption',
    location: 'রেনাল টিউব্যুল → পেরিটিউবুলার রক্তকৈশিক',
    retained: 'প্রয়োজনীয় গ্লুকোজ, অ্যামিনো এসিড, ভিটামিন, দরকারি লবণ ও বেশিরভাগ পানি পুনরায় রক্তে ফিরে আসে।',
    eliminatedOrMoved: 'অতিরিক্ত লবণ, ইউরিয়া ও বর্জ্য পদার্থ টিউব্যুলের ভেতরে থেকে যায়।',
    summary: 'দেহের জন্য দরকারি উপাদানগুলো নষ্ট না হয়ে রক্তে পুনঃশোষিত হয় এবং অসমোরেগুলেশন ঘটে।',
  },
  {
    id: 'secretion-collection',
    step: 3,
    nameBn: 'সক্রিয় ক্ষরণ ও মূত্র সংগ্রহ',
    nameEn: 'Secretion & Urine Collection',
    location: 'দূরবর্তী নালিকা ও সংগ্রাহী নালিকা → ইউরেটার',
    retained: 'রক্তে পানি ও লবণের স্বাভাবিক ভারসাম্য (অসমোরেগুলেশন) বজায় থাকে।',
    eliminatedOrMoved: 'ইউরিয়া, ইউরিক এসিড, ক্রিয়েটিনিন ও অতিরিক্ত পানি মূত্র হিসেবে সংগ্রাহী নালিকা হয়ে মূত্রথলিতে যায়।',
    summary: 'চূড়ান্ত বর্জ্য তরল মূত্র রূপে ইউরেটার বেয়ে মূত্রথলিতে জমা হয় এবং পরে দেহ থেকে নিষ্কাশিত হয়।',
  },
];

interface KidneyCondition {
  id: string;
  nameBn: string;
  nameEn: string;
  cause: string;
  keyFact: string;
  careTip: string;
}

const KIDNEY_CONDITIONS: KidneyCondition[] = [
  {
    id: 'kidney-stones',
    nameBn: 'কিডনিতে পাথর',
    nameEn: 'Kidney Stones',
    cause: 'কম পানি পান, মূত্রে ক্যালসিয়াম অক্সালেট বা ইউরিক এসিডের আধিক্য ও বিপাকীয় সমস্যা।',
    keyFact: 'কোমর বা পিঠের একপাশে তীব্র ব্যথা, মূত্রে রক্ত বা জ্বালাপোড়া হতে পারে।',
    careTip: 'প্রতিদিন পর্যাপ্ত পানি পান করো এবং অতিরিক্ত লবণ ও অক্সালেটসমৃদ্ধ খাবার পরিমিত রাখো।',
  },
  {
    id: 'kidney-failure',
    nameBn: 'কিডনি বিকল ও ইউরেমিয়া',
    nameEn: 'Kidney Failure & Uremia',
    cause: 'অনিয়ন্ত্রিত ডায়াবেটিস, উচ্চ রক্তচাপ, দীর্ঘস্থায়ী সংক্রমণ বা নেফ্রনের ক্ষতি।',
    keyFact: 'বৃক্ক কাজ না করলে রক্তে ইউরিয়া ও বিষাক্ত বর্জ্য জমে যায় (ইউরেমিয়া)।',
    careTip: 'রক্তচাপ ও ডায়াবেটিস নিয়ন্ত্রণে রাখো; অকার্যকর হলে হিমোডায়ালাইসিস বা কিডনি প্রতিস্থাপন লাগে।',
  },
  {
    id: 'hemodialysis',
    nameBn: 'হিমোডায়ালাইসিস',
    nameEn: 'Hemodialysis',
    cause: 'উভয় বৃক্ক স্থায়ী বা সাময়িকভাবে অকার্যকর হলে কৃত্রিম রক্ত পরিশোধনের প্রয়োজন হয়।',
    keyFact: 'ডায়ালাইসিস মেশিনের আধাভেদ্য ঝিল্লির সাহায্যে রক্ত থেকে ইউরিয়া ও অতিরিক্ত বর্জ্য আলাদা করা হয়।',
    careTip: 'নির্ধারিত সময়সূচি অনুযায়ী ডায়ালাইসিস ও চিকিৎসকের পরামর্শ মেনে চলো।',
  },
];

export default function ExcretionLab() {
  // Section 1: Nephron & Urine Formation Simulator
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState<number>(2.5);

  // Section 2: Kidney Conditions Explorer
  const [selectedConditionId, setSelectedConditionId] = useState<string>('kidney-stones');

  const activeStep = NEPHRON_STEPS[stepIndex];
  const activeCondition =
    KIDNEY_CONDITIONS.find((c) => c.id === selectedConditionId) ?? KIDNEY_CONDITIONS[0];

  const getHydrationStatus = (liters: number) => {
    if (liters < 1.5) {
      return {
        label: 'পানিস্বল্পতা — কিডনিতে পাথরের ঝুঁকি বেশি',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
        note: 'পর্যাপ্ত পানি না খেলে মূত্র ঘন হয়ে লবণ ও খনিজ জমে কিডনিতে পাথর হওয়ার ঝুঁকি বাড়ে।',
      };
    }
    if (liters <= 3.2) {
      return {
        label: 'স্বাভাবিক জলীয় ভারসাম্য (Osmoregulation)',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        note: 'নেফ্রন স্বাভাবিক হারে ছাঁকন ও পুনঃশোষণ করে রক্ত ও মূত্রের ভারসাম্য বজায় রাখছে।',
      };
    }
    return {
      label: 'অতিরিক্ত পানি — মূত্রের পরিমাণ বাড়বে',
      className: 'bg-sky-50 text-sky-700 border-sky-200',
      note: 'বৃক্ক অতিরিক্ত পানি ছাঁকন করে মূত্রের মাধ্যমে বের করে দিয়ে দেহের জলীয় সাম্য রক্ষা করবে।',
    };
  };

  const hydrationStatus = getHydrationStatus(waterIntakeLiters);

  const handleReset = () => {
    setStepIndex(0);
    setWaterIntakeLiters(2.5);
    setSelectedConditionId('kidney-stones');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE EXCRETION &amp; NEPHRON LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            নেফ্রন মূত্র গঠন সিমুলেটর ও বৃক্কের রোগ ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            নেফ্রনে মূত্র তৈরির ধাপগুলো পর্যবেক্ষণ করো, পানি পানের প্রভাবে অসমোরেগুলেশন দেখো এবং বৃক্কের রোগ ও প্রতিকার যাচাই করো।
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

      {/* Section 1: Nephron Urine Formation & Osmoregulation */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              নেফ্রনে মূত্র তৈরি ও অসমোরেগুলেশন সিমুলেটর
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${hydrationStatus.className}`}
          >
            {hydrationStatus.label}
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {NEPHRON_STEPS.map((s, idx) => {
            const isSelected = idx === stepIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-left ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[10px] opacity-80">ধাপ {s.step}/৩</span>
                <span>{s.nameBn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              {activeStep.nameBn} ({activeStep.nameEn})
            </h4>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
              স্থান: {activeStep.location}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeStep.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">
                ধরে রাখা / রক্তে ফেরত যাওয়া অংশ:
              </strong>
              {activeStep.retained}
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 leading-relaxed">
              <strong className="block mb-1">ছাঁকিত / নিষ্কাশিত অংশ:</strong>
              {activeStep.eliminatedOrMoved}
            </div>
          </div>
        </div>

        {/* Water Intake Osmoregulation Slider */}
        <div className="pt-1 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>দৈনিক পানি গ্রহণের পরিমাণ (লিটার)</span>
            <span className="font-mono text-teal-700">{waterIntakeLiters.toFixed(1)} L</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={4.5}
            step={0.1}
            value={waterIntakeLiters}
            onChange={(e) => setWaterIntakeLiters(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <p className="text-xs text-slate-600 flex items-start gap-1.5">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>{hydrationStatus.note}</span>
          </p>
        </div>
      </section>

      {/* Section 2: Kidney Diseases & Care */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              বৃক্কের রোগ, ডায়ালাইসিস ও সুরক্ষা
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {activeCondition.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {KIDNEY_CONDITIONS.map((cond) => {
            const isSelected = cond.id === selectedConditionId;
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => setSelectedConditionId(cond.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cond.nameBn}
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-lg font-extrabold text-slate-900">
            {activeCondition.nameBn} ({activeCondition.nameEn})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">কারণ ও পটভূমি:</strong>
              {activeCondition.cause}
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">মূল বৈশিষ্ট্য / লক্ষণ:</strong>
              {activeCondition.keyFact}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 leading-relaxed">
            <strong className="block mb-1">প্রতিরোধ ও পরিচর্যা:</strong>
            {activeCondition.careTip}
          </div>
        </div>
      </section>
    </div>
  );
}