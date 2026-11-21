
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Flame,
  Info,
  Lightbulb,
  Pause,
  Play,
  Power,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ReactionBondPreset {
  id: string;
  name: string;
  equation: string;
  reactantBonds: { label: string; count: number; energy: number }[];
  productBonds: { label: string; count: number; energy: number }[];
  note: string;
}

const REACTION_PRESETS: ReactionBondPreset[] = [
  {
    id: 'hcl',
    name: 'HCl গঠন',
    equation: 'H₂(g) + Cl₂(g) → 2HCl(g)',
    reactantBonds: [
      { label: 'H–H', count: 1, energy: 435 },
      { label: 'Cl–Cl', count: 1, energy: 244 },
    ],
    productBonds: [{ label: 'H–Cl', count: 2, energy: 431 }],
    note: 'নতুন বন্ধন গঠনের সময় বেশি শক্তি নির্গত হওয়ায় বিক্রিয়াটি তাপোৎপাদী।',
  },
  {
    id: 'ch4',
    name: 'মিথেনের দহন',
    equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)',
    reactantBonds: [
      { label: 'C–H', count: 4, energy: 414 },
      { label: 'O=O', count: 2, energy: 498 },
    ],
    productBonds: [
      { label: 'C=O', count: 2, energy: 799 },
      { label: 'O–H', count: 4, energy: 464 },
    ],
    note: 'মিথেনের দহনে প্রচুর তাপশক্তি উৎপন্ন হয়। এখানে বন্ধন শক্তির মান আনুমানিক।',
  },
  {
    id: 'nh3',
    name: 'অ্যামোনিয়া উৎপাদন',
    equation: 'N₂(g) + 3H₂(g) → 2NH₃(g)',
    reactantBonds: [
      { label: 'N≡N', count: 1, energy: 946 },
      { label: 'H–H', count: 3, energy: 435 },
    ],
    productBonds: [{ label: 'N–H', count: 6, energy: 391 }],
    note: 'হেবার প্রক্রিয়ায় অ্যামোনিয়া উৎপাদনের বিক্রিয়াটি তাপোৎপাদী।',
  },
  {
    id: 'no',
    name: 'নাইট্রিক অক্সাইড গঠন',
    equation: 'N₂(g) + O₂(g) → 2NO(g)',
    reactantBonds: [
      { label: 'N≡N', count: 1, energy: 946 },
      { label: 'O=O', count: 1, energy: 498 },
    ],
    productBonds: [{ label: 'N=O', count: 2, energy: 632 }],
    note: 'বন্ধন ভাঙতে বেশি শক্তি প্রয়োজন হওয়ায় বিক্রিয়াটি তাপহারী।',
  },
];

const formatEnergy = (value: number) =>
  `${value > 0 ? '+' : ''}${value.toLocaleString('en-US')}`;

