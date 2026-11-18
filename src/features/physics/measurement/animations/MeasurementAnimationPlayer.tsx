'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, Play, Pause } from 'lucide-react';

interface Props {
  animationType: 'fundamental-derived' | 'vernier' | 'screw-gauge' | 'error';
}

export default function MeasurementAnimationPlayer({ animationType }: Props) {
  // ১. মৌলিক ও লব্ধ রাশি এবং মাত্রা ভিজ্যুয়ালাইজার
  if (animationType === 'fundamental-derived') {
    return <DimensionBuilderAnimation />;
  }

  // ২. ভার্নিয়ার স্কেল সমপাতন অ্যানিমেশন
  if (animationType === 'vernier') {
    return <VernierScaleAnimation />;
  }

  // ৩. স্ক্রু গজের পিচ ও বৃত্তাকার স্কেল ঘূর্ণন অ্যানিমেশন
  if (animationType === 'screw-gauge') {
    return <ScrewGaugeAnimation />;
  }

  // ৪. পরিমাপের ত্রুটি ও শতকরা ত্রুটি ভিজ্যুয়ালাইজার
  return <ErrorVisualAnimation />;
}

/* -------------------------------------------------------------------------- */
/* ১. মৌলিক রাশি থেকে লব্ধ রাশি ও মাত্রা তৈরির ইন্টারঅ্যাক্টিভ অ্যানিমেশন         */
/* -------------------------------------------------------------------------- */
function DimensionBuilderAnimation() {
  const [selectedDerived, setSelectedDerived] = useState<'velocity' | 'acceleration' | 'force' | 'work'>('force');

  const recipes = {
    velocity: {
      name: 'বেগ (Velocity)',
      formula: 'সরণ ÷ সময়',
      blocks: [{ label: 'দৈর্ঘ্য [L]', power: '+1', color: 'bg-blue-600' }, { label: 'সময় [T]', power: '-1', color: 'bg-amber-600' }],
      dimension: '[LT⁻¹]',
      unit: 'm s⁻¹',
    },
    acceleration: {
      name: 'ত্বরণ (Acceleration)',
      formula: 'বেগ ÷ সময়',
      blocks: [{ label: 'দৈর্ঘ্য [L]', power: '+1', color: 'bg-blue-600' }, { label: 'সময় [T]', power: '-2', color: 'bg-amber-600' }],
      dimension: '[LT⁻²]',
      unit: 'm s⁻²',
    },
    force: {
      name: 'বল (Force)',
      formula: 'ভর × ত্বরণ',
      blocks: [
        { label: 'ভর [M]', power: '+1', color: 'bg-emerald-600' },
        { label: 'দৈর্ঘ্য [L]', power: '+1', color: 'bg-blue-600' },
        { label: 'সময় [T]', power: '-2', color: 'bg-amber-600' },
      ],
      dimension: '[MLT⁻²]',
      unit: 'kg m s⁻² (N)',
    },
    work: {
      name: 'কাজ / শক্তি (Work)',
      formula: 'বল × সরণ',
      blocks: [
        { label: 'ভর [M]', power: '+1', color: 'bg-emerald-600' },
        { label: 'দৈর্ঘ্য [L]', power: '+2', color: 'bg-blue-600' },
        { label: 'সময় [T]', power: '-2', color: 'bg-amber-600' },
      ],
      dimension: '[ML²T⁻²]',
      unit: 'kg m² s⁻² (J)',
    },
  };

  const current = recipes[selectedDerived];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> মৌলিক থেকে লব্ধ রাশি ও মাত্রা গঠন
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(['velocity', 'acceleration', 'force', 'work'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedDerived(key)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDerived === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {recipes[key].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {current.blocks.map((b, i) => (
            <div key={i} className={`${b.color} px-3.5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1`}>
              <span>{b.label}</span>
              <sup className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">{b.power}</sup>
            </div>
          ))}
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-slate-400">{current.formula}</div>
          <div className="text-xl font-bold text-emerald-400 font-sans mt-0.5">মাত্রা: {current.dimension}</div>
          <div className="text-xs text-slate-300 font-sans">SI একক: {current.unit}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ২. ভার্নিয়ার সমপাতন অ্যানিমেশন                                                */
/* -------------------------------------------------------------------------- */
function VernierScaleAnimation() {
  const [stepMm, setStepMm] = useState<number>(12.4); // 12 mm + 4 * 0.1 mm

  const mainReading = Math.floor(stepMm);
  const vernierMatch = Math.round((stepMm - mainReading) * 10);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-emerald-400">ভার্নিয়ার সমপাতন জুম ভিউ (VC = 0.1 mm)</span>
        <span className="text-xs font-sans bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30">
          পাঠ: {stepMm.toFixed(1)} mm (M = {mainReading}, V = {vernierMatch})
        </span>
      </div>

      {/* SVG Vernier Scale Zoom */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <svg viewBox="0 0 500 120" className="w-full h-28 select-none">
          {/* Main Scale */}
          <rect x="10" y="15" width="480" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="4" />
          <text x="20" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold">প্রধান স্কেল (mm)</text>
          {Array.from({ length: 25 }).map((_, i) => {
            const x = 30 + i * 18;
            const isMajor = i % 5 === 0;
            return (
              <g key={i}>
                <line x1={x} y1={55} x2={x} y2={isMajor ? 35 : 43} stroke="#e2e8f0" strokeWidth={isMajor ? 2 : 1} />
                {isMajor && (
                  <text x={x} y={32} textAnchor="middle" fill="#cbd5e1" fontSize="9">
                    {i}
                  </text>
                )}
              </g>
            );
          })}

          {/* Moving Vernier Scale */}
          <g transform={`translate(${(stepMm - 5) * 18}, 0)`}>
            <rect x="28" y="58" width="170" height="42" fill="#0f766e" stroke="#14b8a6" strokeWidth="1.5" rx="4" />
            <text x="36" y="92" fill="#ccfbf1" fontSize="9" fontWeight="bold">ভার্নিয়ার স্কেল (V = {vernierMatch})</text>
            {Array.from({ length: 11 }).map((_, vIdx) => {
              const vx = 30 + vIdx * 16.2; // 10 vernier = 9 main scale (18 * 0.9 = 16.2)
              const isMatched = vIdx === vernierMatch;
              return (
                <g key={vIdx}>
                  <line
                    x1={vx}
                    y1={58}
                    x2={vx}
                    y2={74}
                    stroke={isMatched ? '#fde047' : '#ffffff'}
                    strokeWidth={isMatched ? 2.5 : 1.2}
                  />
                  <text x={vx} y={82} textAnchor="middle" fill={isMatched ? '#fde047' : '#e2e8f0'} fontSize="8" fontWeight="bold">
                    {vIdx}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 shrink-0">স্কেল সরিয়ে দেখো:</span>
        <input
          type="range"
          min={6.0}
          max={14.9}
          step={0.1}
          value={stepMm}
          onChange={(e) => setStepMm(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ৩. স্ক্রু গজের বৃত্তাকার স্কেল ও পিচ অ্যানিমেশন                                    */
/* -------------------------------------------------------------------------- */
function ScrewGaugeAnimation() {
  const [rotations, setRotations] = useState<number>(2.35); // 2 mm + 35 circular divisions
  const linearMm = Math.floor(rotations);
  const circularDiv = Math.round((rotations - linearMm) * 100);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-amber-400">স্ক্রু গজ সিমুলেটর (LC = 0.01 mm)</span>
        <span className="text-xs font-sans font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30">
          মোট ব্যাস: {rotations.toFixed(2)} mm (L = {linearMm} mm, C = {circularDiv})
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/70 p-4 rounded-xl border border-slate-700">
        <div className="text-xs space-y-1.5 text-slate-300">
          <p>• রৈখিক স্কেল পাঠ (L): <strong className="text-white">{linearMm} mm</strong></p>
          <p>• বৃত্তাকার স্কেলের ভাগ সংখ্যা (C): <strong className="text-amber-400">{circularDiv} ঘর</strong></p>
          <p>• মোট পাঠ = {linearMm} + ({circularDiv} × 0.01) = <strong className="text-emerald-400">{rotations.toFixed(2)} mm</strong></p>
        </div>

        <div className="w-full sm:w-56">
          <label className="text-xs text-slate-400 block mb-1">বৃত্তাকার স্কেল ঘুরাও:</label>
          <input
            type="range"
            min={0.0}
            max={8.99}
            step={0.01}
            value={rotations}
            onChange={(e) => setRotations(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ৪. পরিমাপের ত্রুটি ও শতকরা ত্রুটি ক্যালকুলেটর                                    */
/* -------------------------------------------------------------------------- */
function ErrorVisualAnimation() {
  const [measured, setMeasured] = useState<number>(10.0);
  const [absError, setAbsError] = useState<number>(0.5);

  const relativeError = absError / measured;
  const percentError = relativeError * 100;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-rose-400">আপেক্ষিক ও শতকরা ত্রুটি বিশ্লেষক</span>
        <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-md border border-rose-500/30">
          শতকরা ত্রুটি: {percentError.toFixed(2)}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>পরিমাপকৃত মান (x):</span>
            <span className="font-bold text-blue-400">{measured} cm</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={0.5}
            value={measured}
            onChange={(e) => setMeasured(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>চূড়ান্ত ত্রুটি (Δx):</span>
            <span className="font-bold text-rose-400">± {absError} cm</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.5}
            step={0.1}
            value={absError}
            onChange={(e) => setAbsError(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}