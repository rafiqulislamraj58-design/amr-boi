'use client';

import React, { useState } from 'react';
import {
  Activity,
  Brain,
  Info,
  RotateCcw,
  Sprout,
  Zap,
} from 'lucide-react';

interface ReflexStep {
  id: string;
  step: number;
  titleBn: string;
  titleEn: string;
  part: string;
  action: string;
}

const REFLEX_STEPS: ReflexStep[] = [
  {
    id: 'receptor',
    step: 1,
    titleBn: 'উদ্দীপনা গ্রহণ (গ্রাহক অঙ্গ)',
    titleEn: 'Receptor',
    part: 'ত্বক / সংবেদী অঙ্গ',
    action: 'গরম বস্তু বা তীক্ষ্ণ পিনের স্পর্শ ত্বকের গ্রাহক কোষে উদ্দীপনা সৃষ্টি করে।',
  },
  {
    id: 'sensory-neuron',
    step: 2,
    titleBn: 'সংবেদী নিউরনে পরিবহন',
    titleEn: 'Sensory Neuron',
    part: 'সংবেদী স্নায়ু (অ্যাফারেন্ট)',
    action: 'স্নায়ুতাড়না ত্বক থেকে দ্রুত গতিতে সুষুম্নাকাণ্ডের দিকে প্রবাহিত হয়।',
  },
  {
    id: 'spinal-cord',
    step: 3,
    titleBn: 'সুষুম্নাকাণ্ডে সমন্বয়',
    titleEn: 'Spinal Cord (Interneuron)',
    part: 'সুষুম্নাকাণ্ডের ধূসর পদার্থ',
    action: 'মস্তিষ্কে পৌঁছানোর আগেই সুষুম্নাকাণ্ডের অন্তর্বর্তী নিউরন তাৎক্ষণিক সিদ্ধান্ত গ্রহণ করে।',
  },
  {
    id: 'motor-neuron',
    step: 4,
    titleBn: 'চেষ্টীয় নিউরনে নির্দেশ প্রেরণ',
    titleEn: 'Motor Neuron',
    part: 'চেষ্টীয় স্নায়ু (ইফারেন্ট)',
    action: 'সুষুম্নাকাণ্ড থেকে সাড়া দেওয়ার নির্দেশ পেশির দিকে প্রবাহিত হয়।',
  },
  {
    id: 'effector',
    step: 5,
    titleBn: 'সাড়া প্রদান (কারক অঙ্গ)',
    titleEn: 'Effector',
    part: 'হাতের পেশি',
    action: 'পেশি সংকুচিত হয়ে সাথে সাথে হাত গরম বা তীক্ষ্ণ বস্তু থেকে সরে আসে।',
  },
];

interface PhytohormoneInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  role: string;
  effect: string;
  example: string;
}

const PHYTOHORMONES: PhytohormoneInfo[] = [
  {
    id: 'auxin',
    nameBn: 'অক্সিন',
    nameEn: 'Auxin',
    role: 'কোষের দৈর্ঘ্য বৃদ্ধি ও অগ্রমুকুলের প্রাধান্য',
    effect: 'কাণ্ডের অন্ধকার পাশে বেশি জমা হয়ে কাণ্ডকে আলোর দিকে বাঁকিয়ে দেয় (ফটোট্রপিজম)।',
    example: 'কলমে মূল গজানো ও ফল ঝরে পড়া রোধে ব্যবহৃত হয়।',
  },
  {
    id: 'gibberellin',
    nameBn: 'জিবেরেলিন',
    nameEn: 'Gibberellin',
    role: 'পর্বমধ্যের দৈর্ঘ্য বৃদ্ধি ও সুপ্তাবস্থা ভঙ্গ',
    effect: 'খাটো উদ্ভিদকে লম্বা করে এবং বীজের সুপ্তাবস্থা ভেঙে অঙ্কুরোদগম ঘটায়।',
    example: 'বীজহীন ফল (পার্থেনোকার্পি) উৎপাদনে সাহায্য করে।',
  },
  {
    id: 'cytokinin',
    nameBn: 'সাইটোকাইনিন',
    nameEn: 'Cytokinin',
    role: 'কোষ বিভাজন উদ্দীপনা',
    effect: 'কোষ বিভাজন বাড়ায়, পার্শ্বমুকুলের বৃদ্ধি ঘটায় এবং পাতার বার্ধক্য বিলম্বিত করে।',
    example: 'শাকসবজি ও ফুল দীর্ঘক্ষণ সতেজ রাখতে ভূমিকা রাখে।',
  },
  {
    id: 'ethylene',
    nameBn: 'ইথিলিন',
    nameEn: 'Ethylene',
    role: 'গ্যাসীয় হরমোন — ফল পাকানো',
    effect: 'ফলের স্বাভাবিক পরিপক্বতা ও পাকানো ত্বরান্বিত করে এবং পাতা-ফুল ঝরায়।',
    example: 'কলা, আম ও টমেটো পাকানোর প্রাকৃতিক হরমোন।',
  },
];

