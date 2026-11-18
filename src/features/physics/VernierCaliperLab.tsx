'use client';

import React, { useState } from 'react';
import { Sliders, Calculator, Ruler } from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';

export default function VernierCaliperLab() {
  const [mainScaleMm, setMainScaleMm] = useState<number>(24); // M (mm)
  const [vernierCoincidence, setVernierCoincidence] = useState<number>(6); // V
  const [vernierDivisions, setVernierDivisions] = useState<number>(10); // n (10 or 20)

  const vc = 1 / vernierDivisions; // VC in mm (e.g., 0.1 mm or 0.05 mm)
  const totalLengthMm = mainScaleMm + vernierCoincidence * vc;
  const totalLengthCm = totalLengthMm / 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Controls & Visual Vernier Scale */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>স্লাইড ক্যালিপার্স কন্ট্রোল প্যানেল</span>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200">
            VC = {vc} mm
          </span>
        </div>

        {/* Interactive Visual Ruler Preview */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 overflow-hidden">
          <div className="flex justify-between text-xs text-slate-400">
            <span>প্রধান স্কেল ও ভার্নিয়ার স্কেল সিমুলেশন</span>
            <span className="text-emerald-400 font-bold">বস্তুর দৈর্ঘ্য: {totalLengthMm.toFixed(2)} mm</span>
          </div>

          <div className="relative h-20 bg-slate-800 rounded-lg border border-slate-700 p-2 overflow-hidden">
            {/* Object Being Measured */}
            <div
              className="h-7 bg-blue-500/80 border border-blue-400 rounded-xs flex items-center justify-center text-[10px] font-bold text-white transition-all duration-150"
              style={{ width: `${Math.min(92, Math.max(12, totalLengthMm * 1.4))}%` }}
            >
              বস্তু ({totalLengthMm.toFixed(2)} mm)
            </div>

            {/* Vernier Jaw Indicator */}
            <div
              className="mt-2 h-6 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 rounded-xs inline-flex items-center transition-all duration-150"
              style={{ marginLeft: `${Math.min(75, Math.max(0, totalLengthMm * 1.1))}%` }}
            >
              ভার্নিয়ার স্কেল (V = {vernierCoincidence})
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span>প্রধান স্কেল পাঠ (M)</span>
              <span className="font-sans font-bold text-blue-600">{mainScaleMm} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={mainScaleMm}
              onChange={(e) => setMainScaleMm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span>ভার্নিয়ার সমপাতন (V)</span>
              <span className="font-sans font-bold text-blue-600">{vernierCoincidence} ঘর</span>
            </div>
            <input
              type="range"
              min={0}
              max={vernierDivisions - 1}
              value={vernierCoincidence}
              onChange={(e) => setVernierCoincidence(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <span className="text-sm font-medium block mb-2">ভার্নিয়ার স্কেলের মোট ভাগ সংখ্যা (n):</span>
            <div className="flex gap-2">
              {[10, 20].map((nVal) => (
                <button
                  key={nVal}
                  onClick={() => {
                    setVernierDivisions(nVal);
                    if (vernierCoincidence >= nVal) setVernierCoincidence(nVal - 1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    vernierDivisions === nVal
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {nVal} ভাগ (VC = {(1 / nVal).toFixed(2)} mm)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Step-by-Step Calculation */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>গাণিতিক হিসাব</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">মৌলিক সূত্র:</span>
            <FormulaBox formula="L = M + (V \times VC)" />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="text-xs font-semibold text-emerald-800 block">মান বসিয়ে পাই:</span>
            <div className="bg-white p-3 rounded-lg border border-emerald-100 text-sm">
              <FormulaBox
                formula={`L = ${mainScaleMm} + (${vernierCoincidence} \\times ${vc}) = ${totalLengthMm.toFixed(2)}\\text{ mm}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">মোট দৈর্ঘ্য (মিলিমিটার ও সেন্টিমিটার)</span>
            <span className="text-xl font-bold text-emerald-600 font-sans">
              {totalLengthMm.toFixed(2)} mm <span className="text-slate-400 font-normal">|</span>{' '}
              {totalLengthCm.toFixed(3)} cm
            </span>
          </div>
          <Ruler className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}