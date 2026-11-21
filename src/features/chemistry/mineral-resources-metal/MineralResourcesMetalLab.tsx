'use client';

import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

type ReactivityGroup = 'high' | 'medium' | 'low' | 'noble';

interface MetalExtractionItem {
  symbol: string;
  nameBn: string;
  oreName: string;
  oreFormula: string;
  group: ReactivityGroup;
  methodBn: string;
  reaction: string;
  note: string;
}

const REACTIVITY_METALS: MetalExtractionItem[] = [
  {
    symbol: 'K',
    nameBn: 'পটাশিয়াম',
    oreName: 'সিলভাইট',
    oreFormula: 'KCl',
    group: 'high',
    methodBn: 'তড়িৎ বিশ্লেষণ (Electrolysis)',
    reaction: 'ক্যাথোড: K⁺ + e⁻ → K',
    note: 'অত্যন্ত সক্রিয় ধাতু; গলিত ক্লোরাইড লবণের তড়িৎ বিশ্লেষণে নিষ্কাশিত হয়।',
  },
  {
    symbol: 'Na',
    nameBn: 'সোডিয়াম',
    oreName: 'রক সল্ট',
    oreFormula: 'NaCl',
    group: 'high',
    methodBn: 'তড়িৎ বিশ্লেষণ (Electrolysis)',
    reaction: 'ক্যাথোড: Na⁺ + e⁻ → Na',
    note: 'কার্বন দিয়ে বিজারিত করা যায় না; গলিত NaCl-এর তড়িৎ বিশ্লেষণ প্রয়োজন।',
  },
  {
    symbol: 'Al',
    nameBn: 'অ্যালুমিনিয়াম',
    oreName: 'বক্সাইট',
    oreFormula: 'Al₂O₃·2H₂O',
    group: 'high',
    methodBn: 'তড়িৎ বিশ্লেষণ (Electrolysis)',
    reaction: 'ক্যাথোড: Al³⁺ + 3e⁻ → Al',
    note: 'গলিত অ্যালুমিনা (Al₂O₃)-র সাথে ক্রায়োলাইট মিশিয়ে তড়িৎ বিশ্লেষণ করা হয়।',
  },
  {
    symbol: 'Zn',
    nameBn: 'জিংক',
    oreName: 'জিংক ব্লেন্ড / ক্যালামাইন',
    oreFormula: 'ZnS / ZnCO₃',
    group: 'medium',
    methodBn: 'কার্বন বিজারণ (Carbon Reduction)',
    reaction: 'ZnO + C → Zn + CO',
    note: 'প্রথমে তাপজারণ/ভস্মীকরণে ZnO তৈরি করে কার্বন দিয়ে বিজারিত করা হয়।',
  },
  {
    symbol: 'Fe',
    nameBn: 'আয়রন (লোহা)',
    oreName: 'হেমাটাইট',
    oreFormula: 'Fe₂O₃',
    group: 'medium',
    methodBn: 'কার্বন বিজারণ (বাত্যাচুল্লি)',
    reaction: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂',
    note: 'বাত্যাচুল্লিতে কোক (C) ও চুনাপাথর (CaCO₃) ব্যবহার করে বিজারণ করা হয়।',
  },
  {
    symbol: 'Pb',
    nameBn: 'লেড (সিসা)',
    oreName: 'গ্যালেনা',
    oreFormula: 'PbS',
    group: 'medium',
    methodBn: 'কার্বন বিজারণ (Carbon Reduction)',
    reaction: 'PbO + C → Pb + CO',
    note: 'গ্যালেনাকে তাপজারণ করে PbO বানিয়ে কার্বন দিয়ে বিজারিত করা হয়।',
  },
  {
    symbol: 'Cu',
    nameBn: 'কপার (তামা)',
    oreName: 'কপার গ্লান্স / চালকোপাইরাইট',
    oreFormula: 'Cu₂S / CuFeS₂',
    group: 'low',
    methodBn: 'স্ব-বিজারণ (Self-Reduction)',
    reaction: '2Cu₂O + Cu₂S → 6Cu + SO₂',
    note: 'কম সক্রিয় হওয়ায় তাপজারণের মাধ্যমেই স্ব-বিজারণ ঘটে কপার মুক্ত হয়।',
  },
  {
    symbol: 'Hg',
    nameBn: 'মার্কারি (পারদ)',
    oreName: 'সিনাবার',
    oreFormula: 'HgS',
    group: 'low',
    methodBn: 'স্ব-বিজারণ (তাপজারণ)',
    reaction: 'HgS + O₂ → Hg + SO₂',
    note: 'সিনাবারকে বাতাসে উত্তপ্ত করলেই সরাসরি তরল পারদ মুক্ত হয়।',
  },
  {
    symbol: 'Au',
    nameBn: 'গোল্ড (সোনা)',
    oreName: 'মুক্ত অবস্থা (Native)',
    oreFormula: 'Au',
    group: 'noble',
    methodBn: 'প্রকৃতিতে মুক্ত অবস্থায় পাওয়া যায়',
    reaction: 'কোনো রাসায়নিক বিজারণের প্রয়োজন নেই',
    note: 'সর্বনিম্ন সক্রিয় হওয়ায় অক্সিজেন বা পানির সাথে বিক্রিয়া করে না।',
  },
];

