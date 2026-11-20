'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Atom,
  Filter,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
  Search,
  X,
  FlaskConical,
  CircleHelp,
  RotateCcw,
  ChevronRight,
  Hash,
  Zap,
  BookOpen,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'metalloid'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition';

interface ElementData {
  z: number;
  symbol: string;
  nameBn: string;
  nameEn: string;
  mass: number;
  period: number;
  group: number;
  category: ElementCategory;
  shells: number[];
  config: string;
  electronegativity: number | null;
  atomicRadiusPm: number;
  note: string;
}

type ElementRow = [
  number,
  string,
  string,
  string,
  number,
  number,
  number,
  ElementCategory,
  number[],
  string,
  number | null,
  number,
  string,
];

// ======================================================
// CATEGORY META
// ======================================================

const CATEGORY_META: Record<
  ElementCategory,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    solid: string;
    dot: string;
  }
> = {
  'alkali-metal': {
    label: 'ক্ষার ধাতু',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    solid: 'bg-rose-600',
    dot: 'bg-rose-500',
  },
  'alkaline-earth': {
    label: 'মৃৎক্ষার ধাতু',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    solid: 'bg-orange-600',
    dot: 'bg-orange-500',
  },
  'transition-metal': {
    label: 'অবস্থান্তর ধাতু',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    solid: 'bg-amber-600',
    dot: 'bg-amber-500',
  },
  'post-transition': {
    label: 'অন্যান্য ধাতু',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    solid: 'bg-teal-600',
    dot: 'bg-teal-500',
  },
  metalloid: {
    label: 'উপধাতু',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-800',
    solid: 'bg-cyan-600',
    dot: 'bg-cyan-500',
  },
  nonmetal: {
    label: 'অধাতু',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    solid: 'bg-emerald-600',
    dot: 'bg-emerald-500',
  },
  halogen: {
    label: 'হ্যালোজেন',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    solid: 'bg-blue-600',
    dot: 'bg-blue-500',
  },
  'noble-gas': {
    label: 'নিষ্ক্রিয় গ্যাস',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    solid: 'bg-purple-600',
    dot: 'bg-purple-500',
  },
};

const CATEGORY_KEYS = Object.keys(CATEGORY_META) as ElementCategory[];

// ======================================================
// ELEMENT DATA: 1–36
// ======================================================

