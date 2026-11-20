
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Beaker,
  Calculator,
  Info,
  PieChart,
  RotateCcw,
  Scale,
  Atom,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  ArrowRight,
  Sigma,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface CompoundSpec {
  id: string;
  formula: string;
  nameBn: string;
  molarMass: number;
  isGasAtSTP: boolean;
  particleType: 'molecule' | 'formula-unit';
  elements: {
    symbol: string;
    nameBn: string;
    totalMass: number;
    color: string;
  }[];
}

interface Preset {
  label: string;
  value: number;
}

// ============================================
// COMPOUND DATA
// ============================================

const COMPOUNDS: CompoundSpec[] = [
  {
    id: 'h2o',
    formula: 'H₂O',
    nameBn: 'পানি',
    molarMass: 18,
    isGasAtSTP: false,
    particleType: 'molecule',
    elements: [
      { symbol: 'H', nameBn: 'হাইড্রোজেন', totalMass: 2, color: '#0284c7' },
      { symbol: 'O', nameBn: 'অক্সিজেন', totalMass: 16, color: '#059669' },
    ],
  },
  {
    id: 'co2',
    formula: 'CO₂',
    nameBn: 'কার্বন ডাই-অক্সাইড',
    molarMass: 44,
    isGasAtSTP: true,
    particleType: 'molecule',
    elements: [
      { symbol: 'C', nameBn: 'কার্বন', totalMass: 12, color: '#475569' },
      { symbol: 'O', nameBn: 'অক্সিজেন', totalMass: 32, color: '#059669' },
    ],
  },
  {
    id: 'na2co3',
    formula: 'Na₂CO₃',
    nameBn: 'সোডিয়াম কার্বনেট',
    molarMass: 106,
    isGasAtSTP: false,
    particleType: 'formula-unit',
    elements: [
      { symbol: 'Na', nameBn: 'সোডিয়াম', totalMass: 46, color: '#e11d48' },
      { symbol: 'C', nameBn: 'কার্বন', totalMass: 12, color: '#475569' },
      { symbol: 'O', nameBn: 'অক্সিজেন', totalMass: 48, color: '#059669' },
    ],
  },
  {
    id: 'h2so4',
    formula: 'H₂SO₄',
    nameBn: 'সালফিউরিক অ্যাসিড',
    molarMass: 98,
    isGasAtSTP: false,
    particleType: 'molecule',
    elements: [
      { symbol: 'H', nameBn: 'হাইড্রোজেন', totalMass: 2, color: '#0284c7' },
      { symbol: 'S', nameBn: 'সালফার', totalMass: 32, color: '#d97706' },
      { symbol: 'O', nameBn: 'অক্সিজেন', totalMass: 64, color: '#059669' },
    ],
  },
  {
    id: 'naoh',
    formula: 'NaOH',
    nameBn: 'সোডিয়াম হাইড্রোক্সাইড',
    molarMass: 40,
    isGasAtSTP: false,
    particleType: 'formula-unit',
    elements: [
      { symbol: 'Na', nameBn: 'সোডিয়াম', totalMass: 23, color: '#e11d48' },
      { symbol: 'O', nameBn: 'অক্সিজেন', totalMass: 16, color: '#059669' },
      { symbol: 'H', nameBn: 'হাইড্রোজেন', totalMass: 1, color: '#0284c7' },
    ],
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    nameBn: 'অ্যামোনিয়া',
    molarMass: 17,
    isGasAtSTP: true,
    particleType: 'molecule',
    elements: [
      { symbol: 'N', nameBn: 'নাইট্রোজেন', totalMass: 14, color: '#7c3aed' },
      { symbol: 'H', nameBn: 'হাইড্রোজেন', totalMass: 3, color: '#0284c7' },
    ],
  },
];

// অ্যাভোগাড্রো ধ্রুবক
const AVOGADRO = 6.022e23;

// ============================================
// HELPERS
// ============================================

function formatScientific(num: number): string {
  if (!Number.isFinite(num) || num === 0) return '0';

  const exp = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / Math.pow(10, exp);

  return `${mantissa.toFixed(3)} × 10^${exp}`;
}

function formatNumber(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : '0';
}

