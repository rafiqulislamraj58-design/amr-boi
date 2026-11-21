
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Dna,
  Info,
  Layers,
  RotateCcw,
  Sparkles,
  XCircle,
  BookOpen,
  Microscope,
  GitCompareArrows,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Search,
  Leaf,
  Bug,
  FlaskConical,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

interface KingdomData {
  id: string;
  nameBn: string;
  nameEn: string;
  superKingdom: string;
  cellType: string;
  cellWall: string;
  nutrition: string;
  organelles: string;
  reproduction: string;
  organization: string;
  features: string[];
  examples: string[];
  color: string;
  bg: string;
}

interface ScientificPreset {
  commonBn: string;
  genus: string;
  species: string;
  code: 'ICN' | 'ICZN';
  category: 'উদ্ভিদ' | 'প্রাণী';
}

// ======================================================
// FIVE KINGDOM DATA
// ======================================================

const FIVE_KINGDOMS: KingdomData[] = [
  {
    id: 'monera',
    nameBn: 'মনেরা',
    nameEn: 'Monera',
    superKingdom: 'প্রোক্যারিওটা (Prokaryota)',
    cellType: 'আদিকোষী (Prokaryotic)',
    cellWall: 'অধিকাংশের কোষপ্রাচীর থাকে; সাধারণত পেপটিডোগ্লাইকানযুক্ত',
    nutrition: 'স্বভোজী অথবা পরভোজী',
    organelles: 'সুগঠিত নিউক্লিয়াস ও ঝিল্লিবেষ্টিত অঙ্গাণু নেই; রাইবোজোম আছে',
    reproduction: 'প্রধানত দ্বিবিভাজন',
    organization: 'প্রধানত এককোষী; কলোনি বা ফিলামেন্ট গঠন করতে পারে',
    features: [
      'সুগঠিত নিউক্লিয়াস অনুপস্থিত।',
      'নিউক্লিয়ার ঝিল্লি থাকে না।',
      'মাইটোকন্ড্রিয়া ও প্লাস্টিড অনুপস্থিত।',
      'রাইবোজোম উপস্থিত থাকে।',
      'কিছু সদস্য সালোকসংশ্লেষণ করতে পারে।',
    ],
    examples: ['ব্যাকটেরিয়া', 'নস্টক (Nostoc)', 'অ্যানাবিনা (Anabaena)'],
    color: '#0ea5e9',
    bg: 'bg-sky-50',
  },
  {
    id: 'protista',
    nameBn: 'প্রোটিস্টা',
    nameEn: 'Protista',
    superKingdom: 'ইউক্যারিওটা (Eukaryota)',
    cellType: 'প্রকৃতকোষী (Eukaryotic)',
    cellWall: 'কিছু সদস্যে কোষপ্রাচীর আছে, কিছু সদস্যে নেই',
    nutrition: 'স্বভোজী, পরভোজী অথবা মিশ্র পদ্ধতি',
    organelles: 'সুগঠিত নিউক্লিয়াস ও ঝিল্লিবেষ্টিত অঙ্গাণু আছে',
    reproduction: 'অযৌন ও যৌন উভয় প্রকার',
    organization: 'অধিকাংশ এককোষী; কিছু কলোনিয়াল বা বহুকোষী',
    features: [
      'সুগঠিত নিউক্লিয়াস থাকে।',
      'মাইটোকন্ড্রিয়া ও অন্যান্য অঙ্গাণু উপস্থিত।',
      'অধিকাংশ জলজ পরিবেশে বাস করে।',
      'কেউ সালোকসংশ্লেষণ করে, কেউ অন্য জীব থেকে খাদ্য গ্রহণ করে।',
      'চলনের জন্য সিলিয়া, ফ্লাজেলা বা ছদ্মপদ থাকতে পারে।',
    ],
    examples: ['অ্যামিবা (Amoeba)', 'প্যারামেসিয়াম (Paramecium)', 'ইউগ্লিনা (Euglena)'],
    color: '#8b5cf6',
    bg: 'bg-violet-50',
  },
  {
    id: 'fungi',
    nameBn: 'ফানজাই',
    nameEn: 'Fungi',
    superKingdom: 'ইউক্যারিওটা (Eukaryota)',
    cellType: 'প্রকৃতকোষী (Eukaryotic)',
    cellWall: 'প্রধানত কাইটিন (Chitin) নির্মিত',
    nutrition: 'পরভোজী; শোষণ পদ্ধতিতে খাদ্য গ্রহণ করে',
    organelles: 'সুগঠিত নিউক্লিয়াস আছে; ক্লোরোপ্লাস্ট নেই',
    reproduction: 'অযৌন ও যৌন; সাধারণত স্পোরের মাধ্যমে',
    organization: 'এককোষী অথবা হাইফা দ্বারা গঠিত বহুকোষী',
    features: [
      'ক্লোরোফিল ও ক্লোরোপ্লাস্ট নেই।',
      'কোষপ্রাচীর প্রধানত কাইটিন দিয়ে তৈরি।',
      'মৃতজীবী বা পরজীবী হিসেবে জীবনধারণ করে।',
      'অধিকাংশের দেহ হাইফা দিয়ে গঠিত।',
      'খাদ্য শোষণের মাধ্যমে গ্রহণ করে।',
    ],
    examples: ['ইস্ট (Yeast)', 'পেনিসিলিয়াম (Penicillium)', 'মাশরুম'],
    color: '#f59e0b',
    bg: 'bg-amber-50',
  },
  {
    id: 'plantae',
    nameBn: 'প্ল্যান্টি',
    nameEn: 'Plantae',
    superKingdom: 'ইউক্যারিওটা (Eukaryota)',
    cellType: 'প্রকৃতকোষী (Eukaryotic)',
    cellWall: 'সেলুলোজ (Cellulose) নির্মিত',
    nutrition: 'প্রধানত স্বভোজী; সালোকসংশ্লেষণ করে',
    organelles: 'ক্লোরোপ্লাস্ট, বড় কোষগহ্বর ও অন্যান্য অঙ্গাণু থাকে',
    reproduction: 'যৌন ও অযৌন উভয় প্রকার',
    organization: 'বহুকোষী',
    features: [
      'কোষে সুগঠিত নিউক্লিয়াস থাকে।',
      'কোষপ্রাচীর সেলুলোজ দিয়ে তৈরি।',
      'অধিকাংশে ক্লোরোফিল থাকে।',
      'সালোকসংশ্লেষণের মাধ্যমে খাদ্য তৈরি করে।',
      'দেহে বিভিন্ন ধরনের টিস্যু ও অঙ্গ দেখা যায়।',
    ],
    examples: ['মস', 'ফার্ন', 'আম', 'কাঁঠাল'],
    color: '#10b981',
    bg: 'bg-emerald-50',
  },
  {
    id: 'animalia',
    nameBn: 'অ্যানিম্যালিয়া',
    nameEn: 'Animalia',
    superKingdom: 'ইউক্যারিওটা (Eukaryota)',
    cellType: 'প্রকৃতকোষী (Eukaryotic)',
    cellWall: 'কোষপ্রাচীর অনুপস্থিত',
    nutrition: 'পরভোজী; সাধারণত খাদ্য গ্রহণ করে',
    organelles: 'নিউক্লিয়াস ও অন্যান্য অঙ্গাণু আছে; প্লাস্টিড নেই',
    reproduction: 'প্রধানত যৌন প্রজনন',
    organization: 'বহুকোষী; জটিল টিস্যু ও অঙ্গতন্ত্র থাকতে পারে',
    features: [
      'সুগঠিত নিউক্লিয়াস থাকে।',
      'কোষপ্রাচীর ও প্লাস্টিড অনুপস্থিত।',
      'অন্য জীবের ওপর খাদ্যের জন্য নির্ভরশীল।',
      'অধিকাংশ প্রাণী চলনক্ষম।',
      'উন্নত প্রাণীতে জটিল টিস্যু ও অঙ্গতন্ত্র থাকে।',
    ],
    examples: ['মানুষ', 'রয়েল বেঙ্গল টাইগার', 'ইলিশ', 'ব্যাঙ'],
    color: '#f43f5e',
    bg: 'bg-rose-50',
  },
];