const ELEMENT_ROWS: ElementRow[] = [
  [1, 'H', 'হাইড্রোজেন', 'Hydrogen', 1.008, 1, 1, 'nonmetal', [1], '1s¹', 2.2, 53, 'সবচেয়ে হালকা মৌল; গ্রুপ-১ এ থাকলেও এটি অধাতু।'],
  [2, 'He', 'হিলিয়াম', 'Helium', 4.003, 1, 18, 'noble-gas', [2], '1s²', null, 31, 'দ্বিত্ব পূর্ণ নিষ্ক্রিয় গ্যাস; বেলুনে ব্যবহৃত হয়।'],
  [3, 'Li', 'লিথিয়াম', 'Lithium', 6.94, 2, 1, 'alkali-metal', [2, 1], '1s² 2s¹', 0.98, 167, 'সবচেয়ে হালকা ধাতু; মোবাইল ব্যাটারিতে ব্যবহৃত হয়।'],
  [4, 'Be', 'বেরিলিয়াম', 'Beryllium', 9.012, 2, 2, 'alkaline-earth', [2, 2], '1s² 2s²', 1.57, 112, 'হালকা ও শক্ত মৃৎক্ষার ধাতু।'],
  [5, 'B', 'বোরন', 'Boron', 10.81, 2, 13, 'metalloid', [2, 3], '1s² 2s² 2p¹', 2.04, 87, 'উপধাতু; বোরোসিলিকেট কাঁচ তৈরিতে ব্যবহৃত হয়।'],
  [6, 'C', 'কার্বন', 'Carbon', 12.011, 2, 14, 'nonmetal', [2, 4], '1s² 2s² 2p²', 2.55, 67, 'সকল জৈব যৌগের মূল ভিত্তি (হীরা ও গ্রাফাইট)।'],
  [7, 'N', 'নাইট্রোজেন', 'Nitrogen', 14.007, 2, 15, 'nonmetal', [2, 5], '1s² 2s² 2p³', 3.04, 56, 'বায়ুমণ্ডলের প্রায় ৭৮% নাইট্রোজেন গ্যাস।'],
  [8, 'O', 'অক্সিজেন', 'Oxygen', 15.999, 2, 16, 'nonmetal', [2, 6], '1s² 2s² 2p⁴', 3.44, 48, 'শ্বসন ও দহনের জন্য অপরিহার্য।'],
  [9, 'F', 'ফ্লোরিন', 'Fluorine', 18.998, 2, 17, 'halogen', [2, 7], '1s² 2s² 2p⁵', 3.98, 42, 'পর্যায় সারণির সবচেয়ে বেশি তড়িৎ ঋণাত্মক মৌল।'],
  [10, 'Ne', 'নিয়ন', 'Neon', 20.18, 2, 18, 'noble-gas', [2, 8], '1s² 2s² 2p⁶', null, 38, 'অষ্টক পূর্ণ নিষ্ক্রিয় গ্যাস; নিয়ন সাইনবোর্ডে ব্যবহৃত হয়।'],
  [11, 'Na', 'সোডিয়াম', 'Sodium', 22.99, 3, 1, 'alkali-metal', [2, 8, 1], '[Ne] 3s¹', 0.93, 190, 'অত্যন্ত সক্রিয় ক্ষার ধাতু; কেরোসিনের নিচে রাখা হয়।'],
  [12, 'Mg', 'ম্যাগনেসিয়াম', 'Magnesium', 24.305, 3, 2, 'alkaline-earth', [2, 8, 2], '[Ne] 3s²', 1.31, 145, 'ক্লোরোফিলের কেন্দ্রীয় মৌল।'],
  [13, 'Al', 'অ্যালুমিনিয়াম', 'Aluminum', 26.982, 3, 13, 'post-transition', [2, 8, 3], '[Ne] 3s² 3p¹', 1.61, 118, 'ভূত্বকে সবচেয়ে বেশি প্রাপ্ত ধাতু।'],
  [14, 'Si', 'সিলিকন', 'Silicon', 28.085, 3, 14, 'metalloid', [2, 8, 4], '[Ne] 3s² 3p²', 1.9, 111, 'অর্ধপরিবাহী; কম্পিউটার চিপ তৈরিতে ব্যবহৃত হয়।'],
  [15, 'P', 'ফসফরাস', 'Phosphorus', 30.974, 3, 15, 'nonmetal', [2, 8, 5], '[Ne] 3s² 3p³', 2.19, 98, 'ডিএনএ ও হাড়ের গঠনে গুরুত্বপূর্ণ।'],
  [16, 'S', 'সালফার', 'Sulfur', 32.06, 3, 16, 'nonmetal', [2, 8, 6], '[Ne] 3s² 3p⁴', 2.58, 88, 'সালফিউরিক এসিড (H₂SO₄) তৈরিতে ব্যবহৃত হয়।'],
  [17, 'Cl', 'ক্লোরিন', 'Chlorine', 35.45, 3, 17, 'halogen', [2, 8, 7], '[Ne] 3s² 3p⁵', 3.16, 79, 'অধিক ইলেকট্রন আসক্তি বিশিষ্ট মৌলগুলোর একটি।'],
  [18, 'Ar', 'আর্গন', 'Argon', 39.948, 3, 18, 'noble-gas', [2, 8, 8], '[Ne] 3s² 3p⁶', null, 71, 'বৈদ্যুতিক বাল্বে ব্যবহৃত নিষ্ক্রিয় গ্যাস।'],
  [19, 'K', 'পটাশিয়াম', 'Potassium', 39.098, 4, 1, 'alkali-metal', [2, 8, 8, 1], '[Ar] 4s¹', 0.82, 243, '১৯তম ইলেকট্রন 3d-তে না গিয়ে 4s-এ প্রবেশ করে।'],
  [20, 'Ca', 'ক্যালসিয়াম', 'Calcium', 40.078, 4, 2, 'alkaline-earth', [2, 8, 8, 2], '[Ar] 4s²', 1.0, 194, 'হাড় ও দাঁতের প্রধান উপাদান।'],
  [21, 'Sc', 'স্ক্যান্ডিয়াম', 'Scandium', 44.956, 4, 3, 'transition-metal', [2, 8, 9, 2], '[Ar] 3d¹ 4s²', 1.36, 184, 'প্রথম d-ব্লক মৌল।'],
  [22, 'Ti', 'টাইটানিয়াম', 'Titanium', 47.867, 4, 4, 'transition-metal', [2, 8, 10, 2], '[Ar] 3d² 4s²', 1.54, 176, 'অত্যন্ত শক্তিশালী ও মরিচারোধী ধাতু।'],
  [23, 'V', 'ভ্যানাডিয়াম', 'Vanadium', 50.942, 4, 5, 'transition-metal', [2, 8, 11, 2], '[Ar] 3d³ 4s²', 1.63, 171, 'ইস্পাতকে শক্তিশালী করতে ব্যবহৃত হয়।'],
  [24, 'Cr', 'ক্রোমিয়াম', 'Chromium', 51.996, 4, 6, 'transition-metal', [2, 8, 13, 1], '[Ar] 3d⁵ 4s¹', 1.66, 166, 'ব্যতিক্রমী বিন্যাস; অর্ধপূর্ণ 3d⁵ অধিক স্থিতিশীল।'],
  [25, 'Mn', 'ম্যাঙ্গানিজ', 'Manganese', 54.938, 4, 7, 'transition-metal', [2, 8, 13, 2], '[Ar] 3d⁵ 4s²', 1.55, 161, 'বহু জারণ অবস্থা প্রদর্শন করে।'],
  [26, 'Fe', 'আয়রন (লোহা)', 'Iron', 55.845, 4, 8, 'transition-metal', [2, 8, 14, 2], '[Ar] 3d⁶ 4s²', 1.83, 156, 'পরিবর্তনশীল যোজনী (২ ও ৩) দেখায়।'],
  [27, 'Co', 'কোবাল্ট', 'Cobalt', 58.933, 4, 9, 'transition-metal', [2, 8, 15, 2], '[Ar] 3d⁷ 4s²', 1.88, 152, '⁶⁰Co আইসোটোপ ক্যান্সার চিকিৎসায় ব্যবহৃত হয়।'],
  [28, 'Ni', 'নিকেল', 'Nickel', 58.693, 4, 10, 'transition-metal', [2, 8, 16, 2], '[Ar] 3d⁸ 4s²', 1.91, 149, 'প্রভাবক (Catalyst) হিসেবে ব্যবহৃত হয়।'],
  [29, 'Cu', 'কপার (তামা)', 'Copper', 63.546, 4, 11, 'transition-metal', [2, 8, 18, 1], '[Ar] 3d¹⁰ 4s¹', 1.9, 145, 'মুদ্রা ধাতু; ব্যতিক্রমী বিন্যাস (পূর্ণ 3d¹⁰)।'],
  [30, 'Zn', 'জিংক (দস্তা)', 'Zinc', 65.38, 4, 12, 'transition-metal', [2, 8, 18, 2], '[Ar] 3d¹⁰ 4s²', 1.65, 142, 'গ্যালভানাইজিংয়ে লোহার মরিচা রোধে ব্যবহৃত হয়।'],
  [31, 'Ga', 'গ্যালিয়াম', 'Gallium', 69.723, 4, 13, 'post-transition', [2, 8, 18, 3], '[Ar] 3d¹⁰ 4s² 4p¹', 1.81, 136, 'প্রায় 29.8°C তাপমাত্রায় গলে যায়।'],
  [32, 'Ge', 'জার্মেনিয়াম', 'Germanium', 72.63, 4, 14, 'metalloid', [2, 8, 18, 4], '[Ar] 3d¹⁰ 4s² 4p²', 2.01, 125, 'উপধাতু; সেমিকন্ডাক্টর তৈরিতে ব্যবহৃত হয়।'],
  [33, 'As', 'আর্সেনিক', 'Arsenic', 74.922, 4, 15, 'metalloid', [2, 8, 18, 5], '[Ar] 3d¹⁰ 4s² 4p³', 2.18, 114, 'উপধাতু; ভূগর্ভস্থ পানিতে বিষক্রিয়া সৃষ্টি করতে পারে।'],
  [34, 'Se', 'সেলেনিয়াম', 'Selenium', 78.971, 4, 16, 'nonmetal', [2, 8, 18, 6], '[Ar] 3d¹⁰ 4s² 4p⁴', 2.55, 103, 'ফটোকপি মেশিন ও সোলার সেলে ব্যবহৃত হয়।'],
  [35, 'Br', 'ব্রোমিন', 'Bromine', 79.904, 4, 17, 'halogen', [2, 8, 18, 7], '[Ar] 3d¹⁰ 4s² 4p⁵', 2.96, 94, 'কক্ষ তাপমাত্রায় একমাত্র তরল অধাতু।'],
  [36, 'Kr', 'ক্রিপটন', 'Krypton', 83.798, 4, 18, 'noble-gas', [2, 8, 18, 8], '[Ar] 3d¹⁰ 4s² 4p⁶', 3.0, 88, 'উচ্চ ক্ষমতার ফ্ল্যাশ ল্যাম্পে ব্যবহৃত নিষ্ক্রিয় গ্যাস।'],
];