interface AlloyItem {
  id: string;
  nameBn: string;
  nameEn: string;
  composition: { element: string; percent: number; color: string }[];
  properties: string;
  uses: string;
}

const ALLOYS: AlloyItem[] = [
  {
    id: 'stainless-steel',
    nameBn: 'স্টেইনলেস স্টিল (মরিচাহীন ইস্পাত)',
    nameEn: 'Stainless Steel',
    composition: [
      { element: 'লোহা (Fe)', percent: 74, color: '#475569' },
      { element: 'ক্রোমিয়াম (Cr)', percent: 18, color: '#0ea5e9' },
      { element: 'নিকেল (Ni)', percent: 8, color: '#10b981' },
    ],
    properties: 'মরিচা পড়ে না, অত্যন্ত শক্ত ও উজ্জ্বল।',
    uses: 'ছুরি, কাঁচি, অস্ত্রোপচারের যন্ত্রপাতি ও রান্নার বাসনপত্র।',
  },
  {
    id: 'brass',
    nameBn: 'পিতল',
    nameEn: 'Brass',
    composition: [
      { element: 'কপার (Cu)', percent: 65, color: '#ea580c' },
      { element: 'জিংক (Zn)', percent: 35, color: '#64748b' },
    ],
    properties: 'সোনালি রঙের, নমনীয় এবং সহজে ক্ষয় হয় না।',
    uses: 'অলঙ্কার, বাদ্যযন্ত্র, তালা-চাবি ও বৈদ্যুতিক সুইচ।',
  },
  {
    id: 'bronze',
    nameBn: 'কাঁসা / ব্রোঞ্জ',
    nameEn: 'Bronze',
    composition: [
      { element: 'কপার (Cu)', percent: 90, color: '#c2410c' },
      { element: 'টিন (Sn)', percent: 10, color: '#94a3b8' },
    ],
    properties: 'অত্যন্ত শক্ত, টেকসই এবং ক্ষয়রোধী।',
    uses: 'ভাস্কর্য, পদক (মেডেল), ঘণ্টা ও থালা-বাসন।',
  },
  {
    id: 'duralumin',
    nameBn: 'ডুরালুমিন',
    nameEn: 'Duralumin',
    composition: [
      { element: 'অ্যালুমিনিয়াম (Al)', percent: 95, color: '#3b82f6' },
      { element: 'কপার (Cu)', percent: 4, color: '#ea580c' },
      { element: 'Mg ও Mn', percent: 1, color: '#f59e0b' },
    ],
    properties: 'অত্যন্ত হালকা কিন্তু ইস্পাতের মতো মজবুত।',
    uses: 'উড়োজাহাজের কাঠামো ও হালকা যন্ত্রাংশ তৈরি।',
  },
];

