'use client';

import React, { useState } from 'react';
import { Sliders, Calculator, FlaskConical } from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';
import { SubjectId } from '@/types/curriculum';

interface LabConfig {
  title: string;
  formulaLatex: string;
  param1Label: string;
  param1Unit: string;
  param1Min: number;
  param1Max: number;
  param1Default: number;
  param2Label: string;
  param2Unit: string;
  param2Min: number;
  param2Max: number;
  param2Default: number;
  resultLabel: string;
  resultUnit: string;
  calculate: (p1: number, p2: number) => number;
  stepLatex: (p1: number, p2: number, res: number) => string;
  visualHint: (p1: number, p2: number, res: number) => string;
}

const CHAPTER_LAB_CONFIGS: Record<string, LabConfig> = {
  force: {
    title: 'নিউটনের ২য় সূত্র ও বল পরিমাপক ল্যাব',
    formulaLatex: 'F = m \\times a',
    param1Label: 'বস্তুর ভর (Mass, m)',
    param1Unit: 'kg',
    param1Min: 1,
    param1Max: 50,
    param1Default: 10,
    param2Label: 'ত্বরণ (Acceleration, a)',
    param2Unit: 'm/s²',
    param2Min: 1,
    param2Max: 20,
    param2Default: 5,
    resultLabel: 'প্রযুক্ত বল (Force, F)',
    resultUnit: 'N (নিউটন)',
    calculate: (m, a) => m * a,
    stepLatex: (m, a, f) => `F = ${m}\\text{ kg} \\times ${a}\\text{ m/s}^2 = ${f.toFixed(1)}\\text{ N}`,
    visualHint: (m, a, f) => `${m} kg ভরের বস্তুতে ${f.toFixed(0)} N বল প্রয়োগ করায় এটি ${a} m/s² ত্বরণে গতিশীল হচ্ছে।`,
  },
  'current-electricity': {
    title: 'ওহমের সূত্র ও বৈদ্যুতিক বর্তনী সিমুলেটর',
    formulaLatex: 'I = \\frac{V}{R}',
    param1Label: 'বিভব পার্থক্য (Voltage, V)',
    param1Unit: 'V',
    param1Min: 2,
    param1Max: 220,
    param1Default: 12,
    param2Label: 'রোধ (Resistance, R)',
    param2Unit: 'Ω',
    param2Min: 1,
    param2Max: 50,
    param2Default: 4,
    resultLabel: 'তড়িৎ প্রবাহ (Current, I)',
    resultUnit: 'A (অ্যাম্পিয়ার)',
    calculate: (v, r) => v / r,
    stepLatex: (v, r, i) => `I = \\frac{${v}\\text{ V}}{${r}\\text{ }\\Omega} = ${i.toFixed(2)}\\text{ A}`,
    visualHint: (v, r, i) => `বর্তনীতে ${v}V ব্যাটারি ও ${r}Ω রোধ যুক্ত থাকায় ${i.toFixed(2)}A তড়িৎ প্রবাহিত হচ্ছে।`,
  },
  'mole-concept-and-chemical-calculations': {
    title: 'দ্রবণের মোলারিটি (Molarity) নির্ণয় ল্যাব',
    formulaLatex: 'S = \\frac{n}{V}',
    param1Label: 'দ্রবের মোল সংখ্যা (n)',
    param1Unit: 'mol',
    param1Min: 0.5,
    param1Max: 10,
    param1Default: 2,
    param2Label: 'দ্রবণের আয়তন (V)',
    param2Unit: 'L',
    param2Min: 0.5,
    param2Max: 5,
    param2Default: 1,
    resultLabel: 'ঘনমাত্রা বা মোলারিটি (S)',
    resultUnit: 'M (mol/L)',
    calculate: (n, v) => n / v,
    stepLatex: (n, v, s) => `S = \\frac{${n}\\text{ mol}}{${v}\\text{ L}} = ${s.toFixed(2)}\\text{ M}`,
    visualHint: (n, v, s) => `${v} লিটার দ্রবণে ${n} মোল দ্রব দ্রবীভূত থাকায় ঘনমাত্রা ${s.toFixed(2)} M।`,
  },
  'food-nutrition-and-digestion': {
    title: 'দেহের ভরসূচি (BMI) ও পুষ্টি পরিমাপক ল্যাব',
    formulaLatex: '\\text{BMI} = \\frac{W}{H^2}',
    param1Label: 'দেহের ওজন (Weight, W)',
    param1Unit: 'kg',
    param1Min: 30,
    param1Max: 120,
    param1Default: 60,
    param2Label: 'উচ্চতা (Height, H)',
    param2Unit: 'm',
    param2Min: 1.2,
    param2Max: 2.0,
    param2Default: 1.65,
    resultLabel: 'বডি মাস ইনডেক্স (BMI)',
    resultUnit: 'kg/m²',
    calculate: (w, h) => w / (h * h),
    stepLatex: (w, h, bmi) => `\\text{BMI} = \\frac{${w}}{(${h})^2} = ${bmi.toFixed(2)}\\text{ kg/m}^2`,
    visualHint: (_, __, bmi) =>
      bmi < 18.5
        ? 'শরীরের ওজন কম (Underweight)। সুষম খাদ্য গ্রহণ প্রয়োজন।'
        : bmi <= 24.9
        ? 'আদর্শ ও স্বাভাবিক ওজন (Normal Weight)।'
        : 'অতিরিক্ত ওজন (Overweight)। নিয়মিত ব্যায়াম ও পরিমিত খাদ্য প্রয়োজন।',
  },
};

