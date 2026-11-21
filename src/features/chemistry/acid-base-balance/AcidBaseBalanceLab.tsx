'use client';

import React, { useState } from 'react';
import {
  Activity,
  Beaker,
  Droplets,
  FlaskConical,
  Info,
  RotateCcw,
} from 'lucide-react';

interface PhPreset {
  name: string;
  ph: number;
  note: string;
}

const PH_PRESETS: PhPreset[] = [
  { name: 'পাকস্থলীর এসিড (HCl)', ph: 1.5, note: 'খাদ্য হজমে সাহায্য করে' },
  { name: 'লেবুর রস', ph: 2.2, note: 'সাইট্রিক এসিড থাকে' },
  { name: 'ভিনেগার', ph: 3.0, note: 'এসিটিক এসিড (CH₃COOH)' },
  { name: 'এসিড বৃষ্টি', ph: 4.2, note: 'pH < 5.6 হলে এসিড বৃষ্টি' },
  { name: 'বিশুদ্ধ পানি', ph: 7.0, note: 'সম্পূর্ণ নিরপেক্ষ দ্রবণ' },
  { name: 'মানুষের রক্ত', ph: 7.4, note: 'স্বাভাবিক সীমা 7.35–7.45' },
  { name: 'টুথপেস্ট', ph: 8.5, note: 'মুখের এসিড প্রশমিত করে' },
  { name: 'সাবান পানি', ph: 10.5, note: 'ক্ষারীয় প্রকৃতির' },
  { name: 'কস্টিক সোডা (NaOH)', ph: 13.5, note: 'অত্যন্ত তীব্র ক্ষার' },
];

// Universal Indicator color approximation for pH 0–14
function getPhColor(ph: number): string {
  if (ph < 2) return '#dc2626'; // red-600
  if (ph < 3.5) return '#ea580c'; // orange-600
  if (ph < 5) return '#f59e0b'; // amber-500
  if (ph < 6.5) return '#eab308'; // yellow-500
  if (ph <= 7.5) return '#16a34a'; // green-600
  if (ph < 9) return '#0d9488'; // teal-600
  if (ph < 10.5) return '#0284c7'; // sky-600
  if (ph < 12) return '#2563eb'; // blue-600
  return '#7c3aed'; // violet-600
}