function getGroupBadge(group: ReactivityGroup): { label: string; className: string } {
  switch (group) {
    case 'high':
      return {
        label: 'অধিক সক্রিয় (তড়িৎ বিশ্লেষণ)',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    case 'medium':
      return {
        label: 'মধ্যম সক্রিয় (কার্বন বিজারণ)',
        className: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'low':
      return {
        label: 'কম সক্রিয় (স্ব-বিজারণ)',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    case 'noble':
      return {
        label: 'নিষ্ক্রিয় / মুক্ত ধাতু',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
  }
}

export default function MineralResourcesMetalLab() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('Fe');
  const [selectedAlloyId, setSelectedAlloyId] = useState<string>('stainless-steel');

  const activeMetal =
    REACTIVITY_METALS.find((m) => m.symbol === selectedSymbol) ??
    REACTIVITY_METALS[4];

  const activeAlloy =
    ALLOYS.find((a) => a.id === selectedAlloyId) ?? ALLOYS[0];

  const groupBadge = getGroupBadge(activeMetal.group);

  const handleReset = () => {
    setSelectedSymbol('Fe');
    setSelectedAlloyId('stainless-steel');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE METALLURGY &amp; ALLOY LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ধাতুর সক্রিয়তা সিরিজ, নিষ্কাশন পদ্ধতি ও সংকর ধাতু ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            যেকোনো ধাতু নির্বাচন করে তার আকরিক ও নিষ্কাশন পদ্ধতি দেখো এবং সংকর ধাতুর শতকরা সংযুতি বিশ্লেষণ করো।
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

      {/* Section 1: Interactive Reactivity Series & Extraction Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              ধাতুর সক্রিয়তা সিরিজ ও নিষ্কাশন পদ্ধতি
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${groupBadge.className}`}
          >
            {groupBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Vertical Reactivity Ladder */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1">
              <span>↑ সর্বাধিক সক্রিয়</span>
              <span>সর্বনিম্ন সক্রিয় ↓</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {REACTIVITY_METALS.map((metal, idx) => {
                const isSelected = metal.symbol === selectedSymbol;
                const dotColor =
                  metal.group === 'high'
                    ? 'bg-rose-500'
                    : metal.group === 'medium'
                    ? 'bg-amber-500'
                    : metal.group === 'low'
                    ? 'bg-sky-500'
                    : 'bg-emerald-500';

                return (
                  <button
                    key={metal.symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(metal.symbol)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">{metal.symbol}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-white' : dotColor
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[11px] font-semibold mt-0.5 truncate ${
                        isSelected ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {idx + 1}. {metal.nameBn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Metal Extraction Card */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  {activeMetal.nameBn} ({activeMetal.symbol})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্রধান আকরিক: <strong className="text-slate-800">{activeMetal.oreName}</strong> ({activeMetal.oreFormula})
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                {activeMetal.symbol}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" /> নিষ্কাশন পদ্ধতি
                </p>
                <p className="text-sm font-extrabold text-slate-900">
                  {activeMetal.methodBn}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">মূল বিক্রিয়া</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-emerald-800">
                  {activeMetal.reaction}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-950 leading-relaxed">
                {activeMetal.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Alloy Composition Visualizer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">
            সংকর ধাতু (Alloy) সংযুতি বিশ্লেষক
          </h3>
        </div>

        {/* Alloy Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {ALLOYS.map((alloy) => {
            const isSelected = alloy.id === selectedAlloyId;
            return (
              <button
                key={alloy.id}
                type="button"
                onClick={() => setSelectedAlloyId(alloy.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {alloy.nameBn}
              </button>
            );
          })}
        </div>

        {/* Alloy Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {activeAlloy.nameBn} ({activeAlloy.nameEn})
              </h4>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> ক্ষয়রোধী ও মজবুত
            </span>
          </div>

          {/* Stacked Composition Bar */}
          <div className="space-y-2">
            <div className="h-7 w-full rounded-xl overflow-hidden flex border border-slate-300 shadow-inner">
              {activeAlloy.composition.map((part) => (
                <div
                  key={part.element}
                  className="h-full flex items-center justify-center text-[11px] font-bold text-white transition-all duration-300"
                  style={{
                    width: `${part.percent}%`,
                    backgroundColor: part.color,
                  }}
                  title={`${part.element}: ${part.percent}%`}
                >
                  {part.percent >= 10 ? `${part.percent}%` : ''}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-1">
              {activeAlloy.composition.map((part) => (
                <div
                  key={part.element}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: part.color }}
                  />
                  <span>
                    {part.element}: {part.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
              <strong className="text-slate-900 block mb-1">বৈশিষ্ট্য:</strong>
              {activeAlloy.properties}
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
              <strong className="text-slate-900 block mb-1">প্রধান ব্যবহার:</strong>
              {activeAlloy.uses}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}