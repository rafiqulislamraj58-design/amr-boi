
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Atom,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Info,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

type BondType = 'ionic' | 'covalent';

interface AtomData {
  symbol: string;
  nameBn: string;
  initialValence: number;
  configuration: string;
  configurationAfter: string;
  chargeAfter?: string;
  color: string;
}

interface CompoundPreset {
  id: string;
  formula: string;
  nameBn: string;
  nameEn: string;
  type: BondType;
  bondLabel: string;
  atomA: AtomData;
  atomB: AtomData;
  transferredOrShared: number;
  meltingPoint: string;
  boilingPoint: string;
  waterSolubility: string;
  conductivity: string;
  explanation: string;
  steps: string[];
  bondSummary: string;
}

// ======================================================
// COMPOUND DATA
// ======================================================

const COMPOUNDS: CompoundPreset[] = [
  {
    id: 'nacl',
    formula: 'NaCl',
    nameBn: 'সোডিয়াম ক্লোরাইড',
    nameEn: 'Sodium Chloride',
    type: 'ionic',
    bondLabel: 'আয়নিক বন্ধন',
    atomA: {
      symbol: 'Na',
      nameBn: 'সোডিয়াম',
      initialValence: 1,
      configuration: '2, 8, 1',
      configurationAfter: '2, 8',
      chargeAfter: '+1',
      color: '#e11d48',
    },
    atomB: {
      symbol: 'Cl',
      nameBn: 'ক্লোরিন',
      initialValence: 7,
      configuration: '2, 8, 7',
      configurationAfter: '2, 8, 8',
      chargeAfter: '-1',
      color: '#059669',
    },
    transferredOrShared: 1,
    meltingPoint: '801 °C',
    boilingPoint: '1465 °C',
    waterSolubility: 'পানিতে সহজে দ্রবণীয়',
    conductivity: 'কঠিন অবস্থায় অপরিবাহী; গলিত ও জলীয় দ্রবণে পরিবাহী',
    explanation:
      'সোডিয়াম তার সর্ববহিঃস্থ কক্ষপথের একটি ইলেকট্রন ক্লোরিনকে দান করে। ফলে Na⁺ ও Cl⁻ আয়ন তৈরি হয়। বিপরীত চার্জের তড়িৎ আকর্ষণে আয়নিক জালক গঠিত হয়।',
    steps: [
      'প্রথমে সোডিয়ামের বহিঃস্থ কক্ষপথে ১টি এবং ক্লোরিনের ৭টি ইলেকট্রন থাকে।',
      'সোডিয়াম তার একটি ইলেকট্রন ক্লোরিনকে দান করে।',
      'Na⁺ ও Cl⁻ আয়ন তৈরি হয় এবং বিপরীত চার্জের আকর্ষণে আয়নিক বন্ধন গঠিত হয়।',
    ],
    bondSummary: '১টি ইলেকট্রন স্থানান্তরিত হয়।',
  },
  {
    id: 'mgo',
    formula: 'MgO',
    nameBn: 'ম্যাগনেসিয়াম অক্সাইড',
    nameEn: 'Magnesium Oxide',
    type: 'ionic',
    bondLabel: 'আয়নিক বন্ধন',
    atomA: {
      symbol: 'Mg',
      nameBn: 'ম্যাগনেসিয়াম',
      initialValence: 2,
      configuration: '2, 8, 2',
      configurationAfter: '2, 8',
      chargeAfter: '+2',
      color: '#ea580c',
    },
    atomB: {
      symbol: 'O',
      nameBn: 'অক্সিজেন',
      initialValence: 6,
      configuration: '2, 6',
      configurationAfter: '2, 8',
      chargeAfter: '-2',
      color: '#2563eb',
    },
    transferredOrShared: 2,
    meltingPoint: '2852 °C',
    boilingPoint: 'প্রায় 3600 °C',
    waterSolubility: 'পানিতে অতি সামান্য দ্রবণীয়',
    conductivity: 'কঠিন অবস্থায় অপরিবাহী; গলিত অবস্থায় পরিবাহী',
    explanation:
      'ম্যাগনেসিয়াম তার বহিঃস্থ কক্ষপথের দুটি ইলেকট্রন অক্সিজেনকে দান করে। ফলে Mg²⁺ ও O²⁻ আয়ন তৈরি হয়। বিপরীত চার্জের আকর্ষণে MgO গঠিত হয়।',
    steps: [
      'ম্যাগনেসিয়ামের বহিঃস্থ কক্ষপথে ২টি এবং অক্সিজেনের ৬টি ইলেকট্রন থাকে।',
      'ম্যাগনেসিয়াম তার দুটি ইলেকট্রন অক্সিজেনকে দান করে।',
      'Mg²⁺ ও O²⁻ আয়ন তৈরি হয় এবং আয়নিক আকর্ষণে যৌগ গঠিত হয়।',
    ],
    bondSummary: '২টি ইলেকট্রন স্থানান্তরিত হয়।',
  },
  {
    id: 'h2',
    formula: 'H₂',
    nameBn: 'হাইড্রোজেন অণু',
    nameEn: 'Hydrogen Molecule',
    type: 'covalent',
    bondLabel: 'সমযোজী একক বন্ধন',
    atomA: {
      symbol: 'H',
      nameBn: 'হাইড্রোজেন',
      initialValence: 1,
      configuration: '1',
      configurationAfter: '2 (Duplet)',
      color: '#0284c7',
    },
    atomB: {
      symbol: 'H',
      nameBn: 'হাইড্রোজেন',
      initialValence: 1,
      configuration: '1',
      configurationAfter: '2 (Duplet)',
      color: '#7c3aed',
    },
    transferredOrShared: 1,
    meltingPoint: '-259.2 °C',
    boilingPoint: '-252.9 °C',
    waterSolubility: 'পানিতে সামান্য দ্রবণীয়',
    conductivity: 'বিদ্যুৎ অপরিবাহী',
    explanation:
      'দুটি হাইড্রোজেন পরমাণু প্রত্যেকে একটি করে ইলেকট্রন শেয়ার করে এক জোড়া ইলেকট্রন তৈরি করে। ফলে উভয় পরমাণুর ডুপ্লেট পূর্ণ হয় এবং H–H বন্ধন গঠিত হয়।',
    steps: [
      'প্রতিটি হাইড্রোজেন পরমাণুর বহিঃস্থ কক্ষপথে একটি ইলেকট্রন থাকে।',
      'দুটি হাইড্রোজেন পরমাণু একটি করে ইলেকট্রন শেয়ার করে।',
      'এক জোড়া শেয়ারকৃত ইলেকট্রনের মাধ্যমে H–H একক বন্ধন তৈরি হয়।',
    ],
    bondSummary: '১ জোড়া ইলেকট্রন শেয়ার করা হয়।',
  },
  {
    id: 'o2',
    formula: 'O₂',
    nameBn: 'অক্সিজেন অণু',
    nameEn: 'Oxygen Molecule',
    type: 'covalent',
    bondLabel: 'সমযোজী দ্বিবন্ধন',
    atomA: {
      symbol: 'O',
      nameBn: 'অক্সিজেন',
      initialValence: 6,
      configuration: '2, 6',
      configurationAfter: '2, 8 (Octet)',
      color: '#2563eb',
    },
    atomB: {
      symbol: 'O',
      nameBn: 'অক্সিজেন',
      initialValence: 6,
      configuration: '2, 6',
      configurationAfter: '2, 8 (Octet)',
      color: '#059669',
    },
    transferredOrShared: 2,
    meltingPoint: '-218.8 °C',
    boilingPoint: '-183 °C',
    waterSolubility: 'পানিতে সামান্য দ্রবণীয়',
    conductivity: 'বিদ্যুৎ অপরিবাহী',
    explanation:
      'প্রতিটি অক্সিজেন পরমাণুর ৬টি যোজ্যতা ইলেকট্রনের মধ্যে ২টি করে ইলেকট্রন শেয়ার হয়ে দুটি যৌথ ইলেকট্রন জোড়া তৈরি করে। ফলে O=O দ্বিবন্ধন গঠিত হয়।',
    steps: [
      'প্রতিটি অক্সিজেন পরমাণুর বহিঃস্থ কক্ষপথে ৬টি ইলেকট্রন থাকে।',
      'প্রতিটি অক্সিজেন পরমাণু ২টি করে ইলেকট্রন শেয়ার করে।',
      'দুটি যৌথ ইলেকট্রন জোড়ার মাধ্যমে O=O দ্বিবন্ধন তৈরি হয়।',
    ],
    bondSummary: '২ জোড়া ইলেকট্রন শেয়ার করা হয়।',
  },
  {
    id: 'hcl',
    formula: 'HCl',
    nameBn: 'হাইড্রোজেন ক্লোরাইড',
    nameEn: 'Hydrogen Chloride',
    type: 'covalent',
    bondLabel: 'পোলার সমযোজী একক বন্ধন',
    atomA: {
      symbol: 'H',
      nameBn: 'হাইড্রোজেন',
      initialValence: 1,
      configuration: '1',
      configurationAfter: '2 (Duplet)',
      chargeAfter: 'δ+',
      color: '#0284c7',
    },
    atomB: {
      symbol: 'Cl',
      nameBn: 'ক্লোরিন',
      initialValence: 7,
      configuration: '2, 8, 7',
      configurationAfter: '2, 8, 8',
      chargeAfter: 'δ-',
      color: '#059669',
    },
    transferredOrShared: 1,
    meltingPoint: '-114.2 °C',
    boilingPoint: '-85.1 °C',
    waterSolubility: 'পানিতে অত্যন্ত দ্রবণীয়',
    conductivity: 'জলীয় দ্রবণে আয়ন তৈরি করে বিদ্যুৎ পরিবহন করে',
    explanation:
      'হাইড্রোজেন ও ক্লোরিন একটি করে ইলেকট্রন শেয়ার করে সমযোজী বন্ধন গঠন করে। ক্লোরিনের তড়িৎ ঋণাত্মকতা বেশি হওয়ায় শেয়ারকৃত ইলেকট্রন তার দিকে বেশি আকৃষ্ট হয়। ফলে Hδ⁺ এবং Clδ⁻ তৈরি হয়।',
    steps: [
      'হাইড্রোজেনের ১টি এবং ক্লোরিনের ৭টি যোজ্যতা ইলেকট্রন থাকে।',
      'উভয় পরমাণু একটি করে ইলেকট্রন শেয়ার করে।',
      'ক্লোরিনের তড়িৎ ঋণাত্মকতা বেশি হওয়ায় বন্ধনটি পোলার হয়।',
    ],
    bondSummary: '১ জোড়া ইলেকট্রন শেয়ার করা হয়।',
  },
];

