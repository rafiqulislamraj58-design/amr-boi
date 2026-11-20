
'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Info,
  Magnet,
  RotateCcw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Waves,
  Gauge,
  Power,
  Layers3,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  CircuitBoard,
} from 'lucide-react';

type SupplyType = 'AC' | 'DC';

export default function MagneticEffectsLab() {
  // Transformer State
  const [supplyType, setSupplyType] = useState<SupplyType>('AC');
  const [primaryVoltage, setPrimaryVoltage] = useState<number>(220);
  const [primaryCurrent, setPrimaryCurrent] = useState<number>(5);
  const [primaryTurns, setPrimaryTurns] = useState<number>(200);
  const [secondaryTurns, setSecondaryTurns] = useState<number>(1000);
  const [fluxOffset, setFluxOffset] = useState<number>(0);

  // Electromagnet State
  const [coilTurns, setCoilTurns] = useState<number>(50);
  const [coilCurrent, setCoilCurrent] = useState<number>(2.0);
  const [hasIronCore, setHasIronCore] = useState<boolean>(true);

  // Transformer Calculations
  const turnsRatio = secondaryTurns / primaryTurns;
  const isAC = supplyType === 'AC';

  const secondaryVoltage = isAC
    ? primaryVoltage * turnsRatio
    : 0;

  const secondaryCurrent = isAC
    ? primaryCurrent / turnsRatio
    : 0;

  const inputPower = primaryVoltage * primaryCurrent;
  const outputPower = isAC
    ? secondaryVoltage * secondaryCurrent
    : 0;

  const transformerType =
    secondaryTurns > primaryTurns
      ? 'আরোহী (Step-Up)'
      : secondaryTurns < primaryTurns
      ? 'অবরোহী (Step-Down)'
      : 'আইসোলেশন (1:1)';

  const isStepUp = secondaryTurns > primaryTurns;
  const isStepDown = secondaryTurns < primaryTurns;

  // Electromagnet Calculations
  const coreMultiplier = hasIronCore ? 4 : 1;
  const magnetStrength = coilTurns * coilCurrent * coreMultiplier;
  const liftedClips = Math.min(
    40,
    Math.round(magnetStrength / 25)
  );

  // Magnetic Flux Animation
  useEffect(() => {
    if (!isAC) return;

    let animId = 0;

    const tick = () => {
      setFluxOffset((prev) => (prev + 1.2) % 24);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isAC]);

  // Reset
  const handleReset = () => {
    setSupplyType('AC');
    setPrimaryVoltage(220);
    setPrimaryCurrent(5);
    setPrimaryTurns(200);
    setSecondaryTurns(1000);
    setCoilTurns(50);
    setCoilCurrent(2.0);
    setHasIronCore(true);
  };

  // Visual Coil Loops
  const visualPrimaryLoops = Math.max(
    3,
    Math.min(9, Math.round(primaryTurns / 120))
  );

  const visualSecondaryLoops = Math.max(
    3,
    Math.min(9, Math.round(secondaryTurns / 120))
  );

  // Reusable Slider
  const SliderControl = ({
    label,
    value,
    unit,
    min,
    max,
    step,
    onChange,
    color = 'blue',
  }: {
    label: string;
    value: number;
    unit: string;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    color?: string;
  }) => (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center gap-2">
        <label className="text-sm font-semibold text-slate-600">
          {label}
        </label>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-extrabold tabular-nums">
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full cursor-pointer accent-${color}-600`}
      />

      <div className="flex justify-between text-[10px] font-medium text-slate-400">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );

  const MetricCard = ({
    label,
    value,
    unit,
    icon: Icon,
    color,
  }: {
    label: string;
    value: string;
    unit?: string;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="group p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <Activity className="w-4 h-4 text-slate-300" />
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-6">

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 sm:p-7 text-white shadow-xl">

        <div className="absolute -right-12 -top-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative flex flex-wrap justify-between items-start gap-4">

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-wider text-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              INTERACTIVE PHYSICS LAB
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                ট্রান্সফরমার ও তড়িৎচুম্বক
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100/70">
                চৌম্বক ফ্লাক্স, আবিষ্ট বিভব এবং তড়িৎচুম্বকের শক্তি
                হাতে-কলমে পরীক্ষা করো।
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-blue-100">
                <Waves className="w-3.5 h-3.5" />
                Electromagnetism
              </span>

              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-blue-100">
                <CircuitBoard className="w-3.5 h-3.5" />
                Transformer Lab
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="relative flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>
        </div>

        <div className="relative grid grid-cols-3 gap-2 sm:gap-4 mt-7 pt-5 border-t border-white/10">
          <div>
            <p className="text-[10px] sm:text-xs text-blue-200/60">Power Source</p>
            <p className="text-lg sm:text-xl font-black mt-1">{supplyType}</p>
          </div>

          <div>
            <p className="text-[10px] sm:text-xs text-blue-200/60">Turns Ratio</p>
            <p className="text-lg sm:text-xl font-black mt-1 tabular-nums">
              {turnsRatio.toFixed(2)}:1
            </p>
          </div>

          <div>
            <p className="text-[10px] sm:text-xs text-blue-200/60">Transformer</p>
            <p className="text-sm sm:text-base font-black mt-1">
              {isStepUp ? 'Step-Up' : isStepDown ? 'Step-Down' : '1:1'}
            </p>
          </div>
        </div>
      </div>

      {/* Transformer Section */}
      <section className="space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Cpu className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900">
                ট্রান্সফরমার সিমুলেটর
              </h3>
              <p className="text-xs text-slate-500">
                Transformer Visualization & Controls
              </p>
            </div>
          </div>

          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isStepUp
              ? 'bg-emerald-50 text-emerald-700'
              : isStepDown
              ? 'bg-amber-50 text-amber-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {isStepUp ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : isStepDown ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <Activity className="w-3.5 h-3.5" />
            )}
            {transformerType}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

          {/* Visualization */}
          <div className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">

            <div className="flex justify-between items-center gap-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Transformer Visualization
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Live magnetic flux simulation
                </p>
              </div>

              <div className="flex p-1 rounded-xl bg-slate-100">
                <button
                  type="button"
                  onClick={() => setSupplyType('AC')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    isAC
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  AC
                </button>

                <button
                  type="button"
                  onClick={() => setSupplyType('DC')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    !isAC
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  DC
                </button>
              </div>
            </div>

            {/* Transformer Diagram */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/60">
              <svg
                viewBox="0 0 560 270"
                className="w-full h-auto block"
                role="img"
                aria-label="Transformer magnetic core, primary and secondary coils"
              >
                <defs>
                  <linearGradient id="ironGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>

                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  <linearGradient id="secondaryGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>

                  <filter id="coilShadow">
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                </defs>

                {/* Core */}
                <rect
                  x="140"
                  y="40"
                  width="280"
                  height="175"
                  rx="13"
                  fill="url(#ironGradient)"
                  stroke="#475569"
                  strokeWidth="3"
                />

                <rect
                  x="195"
                  y="83"
                  width="170"
                  height="90"
                  rx="7"
                  fill="#f8fafc"
                  stroke="#64748b"
                  strokeWidth="2.5"
                />

                {/* Core details */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="145"
                    y1={53 + i * 7}
                    x2="415"
                    y2={53 + i * 7}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    opacity=".35"
                  />
                ))}

                {/* Flux */}
                {isAC && (
                  <>
                    <rect
                      x="167"
                      y="61"
                      width="226"
                      height="132"
                      rx="8"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="3"
                      strokeDasharray="9 13"
                      strokeDashoffset={fluxOffset}
                    />

                    <circle
                      cx="280"
                      cy="61"
                      r="5"
                      fill="#0ea5e9"
                    >
                      <animate
                        attributeName="opacity"
                        values=".3;1;.3"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* Primary Coils */}
                {Array.from({ length: visualPrimaryLoops }).map((_, i) => {
                  const y = 82 + (i * 92) / Math.max(1, visualPrimaryLoops - 1);

                  return (
                    <g key={`p-${i}`}>
                      <rect
                        x="124"
                        y={y - 5}
                        width="82"
                        height="10"
                        rx="5"
                        fill="#92400e"
                        opacity=".2"
                        filter="url(#coilShadow)"
                      />
                      <rect
                        x="124"
                        y={y - 5}
                        width="82"
                        height="10"
                        rx="5"
                        fill="url(#primaryGradient)"
                        stroke="#b45309"
                        strokeWidth="1.3"
                      />
                    </g>
                  );
                })}

                {/* Secondary Coils */}
                {Array.from({ length: visualSecondaryLoops }).map((_, i) => {
                  const y = 82 + (i * 92) / Math.max(1, visualSecondaryLoops - 1);

                  return (
                    <g key={`s-${i}`}>
                      <rect
                        x="354"
                        y={y - 5}
                        width="82"
                        height="10"
                        rx="5"
                        fill="#1e40af"
                        opacity=".2"
                      />
                      <rect
                        x="354"
                        y={y - 5}
                        width="82"
                        height="10"
                        rx="5"
                        fill="url(#secondaryGradient)"
                        stroke="#1d4ed8"
                        strokeWidth="1.3"
                      />
                    </g>
                  );
                })}

                {/* Primary Supply */}
                <line x1="70" y1="82" x2="124" y2="82" stroke="#d97706" strokeWidth="3" />
                <line x1="70" y1="174" x2="124" y2="174" stroke="#d97706" strokeWidth="3" />

                <line x1="70" y1="82" x2="70" y2="101" stroke="#d97706" strokeWidth="3" />
                <line x1="70" y1="149" x2="70" y2="174" stroke="#d97706" strokeWidth="3" />

                <circle cx="70" cy="125" r="24" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />

                <text x="70" y="122" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">
                  {supplyType}
                </text>

                <text x="70" y="136" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309">
                  {primaryVoltage}V
                </text>

                {/* Secondary Output */}
                <line x1="436" y1="82" x2="492" y2="82" stroke="#2563eb" strokeWidth="3" />
                <line x1="436" y1="174" x2="492" y2="174" stroke="#2563eb" strokeWidth="3" />

                <rect
                  x="459"
                  y="103"
                  width="88"
                  height="45"
                  rx="9"
                  fill={isAC ? '#dbeafe' : '#f1f5f9'}
                  stroke={isAC ? '#2563eb' : '#94a3b8'}
                  strokeWidth="2"
                />

                <text x="503" y="122" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">
                  {secondaryVoltage.toFixed(0)} V
                </text>

                <text x="503" y="137" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1d4ed8">
                  {secondaryCurrent.toFixed(2)} A
                </text>

                {/* Labels */}
                <text x="165" y="243" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e">
                  Primary Coil
                </text>

                <text x="165" y="257" textAnchor="middle" fontSize="10" fill="#92400e">
                  nₚ = {primaryTurns}
                </text>

                <text x="395" y="243" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d4ed8">
                  Secondary Coil
                </text>

                <text x="395" y="257" textAnchor="middle" fontSize="10" fill="#1d4ed8">
                  nₛ = {secondaryTurns}
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Primary Coil
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                Secondary Coil
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                Magnetic Flux
              </span>
            </div>

            {/* DC Warning */}
            {!isAC && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />

                <div>
                  <p className="text-sm font-extrabold text-rose-800">
                    DC উৎসে ট্রান্সফরমার কাজ করে না
                  </p>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    স্থির DC প্রবাহে চৌম্বক ফ্লাক্স পরিবর্তিত হয় না।
                    তাই স্থির অবস্থায় গৌণ কুণ্ডলীতে আবিষ্ট ভোল্টেজ শূন্য।
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-5">

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">
                  কন্ট্রোল প্যানেল
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Adjust transformer parameters
                </p>
              </div>

              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Gauge className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-5">
              <SliderControl
                label="মুখ্য ভোল্টেজ (Eₚ)"
                value={primaryVoltage}
                unit="V"
                min={20}
                max={440}
                step={20}
                onChange={setPrimaryVoltage}
              />

              <SliderControl
                label="মুখ্য প্রবাহ (Iₚ)"
                value={primaryCurrent}
                unit="A"
                min={1}
                max={20}
                step={1}
                onChange={setPrimaryCurrent}
                color="amber"
              />

              <div className="border-t border-slate-100" />

              <SliderControl
                label="মুখ্য পাকসংখ্যা (nₚ)"
                value={primaryTurns}
                unit="Turns"
                min={50}
                max={1000}
                step={50}
                onChange={setPrimaryTurns}
                color="amber"
              />

              <SliderControl
                label="গৌণ পাকসংখ্যা (nₛ)"
                value={secondaryTurns}
                unit="Turns"
                min={50}
                max={1000}
                step={50}
                onChange={setSecondaryTurns}
              />
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-xs font-extrabold text-slate-500">
                QUICK PRESETS
              </p>

              <button
                type="button"
                onClick={() => {
                  setSupplyType('AC');
                  setPrimaryVoltage(220);
                  setPrimaryCurrent(5);
                  setPrimaryTurns(200);
                  setSecondaryTurns(1000);
                }}
                className="w-full flex items-center justify-between gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 transition-all cursor-pointer text-left"
              >
                <div>
                  <p className="text-xs font-extrabold text-emerald-800">
                    Step-Up Transformer
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    220V → 1100V
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSupplyType('AC');
                  setPrimaryVoltage(220);
                  setPrimaryCurrent(1);
                  setPrimaryTurns(1000);
                  setSecondaryTurns(50);
                }}
                className="w-full flex items-center justify-between gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 transition-all cursor-pointer text-left"
              >
                <div>
                  <p className="text-xs font-extrabold text-amber-800">
                    Step-Down Transformer
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    220V → 11V
                  </p>
                </div>
                <ArrowDownRight className="w-5 h-5 text-amber-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Telemetry */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-slate-800 text-sm">
              Live Measurements
            </h4>
            <span className="text-[10px] font-bold text-emerald-600">
              ● LIVE
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="Secondary Voltage"
              value={secondaryVoltage.toFixed(1)}
              unit="V"
              icon={Zap}
              color="bg-blue-100 text-blue-700"
            />

            <MetricCard
              label="Secondary Current"
              value={secondaryCurrent.toFixed(2)}
              unit="A"
              icon={Activity}
              color="bg-amber-100 text-amber-700"
            />

            <MetricCard
              label="Input Power"
              value={inputPower.toFixed(0)}
              unit="W"
              icon={Power}
              color="bg-violet-100 text-violet-700"
            />

            <MetricCard
              label="Output Power"
              value={outputPower.toFixed(0)}
              unit="W"
              icon={TrendingUp}
              color="bg-emerald-100 text-emerald-700"
            />
          </div>
        </div>

        {/* Formula */}
        <div className="rounded-2xl bg-slate-950 p-4 sm:p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Layers3 className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-bold text-slate-300">
              TRANSFORMER FORMULA
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-slate-400 mb-2">
                Voltage Ratio
              </p>
              <p className="text-lg sm:text-xl font-bold text-blue-300">
                Eₛ / Eₚ = nₛ / nₚ
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                {secondaryVoltage.toFixed(1)} / {primaryVoltage} = {secondaryTurns} / {primaryTurns}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 mb-2">
                Current Ratio (Ideal)
              </p>
              <p className="text-lg sm:text-xl font-bold text-emerald-300">
                Iₛ / Iₚ = nₚ / nₛ
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                {secondaryCurrent.toFixed(2)} / {primaryCurrent} = {primaryTurns} / {secondaryTurns}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Electromagnet Lab */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Magnet className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900">
                তড়িৎচুম্বক শক্তি পরীক্ষা
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Electromagnet Strength Laboratory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasIronCore((c) => !c)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              hasIronCore
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Power className="w-4 h-4" />
            {hasIronCore ? 'Iron Core: ON' : 'Iron Core: OFF'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 sm:p-6">

          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">

            <SliderControl
              label="সলিনয়েডের পাকসংখ্যা (N)"
              value={coilTurns}
              unit="Turns"
              min={10}
              max={100}
              step={10}
              onChange={setCoilTurns}
              color="rose"
            />

            <SliderControl
              label="তড়িৎ প্রবাহ (I)"
              value={coilCurrent}
              unit="A"
              min={0.5}
              max={5}
              step={0.5}
              onChange={setCoilCurrent}
              color="rose"
            />

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-slate-600">
                  Relative Magnetic Strength
                </span>

                <span className="font-black text-rose-600">
                  {magnetStrength.toFixed(0)} Units
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (magnetStrength / 2000) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>Low Strength</span>
                <span>High Strength</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-5 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5 flex flex-col justify-between">

            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-extrabold text-rose-800">
                  ATTRACTIVE FORCE
                </p>
                <Magnet className="w-5 h-5 text-rose-500" />
              </div>

              <div className="mt-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tabular-nums">
                    {liftedClips}
                  </span>
                  <span className="text-sm font-bold text-rose-700">
                    টি পিন
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  আনুমানিক উত্তোলন ক্ষমতা
                </p>
              </div>
            </div>

            {/* Paperclip Indicators */}
            <div className="grid grid-cols-10 gap-1.5 mt-6">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded-sm transition-all duration-300 ${
                    i < liftedClips
                      ? 'bg-rose-500 shadow-sm'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span>0 Clips</span>
              <span>40 Clips</span>
            </div>

            <div className="mt-5 pt-4 border-t border-rose-200/70 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">
                Soft Iron Core
              </span>

              <span className={`text-xs font-extrabold ${
                hasIronCore ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {hasIronCore ? '4× Multiplier' : '1× Multiplier'}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Insight */}
        <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-200 p-4">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-blue-900">
              পরীক্ষার সিদ্ধান্ত
            </p>

            <p className="text-xs text-blue-800/80 leading-relaxed mt-1">
              সলিনয়েডের পাকসংখ্যা ও তড়িৎ প্রবাহ বাড়ালে তড়িৎচুম্বকের
              শক্তি বৃদ্ধি পায়। এছাড়া কুণ্ডলীর ভেতরে নরম লোহার
              মজ্জা ব্যবহার করলে চৌম্বক ক্ষেত্র আরও শক্তিশালী হয়।
            </p>
          </div>
        </div>
      </section>

      {/* Footer Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Simulation Running
        </div>

        <p className="text-[10px] text-slate-400">
          Interactive Physics Learning Environment
        </p>
      </div>
    </div>
  );
}
