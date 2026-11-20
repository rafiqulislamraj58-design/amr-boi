
'use client';

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Info,
  Lightbulb,
  RotateCcw,
  Zap,
  Gauge,
  Waves,
  Calculator,
  BatteryCharging,
  CircuitBoard,
  CheckCircle2,
  TrendingUp,
  Clock,
  Coins,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Power,
  RefreshCw,
} from 'lucide-react';

type CircuitMode = 'series' | 'parallel';

const DEFAULTS = {
  voltage: 12,
  r1: 6,
  r2: 3,
  powerWatt: 100,
  hoursPerDay: 5,
  days: 30,
  unitPrice: 6,
};

const LEARNING_POINTS = [
  'শ্রেণি ও সমান্তরাল বর্তনীর পার্থক্য',
  'ওহমের সূত্রের ব্যবহার: V = IR',
  'তুল্য রোধ নির্ণয়',
  'তড়িৎ ক্ষমতা: P = VI',
  'প্রতিটি রোধের বিভব পার্থক্য ও প্রবাহ',
  'বিদ্যুৎ শক্তি ও ইউনিট বিলের হিসাব',
];

export default function CurrentElectricityLab() {
  // Circuit state
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('series');
  const [voltage, setVoltage] = useState(DEFAULTS.voltage);
  const [r1, setR1] = useState(DEFAULTS.r1);
  const [r2, setR2] = useState(DEFAULTS.r2);

  // Electricity bill state
  const [powerWatt, setPowerWatt] = useState(DEFAULTS.powerWatt);
  const [hoursPerDay, setHoursPerDay] = useState(DEFAULTS.hoursPerDay);
  const [days, setDays] = useState(DEFAULTS.days);
  const [unitPrice, setUnitPrice] = useState(DEFAULTS.unitPrice);

  // Calculations
  const rEq =
    circuitMode === 'series'
      ? r1 + r2
      : (r1 * r2) / (r1 + r2);

  const totalCurrent = voltage / rEq;
  const totalPower = voltage * totalCurrent;

  const i1 = circuitMode === 'series' ? totalCurrent : voltage / r1;
  const i2 = circuitMode === 'series' ? totalCurrent : voltage / r2;

  const v1 = circuitMode === 'series' ? i1 * r1 : voltage;
  const v2 = circuitMode === 'series' ? i2 * r2 : voltage;

  const p1 = v1 * i1;
  const p2 = v2 * i2;

  // Electricity bill
  const totalHours = hoursPerDay * days;
  const totalUnits = (powerWatt * totalHours) / 1000;
  const totalBill = totalUnits * unitPrice;

  // Reset functions
  const resetCircuit = () => {
    setCircuitMode('series');
    setVoltage(DEFAULTS.voltage);
    setR1(DEFAULTS.r1);
    setR2(DEFAULTS.r2);
  };

  const resetBill = () => {
    setPowerWatt(DEFAULTS.powerWatt);
    setHoursPerDay(DEFAULTS.hoursPerDay);
    setDays(DEFAULTS.days);
    setUnitPrice(DEFAULTS.unitPrice);
  };

  const handleReset = () => {
    resetCircuit();
    resetBill();
  };

  return (
    <div className="space-y-6 pb-4">

      {/* ================= GLOBAL HEADER ================= */}

      <section className="relative isolate overflow-hidden rounded-3xl border border-blue-900/20 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-5 text-white shadow-xl shadow-blue-950/10 sm:p-7 lg:p-8">

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
              <Activity className="h-4 w-4 text-cyan-300" />

              <span className="text-[10px] font-black tracking-[0.16em] text-blue-100 sm:text-xs">
                INTERACTIVE PHYSICS LAB
              </span>

              <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-black text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/20 active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              সব রিসেট
            </button>

          </div>

          <div className="mt-7 flex items-start gap-4 sm:mt-9">

            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/15 shadow-inner sm:flex">
              <CircuitBoard className="h-9 w-9 text-cyan-300" />
            </div>

            <div className="min-w-0">

              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Learn by Experimenting
              </div>

              <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                চল তড়িৎ ইন্টারঅ্যাকটিভ ল্যাব
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-7 text-blue-100/75 sm:text-sm">
                শ্রেণি ও সমান্তরাল বর্তনী তৈরি করো, ভোল্টেজ এবং রোধ
                পরিবর্তন করো এবং বাস্তব সময়ে তড়িৎ প্রবাহ,
                বিভব পার্থক্য ও ক্ষমতার পরিবর্তন পর্যবেক্ষণ করো।
              </p>

            </div>

          </div>

          {/* Header Statistics */}

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <HeaderStat
              icon={<BatteryCharging className="h-4 w-4" />}
              label="Voltage"
              value={`${voltage} V`}
              color="text-rose-300"
            />

            <HeaderStat
              icon={<Gauge className="h-4 w-4" />}
              label="Current"
              value={`${totalCurrent.toFixed(2)} A`}
              color="text-cyan-300"
            />

            <HeaderStat
              icon={<Activity className="h-4 w-4" />}
              label="Resistance"
              value={`${rEq.toFixed(2)} Ω`}
              color="text-amber-300"
            />

            <HeaderStat
              icon={<Zap className="h-4 w-4" />}
              label="Power"
              value={`${totalPower.toFixed(2)} W`}
              color="text-emerald-300"
            />

          </div>

        </div>
      </section>

      {/* ================= CIRCUIT WORKSPACE ================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

        {/* ================= CIRCUIT VISUALIZATION ================= */}

        <section className="min-w-0 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-7">

          <SectionHeading
            icon={<Cpu className="h-5 w-5" />}
            title="বর্তনী সিমুলেটর"
            subtitle="Circuit Visualization"
            color="blue"
            right={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Active
              </span>
            }
          />

          {/* Circuit Mode */}

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-1.5">

            <div className="grid grid-cols-2 gap-2">

              <ModeButton
                active={circuitMode === 'series'}
                onClick={() => setCircuitMode('series')}
                title="শ্রেণি বর্তনী"
                subtitle="Series Circuit"
                icon={<CircuitBoard className="h-4 w-4" />}
              />

              <ModeButton
                active={circuitMode === 'parallel'}
                onClick={() => setCircuitMode('parallel')}
                title="সমান্তরাল বর্তনী"
                subtitle="Parallel Circuit"
                icon={<Activity className="h-4 w-4" />}
              />

            </div>

          </div>

          {/* Circuit Diagram */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/70">

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-4 py-3">

              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-500">
                  CIRCUIT DIAGRAM
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Live circuit simulation
                </p>
              </div>

              <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">
                {circuitMode === 'series' ? '01 — SERIES' : '02 — PARALLEL'}
              </span>

            </div>

            <div className="overflow-x-auto p-2 sm:p-4">

              <svg
                viewBox="0 0 560 270"
                className="mx-auto block h-auto w-full min-w-[310px] max-w-[600px]"
                role="img"
                aria-label={`${circuitMode} circuit with two resistors and a ${voltage} volt battery`}
              >

                <defs>
                  <filter id="currentGlow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Battery */}

                <line x1="75" y1="55" x2="75" y2="112" stroke="#334155" strokeWidth="3" />
                <line x1="75" y1="142" x2="75" y2="215" stroke="#334155" strokeWidth="3" />

                <line x1="55" y1="112" x2="95" y2="112" stroke="#e11d48" strokeWidth="4" />
                <line x1="63" y1="122" x2="87" y2="122" stroke="#334155" strokeWidth="3" />
                <line x1="55" y1="132" x2="95" y2="132" stroke="#e11d48" strokeWidth="4" />
                <line x1="63" y1="142" x2="87" y2="142" stroke="#334155" strokeWidth="3" />

                <text x="14" y="130" fill="#e11d48" fontSize="14" fontWeight="bold">
                  {voltage}V
                </text>

                <text x="13" y="148" fill="#64748b" fontSize="10">
                  Battery
                </text>

                {circuitMode === 'series' ? (
                  <>

                    {/* Main wires */}

                    <path
                      d="M75 55 H500 V215 H75"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Resistor 1 */}

                    <rect
                      x="190"
                      y="40"
                      width="90"
                      height="30"
                      rx="6"
                      fill="#fef3c7"
                      stroke="#d97706"
                      strokeWidth="2.5"
                    />

                    <text
                      x="235"
                      y="59"
                      textAnchor="middle"
                      fill="#92400e"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      R₁ = {r1} Ω
                    </text>

                    {/* Resistor 2 */}

                    <rect
                      x="330"
                      y="200"
                      width="90"
                      height="30"
                      rx="6"
                      fill="#e0f2fe"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />

                    <text
                      x="375"
                      y="219"
                      textAnchor="middle"
                      fill="#075985"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      R₂ = {r2} Ω
                    </text>

                    {/* Current animation */}

                    <path
                      d="M95 55 H480 V215 H95"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      filter="url(#currentGlow)"
                      className="animate-[dash_1.5s_linear_infinite]"
                    />

                    <text
                      x="235"
                      y="95"
                      textAnchor="middle"
                      fill="#1d4ed8"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      I₁ = I₂ = {totalCurrent.toFixed(2)} A
                    </text>

                    <text
                      x="375"
                      y="185"
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      V₂ = {v2.toFixed(2)} V
                    </text>

                    <text
                      x="235"
                      y="155"
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      V₁ = {v1.toFixed(2)} V
                    </text>

                  </>
                ) : (
                  <>

                    {/* Parallel wires */}

                    <path
                      d="M75 55 H480 M75 215 H480"
                      stroke="#334155"
                      strokeWidth="3"
                      fill="none"
                    />

                    {/* Branch 1 */}

                    <path
                      d="M260 55 V105 M260 155 V215"
                      stroke="#334155"
                      strokeWidth="3"
                      fill="none"
                    />

                    <rect
                      x="215"
                      y="105"
                      width="90"
                      height="50"
                      rx="7"
                      fill="#fef3c7"
                      stroke="#d97706"
                      strokeWidth="2.5"
                    />

                    <text
                      x="260"
                      y="125"
                      textAnchor="middle"
                      fill="#92400e"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      R₁ = {r1} Ω
                    </text>

                    <text
                      x="260"
                      y="143"
                      textAnchor="middle"
                      fill="#92400e"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      I₁ = {i1.toFixed(2)} A
                    </text>

                    {/* Branch 2 */}

                    <path
                      d="M430 55 V105 M430 155 V215"
                      stroke="#334155"
                      strokeWidth="3"
                      fill="none"
                    />

                    <rect
                      x="385"
                      y="105"
                      width="90"
                      height="50"
                      rx="7"
                      fill="#e0f2fe"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />

                    <text
                      x="430"
                      y="125"
                      textAnchor="middle"
                      fill="#075985"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      R₂ = {r2} Ω
                    </text>

                    <text
                      x="430"
                      y="143"
                      textAnchor="middle"
                      fill="#075985"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      I₂ = {i2.toFixed(2)} A
                    </text>

                    {/* Current animation */}

                    <path
                      d="M95 55 H450 M260 65 V195 M430 65 V195 M450 215 H95"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      strokeDasharray="7 12"
                      strokeLinecap="round"
                      filter="url(#currentGlow)"
                      className="animate-[dash_1.5s_linear_infinite]"
                    />

                    <circle cx="260" cy="55" r="4" fill="#2563eb" />
                    <circle cx="430" cy="55" r="4" fill="#2563eb" />
                    <circle cx="260" cy="215" r="4" fill="#2563eb" />
                    <circle cx="430" cy="215" r="4" fill="#2563eb" />

                    <text
                      x="345"
                      y="245"
                      textAnchor="middle"
                      fill="#047857"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      V₁ = V₂ = {voltage} V
                    </text>

                  </>
                )}

                {/* Main current indicator */}

                <rect
                  x="120"
                  y="5"
                  width="120"
                  height="25"
                  rx="8"
                  fill="#dbeafe"
                  stroke="#93c5fd"
                />

                <text
                  x="180"
                  y="22"
                  textAnchor="middle"
                  fill="#1d4ed8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  I = {totalCurrent.toFixed(2)} A →
                </text>

              </svg>

            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-200/80 bg-white/70 px-3 py-3">

              <LegendItem color="bg-slate-600" label="Wire" />
              <LegendItem color="bg-amber-500" label="R₁" />
              <LegendItem color="bg-sky-500" label="R₂" />
              <LegendItem color="bg-rose-500" label="Battery" />
              <LegendItem color="bg-cyan-500" label="Current" />

            </div>

          </div>

          {/* Quick Metrics */}

          <div className="grid grid-cols-2 gap-3">

            <QuickMetric
              label="Total Current"
              value={totalCurrent.toFixed(3)}
              unit="A"
              icon={<Waves className="h-4 w-4" />}
              color="blue"
            />

            <QuickMetric
              label="Total Resistance"
              value={rEq.toFixed(3)}
              unit="Ω"
              icon={<Activity className="h-4 w-4" />}
              color="indigo"
            />

          </div>

          {/* Concept Explanation */}

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
                <Info className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-blue-950">
                  {circuitMode === 'series'
                    ? 'শ্রেণি বর্তনীর বৈশিষ্ট্য'
                    : 'সমান্তরাল বর্তনীর বৈশিষ্ট্য'}
                </p>

                <p className="mt-1.5 text-xs leading-6 text-blue-900/80">
                  {circuitMode === 'series'
                    ? 'শ্রেণি বর্তনীতে সকল রোধের মধ্য দিয়ে একই তড়িৎ প্রবাহ চলে। মোট বিভব পার্থক্য প্রতিটি রোধে ভাগ হয়ে যায়।'
                    : 'সমান্তরাল বর্তনীতে প্রতিটি শাখায় একই বিভব পার্থক্য থাকে। মূল তড়িৎ প্রবাহ বিভিন্ন শাখায় ভাগ হয়ে যায়।'}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ================= CONTROL PANEL ================= */}

        <section className="min-w-0 space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-5">

          <SectionHeading
            icon={<Gauge className="h-5 w-5" />}
            title="বর্তনী নিয়ন্ত্রণ"
            subtitle="Adjust Circuit Parameters"
            color="indigo"
          />

          {/* Controls */}

          <div className="space-y-3">

            <RangeControl
              label="ব্যাটারি ভোল্টেজ"
              symbol="V"
              value={voltage}
              min={2}
              max={24}
              step={2}
              unit="V"
              color="rose"
              onChange={setVoltage}
            />

            <RangeControl
              label="প্রথম রোধ"
              symbol="R₁"
              value={r1}
              min={1}
              max={20}
              step={1}
              unit="Ω"
              color="amber"
              onChange={setR1}
            />

            <RangeControl
              label="দ্বিতীয় রোধ"
              symbol="R₂"
              value={r2}
              min={1}
              max={20}
              step={1}
              unit="Ω"
              color="sky"
              onChange={setR2}
            />

          </div>

          {/* Live Result */}

          <div className="space-y-3 border-t border-slate-100 pt-5">

            <div className="flex items-center justify-between gap-2">

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  লাইভ রেজাল্ট
                </h4>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Automatically calculated values
                </p>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700">
                <Activity className="h-3 w-3" />
                LIVE DATA
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <MetricCard
                label="তুল্য রোধ"
                value={rEq.toFixed(2)}
                unit="Ω"
                icon={<Activity className="h-4 w-4" />}
                color="blue"
              />

              <MetricCard
                label="মূল প্রবাহ"
                value={totalCurrent.toFixed(2)}
                unit="A"
                icon={<Waves className="h-4 w-4" />}
                color="indigo"
              />

              <MetricCard
                label="মোট ভোল্টেজ"
                value={voltage.toFixed(2)}
                unit="V"
                icon={<BatteryCharging className="h-4 w-4" />}
                color="rose"
              />

              <MetricCard
                label="মোট ক্ষমতা"
                value={totalPower.toFixed(2)}
                unit="W"
                icon={<Zap className="h-4 w-4" />}
                color="amber"
              />

            </div>

          </div>

          {/* Resistor Analysis */}

          <div className="space-y-3 border-t border-slate-100 pt-5">

            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                রোধভিত্তিক বিশ্লেষণ
              </h4>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Individual resistor performance
              </p>
            </div>

            <ResistorAnalysis
              name="R₁"
              resistance={r1}
              current={i1}
              voltage={v1}
              power={p1}
              color="amber"
            />

            <ResistorAnalysis
              name="R₂"
              resistance={r2}
              current={i2}
              voltage={v2}
              power={p2}
              color="sky"
            />

          </div>

          {/* Reset */}

          <button
            type="button"
            onClick={resetCircuit}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.99]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            বর্তনী রিসেট করুন
          </button>

        </section>

      </div>

      {/* ================= ELECTRICITY BILL CALCULATOR ================= */}

      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">

        {/* Bill Header */}

        <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-5 sm:p-6">

          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-700 shadow-sm">
                <Lightbulb className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-emerald-950 sm:text-lg">
                  বিদ্যুৎ বিল ক্যালকুলেটর
                </h3>

                <p className="mt-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
                  Electricity Consumption & Bill Calculator
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={resetBill}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              রিসেট
            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">

          {/* Bill Controls */}

          <div className="space-y-5 lg:col-span-7">

            <SectionHeading
              icon={<Calculator className="h-4 w-4" />}
              title="ব্যবহারের তথ্য"
              subtitle="Adjust your electricity usage"
              color="emerald"
              compact
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <RangeControl
                label="যন্ত্রের ক্ষমতা"
                symbol="P"
                value={powerWatt}
                min={20}
                max={2000}
                step={20}
                unit="W"
                color="emerald"
                onChange={setPowerWatt}
              />

              <RangeControl
                label="দৈনিক ব্যবহার"
                symbol="t"
                value={hoursPerDay}
                min={1}
                max={24}
                step={1}
                unit="ঘণ্টা"
                color="emerald"
                onChange={setHoursPerDay}
              />

              <RangeControl
                label="মোট দিন"
                symbol="D"
                value={days}
                min={1}
                max={31}
                step={1}
                unit="দিন"
                color="emerald"
                onChange={setDays}
              />

              <RangeControl
                label="প্রতি ইউনিট মূল্য"
                symbol="৳"
                value={unitPrice}
                min={4}
                max={15}
                step={0.5}
                unit="টাকা"
                color="emerald"
                onChange={setUnitPrice}
              />

            </div>

            {/* Formula */}

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                  <Calculator className="h-4 w-4" />
                </div>

                <p className="text-xs font-extrabold text-emerald-950">
                  শক্তি নির্ণয়ের সূত্র
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-base font-black text-emerald-800">
                  E = P × t
                </span>

                <span className="text-lg font-black text-emerald-500">
                  ÷ 1000
                </span>

                <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-800">
                  kWh
                </span>

              </div>

              <p className="mt-3 text-[10px] leading-6 text-emerald-800/80">
                এখানে P হলো ওয়াটে ক্ষমতা এবং t হলো ঘণ্টায় মোট ব্যবহার সময়।
                ১০০০ দিয়ে ভাগ করলে শক্তি কিলোওয়াট-ঘণ্টায় পাওয়া যায়।
              </p>

            </div>

          </div>

          {/* Bill Results */}

          <div className="space-y-4 lg:col-span-5">

            <SectionHeading
              icon={<TrendingUp className="h-4 w-4" />}
              title="বিদ্যুৎ ব্যবহারের ফলাফল"
              subtitle="Calculated electricity usage"
              color="emerald"
              compact
            />

            {/* Main Bill Card */}

            <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/10">

              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">

                <div className="flex items-center justify-between gap-2">

                  <div className="flex items-center gap-2 text-emerald-100">
                    <Coins className="h-5 w-5" />
                    <span className="text-xs font-bold">
                      আনুমানিক মোট বিদ্যুৎ বিল
                    </span>
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-bold text-emerald-100">
                    ESTIMATED
                  </span>

                </div>

                <p className="mt-5 break-all text-3xl font-black tracking-tight sm:text-4xl">
                  ৳{totalBill.toFixed(2)}
                </p>

                <p className="mt-2 text-xs text-emerald-100">
                  {totalUnits.toFixed(3)} ইউনিট × ৳{unitPrice}
                </p>

                <div className="my-5 h-px bg-white/20" />

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-[10px] text-emerald-100">
                      মোট ব্যবহার সময়
                    </p>
                    <p className="mt-1 text-sm font-extrabold">
                      {totalHours} ঘণ্টা
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-emerald-100">
                      দৈনিক ব্যবহার
                    </p>
                    <p className="mt-1 text-sm font-extrabold">
                      {hoursPerDay} ঘণ্টা
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Result Cards */}

            <div className="grid grid-cols-2 gap-3">

              <ResultCard
                icon={<Zap className="h-4 w-4" />}
                label="মোট ইউনিট"
                value={totalUnits.toFixed(3)}
                unit="kWh"
              />

              <ResultCard
                icon={<Clock className="h-4 w-4" />}
                label="মোট সময়"
                value={String(totalHours)}
                unit="Hours"
              />

            </div>

            {/* Breakdown */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">

              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
                  <Calculator className="h-4 w-4" />
                </div>

                <h5 className="text-xs font-extrabold text-slate-800">
                  হিসাবের বিস্তারিত
                </h5>
              </div>

              <div className="space-y-3 text-xs">

                <BreakdownRow label="ক্ষমতা" value={`${powerWatt} W`} />
                <BreakdownRow label="দৈনিক সময়" value={`${hoursPerDay} ঘণ্টা`} />
                <BreakdownRow label="মোট দিন" value={`${days} দিন`} />
                <BreakdownRow label="মোট সময়" value={`${totalHours} ঘণ্টা`} />
                <BreakdownRow label="প্রতি ইউনিট" value={`৳${unitPrice}`} />

                <div className="border-t border-dashed border-slate-300 pt-3">

                  <BreakdownRow
                    label="মোট বিল"
                    value={`৳${totalBill.toFixed(2)}`}
                    strong
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bill Note */}

        <div className="flex items-start gap-3 border-t border-amber-100 bg-amber-50/70 px-5 py-4 sm:px-6">

          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

          <p className="text-[10px] leading-6 text-amber-900 sm:text-xs">
            এই ক্যালকুলেটর নির্দিষ্ট ইউনিট মূল্য ধরে আনুমানিক বিল দেখায়।
            বাস্তব বিদ্যুৎ বিলে স্ল্যাবভিত্তিক মূল্য, ডিমান্ড চার্জ,
            মিটার ভাড়া, ভ্যাট ও অন্যান্য চার্জ যুক্ত হতে পারে।
          </p>

        </div>

      </section>

      {/* ================= LEARNING SUMMARY ================= */}

      <section className="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 p-5 sm:p-6">

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-black text-blue-950 sm:text-base">
              এই ল্যাব থেকে যা শিখবে
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-blue-700/70">
              Key concepts covered in this interactive experiment
            </p>
          </div>

        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {LEARNING_POINTS.map((item, index) => (

            <div
              key={item}
              className="group flex items-center gap-3 rounded-xl border border-blue-100/80 bg-white/80 p-3 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
            >

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className="min-w-0 flex-1 text-xs font-semibold leading-5 text-slate-700">
                {item}
              </p>

              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

            </div>

          ))}

        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-100/60 px-3 py-3 text-[10px] font-semibold text-blue-800">
          <Sparkles className="h-4 w-4 shrink-0" />
          নিজে মান পরিবর্তন করে ফলাফল পর্যবেক্ষণ করো এবং সূত্রগুলো অনুশীলন করো।
          <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
        </div>

      </section>

    </div>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function HeaderStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 backdrop-blur-md transition hover:bg-white/[0.13]">

      <div className={`flex items-center gap-2 ${color}`}>
        {icon}

        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-100/80 sm:text-[10px]">
          {label}
        </span>
      </div>

      <p className="mt-2 break-all text-lg font-black tracking-tight text-white sm:text-xl">
        {value}
      </p>

    </div>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
  color,
  right,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: 'blue' | 'indigo' | 'emerald';
  right?: React.ReactNode;
  compact?: boolean;
}) {
  const themes = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${compact ? '' : 'pb-1'}`}>

      <div className="flex min-w-0 items-center gap-3">

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${themes[color]}`}>
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="text-sm font-black text-slate-900 sm:text-base">
            {title}
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {subtitle}
          </p>

        </div>

      </div>

      {right}

    </div>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  subtitle,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-3 text-center transition-all duration-200 ${
        active
          ? 'border border-blue-100 bg-white text-blue-700 shadow-sm'
          : 'border border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800'
      }`}
    >

      <span className={`hidden shrink-0 rounded-lg p-2 sm:block ${active ? 'bg-blue-50' : 'bg-slate-200/70'}`}>
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-xs font-extrabold">
          {title}
        </span>

        <span className="mt-0.5 block text-[9px] opacity-65">
          {subtitle}
        </span>
      </span>

    </button>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-[9px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}

function QuickMetric({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: 'blue' | 'indigo';
}) {
  const themes = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">

      <div className="flex items-center justify-between gap-2">

        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">
          {label}
        </p>

        <span className={`rounded-lg p-1.5 ${themes[color]}`}>
          {icon}
        </span>

      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-1">
        <span className="text-xl font-black tabular-nums text-slate-900">
          {value}
        </span>

        <span className="text-[10px] font-bold text-slate-400">
          {unit}
        </span>
      </div>

    </div>
  );
}

/* ================= RANGE CONTROL ================= */

function RangeControl({
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit,
  color,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: 'rose' | 'amber' | 'sky' | 'emerald';
  onChange: (value: number) => void;
}) {
  const [editingValue, setEditingValue] = useState(false);
  const [draftValue, setDraftValue] = useState(String(value));

  const percentage = ((value - min) / (max - min)) * 100;

  const colorMap = {
    rose: {
      text: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      track: '#e11d48',
    },
    amber: {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      track: '#d97706',
    },
    sky: {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      track: '#0284c7',
    },
    emerald: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      track: '#059669',
    },
  };

  const theme = colorMap[color];

  const commitValue = () => {
    const parsed = Number(draftValue);

    if (draftValue.trim() !== '' && Number.isFinite(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      const stepped = min + Math.round((clamped - min) / step) * step;

      onChange(
        Number(Math.min(max, Math.max(min, stepped)).toFixed(4))
      );
    } else {
      setDraftValue(String(value));
    }

    setEditingValue(false);
  };

  const cancelEdit = () => {
    setDraftValue(String(value));
    setEditingValue(false);
  };

  return (
    <div className="group space-y-3 rounded-2xl border border-slate-100 bg-white p-3.5 transition hover:border-slate-200 hover:shadow-sm">

      <div className="flex items-center justify-between gap-2">

        <div className="flex min-w-0 items-center gap-2.5">

          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${theme.bg} ${theme.text}`}>
            {symbol}
          </span>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-700">
              {label}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {min} – {max} {unit}
            </p>
          </div>

        </div>

        <div className={`flex shrink-0 items-center gap-1 rounded-xl border px-2.5 py-2 ${theme.bg} ${theme.border}`}>

          {editingValue ? (

            <input
              autoFocus
              type="number"
              min={min}
              max={max}
              step={step}
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              onBlur={commitValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitValue();
                }

                if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEdit();
                }
              }}
              className={`w-16 bg-transparent text-right text-sm font-black outline-none ${theme.text}`}
              aria-label={`${label} value`}
            />

          ) : (

            <button
              type="button"
              onClick={() => {
                setDraftValue(String(value));
                setEditingValue(true);
              }}
              className={`text-sm font-black tabular-nums ${theme.text}`}
              title="মান সরাসরি পরিবর্তন করুন"
            >
              {value}
            </button>

          )}

          <span className={`text-[10px] font-bold ${theme.text}`}>
            {unit}
          </span>

        </div>

      </div>

      <div className="space-y-2">

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          aria-valuetext={`${value} ${unit}`}
          className="lab-range h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, ${theme.track} 0%, ${theme.track} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />

        <div className="flex justify-between text-[9px] font-semibold text-slate-400">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>

      </div>

    </div>
  );
}