// ======================================================
// HELPERS
// ======================================================

function getElectronPositions(
  cx: number,
  cy: number,
  radius: number,
  count: number,
  offset = -Math.PI / 2,
) {
  return Array.from({ length: count }, (_, index) => {
    const angle = offset + (2 * Math.PI * index) / Math.max(count, 1);

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ChemicalBondingLab() {
  const [selectedId, setSelectedId] = useState('nacl');
  const [stage, setStage] = useState(0);
  const [showDetails, setShowDetails] = useState(true);

  const selected = useMemo(
    () => COMPOUNDS.find((item) => item.id === selectedId) ?? COMPOUNDS[0],
    [selectedId],
  );

  const isIonic = selected.type === 'ionic';
  const isComplete = stage === 2;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setStage(0);
    setShowDetails(true);
  };

  const nextStep = () => {
    setStage((prev) => Math.min(prev + 1, 2));
  };

  const reset = () => {
    setStage(0);
  };

  // SVG positions
  const leftCx = isIonic ? 190 : 225;
  const rightCx = isIonic ? 410 : 375;
  const cy = 142;
  const shellR = 77;

  // Ionic electron counts
  const leftElectronCount = isIonic
    ? stage === 0
      ? selected.atomA.initialValence
      : stage === 1
        ? selected.atomA.initialValence - selected.transferredOrShared
        : 8
    : stage === 0
      ? selected.atomA.initialValence
      : selected.atomA.initialValence - selected.transferredOrShared;

  const rightElectronCount = isIonic
    ? stage === 0
      ? selected.atomB.initialValence
      : stage === 1
        ? selected.atomB.initialValence
        : 8
    : stage === 0
      ? selected.atomB.initialValence
      : selected.atomB.initialValence - selected.transferredOrShared;

  const leftDots = getElectronPositions(
    leftCx,
    cy,
    shellR,
    leftElectronCount,
    -Math.PI / 2,
  );

  const rightDots = getElectronPositions(
    rightCx,
    cy,
    shellR,
    rightElectronCount,
    -Math.PI / 2,
  );

  const showBond = stage >= 1;
  const atomACharge = isComplete ? selected.atomA.chargeAfter : undefined;
  const atomBCharge = isComplete ? selected.atomB.chargeAfter : undefined;

  const electronLabel = isIonic
    ? `${selected.transferredOrShared}টি ইলেকট্রন স্থানান্তর`
    : `${selected.transferredOrShared} জোড়া ইলেকট্রন শেয়ার`;

  return (
    <div className="w-full space-y-5 sm:space-y-6">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold tracking-widest text-emerald-700">
              <Activity className="h-3.5 w-3.5" />
              INTERACTIVE CHEMISTRY LAB
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              রাসায়নিক বন্ধন
              <span className="mt-1 block text-emerald-600">
                Chemical Bonding Lab
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              পরমাণুর মধ্যে ইলেকট্রন আদান-প্রদান এবং শেয়ারিং কীভাবে ঘটে,
              তা অ্যানিমেশনের মাধ্যমে নিজেই পর্যবেক্ষণ করো।
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Atom className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Selected Compound
              </p>
              <p className="text-2xl font-black text-slate-900">
                {selected.formula}
              </p>
              <p className="text-[11px] text-slate-500">
                {selected.nameEn}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* BOND TYPE SELECTOR */}
      {/* ============================================= */}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900">
              যৌগ নির্বাচন করো
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              বিভিন্ন রাসায়নিক বন্ধনের উদাহরণ পরীক্ষা করো।
            </p>
          </div>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {COMPOUNDS.length} Compounds
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COMPOUNDS.map((compound) => {
            const active = selectedId === compound.id;

            return (
              <button
                key={compound.id}
                type="button"
                onClick={() => handleSelect(compound.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
                  active
                    ? compound.type === 'ionic'
                      ? 'border-rose-300 bg-rose-50 shadow-sm ring-2 ring-rose-100'
                      : 'border-blue-300 bg-blue-50 shadow-sm ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xl font-black ${
                      active
                        ? compound.type === 'ionic'
                          ? 'text-rose-700'
                          : 'text-blue-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {compound.formula}
                  </span>

                  {active && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </div>

                <p className="mt-2 truncate text-xs font-semibold text-slate-700">
                  {compound.nameBn}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-md px-2 py-1 text-[9px] font-bold ${
                    compound.type === 'ionic'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {compound.type === 'ionic' ? 'IONIC' : 'COVALENT'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================= */}
      {/* VISUALIZATION LAB */}
      {/* ============================================= */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Lab header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">
                Bond Formation Simulator
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {selected.bondLabel} · {selected.formula}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
              isIonic
                ? 'bg-rose-100 text-rose-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isIonic ? 'IONIC BOND' : 'COVALENT BOND'}
          </span>
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span
              className={`h-2 w-2 rounded-full ${
                isComplete ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'
              }`}
            />
            {stage === 0
              ? 'পরমাণু পৃথক অবস্থায় রয়েছে'
              : stage === 1
                ? 'ইলেকট্রন বিনিময় / শেয়ারিং চলছে'
                : isIonic
                  ? 'আয়নিক যৌগ গঠিত হয়েছে'
                  : 'সমযোজী বন্ধন গঠিত হয়েছে'}
          </div>

          <span className="text-[10px] font-bold text-slate-400">
            STEP {stage + 1} / 3
          </span>
        </div>

        {/* SVG Visualization */}
        <div className="p-3 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/30 blur-3xl" />

            <svg
              viewBox="0 0 600 310"
              className="relative block h-auto w-full"
              role="img"
              aria-label={`${selected.formula} chemical bonding visualization`}
            >
              <defs>
                <radialGradient id="electronGlow">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </radialGradient>

                <filter id="atomShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="4"
                    floodColor="#64748b"
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>

              {/* Atom A shell */}
              <circle
                cx={leftCx}
                cy={cy}
                r={shellR}
                fill={isIonic ? '#fff1f2' : '#eff6ff'}
                fillOpacity="0.55"
                stroke={selected.atomA.color}
                strokeWidth="2"
                strokeDasharray={isIonic ? '5 5' : 'none'}
                className="transition-all duration-700"
              />

              {/* Atom B shell */}
              <circle
                cx={rightCx}
                cy={cy}
                r={shellR}
                fill="#ecfdf5"
                fillOpacity="0.55"
                stroke={selected.atomB.color}
                strokeWidth="2"
                strokeDasharray={isIonic ? '5 5' : 'none'}
                className="transition-all duration-700"
              />

              {/* Covalent overlap */}
              {!isIonic && showBond && (
                <ellipse
                  cx="300"
                  cy={cy}
                  rx="34"
                  ry="60"
                  fill="#a5b4fc"
                  fillOpacity="0.13"
                  stroke="#818cf8"
                  strokeDasharray="3 4"
                  className="animate-pulse"
                />
              )}

              {/* Ionic attraction */}
              {isIonic && isComplete && (
                <g>
                  <path
                    d="M 230 142 Q 300 105 370 142"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                  <path
                    d="M 365 135 L 373 142 L 363 148"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Atom A nucleus */}
              <circle
                cx={leftCx}
                cy={cy}
                r="29"
                fill={selected.atomA.color}
                filter="url(#atomShadow)"
                className="transition-all duration-700"
              />
              <text
                x={leftCx}
                y={cy + 7}
                textAnchor="middle"
                fill="white"
                fontSize="19"
                fontWeight="900"
              >
                {selected.atomA.symbol}
              </text>

              {/* Atom B nucleus */}
              <circle
                cx={rightCx}
                cy={cy}
                r="29"
                fill={selected.atomB.color}
                filter="url(#atomShadow)"
                className="transition-all duration-700"
              />
              <text
                x={rightCx}
                y={cy + 7}
                textAnchor="middle"
                fill="white"
                fontSize="19"
                fontWeight="900"
              >
                {selected.atomB.symbol}
              </text>

              {/* Atom A electrons */}
              {leftDots.map((point, index) => (
                <circle
                  key={`left-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill={selected.atomA.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-500"
                />
              ))}

              {/* Atom B electrons */}
              {rightDots.map((point, index) => (
                <circle
                  key={`right-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill={selected.atomB.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-500"
                />
              ))}

              {/* Ionic transfer animation */}
              {isIonic && stage === 1 && (
                <g>
                  {Array.from(
                    { length: selected.transferredOrShared },
                    (_, index) => (
                      <circle
                        key={index}
                        cx={275 + index * 18}
                        cy={cy - 18 + index * 36}
                        r="6"
                        fill={selected.atomA.color}
                        stroke="white"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    ),
                  )}

                  <path
                    d={`M ${leftCx + 48} 45 L ${rightCx - 48} 45`}
                    stroke="#e11d48"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    fill="none"
                  />

                  <path
                    d={`M ${rightCx - 55} 39 L ${rightCx - 45} 45 L ${rightCx - 55} 51`}
                    stroke="#e11d48"
                    strokeWidth="2"
                    fill="none"
                  />

                  <text
                    x="300"
                    y="29"
                    textAnchor="middle"
                    fill="#be123c"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    e⁻ Transfer
                  </text>
                </g>
              )}

              {/* Covalent shared electrons */}
              {!isIonic && showBond && (
                <g>
                  {Array.from(
                    { length: selected.transferredOrShared },
                    (_, index) => {
                      const y = selected.transferredOrShared === 1
                        ? cy
                        : cy - 12 + index * 24;

                      return (
                        <g key={index}>
                          <circle
                            cx="292"
                            cy={y}
                            r="6"
                            fill={selected.atomA.color}
                            stroke="white"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                          <circle
                            cx="308"
                            cy={y}
                            r="6"
                            fill={selected.atomB.color}
                            stroke="white"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        </g>
                      );
                    },
                  )}

                  <text
                    x="300"
                    y="39"
                    textAnchor="middle"
                    fill="#1d4ed8"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Shared Electron Pairs
                  </text>
                </g>
              )}

              {/* Charges */}
              {atomACharge && (
                <g>
                  <circle
                    cx={leftCx + 42}
                    cy={cy - 43}
                    r="13"
                    fill="#fff"
                    stroke={selected.atomA.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={leftCx + 42}
                    y={cy - 39}
                    textAnchor="middle"
                    fill={selected.atomA.color}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {atomACharge}
                  </text>
                </g>
              )}

              {atomBCharge && (
                <g>
                  <circle
                    cx={rightCx + 42}
                    cy={cy - 43}
                    r="13"
                    fill="#fff"
                    stroke={selected.atomB.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={rightCx + 42}
                    y={cy - 39}
                    textAnchor="middle"
                    fill={selected.atomB.color}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {atomBCharge}
                  </text>
                </g>
              )}

              {/* Bottom labels */}
              <text
                x={leftCx}
                y="252"
                textAnchor="middle"
                fill="#334155"
                fontSize="13"
                fontWeight="bold"
              >
                {selected.atomA.nameBn}
              </text>

              <text
                x={leftCx}
                y="271"
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
              >
                {isComplete
                  ? selected.atomA.configurationAfter
                  : selected.atomA.configuration}
              </text>

              <text
                x={rightCx}
                y="252"
                textAnchor="middle"
                fill="#334155"
                fontSize="13"
                fontWeight="bold"
              >
                {selected.atomB.nameBn}
              </text>

              <text
                x={rightCx}
                y="271"
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
              >
                {isComplete
                  ? selected.atomB.configurationAfter
                  : selected.atomB.configuration}
              </text>

              {/* Bond summary */}
              <text
                x="300"
                y="297"
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
                fontWeight="bold"
              >
                {isComplete
                  ? selected.formula + ' — Bond Formed'
                  : stage === 1
                    ? 'Bond formation in progress'
                    : 'Initial electron configuration'}
              </text>
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-200/70 bg-white/70 px-3 py-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Atom A Electron
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Atom B Electron
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Shared / Bond Region
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t border-slate-100 p-4 sm:p-5">
          {/* Progress */}
          <div className="mb-4 flex gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  stage >= step ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={stage === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={isComplete}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
            >
              {stage === 0 ? (
                <>
                  <Play className="h-4 w-4" />
                  শুরু করো
                </>
              ) : stage === 1 ? (
                <>
                  <Link2 className="h-4 w-4" />
                  বন্ধন সম্পন্ন করো
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  সম্পন্ন হয়েছে
                </>
              )}
              {!isComplete && <ChevronRight className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <Info className="h-4 w-4" />
              {showDetails ? 'বিবরণ বন্ধ' : 'বিবরণ দেখো'}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* STEP EXPLANATION */}
      {/* ============================================= */}

      {showDetails && (
        <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950">
                ধাপে ধাপে বন্ধন গঠন
              </h3>
              <p className="text-[11px] text-emerald-700">
                Step-by-step Explanation
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {selected.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                  stage >= index
                    ? 'border-emerald-200 bg-white shadow-sm'
                    : 'border-transparent bg-emerald-100/40 opacity-60'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                    stage >= index
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {index + 1}
                </span>
                <p className="pt-1 text-xs leading-6 text-slate-700">
                  {step}
                </p>
                {stage >= index && (
                  <CheckCircle2 className="ml-auto mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Bond Summary
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {selected.bondSummary}
            </p>
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* PROPERTIES */}
      {/* ============================================= */}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">
            যৌগের ভৌত বৈশিষ্ট্য
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'গলনাঙ্ক',
              value: selected.meltingPoint,
              icon: Sparkles,
              color: 'text-rose-600',
              bg: 'bg-rose-50',
            },
            {
              title: 'স্ফুটনাঙ্ক',
              value: selected.boilingPoint,
              icon: Activity,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
            },
            {
              title: 'পানিতে দ্রবণীয়তা',
              value: selected.waterSolubility,
              icon: FlaskConical,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              title: 'বিদ্যুৎ পরিবাহিতা',
              value: selected.conductivity,
              icon: Zap,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {item.title}
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold leading-6 text-slate-800">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================= */}
      {/* CONFIGURATION COMPARISON */}
      {/* ============================================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Atom className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900">
            ইলেকট্রন বিন্যাসের পরিবর্তন
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[selected.atomA, selected.atomB].map((atom, index) => (
            <div
              key={`${atom.symbol}-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ backgroundColor: atom.color }}
                >
                  {atom.symbol}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {atom.nameBn}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {isComplete ? 'পরিবর্তিত বিন্যাস' : 'প্রাথমিক বিন্যাস'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white p-2.5">
                  <p className="text-[10px] font-semibold text-slate-400">
                    Before
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-700">
                    {atom.configuration}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-2.5">
                  <p className="text-[10px] font-semibold text-slate-400">
                    After
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-emerald-700">
                    {isComplete
                      ? atom.configurationAfter
                      : '— —'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================= */}
      {/* FINAL EXPLANATION */}
      {/* ============================================= */}

      <section className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 sm:p-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-100/70 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-indigo-950">
              {selected.nameBn} ({selected.formula}) কীভাবে গঠিত হয়?
            </h3>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {selected.explanation}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-indigo-700 shadow-sm">
              {selected.bondLabel}
            </span>
            <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
              {electronLabel}
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[11px] leading-5 text-amber-900">
          <strong>শিক্ষণীয় নোট:</strong> এই SVG চিত্রটি ইলেকট্রন আদান-প্রদান
          ও শেয়ারিং বোঝানোর একটি সরলীকৃত মডেল। বাস্তবে ইলেকট্রনের অবস্থান
          ও রাসায়নিক বন্ধনের প্রকৃতি আরও জটিল।
        </p>
      </div>
    </div>
  );
}