function getPhCategory(ph: number): { label: string; badgeClass: string } {
  if (ph < 3) {
    return {
      label: 'তীব্র এসিড (Strong Acid)',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  if (ph < 6.8) {
    return {
      label: 'মৃদু এসিড (Weak Acid)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }
  if (ph <= 7.2) {
    return {
      label: 'নিরপেক্ষ (Neutral)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (ph < 11) {
    return {
      label: 'মৃদু ক্ষার (Weak Base)',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    };
  }
  return {
    label: 'তীব্র ক্ষার (Strong Base)',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
  };
}

// Titration pH calculation: 25 mL of 0.1 M HCl + V mL of 0.1 M NaOH
function calculateTitrationPh(naohVolMl: number): number {
  const acidVol = 25;
  const molarity = 0.1;
  const totalVol = acidVol + naohVolMl;

  if (Math.abs(naohVolMl - acidVol) < 0.01) {
    return 7.0;
  }
  if (naohVolMl < acidVol) {
    const hConc = (molarity * (acidVol - naohVolMl)) / totalVol;
    return Math.max(0, -Math.log10(hConc));
  }
  const ohConc = (molarity * (naohVolMl - acidVol)) / totalVol;
  const pOh = -Math.log10(ohConc);
  return Math.min(14, 14 - pOh);
}

export default function AcidBaseBalanceLab() {
  // Section 1: pH & Indicator State
  const [phValue, setPhValue] = useState<number>(7.0);

  // Section 2: Neutralization Titration State (0 to 50 mL of 0.1M NaOH into 25 mL of 0.1M HCl)
  const [naohVolume, setNaohVolume] = useState<number>(25);

  const phColor = getPhColor(phValue);
  const phCategory = getPhCategory(phValue);

  // Indicator Results
  const blueLitmusResult =
    phValue < 7 ? 'লাল হয়ে যাবে' : 'অপরিবর্তিত (নীল)';
  const redLitmusResult =
    phValue > 7 ? 'নীল হয়ে যাবে' : 'অপরিবর্তিত (লাল)';
  const phenolphthaleinResult =
    phValue >= 8.2 ? 'গোলাপি (Pink)' : 'বর্ণহীন (Colorless)';
  const methylOrangeResult =
    phValue < 3.1 ? 'লাল (Red)' : phValue <= 4.4 ? 'কমলা (Orange)' : 'হলুদ (Yellow)';

  // Titration Calculations
  const titrationPh = calculateTitrationPh(naohVolume);
  const isNeutralized = Math.abs(naohVolume - 25) < 0.01;
  const flaskColor =
    titrationPh < 8.2
      ? '#f1f5f9' // colorless
      : titrationPh < 9.5
      ? '#fbcfe8' // light pink
      : '#ec4899'; // deep pink

  // SVG Titration Curve Geometry
  const graphW = 340;
  const graphH = 180;
  const mapX = (vol: number) => 38 + (vol / 50) * (graphW - 56);
  const mapY = (ph: number) => graphH - 26 - (ph / 14) * (graphH - 42);

  const curvePoints = Array.from({ length: 101 }, (_, idx) => {
    const v = idx * 0.5;
    const p = calculateTitrationPh(v);
    return `${mapX(v).toFixed(1)},${mapY(p).toFixed(1)}`;
  }).join(' ');

  const handleReset = () => {
    setPhValue(7.0);
    setNaohVolume(25);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE ACID-BASE &amp; pH LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ইন্টারেক্টিভ pH স্কেল, নির্দেশক ও প্রশমন টাইট্রেশন ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            বিভিন্ন পদার্থের pH মান, লিটমাস ও নির্দেশকের বর্ণ পরিবর্তন এবং এসিড-ক্ষারের প্রশমন বিক্রিয়া পরীক্ষা করো।
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

      {/* Section 1: Interactive pH Scale & Indicator Tester */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              pH স্কেল ও নির্দেশক (Indicator) টেস্টার
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${phCategory.badgeClass}`}
          >
            {phCategory.label}
          </span>
        </div>

        {/* Everyday Substance Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PH_PRESETS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setPhValue(item.ph)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-colors ${
                Math.abs(phValue - item.ph) < 0.05
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.name} ({item.ph})
            </button>
          ))}
        </div>

        {/* pH Rainbow Gradient Bar & Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-rose-600">0 (তীব্র এসিড)</span>
            <span className="text-base font-black text-slate-900">
              pH = {phValue.toFixed(1)}
            </span>
            <span className="text-violet-700">14 (তীব্র ক্ষার)</span>
          </div>

          <div
            className="h-4 rounded-full w-full shadow-inner"
            style={{
              background:
                'linear-gradient(to right, #dc2626 0%, #ea580c 15%, #f59e0b 30%, #eab308 42%, #16a34a 50%, #0d9488 60%, #0284c7 72%, #2563eb 85%, #7c3aed 100%)',
            }}
          />

          <input
            type="range"
            min={0}
            max={14}
            step={0.1}
            value={phValue}
            onChange={(e) => setPhValue(Number(e.target.value))}
            className="w-full accent-slate-800 cursor-pointer"
          />
        </div>

        {/* Visual Beaker + Indicator Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Beaker Color Preview */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2">
            <div className="w-24 h-28 rounded-b-2xl border-2 border-t-0 border-slate-400 relative overflow-hidden bg-white">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                style={{
                  height: '72%',
                  backgroundColor: phColor,
                  opacity: 0.85,
                }}
              />
              <span className="relative z-10 flex items-center justify-center h-full text-lg font-black text-white drop-shadow">
                {phValue.toFixed(1)}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700 text-center">
              ইউনিভার্সাল ইন্ডিকেটর বর্ণ
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              [H⁺] = 10⁻{phValue.toFixed(1)} mol/L
            </p>
          </div>

          {/* 4 Indicators Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-500">নীল লিটমাস পেপার</p>
              <p
                className={`text-sm font-extrabold mt-1 ${
                  phValue < 7 ? 'text-rose-600' : 'text-blue-700'
                }`}
              >
                {blueLitmusResult}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-500">লাল লিটমাস পেপার</p>
              <p
                className={`text-sm font-extrabold mt-1 ${
                  phValue > 7 ? 'text-blue-700' : 'text-rose-600'
                }`}
              >
                {redLitmusResult}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-500">ফেনলফথ্যালিন (Phenolphthalein)</p>
              <p
                className={`text-sm font-extrabold mt-1 ${
                  phValue >= 8.2 ? 'text-pink-600' : 'text-slate-700'
                }`}
              >
                {phenolphthaleinResult}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-500">মিথাইল অরেঞ্জ (Methyl Orange)</p>
              <p
                className={`text-sm font-extrabold mt-1 ${
                  phValue < 3.1
                    ? 'text-rose-600'
                    : phValue <= 4.4
                    ? 'text-orange-600'
                    : 'text-amber-600'
                }`}
              >
                {methylOrangeResult}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Acid-Base Neutralization Titration Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              প্রশমন টাইট্রেশন সিমুলেটর: HCl + NaOH → NaCl + H₂O
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isNeutralized
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : titrationPh < 7
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-pink-50 text-pink-700 border-pink-200'
            }`}
          >
            {isNeutralized
              ? 'সম্পূর্ণ প্রশমন বিন্দু (pH = 7.00)'
              : titrationPh < 7
              ? 'দ্রবণটি এখনো এসিডীয়'
              : 'অতিরিক্ত ক্ষার (দ্রবণটি ক্ষারীয়)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* SVG Titration Curve */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <svg
              viewBox={`0 0 ${graphW} ${graphH}`}
              className="w-full h-auto block"
              role="img"
              aria-label="এসিড-ক্ষার প্রশমন টাইট্রেশন লেখচিত্র"
            >
              {/* Axes */}
              <line x1={38} y1={14} x2={38} y2={graphH - 26} stroke="#64748b" strokeWidth={1.5} />
              <line x1={38} y1={graphH - 26} x2={graphW - 14} y2={graphH - 26} stroke="#64748b" strokeWidth={1.5} />

              {/* pH = 7 Guide Line */}
              <line
                x1={38}
                y1={mapY(7)}
                x2={graphW - 18}
                y2={mapY(7)}
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text x={32} y={mapY(7) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#059669">
                7
              </text>
              <text x={32} y={mapY(14) + 4} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#64748b">
                14
              </text>
              <text x={32} y={mapY(0) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#64748b">
                0
              </text>

              {/* Equivalence Volume 25 mL Vertical Guide */}
              <line
                x1={mapX(25)}
                y1={16}
                x2={mapX(25)}
                y2={graphH - 26}
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeDasharray="4 3"
              />

              {/* Titration Curve */}
              <polyline
                points={curvePoints}
                fill="none"
                stroke="#059669"
                strokeWidth={2.5}
              />

              {/* Live Current Point */}
              <circle
                cx={mapX(naohVolume)}
                cy={mapY(titrationPh)}
                r={5.5}
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth={2}
              />

              {/* Axis Labels */}
              <text x={graphW / 2} y={graphH - 6} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#475569">
                যোগকৃত 0.1 M NaOH-এর আয়তন (0 – 50 mL)
              </text>
              <text
                x={12}
                y={graphH / 2}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight="bold"
                fill="#475569"
                transform={`rotate(-90 12 ${graphH / 2})`}
              >
                দ্রবণের pH
              </text>
            </svg>
          </div>

          {/* Right Controls & Flask Color */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                <strong>কনিক্যাল ফ্লাস্কে আছে:</strong> 25 mL, 0.1 M HCl + ফেনলফথ্যালিন
              </p>
              <p>
                <strong>বুরেট থেকে যোগ হচ্ছে:</strong> 0.1 M NaOH দ্রবণ
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" /> যোগকৃত NaOH:
                </span>
                <span className="text-emerald-700">{naohVolume} mL</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={naohVolume}
                onChange={(e) => setNaohVolume(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-300 shadow-inner transition-colors duration-300"
                  style={{ backgroundColor: flaskColor }}
                />
                <div>
                  <p className="text-xs font-bold text-slate-500">ফ্লাস্কের বর্ণ (ফেনলফথ্যালিন)</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {titrationPh < 8.2 ? 'বর্ণহীন' : 'গোলাপি'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">বর্তমান pH</p>
                <p className="text-xl font-black text-slate-900">
                  {titrationPh.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-950 leading-relaxed">
                ঠিক <strong>25 mL NaOH</strong> যোগ করলেই 25 mL HCl সম্পূর্ণ প্রশমিত হয়ে নিরপেক্ষ লবণ (NaCl) ও পানি তৈরি করে (pH = 7.00)।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}