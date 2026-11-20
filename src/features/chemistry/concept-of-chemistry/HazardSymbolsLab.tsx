
'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  FlaskConical,
  Info,
  Radiation,
  ShieldAlert,
  Skull,
  Sparkles,
  Trees,
  Zap,
  Search,
  X,
  Wind,
  Cylinder,
  Droplets,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type RiskLevel = 'অতি উচ্চ' | 'উচ্চ' | 'মাঝারি';

type HazardItem = {
  id: string;
  nameBn: string;
  nameEn: string;
  symbolText: string;
  riskLevel: RiskLevel;
  examples: string[];
  danger: string;
  precautions: string[];
  icon: React.ElementType;
  theme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    iconBg: string;
    accent: string;
  };
};

// ============================================
// THEME
// ============================================

const THEMES = {
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-600 text-white',
    iconBg: 'bg-rose-100',
    accent: 'bg-rose-500',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-600 text-white',
    iconBg: 'bg-orange-100',
    accent: 'bg-orange-500',
  },
  slate: {
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-800',
    badge: 'bg-slate-800 text-white',
    iconBg: 'bg-slate-200',
    accent: 'bg-slate-600',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-600 text-white',
    iconBg: 'bg-amber-100',
    accent: 'bg-amber-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-600 text-white',
    iconBg: 'bg-yellow-100',
    accent: 'bg-yellow-500',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-600 text-white',
    iconBg: 'bg-blue-100',
    accent: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    badge: 'bg-purple-600 text-white',
    iconBg: 'bg-purple-100',
    accent: 'bg-purple-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-600 text-white',
    iconBg: 'bg-emerald-100',
    accent: 'bg-emerald-500',
  },
};

// ============================================
// HAZARD DATA
// ============================================