const MOLARITY_PRESETS: Preset[] = [
  { label: '0.1 M', value: 0.1 },
  { label: '0.5 M', value: 0.5 },
  { label: '1.0 M', value: 1 },
  { label: '1.5 M', value: 1.5 },
  { label: '2.0 M', value: 2 },
];

// ============================================
// REUSABLE UI
// ============================================

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  color = 'emerald',
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  color?: 'emerald' | 'blue' | 'violet' | 'amber';
}) {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: 'emerald' | 'blue' | 'amber';
}) {
  const styles = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <p className="text-xs font-bold">{label}</p>

      <p className="text-lg sm:text-xl font-black text-slate-900 mt-2 break-words">
        {value}
      </p>

      <p className="text-[11px] text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function MoleConceptLab() {
  // ------------------------------------------
  // STATE
  // ------------------------------------------

  const [selectedCompoundId, setSelectedCompoundId] = useState('na2co3');
  const [massGrams, setMassGrams] = useState(53);

  const [solutionVolumeMl, setSolutionVolumeMl] = useState(250);
  const [molarity, setMolarity] = useState(0.1);

  const [showMoleSteps, setShowMoleSteps] = useState(false);
  const [showMolaritySteps, setShowMolaritySteps] = useState(false);

  // ------------------------------------------
  // SELECTED COMPOUND
  // ------------------------------------------

  const compound = useMemo(
    () => COMPOUNDS.find((item) => item.id === selectedCompoundId) ?? COMPOUNDS[0],
    [selectedCompoundId]
  );

  // ------------------------------------------
  // MOLE CALCULATIONS
  // ------------------------------------------

  const moleResults = useMemo(() => {
    const moles = massGrams / compound.molarMass;
    const particles = moles * AVOGADRO;
    const stpVolume = moles * 22.4;

    return {
      moles,
      particles,
      stpVolume,
    };
  }, [massGrams, compound]);

  // ------------------------------------------
  // PERCENTAGE COMPOSITION
  // ------------------------------------------

  const percentageResults = useMemo(
    () =>
      compound.elements.map((element) => ({
        ...element,
        percentage: (element.totalMass / compound.molarMass) * 100,
      })),
    [compound]
  );

  // ------------------------------------------
  // MOLARITY CALCULATION
  // w = C × V × Mr / 1000
  // ------------------------------------------

  const requiredMassForSolution = useMemo(() => {
    return (
      (molarity * compound.molarMass * solutionVolumeMl) / 1000
    );
  }, [molarity, compound, solutionVolumeMl]);

  // ------------------------------------------
  // LABELS
  // ------------------------------------------

  const particleLabel =
    compound.particleType === 'formula-unit'
      ? 'ফর্মুলা একক সংখ্যা'
      : 'অণু সংখ্যা';

  const particleDescription =
    compound.particleType === 'formula-unit'
      ? 'মোট ফর্মুলা একক'
      : 'মোট অণু';

  const solutionTypeLabel =
    molarity === 1
      ? 'মোলার দ্রবণ'
      : molarity === 0.5
        ? 'সেমি-মোলার দ্রবণ'
        : molarity === 0.1
          ? 'ডেসি-মোলার দ্রবণ'
          : `${molarity.toFixed(2)} M দ্রবণ`;

  // ------------------------------------------
  // RESET
  // ------------------------------------------

  const handleReset = () => {
    setSelectedCompoundId('na2co3');
    setMassGrams(53);
    setSolutionVolumeMl(250);
    setMolarity(0.1);
    setShowMoleSteps(false);
    setShowMolaritySteps(false);
  };

  const handleCompoundChange = (id: string) => {
    const selected = COMPOUNDS.find((item) => item.id === id);

    if (!selected) return;

    setSelectedCompoundId(id);
    setMassGrams(Math.min(200, Math.max(1, selected.molarMass / 2)));
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-7">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-extrabold tracking-wide">
              <Activity className="w-3.5 h-3.5" />
              SSC CHEMISTRY • CHAPTER 06
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mt-3">
              মোলের ধারণা — ইন্টারঅ্যাকটিভ ল্যাব
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              মোল, অ্যাভোগাড্রো সংখ্যা, গ্যাসের মোলার আয়তন,
              শতকরা সংযুতি ও মোলারিটি নিজে হিসাব করে শেখো।
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            aria-label="সব হিসাব রিসেট করো"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-sm transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6">
          {[
            { label: 'অ্যাভোগাড্রো সংখ্যা', value: '6.022 × 10²³' },
            { label: 'গ্যাসের মোলার আয়তন', value: '22.4 L/mol' },
            { label: 'মোলের একক', value: 'mol' },
            { label: 'মোলারিটির একক', value: 'mol/L' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/80 border border-white p-3"
            >
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">
                {item.label}
              </p>
              <p className="text-sm sm:text-base font-black text-slate-800 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ========================================
          COMPOUND SELECTOR
      ======================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <SectionHeading
          icon={Scale}
          title="রাসায়নিক যৌগ নির্বাচন"
          subtitle="যে যৌগের হিসাব করতে চাও সেটি নির্বাচন করো"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
          {COMPOUNDS.map((item) => {
            const active = item.id === compound.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCompoundChange(item.id)}
                aria-pressed={active}
                className={`relative min-w-0 rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                {active && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4" />
                )}

                <p className="text-lg sm:text-xl font-black">
                  {item.formula}
                </p>

                <p className={`text-[10px] font-semibold mt-1 ${
                  active ? 'text-emerald-50' : 'text-slate-500'
                }`}>
                  {item.nameBn}
                </p>

                <p className={`text-[10px] mt-2 font-bold ${
                  active ? 'text-emerald-100' : 'text-slate-600'
                }`}>
                  Mr = {item.molarMass}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            নির্বাচিত: <strong>{compound.nameBn}</strong>
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
            {compound.isGasAtSTP ? 'STP-তে গ্যাস' : 'STP-তে গ্যাস নয়'}
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700">
            Mr = {compound.molarMass} g/mol
          </span>
        </div>
      </section>

      {/* ========================================
          SECTION 1: MOLE CALCULATOR
      ======================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        <SectionHeading
          icon={Calculator}
          title={`মোল ও কণাসংখ্যা ক্যালকুলেটর (${compound.formula})`}
          subtitle="ভর পরিবর্তন করলেই মোল ও কণাসংখ্যা স্বয়ংক্রিয়ভাবে হিসাব হবে"
        />

        {/* Mass Input */}

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="mass-slider" className="text-sm font-bold text-slate-700">
              পদার্থের ভর (w)
            </label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={200}
                step={1}
                value={massGrams}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isFinite(value)) {
                    setMassGrams(Math.min(200, Math.max(1, value)));
                  }
                }}
                aria-label="পদার্থের ভর গ্রামে"
                className="w-20 text-right font-black text-emerald-700 bg-white border border-emerald-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-200"
              />

              <span className="text-sm font-bold text-slate-500">g</span>
            </div>
          </div>

          <input
            id="mass-slider"
            type="range"
            min={1}
            max={200}
            step={1}
            value={massGrams}
            onChange={(e) => setMassGrams(Number(e.target.value))}
            aria-label="পদার্থের ভর পরিবর্তন"
            className="w-full accent-emerald-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>1 g</span>
            <span>100 g</span>
            <span>200 g</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMassGrams(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  massGrams === value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {value} g
              </button>
            ))}
          </div>
        </div>

        {/* Results */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ResultCard
            label="মোল সংখ্যা (n)"
            value={`${formatNumber(moleResults.moles, 4)} mol`}
            description="n = w ÷ Mr"
            color="emerald"
          />

          <ResultCard
            label={particleLabel}
            value={formatScientific(moleResults.particles)}
            description={`N = n × Nₐ • ${particleDescription}`}
            color="blue"
          />

          <ResultCard
            label="STP-তে গ্যাসের আয়তন"
            value={
              compound.isGasAtSTP
                ? `${formatNumber(moleResults.stpVolume, 3)} L`
                : 'প্রযোজ্য নয়'
            }
            description="V = n × 22.4 L"
            color="amber"
          />
        </div>

        {/* Calculation Steps */}

        <div className="border border-emerald-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMoleSteps((value) => !value)}
            aria-expanded={showMoleSteps}
            className="w-full flex items-center justify-between gap-3 p-3.5 bg-emerald-50 hover:bg-emerald-100 transition-colors text-left"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <BookOpen className="w-4 h-4" />
              ধাপে ধাপে হিসাব দেখো
            </span>

            <span className="text-xs font-bold text-emerald-700">
              {showMoleSteps ? 'বন্ধ করো −' : 'দেখো +'}
            </span>
          </button>

          {showMoleSteps && (
            <div className="p-4 space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-800">ধাপ ১: মোল সংখ্যা নির্ণয়</p>
                <p className="text-slate-600 mt-1">
                  সূত্র: n = w ÷ Mr
                </p>
                <p className="font-mono text-emerald-700 mt-1">
                  n = {massGrams} ÷ {compound.molarMass}
                </p>
                <p className="font-bold text-slate-900 mt-1">
                  n = {formatNumber(moleResults.moles, 4)} mol
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-800">ধাপ ২: কণাসংখ্যা নির্ণয়</p>
                <p className="text-slate-600 mt-1">
                  সূত্র: N = n × Nₐ
                </p>
                <p className="font-mono text-blue-700 mt-1">
                  N = {formatNumber(moleResults.moles, 4)} × 6.022 × 10²³
                </p>
                <p className="font-bold text-slate-900 mt-1 break-all">
                  N = {formatScientific(moleResults.particles)}
                </p>
              </div>

              {compound.isGasAtSTP && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-800">ধাপ ৩: STP-তে আয়তন</p>
                  <p className="text-slate-600 mt-1">
                    সূত্র: V = n × 22.4
                  </p>
                  <p className="font-mono text-amber-700 mt-1">
                    V = {formatNumber(moleResults.moles, 4)} × 22.4
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    V = {formatNumber(moleResults.stpVolume, 3)} L
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>মনে রাখবে:</strong> ১ মোল পদার্থে প্রায়
            ৬.০২২ × ১০²³ টি কণা থাকে। আণবিক পদার্থের ক্ষেত্রে এগুলো অণু,
            আর আয়নিক পদার্থের ক্ষেত্রে ফর্মুলা একক।
          </p>
        </div>
      </section>

      {/* ========================================
          SECTION 2: PERCENTAGE COMPOSITION
      ======================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        <SectionHeading
          icon={PieChart}
          title={`শতকরা সংযুতি (${compound.formula})`}
          subtitle="যৌগে প্রতিটি মৌলের ভরের শতকরা পরিমাণ নির্ণয়"
          color="violet"
        />

        {/* Formula */}

        <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
          <p className="text-xs font-bold text-violet-900">
            শতকরা সংযুতির সূত্র
          </p>
          <p className="text-sm sm:text-base font-black text-violet-800 mt-1">
            শতকরা সংযুতি = (মৌলের মোট ভর ÷ যৌগের আণবিক/সংকেত ভর) × ১০০
          </p>
        </div>

        {/* Stacked Bar */}

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-slate-600">
              মৌলগুলোর শতকরা অনুপাত
            </p>
            <p className="text-xs font-bold text-slate-500">
              মোট = 100%
            </p>
          </div>

          <div
            className="h-7 w-full flex overflow-hidden rounded-full border border-slate-200 bg-slate-100"
            aria-label="মৌলগুলোর শতকরা সংযুতির বার"
          >
            {percentageResults.map((element) => (
              <div
                key={element.symbol}
                style={{
                  width: `${element.percentage}%`,
                  backgroundColor: element.color,
                }}
                title={`${element.nameBn}: ${element.percentage.toFixed(2)}%`}
                className="h-full transition-all duration-500"
              />
            ))}
          </div>
        </div>

        {/* Element Breakdown */}

        <div className="space-y-3">
          {percentageResults.map((element) => (
            <div
              key={element.symbol}
              className="rounded-xl border border-slate-200 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: element.color }}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      {element.nameBn} ({element.symbol})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      মোট ভর: {element.totalMass} g/mol
                    </p>
                  </div>
                </div>

                <p className="text-base sm:text-lg font-black text-slate-900 shrink-0">
                  {element.percentage.toFixed(2)}%
                </p>
              </div>

              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${element.percentage}%`,
                    backgroundColor: element.color,
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                ({element.totalMass} ÷ {compound.molarMass}) × 100
                = <strong className="text-slate-800">
                  {element.percentage.toFixed(2)}%
                </strong>
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-violet-50 border border-violet-100 p-3 flex gap-2">
          <Lightbulb className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
          <p className="text-xs text-violet-900 leading-relaxed">
            <strong>শিক্ষণীয় বিষয়:</strong> একটি যৌগে মৌলগুলোর শতকরা সংযুতির
            যোগফল ১০০% হবে।
          </p>
        </div>
      </section>

      {/* ========================================
          SECTION 3: MOLARITY LAB
      ======================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading
            icon={Beaker}
            title="মোলার দ্রবণ প্রস্তুতি ল্যাব"
            subtitle="নির্দিষ্ট ঘনমাত্রার দ্রবণ তৈরি করতে কত গ্রাম দ্রব লাগবে?"
            color="blue"
          />

          <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            {solutionTypeLabel}
          </span>
        </div>

        {/* Formula */}

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
          <p className="text-xs font-bold text-blue-900">
            প্রয়োজনীয় দ্রবের ভরের সূত্র
          </p>

          <p className="text-lg sm:text-xl font-black text-blue-800 mt-1">
            w = C × V × Mr ÷ 1000
          </p>

          <p className="text-[11px] text-blue-700 mt-1">
            এখানে C = মোলারিটি, V = আয়তন (mL), Mr = মোলার ভর
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}

          <div className="space-y-5">
            {/* Volume */}

            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <label htmlFor="volume-slider" className="text-sm font-bold text-slate-700">
                  দ্রবণের আয়তন (V)
                </label>

                <span className="text-sm font-black text-blue-700">
                  {solutionVolumeMl} mL
                </span>
              </div>

              <input
                id="volume-slider"
                type="range"
                min={50}
                max={1000}
                step={50}
                value={solutionVolumeMl}
                onChange={(e) => setSolutionVolumeMl(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>50 mL</span>
                <span>500 mL</span>
                <span>1000 mL</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[100, 250, 500, 1000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSolutionVolumeMl(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      solutionVolumeMl === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    {value} mL
                  </button>
                ))}
              </div>
            </div>

            {/* Molarity */}

            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <label htmlFor="molarity-slider" className="text-sm font-bold text-slate-700">
                  মোলারিটি (C)
                </label>

                <span className="text-sm font-black text-blue-700">
                  {molarity.toFixed(2)} M
                </span>
              </div>

              <input
                id="molarity-slider"
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={molarity}
                onChange={(e) => setMolarity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>0.1 M</span>
                <span>1.0 M</span>
                <span>2.0 M</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOLARITY_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setMolarity(preset.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      molarity === preset.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Visualization */}

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 sm:p-5 flex flex-col justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">
                  প্রয়োজনীয় {compound.formula}-এর ভর
                </p>
                <p className="text-2xl sm:text-3xl font-black text-blue-700">
                  {requiredMassForSolution.toFixed(3)} g
                </p>
              </div>
            </div>

            {/* Beaker */}

            <div className="flex items-center justify-center gap-6">
              <div className="relative w-24 h-36">
                <div className="absolute inset-0 border-[3px] border-slate-400 border-t-0 rounded-b-2xl bg-white/70 overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                    style={{
                      height: `${Math.min(95, (solutionVolumeMl / 1000) * 100)}%`,
                      background: `linear-gradient(180deg, rgba(96,165,250,0.65), rgba(37,99,235,0.85))`,
                    }}
                  />

                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-blue-400/70"
                    style={{
                      bottom: `${Math.min(95, (solutionVolumeMl / 1000) * 100)}%`,
                    }}
                  />
                </div>

                <div className="absolute -right-8 top-4 text-[9px] text-slate-400">
                  1000 mL
                </div>

                <div className="absolute -right-8 bottom-1 text-[9px] text-slate-400">
                  0 mL
                </div>
              </div>

              <div className="space-y-2 min-w-0">
                <p className="text-xs font-bold text-slate-600">
                  দ্রবণের পরিমাণ
                </p>

                <p className="text-xl font-black text-slate-900">
                  {solutionVolumeMl} mL
                </p>

                <p className="text-xs text-slate-500">
                  ঘনমাত্রা: {molarity.toFixed(2)} M
                </p>

                <p className="text-xs text-slate-500">
                  দ্রব: {compound.formula}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/80 border border-blue-100 p-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                {solutionVolumeMl} mL আয়তনের {molarity.toFixed(2)} M
                দ্রবণ প্রস্তুত করতে প্রয়োজন
                <strong className="text-blue-700">
                  {' '}{requiredMassForSolution.toFixed(3)} g
                </strong>
                {' '}{compound.nameBn}।
              </p>
            </div>
          </div>
        </div>

        {/* Molarity Steps */}

        <div className="border border-blue-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMolaritySteps((value) => !value)}
            aria-expanded={showMolaritySteps}
            className="w-full flex items-center justify-between gap-3 p-3.5 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <Sigma className="w-4 h-4" />
              মোলারিটির হিসাব দেখো
            </span>

            <span className="text-xs font-bold text-blue-700">
              {showMolaritySteps ? 'বন্ধ করো −' : 'দেখো +'}
            </span>
          </button>

          {showMolaritySteps && (
            <div className="p-4 space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-800">প্রদত্ত তথ্য:</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  <li>মোলারিটি (C) = {molarity.toFixed(2)} mol/L</li>
                  <li>আয়তন (V) = {solutionVolumeMl} mL</li>
                  <li>মোলার ভর (Mr) = {compound.molarMass} g/mol</li>
                </ul>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-800">সূত্র:</p>
                <p className="font-mono text-blue-700 mt-1">
                  w = C × V × Mr ÷ 1000
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-800">মান বসিয়ে পাই:</p>
                <p className="font-mono text-blue-700 mt-1 break-words">
                  w = {molarity.toFixed(2)} × {solutionVolumeMl} × {compound.molarMass} ÷ 1000
                </p>

                <p className="font-black text-slate-900 text-base mt-2">
                  w = {requiredMassForSolution.toFixed(3)} g
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />

          <p className="text-xs text-emerald-900 leading-relaxed">
            <strong>দ্রবণ প্রস্তুতির নিয়ম:</strong> প্রথমে প্রয়োজনীয় পরিমাণ
            দ্রব ও কিছু দ্রাবক নিয়ে দ্রবীভূত করতে হবে। এরপর দ্রাবক যোগ করে
            দ্রবণের চূড়ান্ত আয়তন নির্দিষ্ট মানে আনতে হবে।
          </p>
        </div>
      </section>

      {/* ========================================
          SSC QUICK REVISION
      ======================================== */}

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-700" />
          </div>

          <div>
            <h3 className="font-black text-slate-900">
              SSC পরীক্ষার জন্য গুরুত্বপূর্ণ সূত্র
            </h3>
            <p className="text-[11px] text-slate-500">
              মোলের ধারণা — দ্রুত রিভিশন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              title: 'মোল সংখ্যা',
              formula: 'n = w ÷ Mr',
              note: 'ভর ÷ মোলার ভর',
            },
            {
              title: 'কণাসংখ্যা',
              formula: 'N = n × Nₐ',
              note: 'মোল × অ্যাভোগাড্রো সংখ্যা',
            },
            {
              title: 'গ্যাসের আয়তন (STP)',
              formula: 'V = n × 22.4 L',
              note: 'শুধু গ্যাসের ক্ষেত্রে',
            },
            {
              title: 'মোলারিটি',
              formula: 'C = n ÷ V(L)',
              note: 'মোল ÷ আয়তন (লিটার)',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white/80 border border-amber-100 p-3"
            >
              <p className="text-xs font-bold text-slate-600">
                {item.title}
              </p>

              <p className="text-base font-black text-amber-800 mt-1">
                {item.formula}
              </p>

              <p className="text-[10px] text-slate-500 mt-1">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/70 border border-amber-100">
          <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>পরীক্ষার টিপস:</strong> মোলারিটির অঙ্কে আয়তন লিটারে
            ব্যবহার করতে হবে। আয়তন mL-এ দেওয়া থাকলে ১০০০ দিয়ে ভাগ করে
            লিটারে রূপান্তর করবে।
          </p>
        </div>
      </section>

      {/* ========================================
          FOOTER NOTE
      ======================================== */}

      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          এই ল্যাবটি শিক্ষামূলক হিসাবের জন্য তৈরি। এখানে ব্যবহৃত পারমাণবিক
          ভরগুলো সরলীকৃত SSC-স্তরের মান। STP-তে ২২.৪ L/mol আয়তন আদর্শ
          গ্যাসের আনুমানিক মোলার আয়তন হিসেবে ব্যবহৃত হয়েছে।
        </p>
      </div>
    </div>
  );
}