interface Props {
  chapterSlug: string;
  chapterTitle: string;
  subjectId: SubjectId;
}

export default function UniversalLabEngine({ chapterSlug, chapterTitle, subjectId }: Props) {
  // Default fallback config based on subject if specific chapter isn't mapped yet
  const defaultConfig: LabConfig =
    subjectId === 'physics'
      ? CHAPTER_LAB_CONFIGS['force']
      : subjectId === 'chemistry'
      ? CHAPTER_LAB_CONFIGS['mole-concept-and-chemical-calculations']
      : CHAPTER_LAB_CONFIGS['food-nutrition-and-digestion'];

  const config = CHAPTER_LAB_CONFIGS[chapterSlug] || {
    ...defaultConfig,
    title: `${chapterTitle} — ইন্টারঅ্যাক্টিভ সিমুলেশন ও ক্যালকুলেটর`,
  };

  const [p1, setP1] = useState<number>(config.param1Default);
  const [p2, setP2] = useState<number>(config.param2Default);

  const result = config.calculate(p1, p2);
  const barPercentage = Math.min(100, Math.max(8, (result / (config.calculate(config.param1Max, config.param2Max) || 100)) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Interactive Parameter Controls */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>{config.title}</span>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>{config.param1Label}</span>
              <span className="font-sans font-bold text-blue-600">
                {p1} {config.param1Unit}
              </span>
            </div>
            <input
              type="range"
              min={config.param1Min}
              max={config.param1Max}
              step={config.param1Max <= 5 ? 0.05 : 1}
              value={p1}
              onChange={(e) => setP1(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>{config.param2Label}</span>
              <span className="font-sans font-bold text-blue-600">
                {p2} {config.param2Unit}
              </span>
            </div>
            <input
              type="range"
              min={config.param2Min}
              max={config.param2Max}
              step={config.param2Max <= 5 ? 0.05 : 1}
              value={p2}
              onChange={(e) => setP2(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Visual Meter */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>রিয়েল-টাইম আউটপুট মিটার</span>
              <span className="font-sans font-bold text-slate-900">
                {result.toFixed(2)} {config.resultUnit}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${barPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              <FlaskConical className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
              {config.visualHint(p1, p2, result)}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Live Formula & Step-by-Step Solution */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>গাণিতিক সূত্র ও ধাপে ধাপে সমাধান</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
            <span className="text-xs font-semibold text-slate-500 block mb-2">মূল বৈজ্ঞানিক সূত্র:</span>
            <div className="text-lg font-sans">
              <FormulaBox formula={config.formulaLatex} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block mb-2">মান বসিয়ে পাই:</span>
            <div className="text-sm font-sans text-slate-900 bg-white p-3 rounded-lg border border-emerald-100">
              <FormulaBox formula={config.stepLatex(p1, p2, result)} />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">{config.resultLabel}:</span>
          <span className="text-2xl font-bold text-emerald-600 font-sans">
            {result.toFixed(2)} <span className="text-sm font-normal">{config.resultUnit}</span>
          </span>
        </div>
      </div>
    </div>
  );
}