export default function CoordinationLab() {
  // Section 1: Reflex Arc Simulator
  const [reflexIndex, setReflexIndex] = useState<number>(0);

  // Section 2: Phytohormone & Phototropism Explorer
  const [selectedHormoneId, setSelectedHormoneId] = useState<string>('auxin');
  const [lightDirection, setLightDirection] = useState<'left' | 'top' | 'right'>('right');

  const activeReflex = REFLEX_STEPS[reflexIndex];
  const activeHormone =
    PHYTOHORMONES.find((h) => h.id === selectedHormoneId) ?? PHYTOHORMONES[0];

  const handleReset = () => {
    setReflexIndex(0);
    setSelectedHormoneId('auxin');
    setLightDirection('right');
  };

  const getStemCurve = () => {
    if (lightDirection === 'left') return 'M 110 155 Q 105 100 68 58';
    if (lightDirection === 'right') return 'M 110 155 Q 115 100 152 58';
    return 'M 110 155 Q 110 105 110 52';
  };

  const getSunPosition = () => {
    if (lightDirection === 'left') return { cx: 36, cy: 34 };
    if (lightDirection === 'right') return { cx: 184, cy: 34 };
    return { cx: 110, cy: 24 };
  };

  const sunPos = getSunPosition();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE COORDINATION &amp; REFLEX LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            রিফ্লেক্স আর্ক সিমুলেটর ও ফাইটোহরমোন ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            প্রতিবর্তী ক্রিয়ার ৫টি ধাপ অনুসরণ করো এবং আলোর দিক পরিবর্তন করে উদ্ভিদের ফটোট্রপিজম ও ফাইটোহরমোন পর্যবেক্ষণ করো।
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

      {/* Section 1: Reflex Arc Step-by-Step Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              প্রতিবর্তী চাপ (Reflex Arc) সিমুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            ধাপ {activeReflex.step} / {REFLEX_STEPS.length}
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {REFLEX_STEPS.map((item, idx) => {
            const isSelected = idx === reflexIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setReflexIndex(idx)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-left ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[10px] opacity-80">ধাপ {item.step}</span>
                <span className="line-clamp-1">{item.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Reflex Step Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-teal-600" />
              <span>
                {activeReflex.titleBn} ({activeReflex.titleEn})
              </span>
            </h4>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
              অংশ: {activeReflex.part}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeReflex.action}
          </p>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-2 text-xs text-teal-950">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              সঠিক পথ: <strong>গ্রাহক অঙ্গ → সংবেদী নিউরন → সুষুম্নাকাণ্ড → চেষ্টীয় নিউরন → কারক অঙ্গ (পেশি)</strong>।
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Phototropism & Phytohormones Lab */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              ফটোট্রপিজম ও ফাইটোহরমোন এক্সপ্লোরার
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {activeHormone.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Hormone Selector & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PHYTOHORMONES.map((hormone) => {
                const isSelected = hormone.id === selectedHormoneId;
                return (
                  <button
                    key={hormone.id}
                    type="button"
                    onClick={() => setSelectedHormoneId(hormone.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {hormone.nameBn}
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="text-base font-extrabold text-slate-900">
                {activeHormone.nameBn} ({activeHormone.nameEn})
              </h4>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-slate-900">প্রধান কাজ: </strong>
                {activeHormone.role}
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-slate-900">প্রভাব: </strong>
                {activeHormone.effect}
              </p>
              <p className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 leading-relaxed">
                <strong>ব্যবহার / উদাহরণ: </strong>
                {activeHormone.example}
              </p>
            </div>
          </div>

          {/* Phototropism Visual SVG */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-center gap-2">
              {(['left', 'top', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setLightDirection(dir)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    lightDirection === dir
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dir === 'left' ? 'বাম আলো' : dir === 'top' ? 'উপরের আলো' : 'ডান আলো'}
                </button>
              ))}
            </div>

            <svg
              viewBox="0 0 220 190"
              className="w-full max-w-[220px] mx-auto h-auto"
              role="img"
              aria-label="উদ্ভিদের ফটোট্রপিজম সিমুলেশন"
            >
              {/* Sun */}
              <circle
                cx={sunPos.cx}
                cy={sunPos.cy}
                r="14"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="2"
              />

              {/* Pot */}
              <polygon
                points="82,155 138,155 130,182 90,182"
                fill="#b45309"
                stroke="#78350f"
                strokeWidth="2"
              />

              {/* Bending Stem */}
              <path
                d={getStemCurve()}
                stroke="#15803d"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              <text
                x="110"
                y="188"
                textAnchor="middle"
                className="fill-slate-600 text-[9px] font-bold"
              >
                কাণ্ড সবসময় আলোর দিকে বেঁকে যায় (ধনাত্মক ফটোট্রপিজম)
              </text>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}