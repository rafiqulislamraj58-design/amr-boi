'use client';

import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Info,
  Leaf,
  RotateCcw,
  Sun,
  Thermometer,
  Zap,
} from 'lucide-react';

type LightColor = 'red' | 'blue' | 'white' | 'green';

interface LightOption {
  id: LightColor;
  labelBn: string;
  efficiency: number;
  swatch: string;
  note: string;
}

const LIGHT_OPTIONS: LightOption[] = [
  {
    id: 'red',
    labelBn: 'লাল আলো',
    efficiency: 1.0,
    swatch: '#ef4444',
    note: 'ক্লোরোফিল লাল আলো সবচেয়ে বেশি শোষণ করে (সর্বাধিক হার)।',
  },
  {
    id: 'blue',
    labelBn: 'নীল আলো',
    efficiency: 0.92,
    swatch: '#3b82f6',
    note: 'নীল আলোতেও সালোকসংশ্লেষণের হার অত্যন্ত বেশি।',
  },
  {
    id: 'white',
    labelBn: 'সাদা (সূর্যালোক)',
    efficiency: 0.85,
    swatch: '#eab308',
    note: 'প্রাকৃতিক সূর্যালোকে সব বর্ণালী থাকায় ভালো হারে ঘটে।',
  },
  {
    id: 'green',
    labelBn: 'সবুজ আলো',
    efficiency: 0.15,
    swatch: '#22c55e',
    note: 'সবুজ আলো পাতা প্রতিফলিত করে, তাই শোষণ ও হার সবচেয়ে কম।',
  },
];

