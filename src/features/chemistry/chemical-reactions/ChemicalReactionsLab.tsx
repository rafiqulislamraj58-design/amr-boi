'use client';

import React, { useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  Calculator,
  Flame,
  Gauge,
  Info,
  RotateCcw,
} from 'lucide-react';

interface OxidationCompound {
  id: string;
  formula: string;
  name: string;
  targetElement: string;
  oxidationNumber: string;
  knowns: string[];
  equation: string;
  steps: string[];
}

const OXIDATION_COMPOUNDS: OxidationCompound[] = [
  {
    id: 'k2cr2o7',
    formula: 'K₂Cr₂O₇',
    name: 'পটাশিয়াম ডাইক্রোমেট',
    targetElement: 'Cr',
    oxidationNumber: '+6',
    knowns: ['K = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '2(+1) + 2x + 7(-2) = 0',
    steps: ['2 + 2x - 14 = 0', '2x = +12', 'x = +6'],
  },
  {
    id: 'kmno4',
    formula: 'KMnO₄',
    name: 'পটাশিয়াম পারম্যাঙ্গানেট',
    targetElement: 'Mn',
    oxidationNumber: '+7',
    knowns: ['K = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '1(+1) + x + 4(-2) = 0',
    steps: ['1 + x - 8 = 0', 'x - 7 = 0', 'x = +7'],
  },
  {
    id: 'h2so4',
    formula: 'H₂SO₄',
    name: 'সালফিউরিক এসিড',
    targetElement: 'S',
    oxidationNumber: '+6',
    knowns: ['H = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '2(+1) + x + 4(-2) = 0',
    steps: ['2 + x - 8 = 0', 'x - 6 = 0', 'x = +6'],
  },
  {
    id: 'hno3',
    formula: 'HNO₃',
    name: 'নাইট্রিক এসিড',
    targetElement: 'N',
    oxidationNumber: '+5',
    knowns: ['H = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '1(+1) + x + 3(-2) = 0',
    steps: ['1 + x - 6 = 0', 'x - 5 = 0', 'x = +5'],
  },
  {
    id: 'h3po4',
    formula: 'H₃PO₄',
    name: 'ফসফরিক এসিড',
    targetElement: 'P',
    oxidationNumber: '+5',
    knowns: ['H = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '3(+1) + x + 4(-2) = 0',
    steps: ['3 + x - 8 = 0', 'x - 5 = 0', 'x = +5'],
  },
  {
    id: 'na2s2o3',
    formula: 'Na₂S₂O₃',
    name: 'সোডিয়াম থায়োসালফেট',
    targetElement: 'S',
    oxidationNumber: '+2',
    knowns: ['Na = +1', 'O = -2', 'মোট চার্জ = 0'],
    equation: '2(+1) + 2x + 3(-2) = 0',
    steps: ['2 + 2x - 6 = 0', '2x = +4', 'x = +2'],
  },
];

export default function ChemicalReactionsLab() {
  // Section 1: Le Chatelier's Principle (Haber Process: N2 + 3H2 ⇌ 2NH3, ΔH = -92 kJ)
  const [temperature, setTemperature] = useState<number>(450); // °C (200 - 700)
  const [pressure, setPressure] = useState<number>(200); // atm (50 - 400)
  const [reactantBoost, setReactantBoost] = useState<number>(50); // % (20 - 100)

  // Section 2: Oxidation Number Explorer
  const [selectedCompoundId, setSelectedCompoundId] = useState<string>('k2cr2o7');

  const activeCompound =
    OXIDATION_COMPOUNDS.find((c) => c.id === selectedCompoundId) ??
    OXIDATION_COMPOUNDS[0];

  // Simplified educational yield model for Haber Process (exothermic, 4 mol -> 2 mol)
  // Lower temp -> higher yield; Higher pressure -> higher yield; Higher reactant -> higher yield
  const tempEffect = ((700 - temperature) / 500) * 45; // 0 to 45
  const pressureEffect = ((pressure - 50) / 350) * 35; // 0 to 35
  const concEffect = ((reactantBoost - 20) / 80) * 15; // 0 to 15
  const nh3Yield = Math.max(5, Math.min(95, Math.round(5 + tempEffect + pressureEffect + concEffect)));
  const reactantRemain = 100 - nh3Yield;

  // Equilibrium Shift Direction
  const shiftDirection =
    nh3Yield >= 58 ? 'right' : nh3Yield <= 38 ? 'left' : 'balanced';

  const shiftBadge =
    shiftDirection === 'right'
      ? {
          text: 'সাম্যাবস্থা ডানে সরেছে (NH₃ উৎপাদন বাড়ছে →)',
          style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      : shiftDirection === 'left'
      ? {
          text: 'সাম্যাবস্থা বামে সরেছে (← NH₃ বিয়োজিত হচ্ছে)',
          style: 'bg-rose-50 text-rose-700 border-rose-200',
        }
      : {
          text: 'মধ্যম সাম্যাবস্থা (Balanced Equilibrium)',
          style: 'bg-amber-50 text-amber-800 border-amber-200',
        };

  const handleReset = () => {
    setTemperature(450);
    setPressure(200);
    setReactantBoost(50);
    setSelectedCompoundId('k2cr2o7');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE CHEMICAL REACTIONS LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            লা-শাতেলিয়ারের নীতি ও জারণ সংখ্যা সিমুলেটর
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            তাপমাত্রা, চাপ ও ঘনমাত্রা পরিবর্তন করে অ্যামোনিয়া (NH₃) উৎপাদনের সাম্যাবস্থা এবং বিভিন্ন যৌগের জারণ সংখ্যা নির্ণয় করো।
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

      {/* Section 1: Le Chatelier's Principle Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                হেবার পদ্ধতি: N₂(g) + 3H₂(g) ⇌ 2NH₃(g)
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              তাপোৎপাদী (ΔH = −92 kJ)
            </span>
          </div>

          {/* Shift Status Banner */}
          <div className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold ${shiftBadge.style}`}>
            {shiftBadge.text}
          </div>

          {/* Visual Equilibrium Bar Chart (SVG) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <p className="text-xs font-bold text-slate-500">বিক্রিয়ক (N₂ + 3H₂)</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{reactantRemain}%</p>
                <p className="text-[11px] text-slate-500">মোট গ্যাসীয় মোল = 4</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-700">উৎপাদ (2NH₃)</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">{nh3Yield}%</p>
                <p className="text-[11px] text-emerald-700">মোট গ্যাসীয় মোল = 2</p>
              </div>
            </div>

            {/* Stacked Progress Visual */}
            <div className="space-y-1.5">
              <div className="h-5 w-full rounded-full overflow-hidden flex bg-slate-200 border border-slate-300">
                <div
                  className="bg-slate-600 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: `${reactantRemain}%` }}
                >
                  {reactantRemain >= 18 ? `${reactantRemain}%` : ''}
                </div>
                <div
                  className="bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: `${nh3Yield}%` }}
                >
                  {nh3Yield >= 18 ? `${nh3Yield}% NH₃` : ''}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>← বাম দিক (বিক্রিয়ক)</span>
                <span>ডান দিক (উৎপাদ) →</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setTemperature(250);
                setPressure(350);
                setReactantBoost(90);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer"
            >
              সর্বোচ্চ NH₃ (কম তাপ + উচ্চ চাপ)
            </button>
            <button
              type="button"
              onClick={() => {
                setTemperature(650);
                setPressure(100);
                setReactantBoost(40);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
            >
              উচ্চ তাপমাত্রা ও নিম্ন চাপ
            </button>
            <button
              type="button"
              onClick={() => {
                setTemperature(450);
                setPressure(200);
                setReactantBoost(60);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              শিল্পকারখানার আদর্শ শর্ত (450°C, 200 atm)
            </button>
          </div>
        </section>

        {/* Right: Sliders */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base">প্রভাবকসমূহ নিয়ন্ত্রণ</h3>

          <div className="space-y-4">
            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> তাপমাত্রা (T):
                </span>
                <span className="text-rose-600">{temperature} °C</span>
              </div>
              <input
                type="range"
                min={200}
                max={700}
                step={25}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                তাপোৎপাদী বিক্রিয়া হওয়ায় তাপমাত্রা কমালে NH₃ উৎপাদন বাড়ে।
              </p>
            </div>

            {/* Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" /> চাপ (P):
                </span>
                <span className="text-blue-700">{pressure} atm</span>
              </div>
              <input
                type="range"
                min={50}
                max={400}
                step={25}
                value={pressure}
                onChange={(e) => setPressure(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                বামে ৪ মোল ও ডানে ২ মোল—তাই চাপ বাড়ালে সাম্য ডানে (কম মোলের দিকে) সরে।
              </p>
            </div>

            {/* Reactant Concentration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">বিক্রিয়কের ঘনমাত্রা (N₂ ও H₂):</span>
                <span className="text-emerald-700">{reactantBoost}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={10}
                value={reactantBoost}
                onChange={(e) => setReactantBoost(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-950 leading-relaxed">
              <strong>শিল্পে ব্যবহার:</strong> খুব কম তাপমাত্রায় বিক্রিয়ার গতি ধীর হয়ে যায় বলে শিল্পকারখানায় আয়রন (Fe) প্রভাবকসহ <strong>450–550°C</strong> তাপমাত্রা ও <strong>200 atm</strong> চাপ ব্যবহার করা হয়।
            </p>
          </div>
        </section>
      </div>

      {/* Section 2: Oxidation Number Step-by-Step Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">
            জারণ সংখ্যা নির্ণয় ল্যাব (Oxidation Number Explorer)
          </h3>
        </div>

        {/* Compound Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {OXIDATION_COMPOUNDS.map((compound) => {
            const isSelected = compound.id === selectedCompoundId;
            return (
              <button
                key={compound.id}
                type="button"
                onClick={() => setSelectedCompoundId(compound.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {compound.formula} ({compound.targetElement})
              </button>
            );
          })}
        </div>

        {/* Step-by-Step Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 items-center">
          <div className="md:col-span-8 space-y-3">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {activeCompound.formula} ({activeCompound.name}) যৌগে{' '}
                <span className="text-emerald-700">{activeCompound.targetElement}</span>-এর জারণ সংখ্যা
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeCompound.knowns.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 space-y-1">
              <p className="font-bold text-emerald-700">সমীকরণ: {activeCompound.equation}</p>
              {activeCompound.steps.map((step, i) => (
                <p key={i}>⇒ {step}</p>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-800">
              {activeCompound.targetElement}-এর জারণ সংখ্যা
            </p>
            <p className="text-4xl font-black text-emerald-900">
              {activeCompound.oxidationNumber}
            </p>
            <p className="text-[11px] font-semibold text-emerald-700">
              নিরপেক্ষ যৌগে মোট জারণ সংখ্যা = 0
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}