const ELEMENTS: ElementData[] = ELEMENT_ROWS.map((row) => ({
  z: row[0],
  symbol: row[1],
  nameBn: row[2],
  nameEn: row[3],
  mass: row[4],
  period: row[5],
  group: row[6],
  category: row[7],
  shells: row[8],
  config: row[9],
  electronegativity: row[10],
  atomicRadiusPm: row[11],
  note: row[12],
}));

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

function PropertyBar({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string;
  value: number | null;
  max: number;
  color: string;
  suffix: string;
}) {
  const percentage =
    value === null ? 0 : Math.min(100, (value / max) * 100);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          {label}
        </span>

        <span className="text-xs font-bold tabular-nums text-slate-900">
          {value !== null ? `${value} ${suffix}` : 'তথ্য নির্ধারিত নয়'}
        </span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value ?? 0}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function BohrModel({ element }: { element: ElementData }) {
  const center = 120;
  const shellNames = ['K', 'L', 'M', 'N'];

  return (
    <svg
      viewBox="0 0 240 240"
      className="mx-auto block aspect-square w-full max-w-[240px]"
      role="img"
      aria-label={`${element.nameEn} Bohr atomic model`}
    >
      <defs>
        <radialGradient id="bohrNucleusGradient">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {element.shells.map((electronCount, shellIdx) => {
        const radius = 32 + shellIdx * 18;

        return (
          <g key={shellIdx}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.4"
              strokeDasharray="3 3"
            />

            <text
              x={center + radius + 2}
              y={center - 4}
              fontSize="8"
              fill="#64748b"
            >
              {shellNames[shellIdx]}
            </text>

            {Array.from({ length: electronCount }, (_, index) => {
              const angle =
                (2 * Math.PI * index) / electronCount - Math.PI / 2;

              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}

      <circle
        cx={center}
        cy={center}
        r="17"
        fill="url(#bohrNucleusGradient)"
      />

      <text
        x={center}
        y={center + 3}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="10"
        fontWeight="bold"
      >
        {element.z}p⁺
      </text>
    </svg>
  );
}

function ElementTile({
  element,
  selected,
  dimmed = false,
  onClick,
}: {
  element: ElementData;
  selected: boolean;
  dimmed?: boolean;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[element.category];

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${element.nameEn} - ${element.nameBn}`}
      aria-label={`${element.nameEn}, atomic number ${element.z}`}
      aria-pressed={selected}
      className={`
        relative flex min-w-0 flex-col items-center justify-center
        rounded-lg border p-1.5 transition-all duration-200
        hover:z-10 hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-emerald-600
        ${meta.bg} ${meta.border}
        ${selected ? 'z-10 scale-[1.04] ring-2 ring-slate-900 shadow-md' : ''}
        ${dimmed ? 'opacity-20' : 'opacity-100'}
      `}
    >
      <span className="absolute left-1 top-1 text-[9px] font-bold text-slate-500">
        {element.z}
      </span>

      <span className={`mt-2 text-sm font-black sm:text-base ${meta.text}`}>
        {element.symbol}
      </span>

      <span className="w-full truncate text-center text-[8px] font-medium text-slate-600">
        {element.nameEn}
      </span>

      {selected && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-slate-900" />
      )}
    </button>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function PeriodicTableLab() {
  const [selected, setSelected] = useState<ElementData>(ELEMENTS[10]);
  const [activeFilter, setActiveFilter] = useState<ElementCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showDetails, setShowDetails] = useState(true);

  const meta = CATEGORY_META[selected.category];

  // ----------------------------------------------------
  // SEARCH + FILTER
  // ----------------------------------------------------

  const filteredElements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ELEMENTS.filter((element) => {
      const matchesCategory =
        activeFilter === 'all' || element.category === activeFilter;

      const matchesSearch =
        !query ||
        element.symbol.toLowerCase().includes(query) ||
        element.nameEn.toLowerCase().includes(query) ||
        element.nameBn.includes(search.trim()) ||
        String(element.z) === query;

      return matchesCategory && matchesSearch;
    });
  }, [search, activeFilter]);

  const categoryCounts = useMemo(() => {
    return ELEMENTS.reduce(
      (acc, element) => {
        acc[element.category] += 1;
        return acc;
      },
      {
        nonmetal: 0,
        'noble-gas': 0,
        'alkali-metal': 0,
        'alkaline-earth': 0,
        metalloid: 0,
        halogen: 0,
        'transition-metal': 0,
        'post-transition': 0,
      } as Record<ElementCategory, number>,
    );
  }, []);

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('all');
  };

  const selectElement = (element: ElementData) => {
    setSelected(element);
  };

  const selectNextElement = () => {
    const nextIndex = ELEMENTS.findIndex((item) => item.z === selected.z);
    setSelected(ELEMENTS[(nextIndex + 1) % ELEMENTS.length]);
  };

  const selectPreviousElement = () => {
    const currentIndex = ELEMENTS.findIndex((item) => item.z === selected.z);
    setSelected(ELEMENTS[(currentIndex - 1 + ELEMENTS.length) % ELEMENTS.length]);
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-5 text-white sm:rounded-3xl sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-emerald-300 sm:text-xs">
            <Activity className="h-4 w-4" />
            INTERACTIVE PERIODIC TABLE LAB
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                পর্যায় সারণি ও পর্যায়বৃত্ত ধর্ম
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                মৌলের গঠন, ইলেকট্রন বিন্যাস, শক্তিস্তর এবং পর্যায়বৃত্ত
                ধর্ম ইন্টারেক্টিভভাবে এক্সপ্লোর করো।
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                <Atom className="h-7 w-7 text-emerald-400" />
              </div>

              <div>
                <div className="text-2xl font-black">36</div>
                <div className="text-[10px] text-slate-400">
                  Available Elements
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-slate-300">
              <Atom className="mr-1 inline h-3 w-3 text-emerald-400" />
              Atomic Structure
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-slate-300">
              <Layers className="mr-1 inline h-3 w-3 text-emerald-400" />
              Electron Configuration
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-slate-300">
              <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-400" />
              Periodic Trends
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'মোট মৌল',
            value: ELEMENTS.length,
            description: 'Atomic number 1–36',
            icon: Atom,
            color: 'text-slate-900',
            iconColor: 'text-slate-500',
          },
          {
            label: 'ফিল্টারকৃত মৌল',
            value: filteredElements.length,
            description: 'Matching elements',
            icon: Filter,
            color: 'text-emerald-600',
            iconColor: 'text-emerald-600',
          },
          {
            label: 'নির্বাচিত মৌল',
            value: selected.symbol,
            description: `Atomic number ${selected.z}`,
            icon: Hash,
            color: 'text-blue-600',
            iconColor: 'text-blue-600',
          },
          {
            label: 'ক্যাটাগরি',
            value: CATEGORY_KEYS.length,
            description: 'Element categories',
            icon: Layers,
            color: 'text-purple-600',
            iconColor: 'text-purple-600',
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                  {stat.label}
                </p>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>

              <p className={`mt-2 text-xl font-black sm:text-2xl ${stat.color}`}>
                {stat.value}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* =================================================
          SEARCH AND FILTER
      ================================================= */}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Filter className="h-4 w-4 text-emerald-600" />
              মৌল খুঁজুন ও ফিল্টার করুন
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              বাংলা নাম, English name, Symbol অথবা Atomic Number দিয়ে খুঁজুন।
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-9 items-center gap-1.5 self-start rounded-lg px-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900 sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset filters
          </button>
        </div>

        {/* SEARCH INPUT */}

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="যেমন: Oxygen, অক্সিজেন, O, 8..."
            aria-label="Search chemical elements"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTERS */}

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Filter by category
          </p>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              aria-pressed={activeFilter === 'all'}
              className={`min-h-9 shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                activeFilter === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              সব মৌল ({ELEMENTS.length})
            </button>

            {CATEGORY_KEYS.map((categoryKey) => {
              const category = CATEGORY_META[categoryKey];
              const active = activeFilter === categoryKey;

              return (
                <button
                  key={categoryKey}
                  type="button"
                  onClick={() => setActiveFilter(categoryKey)}
                  aria-pressed={active}
                  className={`min-h-9 shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    active
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : `${category.bg} ${category.border} ${category.text} hover:brightness-95`
                  }`}
                >
                  {category.label} ({categoryCounts[categoryKey]})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-500">
            পাওয়া গেছে{' '}
            <strong className="text-slate-900">{filteredElements.length}</strong>{' '}
            টি মৌল
          </span>

          {(search || activeFilter !== 'all') && (
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              Filter active
            </span>
          )}
        </div>
      </section>

      {/* =================================================
          PERIODIC TABLE
      ================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-black text-slate-900 sm:text-base">
              Interactive Periodic Table
            </h3>
            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              যেকোনো মৌলে ক্লিক করে বিস্তারিত তথ্য দেখুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {filteredElements.length} Results
            </span>
          </div>
        </div>

        {/* DESKTOP PERIODIC TABLE */}

        <div className="hidden overflow-x-auto p-4 md:block lg:p-5">
          <div className="min-w-[760px]">
            <div
              className="mb-2 grid gap-1.5 text-center"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: 18 }, (_, index) => (
                <div
                  key={index}
                  className="text-[10px] font-bold text-slate-400"
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(4, minmax(68px, auto))',
              }}
            >
              {ELEMENTS.map((element) => {
                const isSelected = selected.z === element.z;

                const isDimmed = !filteredElements.some(
                  (item) => item.z === element.z,
                );

                return (
                  <div
                    key={element.z}
                    style={{
                      gridColumnStart: element.group,
                      gridRowStart: element.period,
                    }}
                  >
                    <ElementTile
                      element={element}
                      selected={isSelected}
                      dimmed={isDimmed}
                      onClick={() => selectElement(element)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-400">
            Group number উপরে এবং Period number বাম পাশে কল্পনা করে মৌলগুলোর অবস্থান বুঝে নাও।
          </p>
        </div>

        {/* MOBILE ELEMENT EXPLORER */}

        <div className="p-4 md:hidden">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-700">
              Elements Explorer
            </p>
            <span className="text-[10px] text-slate-400">
              Tap to select
            </span>
          </div>

          {filteredElements.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-4 sm:grid-cols-5">
              {filteredElements.map((element) => (
                <button
                  key={element.z}
                  type="button"
                  onClick={() => selectElement(element)}
                  aria-pressed={selected.z === element.z}
                  className={`relative flex min-w-0 flex-col items-center rounded-xl border p-3 text-center transition-all active:scale-95 ${
                    CATEGORY_META[element.category].bg
                  } ${CATEGORY_META[element.category].border} ${
                    selected.z === element.z
                      ? 'ring-2 ring-slate-900 shadow-md'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <span className="absolute left-2 top-1.5 text-[9px] font-bold text-slate-500">
                    {element.z}
                  </span>

                  <span
                    className={`mt-2 text-xl font-black ${
                      CATEGORY_META[element.category].text
                    }`}
                  >
                    {element.symbol}
                  </span>

                  <span className="mt-1 w-full truncate text-[10px] font-semibold text-slate-700">
                    {element.nameEn}
                  </span>

                  <span className="mt-1 text-[9px] text-slate-400">
                    G{element.group} · P{element.period}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <CircleHelp className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs font-bold text-slate-700">
                কোনো মৌল পাওয়া যায়নি
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Search অথবা filter পরিবর্তন করে দেখুন।
              </p>
            </div>
          )}
        </div>

        {/* CATEGORY LEGEND */}

        <div className="border-t border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Element Category Legend
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2.5">
            {CATEGORY_KEYS.map((categoryKey) => {
              const category = CATEGORY_META[categoryKey];

              return (
                <div key={categoryKey} className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${category.dot}`}
                  />
                  <span className="text-[10px] text-slate-600">
                    {category.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================
          EMPTY SEARCH STATE
      ================================================= */}

      {filteredElements.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <CircleHelp className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-3 font-bold text-slate-800">
            কোনো মৌল পাওয়া যায়নি!
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            অন্য নাম, Symbol অথবা Atomic Number দিয়ে চেষ্টা করুন।
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 min-h-10 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* =================================================
          ELEMENT INSPECTOR
      ================================================= */}

      <section className="scroll-mt-20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <Atom className="h-4 w-4 text-emerald-600" />
              </div>

              <h3 className="text-base font-black text-slate-900 sm:text-lg">
                Element Inspector
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              নির্বাচিত মৌলের বিস্তারিত বৈশিষ্ট্য ও গঠন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((previous) => !previous)}
            aria-expanded={showDetails}
            className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDetails && (
          <>
            {/* SELECTED ELEMENT NAVIGATION */}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                  Z = {selected.z}
                </span>

                <span className="text-xs font-bold text-slate-800">
                  {selected.symbol}
                </span>

                <span className="text-[10px] text-slate-400">
                  {selected.nameEn}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectPreviousElement}
                  aria-label="Previous element"
                  className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={selectNextElement}
                  aria-label="Next element"
                  className="flex h-9 items-center gap-1 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-700"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

              {/* ==========================================
                  LEFT: ELEMENT IDENTITY + BOHR MODEL
              ========================================== */}

              <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-5">
                {/* IDENTITY */}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold ${meta.bg} ${meta.border} ${meta.text}`}
                    >
                      {meta.label}
                    </span>

                    <h4 className="mt-3 break-words text-xl font-black text-slate-900 sm:text-2xl">
                      {selected.nameBn}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {selected.nameEn}
                    </p>
                  </div>

                  <div
                    className={`flex h-[82px] w-[82px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 ${meta.bg} ${meta.border}`}
                  >
                    <span className="text-[10px] font-bold text-slate-500">
                      {selected.z}
                    </span>

                    <span className={`text-3xl font-black ${meta.text}`}>
                      {selected.symbol}
                    </span>

                    <span className="text-[9px] text-slate-500">
                      Element
                    </span>
                  </div>
                </div>

                {/* BOHR MODEL */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Atom className="h-4 w-4 text-emerald-600" />
                      Bohr Atomic Model
                    </h5>

                    <span className="rounded-md bg-white px-2 py-1 text-[9px] text-slate-400">
                      Simplified model
                    </span>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <BohrModel element={selected} />
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {selected.shells.map((count, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center"
                      >
                        <p className="text-[10px] font-bold text-slate-400">
                          {['K', 'L', 'M', 'N'][index]}
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-700">
                          {count}e⁻
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-center text-[10px] font-bold text-slate-500">
                    খোলক বিন্যাস: {selected.shells.join(', ')}
                  </p>
                </div>

                {/* BASIC PROPERTIES */}

                <div>
                  <h5 className="mb-3 flex items-center gap-2 text-xs font-black text-slate-800">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Basic Atomic Properties
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: 'Atomic Number',
                        value: selected.z,
                      },
                      {
                        label: 'Atomic Mass',
                        value: selected.mass,
                      },
                      {
                        label: 'Period',
                        value: selected.period,
                      },
                      {
                        label: 'Group',
                        value: selected.group,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <p className="text-[10px] font-medium text-slate-500">
                          {item.label}
                        </p>

                        <p className="mt-1 break-words text-lg font-black text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ==========================================
                  RIGHT: ELECTRON CONFIGURATION + TRENDS
              ========================================== */}

              <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-7">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />

                  <h4 className="text-sm font-black text-slate-900 sm:text-base">
                    ইলেকট্রন বিন্যাস ও পর্যায়বৃত্ত ধর্ম
                  </h4>
                </div>

                {/* ELECTRON CONFIGURATION */}

                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />

                    <p className="text-xs font-bold text-indigo-700">
                      Subshell Electron Configuration
                    </p>
                  </div>

                  <p className="mt-3 break-all font-mono text-sm font-black leading-relaxed text-slate-900 sm:text-base">
                    {selected.config}
                  </p>

                  <p className="mt-2 text-[10px] text-indigo-600">
                    Electron configuration of {selected.nameEn}
                  </p>
                </div>

                {/* ELECTRON INFORMATION */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Layers className="h-4 w-4 text-blue-600" />
                      সর্ববহিঃস্থ শক্তিস্তর
                    </div>

                    <p className="mt-2 text-xl font-black text-slate-900">
                      {['K', 'L', 'M', 'N'][selected.period - 1]}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Principal quantum number n = {selected.period}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      সর্ববহিঃস্থ ইলেকট্রন
                    </div>

                    <p className="mt-2 text-xl font-black text-emerald-700">
                      {selected.shells[selected.shells.length - 1]} টি
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Outermost shell electrons
                    </p>
                  </div>
                </div>

                {/* PERIODIC TRENDS */}

                <div className="space-y-5 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />

                    <h5 className="text-xs font-black text-slate-800">
                      PERIODIC PROPERTIES
                    </h5>
                  </div>

                  <PropertyBar
                    label="পারমাণবিক ব্যাসার্ধ"
                    value={selected.atomicRadiusPm}
                    max={250}
                    color="bg-blue-500"
                    suffix="pm"
                  />

                  <PropertyBar
                    label="তড়িৎ ঋণাত্মকতা (Pauling Scale)"
                    value={selected.electronegativity}
                    max={4}
                    color="bg-emerald-500"
                    suffix=""
                  />

                  <p className="text-[10px] leading-relaxed text-slate-400">
                    তুলনামূলক বারটি প্রদত্ত সংখ্যার ভিত্তিতে তৈরি; এটি
                    মৌলগুলোর মধ্যে সরাসরি বৈজ্ঞানিক তুলনার বিকল্প নয়।
                  </p>
                </div>

                {/* SPECIAL NOTE */}

                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                  <div>
                    <p className="text-xs font-black text-emerald-900">
                      বিশেষ তথ্য
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-emerald-900 sm:text-sm">
                      {selected.note}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </section>

      {/* =================================================
          LEARNING TIP
      ================================================= */}

      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h4 className="text-xs font-black text-indigo-950 sm:text-sm">
              শেখার টিপস
            </h4>

            <p className="mt-1 text-xs leading-relaxed text-indigo-900">
              পর্যায় সারণিতে একই পর্যায়ে বাম থেকে ডানে গেলে সাধারণত
              পারমাণবিক ব্যাসার্ধ কমে এবং তড়িৎ ঋণাত্মকতা বাড়ে।
              একই গ্রুপে ওপর থেকে নিচে গেলে সাধারণত পারমাণবিক ব্যাসার্ধ বাড়ে।
              মৌল নির্বাচন করে তাদের তথ্য তুলনা করে এই প্রবণতাগুলো বোঝার চেষ্টা করো।
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 sm:p-4">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

        <p className="text-[10px] leading-relaxed text-blue-900 sm:text-xs">
          <strong>শিক্ষণীয় নোট:</strong> এখানে প্রথম ৩৬টি মৌলের তথ্য
          প্রদর্শন করা হয়েছে। Bohr Model একটি সরলীকৃত শিক্ষামূলক মডেল।
          পারমাণবিক ব্যাসার্ধের মান ব্যবহৃত সংজ্ঞা ও উৎস অনুযায়ী
          পরিবর্তিত হতে পারে। সর্ববহিঃস্থ খোলকের ইলেকট্রন সংখ্যা এবং
          যোজনী ইলেকট্রন সব ক্ষেত্রে একই ধারণা নয়।
        </p>
      </div>
    </div>
  );
}