export default function BioenergeticsLab() {
  // Section 1: Photosynthesis Rate Simulator
  const [lightIntensity, setLightIntensity] = useState<number>(75);
  const [temperature, setTemperature] = useState<number>(28);
  const [co2Level, setCo2Level] = useState<number>(60);
  const [lightColor, setLightColor] = useState<LightColor>('red');

  // Section 2: Respiration ATP & Energy Calculator
  const [glucoseCount, setGlucoseCount] = useState<number>(1);

  const selectedLight =
    LIGHT_OPTIONS.find((l) => l.id === lightColor) ?? LIGHT_OPTIONS[0];

  // Temperature factor: optimal 22–35°C, drops sharply below 10°C or above 42°C
  const getTempFactor = (t: number) => {
    if (t < 5 || t > 48) return 0.05;
    if (t >= 22 && t <= 35) return 1.0;
    if (t < 22) return Math.max(0.1, (t - 5) / 17);
    return Math.max(0.1, (48 - t) / 13);
  };

  const lightFactor = Math.min(1, lightIntensity / 85);
  const co2Factor = co2Level > 90 ? 0.75 : Math.min(1, co2Level / 70);
  const tempFactor = getTempFactor(temperature);

  const photosynthesisRate = Math.round(
    100 * lightFactor * co2Factor * tempFactor * selectedLight.efficiency,
  );

  const bubbleCount = Math.max(1, Math.round(photosynthesisRate / 12));

  const getRateStatus = () => {
    if (temperature > 42) {
      return {
        text: 'অতিরিক্ত তাপমাত্রায় এনজাইম নষ্ট হচ্ছে!',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
    if (photosynthesisRate >= 75) {
      return {
        text: 'অনুকূল অবস্থা — সর্বোচ্চ O₂ উৎপাদন',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (photosynthesisRate >= 35) {
      return {
        text: 'মাঝারি হারে সালোকসংশ্লেষণ চলছে',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      text: 'অত্যন্ত ধীরগতি (সীমাবদ্ধ প্রভাবক)',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  };

  const rateStatus = getRateStatus();

  // Respiration Calculations
  const aerobicAtp = glucoseCount * 38;
  const aerobicKcal = glucoseCount * 686;
  const anaerobicAtp = glucoseCount * 2;
  const anaerobicKcal = glucoseCount * 56;
  const atpDifference = aerobicAtp - anaerobicAtp;

  const handleReset = () => {
    setLightIntensity(75);
    setTemperature(28);
    setCo2Level(60);
    setLightColor('red');
    setGlucoseCount(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE BIOENERGETICS LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            সালোকসংশ্লেষণ সিমুলেটর ও শ্বসন ATP ক্যালকুলেটর
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            আলো, তাপমাত্রা ও CO₂ পরিবর্তন করে সালোকসংশ্লেষণের হার পর্যবেক্ষণ করো এবং সবাত ও অবাত শ্বসনে উৎপন্ন ATP তুলনা করো।
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

      {/* Section 1: Photosynthesis Rate Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              সালোকসংশ্লেষণ হার সিমুলেটর (অক্সিজেন বুদবুদ পরীক্ষা)
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${rateStatus.className}`}
          >
            {rateStatus.text}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            {/* Light Color Selector */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">আলোর রঙ নির্বাচন করো:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LIGHT_OPTIONS.map((opt) => {
                  const isActive = opt.id === lightColor;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLightColor(opt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: opt.swatch }}
                      />
                      {opt.labelBn}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">{selectedLight.note}</p>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    আলোর তীব্রতা
                  </span>
                  <span className="font-mono text-teal-700">{lightIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    তাপমাত্রা (অনুকূল: 22–35°C)
                  </span>
                  <span className="font-mono text-teal-700">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>CO₂ ঘনমাত্রা</span>
                  <span className="font-mono text-teal-700">{co2Level}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={co2Level}
                  onChange={(e) => setCo2Level(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Visual Beaker + O2 Bubbles */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
            <svg
              viewBox="0 0 220 190"
              className="w-full max-w-[220px] h-auto"
              role="img"
              aria-label="সালোকসংশ্লেষণ অক্সিজেন বুদবুদ পরীক্ষা"
            >
              {/* Light Rays */}
              <g
                stroke={selectedLight.swatch}
                strokeWidth="2.5"
                opacity={Math.max(0.15, lightIntensity / 100)}
              >
                <line x1="30" y1="12" x2="65" y2="48" />
                <line x1="55" y1="8" x2="85" y2="44" />
                <line x1="80" y1="12" x2="105" y2="44" />
              </g>

              {/* Water Beaker */}
              <rect
                x="45"
                y="45"
                width="130"
                height="130"
                rx="12"
                fill="#e0f2fe"
                stroke="#0284c7"
                strokeWidth="2.5"
              />

              {/* Aquatic Plant (Hydrilla) */}
              <g fill="#10b981" stroke="#047857" strokeWidth="1.5">
                <line x1="110" y1="168" x2="110" y2="108" strokeWidth="3" />
                <ellipse cx="95" cy="148" rx="14" ry="6" transform="rotate(-20 95 148)" />
                <ellipse cx="125" cy="142" rx="14" ry="6" transform="rotate(20 125 142)" />
                <ellipse cx="96" cy="126" rx="13" ry="5.5" transform="rotate(-25 96 126)" />
                <ellipse cx="124" cy="120" rx="13" ry="5.5" transform="rotate(25 124 120)" />
              </g>

              {/* O2 Bubbles based on photosynthesisRate */}
              {Array.from({ length: bubbleCount }).map((_, idx) => {
                const cx = 92 + ((idx * 17) % 38);
                const cy = 100 - idx * 6.5;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={Math.max(54, cy)}
                    r={3.5 + (idx % 2)}
                    fill="#ffffff"
                    stroke="#0ea5e9"
                    strokeWidth="1.2"
                  />
                );
              })}

              <text
                x="110"
                y="186"
                textAnchor="middle"
                className="fill-slate-600 text-[10px] font-bold"
              >
                হাইড্রিলা উদ্ভিদ — O₂ বুদবুদ নির্গমন
              </text>
            </svg>

            <div className="w-full p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                সালোকসংশ্লেষণের হার:
              </span>
              <span className="text-xl font-extrabold text-teal-700 font-mono">
                {photosynthesisRate}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Aerobic vs Anaerobic Respiration ATP Calculator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              সবাত বনাম অবাত শ্বসন: ATP ও শক্তি ক্যালকুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            গ্লুকোজ (C₆H₁₂O₆): {glucoseCount} অণু
          </span>
        </div>

        {/* Glucose Slider */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 shrink-0">
            গ্লুকোজ অণুর সংখ্যা:
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={glucoseCount}
            onChange={(e) => setGlucoseCount(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <span className="font-mono text-base font-extrabold text-teal-700 w-8 text-right">
            {glucoseCount}
          </span>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aerobic */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-emerald-950 text-base flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                সবাত শ্বসন (O₂ উপস্থিত)
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-200">
                সম্পূর্ণ জারণ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-white border border-emerald-100">
                <p className="text-[11px] font-bold text-slate-500">মোট ATP</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-0.5 font-mono">
                  {aerobicAtp}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-100">
                <p className="text-[11px] font-bold text-slate-500">মুক্ত শক্তি</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-0.5 font-mono">
                  {aerobicKcal} <span className="text-xs">kcal</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              ধাপ: গ্লাইকোলাইসিস (সাইটোপ্লাজম) → অ্যাসিটাইল কো-এ → ক্রেবস চক্র ও ETS (মাইটোকন্ড্রিয়া)। উৎপন্ন হয় CO₂ ও H₂O।
            </p>
          </div>

          {/* Anaerobic */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                অবাত শ্বসন (O₂ অনুপস্থিত)
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-amber-700 border border-amber-200">
                অসম্পূর্ণ জারণ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <p className="text-[11px] font-bold text-slate-500">মোট ATP</p>
                <p className="text-2xl font-extrabold text-amber-700 mt-0.5 font-mono">
                  {anaerobicAtp}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <p className="text-[11px] font-bold text-slate-500">মুক্ত শক্তি</p>
                <p className="text-2xl font-extrabold text-amber-700 mt-0.5 font-mono">
                  {anaerobicKcal} <span className="text-xs">kcal</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              ধাপ: গ্লাইকোলাইসিস ও পাইরুভিক এসিডের অসম্পূর্ণ জারণ (সাইটোপ্লাজম)। উৎপন্ন হয় ইথাইল অ্যালকোহল বা ল্যাকটিক এসিড।
            </p>
          </div>
        </div>

        {/* Summary Insight */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-700">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            {glucoseCount} অণু গ্লুকোজ থেকে অবাত শ্বসনের তুলনায় সবাত শ্বসনে{' '}
            <strong className="text-teal-700">{atpDifference}টি বেশি ATP</strong>{' '}
            (১৯ গুণ বেশি শক্তি) উৎপন্ন হয়।
          </span>
        </div>
      </section>
    </div>
  );
}