/* ================= METRIC CARD ================= */

function MetricCard({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: 'blue' | 'indigo' | 'rose' | 'amber';
}) {
  const themes = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">

      <div className="flex items-center justify-between gap-2">

        <p className="text-[10px] font-bold text-slate-500">
          {label}
        </p>

        <span className={`rounded-xl border p-2 ${themes[color]}`}>
          {icon}
        </span>

      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-1">

        <span className="break-all text-xl font-black tabular-nums text-slate-900">
          {value}
        </span>

        <span className="text-[10px] font-bold text-slate-400">
          {unit}
        </span>

      </div>

    </div>
  );
}

/* ================= RESISTOR ANALYSIS ================= */

function ResistorAnalysis({
  name,
  resistance,
  current,
  voltage,
  power,
  color,
}: {
  name: string;
  resistance: number;
  current: number;
  voltage: number;
  power: number;
  color: 'amber' | 'sky';
}) {
  const theme =
    color === 'amber'
      ? {
          border: 'border-amber-100',
          bg: 'bg-amber-50/70',
          badge: 'bg-amber-100 text-amber-800',
          heading: 'text-amber-800',
        }
      : {
          border: 'border-sky-100',
          bg: 'bg-sky-50/70',
          badge: 'bg-sky-100 text-sky-800',
          heading: 'text-sky-800',
        };

  return (
    <div className={`rounded-2xl border p-3.5 ${theme.border} ${theme.bg}`}>

      <div className="mb-3 flex items-center justify-between gap-2">

        <div className="flex items-center gap-2">

          <span className={`rounded-lg px-2.5 py-1.5 text-xs font-black ${theme.badge}`}>
            {name}
          </span>

          <span className={`text-xs font-extrabold ${theme.heading}`}>
            Resistor Analysis
          </span>

        </div>

        <span className="rounded-lg bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-600">
          {resistance} Ω
        </span>

      </div>

      <div className="grid grid-cols-3 gap-2">

        <AnalysisValue
          label="Current"
          value={current.toFixed(2)}
          unit="A"
        />

        <AnalysisValue
          label="Voltage"
          value={voltage.toFixed(2)}
          unit="V"
        />

        <AnalysisValue
          label="Power"
          value={power.toFixed(2)}
          unit="W"
        />

      </div>

    </div>
  );
}

function AnalysisValue({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/70 bg-white/70 p-2">

      <p className="text-[9px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-xs font-black tabular-nums text-slate-800">
        {value}
        <span className="ml-0.5 text-[9px] font-bold text-slate-400">
          {unit}
        </span>
      </p>

    </div>
  );
}

/* ================= RESULT CARD ================= */

function ResultCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/40">

      <div className="flex items-center gap-2">

        <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
          {icon}
        </span>

        <span className="text-[10px] font-bold text-slate-500">
          {label}
        </span>

      </div>

      <p className="mt-3 break-all text-xl font-black tabular-nums text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
        {unit}
      </p>

    </div>
  );
}

/* ================= BREAKDOWN ROW ================= */

function BreakdownRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        strong
          ? 'font-extrabold text-emerald-800'
          : 'text-slate-600'
      }`}
    >

      <span>{label}</span>

      <span className="text-right tabular-nums">
        {value}
      </span>

    </div>
  );
}
