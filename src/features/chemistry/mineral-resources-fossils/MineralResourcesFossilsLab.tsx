
'use client';

import React, { useState } from 'react';

import {
  Activity,
  Beaker,
  Flame,
  FlaskConical,
  Info,
  Layers,
  RotateCcw,
  CheckCircle2,
  Atom,
  Thermometer,
  Droplets,
  ChevronRight,
  Sparkles,
  BookOpen,
  TestTube2,
  Gauge,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';

type HydrocarbonType = 'alkane' | 'alkene' | 'alkyne';

interface DistillationFraction {
  id: string;
  nameBn: string;
  nameEn: string;
  tempRange: string;
  carbonRange: string;
  color: string;
  uses: string;
  note: string;
}

const CARBON_PREFIXES_BN: Record<
  number,
  { root: string; en: string }
> = {
  1: { root: 'মিথ', en: 'Meth' },
  2: { root: 'ইথ', en: 'Eth' },
  3: { root: 'প্রোপ', en: 'Prop' },
  4: { root: 'বিউট', en: 'But' },
  5: { root: 'পেন্ট', en: 'Pent' },
  6: { root: 'হেক্স', en: 'Hex' },
};

const SUBSCRIPT_DIGITS: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

function toSubscript(num: number): string {
  return String(num)
    .split('')
    .map((ch) => SUBSCRIPT_DIGITS[ch] ?? ch)
    .join('');
}

const DISTILLATION_FRACTIONS: DistillationFraction[] = [
  {
    id: 'petroleum-gas',
    nameBn: 'পেট্রোলিয়াম গ্যাস',
    nameEn: 'Petroleum Gas',
    tempRange: '0°C – 20°C',
    carbonRange: 'C₁ – C₄',
    color: '#38bdf8',
    uses: 'রান্নার এলপিজি (LPG) সিলিন্ডার ও জ্বালানি গ্যাস হিসেবে।',
    note: 'কম স্ফুটনাঙ্কের কারণে কলামের উপরের দিকে গ্যাসীয় অবস্থায় সংগ্রহ করা হয়।',
  },
  {
    id: 'petrol',
    nameBn: 'পেট্রোল (গ্যাসোলিন)',
    nameEn: 'Petrol / Gasoline',
    tempRange: '21°C – 70°C',
    carbonRange: 'C₅ – C₁₀',
    color: '#fbbf24',
    uses: 'প্রাইভেট কার, মোটরসাইকেল ও হালকা যানবাহনের জ্বালানি।',
    note: 'এটি একটি উদ্বায়ী ও দাহ্য তরল জ্বালানি।',
  },
  {
    id: 'naphtha',
    nameBn: 'ন্যাপথা',
    nameEn: 'Naphtha',
    tempRange: '71°C – 120°C',
    carbonRange: 'C₇ – C₁₄',
    color: '#fb923c',
    uses: 'পেট্রোকেমিক্যাল শিল্পে প্লাস্টিক, কৃত্রিম তন্তু ও রাসায়নিক দ্রব্য তৈরিতে।',
    note: 'পলিমার ও জৈব রাসায়নিক শিল্পের গুরুত্বপূর্ণ কাঁচামাল।',
  },
  {
    id: 'kerosene',
    nameBn: 'কেরোসিন',
    nameEn: 'Kerosene',
    tempRange: '121°C – 170°C',
    carbonRange: 'C₁₁ – C₁₆',
    color: '#f97316',
    uses: 'জেট বিমানের জ্বালানি ও ঘরোয়া চুলায় জ্বালানি হিসেবে।',
    note: 'পরিশোধিত কেরোসিন উড়োজাহাজের জেট ইঞ্জিনে ব্যবহৃত হয়।',
  },
  {
    id: 'diesel',
    nameBn: 'ডিজেল',
    nameEn: 'Diesel',
    tempRange: '171°C – 270°C',
    carbonRange: 'C₁₇ – C₂₀',
    color: '#ea580c',
    uses: 'বাস, ট্রাক, ট্রেন, জাহাজ ও জেনারেটরের জ্বালানি।',
    note: 'তুলনামূলক ভারী ইঞ্জিনের জন্য ব্যবহৃত জ্বালানি।',
  },
  {
    id: 'lubricating',
    nameBn: 'প্যারাফিন মোম ও লুব্রিকেটিং তেল',
    nameEn: 'Paraffin Wax & Lubricating Oil',
    tempRange: '271°C – 340°C',
    carbonRange: 'C₂₀ – C₃₀',
    color: '#9a3412',
    uses: 'মোমবাতি, ভ্যাসলিন, গ্রিজ এবং ইঞ্জিনের পিচ্ছিলকারক তেল তৈরিতে।',
    note: 'এই অংশে তুলনামূলক ঘন সান্দ্র তরল ও অর্ধকঠিন মোমজাতীয় পদার্থ থাকে।',
  },
  {
    id: 'bitumen',
    nameBn: 'বিটুমিন (অবশেষ)',
    nameEn: 'Bitumen / Asphalt',
    tempRange: '340°C-এর উপরে',
    carbonRange: 'C₃₀-এর বেশি',
    color: '#1e293b',
    uses: 'রাস্তা পাকা করার পিচ ও ছাদের জলরোধী প্রলেপ তৈরিতে।',
    note: 'অতি উচ্চ স্ফুটনাঙ্কের কারণে কলামের নিচে ভারী অবশেষ হিসেবে থেকে যায়।',
  },
];

const SERIES_OPTIONS = [
  {
    id: 'alkane',
    label: 'অ্যালকেন',
    formula: 'CₙH₂ₙ₊₂',
    description: 'সম্পৃক্ত',
  },
  {
    id: 'alkene',
    label: 'অ্যালকিন',
    formula: 'CₙH₂ₙ',
    description: 'অসম্পৃক্ত',
  },
  {
    id: 'alkyne',
    label: 'অ্যালকাইন',
    formula: 'CₙH₂ₙ₋₂',
    description: 'অসম্পৃক্ত',
  },
] as const;

export default function MineralResourcesFossilsLab() {
  // Hydrocarbon states
  const [series, setSeries] =
    useState<HydrocarbonType>('alkene');

  const [carbonCount, setCarbonCount] = useState(2);

  const [bromineTested, setBromineTested] = useState(false);

  // Distillation states
  const [selectedFractionId, setSelectedFractionId] =
    useState('petrol');

  const [showAllNotes, setShowAllNotes] = useState(false);

  // ==========================================
  // HYDROCARBON CALCULATIONS
  // ==========================================

  const hydrogenCount =
    series === 'alkane'
      ? 2 * carbonCount + 2
      : series === 'alkene'
        ? 2 * carbonCount
        : 2 * carbonCount - 2;

  const prefix =
    CARBON_PREFIXES_BN[carbonCount] ??
    CARBON_PREFIXES_BN[2];

  const suffixBn =
    series === 'alkane'
      ? 'েন'
      : series === 'alkene'
        ? 'িন'
        : 'াইন';

  const suffixEn =
    series === 'alkane'
      ? 'ane'
      : series === 'alkene'
        ? 'ene'
        : 'yne';

  const compoundNameBn = `${prefix.root}${suffixBn}`;
  const compoundNameEn = `${prefix.en}${suffixEn}`;

  const molecularFormula =
    `C${carbonCount > 1 ? toSubscript(carbonCount) : ''}H${toSubscript(hydrogenCount)}`;

  const isUnsaturated = series !== 'alkane';

  const bondSymbol =
    series === 'alkane'
      ? 'C–C'
      : series === 'alkene'
        ? 'C=C'
        : 'C≡C';

  const bondName =
    series === 'alkane'
      ? 'একক বন্ধন'
      : series === 'alkene'
        ? 'দ্বিবন্ধন'
        : 'ত্রিবন্ধন';

  const activeFraction =
    DISTILLATION_FRACTIONS.find(
      (fraction) => fraction.id === selectedFractionId
    ) ?? DISTILLATION_FRACTIONS[0];

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleSeriesChange = (
    nextSeries: HydrocarbonType
  ) => {
    setSeries(nextSeries);
    setBromineTested(false);

    if (nextSeries !== 'alkane' && carbonCount < 2) {
      setCarbonCount(2);
    }
  };

  const handleCarbonChange = (value: number) => {
    setCarbonCount(value);
    setBromineTested(false);
  };

  const handleReset = () => {
    setSeries('alkene');
    setCarbonCount(2);
    setBromineTested(false);
    setSelectedFractionId('petrol');
    setShowAllNotes(false);
  };

  const handleBromineTest = () => {
    setBromineTested(true);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-7">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-emerald-700 sm:text-xs">
              <Activity className="h-4 w-4" />
              INTERACTIVE SCIENCE LAB
            </div>

            <h2 className="max-w-3xl text-xl font-black leading-tight tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              হাইড্রোকার্বন ও পেট্রোলিয়াম ল্যাব
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">
              অ্যালকেন, অ্যালকিন ও অ্যালকাইন তৈরি করো।
              ব্রোমিন পরীক্ষা চালাও এবং পেট্রোলিয়ামের
              আংশিক পাতন প্রক্রিয়া অন্বেষণ করো।
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
          >
            <RotateCcw className="h-4 w-4" />
            সব রিসেট
          </button>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <Atom className="h-4 w-4" />
              <span className="text-[10px] font-bold sm:text-xs">
                হাইড্রোকার্বন
              </span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-900">
              ৩ ধরনের সিরিজ
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <TestTube2 className="h-4 w-4" />
              <span className="text-[10px] font-bold sm:text-xs">
                পরীক্ষা
              </span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-900">
              Br₂ Test
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white bg-white/80 p-3 shadow-sm sm:col-span-1">
            <div className="flex items-center gap-2 text-orange-600">
              <Flame className="h-4 w-4" />
              <span className="text-[10px] font-bold sm:text-xs">
                পেট্রোলিয়াম
              </span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-900">
              ৭টি Fraction
            </p>
          </div>
        </div>
      </header>

      {/* ======================================
          SECTION 1: HYDROCARBON BUILDER
      ====================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Section Heading */}

        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FlaskConical className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  হাইড্রোকার্বন বিল্ডার
                </h3>
                <p className="text-[11px] text-slate-500 sm:text-xs">
                  Hydrocarbon Structure Simulator
                </p>
              </div>
            </div>

            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                isUnsaturated
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {isUnsaturated ? 'অসম্পৃক্ত' : 'সম্পৃক্ত'}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6 lg:p-7">

          {/* Series Selector */}

          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-700">
                ১. হাইড্রোকার্বনের শ্রেণি নির্বাচন করো
              </p>

              <span className="text-[10px] text-slate-400">
                Select series
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SERIES_OPTIONS.map((item) => {
                const selected = series === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleSeriesChange(item.id)
                    }
                    aria-pressed={selected}
                    className={`group rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 sm:p-4 ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-extrabold ${
                          selected
                            ? 'text-emerald-800'
                            : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-black text-slate-900">
                      {item.formula}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-slate-500">
                      {item.description} হাইড্রোকার্বন
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carbon Selector */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  ২. কার্বন পরমাণুর সংখ্যা নির্বাচন করো
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Carbon atoms (n)
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-center shadow-sm">
                <span className="block text-[10px] font-semibold text-slate-400">
                  Selected
                </span>
                <span className="text-xl font-black text-emerald-700">
                  n = {carbonCount}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={series === 'alkane' ? 1 : 2}
              max={6}
              step={1}
              value={carbonCount}
              onChange={(e) =>
                handleCarbonChange(Number(e.target.value))
              }
              aria-label="কার্বন পরমাণুর সংখ্যা"
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-100 accent-emerald-600"
            />

            <div className="mt-3 grid grid-cols-6 gap-2">
              {Array.from(
                {
                  length: series === 'alkane' ? 6 : 5,
                },
                (_, i) =>
                  i + (series === 'alkane' ? 1 : 2)
              ).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleCarbonChange(n)}
                  aria-pressed={carbonCount === n}
                  className={`rounded-lg py-2 text-xs font-bold transition ${
                    carbonCount === n
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Formula Results */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700">
                ৩. উৎপন্ন যৌগের বৈশিষ্ট্য
              </p>

              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Sparkles className="h-3.5 w-3.5" />
                Live Result
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Atom className="h-4 w-4" />
                  <span className="text-[10px] font-bold">
                    যৌগের নাম
                  </span>
                </div>

                <p className="mt-3 text-xl font-black text-slate-900">
                  {compoundNameBn}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {compoundNameEn}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <FlaskConical className="h-4 w-4" />
                  <span className="text-[10px] font-bold">
                    আণবিক সংকেত
                  </span>
                </div>

                <p className="mt-3 text-3xl font-black tracking-wide text-emerald-900">
                  {molecularFormula}
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  Molecular Formula
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="h-4 w-4" />
                  <span className="text-[10px] font-bold">
                    কার্বন বন্ধন
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-slate-900">
                  {bondSymbol}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {bondName}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================
              BROMINE TEST
          ================================== */}

          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Beaker className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    ব্রোমিন পানি পরীক্ষা
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Bromine Water Test
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBromineTest}
                disabled={bromineTested}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:cursor-default disabled:opacity-60"
              >
                <Droplets className="h-4 w-4" />
                {bromineTested ? 'পরীক্ষা সম্পন্ন' : 'Br₂ যোগ করো'}
              </button>
            </div>

            <div className="grid grid-cols-1 items-center gap-5 p-4 sm:grid-cols-[120px_1fr] sm:p-5">

              {/* Test Tube */}

              <div className="flex justify-center">
                <div className="relative flex h-36 w-20 items-start justify-center">
                  <div className="absolute top-1 h-5 w-12 rounded-t-lg border-2 border-b-0 border-slate-400 bg-slate-100/70" />

                  <div className="absolute bottom-1 h-[112px] w-12 overflow-hidden rounded-b-[22px] rounded-t-md border-2 border-t-0 border-slate-400 bg-white/80 shadow-inner">
                    <div
                      className={`absolute inset-x-0 bottom-0 transition-all duration-1000 ${
                        bromineTested && isUnsaturated
                          ? 'h-0'
                          : 'h-[68%]'
                      }`}
                      style={{
                        backgroundColor:
                          bromineTested && isUnsaturated
                            ? 'transparent'
                            : '#c2410c',
                      }}
                    />

                    {bromineTested && isUnsaturated && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                    )}

                    <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-white/60" />
                  </div>

                  <span className="absolute -bottom-3 text-[9px] font-bold text-slate-400">
                    Br₂ Solution
                  </span>
                </div>
              </div>

              {/* Test Explanation */}

              <div className="min-w-0">
                {!bromineTested ? (
                  <>
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                      পরীক্ষার অপেক্ষায়
                    </span>

                    <h5 className="mt-2 text-sm font-extrabold text-slate-900">
                      ব্রোমিন দ্রবণ প্রস্তুত
                    </h5>

                    <p className="mt-1 text-xs leading-6 text-slate-600">
                      লালচে-বাদামি ব্রোমিন দ্রবণ
                      ({' '}
                      <strong>Br₂</strong>
                      {' '} ) {compoundNameBn} (
                      {molecularFormula}
                      )-এর সাথে পরীক্ষা করতে বাটনে ক্লিক করো।
                    </p>
                  </>
                ) : isUnsaturated ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Positive Test
                    </span>

                    <h5 className="mt-2 text-sm font-extrabold text-emerald-800">
                      ব্রোমিনের বর্ণ দূর হয়েছে!
                    </h5>

                    <p className="mt-1 text-xs leading-6 text-slate-700">
                      {compoundNameBn} একটি অসম্পৃক্ত
                      হাইড্রোকার্বন। এর {bondSymbol} বন্ধনে
                      ব্রোমিন সংযোজন বিক্রিয়া ঘটায়।
                      ফলে লালচে-বাদামি বর্ণ বিলীন হয়।
                    </p>

                    <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-[10px] font-bold text-emerald-700">
                        পরীক্ষার সিদ্ধান্ত
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-800">
                        অসম্পৃক্ত হাইড্রোকার্বন শনাক্ত হয়েছে।
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-800">
                      <Info className="h-3 w-3" />
                      No Decolorization
                    </span>

                    <h5 className="mt-2 text-sm font-extrabold text-rose-800">
                      বর্ণ অপরিবর্তিত রয়েছে
                    </h5>

                    <p className="mt-1 text-xs leading-6 text-slate-700">
                      {compoundNameBn} একটি সম্পৃক্ত
                      হাইড্রোকার্বন। সাধারণ তাপমাত্রায় ও UV
                      আলো ছাড়া এটি ব্রোমিন পানিকে বর্ণহীন
                      করে না।
                    </p>

                    <div className="mt-3 rounded-xl border border-rose-200 bg-white p-3">
                      <p className="text-[10px] font-bold text-rose-700">
                        পরীক্ষার সিদ্ধান্ত
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-800">
                        সম্পৃক্ত হাইড্রোকার্বন শনাক্ত হয়েছে।
                      </p>
                    </div>
                  </>
                )}

                {bromineTested && (
                  <button
                    type="button"
                    onClick={() => setBromineTested(false)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 transition hover:text-slate-900"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    পরীক্ষা আবার করো
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-amber-100 bg-white/60 px-4 py-3 sm:px-5">
              <p className="flex items-start gap-2 text-[10px] leading-5 text-slate-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                পরীক্ষাটি সাধারণ তাপমাত্রায় এবং UV আলো থেকে দূরে
                সম্পন্ন করার ধারণা অনুসরণ করে। অ্যালকেন UV আলোতে
                ব্রোমিনের সাথে প্রতিস্থাপন বিক্রিয়া করতে পারে।
              </p>
            </div>
          </div>

          {/* Concept Note */}

          <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <div>
              <p className="text-xs font-extrabold text-blue-900">
                মনে রাখবে
              </p>
              <p className="mt-1 text-xs leading-6 text-blue-800">
                অ্যালকেনের সাধারণ সংকেত CₙH₂ₙ₊₂,
                অ্যালকিনের CₙH₂ₙ এবং অ্যালকাইনের
                CₙH₂ₙ₋₂। অ্যালকিনে দ্বিবন্ধন এবং
                অ্যালকাইনে ত্রিবন্ধন থাকে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          SECTION 2: FRACTIONAL DISTILLATION
      ====================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}

        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Layers className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  পেট্রোলিয়ামের আংশিক পাতন
                </h3>
                <p className="text-[11px] text-slate-500 sm:text-xs">
                  Fractional Distillation Simulator
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-bold text-rose-700">
              <Flame className="h-3.5 w-3.5" />
              Temperature Gradient
            </span>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-6 lg:p-7">

          {/* Temperature Overview */}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3.5">
              <div className="flex items-center gap-2 text-sky-700">
                <Droplets className="h-4 w-4" />
                <span className="text-[10px] font-bold">
                  কলামের উপরের অংশ
                </span>
              </div>
              <p className="mt-2 text-sm font-black text-sky-900">
                কম তাপমাত্রা
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3.5">
              <div className="flex items-center gap-2 text-orange-700">
                <Flame className="h-4 w-4" />
                <span className="text-[10px] font-bold">
                  কলামের নিচের অংশ
                </span>
              </div>
              <p className="mt-2 text-sm font-black text-orange-900">
                বেশি তাপমাত্রা
              </p>
            </div>
          </div>

          {/* Tower + Details */}

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">

            {/* Distillation Tower */}

            <div className="lg:col-span-7">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  পাতন কলামের স্তর নির্বাচন
                </p>
                <span className="text-[10px] text-slate-400">
                  Select a fraction
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                {/* Tower background */}

                <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b from-sky-300 via-amber-400 to-rose-600" />

                <div className="mb-3 flex items-center justify-between pl-2">
                  <span className="text-[10px] font-bold text-sky-700">
                    ঠান্ডা
                  </span>

                  <span className="text-[10px] font-bold text-rose-700">
                    গরম
                  </span>
                </div>

                <div className="space-y-2 pl-2">
                  {DISTILLATION_FRACTIONS.map(
                    (fraction, index) => {
                      const selected =
                        fraction.id === selectedFractionId;

                      return (
                        <button
                          key={fraction.id}
                          type="button"
                          onClick={() =>
                            setSelectedFractionId(fraction.id)
                          }
                          aria-pressed={selected}
                          className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 sm:p-3.5 ${
                            selected
                              ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <span
                            className="h-9 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor: fraction.color,
                            }}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold sm:text-sm">
                                {fraction.nameBn}
                              </span>

                              {selected && (
                                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                                  Selected
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-1 text-[10px] ${
                                selected
                                  ? 'text-slate-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {fraction.nameEn}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <span
                              className={`block text-[10px] font-bold sm:text-xs ${
                                selected
                                  ? 'text-amber-300'
                                  : 'text-slate-500'
                              }`}
                            >
                              {fraction.tempRange}
                            </span>

                            <ChevronRight
                              className={`ml-auto mt-1 h-3.5 w-3.5 ${
                                selected
                                  ? 'text-white'
                                  : 'text-slate-300 group-hover:text-slate-600'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 pl-2">
                  <span className="text-[10px] text-slate-500">
                    শীর্ষ: হালকা ভগ্নাংশ
                  </span>
                  <span className="text-[10px] text-slate-500">
                    তলদেশ: ভারী ভগ্নাংশ
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Fraction Details */}

            <div className="lg:col-span-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  নির্বাচিত ভগ্নাংশের বিবরণ
                </p>
                <span className="text-[10px] text-slate-400">
                  Details
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Color Banner */}

                <div
                  className="relative h-3"
                  style={{
                    backgroundColor: activeFraction.color,
                  }}
                />

                <div className="space-y-4 p-4 sm:p-5">

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Selected Fraction
                    </span>

                    <h4 className="mt-1 text-lg font-black text-slate-900">
                      {activeFraction.nameBn}
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      {activeFraction.nameEn}
                    </p>
                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                      <div className="flex items-center gap-1.5 text-rose-600">
                        <Thermometer className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold">
                          স্ফুটনাঙ্ক
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-black text-rose-800">
                        {activeFraction.tempRange}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Atom className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold">
                          কার্বন শিকল
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-black text-emerald-800">
                        {activeFraction.carbonRange}
                      </p>
                    </div>
                  </div>

                  {/* Uses */}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="mb-2 flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-extrabold text-slate-800">
                        প্রধান ব্যবহার
                      </span>
                    </div>

                    <p className="text-xs leading-6 text-slate-600">
                      {activeFraction.uses}
                    </p>
                  </div>

                  {/* Notes */}

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <div className="mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-amber-700" />
                      <span className="text-xs font-extrabold text-amber-900">
                        গুরুত্বপূর্ণ তথ্য
                      </span>
                    </div>

                    <p className="text-xs leading-6 text-amber-950">
                      {activeFraction.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Note */}

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <BookOpen className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-indigo-950">
                  আংশিক পাতনের মূলনীতি
                </h4>

                <p className="mt-1 text-xs leading-6 text-indigo-900">
                  অপরিশোধিত পেট্রোলিয়ামের বিভিন্ন উপাদানের
                  স্ফুটনাঙ্ক ভিন্ন হওয়ায় উত্তপ্ত বাষ্প
                  কলামের বিভিন্ন উচ্চতায় ঘনীভূত হয়।
                  কম স্ফুটনাঙ্কের উপাদান উপরে এবং বেশি
                  স্ফুটনাঙ্কের উপাদান নিচের দিকে সংগ্রহ করা হয়।
                </p>
              </div>
            </div>
          </div>

          {/* Temperature Caveat */}

          <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <p className="text-[10px] leading-5 text-slate-500">
              নোট: এখানে দেওয়া তাপমাত্রা ও কার্বন সংখ্যার
              পরিসর শিক্ষামূলক উদাহরণ হিসেবে দেখানো হয়েছে।
              বাস্তবে অপরিশোধিত তেলের উৎস ও রিফাইনারি
              প্রক্রিয়া অনুযায়ী ভগ্নাংশের পরিসর পরিবর্তিত হতে পারে।
            </p>
          </div>
        </div>
      </section>

      {/* ======================================
          FINAL LEARNING SUMMARY
      ====================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              আজকের শেখার বিষয়
            </h3>
            <p className="text-[10px] text-slate-500">
              Quick Learning Summary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3.5">
            <p className="text-xs font-extrabold text-slate-800">
              হাইড্রোকার্বন
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              কার্বন ও হাইড্রোজেন দিয়ে গঠিত যৌগ।
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5">
            <p className="text-xs font-extrabold text-slate-800">
              ব্রোমিন পরীক্ষা
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              অসম্পৃক্ততা শনাক্ত করার একটি গুরুত্বপূর্ণ পরীক্ষা।
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5">
            <p className="text-xs font-extrabold text-slate-800">
              আংশিক পাতন
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              বিভিন্ন স্ফুটনাঙ্কের ভিত্তিতে পেট্রোলিয়াম পৃথক করা হয়।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
