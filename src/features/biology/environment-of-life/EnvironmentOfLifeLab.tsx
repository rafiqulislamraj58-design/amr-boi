'use client';

import React, { useState } from 'react';
import {
  Activity,
  Info,
  Layers,
  Leaf,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface InteractionItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'ধনাত্মক (Positive)' | 'ঋণাত্মক (Negative)';
  effectBadge: string;
  description: string;
  examples: string;
}

const INTERACTIONS: InteractionItem[] = [
  {
    id: 'mutualism',
    nameBn: 'মিউচুয়ালিজম',
    nameEn: 'Mutualism',
    category: 'ধনাত্মক (Positive)',
    effectBadge: 'জীব ১ (+)  |  জীব ২ (+)',
    description:
      'দুটি ভিন্ন প্রজাতির জীব একসাথে বসবাস করে এবং উভয়ই একে অপরের দ্বারা উপকৃত হয়।',
    examples: 'লাইকেন (শৈবাল + ছত্রাক), ফুল ও মৌমাছি, শিমজাতীয় উদ্ভিদের মূলে রাইজোবিয়াম ব্যাকটেরিয়া।',
  },
  {
    id: 'commensalism',
    nameBn: 'কমেনসালিজম',
    nameEn: 'Commensalism',
    category: 'ধনাত্মক (Positive)',
    effectBadge: 'জীব ১ (+)  |  জীব ২ (০)',
    description:
      'এতে একটি জীব উপকৃত হয়, কিন্তু অন্য জীবটির কোনো উপকার বা ক্ষতি কোনোটাই হয় না।',
    examples: 'বড় গাছের ডালে জন্মানো পরাশ্রয়ী উদ্ভিদ (যেমন অর্কিড বা রোহিণী)।',
  },
  {
    id: 'parasitism',
    nameBn: 'পরজীবিতা / শোষণ',
    nameEn: 'Parasitism',
    category: 'ঋণাত্মক (Negative)',
    effectBadge: 'পরজীবী (+)  |  পোষক (-)',
    description:
      'একটি জীব (পরজীবী) অন্য জীবের (পোষক) দেহ থেকে পুষ্টি শোষণ করে নিজে উপকৃত হয় এবং পোষকের ক্ষতি করে।',
    examples: 'স্বর্ণলতা (ক্লোরোফিলবিহীন সম্পূর্ণ উদ্ভিদ পরজীবী), মানুষের উকুন ও গোলকৃমি।',
  },
  {
    id: 'competition',
    nameBn: 'প্রতিযোগিতা',
    nameEn: 'Competition',
    category: 'ঋণাত্মক (Negative)',
    effectBadge: 'জীব ১ (-)  |  জীব ২ (-)',
    description:
      'সীমিত আলো, পানি, খাদ্য বা বাসস্থানের জন্য একই বা ভিন্ন প্রজাতির জীবের মধ্যে সংগ্রাম। এতে সবল জীব টিকে থাকে।',
    examples: 'ঘন বনে সূর্যালোকের জন্য বড় ও ছোট গাছের প্রতিযোগিতা; একই এলাকায় শিকারের জন্য বাঘ ও সিংহের সংগ্রাম।',
  },
  {
    id: 'antibiosis',
    nameBn: 'অ্যান্টিবায়োসিস',
    nameEn: 'Antibiosis',
    category: 'ঋণাত্মক (Negative)',
    effectBadge: 'জীব ১ (০)  |  জীব ২ (-)',
    description:
      'একটি জীবের নিঃসৃত রাসায়নিক পদার্থ অন্য জীবের বৃদ্ধি ব্যাহত করে বা তাকে সম্পূর্ণ ধ্বংস করে দেয়।',
    examples: 'Penicillium ছত্রাক থেকে নিঃসৃত পেনিসিলিন অ্যান্টিবায়োটিক ব্যাকটেরিয়া ধ্বংস করে।',
  },
];