const HAZARD_SYMBOLS: HazardItem[] = [
  {
    id: 'explosive',
    nameBn: 'বিস্ফোরক পদার্থ',
    nameEn: 'Explosive',
    symbolText: 'বিস্ফোরিত বোমা',
    riskLevel: 'অতি উচ্চ',
    examples: ['টিএনটি (TNT)', 'নাইট্রোগ্লিসারিন', 'কিছু জৈব পার-অক্সাইড'],
    danger:
      'তাপ, আঘাত, ঘর্ষণ বা অন্য কোনো কারণে কিছু বিস্ফোরক পদার্থে আকস্মিক বিস্ফোরণ ঘটতে পারে। এতে গুরুতর আঘাত ও সম্পদের ক্ষতি হতে পারে।',
    precautions: [
      'এ ধরনের পদার্থ শিক্ষার্থীরা নিজেরা কখনো স্পর্শ বা পরীক্ষা করবে না।',
      'তাপ, আগুন, আঘাত ও ঘর্ষণ থেকে দূরে রাখতে হবে।',
      'শুধু অনুমোদিত প্রশিক্ষিত ব্যক্তির তত্ত্বাবধানে ব্যবস্থাপনা করতে হবে।',
    ],
    icon: Zap,
    theme: THEMES.rose,
  },
  {
    id: 'flammable',
    nameBn: 'দাহ্য পদার্থ',
    nameEn: 'Flammable',
    symbolText: 'আগুনের শিখা',
    riskLevel: 'অতি উচ্চ',
    examples: ['অ্যালকোহল', 'ইথার', 'পেট্রোল', 'অ্যাসিটোন'],
    danger:
      'এসব পদার্থ সহজেই আগুন ধরে ফেলতে পারে। এদের বাষ্পও বাতাসের সঙ্গে মিশে আগুন বা বিস্ফোরণের ঝুঁকি তৈরি করতে পারে।',
    precautions: [
      'আগুন, বার্নার ও স্ফুলিঙ্গের উৎস থেকে দূরে রাখতে হবে।',
      'প্রয়োজনীয় বায়ু চলাচলের ব্যবস্থা নিশ্চিত করতে হবে।',
      'ব্যবহারের পর পাত্রের মুখ ভালোভাবে বন্ধ রাখতে হবে।',
    ],
    icon: Flame,
    theme: THEMES.orange,
  },
  {
    id: 'toxic',
    nameBn: 'বিষাক্ত পদার্থ',
    nameEn: 'Acute Toxicity',
    symbolText: 'মাথার খুলি ও দুটি হাড়',
    riskLevel: 'অতি উচ্চ',
    examples: ['সায়ানাইড যৌগ', 'কিছু কীটনাশক', 'মিথানল'],
    danger:
      'শ্বাস-প্রশ্বাস, গলাধঃকরণ বা ত্বকের মাধ্যমে শরীরে প্রবেশ করলে তীব্র বিষক্রিয়া এবং গুরুতর স্বাস্থ্যঝুঁকি সৃষ্টি করতে পারে।',
    precautions: [
      'প্রশিক্ষক বা দায়িত্বপ্রাপ্ত ব্যক্তির নির্দেশ ছাড়া ব্যবহার করা যাবে না।',
      'কখনোই সরাসরি গন্ধ নেওয়া বা স্বাদ গ্রহণ করা যাবে না।',
      'নির্ধারিত সুরক্ষা সরঞ্জাম ও নিরাপদ ব্যবস্থাপনা অনুসরণ করতে হবে।',
    ],
    icon: Skull,
    theme: THEMES.slate,
  },
  {
    id: 'corrosive',
    nameBn: 'ক্ষয়কারী পদার্থ',
    nameEn: 'Corrosive',
    symbolText: 'হাত ও ধাতুর ওপর ফোঁটা',
    riskLevel: 'উচ্চ',
    examples: ['গাঢ় H₂SO₄', 'গাঢ় HCl', 'NaOH', 'HNO₃'],
    danger:
      'ত্বক ও চোখে লাগলে মারাত্মক রাসায়নিক দাহ সৃষ্টি করতে পারে। কিছু ক্ষয়কারী পদার্থ ধাতুরও ক্ষতি করে।',
    precautions: [
      'সুরক্ষা চশমা, উপযুক্ত গ্লাভস ও ল্যাব অ্যাপ্রন ব্যবহার করতে হবে।',
      'এসিড পাতলা করার সময় ধীরে ধীরে পানিতে এসিড যোগ করতে হবে; এসিডে পানি নয়।',
      'ত্বক বা চোখে লাগলে দ্রুত প্রচুর পানি দিয়ে ধুয়ে দায়িত্বপ্রাপ্ত ব্যক্তিকে জানাতে হবে।',
    ],
    icon: FlaskConical,
    theme: THEMES.amber,
  },
  {
    id: 'radioactive',
    nameBn: 'তেজস্ক্রিয় পদার্থ',
    nameEn: 'Radioactive',
    symbolText: 'তেজস্ক্রিয়তার ট্রিফয়েল',
    riskLevel: 'অতি উচ্চ',
    examples: ['ইউরেনিয়াম (U)', 'রেডিয়াম (Ra)', 'কোবাল্ট-৬০ (⁶⁰Co)'],
    danger:
      'তেজস্ক্রিয় পদার্থ থেকে নির্গত আয়নকারী বিকিরণ জীবকোষের ক্ষতি করতে পারে। দীর্ঘ বা অতিরিক্ত সংস্পর্শে ক্যান্সারসহ নানা স্বাস্থ্যঝুঁকি তৈরি হতে পারে।',
    precautions: [
      'শুধু অনুমোদিত ও প্রশিক্ষিত বিশেষজ্ঞের তত্ত্বাবধানে ব্যবস্থাপনা করতে হবে।',
      'বিকিরণের ধরন অনুযায়ী উপযুক্ত shielding ব্যবহার করতে হবে।',
      'সময় কমানো, নিরাপদ দূরত্ব বজায় রাখা এবং নির্ধারিত সুরক্ষা পদ্ধতি অনুসরণ করতে হবে।',
    ],
    icon: Radiation,
    theme: THEMES.yellow,
  },
  {
    id: 'irritant',
    nameBn: 'উত্তেজক পদার্থ',
    nameEn: 'Irritant / Harmful',
    symbolText: 'বিস্ময়সূচক চিহ্ন',
    riskLevel: 'মাঝারি',
    examples: ['কিছু লঘু অ্যাসিড', 'কিছু পরিষ্কারক', 'ক্ষতিকর বাষ্প'],
    danger:
      'ত্বক, চোখ বা শ্বাসতন্ত্রের সংস্পর্শে এলে জ্বালাপোড়া, চুলকানি, কাশি বা অ্যালার্জির মতো সমস্যা সৃষ্টি করতে পারে।',
    precautions: [
      'চোখ ও ত্বক সুরক্ষার জন্য প্রয়োজনীয় গগলস ও গ্লাভস পরতে হবে।',
      'ধুলা বা বাষ্প তৈরি হলে উপযুক্ত বায়ু চলাচল নিশ্চিত করতে হবে।',
      'ব্যবহারের পর হাত ভালোভাবে পরিষ্কার করতে হবে।',
    ],
    icon: AlertTriangle,
    theme: THEMES.blue,
  },
  {
    id: 'health-hazard',
    nameBn: 'স্বাস্থ্যঝুঁকিপূর্ণ পদার্থ',
    nameEn: 'Health Hazard',
    symbolText: 'বুকে তারকাযুক্ত মানবদেহ',
    riskLevel: 'উচ্চ',
    examples: ['বেনজিন', 'অ্যাসবেস্টস', 'কিছু কার্সিনোজেন'],
    danger:
      'দীর্ঘমেয়াদি সংস্পর্শে ক্যান্সার, শ্বাসতন্ত্রের রোগ, অঙ্গ-প্রত্যঙ্গের ক্ষতি বা প্রজননগত সমস্যা হতে পারে।',
    precautions: [
      'পদার্থের নিরাপত্তা তথ্যপত্র (SDS) অনুসরণ করতে হবে।',
      'প্রয়োজনে অনুমোদিত ফিউম হুড ব্যবহার করতে হবে।',
      'উপযুক্ত সুরক্ষা সরঞ্জাম ছাড়া সংস্পর্শে যাওয়া যাবে না।',
    ],
    icon: ShieldAlert,
    theme: THEMES.purple,
  },
  {
    id: 'environmental',
    nameBn: 'পরিবেশের জন্য ক্ষতিকর',
    nameEn: 'Environmental Hazard',
    symbolText: 'মৃত মাছ ও পাতাহীন গাছ',
    riskLevel: 'মাঝারি',
    examples: ['মার্কারি (Hg)', 'লেড (Pb)', 'কিছু কীটনাশক'],
    danger:
      'পরিবেশে ছড়িয়ে পড়লে পানি, মাটি ও জলজ প্রাণীর ক্ষতি করতে পারে। কিছু রাসায়নিক খাদ্যশৃঙ্খলেও প্রবেশ করতে পারে।',
    precautions: [
      'রাসায়নিক বর্জ্য সরাসরি ড্রেন বা নদীতে ফেলা যাবে না।',
      'নির্ধারিত রাসায়নিক বর্জ্য পাত্রে জমা রাখতে হবে।',
      'প্রতিষ্ঠানের অনুমোদিত বর্জ্য ব্যবস্থাপনা পদ্ধতি অনুসরণ করতে হবে।',
    ],
    icon: Trees,
    theme: THEMES.emerald,
  },
  {
    id: 'oxidizing',
    nameBn: 'জারক পদার্থ',
    nameEn: 'Oxidizing',
    symbolText: 'বৃত্তের ওপর আগুনের শিখা',
    riskLevel: 'উচ্চ',
    examples: ['পটাশিয়াম পারম্যাঙ্গানেট', 'কিছু পার-অক্সাইড', 'কনসেনট্রেটেড H₂O₂'],
    danger:
      'জারক পদার্থ নিজে সবসময় দাহ্য না হলেও অন্য পদার্থের দহন প্রক্রিয়াকে তীব্র করতে পারে এবং আগুনের ঝুঁকি বাড়াতে পারে।',
    precautions: [
      'দাহ্য পদার্থ থেকে আলাদা রাখতে হবে।',
      'তাপ ও অনুপযুক্ত পদার্থের সংস্পর্শ এড়িয়ে চলতে হবে।',
      'লেবেল ও নিরাপত্তা তথ্যপত্রের নির্দেশনা মেনে চলতে হবে।',
    ],
    icon: Wind,
    theme: THEMES.orange,
  },
  {
    id: 'gas',
    nameBn: 'চাপযুক্ত গ্যাস',
    nameEn: 'Gas Under Pressure',
    symbolText: 'গ্যাস সিলিন্ডার',
    riskLevel: 'উচ্চ',
    examples: ['অক্সিজেন সিলিন্ডার', 'কার্বন ডাই-অক্সাইড', 'নাইট্রোজেন'],
    danger:
      'উচ্চ চাপে সংরক্ষিত গ্যাসের পাত্র উত্তপ্ত হলে বা ক্ষতিগ্রস্ত হলে বিপদ ঘটতে পারে। কিছু গ্যাস শ্বাসরোধের ঝুঁকিও তৈরি করে।',
    precautions: [
      'সিলিন্ডার নিরাপদভাবে সোজা অবস্থায় স্থির রাখতে হবে।',
      'তাপ ও সরাসরি সূর্যালোক থেকে দূরে রাখতে হবে।',
      'শুধু প্রশিক্ষিত ব্যক্তির মাধ্যমে সিলিন্ডার ব্যবহার করতে হবে।',
    ],
    icon: Cylinder,
    theme: THEMES.blue,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function HazardSymbolsLab() {
  const [selectedId, setSelectedId] = useState('explosive');
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('সব');

  const selected =
    HAZARD_SYMBOLS.find((item) => item.id === selectedId) ??
    HAZARD_SYMBOLS[0];

  const ActiveIcon = selected.icon;

  const filteredHazards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return HAZARD_SYMBOLS.filter((item) => {
      const matchesSearch =
        !query ||
        item.nameBn.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.examples.some((example) =>
          example.toLowerCase().includes(query)
        );

      const matchesRisk =
        riskFilter === 'সব' || item.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [search, riskFilter]);

  const riskCounts = {
    total: HAZARD_SYMBOLS.length,
    veryHigh: HAZARD_SYMBOLS.filter(
      (item) => item.riskLevel === 'অতি উচ্চ'
    ).length,
    high: HAZARD_SYMBOLS.filter(
      (item) => item.riskLevel === 'উচ্চ'
    ).length,
    medium: HAZARD_SYMBOLS.filter(
      (item) => item.riskLevel === 'মাঝারি'
    ).length,
  };

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-7">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-wide text-emerald-700">
            <ShieldAlert className="h-4 w-4" />
            INTERACTIVE LAB SAFETY EXPLORER
          </div>

          <div className="mt-4 flex items-start gap-3 sm:gap-4">

            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <FlaskConical className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl lg:text-3xl">
                আন্তর্জাতিক সাংকেতিক চিহ্ন (GHS) ও ল্যাব নিরাপত্তা
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm">
                রাসায়নিক পদার্থের বিপদসংকেত, ঝুঁকির ধরন, পরিচিত উদাহরণ এবং
                পরীক্ষাগারে নিরাপদ থাকার নিয়ম ইন্টারঅ্যাকটিভভাবে শিখে নাও।
              </p>
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <GraduationCap className="h-4 w-4" />
            Class 9–10 Chemistry Learning Module
          </div>

        </div>
      </header>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">

        <StatCard
          label="মোট চিহ্ন"
          value={riskCounts.total}
          icon={ShieldCheck}
          color="emerald"
        />

        <StatCard
          label="অতি উচ্চ ঝুঁকি"
          value={riskCounts.veryHigh}
          icon={AlertTriangle}
          color="rose"
        />

        <StatCard
          label="উচ্চ ঝুঁকি"
          value={riskCounts.high}
          icon={Flame}
          color="orange"
        />

        <StatCard
          label="মাঝারি ঝুঁকি"
          value={riskCounts.medium}
          icon={Info}
          color="blue"
        />

      </section>

      {/* ======================================
          SYMBOL EXPLORER
      ====================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-4 sm:p-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                বিপদসংকেত নির্বাচন করো
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                যেকোনো একটি চিহ্ন নির্বাচন করে বিস্তারিত জানো।
              </p>
            </div>

            <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              {filteredHazards.length} / {HAZARD_SYMBOLS.length} Symbols
            </span>

          </div>

          {/* Search */}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="চিহ্ন, নাম বা রাসায়নিকের নাম খুঁজুন..."
                aria-label="বিপদসংকেত খুঁজুন"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Search clear"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              aria-label="ঝুঁকির মাত্রা দিয়ে ফিল্টার"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-44"
            >
              <option value="সব">সব ঝুঁকির মাত্রা</option>
              <option value="অতি উচ্চ">অতি উচ্চ</option>
              <option value="উচ্চ">উচ্চ</option>
              <option value="মাঝারি">মাঝারি</option>
            </select>

          </div>
        </div>

        {/* Symbol Grid */}

        <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-4">

          {filteredHazards.map((item) => {
            const Icon = item.icon;
            const active = selectedId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                aria-pressed={active}
                className={`
                  group relative flex min-w-0 flex-col items-center justify-center
                  rounded-xl border p-3 text-center
                  transition-all duration-200
                  sm:rounded-2xl sm:p-4
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                  ${
                    active
                      ? `${item.theme.bg} ${item.theme.border} ring-2 ring-emerald-500 shadow-md`
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50 hover:shadow-sm'
                  }
                `}
              >

                {active && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                )}

                {/* Illustrative symbol */}

                <div className="my-2 flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">

                  <div className="flex h-10 w-10 rotate-45 items-center justify-center rounded-md border-[2.5px] border-red-500 bg-white shadow-sm sm:h-12 sm:w-12">
                    <Icon className="-rotate-45 h-6 w-6 text-slate-900 sm:h-7 sm:w-7" strokeWidth={2} />
                  </div>

                </div>

                <h4 className="mt-2 text-xs font-bold leading-relaxed text-slate-900 sm:text-sm">
                  {item.nameBn}
                </h4>

                <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                  {item.nameEn}
                </p>

                <span
                  className={`mt-2 rounded-full px-2 py-1 text-[9px] font-bold sm:text-[10px] ${item.theme.badge}`}
                >
                  {item.riskLevel} ঝুঁকি
                </span>

              </button>
            );
          })}

          {filteredHazards.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 py-10 text-center">

              <Search className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-700">
                কোনো চিহ্ন পাওয়া যায়নি
              </p>

              <p className="mt-1 text-xs text-slate-500">
                অন্য নাম দিয়ে খুঁজে দেখো।
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setRiskFilter('সব');
                }}
                className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
              >
                সব ফিল্টার মুছে ফেলো
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ======================================
          DETAILS
      ====================================== */}

      <section
        aria-live="polite"
        className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5"
      >

        {/* Identity Card */}

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-5">

          <div className={`border-b p-4 sm:p-5 ${selected.theme.bg} ${selected.theme.border}`}>

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold sm:text-xs ${selected.theme.badge}`}>
                  ঝুঁকির মাত্রা: {selected.riskLevel}
                </span>

                <h3 className="mt-3 break-words text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {selected.nameBn}
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {selected.nameEn}
                </p>

              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white bg-white shadow-sm sm:h-16 sm:w-16">

                <ActiveIcon className="h-7 w-7 text-slate-800 sm:h-8 sm:w-8" />

              </div>

            </div>

          </div>

          <div className="space-y-4 p-4 sm:p-5">

            {/* Symbol Info */}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Symbol Description
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selected.symbolText}
              </p>
            </div>

            {/* Examples */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">

              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 sm:text-sm">
                <FlaskConical className="h-4 w-4 text-emerald-600" />
                পরিচিত রাসায়নিক উদাহরণ
              </h4>

              <div className="mt-3 flex flex-wrap gap-2">

                {selected.examples.map((example) => (
                  <span
                    key={example}
                    className="max-w-full break-words rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {example}
                  </span>
                ))}

              </div>

            </div>

            {/* Learning Tip */}

            <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">

              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  মনে রাখার বিষয়
                </h4>

                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  রাসায়নিক ব্যবহারের আগে বোতলের লেবেল এবং নিরাপত্তা তথ্যপত্র
                  (SDS) দেখে নিতে হবে।
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Risk and Precautions */}

        <div className="min-w-0 space-y-4 lg:col-span-7">

          {/* Danger */}

          <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <h4 className="text-sm font-bold text-rose-900 sm:text-base">
                  সম্ভাব্য ঝুঁকি ও ক্ষতিকর দিক
                </h4>

                <p className="mt-2 text-xs leading-6 text-slate-700 sm:text-sm">
                  {selected.danger}
                </p>

              </div>

            </div>

          </div>

          {/* Precautions */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                  পরীক্ষাগারে সতর্কতা ও করণীয়
                </h4>

                <p className="mt-0.5 text-xs text-slate-500">
                  Laboratory Safety Precautions
                </p>
              </div>

            </div>

            <div className="mt-4 space-y-3">

              {selected.precautions.map((step, index) => (
                <div
                  key={`${selected.id}-${index}`}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-emerald-50/70"
                >

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-700">
                    {index + 1}
                  </span>

                  <p className="min-w-0 text-xs leading-6 text-slate-700 sm:text-sm">
                    {step}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* General Safety Notice */}

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <h4 className="text-xs font-bold text-amber-900">
                গুরুত্বপূর্ণ নিরাপত্তা নির্দেশনা
              </h4>

              <p className="mt-1 text-xs leading-6 text-amber-800">
                এই ল্যাবটি শিক্ষামূলক। বাস্তবে কোনো রাসায়নিক দুর্ঘটনা ঘটলে
                শিক্ষক বা দায়িত্বপ্রাপ্ত ব্যক্তিকে জানাও এবং প্রতিষ্ঠানের
                জরুরি নিরাপত্তা নির্দেশনা অনুসরণ করো।
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-emerald-600" />

          <p className="text-xs font-semibold text-slate-600">
            Chemistry Interactive Learning Lab
          </p>
        </div>

        <p className="text-[10px] leading-5 text-slate-400 sm:text-right">
          GHS pictogram concepts • Class 9–10
        </p>

      </footer>

    </div>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'emerald' | 'rose' | 'orange' | 'blue';
}) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-3 sm:rounded-2xl sm:p-4">

      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${colors[color]}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] leading-4 text-slate-500 sm:text-xs">
          {label}
        </p>

        <p className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">
          {value}
        </p>
      </div>

    </div>
  );
}