export default function ChemistryAndEnergyLab() {
  const [selectedPresetId, setSelectedPresetId] = useState('hcl');
  const [circuitClosed, setCircuitClosed] = useState(true);
  const [hasSaltBridge, setHasSaltBridge] = useState(true);
  const [electronOffset, setElectronOffset] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);

  const activePreset = useMemo(
    () =>
      REACTION_PRESETS.find((preset) => preset.id === selectedPresetId) ??
      REACTION_PRESETS[0],
    [selectedPresetId],
  );

  // Bond energy calculation
  const b1 = useMemo(
    () =>
      activePreset.reactantBonds.reduce(
        (sum, bond) => sum + bond.count * bond.energy,
        0,
      ),
    [activePreset],
  );

  const b2 = useMemo(
    () =>
      activePreset.productBonds.reduce(
        (sum, bond) => sum + bond.count * bond.energy,
        0,
      ),
    [activePreset],
  );

  const deltaH = b1 - b2;
  const isExothermic = deltaH < 0;
  const isEndothermic = deltaH > 0;

  // Daniell cell conditions
  const isCellRunning = circuitClosed && hasSaltBridge;

  // Open-circuit voltage remains when the switch is open.
  // Without a salt bridge, the cell cannot maintain its operation.
  const cellVoltage = hasSaltBridge ? 1.1 : 0;
  const currentFlow = isCellRunning;

  useEffect(() => {
    if (!currentFlow) return;

    let animationId = 0;

    const animate = () => {
      setElectronOffset((previous) => (previous - 1.2) % 24);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [currentFlow]);

  const handleReset = () => {
    setSelectedPresetId('hcl');
    setCircuitClosed(true);
    setHasSaltBridge(true);
    setElectronOffset(0);
    setShowExplanation(true);
  };

  const cellStatus = !hasSaltBridge
    ? 'কোষ নিষ্ক্রিয়'
    : circuitClosed
      ? 'বিদ্যুৎ প্রবাহ চলছে'
      : 'সার্কিট খোলা';

  const cellDescription = !hasSaltBridge
    ? 'লবণ সেতু বিচ্ছিন্ন। আয়নের চলাচল বাধাগ্রস্ত হওয়ায় কোষের কার্যকর বিদ্যুৎ উৎপাদন বন্ধ।'
    : !circuitClosed
      ? 'সুইচ খোলা থাকায় বাহ্যিক বর্তনী দিয়ে ইলেকট্রন প্রবাহিত হচ্ছে না। তবে কোষের open-circuit voltage প্রায় 1.10 V।'
      : 'জিংক ইলেকট্রন ত্যাগ করে। ইলেকট্রন বাহ্যিক তার দিয়ে জিংক অ্যানোড থেকে কপার ক্যাথোডে প্রবাহিত হয়।';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-5 text-white shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-emerald-100 sm:text-xs">
              <Activity className="h-4 w-4" />
              INTERACTIVE CHEMISTRY LAB
            </div>

            <h2 className="text-xl font-black leading-snug sm:text-2xl lg:text-3xl">
              রসায়ন ও শক্তি
              <span className="mt-1 block text-emerald-200">
                Chemistry & Energy Lab
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-xs leading-6 text-emerald-50/80 sm:text-sm">
              বন্ধন শক্তি থেকে বিক্রিয়ার তাপ নির্ণয় করো এবং ড্যানিয়েল কোষে
              ইলেকট্রন প্রবাহ ও লবণ সেতুর ভূমিকা হাতে-কলমে বুঝে নাও।
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 sm:self-center"
          >
            <RotateCcw className="h-4 w-4" />
            সব রিসেট
          </button>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/10 p-3">
            <Flame className="mb-2 h-5 w-5 text-orange-300" />
            <p className="text-[10px] text-emerald-100/70">প্রথম অংশ</p>
            <p className="mt-0.5 text-xs font-bold sm:text-sm">বন্ধন শক্তি</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-3">
            <BatteryCharging className="mb-2 h-5 w-5 text-emerald-300" />
            <p className="text-[10px] text-emerald-100/70">দ্বিতীয় অংশ</p>
            <p className="mt-0.5 text-xs font-bold sm:text-sm">ড্যানিয়েল কোষ</p>
          </div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/10 p-3 sm:col-span-1">
            <Zap className="mb-2 h-5 w-5 text-yellow-300" />
            <p className="text-[10px] text-emerald-100/70">শিখন পদ্ধতি</p>
            <p className="mt-0.5 text-xs font-bold sm:text-sm">Interactive Learning</p>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 1: BOND ENERGY CALCULATOR */}
      {/* ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                  বন্ধন শক্তি ক্যালকুলেটর
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                  Bond Energy & Reaction Enthalpy
                </p>
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
              ΔH = B₁ − B₂
            </span>
          </div>

          {/* Reaction Selector */}
          <div className="mt-5">
            <p className="mb-2.5 text-xs font-bold text-slate-600">
              একটি রাসায়নিক বিক্রিয়া নির্বাচন করো
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {REACTION_PRESETS.map((preset) => {
                const selected = preset.id === selectedPresetId;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    aria-pressed={selected}
                    className={`group rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-100'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[11px] font-extrabold ${
                          selected ? 'text-emerald-700' : 'text-slate-700'
                        }`}
                      >
                        {preset.name}
                      </span>
                      {selected && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      )}
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      {preset.id === 'hcl'
                        ? 'H₂ + Cl₂'
                        : preset.id === 'ch4'
                          ? 'CH₄ + O₂'
                          : preset.id === 'nh3'
                            ? 'N₂ + H₂'
                            : 'N₂ + O₂'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {/* Equation */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected Chemical Reaction
            </p>
            <p className="overflow-x-auto font-mono text-sm font-extrabold tracking-wide text-slate-800 sm:text-base">
              {activePreset.equation}
            </p>
          </div>

          {/* Bond Breakdown */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-extrabold text-amber-950">
                    পুরোনো বন্ধন ভাঙা
                  </p>
                  <p className="mt-0.5 text-[10px] text-amber-800">
                    Bond Breaking Energy (B₁)
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <ArrowDown className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                {activePreset.reactantBonds.map((bond, index) => (
                  <div
                    key={`${bond.label}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-amber-100 bg-white/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-800">
                        {bond.count} × {bond.label}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {bond.count} × {bond.energy} kJ/mol
                      </p>
                    </div>
                    <p className="text-xs font-extrabold tabular-nums text-amber-800">
                      {(bond.count * bond.energy).toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-amber-200 pt-3">
                <span className="text-xs font-bold text-amber-900">
                  মোট B₁
                </span>
                <span className="text-lg font-black tabular-nums text-amber-950">
                  {b1.toLocaleString('en-US')}
                  <span className="ml-1 text-[10px] font-bold">kJ</span>
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-extrabold text-emerald-950">
                    নতুন বন্ধন গঠন
                  </p>
                  <p className="mt-0.5 text-[10px] text-emerald-800">
                    Bond Formation Energy (B₂)
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                {activePreset.productBonds.map((bond, index) => (
                  <div
                    key={`${bond.label}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-emerald-100 bg-white/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-800">
                        {bond.count} × {bond.label}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {bond.count} × {bond.energy} kJ/mol
                      </p>
                    </div>
                    <p className="text-xs font-extrabold tabular-nums text-emerald-800">
                      {(bond.count * bond.energy).toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-emerald-200 pt-3">
                <span className="text-xs font-bold text-emerald-900">
                  মোট B₂
                </span>
                <span className="text-lg font-black tabular-nums text-emerald-950">
                  {b2.toLocaleString('en-US')}
                  <span className="ml-1 text-[10px] font-bold">kJ</span>
                </span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div
            className={`overflow-hidden rounded-2xl border ${
              isExothermic
                ? 'border-rose-200 bg-rose-50'
                : isEndothermic
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Calculated Reaction Enthalpy
                </p>
                <p className="mt-1 text-xs font-bold text-slate-700">
                  ΔH = B₁ − B₂ = {b1} − {b2}
                </p>
                <p
                  className={`mt-2 text-2xl font-black tabular-nums sm:text-3xl ${
                    isExothermic
                      ? 'text-rose-700'
                      : isEndothermic
                        ? 'text-blue-700'
                        : 'text-slate-800'
                  }`}
                >
                  ΔH = {formatEnergy(deltaH)}
                  <span className="ml-1 text-sm">kJ/mol</span>
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold ${
                  isExothermic
                    ? 'border-rose-200 bg-white text-rose-700'
                    : isEndothermic
                      ? 'border-blue-200 bg-white text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {isExothermic ? (
                  <Flame className="h-4 w-4" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {isExothermic
                  ? 'তাপোৎপাদী'
                  : isEndothermic
                    ? 'তাপহারী'
                    : 'তাপের পরিবর্তন নেই'}
              </div>
            </div>

            <div className="border-t border-black/5 px-4 py-3 sm:px-5">
              <p className="text-xs leading-6 text-slate-700">
                {isExothermic
                  ? 'B₂, B₁-এর চেয়ে বেশি। তাই বন্ধন গঠনের সময় বেশি শক্তি নির্গত হয় এবং বিক্রিয়াটি তাপোৎপাদী।'
                  : isEndothermic
                    ? 'B₁, B₂-এর চেয়ে বেশি। তাই বন্ধন ভাঙতে বেশি শক্তি শোষিত হয় এবং বিক্রিয়াটি তাপহারী।'
                    : 'বন্ধন ভাঙতে ও গঠন করতে সমান শক্তি প্রয়োজন হওয়ায় মোট তাপ পরিবর্তন শূন্য।'}
              </p>
            </div>
          </div>

          {/* Energy Profile */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">
                  বিক্রিয়ার শক্তির রেখাচিত্র
                </h4>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Reaction Energy Profile
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  isExothermic
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isExothermic ? 'Energy Released' : 'Energy Absorbed'}
              </span>
            </div>

            <svg
              viewBox="0 0 340 205"
              className="block h-auto w-full"
              role="img"
              aria-label={`শক্তির রেখাচিত্র: ${isExothermic ? 'তাপোৎপাদী' : 'তাপহারী'} বিক্রিয়া`}
            >
              <defs>
                <marker
                  id="energyArrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0 0 L6 3 L0 6" fill="none" stroke="currentColor" strokeWidth="1" />
                </marker>
              </defs>

              {/* Axes */}
              <path
                d="M35 15 V165 H322"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Reactant level */}
              <line
                x1="48"
                y1={isExothermic ? 83 : 125}
                x2="118"
                y2={isExothermic ? 83 : 125}
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x="82"
                y={isExothermic ? 73 : 115}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fill="#92400e"
              >
                বিক্রিয়ক
              </text>

              {/* Activation energy curve */}
              <path
                d={
                  isExothermic
                    ? 'M118 83 C145 83 145 24 185 24 C225 24 225 132 258 132'
                    : 'M118 125 C145 125 145 24 185 24 C225 24 225 82 258 82'
                }
                fill="none"
                stroke={isExothermic ? '#e11d48' : '#2563eb'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Product level */}
              <line
                x1="258"
                y1={isExothermic ? 132 : 82}
                x2="310"
                y2={isExothermic ? 132 : 82}
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x="284"
                y={isExothermic ? 148 : 72}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fill="#047857"
              >
                উৎপাদ
              </text>

              {/* Delta H arrow */}
              <line
                x1="282"
                y1={isExothermic ? 85 : 123}
                x2="282"
                y2={isExothermic ? 128 : 86}
                stroke={isExothermic ? '#e11d48' : '#2563eb'}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <text
                x="289"
                y="105"
                fontSize="10"
                fontWeight="bold"
                fill={isExothermic ? '#be123c' : '#1d4ed8'}
              >
                ΔH
              </text>

              {/* Axis labels */}
              <text
                x="180"
                y="190"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#64748b"
              >
                বিক্রিয়ার অগ্রগতি →
              </text>
              <text
                x="12"
                y="90"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#64748b"
                transform="rotate(-90 12 90)"
              >
                শক্তি
              </text>
            </svg>
            <p className="mt-2 text-center text-[10px] leading-5 text-slate-500">
              চিত্রটি ধারণাগত; রেখাচিত্রের উচ্চতা প্রকৃত শক্তির অনুপাত অনুযায়ী নয়।
            </p>
          </div>

          {/* Explanation toggle */}
          <button
            type="button"
            onClick={() => setShowExplanation((value) => !value)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              সহজে বুঝে নাও
            </span>
            <ChevronRight
              className={`h-4 w-4 text-slate-500 transition-transform ${
                showExplanation ? 'rotate-90' : ''
              }`}
            />
          </button>

          {showExplanation && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-xs font-extrabold text-amber-950">
                মনে রাখবে
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs font-bold text-rose-700">
                    বন্ধন ভাঙা
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    শক্তি শোষিত হয়। এটি একটি তাপহারী প্রক্রিয়া।
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs font-bold text-emerald-700">
                    বন্ধন গঠন
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    শক্তি নির্গত হয়। এটি একটি তাপোৎপাদী প্রক্রিয়া।
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-amber-900">
                এখানে ব্যবহৃত বন্ধন শক্তিগুলো গড় মান। তাই গণনার ফল পরীক্ষামূলক
                বিক্রিয়ার এনথালপির সঙ্গে কিছুটা ভিন্ন হতে পারে।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 2: DANIELL CELL */}
      {/* ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                  ড্যানিয়েল কোষ সিমুলেটর
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                  Galvanic Cell Simulation
                </p>
              </div>
            </div>

            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                isCellRunning
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isCellRunning ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {cellStatus}
            </span>
          </div>

          {/* Controls */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    circuitClosed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Power className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    বাহ্যিক সুইচ
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {circuitClosed ? 'বর্তনী বন্ধ' : 'বর্তনী খোলা'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={circuitClosed}
                onClick={() => setCircuitClosed((value) => !value)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  circuitClosed ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                aria-label="সুইচ চালু বা বন্ধ করো"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    circuitClosed ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    hasSaltBridge
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    লবণ সেতু (KCl)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {hasSaltBridge ? 'সংযুক্ত আছে' : 'বিচ্ছিন্ন'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={hasSaltBridge}
                onClick={() => setHasSaltBridge((value) => !value)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  hasSaltBridge ? 'bg-amber-500' : 'bg-slate-300'
                }`}
                aria-label="লবণ সেতু যুক্ত বা বিচ্ছিন্ন করো"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    hasSaltBridge ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {/* Cell Diagram */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  ড্যানিয়েল কোষের গঠন
                </p>
                <p className="text-[10px] text-slate-500">
                  Zn | ZnSO₄ || CuSO₄ | Cu
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  currentFlow
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentFlow ? '● Electron Flow ON' : '● Electron Flow OFF'}
              </span>
            </div>

            <div className="p-2 sm:p-4">
              <svg
                viewBox="0 0 540 290"
                className="block h-auto w-full"
                role="img"
                aria-label="জিংক অ্যানোড, কপার ক্যাথোড, লবণ সেতু ও বাহ্যিক তারসহ ড্যানিয়েল কোষ"
              >
                <defs>
                  <linearGradient id="znSolution" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity=".65" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity=".45" />
                  </linearGradient>
                  <linearGradient id="cuSolution" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity=".65" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity=".35" />
                  </linearGradient>
                </defs>

                {/* External wire */}
                <path
                  d="M110 112 V43 H430 V112"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Switch */}
                <circle cx="270" cy="43" r="17" fill="white" stroke="#64748b" strokeWidth="2" />
                <circle cx="262" cy="43" r="3" fill="#64748b" />
                <circle cx="278" cy="43" r="3" fill="#64748b" />
                {circuitClosed ? (
                  <line x1="262" y1="43" x2="278" y2="43" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                ) : (
                  <line x1="262" y1="43" x2="275" y2="33" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
                )}

                {/* Voltmeter */}
                <circle
                  cx="350"
                  cy="43"
                  r="22"
                  fill={hasSaltBridge ? '#ecfdf5' : '#f1f5f9'}
                  stroke={hasSaltBridge ? '#059669' : '#94a3b8'}
                  strokeWidth="2"
                />
                <text
                  x="350"
                  y="47"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#0f172a"
                >
                  {cellVoltage.toFixed(2)}V
                </text>

                {/* Electron flow */}
                {currentFlow && (
                  <>
                    <path
                      d="M115 105 V43 H430 V105"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeDasharray="5 17"
                      strokeDashoffset={electronOffset}
                      strokeLinecap="round"
                    />
                    <text
                      x="270"
                      y="16"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#2563eb"
                      textAnchor="middle"
                    >
                      e⁻ প্রবাহ →
                    </text>
                  </>
                )}

                {/* Salt bridge - behind the rods */}
                {hasSaltBridge && (
                  <>
                    <path
                      d="M175 174 V115 Q175 98 192 98 H348 Q365 98 365 115 V174"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />
                    <path
                      d="M175 174 V115 Q175 98 192 98 H348 Q365 98 365 115 V174"
                      fill="none"
                      stroke="#fef3c7"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <text
                      x="270"
                      y="94"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#92400e"
                      textAnchor="middle"
                    >
                      KCl লবণ সেতু
                    </text>
                  </>
                )}

                {/* Left beaker */}
                <path
                  d="M42 135 L52 255 Q54 265 65 265 H195 Q206 265 208 255 L218 135"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M48 169 L55 252 Q56 258 65 258 H195 Q202 258 204 252 L212 169 Z"
                  fill="url(#znSolution)"
                />
                <path d="M48 169 H212" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Right beaker */}
                <path
                  d="M322 135 L332 255 Q334 265 345 265 H475 Q486 265 488 255 L498 135"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M328 169 L335 252 Q336 258 345 258 H475 Q482 258 484 252 L492 169 Z"
                  fill="url(#cuSolution)"
                />
                <path d="M328 169 H492" stroke="#60a5fa" strokeWidth="1.5" />

                {/* Zn electrode */}
                <rect
                  x="99"
                  y="103"
                  width="23"
                  height="113"
                  rx="4"
                  fill="#94a3b8"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <text x="110.5" y="145" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                  Zn
                </text>
                <text x="110.5" y="160" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
                  (−)
                </text>

                {/* Cu electrode */}
                <rect
                  x="419"
                  y="103"
                  width="23"
                  height="113"
                  rx="4"
                  fill="#c2410c"
                  stroke="#9a3412"
                  strokeWidth="2"
                />
                <text x="430.5" y="145" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                  Cu
                </text>
                <text x="430.5" y="160" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                  (+)
                </text>

                {/* Labels */}
                <text x="130" y="239" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">
                  ZnSO₄
                </text>
                <text x="410" y="239" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">
                  CuSO₄
                </text>

                <text x="130" y="282" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">
                  অ্যানোড (−)
                </text>
                <text x="410" y="282" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1d4ed8">
                  ক্যাথোড (+)
                </text>
              </svg>
            </div>
          </div>

          {/* Cell Status */}
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              currentFlow
                ? 'border-emerald-200 bg-emerald-50/70'
                : 'border-amber-200 bg-amber-50/70'
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                currentFlow
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Info className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">
                বর্তমান অবস্থার ব্যাখ্যা
              </p>
              <p className="mt-1 text-xs leading-6 text-slate-600">
                {cellDescription}
              </p>
            </div>
          </div>

          {/* Cell Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold text-slate-500">
                কোষের বিভব
              </p>
              <p className="mt-1 text-xl font-black tabular-nums text-emerald-700">
                {cellVoltage.toFixed(2)}
                <span className="ml-1 text-xs">V</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold text-slate-500">
                ইলেকট্রন প্রবাহ
              </p>
              <p
                className={`mt-1 text-sm font-black ${
                  currentFlow ? 'text-blue-700' : 'text-slate-500'
                }`}
              >
                {currentFlow ? 'সক্রিয়' : 'বন্ধ'}
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-500">
                লবণ সেতু
              </p>
              <p
                className={`mt-1 text-sm font-black ${
                  hasSaltBridge ? 'text-amber-700' : 'text-rose-600'
                }`}
              >
                {hasSaltBridge ? 'সংযুক্ত' : 'বিচ্ছিন্ন'}
              </p>
            </div>
          </div>

          {/* Half Reactions */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-extrabold text-slate-800">
                কোষের অর্ধ-বিক্রিয়া
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    অ্যানোড (−)
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">
                    জারণ
                  </span>
                </div>
                <p className="overflow-x-auto font-mono text-xs font-bold text-slate-800">
                  Zn(s) → Zn²⁺(aq) + 2e⁻
                </p>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  জিংক ইলেকট্রন ত্যাগ করে দ্রবণে Zn²⁺ আয়ন হিসেবে প্রবেশ করে।
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-950">
                    ক্যাথোড (+)
                  </span>
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-800">
                    বিজারণ
                  </span>
                </div>
                <p className="overflow-x-auto font-mono text-xs font-bold text-blue-950">
                  Cu²⁺(aq) + 2e⁻ → Cu(s)
                </p>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  কপার আয়ন ইলেকট্রন গ্রহণ করে কপার ধাতু হিসেবে জমা হয়।
                </p>
              </div>
            </div>
          </div>

          {/* Overall Reaction */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Overall Cell Reaction
            </p>
            <p className="mt-2 overflow-x-auto font-mono text-sm font-extrabold text-emerald-950">
              Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)
            </p>
          </div>

          {/* Quick Learning */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-extrabold text-slate-800">
                নিজে পরীক্ষা করে দেখো
              </h4>
            </div>

            <div className="space-y-2 text-xs leading-6 text-slate-600">
              <p>
                <strong className="text-slate-800">১.</strong> সুইচ OFF করো।
                দেখবে ইলেকট্রন প্রবাহ বন্ধ, কিন্তু লবণ সেতু যুক্ত থাকলে open-circuit
                voltage বজায় থাকে।
              </p>
              <p>
                <strong className="text-slate-800">২.</strong> লবণ সেতু বিচ্ছিন্ন
                করো। কোষের কার্যকর বিক্রিয়া ও বিদ্যুৎ প্রবাহ বন্ধ হবে।
              </p>
              <p>
                <strong className="text-slate-800">৩.</strong> দুটি সংযোগই চালু
                রাখো। ইলেকট্রন Zn থেকে Cu-এর দিকে প্রবাহিত হতে দেখবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-[11px] leading-5 text-blue-900">
          <strong>শিক্ষণীয় তথ্য:</strong> ড্যানিয়েল কোষের 1.10 V একটি আদর্শ
          মান। বাস্তবে দ্রবণের ঘনমাত্রা, তাপমাত্রা ও কোষের অবস্থার কারণে
          বিভবের মান পরিবর্তিত হতে পারে। এই সিমুলেটরটি ধারণাগত শিক্ষার জন্য।
        </p>
      </div>
    </div>
  );
}
