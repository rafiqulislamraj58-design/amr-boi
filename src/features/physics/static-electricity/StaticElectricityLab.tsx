
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  BatteryCharging,
  BookOpen,
  Calculator,
  CheckCircle2,
  Info,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

const COULOMB_K = 9e9;

const DEFAULTS = {
  q1: 4,
  q2: -4,
  distance: 2,
  work: 60,
  charge: 4,
};

const formatNumber = (value: number, digits = 3) => {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
  });
};

const formatForce = (value: number) => {
  if (value === 0) return '0 N';
  if (value >= 1) return `${formatNumber(value)} N`;
  if (value >= 0.001) return `${formatNumber(value * 1000, 2)} mN`;
  return `${value.toExponential(2)} N`;
};

const chargeColor = (value: number) => {
  if (value > 0) return '#e11d48';
  if (value < 0) return '#2563eb';
  return '#64748b';
};

export default function StaticElectricityLab() {
  // Coulomb's Law
  const [q1Micro, setQ1Micro] = useState(DEFAULTS.q1);
  const [q2Micro, setQ2Micro] = useState(DEFAULTS.q2);
  const [distance, setDistance] = useState(DEFAULTS.distance);

  // Electric Potential
  const [workJoules, setWorkJoules] = useState(DEFAULTS.work);
  const [testCharge, setTestCharge] = useState(DEFAULTS.charge);

  // Educational tabs
  const [activeTab, setActiveTab] = useState<'force' | 'field' | 'potential'>(
    'force'
  );

  // Calculations
  const result = useMemo(() => {
    const q1 = q1Micro * 1e-6;
    const q2 = q2Micro * 1e-6;

    const product = q1Micro * q2Micro;

    const force =
      (COULOMB_K * Math.abs(q1 * q2)) /
      (distance * distance);

    // Electric field produced by q1 at q2's position.
    const electricField =
      (COULOMB_K * Math.abs(q1)) /
      (distance * distance);

    // Electric potential difference (magnitude).
    const potential = workJoules / testCharge;

    const interaction =
      product === 0
        ? 'neutral'
        : product > 0
          ? 'repel'
          : 'attract';

    return {
      q1,
      q2,
      force,
      electricField,
      potential,
      interaction,
    };
  }, [q1Micro, q2Micro, distance, workJoules, testCharge]);

  const interactionLabel = {
    attract: 'আকর্ষণ বল',
    repel: 'বিকর্ষণ বল',
    neutral: 'কোনো কুলম্ব বল নেই',
  }[result.interaction];

  // SVG visualization
  const svgW = 580;
  const svgH = 230;
  const midY = 105;
  const centerX = svgW / 2;

  const pixelSep =
    110 + ((distance - 0.5) / 4.5) * 270;

  const x1 = centerX - pixelSep / 2;
  const x2 = centerX + pixelSep / 2;

  const arrowLen = Math.min(
    65,
    Math.max(25, Math.log10(result.force * 1000 + 1) * 25)
  );

  const reset = () => {
    setQ1Micro(DEFAULTS.q1);
    setQ2Micro(DEFAULTS.q2);
    setDistance(DEFAULTS.distance);
    setWorkJoules(DEFAULTS.work);
    setTestCharge(DEFAULTS.charge);
    setActiveTab('force');
  };

  const applyPreset = (
    q1: number,
    q2: number,
    d: number
  ) => {
    setQ1Micro(q1);
    setQ2Micro(q2);
    setDistance(d);
  };

  const presets = [
    {
      label: 'আকর্ষণ',
      description: '+4, -4 µC',
      q1: 4,
      q2: -4,
      d: 2,
      color: 'emerald',
    },
    {
      label: 'বিকর্ষণ',
      description: '+5, +5 µC',
      q1: 5,
      q2: 5,
      d: 2,
      color: 'rose',
    },
    {
      label: 'শূন্য আধান',
      description: '0, +5 µC',
      q1: 0,
      q2: 5,
      d: 2,
      color: 'slate',
    },
  ];

  return (
    <div className="space-y-6 text-slate-800">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="space-y-2">

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-extrabold tracking-wide text-blue-700">
            <Activity className="w-4 h-4" />
            SSC PHYSICS • CHAPTER 10
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            স্থির বিদ্যুৎ: ইন্টারঅ্যাকটিভ ল্যাব
          </h2>

          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
            আধান, কুলম্বের বল, তড়িৎ ক্ষেত্রের প্রাবল্য এবং
            তড়িৎ বিভব সম্পর্কে হাতে-কলমে শেখো।
          </p>

        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          রিসেট
        </button>

      </div>

      {/* =====================================
          LEARNING OBJECTIVES
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {[
          {
            icon: Zap,
            title: 'তড়িৎ বল',
            subtitle: 'কুলম্বের সূত্র',
            color: 'blue',
          },
          {
            icon: Activity,
            title: 'তড়িৎ ক্ষেত্র',
            subtitle: 'প্রাবল্য নির্ণয়',
            color: 'violet',
          },
          {
            icon: BatteryCharging,
            title: 'তড়িৎ বিভব',
            subtitle: 'কাজ ও আধান',
            color: 'emerald',
          },
        ].map((item) => {
          const Icon = item.icon;

          const colors = {
            blue: 'bg-blue-50 text-blue-600',
            violet: 'bg-violet-50 text-violet-600',
            emerald: 'bg-emerald-50 text-emerald-600',
          };

          return (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div className={`p-2.5 rounded-lg ${colors[item.color as keyof typeof colors]}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <p className="font-bold text-sm text-slate-800">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* =====================================
          COULOMB SIMULATOR
      ====================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Zap className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900">
                কুলম্বের সূত্র সিমুলেটর
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                আধান ও দূরত্ব পরিবর্তন করে বল পর্যবেক্ষণ করো।
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
              result.interaction === 'attract'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : result.interaction === 'repel'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {interactionLabel}
          </span>

        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* SVG VISUALIZATION */}

          <div className="lg:col-span-7 space-y-4">

            <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">

              <div className="px-3 py-2.5 flex items-center justify-between border-b border-slate-200 bg-white/70">
                <span className="text-xs font-bold text-slate-600">
                  আধানের পারস্পরিক ক্রিয়া
                </span>

                <span className="text-[10px] text-slate-400 font-semibold">
                  LIVE SIMULATION
                </span>
              </div>

              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full h-auto block"
                role="img"
                aria-label="দুটি আধানের মধ্যে আকর্ষণ ও বিকর্ষণ বলের চিত্র"
              >

                <defs>
                  <marker
                    id="force-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L6,3 z"
                      fill={result.interaction === 'attract' ? '#059669' : '#e11d48'}
                    />
                  </marker>
                </defs>

                {/* Connecting line */}

                <line
                  x1={x1}
                  y1={midY}
                  x2={x2}
                  y2={midY}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />

                {/* Force arrows */}

                {result.interaction !== 'neutral' && (
                  <g
                    stroke={result.interaction === 'attract' ? '#059669' : '#e11d48'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#force-arrow)"
                  >

                    {result.interaction === 'attract' ? (
                      <>
                        <line
                          x1={x1 + 28}
                          y1={midY}
                          x2={x1 + 28 + arrowLen}
                          y2={midY}
                        />

                        <line
                          x1={x2 - 28}
                          y1={midY}
                          x2={x2 - 28 - arrowLen}
                          y2={midY}
                        />
                      </>
                    ) : (
                      <>
                        <line
                          x1={x1 - 28}
                          y1={midY}
                          x2={Math.max(10, x1 - 28 - arrowLen)}
                          y2={midY}
                        />

                        <line
                          x1={x2 + 28}
                          y1={midY}
                          x2={Math.min(svgW - 10, x2 + 28 + arrowLen)}
                          y2={midY}
                        />
                      </>
                    )}

                  </g>
                )}

                {/* Charge 1 */}

                <circle
                  cx={x1}
                  cy={midY}
                  r="25"
                  fill={chargeColor(q1Micro)}
                  stroke="white"
                  strokeWidth="3"
                />

                <text
                  x={x1}
                  y={midY + 6}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="white"
                >
                  {q1Micro > 0 ? `+${q1Micro}` : q1Micro}
                </text>

                <text
                  x={x1}
                  y={midY - 38}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#334155"
                >
                  q₁
                </text>

                {/* Charge 2 */}

                <circle
                  cx={x2}
                  cy={midY}
                  r="25"
                  fill={chargeColor(q2Micro)}
                  stroke="white"
                  strokeWidth="3"
                />

                <text
                  x={x2}
                  y={midY + 6}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="white"
                >
                  {q2Micro > 0 ? `+${q2Micro}` : q2Micro}
                </text>

                <text
                  x={x2}
                  y={midY - 38}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#334155"
                >
                  q₂
                </text>

                {/* Distance indicator */}

                <line
                  x1={x1}
                  y1={midY + 55}
                  x2={x2}
                  y2={midY + 55}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                <line
                  x1={x1}
                  y1={midY + 49}
                  x2={x1}
                  y2={midY + 61}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                <line
                  x1={x2}
                  y1={midY + 49}
                  x2={x2}
                  y2={midY + 61}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                <text
                  x={centerX}
                  y={midY + 78}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#334155"
                >
                  d = {distance.toFixed(1)} m
                </text>

                <text
                  x={centerX}
                  y={midY + 104}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {interactionLabel}
                </text>

              </svg>

              <div className="flex flex-wrap justify-center gap-4 px-3 py-2.5 bg-white border-t border-slate-200">

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  ধনাত্মক (+)
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  ঋণাত্মক (-)
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  নিরপেক্ষ (0)
                </span>

              </div>

            </div>

            {/* PRESETS */}

            <div className="space-y-2">

              <p className="text-xs font-bold text-slate-600">
                দ্রুত পরীক্ষা করো
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      applyPreset(preset.q1, preset.q2, preset.d)
                    }
                    className={`p-3 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${
                      preset.color === 'emerald'
                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : preset.color === 'rose'
                          ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-slate-800">
                      {preset.label}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {preset.description}
                    </p>
                  </button>
                ))}

              </div>

            </div>

          </div>

          {/* CONTROLS */}

          <div className="lg:col-span-5 space-y-5">

            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-800">
                আধান ও দূরত্ব নিয়ন্ত্রণ
              </h4>
            </div>

            {/* Q1 */}

            <div className="space-y-2">

              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600">
                  প্রথম আধান (q₁)
                </label>

                <span className="text-sm font-extrabold tabular-nums" style={{ color: chargeColor(q1Micro) }}>
                  {q1Micro > 0 ? '+' : ''}{q1Micro} µC
                </span>
              </div>

              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={q1Micro}
                onChange={(e) => setQ1Micro(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
                aria-label="প্রথম আধান"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10 µC</span>
                <span>0</span>
                <span>+10 µC</span>
              </div>

            </div>

            <div className="h-px bg-slate-100" />

            {/* Q2 */}

            <div className="space-y-2">

              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600">
                  দ্বিতীয় আধান (q₂)
                </label>

                <span className="text-sm font-extrabold tabular-nums" style={{ color: chargeColor(q2Micro) }}>
                  {q2Micro > 0 ? '+' : ''}{q2Micro} µC
                </span>
              </div>

              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={q2Micro}
                onChange={(e) => setQ2Micro(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
                aria-label="দ্বিতীয় আধান"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10 µC</span>
                <span>0</span>
                <span>+10 µC</span>
              </div>

            </div>

            <div className="h-px bg-slate-100" />

            {/* DISTANCE */}

            <div className="space-y-2">

              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600">
                  মধ্যবর্তী দূরত্ব (d)
                </label>

                <span className="text-sm font-extrabold text-slate-900">
                  {distance.toFixed(1)} m
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
                aria-label="আধানের মধ্যবর্তী দূরত্ব"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5 m</span>
                <span>5.0 m</span>
              </div>

            </div>

            {/* LIVE RESULTS */}

            <div className="space-y-2 pt-1">

              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3.5">
                <p className="text-[11px] font-bold text-blue-700">
                  তড়িৎ বলের মান (F)
                </p>

                <p className="text-xl font-black text-slate-900 mt-1 tabular-nums">
                  {formatForce(result.force)}
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  একক: নিউটন (N)
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 border border-violet-200 p-3.5">
                <p className="text-[11px] font-bold text-violet-700">
                  q₂ বিন্দুতে q₁-এর তড়িৎ ক্ষেত্রের প্রাবল্য (E)
                </p>

                <p className="text-xl font-black text-slate-900 mt-1 tabular-nums">
                  {formatNumber(result.electricField, 2)} N/C
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  একক: নিউটন/কুলম্ব (N/C)
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          FORMULA LEARNING SECTION
      ====================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />

          <div>
            <h3 className="font-extrabold text-slate-900">
              গুরুত্বপূর্ণ সূত্র ও ব্যাখ্যা
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              স্থির বিদ্যুৎ অধ্যায়ের প্রয়োজনীয় সূত্রগুলো
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <button
            type="button"
            onClick={() => setActiveTab('force')}
            className={`rounded-xl p-3.5 text-left border transition-all ${
              activeTab === 'force'
                ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-100'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <p className="text-xs font-bold text-slate-600">
              কুলম্বের সূত্র
            </p>

            <p className="text-lg font-black text-blue-700 mt-2">
              F = k|q₁q₂| / r²
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('field')}
            className={`rounded-xl p-3.5 text-left border transition-all ${
              activeTab === 'field'
                ? 'bg-violet-50 border-violet-300 ring-1 ring-violet-100'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <p className="text-xs font-bold text-slate-600">
              তড়িৎ ক্ষেত্রের প্রাবল্য
            </p>

            <p className="text-lg font-black text-violet-700 mt-2">
              E = F / q₀
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('potential')}
            className={`rounded-xl p-3.5 text-left border transition-all ${
              activeTab === 'potential'
                ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-100'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <p className="text-xs font-bold text-slate-600">
              তড়িৎ বিভব
            </p>

            <p className="text-lg font-black text-emerald-700 mt-2">
              V = W / q
            </p>
          </button>

        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

          {activeTab === 'force' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-blue-800">
                কুলম্বের সূত্র
              </h4>

              <p className="text-sm leading-relaxed text-slate-600">
                দুটি স্থির বিন্দু আধানের মধ্যবর্তী তড়িৎ বলের মান
                আধান দুটির মানের গুণফলের সমানুপাতিক এবং
                তাদের মধ্যবর্তী দূরত্বের বর্গের ব্যস্তানুপাতিক।
              </p>

              <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-1">
                <p className="font-bold text-lg text-slate-900">
                  F = k|q₁q₂| / r²
                </p>
                <p className="text-xs text-slate-500">
                  k = 9 × 10⁹ N·m²/C² (বায়ু বা শূন্যস্থানে প্রায়)
                </p>
              </div>

              <p className="text-xs text-slate-500">
                সমধর্মী আধান বিকর্ষণ করে এবং বিপরীতধর্মী আধান আকর্ষণ করে।
              </p>
            </div>
          )}

          {activeTab === 'field' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-violet-800">
                তড়িৎ ক্ষেত্রের প্রাবল্য
              </h4>

              <p className="text-sm leading-relaxed text-slate-600">
                কোনো তড়িৎ ক্ষেত্রে একটি একক ধনাত্মক পরীক্ষণ আধান
                যে বল অনুভব করে, তাকে ঐ বিন্দুর তড়িৎ ক্ষেত্রের প্রাবল্য বলে।
              </p>

              <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-1">
                <p className="font-bold text-lg text-slate-900">
                  E = F / q₀
                </p>
                <p className="text-xs text-slate-500">
                  বিন্দু আধানের ক্ষেত্রে: E = k|Q| / r²
                </p>
              </div>

              <p className="text-xs text-slate-500">
                SI একক: N/C। ক্ষেত্রের দিক নির্ধারিত হয় ধনাত্মক
                পরীক্ষণ আধানের উপর ক্রিয়াশীল বলের দিক দিয়ে।
              </p>
            </div>
          )}

          {activeTab === 'potential' && (
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-emerald-800">
                তড়িৎ বিভব
              </h4>

              <p className="text-sm leading-relaxed text-slate-600">
                অসীম দূরত্ব থেকে একক ধনাত্মক আধানকে কোনো বিন্দুতে
                আনতে যে কাজ করতে হয়, তাকে ঐ বিন্দুর তড়িৎ বিভব বলে।
              </p>

              <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-1">
                <p className="font-bold text-lg text-slate-900">
                  V = W / q
                </p>
                <p className="text-xs text-slate-500">
                  একক: ভোল্ট (V) = জুল/কুলম্ব (J/C)
                </p>
              </div>

              <p className="text-xs text-slate-500">
                বিন্দু আধানের জন্য: V = kQ / r
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =====================================
          ELECTRIC POTENTIAL CALCULATOR
      ====================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5">

        <div className="flex items-center gap-3">

          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <BatteryCharging className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              তড়িৎ বিভব ক্যালকুলেটর
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              কাজ ও আধান পরিবর্তন করে বিভব নির্ণয় করো।
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

          <div className="md:col-span-7 space-y-5">

            {/* WORK */}

            <div className="space-y-2">

              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600">
                  সম্পাদিত কাজ (W)
                </label>

                <span className="text-sm font-extrabold text-emerald-700">
                  {workJoules} J
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={workJoules}
                onChange={(e) => setWorkJoules(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
                aria-label="সম্পাদিত কাজ"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 J</span>
                <span>200 J</span>
              </div>

            </div>

            {/* CHARGE */}

            <div className="space-y-2">

              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600">
                  স্থানান্তরিত আধান (q)
                </label>

                <span className="text-sm font-extrabold text-emerald-700">
                  {testCharge} C
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={testCharge}
                onChange={(e) => setTestCharge(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
                aria-label="স্থানান্তরিত আধান"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 C</span>
                <span>20 C</span>
              </div>

            </div>

          </div>

          {/* RESULT */}

          <div className="md:col-span-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-2">

            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">
                নির্ণীত তড়িৎ বিভব
              </span>
            </div>

            <p className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
              {result.potential.toFixed(2)} V
            </p>

            <div className="h-px bg-emerald-200" />

            <p className="text-xs text-slate-600 leading-relaxed">
              প্রতি ১ কুলম্ব আধান স্থানান্তর করতে
              {result.potential.toFixed(2)} জুল কাজ প্রয়োজন
              (কাজের মানের ভিত্তিতে)।
            </p>

            <div className="rounded-lg bg-white/70 p-2.5">
              <p className="text-xs font-bold text-emerald-800">
                V = W / q
              </p>
              <p className="text-xs text-slate-600 mt-1">
                = {workJoules} / {testCharge}
                {' = '}
                {result.potential.toFixed(2)} V
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          NUMERICAL EXAMPLE
      ====================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">

        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600" />

          <h3 className="font-extrabold text-slate-900">
            গাণিতিক উদাহরণ (SSC)
          </h3>
        </div>

        <div className="rounded-xl bg-violet-50/70 border border-violet-200 p-4 space-y-3">

          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            প্রশ্ন: দুটি আধানের মান যথাক্রমে +4 µC ও -4 µC।
            তাদের মধ্যবর্তী দূরত্ব 2 m হলে আধান দুটির
            মধ্যবর্তী তড়িৎ বল নির্ণয় করো।
          </p>

          <div className="space-y-2">

            <div>
              <p className="text-xs font-extrabold text-violet-800">
                দেওয়া আছে
              </p>

              <p className="text-sm text-slate-600 mt-1">
                q₁ = +4 × 10⁻⁶ C
              </p>

              <p className="text-sm text-slate-600">
                q₂ = -4 × 10⁻⁶ C
              </p>

              <p className="text-sm text-slate-600">
                r = 2 m
              </p>

              <p className="text-sm text-slate-600">
                k = 9 × 10⁹ N·m²/C²
              </p>
            </div>

            <div className="h-px bg-violet-200" />

            <div>
              <p className="text-xs font-extrabold text-violet-800">
                সূত্র
              </p>

              <p className="text-base font-bold text-slate-800 mt-1">
                F = k|q₁q₂| / r²
              </p>
            </div>

            <div className="h-px bg-violet-200" />

            <div>
              <p className="text-xs font-extrabold text-violet-800">
                সমাধান
              </p>

              <p className="text-sm text-slate-600 mt-1">
                = (9 × 10⁹ × 4 × 10⁻⁶ × 4 × 10⁻⁶) / 2²
              </p>

              <p className="text-sm text-slate-600">
                = 144 × 10⁻³ / 4
              </p>

              <p className="text-sm text-slate-600">
                = 0.036 N
              </p>
            </div>

            <div className="rounded-lg bg-white border border-violet-200 p-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

              <div>
                <p className="text-xs font-bold text-slate-500">
                  চূড়ান্ত উত্তর
                </p>

                <p className="font-black text-lg text-emerald-700">
                  F = 0.036 N (আকর্ষণ বল)
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          LEARNING NOTES
      ====================================== */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">

          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />

            <h4 className="font-extrabold text-sm text-amber-900">
              মনে রাখবে
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-amber-950 leading-relaxed">
            <li>• সমধর্মী আধান পরস্পরকে বিকর্ষণ করে।</li>
            <li>• বিপরীতধর্মী আধান পরস্পরকে আকর্ষণ করে।</li>
            <li>• দূরত্ব দ্বিগুণ হলে বল এক-চতুর্থাংশ হয়।</li>
            <li>• আধান দ্বিগুণ হলে অপর আধান ও দূরত্ব অপরিবর্তিত থাকলে বল দ্বিগুণ হয়।</li>
          </ul>

        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-2">

          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />

            <h4 className="font-extrabold text-sm text-blue-900">
              একক ও প্রতীক
            </h4>
          </div>

          <div className="space-y-1.5 text-xs text-blue-950">

            <div className="flex justify-between">
              <span>আধান (Charge)</span>
              <strong>কুলম্ব (C)</strong>
            </div>

            <div className="flex justify-between">
              <span>তড়িৎ বল (Force)</span>
              <strong>নিউটন (N)</strong>
            </div>

            <div className="flex justify-between">
              <span>তড়িৎ ক্ষেত্র (E)</span>
              <strong>N/C</strong>
            </div>

            <div className="flex justify-between">
              <span>কাজ (Work)</span>
              <strong>জুল (J)</strong>
            </div>

            <div className="flex justify-between">
              <span>তড়িৎ বিভব (V)</span>
              <strong>ভোল্ট (V)</strong>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          DISTANCE RULE
      ====================================== */}

      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white">

        <div className="flex items-start gap-3">

          <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />

          <div className="space-y-2">

            <h4 className="font-extrabold text-sm">
              কুলম্বের সূত্রের বিশেষ সম্পর্ক
            </h4>

            <p className="text-xs text-blue-100 leading-relaxed">
              F ∝ 1/r² অর্থাৎ তড়িৎ বল দূরত্বের বর্গের ব্যস্তানুপাতিক।
              তাই দূরত্ব ২ গুণ হলে বল ১/৪ গুণ,
              দূরত্ব ৩ গুণ হলে বল ১/৯ গুণ হয়।
            </p>

            <div className="flex flex-wrap gap-2 pt-1">

              <span className="px-3 py-1.5 rounded-lg bg-white/15 text-xs font-bold">
                r → 2r
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-white/15 text-xs font-bold">
                F → F/4
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-white/15 text-xs font-bold">
                r → 3r
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-white/15 text-xs font-bold">
                F → F/9
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
