
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Zap,
  Calculator,
  Gauge,
  Weight,
  MoveRight,
  Clock,
  Ruler,
  CheckCircle2,
  AlertCircle,
  Scale,
  ArrowLeftRight,
  BookOpen,
  Info,
} from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';

// ======================================================
// TYPES
// ======================================================

type LabTab = 'first' | 'second' | 'third';

type Preset = {
  name: string;
  force: number;
  mass: number;
  mu: number;
};

const GRAVITY = 9.8;
const MAX_SIMULATION_TIME = 30;
const EPSILON = 0.0001;

// ======================================================
// PRESETS
// ======================================================

const PRESETS: Preset[] = [
  { name: 'ঘর্ষণহীন বরফ তল', force: 30, mass: 5, mu: 0 },
  { name: 'সাধারণ কাঠের মেঝে', force: 50, mass: 8, mu: 0.3 },
  { name: 'ভারী বাক্স', force: 40, mass: 15, mu: 0.5 },
  { name: 'উচ্চ ত্বরণ', force: 90, mass: 4, mu: 0.1 },
];

// ======================================================
// COMMON UI
// ======================================================

function MetricCard({
  label,
  value,
  unit,
  symbol,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  symbol: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <p className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl">
        {value}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{unit}</span>
        <span className="text-[10px] font-semibold text-slate-400">{symbol}</span>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  color,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className={`font-bold ${color}`}>
          {Number(value.toFixed(2))} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-blue-600"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function SimulationButtons({
  isPlaying,
  onToggle,
  onReset,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}

function ProgressBar({ time }: { time: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-blue-600 transition-[width]"
        style={{
          width: `${Math.min((time / MAX_SIMULATION_TIME) * 100, 100)}%`,
        }}
      />
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ForceSimulationLab() {
  const [activeTab, setActiveTab] = useState<LabTab>('first');

  // ------------------------------------------------------
  // SECOND LAW PARAMETERS
  // ------------------------------------------------------

  const [appliedForce, setAppliedForce] = useState(50);
  const [mass, setMass] = useState(5);
  const [mu, setMu] = useState(0.2);

  const [secondPlaying, setSecondPlaying] = useState(false);
  const [secondTime, setSecondTime] = useState(0);
  const [secondVelocity, setSecondVelocity] = useState(0);
  const [secondPosition, setSecondPosition] = useState(0);

  const secondRef = useRef({ t: 0, v: 0, x: 0 });
  const secondFrameRef = useRef<number | null>(null);
  const secondLastTimeRef = useRef<number | null>(null);

  // ------------------------------------------------------
  // FIRST LAW PARAMETERS
  // ------------------------------------------------------

  const [firstMass, setFirstMass] = useState(5);
  const [firstForce, setFirstForce] = useState(0);
  const [firstFriction, setFirstFriction] = useState(0);
  const [firstVelocity, setFirstVelocity] = useState(0);
  const [firstPosition, setFirstPosition] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [firstPlaying, setFirstPlaying] = useState(false);

  const firstRef = useRef({ t: 0, v: 0, x: 0 });
  const firstFrameRef = useRef<number | null>(null);
  const firstLastTimeRef = useRef<number | null>(null);

  // ------------------------------------------------------
  // THIRD LAW PARAMETERS
  // ------------------------------------------------------

  const [thirdMassA, setThirdMassA] = useState(5);
  const [thirdMassB, setThirdMassB] = useState(10);
  const [thirdForce, setThirdForce] = useState(50);

  const [thirdPlaying, setThirdPlaying] = useState(false);
  const [thirdTime, setThirdTime] = useState(0);

  const [thirdVelocityA, setThirdVelocityA] = useState(0);
  const [thirdVelocityB, setThirdVelocityB] = useState(0);

  const [thirdPositionA, setThirdPositionA] = useState(0);
  const [thirdPositionB, setThirdPositionB] = useState(0);

  const thirdRef = useRef({
    t: 0,
    vA: 0,
    vB: 0,
    xA: 0,
    xB: 0,
  });

  const thirdFrameRef = useRef<number | null>(null);
  const thirdLastTimeRef = useRef<number | null>(null);

  // ------------------------------------------------------
  // RESET FUNCTIONS
  // ------------------------------------------------------

  const resetSecond = useCallback(() => {
    if (secondFrameRef.current !== null) {
      cancelAnimationFrame(secondFrameRef.current);
      secondFrameRef.current = null;
    }

    secondLastTimeRef.current = null;
    secondRef.current = { t: 0, v: 0, x: 0 };

    setSecondPlaying(false);
    setSecondTime(0);
    setSecondVelocity(0);
    setSecondPosition(0);
  }, []);

  const resetFirst = useCallback(() => {
    if (firstFrameRef.current !== null) {
      cancelAnimationFrame(firstFrameRef.current);
      firstFrameRef.current = null;
    }

    firstLastTimeRef.current = null;
    firstRef.current = { t: 0, v: 0, x: 0 };

    setFirstPlaying(false);
    setFirstTime(0);
    setFirstVelocity(0);
    setFirstPosition(0);
  }, []);

  const resetThird = useCallback(() => {
    if (thirdFrameRef.current !== null) {
      cancelAnimationFrame(thirdFrameRef.current);
      thirdFrameRef.current = null;
    }

    thirdLastTimeRef.current = null;
    thirdRef.current = {
      t: 0,
      vA: 0,
      vB: 0,
      xA: 0,
      xB: 0,
    };

    setThirdPlaying(false);
    setThirdTime(0);
    setThirdVelocityA(0);
    setThirdVelocityB(0);
    setThirdPositionA(0);
    setThirdPositionB(0);
  }, []);

  // ------------------------------------------------------
  // RESET ON TAB CHANGE
  // ------------------------------------------------------

  const changeTab = useCallback(
    (tab: LabTab) => {
      resetFirst();
      resetSecond();
      resetThird();
      setActiveTab(tab);
    },
    [resetFirst, resetSecond, resetThird]
  );

  // ------------------------------------------------------
  // SECOND LAW: PHYSICS
  // ------------------------------------------------------

  const normalForce = mass * GRAVITY;
  const maxStaticFriction = mu * normalForce;

  // এই মডেলে স্থিতি ও গতিশীল ঘর্ষণের জন্য একই μ ব্যবহৃত।
  const secondIsMoving = secondVelocity > EPSILON;

  const actualFriction = secondIsMoving
    ? maxStaticFriction
    : Math.min(appliedForce, maxStaticFriction);

  const netForce = Math.max(0, appliedForce - actualFriction);
  const acceleration = netForce / mass;

  const momentum = mass * secondVelocity;
  const kineticEnergy = 0.5 * mass * secondVelocity ** 2;

  // ------------------------------------------------------
  // SECOND LAW: ANIMATION
  // ------------------------------------------------------

  useEffect(() => {
    if (!secondPlaying || activeTab !== 'second') {
      secondLastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (secondLastTimeRef.current === null) {
        secondLastTimeRef.current = timestamp;
      }

      const dt = Math.min(
        (timestamp - secondLastTimeRef.current) / 1000,
        0.05
      );

      secondLastTimeRef.current = timestamp;

      const current = secondRef.current;

      const currentNormal = mass * GRAVITY;
      const currentFriction = mu * currentNormal;

      const friction = current.v > EPSILON
        ? currentFriction
        : Math.min(appliedForce, currentFriction);

      const currentNetForce = Math.max(0, appliedForce - friction);
      const currentAcceleration = currentNetForce / mass;

      const nextVelocity = Math.max(
        0,
        current.v + currentAcceleration * dt
      );

      const nextPosition =
        current.x + ((current.v + nextVelocity) / 2) * dt;

      const nextTime = current.t + dt;

      secondRef.current = {
        t: nextTime,
        v: nextVelocity,
        x: nextPosition,
      };

      setSecondTime(nextTime);
      setSecondVelocity(nextVelocity);
      setSecondPosition(nextPosition);

      if (nextTime >= MAX_SIMULATION_TIME) {
        setSecondPlaying(false);
        return;
      }

      secondFrameRef.current = requestAnimationFrame(step);
    };

    secondFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (secondFrameRef.current !== null) {
        cancelAnimationFrame(secondFrameRef.current);
        secondFrameRef.current = null;
      }
    };
  }, [
    secondPlaying,
    activeTab,
    appliedForce,
    mass,
    mu,
  ]);

  // ------------------------------------------------------
  // FIRST LAW: PHYSICS
  // ------------------------------------------------------

  const firstMaxFriction = firstFriction * firstMass * GRAVITY;

  const firstActualFriction = Math.min(
    firstForce,
    firstMaxFriction
  );

  const firstNetForce = Math.max(
    0,
    firstForce - firstActualFriction
  );

  const firstAcceleration = firstNetForce / firstMass;

  const firstMomentum = firstMass * firstVelocity;

  const firstStatus =
    firstVelocity <= EPSILON && firstNetForce <= EPSILON
      ? 'স্থির অবস্থা'
      : firstNetForce <= EPSILON
        ? 'সমবেগে গতিশীল'
        : 'ত্বরণযুক্ত গতি';

  // ------------------------------------------------------
  // FIRST LAW: ANIMATION
  // ------------------------------------------------------

  useEffect(() => {
    if (!firstPlaying || activeTab !== 'first') {
      firstLastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (firstLastTimeRef.current === null) {
        firstLastTimeRef.current = timestamp;
      }

      const dt = Math.min(
        (timestamp - firstLastTimeRef.current) / 1000,
        0.05
      );

      firstLastTimeRef.current = timestamp;

      const current = firstRef.current;

      const maxFriction = firstFriction * firstMass * GRAVITY;

      const friction = current.v > EPSILON
        ? Math.min(firstForce, maxFriction)
        : Math.min(firstForce, maxFriction);

      const forceResult = Math.max(0, firstForce - friction);
      const a = forceResult / firstMass;

      const nextVelocity = Math.max(0, current.v + a * dt);

      const nextPosition =
        current.x + ((current.v + nextVelocity) / 2) * dt;

      const nextTime = current.t + dt;

      firstRef.current = {
        t: nextTime,
        v: nextVelocity,
        x: nextPosition,
      };

      setFirstTime(nextTime);
      setFirstVelocity(nextVelocity);
      setFirstPosition(nextPosition);

      if (nextTime >= MAX_SIMULATION_TIME) {
        setFirstPlaying(false);
        return;
      }

      firstFrameRef.current = requestAnimationFrame(step);
    };

    firstFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (firstFrameRef.current !== null) {
        cancelAnimationFrame(firstFrameRef.current);
        firstFrameRef.current = null;
      }
    };
  }, [
    firstPlaying,
    activeTab,
    firstForce,
    firstFriction,
    firstMass,
  ]);

  // ------------------------------------------------------
  // THIRD LAW: PHYSICS
  // ------------------------------------------------------

  const accelerationA = thirdForce / thirdMassA;
  const accelerationB = thirdForce / thirdMassB;

  const thirdMomentumA = thirdMassA * thirdVelocityA;
  const thirdMomentumB = thirdMassB * thirdVelocityB;

  // ------------------------------------------------------
  // THIRD LAW: ANIMATION
  // ------------------------------------------------------

  useEffect(() => {
    if (!thirdPlaying || activeTab !== 'third') {
      thirdLastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (thirdLastTimeRef.current === null) {
        thirdLastTimeRef.current = timestamp;
      }

      const dt = Math.min(
        (timestamp - thirdLastTimeRef.current) / 1000,
        0.05
      );

      thirdLastTimeRef.current = timestamp;

      const current = thirdRef.current;

      const aA = thirdForce / thirdMassA;
      const aB = thirdForce / thirdMassB;

      const nextVA = current.vA + aA * dt;
      const nextVB = current.vB - aB * dt;

      const nextXA =
        current.xA + ((current.vA + nextVA) / 2) * dt;

      const nextXB =
        current.xB + ((current.vB + nextVB) / 2) * dt;

      const nextTime = current.t + dt;

      thirdRef.current = {
        t: nextTime,
        vA: nextVA,
        vB: nextVB,
        xA: nextXA,
        xB: nextXB,
      };

      setThirdTime(nextTime);
      setThirdVelocityA(nextVA);
      setThirdVelocityB(nextVB);
      setThirdPositionA(nextXA);
      setThirdPositionB(nextXB);

      if (nextTime >= MAX_SIMULATION_TIME) {
        setThirdPlaying(false);
        return;
      }

      thirdFrameRef.current = requestAnimationFrame(step);
    };

    thirdFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (thirdFrameRef.current !== null) {
        cancelAnimationFrame(thirdFrameRef.current);
        thirdFrameRef.current = null;
      }
    };
  }, [
    thirdPlaying,
    activeTab,
    thirdForce,
    thirdMassA,
    thirdMassB,
  ]);

  // ------------------------------------------------------
  // PRESET
  // ------------------------------------------------------

  const applyPreset = (preset: Preset) => {
    resetSecond();
    setAppliedForce(preset.force);
    setMass(preset.mass);
    setMu(preset.mu);
  };

  // ------------------------------------------------------
  // PLAY HANDLERS
  // ------------------------------------------------------

  const toggleFirst = () => {
    if (firstPlaying) {
      setFirstPlaying(false);
      return;
    }

    if (firstTime >= MAX_SIMULATION_TIME) resetFirst();

    setFirstPlaying(true);
  };

  const toggleSecond = () => {
    if (secondPlaying) {
      setSecondPlaying(false);
      return;
    }

    if (secondTime >= MAX_SIMULATION_TIME) resetSecond();

    setSecondPlaying(true);
  };

  const toggleThird = () => {
    if (thirdPlaying) {
      setThirdPlaying(false);
      return;
    }

    if (thirdTime >= MAX_SIMULATION_TIME) resetThird();

    setThirdPlaying(true);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <section className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <Activity className="h-4 w-4" />
          INTERACTIVE NEWTON'S LAWS LAB
        </div>

        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          নিউটনের গতিসূত্রের পরীক্ষাগার
        </h2>

        <p className="text-sm leading-6 text-slate-500">
          নিউটনের তিনটি গতিসূত্র আলাদাভাবে পরীক্ষা করো।
          বল, ভর ও ঘর্ষণ পরিবর্তন করে বস্তুর গতির পরিবর্তন পর্যবেক্ষণ করো।
        </p>
      </section>

      {/* TAB NAVIGATION */}

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => changeTab('first')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'first'
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900">প্রথম সূত্র</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            জড়তা ও সমবেগে গতি
          </p>
        </button>

        <button
          type="button"
          onClick={() => changeTab('second')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'second'
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-slate-900">দ্বিতীয় সূত্র</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            বল, ভর ও ত্বরণ
          </p>
        </button>

        <button
          type="button"
          onClick={() => changeTab('third')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'third'
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-slate-900">তৃতীয় সূত্র</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            ক্রিয়া ও প্রতিক্রিয়া
          </p>
        </button>
      </section>

      {/* ==================================================
          FIRST LAW LAB
      ================================================== */}

      {activeTab === 'first' && (
        <div className="space-y-5">

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">
                  Newton's First Law Simulation
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  জড়তা ও বস্তুর গতির অবস্থা পর্যবেক্ষণ করো
                </p>
              </div>

              <SimulationButtons
                isPlaying={firstPlaying}
                onToggle={toggleFirst}
                onReset={resetFirst}
              />
            </div>

            {/* First law visual */}

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-sky-50 to-slate-100 p-4">
              <div className="flex h-48 items-end overflow-hidden">
                <div className="relative h-28 w-full border-b-4 border-slate-500 bg-slate-200/70">

                  <div
                    className="absolute bottom-0 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-amber-700 bg-amber-500 font-bold text-white shadow-lg transition-none"
                    style={{
                      left: `clamp(0px, ${Math.min(firstPosition * 12, 75)}%, calc(100% - 64px))`,
                    }}
                  >
                    {firstMass} kg
                  </div>

                  {firstNetForce > EPSILON && (
                    <div className="absolute bottom-20 left-20 flex items-center gap-1 text-blue-700">
                      <MoveRight size={28} />
                      <span className="text-xs font-bold">
                        Net Force
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-1 left-0 right-0 flex justify-around text-[10px] text-slate-500">
                    <span>0 m</span>
                    <span>5 m</span>
                    <span>10 m</span>
                    <span>15 m</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-600">
                  বস্তুর অবস্থান: {firstPosition.toFixed(2)} m
                </span>
                <span className="font-semibold text-blue-600">
                  বেগ: {firstVelocity.toFixed(2)} m/s
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                {firstNetForce <= EPSILON ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <span className="font-semibold text-slate-700">
                  {firstStatus}
                </span>
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock size={14} />
                {firstTime.toFixed(2)} / 30 s
              </span>
            </div>

            <ProgressBar time={firstTime} />
          </section>

          {/* First law controls */}

          <section className="grid gap-5 lg:grid-cols-2">

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                First Law Control Panel
              </h3>

              <RangeControl
                label="প্রযুক্ত বল"
                value={firstForce}
                min={0}
                max={100}
                step={1}
                unit="N"
                color="text-blue-600"
                onChange={setFirstForce}
              />

              <RangeControl
                label="বস্তুর ভর"
                value={firstMass}
                min={1}
                max={20}
                step={1}
                unit="kg"
                color="text-amber-600"
                onChange={setFirstMass}
              />

              <RangeControl
                label="ঘর্ষণ গুণাঙ্ক"
                value={firstFriction}
                min={0}
                max={0.8}
                step={0.05}
                unit="μ"
                color="text-red-600"
                onChange={setFirstFriction}
              />

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold text-blue-800">
                  পরীক্ষার নির্দেশনা
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-600">
                  প্রথমে প্রযুক্ত বল ও ঘর্ষণ সমান রাখো।
                  এরপর ঘর্ষণ কমিয়ে প্রযুক্ত বল বাড়াও।
                  বস্তুটির গতির পরিবর্তন লক্ষ্য করো।
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Live Physics Data
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="লব্ধি বল"
                  value={firstNetForce.toFixed(2)}
                  unit="N"
                  symbol="Fnet"
                  icon={MoveRight}
                  color="text-blue-600"
                />
                <MetricCard
                  label="ত্বরণ"
                  value={firstAcceleration.toFixed(2)}
                  unit="m/s²"
                  symbol="a"
                  icon={Zap}
                  color="text-amber-600"
                />
                <MetricCard
                  label="বেগ"
                  value={firstVelocity.toFixed(2)}
                  unit="m/s"
                  symbol="v"
                  icon={Gauge}
                  color="text-emerald-600"
                />
                <MetricCard
                  label="ভরবেগ"
                  value={firstMomentum.toFixed(2)}
                  unit="kg·m/s"
                  symbol="p = mv"
                  icon={Weight}
                  color="text-purple-600"
                />
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="mb-2 text-xs font-bold text-blue-700">
                  নিউটনের প্রথম সূত্র
                </p>
                <FormulaBox formula="\\sum F = 0 \\Rightarrow a = 0" />
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  লব্ধি বাহ্যিক বল শূন্য হলে বস্তু স্থির থাকলে স্থির
                  থাকবে, আর চলমান থাকলে সমবেগে সরলরেখায় চলতে থাকবে।
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================================================
          SECOND LAW LAB
      ================================================== */}

      {activeTab === 'second' && (
        <div className="space-y-5">

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800">
                দ্রুত পরীক্ষার Scenario
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">
                  Newton's Second Law Simulation
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  নীল তীর = প্রযুক্ত বল | লাল তীর = ঘর্ষণ বল
                </p>
              </div>

              <SimulationButtons
                isPlaying={secondPlaying}
                onToggle={toggleSecond}
                onReset={resetSecond}
              />
            </div>

            {/* Second law visual */}

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-blue-50 to-slate-100 p-4">
              <div className="relative h-52">
                <div className="absolute bottom-5 left-0 right-0 h-1 bg-slate-500" />

                <div
                  className="absolute bottom-6 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-amber-700 bg-amber-500 font-bold text-white shadow-lg"
                  style={{
                    left: `clamp(0px, ${Math.min(secondPosition * 12, 75)}%, calc(100% - 64px))`,
                  }}
                >
                  {mass} kg
                </div>

                {appliedForce > 0 && (
                  <div className="absolute bottom-28 left-24 flex items-center gap-1 text-blue-600">
                    <MoveRight size={26} />
                    <span className="text-xs font-bold">
                      {appliedForce} N
                    </span>
                  </div>
                )}

                {actualFriction > 0 && (
                  <div className="absolute bottom-1 left-0 flex items-center gap-1 text-red-600">
                    <span className="text-xs font-bold">
                      ঘর্ষণ {actualFriction.toFixed(1)} N
                    </span>
                    <MoveRight className="rotate-180" size={22} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-600">
                {secondIsMoving ? 'বস্তুটি গতিশীল' : 'বস্তুটি স্থির'}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock size={14} />
                {secondTime.toFixed(2)} / 30 s
              </span>
            </div>

            <ProgressBar time={secondTime} />
          </section>

          {/* Second law controls */}

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Control Panel
              </h3>

              <RangeControl
                label="প্রযুক্ত বল"
                value={appliedForce}
                min={0}
                max={100}
                step={1}
                unit="N"
                color="text-blue-600"
                onChange={setAppliedForce}
              />

              <RangeControl
                label="বস্তুর ভর"
                value={mass}
                min={1}
                max={20}
                step={1}
                unit="kg"
                color="text-amber-600"
                onChange={setMass}
              />

              <RangeControl
                label="ঘর্ষণ গুণাঙ্ক"
                value={mu}
                min={0}
                max={0.8}
                step={0.05}
                unit="μ"
                color="text-red-600"
                onChange={setMu}
              />

              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="mb-3 text-xs font-bold text-slate-600">
                  বর্তমান Parameters
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">অভিলম্ব প্রতিক্রিয়া</p>
                    <p className="font-bold text-slate-800">
                      {normalForce.toFixed(2)} N
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">সর্বোচ্চ স্থিতি ঘর্ষণ</p>
                    <p className="font-bold text-slate-800">
                      {maxStaticFriction.toFixed(2)} N
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Live Physics Data
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="লব্ধি বল"
                  value={netForce.toFixed(2)}
                  unit="N"
                  symbol="Fnet"
                  icon={MoveRight}
                  color="text-blue-600"
                />
                <MetricCard
                  label="ত্বরণ"
                  value={acceleration.toFixed(2)}
                  unit="m/s²"
                  symbol="a"
                  icon={Zap}
                  color="text-amber-600"
                />
                <MetricCard
                  label="বেগ"
                  value={secondVelocity.toFixed(2)}
                  unit="m/s"
                  symbol="v"
                  icon={Gauge}
                  color="text-emerald-600"
                />
                <MetricCard
                  label="ভরবেগ"
                  value={momentum.toFixed(2)}
                  unit="kg·m/s"
                  symbol="p = mv"
                  icon={Weight}
                  color="text-purple-600"
                />
                <MetricCard
                  label="অতিক্রান্ত দূরত্ব"
                  value={secondPosition.toFixed(2)}
                  unit="m"
                  symbol="s"
                  icon={Ruler}
                  color="text-cyan-600"
                />
                <MetricCard
                  label="গতিশক্তি"
                  value={kineticEnergy.toFixed(2)}
                  unit="J"
                  symbol="KE"
                  icon={Activity}
                  color="text-rose-600"
                />
              </div>
            </div>
          </section>

          {/* Second law calculations */}

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Calculator className="h-5 w-5 text-blue-600" />
              Step-by-Step Calculation
            </h3>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-bold text-slate-500">
                ১. অভিলম্ব প্রতিক্রিয়া
              </p>
              <FormulaBox
                formula={`N = ${mass} \\times 9.8 = ${normalForce.toFixed(2)}\\text{ N}`}
              />
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
              <p className="mb-2 text-xs font-bold text-red-700">
                ২. সর্বোচ্চ ঘর্ষণ বল
              </p>
              <FormulaBox
                formula={`f_{max} = ${mu.toFixed(2)} \\times ${normalForce.toFixed(2)} = ${maxStaticFriction.toFixed(2)}\\text{ N}`}
              />
              <p className="mt-2 text-xs text-slate-600">
                বর্তমান ঘর্ষণ বল = {actualFriction.toFixed(2)} N
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="mb-2 text-xs font-bold text-blue-700">
                ৩. লব্ধি বল
              </p>
              <FormulaBox
                formula={`F_{net} = ${appliedForce} - ${actualFriction.toFixed(2)} = ${netForce.toFixed(2)}\\text{ N}`}
              />
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="mb-2 text-xs font-bold text-emerald-700">
                ৪. ত্বরণ
              </p>
              <FormulaBox
                formula={`a = \\frac{${netForce.toFixed(2)}}{${mass}} = ${acceleration.toFixed(2)}\\text{ m/s}^2`}
              />
            </div>

            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <p className="mb-3 text-xs font-bold text-slate-300">
                নিউটনের দ্বিতীয় সূত্র
              </p>
              <FormulaBox formula="F_{net} = ma" />
              <p className="mt-2 text-xs leading-5 text-slate-300">
                বস্তুর ওপর প্রযুক্ত লব্ধি বল তার ভর ও সৃষ্ট ত্বরণের
                গুণফলের সমান।
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ==================================================
          THIRD LAW LAB
      ================================================== */}

      {activeTab === 'third' && (
        <div className="space-y-5">

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">
                  Newton's Third Law Simulation
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  দুটি বস্তু পরস্পরের ওপর বিপরীতমুখী বল প্রয়োগ করছে
                </p>
              </div>

              <SimulationButtons
                isPlaying={thirdPlaying}
                onToggle={toggleThird}
                onReset={resetThird}
              />
            </div>

            {/* Third law visual */}

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-purple-50 to-slate-100 p-4">
              <div className="relative h-64">

                <div className="absolute bottom-8 left-0 right-0 h-1 bg-slate-500" />

                {/* Object A */}

                <div
                  className="absolute bottom-9 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-blue-700 bg-blue-500 font-bold text-white shadow-lg"
                  style={{
                    left: `clamp(0px, calc(25% - ${Math.min(thirdPositionA * 8, 20)}%), 35%)`,
                  }}
                >
                  A
                  <span className="absolute -bottom-6 whitespace-nowrap text-xs font-bold text-blue-700">
                    {thirdMassA} kg
                  </span>
                </div>

                {/* Object B */}

                <div
                  className="absolute bottom-9 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-purple-700 bg-purple-500 font-bold text-white shadow-lg"
                  style={{
                    right: `clamp(0px, calc(25% - ${Math.min(thirdPositionB * 8, 20)}%), 35%)`,
                  }}
                >
                  B
                  <span className="absolute -bottom-6 whitespace-nowrap text-xs font-bold text-purple-700">
                    {thirdMassB} kg
                  </span>
                </div>

                {/* Action reaction arrows */}

                <div className="absolute left-[20%] top-16 flex flex-col items-center text-blue-700">
                  <MoveRight size={36} />
                  <span className="text-xs font-bold">
                    F_AB = {thirdForce} N
                  </span>
                </div>

                <div className="absolute right-[20%] top-16 flex flex-col items-center text-purple-700">
                  <MoveRight className="rotate-180" size={36} />
                  <span className="text-xs font-bold">
                    F_BA = {thirdForce} N
                  </span>
                </div>

                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  Action = Reaction
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-center">
                  <p className="text-xs font-bold text-blue-700">
                    বস্তু A-এর বেগ
                  </p>
                  <p className="mt-1 text-lg font-bold text-blue-900">
                    {thirdVelocityA.toFixed(2)} m/s
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-center">
                  <p className="text-xs font-bold text-purple-700">
                    বস্তু B-এর বেগ
                  </p>
                  <p className="mt-1 text-lg font-bold text-purple-900">
                    {Math.abs(thirdVelocityB).toFixed(2)} m/s
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-600" />
                সমান ও বিপরীতমুখী বল
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock size={14} />
                {thirdTime.toFixed(2)} / 30 s
              </span>
            </div>

            <ProgressBar time={thirdTime} />
          </section>

          {/* Third law controls */}

          <section className="grid gap-5 lg:grid-cols-2">

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Third Law Control Panel
              </h3>

              <RangeControl
                label="ক্রিয়া ও প্রতিক্রিয়া বল"
                value={thirdForce}
                min={5}
                max={100}
                step={1}
                unit="N"
                color="text-blue-600"
                onChange={setThirdForce}
              />

              <RangeControl
                label="বস্তু A-এর ভর"
                value={thirdMassA}
                min={1}
                max={20}
                step={1}
                unit="kg"
                color="text-blue-600"
                onChange={setThirdMassA}
              />

              <RangeControl
                label="বস্তু B-এর ভর"
                value={thirdMassB}
                min={1}
                max={20}
                step={1}
                unit="kg"
                color="text-purple-600"
                onChange={setThirdMassB}
              />

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs font-bold text-purple-800">
                  কী পরীক্ষা করবে?
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-600">
                  দুটি বস্তুর ভর সমান ও অসমান করে দেখো।
                  উভয় বস্তুর ওপর বল সমান হলেও ত্বরণ কীভাবে
                  পরিবর্তিত হয় তা পর্যবেক্ষণ করো।
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Action & Reaction Data
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="ক্রিয়া বল"
                  value={thirdForce.toFixed(2)}
                  unit="N"
                  symbol="F_AB"
                  icon={MoveRight}
                  color="text-blue-600"
                />
                <MetricCard
                  label="প্রতিক্রিয়া বল"
                  value={thirdForce.toFixed(2)}
                  unit="N"
                  symbol="F_BA"
                  icon={ArrowLeftRight}
                  color="text-purple-600"
                />
                <MetricCard
                  label="A-এর ত্বরণ"
                  value={accelerationA.toFixed(2)}
                  unit="m/s²"
                  symbol="a_A"
                  icon={Zap}
                  color="text-blue-600"
                />
                <MetricCard
                  label="B-এর ত্বরণ"
                  value={accelerationB.toFixed(2)}
                  unit="m/s²"
                  symbol="a_B"
                  icon={Zap}
                  color="text-purple-600"
                />
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <p className="mb-2 text-xs font-bold text-purple-800">
                  নিউটনের তৃতীয় সূত্র
                </p>
                <FormulaBox formula="F_{AB} = -F_{BA}" />
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  প্রতিটি ক্রিয়ার সমান মানের ও বিপরীতমুখী প্রতিক্রিয়া
                  আছে। এই বল দুটি ভিন্ন বস্তুর ওপর কাজ করে।
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 text-white">
                <p className="mb-2 text-xs font-bold text-slate-300">
                  ত্বরণের তুলনা
                </p>
                <p className="text-sm">
                  A-এর ত্বরণ: {accelerationA.toFixed(2)} m/s²
                </p>
                <p className="mt-1 text-sm">
                  B-এর ত্বরণ: {accelerationB.toFixed(2)} m/s²
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-300">
                  কম ভরের বস্তু একই মানের বলের কারণে বেশি ত্বরণ লাভ করে।
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================================================
          LEARNING SUMMARY
      ================================================== */}

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">নিউটনের তিনটি সূত্র</h3>
        </div>

        <div className="space-y-4">

          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-bold text-blue-700">
              প্রথম সূত্র — জড়তার সূত্র
            </p>
            <FormulaBox formula="\\sum F = 0 \\Rightarrow a = 0" />
            <p className="mt-2 text-xs leading-5 text-slate-600">
              লব্ধি বাহ্যিক বল শূন্য হলে স্থির বস্তু স্থির এবং
              গতিশীল বস্তু সমবেগে সরলরেখায় চলতে থাকে।
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-bold text-amber-700">
              দ্বিতীয় সূত্র — বল ও ত্বরণ
            </p>
            <FormulaBox formula="F_{net} = ma" />
            <p className="mt-2 text-xs leading-5 text-slate-600">
              বস্তুর ত্বরণ লব্ধি বলের সমানুপাতিক এবং ভরের
              ব্যস্তানুপাতিক।
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-sm font-bold text-purple-700">
              তৃতীয় সূত্র — ক্রিয়া ও প্রতিক্রিয়া
            </p>
            <FormulaBox formula="F_{AB} = -F_{BA}" />
            <p className="mt-2 text-xs leading-5 text-slate-600">
              ক্রিয়া ও প্রতিক্রিয়া সমান মানের, বিপরীতমুখী এবং
              ভিন্ন দুটি বস্তুর ওপর ক্রিয়া করে।
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 border-t border-blue-100 pt-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p className="text-xs leading-5 text-slate-500">
            শিক্ষামূলক মডেল: প্রথম ও দ্বিতীয় সূত্রের সিমুলেশনে
            স্থিতি ও গতিশীল ঘর্ষণের জন্য একই ঘর্ষণ গুণাঙ্ক ব্যবহার
            করা হয়েছে। তৃতীয় সূত্রের সিমুলেশনে দুটি বস্তু একটি
            বিচ্ছিন্ন সিস্টেমে বিপরীতমুখী বল প্রয়োগ করছে;
            বায়ুর বাধা ও অন্যান্য বাহ্যিক বল বিবেচনা করা হয়নি।
          </p>
        </div>
      </section>
    </div>
  );
}