export default function EnvironmentOfLifeLab() {
  // Section 1: 10% Energy Pyramid Simulator
  const [producerEnergy, setProducerEnergy] = useState<number>(10000);

  // Section 2: Ecological Interaction Explorer
  const [selectedInteractionId, setSelectedInteractionId] =
    useState<string>('mutualism');

  const activeInteraction =
    INTERACTIONS.find((item) => item.id === selectedInteractionId) ??
    INTERACTIONS[0];

  const handleReset = () => {
    setProducerEnergy(10000);
    setSelectedInteractionId('mutualism');
  };

  const primaryEnergy = producerEnergy * 0.1;
  const secondaryEnergy = primaryEnergy * 0.1;
  const tertiaryEnergy = secondaryEnergy * 0.1;

  const pyramidLevels = [
    {
      level: '৪র্থ পুষ্টিস্তর',
      role: '৩য় / সর্বোচ্চ স্তরের খাদক (বাজপাখি / বাঘ)',
      energy: tertiaryEnergy,
      widthClass: 'w-[38%]',
      colorClass: 'bg-rose-600 text-white',
    },
    {
      level: '৩য় পুষ্টিস্তর',
      role: '২য় স্তরের খাদক (ব্যাঙ / ছোট পাখি)',
      energy: secondaryEnergy,
      widthClass: 'w-[56%]',
      colorClass: 'bg-amber-500 text-white',
    },
    {
      level: '২য় পুষ্টিস্তর',
      role: '১ম স্তরের খাদক / তৃণভোজী (ঘাসফড়িং / হরিণ)',
      energy: primaryEnergy,
      widthClass: 'w-[76%]',
      colorClass: 'bg-emerald-500 text-white',
    },
    {
      level: '১ম পুষ্টিস্তর',
      role: 'উৎপাদক (সবুজ উদ্ভিদ / ফাইটোপ্ল্যাংকটন)',
      energy: producerEnergy,
      widthClass: 'w-full',
      colorClass: 'bg-teal-700 text-white',
    },
  ];

  const isPositive = activeInteraction.category.startsWith('ধনাত্মক');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE ECOSYSTEM &amp; ENERGY LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ১০% শক্তি প্রবাহ পিরামিড ও আন্তঃক্রিয়া এক্সপ্লোরার ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            উৎপাদকের শক্তি পরিবর্তন করে প্রতিটি পুষ্টিস্তরে ১০% শক্তি স্থানান্তর পর্যবেক্ষণ করো এবং জীবের ধনাত্মক ও ঋণাত্মক আন্তঃক্রিয়া তুলনা করো।
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

      {/* Section 1: 10% Energy Pyramid Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              শক্তির পিরামিড ও ১০% নিয়ম সিমুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            উৎপাদকের শক্তি: {producerEnergy.toLocaleString('en-US')} kJ
          </span>
        </div>

        {/* Energy Slider & Presets */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
            <label htmlFor="producer-energy-slider">
              উৎপাদকের সঞ্চিত শক্তি নির্বাচন করো (kJ):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[1000, 10000, 50000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProducerEnergy(val)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                    producerEnergy === val
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val.toLocaleString('en-US')} kJ
                </button>
              ))}
            </div>
          </div>

          <input
            id="producer-energy-slider"
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={producerEnergy}
            onChange={(e) => setProducerEnergy(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        {/* Upright Energy Pyramid */}
        <div className="space-y-2.5 flex flex-col items-center py-2">
          {pyramidLevels.map((tier) => (
            <div
              key={tier.level}
              className={`${tier.widthClass} min-w-[240px] rounded-xl px-4 py-3 shadow-2xs transition-all flex flex-wrap items-center justify-between gap-2 ${tier.colorClass}`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase opacity-90 block">
                  {tier.level}
                </span>
                <span className="text-xs sm:text-sm font-bold">{tier.role}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-black/20 text-xs font-extrabold">
                {tier.energy.toLocaleString('en-US', {
                  maximumFractionDigits: 1,
                })}{' '}
                kJ
              </span>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            প্রতি ধাপে প্রায় <strong>৯০% শক্তি</strong> শ্বসন ও তাপ হিসেবে পরিবেশে হারিয়ে যায় এবং মাত্র <strong>১০% শক্তি</strong> পরবর্তী পুষ্টিস্তরে পৌঁছায়। তাই শক্তির পিরামিড সর্বদা <strong>সোজা (Upright)</strong> হয়।
          </span>
        </div>
      </section>

      {/* Section 2: Ecological Interactions Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              জীবের মধ্যকার আন্তঃক্রিয়া (Ecological Interactions) এক্সপ্লোরার
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {activeInteraction.category}
          </span>
        </div>

        {/* Interaction Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {INTERACTIONS.map((item) => {
            const isSelected = item.id === selectedInteractionId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedInteractionId(item.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.nameBn}
              </button>
            );
          })}
        </div>

        {/* Selected Interaction Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              {activeInteraction.nameBn} ({activeInteraction.nameEn})
            </h4>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-extrabold text-teal-700">
              {activeInteraction.effectBadge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeInteraction.description}
          </p>

          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              <strong>উদাহরণ:</strong> {activeInteraction.examples}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}