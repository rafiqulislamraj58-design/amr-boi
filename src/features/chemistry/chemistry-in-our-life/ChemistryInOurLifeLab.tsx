'use client';

import React, { useState } from 'react';
import {
  Activity,
  Beaker,
  Droplets,
  FlaskConical,
  Info,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

type WaterType = 'soft' | 'hard';
type CleanerType = 'soap' | 'detergent';

interface HouseholdChemical {
  id: string;
  nameBn: string;
  nameEn: string;
  formula: string;
  category: string;
  reaction: string;
  usage: string;
  caution: string;
}

const HOUSEHOLD_CHEMICALS: HouseholdChemical[] = [
  {
    id: 'baking-powder',
    nameBn: 'বেকিং পাউডার',
    nameEn: 'Baking Powder',
    formula: 'NaHCO₃ + C₄H₆O₆',
    category: 'খাদ্য ও রান্নাঘর',
    reaction: 'NaHCO₃ + H⁺(টারটারিক এসিড) → Na⁺ + H₂O + CO₂↑',
    usage: 'কেক ও পাউরুটি তৈরিতে তাপ দিলে CO₂ গ্যাস নির্গত হয়ে ময়দাকে ফুলিয়ে নরম করে।',
    caution: 'শুষ্ক ও বায়ুরোধী পাত্রে রাখতে হয়, নাহলে আর্দ্রতায় আগেই বিক্রিয়া ঘটে যায়।',
  },
  {
    id: 'vinegar',
    nameBn: 'ভিনেগার (সিরকা)',
    nameEn: 'Vinegar',
    formula: '6–10% CH₃COOH (aq)',
    category: 'খাদ্য সংরক্ষণ',
    reaction: 'CH₃COOH(aq) ⇌ CH₃COO⁻ + H⁺ (ব্যাকটেরিয়ার প্রোটিন ধ্বংস করে)',
    usage: 'আচার, চাটনি ও খাদ্যদ্রব্য দীর্ঘদিন পচন থেকে রক্ষা করতে ব্যবহৃত হয়।',
    caution: 'অনুমোদিত মাত্রায় নিরাপদ; তবে অতিরিক্ত এসিডিক খাবার পাকস্থলীর জন্য ক্ষতিকর।',
  },
  {
    id: 'bleaching-powder',
    nameBn: 'ব্লিচিং পাউডার',
    nameEn: 'Bleaching Powder',
    formula: 'Ca(OCl)Cl',
    category: 'জীবাণুনাশক ও বিরঞ্জক',
    reaction: 'Ca(OCl)Cl + H₂O → Ca(OH)₂ + Cl₂;  HClO → HCl + [O] (জায়মান অক্সিজেন)',
    usage: 'কাপড়ের দাগ দূর করতে, মেঝে ও পানীয় জলের জীবাণু ধ্বংস করতে ব্যবহৃত হয়।',
    caution: 'সরাসরি ত্বক বা চোখে লাগানো যাবে না এবং এসিডের সাথে মেশালে বিষাক্ত Cl₂ গ্যাস তৈরি হয়।',
  },
  {
    id: 'glass-cleaner',
    nameBn: 'গ্লাস ক্লিনার',
    nameEn: 'Glass Cleaner',
    formula: 'NH₄OH (অ্যামোনিয়া দ্রবণ)',
    category: 'পরিষ্কারক',
    reaction: 'NH₄OH + তেল/চর্বি → দ্রবণীয় পদার্থ (কাচের SiO₂-এর সাথে বিক্রিয়া করে না)',
    usage: 'জানালার কাচ, আয়না ও চশমার তেল-চর্বিযুক্ত ময়লা পরিষ্কার করতে ব্যবহৃত হয়।',
    caution: 'ঝাঁঝালো গন্ধ থাকায় বদ্ধ ঘরে ব্যবহারের সময় পর্যাপ্ত বায়ু চলাচল নিশ্চিত করতে হবে।',
  },
  {
    id: 'toilet-cleaner',
    nameBn: 'টয়লেট ক্লিনার',
    nameEn: 'Toilet Cleaner',
    formula: 'NaOH + NaOCl',
    category: 'তীব্র ক্ষারীয় পরিষ্কারক',
    reaction: 'NaOH + চর্বি/ময়লা → দ্রবণীয় সাবানজাতীয় পদার্থ + NaOCl (জীবাণুনাশ)',
    usage: 'বেসিন ও কমোডের কঠিন দাগ, চর্বি ও জীবাণু দূর করতে ব্যবহৃত হয়।',
    caution: 'কস্টিক সোডা (NaOH) কাচের SiO₂-এর সাথে বিক্রিয়া করে কাচ নষ্ট করে, তাই এটি গ্লাস ক্লিনার হিসেবে ব্যবহার করা যায় না।',
  },
  {
    id: 'urea',
    nameBn: 'ইউরিয়া সার',
    nameEn: 'Urea Fertilizer',
    formula: 'NH₂-CO-NH₂',
    category: 'কৃষি রসায়ন',
    reaction: 'NH₂-CO-NH₂ + 2H₂O → (NH₄)₂CO₃ → 2NH₄⁺ + CO₃²⁻',
    usage: 'উদ্ভিদের দ্রুত বৃদ্ধি ও পাতার সবুজ রঙের জন্য নাইট্রোজেন (প্রায় ৪৬.৬৭%) সরবরাহ করে।',
    caution: 'অতিরিক্ত ইউরিয়া প্রয়োগে মাটির স্বাভাবিক উর্বরতা ও জলাশয়ের পরিবেশ ক্ষতিগ্রস্ত হয়।',
  },
];

export default function ChemistryInOurLifeLab() {
  // Section 1: Soap vs Detergent Simulator State
  const [waterType, setWaterType] = useState<WaterType>('hard');
  const [cleanerType, setCleanerType] = useState<CleanerType>('soap');
  const [isTested, setIsTested] = useState<boolean>(false);

  // Section 2: Household Chemical Explorer State
  const [selectedChemId, setSelectedChemId] = useState<string>('baking-powder');

  const activeChem =
    HOUSEHOLD_CHEMICALS.find((c) => c.id === selectedChemId) ??
    HOUSEHOLD_CHEMICALS[0];

  const isSoapInHardWater = waterType === 'hard' && cleanerType === 'soap';

  const foamHeightPercent = !isTested
    ? 0
    : isSoapInHardWater
    ? 12
    : cleanerType === 'detergent'
    ? 46
    : 40;

  const hasScum = isTested && isSoapInHardWater;

  const handleWaterChange = (next: WaterType) => {
    setWaterType(next);
    setIsTested(false);
  };

  const handleCleanerChange = (next: CleanerType) => {
    setCleanerType(next);
    setIsTested(false);
  };

  const handleReset = () => {
    setWaterType('hard');
    setCleanerType('soap');
    setIsTested(false);
    setSelectedChemId('baking-powder');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE EVERYDAY CHEMISTRY LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            সাবান বনাম ডিটারজেন্ট ও গৃহস্থালি রাসায়নিক ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            মৃদু ও খর পানিতে সাবান ও ডিটারজেন্টের ফেনা তৈরির পার্থক্য পরীক্ষা করো এবং দৈনন্দিন রাসায়নিক যৌগের বিক্রিয়া ও ব্যবহার বিশ্লেষণ করো।
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

      {/* Section 1: Soap vs Detergent in Hard/Soft Water */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              মৃদু ও খর পানিতে সাবান বনাম ডিটারজেন্ট পরীক্ষা
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              waterType === 'hard'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}
          >
            {waterType === 'hard' ? 'খর পানি (Ca²⁺ ও Mg²⁺ যুক্ত)' : 'মৃদু পানি (বিশুদ্ধ)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                ১. পানির ধরন নির্বাচন করো:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleWaterChange('soft')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                    waterType === 'soft'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  মৃদু পানি (Soft Water)
                </button>
                <button
                  type="button"
                  onClick={() => handleWaterChange('hard')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                    waterType === 'hard'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  খর পানি (Ca²⁺ / Mg²⁺)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                ২. পরিষ্কারক নির্বাচন করো:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCleanerChange('soap')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                    cleanerType === 'soap'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  সাবান (R-COONa)
                </button>
                <button
                  type="button"
                  onClick={() => handleCleanerChange('detergent')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                    cleanerType === 'detergent'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ডিটারজেন্ট (R-OSO₃Na)
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTested(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              বিকার ঝাঁকাও ও ফেনা পরীক্ষা করো
            </button>
          </div>

          {/* Visual Beaker & Observation */}
          <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
            {/* Beaker Visual */}
            <div className="w-28 h-36 rounded-b-2xl border-2 border-t-0 border-slate-400 bg-white relative overflow-hidden shrink-0">
              {/* Water Layer */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                style={{
                  height: '52%',
                  backgroundColor: hasScum ? '#cbd5e1' : '#bae6fd',
                }}
              />

              {/* Foam Layer */}
              {isTested && (
                <div
                  className="absolute left-0 right-0 bg-white/95 border-t border-b border-slate-200 transition-all duration-500 flex items-center justify-center"
                  style={{
                    bottom: '52%',
                    height: `${foamHeightPercent}%`,
                  }}
                >
                  <span className="text-[10px] font-extrabold text-slate-600">
                    {isSoapInHardWater ? 'অল্প ফেনা' : 'প্রচুর ফেনা'}
                  </span>
                </div>
              )}

              {/* Scum / Precipitate Layer at Bottom */}
              {hasScum && (
                <div className="absolute bottom-0 left-0 right-0 h-5 bg-slate-400/90 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">অদ্রবণীয় গাদ</span>
                </div>
              )}
            </div>

            {/* Result Text */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              {!isTested ? (
                <p>
                  বিকারে <strong>{waterType === 'hard' ? 'খর পানি' : 'মৃদু পানি'}</strong> এবং{' '}
                  <strong>{cleanerType === 'soap' ? 'সাবান' : 'ডিটারজেন্ট'}</strong> নেওয়া হয়েছে। ফলাফল দেখতে <em>&ldquo;বিকার ঝাঁকাও&rdquo;</em> বাটনে ক্লিক করো।
                </p>
              ) : isSoapInHardWater ? (
                <>
                  <p className="font-bold text-rose-700">
                    ফলাফল: ফেনা খুব কম হয়েছে এবং সাদা অদ্রবণীয় গাদ (Scum) জমেছে!
                  </p>
                  <p>
                    খর পানির Ca²⁺ ও Mg²⁺ আয়ন সাবানের সাথে বিক্রিয়া করে অদ্রবণীয় ক্যালসিয়াম/ম্যাগনেসিয়াম স্টিয়ারেট (গাদ) তৈরি করে, ফলে সাবানের অপচয় হয়।
                  </p>
                  <p className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
                    2R-COONa + Ca²⁺ → (R-COO)₂Ca↓ (গাদ) + 2Na⁺
                  </p>
                </>
              ) : cleanerType === 'detergent' && waterType === 'hard' ? (
                <>
                  <p className="font-bold text-emerald-700">
                    ফলাফল: খর পানিতেও প্রচুর ফেনা তৈরি হয়েছে এবং কোনো গাদ জমেনি!
                  </p>
                  <p>
                    ডিটারজেন্টের ক্যালসিয়াম ও ম্যাগনেসিয়াম লবণ পানিতে দ্রবণীয় হওয়ায় খর পানিতেও এটি সহজে ময়লা পরিষ্কার করতে পারে।
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-emerald-700">
                    ফলাফল: মৃদু পানিতে প্রচুর ফেনা তৈরি হয়েছে!
                  </p>
                  <p>
                    মৃদু পানিতে Ca²⁺ বা Mg²⁺ আয়ন না থাকায় {cleanerType === 'soap' ? 'সাবান' : 'ডিটারজেন্ট'} কোনো বাধা ছাড়াই সহজে ফেনা তৈরি করে।
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Household & Agro Chemicals Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">
            দৈনন্দিন ও কৃষি রাসায়নিক যৌগ বিশ্লেষক
          </h3>
        </div>

        {/* Chemical Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {HOUSEHOLD_CHEMICALS.map((chem) => {
            const isSelected = chem.id === selectedChemId;
            return (
              <button
                key={chem.id}
                type="button"
                onClick={() => setSelectedChemId(chem.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {chem.nameBn}
              </button>
            );
          })}
        </div>

        {/* Active Chemical Detail Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {activeChem.category}
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-1.5">
                {activeChem.nameBn} ({activeChem.nameEn})
              </h4>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-right">
              <p className="text-[10px] font-bold text-slate-500">রাসায়নিক সংকেত / উপাদান</p>
              <p className="font-mono text-sm font-extrabold text-emerald-800">
                {activeChem.formula}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <p className="text-[11px] font-bold text-slate-500">মূল রাসায়নিক বিক্রিয়া</p>
            <p className="font-mono text-xs sm:text-sm font-bold text-slate-800">
              {activeChem.reaction}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-0.5">ব্যবহার:</strong>
                {activeChem.usage}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 leading-relaxed">
                <strong className="block mb-0.5">সতর্কতা ও বিশেষ তথ্য:</strong>
                {activeChem.caution}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}