// ======================================================
// SCIENTIFIC NAME PRESETS
// ======================================================

const SCIENTIFIC_PRESETS: ScientificPreset[] = [
  { commonBn: 'মানুষ', genus: 'Homo', species: 'sapiens', code: 'ICZN', category: 'প্রাণী' },
  { commonBn: 'ধান', genus: 'Oryza', species: 'sativa', code: 'ICN', category: 'উদ্ভিদ' },
  { commonBn: 'আম', genus: 'Mangifera', species: 'indica', code: 'ICN', category: 'উদ্ভিদ' },
  { commonBn: 'শাপলা', genus: 'Nymphaea', species: 'nouchali', code: 'ICN', category: 'উদ্ভিদ' },
  { commonBn: 'বাঘ', genus: 'Panthera', species: 'tigris', code: 'ICZN', category: 'প্রাণী' },
  { commonBn: 'ইলিশ', genus: 'Tenualosa', species: 'ilisha', code: 'ICZN', category: 'প্রাণী' },
  { commonBn: 'দোয়েল', genus: 'Copsychus', species: 'saularis', code: 'ICZN', category: 'প্রাণী' },
  { commonBn: 'পাট', genus: 'Corchorus', species: 'capsularis', code: 'ICN', category: 'উদ্ভিদ' },
  { commonBn: 'কাঁঠাল', genus: 'Artocarpus', species: 'heterophyllus', code: 'ICN', category: 'উদ্ভিদ' },
];

