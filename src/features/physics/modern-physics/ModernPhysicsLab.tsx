'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Atom,
  Cpu,
  Info,
  Lightbulb,
  RotateCcw,
  Zap,
} from 'lucide-react';

type BiasMode = 'forward' | 'reverse';

interface IsotopePreset {
  name: string;
  halfLife: number;
  unit: string;
  use: string;
}

const ISOTOPE_PRESETS: IsotopePreset[] = [
  { name: 'আয়োডিন-১৩১ (I-131)', halfLife: 8, unit: 'দিন', use: 'থাইরয়েড চিকিৎসা' },
  { name: 'কোবাল্ট-৬০ (Co-60)', halfLife: 5, unit: 'বছর', use: 'ক্যান্সার চিকিৎসা' },
  { name: 'কার্বন-১৪ (C-14)', halfLife: 5730, unit: 'বছর', use: 'জীবাশ্মের বয়স নির্ণয়' },
  { name: 'সাধারণ নমুনা', halfLife: 4, unit: 'দিন', use: 'বোর্ড পরীক্ষার উদাহরণ' },
];

const BARRIER_VOLTAGE = 0.7; // Silicon diode threshold (V)

export default function ModernPhysicsLab() {
  // Section 1: Half-Life Decay State
  const [initialMass, setInitialMass] = useState<number>(80); // N0 (g)
  const [halfLife, setHalfLife] = useState<number>(4); // T1/2
  const [elapsedTime, setElapsedTime] = useState<number>(12); // t
  const [timeUnit, setTimeUnit] = useState<string>('দিন');

  // Section 2: p-n Junction Diode State
  const [biasMode, setBiasMode] = useState<BiasMode>('forward');
  const [diodeVoltage, setDiodeVoltage] = useState<number>(3.0); // V
  const [flowOffset, setFlowOffset] = useState<number>(0);

  // Half-Life Calculations
  const numHalfLives = elapsedTime / halfLife;
  const remainingMass = initialMass * Math.pow(0.5, numHalfLives);
  const decayedMass = initialMass - remainingMass;
  const remainingPercent = (remainingMass / initialMass) * 100;

  // Atom Grid (64 visual atoms)
  const totalVisualAtoms = 64;
  const activeVisualAtoms = Math.round((remainingPercent / 100) * totalVisualAtoms);

  // Diode Calculations
  const isConducting = biasMode === 'forward' && diodeVoltage >= BARRIER_VOLTAGE;
  const diodeCurrentMa = isConducting
    ? (diodeVoltage - BARRIER_VOLTAGE) * 15
    : 0;

  // Depletion layer width in SVG pixels
  const depletionWidth =
    biasMode === 'forward'
      ? Math.max(10, 44 - diodeVoltage * 10)
      : Math.min(96, 44 + diodeVoltage * 10);

  // Animate current flow in diode circuit when conducting
  useEffect(() => {
    if (!isConducting) return;
    let animId = 0;
    const speed = Math.min(3, Math.max(0.6, diodeCurrentMa / 20));
    const tick = () => {
      setFlowOffset((prev) => (prev - speed) % 24);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isConducting, diodeCurrentMa]);

  const handleSelectPreset = (preset: IsotopePreset) => {
    setHalfLife(preset.halfLife);
    setTimeUnit(preset.unit);
    setElapsedTime(preset.halfLife * 2);
  };

  const handleReset = () => {
    setInitialMass(80);
    setHalfLife(4);
    setElapsedTime(12);
    setTimeUnit('দিন');
    setBiasMode('forward');
    setDiodeVoltage(3.0);
  };

  // Decay Curve SVG Geometry
  const graphW = 340;
  const graphH = 170;
  const maxHalfLivesPlot = 5;
  const maxPlotTime = halfLife * maxHalfLivesPlot;

  const mapX = (t: number) => 36 + (Math.min(t, maxPlotTime) / maxPlotTime) * (graphW - 52);
  const mapY = (n: number) => graphH - 28 - (n / initialMass) * (graphH - 44);

  const curvePoints = Array.from({ length: 41 }, (_, idx) => {
    const t = (idx / 40) * maxPlotTime;
    const n = initialMass * Math.pow(0.5, t / halfLife);
    return `${mapX(t).toFixed(1)},${mapY(n).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE MODERN PHYSICS &amp; ELECTRONICS LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            তেজস্ক্রিয় অর্ধায়ু ক্ষয় ও p-n জংশন ডায়োড ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            অর্ধায়ু ও সময় পরিবর্তন করে তেজস্ক্রিয় ক্ষয় লেখচিত্র এবং সম্মুখ ও বিমুখী বায়াসে ডায়োডের আচরণ পর্যবেক্ষণ করো।
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

      {/* Section 1: Radioactive Half-Life Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                তেজস্ক্রিয় অর্ধায়ু ক্ষয় সিমুলেটর
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              n = {numHalfLives.toFixed(2)} অর্ধায়ু
            </span>
          </div>

          {/* Isotope Presets */}
          <div className="flex flex-wrap gap-1.5">
            {ISOTOPE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Decay Curve + Atom Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* SVG Decay Curve */}
            <div className="sm:col-span-7 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <svg
                viewBox={`0 0 ${graphW} ${graphH}`}
                className="w-full h-auto block"
                role="img"
                aria-label="তেজস্ক্রিয় ক্ষয় লেখচিত্র"
              >
                {/* Axes */}
                <line x1={36} y1={14} x2={36} y2={graphH - 28} stroke="#64748b" strokeWidth={1.5} />
                <line x1={36} y1={graphH - 28} x2={graphW - 12} y2={graphH - 28} stroke="#64748b" strokeWidth={1.5} />

                {/* 50% Guide Line */}
                <line
                  x1={36}
                  y1={mapY(initialMass / 2)}
                  x2={graphW - 16}
                  y2={mapY(initialMass / 2)}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text x={32} y={mapY(initialMass / 2) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#64748b">
                  N₀/2
                </text>
                <text x={32} y={mapY(initialMass) + 4} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#64748b">
                  N₀
                </text>

                {/* Decay Polyline */}
                <polyline
                  points={curvePoints}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={2.5}
                />

                {/* Current Point */}
                <circle
                  cx={mapX(elapsedTime)}
                  cy={mapY(remainingMass)}
                  r={5}
                  fill="#e11d48"
                  stroke="#ffffff"
                  strokeWidth={2}
                />

                {/* Axis Labels */}
                <text x={graphW / 2} y={graphH - 6} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#475569">
                  সময়, t (0 – {maxPlotTime} {timeUnit})
                </text>
                <text
                  x={11}
                  y={graphH / 2}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight="bold"
                  fill="#475569"
                  transform={`rotate(-90 11 ${graphH / 2})`}
                >
                  অবশিষ্ট ভর (N)
                </text>
              </svg>
            </div>

            {/* 64-Atom Visual Grid */}
            <div className="sm:col-span-5 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <p className="text-[11px] font-bold text-slate-600 text-center">
                পরমাণু ক্ষয় ভিজ্যুয়াল ({remainingPercent.toFixed(1)}% অক্ষত)
              </p>
              <div className="grid grid-cols-8 gap-1.5 justify-items-center">
                {Array.from({ length: totalVisualAtoms }).map((_, idx) => {
                  const isUndecayed = idx < activeVisualAtoms;
                  return (
                    <span
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        isUndecayed
                          ? 'bg-emerald-500 shadow-2xs'
                          : 'bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> অক্ষত
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> ক্ষয়প্রাপ্ত
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Controls & Telemetry */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base">অর্ধায়ু ও সময় নিয়ন্ত্রণ</h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">প্রারম্ভিক ভর (N₀):</span>
                <span className="text-emerald-700">{initialMass} g</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={10}
                value={initialMass}
                onChange={(e) => setInitialMass(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">অর্ধায়ু (T₁/₂):</span>
                <span className="text-slate-900">
                  {halfLife} {timeUnit}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={halfLife > 50 ? 6000 : 20}
                step={halfLife > 50 ? 10 : 1}
                value={halfLife}
                onChange={(e) => setHalfLife(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">অতিবাহিত সময় (t):</span>
                <span className="text-rose-600">
                  {elapsedTime} {timeUnit}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPlotTime}
                step={halfLife > 50 ? 50 : 1}
                value={Math.min(elapsedTime, maxPlotTime)}
                onChange={(e) => setElapsedTime(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-800">অবশিষ্ট পরিমাণ (N)</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {remainingMass.toFixed(2)} g
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-500">ক্ষয়প্রাপ্ত পরিমাণ</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {decayedMass.toFixed(2)} g
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: p-n Junction Diode Biasing Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              p-n জংশন ডায়োড বায়াসিং ল্যাব (Forward vs Reverse Bias)
            </h3>
          </div>

          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setBiasMode('forward')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                biasMode === 'forward'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সম্মুখ বায়াস (Forward)
            </button>
            <button
              type="button"
              onClick={() => setBiasMode('reverse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                biasMode === 'reverse'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বিমুখী বায়াস (Reverse)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* SVG p-n Junction Diagram */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <svg
              viewBox="0 0 560 200"
              className="w-full h-auto block"
              role="img"
              aria-label="p-n জংশন ডায়োড সম্মুখ ও বিমুখী বায়াস চিত্র"
            >
              {/* Connecting Wires */}
              <polyline
                points="100,100 50,100 50,175 510,175 510,100 460,100"
                fill="none"
                stroke="#334155"
                strokeWidth={3}
              />

              {/* Animated Current Overlay */}
              {isConducting && (
                <polyline
                  points="100,100 50,100 50,175 510,175 510,100 460,100"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={3.5}
                  strokeDasharray="6 18"
                  strokeDashoffset={flowOffset}
                  strokeLinecap="round"
                />
              )}

              {/* p-type Block (Left) */}
              <rect
                x={100}
                y={52}
                width={180}
                height={96}
                rx={6}
                fill="#ffe4e6"
                stroke="#e11d48"
                strokeWidth={2.5}
              />
              <text x={145} y={74} fontSize={12} fontWeight="bold" fill="#be123c">
                p-টাইপ (হোল +)
              </text>
              {/* Holes (+) */}
              {[125, 160, 195].map((x) => (
                <g key={`h-${x}`}>
                  <circle cx={x} cy={104} r={7} fill="#ffffff" stroke="#e11d48" strokeWidth={1.8} />
                  <text x={x} y={108} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#e11d48">
                    +
                  </text>
                </g>
              ))}

              {/* n-type Block (Right) */}
              <rect
                x={280}
                y={52}
                width={180}
                height={96}
                rx={6}
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth={2.5}
              />
              <text x={335} y={74} fontSize={12} fontWeight="bold" fill="#1d4ed8">
                n-টাইপ (ইলেকট্রন −)
              </text>
              {/* Electrons (-) */}
              {[365, 400, 435].map((x) => (
                <g key={`e-${x}`}>
                  <circle cx={x} cy={104} r={7} fill="#2563eb" />
                  <text x={x} y={108} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#ffffff">
                    −
                  </text>
                </g>
              ))}

              {/* Depletion Region (Center) */}
              <rect
                x={280 - depletionWidth / 2}
                y={53}
                width={depletionWidth}
                height={94}
                fill="#f8fafc"
                fillOpacity={0.92}
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text x={280} y={42} textAnchor="middle" fontSize={10.5} fontWeight="bold" fill="#475569">
                নিঃশেষিত অঞ্চল (Depletion Layer)
              </text>

              {/* Battery Polarity Box at Bottom */}
              <rect x={235} y={160} width={90} height={30} rx={8} fill="#ffffff" stroke="#475569" strokeWidth={2} />
              <text x={252} y={179} textAnchor="middle" fontSize={13} fontWeight="bold" fill={biasMode === 'forward' ? '#e11d48' : '#2563eb'}>
                {biasMode === 'forward' ? '+' : '−'}
              </text>
              <text x={280} y={179} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#0f172a">
                {diodeVoltage.toFixed(1)}V
              </text>
              <text x={308} y={179} textAnchor="middle" fontSize={13} fontWeight="bold" fill={biasMode === 'forward' ? '#2563eb' : '#e11d48'}>
                {biasMode === 'forward' ? '−' : '+'}
              </text>
            </svg>
          </div>

          {/* Right Controls & Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">ব্যাটারি ভোল্টেজ (V):</span>
                <span className="text-blue-700">{diodeVoltage.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={diodeVoltage}
                onChange={(e) => setDiodeVoltage(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                সিলিকন ডায়োডের প্রারম্ভিক বিভব (Barrier Potential) = 0.7 V
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isConducting
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb
                  className={`w-6 h-6 ${
                    isConducting ? 'text-emerald-600 fill-emerald-300' : 'text-slate-400'
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-slate-600">ডায়োডের অবস্থা</p>
                  <p
                    className={`text-sm font-extrabold ${
                      isConducting ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {isConducting ? 'তড়িৎ প্রবাহিত হচ্ছে (ON)' : 'তড়িৎ প্রবাহ বন্ধ (OFF)'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-500 flex items-center justify-end gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> প্রবাহ
                </p>
                <p className="text-base font-black text-slate-900">
                  {diodeCurrentMa.toFixed(1)} mA
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-950 leading-relaxed">
                {biasMode === 'forward'
                  ? 'সম্মুখ বায়াসে (p-তে +, n-তে −) নিঃশেষিত অঞ্চল সরু হয়ে যায় এবং ভোল্টেজ 0.7V-এর বেশি হলেই তড়িৎ প্রবাহিত হয়।'
                  : 'বিমুখী বায়াসে (p-তে −, n-তে +) নিঃশেষিত অঞ্চল প্রশস্ত হয়ে যায়, ফলে কোনো তড়িৎ প্রবাহিত হয় না।'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}