// ======================================================
// REUSABLE UI
// ======================================================

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">{title}</h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function StatusItem({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      {valid ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
      )}
      <span className="text-xs sm:text-sm text-slate-700">{children}</span>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function LessonsOnLifeLab() {
  const [selectedKingdomId, setSelectedKingdomId] = useState('monera');
  const [showComparison, setShowComparison] = useState(false);

  const [genusInput, setGenusInput] = useState('Homo');
  const [speciesInput, setSpeciesInput] = useState('sapiens');
  const [selectedPreset, setSelectedPreset] = useState<ScientificPreset | null>(
    SCIENTIFIC_PRESETS[0]
  );
  const [showAllPresets, setShowAllPresets] = useState(false);

  // ------------------------------------------------------
  // ACTIVE KINGDOM
  // ------------------------------------------------------

  const activeKingdom = useMemo(
    () =>
      FIVE_KINGDOMS.find((item) => item.id === selectedKingdomId) ??
      FIVE_KINGDOMS[0],
    [selectedKingdomId]
  );

  // ------------------------------------------------------
  // SCIENTIFIC NAME VALIDATION
  // ------------------------------------------------------

  const trimmedGenus = genusInput.trim();
  const trimmedSpecies = speciesInput.trim();

  const genusValid = /^[A-Z][a-z]+$/.test(trimmedGenus);
  const speciesValid = /^[a-z]+$/.test(trimmedSpecies);
  const noExtraSpaces =
    genusInput === genusInput.trim() &&
    speciesInput === speciesInput.trim();

  const hasBothParts = Boolean(trimmedGenus && trimmedSpecies);

  const isValidFormat =
    genusValid &&
    speciesValid &&
    noExtraSpaces &&
    hasBothParts;

  const matchingPreset = SCIENTIFIC_PRESETS.find(
    (preset) =>
      preset.genus === trimmedGenus &&
      preset.species === trimmedSpecies
  );

  const handlePreset = (preset: ScientificPreset) => {
    setGenusInput(preset.genus);
    setSpeciesInput(preset.species);
    setSelectedPreset(preset);
  };

  // ------------------------------------------------------
  // RESET
  // ------------------------------------------------------

  const handleReset = () => {
    setSelectedKingdomId('monera');
    setShowComparison(false);
    setGenusInput('Homo');
    setSpeciesInput('sapiens');
    setSelectedPreset(SCIENTIFIC_PRESETS[0]);
    setShowAllPresets(false);
  };

  // ------------------------------------------------------
  // COMPARISON DATA
  // ------------------------------------------------------

  const comparisonRows = [
    { label: 'কোষের ধরন', key: 'cellType' as const },
    { label: 'কোষপ্রাচীর', key: 'cellWall' as const },
    { label: 'খাদ্যগ্রহণ', key: 'nutrition' as const },
    { label: 'কোষীয় অঙ্গাণু', key: 'organelles' as const },
    { label: 'প্রজনন', key: 'reproduction' as const },
    { label: 'দেহের সংগঠন', key: 'organization' as const },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-slate-800 p-5 sm:p-7 text-white shadow-lg">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-teal-200 text-[10px] sm:text-xs font-bold tracking-wide">
              <Activity className="w-3.5 h-3.5" />
              INTERACTIVE BIOLOGY LAB
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold mt-4 leading-tight">
              পঞ্চরাজ্য শ্রেণিবিন্যাস ও
              <span className="text-teal-300"> দ্বিপদ নামকরণ</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-xl">
              জীবজগতের পাঁচটি রাজ্যের বৈশিষ্ট্য তুলনা করো, কোষের গঠন
              সম্পর্কে জানো এবং বৈজ্ঞানিক নামের আন্তর্জাতিক লেখার নিয়ম
              অনুশীলন করো।
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-[11px] text-teal-100">
                <Microscope className="w-3.5 h-3.5 inline mr-1.5" />
                Five Kingdoms
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-[11px] text-teal-100">
                <Dna className="w-3.5 h-3.5 inline mr-1.5" />
                Scientific Names
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>
        </div>
      </div>

      {/* =================================================
          KINGDOM EXPLORER
      ================================================= */}

      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-5 shadow-sm">

        <SectionHeading
          icon={Layers}
          title="পঞ্চরাজ্য শ্রেণিবিন্যাস এক্সপ্লোরার"
          subtitle="প্রতিটি রাজ্য নির্বাচন করে তার বৈশিষ্ট্য ও উদাহরণ দেখো।"
        />

        {/* Kingdom Cards */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FIVE_KINGDOMS.map((kingdom) => {
            const selected = selectedKingdomId === kingdom.id;

            return (
              <button
                key={kingdom.id}
                type="button"
                onClick={() => setSelectedKingdomId(kingdom.id)}
                aria-pressed={selected}
                className={`group p-3 rounded-2xl border text-left transition-all ${
                  selected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-300 text-slate-800'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl mb-3"
                  style={{ backgroundColor: kingdom.color }}
                />

                <p className="font-extrabold text-sm">{kingdom.nameBn}</p>
                <p className={`text-[10px] mt-1 ${
                  selected ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {kingdom.nameEn}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[9px] ${
                    selected ? 'text-teal-200' : 'text-slate-400'
                  }`}>
                    {selected ? 'নির্বাচিত' : 'বিস্তারিত দেখো'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 ${
                    selected ? 'text-teal-300' : 'text-slate-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Super Kingdom Banner */}

        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-teal-900">
              সুপার কিংডম
            </span>
          </div>
          <span className="text-xs font-extrabold text-teal-800">
            {activeKingdom.superKingdom}
          </span>
        </div>

        {/* Selected Kingdom Details */}

        <div className="rounded-2xl border border-slate-200 overflow-hidden">

          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl shrink-0"
                style={{ backgroundColor: activeKingdom.color }}
              />
              <div className="min-w-0">
                <h4 className="font-extrabold text-lg text-slate-900">
                  {activeKingdom.nameBn}
                </h4>
                <p className="text-xs text-slate-500">
                  {activeKingdom.nameEn} Kingdom
                </p>
              </div>
            </div>
          </div>

          {/* Properties */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 sm:p-5">

            {[
              { label: 'কোষের ধরন', value: activeKingdom.cellType, icon: Microscope },
              { label: 'কোষপ্রাচীর', value: activeKingdom.cellWall, icon: Layers },
              { label: 'খাদ্যগ্রহণ পদ্ধতি', value: activeKingdom.nutrition, icon: Leaf },
              { label: 'কোষীয় অঙ্গাণু', value: activeKingdom.organelles, icon: FlaskConical },
              { label: 'প্রজনন', value: activeKingdom.reproduction, icon: Activity },
              { label: 'দেহের সংগঠন', value: activeKingdom.organization, icon: GitCompareArrows },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-teal-600" />
                    <p className="text-[11px] font-bold text-slate-500">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Characteristics */}

          <div className="px-4 sm:px-5 pb-5 space-y-3">
            <h5 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              প্রধান বৈশিষ্ট্য
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeKingdom.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Examples */}

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100">
              <p className="text-xs font-extrabold text-teal-900 mb-2">
                উদাহরণ
              </p>
              <div className="flex flex-wrap gap-2">
                {activeKingdom.examples.map((example) => (
                  <span
                    key={example}
                    className="px-3 py-1.5 rounded-lg bg-white border border-teal-200 text-xs font-semibold text-teal-800"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Super Kingdom Summary */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
            <p className="text-xs font-extrabold text-sky-900">
              Prokaryota
            </p>
            <p className="text-[11px] text-sky-800 mt-1">
              আদিকোষী জীব
            </p>
            <div className="mt-3">
              <span className="inline-flex px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-sky-800">
                Monera
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
            <p className="text-xs font-extrabold text-violet-900">
              Eukaryota
            </p>
            <p className="text-[11px] text-violet-800 mt-1">
              প্রকৃতকোষী জীব
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Protista', 'Fungi', 'Plantae', 'Animalia'].map((name) => (
                <span key={name} className="px-2.5 py-1.5 rounded-lg bg-white text-[10px] font-bold text-violet-800">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Toggle */}

        <button
          type="button"
          onClick={() => setShowComparison((prev) => !prev)}
          className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <span className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <GitCompareArrows className="w-4 h-4" />
            পাঁচ রাজ্যের তুলনামূলক ছক
          </span>
          {showComparison ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showComparison && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-xs font-bold sticky left-0 bg-slate-900">
                    বৈশিষ্ট্য
                  </th>
                  {FIVE_KINGDOMS.map((kingdom) => (
                    <th key={kingdom.id} className="p-3 text-xs font-bold">
                      {kingdom.nameEn}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={row.key} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-3 text-xs font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-inherit">
                      {row.label}
                    </td>
                    {FIVE_KINGDOMS.map((kingdom) => (
                      <td
                        key={kingdom.id}
                        className="p-3 text-xs text-slate-600 leading-relaxed border-r border-slate-100"
                      >
                        {kingdom[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =================================================
          BINOMIAL NOMENCLATURE VALIDATOR
      ================================================= */}

      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-5 shadow-sm">

        <SectionHeading
          icon={Dna}
          title="দ্বিপদ নামকরণ যাচাইকারী"
          subtitle="নিজে বৈজ্ঞানিক নাম লিখে নামকরণের মৌলিক গঠন পরীক্ষা করো।"
        />

        {/* Preset Selection */}

        <div className="space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="text-xs font-bold text-slate-700">
              পরিচিত বৈজ্ঞানিক নাম নির্বাচন করো
            </p>
            <button
              type="button"
              onClick={() => setShowAllPresets((prev) => !prev)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              {showAllPresets ? 'কম দেখাও' : 'সব উদাহরণ দেখো'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SCIENTIFIC_PRESETS.slice(0, showAllPresets ? undefined : 5).map((preset) => {
              const selected = selectedPreset?.commonBn === preset.commonBn;

              return (
                <button
                  key={preset.commonBn}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    selected
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {preset.commonBn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="genus-input" className="block text-xs font-bold text-slate-700">
              ১ম পদ: গণ (Genus)
            </label>
            <input
              id="genus-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={genusInput}
              onChange={(e) => {
                setGenusInput(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="যেমন: Homo"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <p className="text-[10px] text-slate-500">
              প্রথম অক্ষর বড় হাতের, বাকিগুলো ছোট হাতের।
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="species-input" className="block text-xs font-bold text-slate-700">
              ২য় পদ: প্রজাতিগত নাম (Specific Epithet)
            </label>
            <input
              id="species-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={speciesInput}
              onChange={(e) => {
                setSpeciesInput(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="যেমন: sapiens"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <p className="text-[10px] text-slate-500">
              সব অক্ষর ছোট হাতের হবে।
            </p>
          </div>
        </div>

        {/* Validation Status */}

        <div className={`rounded-2xl border p-4 ${
          isValidFormat
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {isValidFormat ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <p className={`text-sm font-extrabold ${
              isValidFormat ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {isValidFormat
                ? 'লেখার ফরম্যাট সঠিক!'
                : 'বৈজ্ঞানিক নামের ফরম্যাটে সমস্যা আছে'}
            </p>
          </div>

          <p className={`text-xs mt-2 leading-relaxed ${
            isValidFormat ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {isValidFormat
              ? 'নামটি দ্বিপদ নামকরণের মৌলিক অক্ষর ও বিন্যাসের নিয়ম মেনে লেখা হয়েছে।'
              : 'গণ ও প্রজাতিগত নামের বানান, বড়-ছোট হাতের অক্ষর এবং দুটি পদের উপস্থিতি পরীক্ষা করো।'}
          </p>
        </div>

        {/* Preview */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <p className="text-xs font-extrabold text-slate-800">
                বৈজ্ঞানিক নামের প্রিভিউ
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-2">
                PRINTED FORMAT
              </p>
              <p className="text-2xl font-serif font-bold italic text-slate-900 break-all">
                {trimmedGenus || 'Genus'} {trimmedSpecies || 'species'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-3">
                HANDWRITTEN FORMAT
              </p>
              <div className="flex justify-center flex-wrap gap-3 font-serif font-bold text-lg text-slate-900">
                <span className="underline decoration-2 underline-offset-4 break-all">
                  {trimmedGenus || 'Genus'}
                </span>
                <span className="underline decoration-2 underline-offset-4 break-all">
                  {trimmedSpecies || 'species'}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist */}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <p className="text-xs font-extrabold text-slate-800">
                নামকরণের নিয়ম যাচাই
              </p>
            </div>

            <StatusItem valid={hasBothParts}>
              দুটি পদই লেখা হয়েছে।
            </StatusItem>

            <StatusItem valid={genusValid}>
              গণের নামের প্রথম অক্ষর বড় হাতের এবং পরের অক্ষরগুলো ছোট হাতের।
            </StatusItem>

            <StatusItem valid={speciesValid}>
              প্রজাতিগত নামের সব অক্ষর ছোট হাতের।
            </StatusItem>

            <StatusItem valid={noExtraSpaces}>
              প্রতিটি পদের আগে বা পরে অতিরিক্ত স্পেস নেই।
            </StatusItem>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-600">
                প্রযোজ্য নামকরণ কোড
              </p>
              <p className="text-sm font-extrabold text-teal-800 mt-1">
                {matchingPreset
                  ? matchingPreset.code
                  : 'ICN / ICZN'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                ICN উদ্ভিদ, ছত্রাক ও শৈবালের জন্য এবং ICZN প্রাণীর জন্য ব্যবহৃত হয়।
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Accuracy Note */}

        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-amber-900">
              গুরুত্বপূর্ণ বৈজ্ঞানিক সতর্কতা
            </p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              এই টুলটি বৈজ্ঞানিক নামের লেখার মৌলিক ফরম্যাট পরীক্ষা করে।
              শুধু ফরম্যাট সঠিক হলেই কোনো নাম বাস্তবে স্বীকৃত বৈজ্ঞানিক নাম
              প্রমাণিত হয় না। প্রকৃত নামের সঠিকতা যাচাই করতে স্বীকৃত
              Taxonomic Database ব্যবহার করতে হবে।
            </p>
          </div>
        </div>

        {/* Rules */}

        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-800">
            দ্বিপদ নামকরণের ৫টি গুরুত্বপূর্ণ নিয়ম
          </h4>

          {[
            'বৈজ্ঞানিক নাম দুটি পদ নিয়ে গঠিত হয়।',
            'প্রথম পদ গণের নাম এবং দ্বিতীয় পদ প্রজাতিগত নাম।',
            'গণের নামের প্রথম অক্ষর বড় হাতের হয়।',
            'প্রজাতিগত নামের সব অক্ষর ছোট হাতের হয়।',
            'ছাপার সময় Italic এবং হাতে লেখার সময় দুটি পদের নিচে আলাদাভাবে দাগ দিতে হয়।',
          ].map((rule, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <span className="w-6 h-6 shrink-0 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center text-[10px] font-extrabold">
                {index + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          QUICK REVISION
      ================================================= */}

      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-teal-950 p-5 sm:p-6 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-300" />
          <h3 className="font-extrabold text-base sm:text-lg">
            Quick Revision — মনে রাখবে
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'পঞ্চরাজ্যের প্রবর্তক',
              value: 'R. H. Whittaker — 1969',
            },
            {
              title: 'দুটি সুপার কিংডম',
              value: 'Prokaryota ও Eukaryota',
            },
            {
              title: 'কাইটিন নির্মিত কোষপ্রাচীর',
              value: 'Fungi',
            },
            {
              title: 'সেলুলোজ নির্মিত কোষপ্রাচীর',
              value: 'Plantae',
            },
            {
              title: 'আধুনিক শ্রেণিবিন্যাসের জনক',
              value: 'Carolus Linnaeus',
            },
            {
              title: 'দ্বিপদ নামকরণ',
              value: 'Genus + Specific Epithet',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-[10px] text-teal-300 font-bold">
                {item.title}
              </p>
              <p className="text-xs sm:text-sm font-extrabold mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed border-t border-white/10 pt-3">
          Class 9–10 Biology | Chapter 1: জীবনের পাঠ | Interactive Learning Lab
        </p>
      </section>
    </div>
  );
}
