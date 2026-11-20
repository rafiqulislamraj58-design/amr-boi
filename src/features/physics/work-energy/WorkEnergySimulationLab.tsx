
'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  Activity,
  Zap,
  Calculator,
  Gauge,
  ArrowDown,
  Flame,
  TrendingUp,
  Scale,
  Wind,
  Timer,
  CheckCircle2,
  BookOpen,
  Info,
} from 'lucide-react';

import FormulaBox from '@/components/common/FormulaBox';

// =====================================================
// 1. TYPES
// =====================================================

interface Preset {
  name: string;
  mass: number;
  height: number;
  efficiency: number;
}

interface SimulationState {
  time: number;
  height: number;
  velocity: number;
}

interface EnergyValues {
  total: number;
  potential: number;
  released: number;
  kinetic: number;
  lost: number;
  acceleration: number;
  efficiency: number;
  potentialPercent: number;
  kineticPercent: number;
  lostPercent: number;
}

// =====================================================
// 2. CONSTANTS
// =====================================================

const GRAVITY = 9.8;

const CANVAS_WIDTH = 820;
const CANVAS_HEIGHT = 270;

const MIN_MASS = 1;
const MAX_MASS = 20;

const MIN_HEIGHT = 5;
const MAX_HEIGHT = 50;

const MIN_EFFICIENCY = 50;
const MAX_EFFICIENCY = 100;

const PRESETS: Preset[] = [
  {
    name: 'হালকা বল',
    mass: 2,
    height: 10,
    efficiency: 100,
  },
  {
    name: 'মাঝারি পাথর',
    mass: 5,
    height: 25,
    efficiency: 90,
  },
  {
    name: 'ভারী বস্তু',
    mass: 12,
    height: 40,
    efficiency: 80,
  },
  {
    name: 'আদর্শ মুক্ত পতন',
    mass: 10,
    height: 50,
    efficiency: 100,
  },
];

const INITIAL_SIMULATION: SimulationState = {
  time: 0,
  height: 25,
  velocity: 0,
};

// =====================================================
// 3. UTILITY FUNCTIONS
// =====================================================

const clamp = (
  value: number,
  min: number,
  max: number
): number => Math.min(max, Math.max(min, value));

const formatNumber = (
  value: number,
  decimals = 2
): string => {
  return Number.isFinite(value)
    ? value.toFixed(decimals)
    : '0.00';
};

// =====================================================
// 4. MAIN COMPONENT
// =====================================================

export default function WorkEnergySimulationLab() {
  // ---------------------------------------------------
  // PHYSICS PARAMETERS
  // ---------------------------------------------------

  const [mass, setMass] = useState<number>(5);

  const [initialHeight, setInitialHeight] =
    useState<number>(25);

  const [efficiency, setEfficiency] =
    useState<number>(100);

  // ---------------------------------------------------
  // SIMULATION STATE
  // ---------------------------------------------------

  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  const [simulation, setSimulation] =
    useState<SimulationState>({
      ...INITIAL_SIMULATION,
    });

  const {
    time,
    height: currentHeight,
    velocity,
  } = simulation;

  // ---------------------------------------------------
  // REFS
  // ---------------------------------------------------

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationRef = useRef<number | null>(null);

  const lastTimestampRef = useRef<number | null>(null);

  const simulationRef = useRef<SimulationState>({
    ...INITIAL_SIMULATION,
  });

  // ---------------------------------------------------
  // 5. DERIVED PHYSICS VALUES
  // ---------------------------------------------------

  const energy: EnergyValues = useMemo(() => {
    const eta = efficiency / 100;

    // Effective acceleration
    const acceleration = eta * GRAVITY;

    // Total initial potential energy
    const total = mass * GRAVITY * initialHeight;

    // Current potential energy
    const potential = mass * GRAVITY * currentHeight;

    // Potential energy released
    const released = Math.max(
      0,
      total - potential
    );

    // Useful kinetic energy
    const kinetic = released * eta;

    // Energy converted into heat and sound
    const lost = Math.max(
      0,
      released - kinetic
    );

    const safeTotal = total > 0 ? total : 1;

    return {
      total,
      potential,
      released,
      kinetic,
      lost,
      acceleration,
      efficiency,

      potentialPercent:
        (potential / safeTotal) * 100,

      kineticPercent:
        (kinetic / safeTotal) * 100,

      lostPercent:
        (lost / safeTotal) * 100,
    };
  }, [
    mass,
    initialHeight,
    currentHeight,
    efficiency,
  ]);

  // ---------------------------------------------------
  // 6. RESET SIMULATION
  // ---------------------------------------------------

  const resetSimulation = useCallback(
    (newHeight: number = initialHeight) => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      lastTimestampRef.current = null;

      const nextState: SimulationState = {
        time: 0,
        height: newHeight,
        velocity: 0,
      };

      simulationRef.current = nextState;

      setSimulation(nextState);
      setIsPlaying(false);
    },
    [initialHeight]
  );

  // ---------------------------------------------------
  // 7. PRESET HANDLER
  // ---------------------------------------------------

  const applyPreset = useCallback(
    (preset: Preset) => {
      setMass(preset.mass);
      setInitialHeight(preset.height);
      setEfficiency(preset.efficiency);

      resetSimulation(preset.height);
    },
    [resetSimulation]
  );

  // ---------------------------------------------------
  // 8. ANIMATION ENGINE
  // ---------------------------------------------------

  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const eta = efficiency / 100;

    // a = ηg
    const acceleration = eta * GRAVITY;

    // Time required to reach the ground
    const maxTime = Math.sqrt(
      (2 * initialHeight) / acceleration
    );

    const step = (timestamp: number): void => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const rawDelta =
        (timestamp - lastTimestampRef.current) / 1000;

      const delta = clamp(rawDelta, 0, 0.05);

      lastTimestampRef.current = timestamp;

      const previous = simulationRef.current;

      const nextTime = Math.min(
        previous.time + delta,
        maxTime
      );

      // s = 1/2 at²
      const fallenDistance = Math.min(
        initialHeight,
        0.5 * acceleration * nextTime * nextTime
      );

      // Current height
      const nextHeight = Math.max(
        0,
        initialHeight - fallenDistance
      );

      // v = at
      const nextVelocity = Math.sqrt(
        2 * acceleration * fallenDistance
      );

      const nextState: SimulationState = {
        time: nextTime,
        height: nextHeight,
        velocity: nextVelocity,
      };

      simulationRef.current = nextState;

      setSimulation(nextState);

      if (nextHeight <= 0 || nextTime >= maxTime) {
        animationRef.current = null;
        setIsPlaying(false);
        return;
      }

      animationRef.current =
        requestAnimationFrame(step);
    };

    animationRef.current =
      requestAnimationFrame(step);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      lastTimestampRef.current = null;
    };
  }, [
    isPlaying,
    initialHeight,
    efficiency,
  ]);

  // ---------------------------------------------------
  // 9. PLAY / PAUSE
  // ---------------------------------------------------

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (currentHeight <= 0) {
      resetSimulation();
    }

    setIsPlaying(true);
  }, [
    isPlaying,
    currentHeight,
    resetSimulation,
  ]);

  // ---------------------------------------------------
  // 10. CANVAS RENDERING
  // ---------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    ctx.clearRect(0, 0, width, height);

    // Background
    const background = ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );

    background.addColorStop(0, '#eff6ff');
    background.addColorStop(1, '#f8fafc');

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // Scene
    const groundY = 235;
    const topY = 40;
    const dropSpan = groundY - topY;

    // Ground
    ctx.fillStyle = '#86efac';

    ctx.fillRect(
      0,
      groundY,
      width,
      height - groundY
    );

    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, groundY, width, 4);

    // Height ruler
    const rulerX = 105;

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(rulerX, topY);
    ctx.lineTo(rulerX, groundY);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const ratio = i / 4;

      const y = groundY - ratio * dropSpan;

      const heightValue = (
        initialHeight * ratio
      ).toFixed(0);

      ctx.fillText(
        `${heightValue} m`,
        rulerX - 10,
        y + 4
      );

      ctx.beginPath();
      ctx.moveTo(rulerX - 5, y);
      ctx.lineTo(rulerX + 5, y);
      ctx.stroke();
    }

    // Platform
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(140, topY + 12, 70, 8);

    ctx.fillStyle = '#94a3b8';

    ctx.fillRect(
      140,
      topY + 20,
      12,
      groundY - (topY + 20)
    );

    // Ball
    const ballX = 240;

    const ballRadius = Math.min(
      24,
      12 + mass * 0.6
    );

    const heightRatio = clamp(
      currentHeight / initialHeight,
      0,
      1
    );

    const ballY =
      groundY -
      ballRadius -
      heightRatio * (dropSpan - ballRadius);

    // Shadow
    const shadowScale =
      0.4 + 0.6 * (1 - heightRatio);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';

    ctx.beginPath();

    ctx.ellipse(
      ballX,
      groundY + 2,
      ballRadius * shadowScale,
      4,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Ball gradient
    const ballGradient = ctx.createRadialGradient(
      ballX - 5,
      ballY - 5,
      3,
      ballX,
      ballY,
      ballRadius
    );

    ballGradient.addColorStop(0, '#60a5fa');
    ballGradient.addColorStop(1, '#1d4ed8');

    ctx.fillStyle = ballGradient;

    ctx.beginPath();

    ctx.arc(
      ballX,
      ballY,
      ballRadius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Mass label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      `${mass}kg`,
      ballX,
      ballY + 4
    );

    // Velocity label
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 12px sans-serif';

    ctx.fillText(
      `v = ${formatNumber(velocity)} m/s`,
      ballX,
      ballY - ballRadius - 10
    );

    // Energy chart
    const chartItems = [
      {
        x: 380,
        label: 'বিভব',
        percent: energy.potentialPercent,
        value: energy.potential,
        color: '#2563eb',
      },
      {
        x: 480,
        label: 'গতি',
        percent: energy.kineticPercent,
        value: energy.kinetic,
        color: '#16a34a',
      },
      {
        x: 580,
        label: 'অপচয়',
        percent: energy.lostPercent,
        value: energy.lost,
        color: '#f59e0b',
      },
      {
        x: 680,
        label: 'মোট',
        percent: 100,
        value: energy.total,
        color: '#9333ea',
      },
    ];

    const barWidth = 55;
    const maxBarHeight = 145;
    const barBaseY = 215;

    chartItems.forEach((item) => {
      // Bar background
      ctx.fillStyle = '#e2e8f0';

      ctx.beginPath();

      ctx.roundRect(
        item.x,
        barBaseY - maxBarHeight,
        barWidth,
        maxBarHeight,
        7
      );

      ctx.fill();

      // Bar fill
      const fillHeight =
        (clamp(item.percent, 0, 100) / 100) *
        maxBarHeight;

      if (fillHeight > 0) {
        ctx.fillStyle = item.color;

        ctx.beginPath();

        ctx.roundRect(
          item.x,
          barBaseY - fillHeight,
          barWidth,
          fillHeight,
          7
        );

        ctx.fill();
      }

      // Value
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';

      ctx.fillText(
        `${formatNumber(item.value, 0)}J`,
        item.x + barWidth / 2,
        barBaseY - maxBarHeight - 8
      );

      // Label
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px sans-serif';

      ctx.fillText(
        item.label,
        item.x + barWidth / 2,
        barBaseY + 17
      );
    });

    // Efficiency
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';

    ctx.fillText(
      `Efficiency: ${efficiency}%`,
      380,
      25
    );

  }, [
    mass,
    initialHeight,
    currentHeight,
    velocity,
    efficiency,
    energy,
  ]);

  // ===================================================
  // 11. RENDER
  // ===================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <header className="space-y-2">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
          <Activity className="w-4 h-4" />
          INTERACTIVE ENERGY LAB
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          শক্তির নিত্যতা ও মুক্ত পতনের পরীক্ষাগার
        </h2>

        <p className="text-sm text-slate-500 leading-relaxed">
          বস্তু পতনের সময় বিভব শক্তি কীভাবে গতিশক্তিতে
          রূপান্তরিত হয় এবং কর্মদক্ষতা পরিবর্তনে শক্তির
          অপচয় কীভাবে প্রভাবিত হয় তা পর্যবেক্ষণ করো।
        </p>

      </header>

      {/* PRESETS */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />

          <h3 className="font-bold text-slate-800 text-sm">
            দ্রুত পরীক্ষার Scenario
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">

          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}

        </div>

      </section>

      {/* CANVAS SIMULATION */}

      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div>
            <h3 className="font-bold text-slate-900">
              2D Energy Transformation
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Real-time Physics Simulation
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}

              {isPlaying
                ? 'Pause'
                : currentHeight <= 0
                  ? 'Replay'
                  : 'Drop Ball'}
            </button>

            <button
              type="button"
              onClick={() => resetSimulation()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

          </div>

        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto block"
            role="img"
            aria-label="Free fall energy transformation simulation"
          />

        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            বিভব শক্তি
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            গতিশক্তি
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            অপচয়কৃত শক্তি
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            মোট শক্তি
          </span>

        </div>

      </section>

      {/* LIVE TELEMETRY */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {[
          {
            label: 'বর্তমান উচ্চতা',
            value: formatNumber(currentHeight),
            unit: 'm',
            icon: ArrowDown,
          },
          {
            label: 'বর্তমান বেগ',
            value: formatNumber(velocity),
            unit: 'm/s',
            icon: Gauge,
          },
          {
            label: 'বিভব শক্তি',
            value: formatNumber(energy.potential, 1),
            unit: 'J',
            icon: Zap,
          },
          {
            label: 'গতিশক্তি',
            value: formatNumber(energy.kinetic, 1),
            unit: 'J',
            icon: Flame,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between gap-2">

                <span className="text-xs text-slate-500 font-semibold">
                  {item.label}
                </span>

                <Icon className="w-4 h-4 text-slate-400 shrink-0" />

              </div>

              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {item.value}

                <span className="text-xs text-slate-500 ml-1">
                  {item.unit}
                </span>
              </p>
            </div>
          );
        })}

      </section>

      {/* ENERGY CONSERVATION */}

      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4">

        <div className="flex items-center gap-2 mb-3">

          <CheckCircle2 className="w-5 h-5 text-blue-600" />

          <h3 className="font-bold text-slate-900">
            শক্তির হিসাব ও নিত্যতা
          </h3>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {[
            {
              label: 'মোট শক্তি',
              value: energy.total,
            },
            {
              label: 'বিভব শক্তি',
              value: energy.potential,
            },
            {
              label: 'গতিশক্তি',
              value: energy.kinetic,
            },
            {
              label: 'অপচয়কৃত শক্তি',
              value: energy.lost,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/80 rounded-xl p-3"
            >
              <p className="text-xs text-slate-500">
                {item.label}
              </p>

              <p className="font-bold text-slate-900 mt-1 tabular-nums">
                {formatNumber(item.value, 1)} J
              </p>
            </div>
          ))}

        </div>

        <div className="mt-3 p-3 bg-white/80 rounded-xl text-sm text-slate-700">

          <strong>শক্তির নিত্যতা:</strong>

          <FormulaBox
            formula="E_p + E_k + E_{loss} = E_{total}"
          />

          <p className="mt-2 text-xs text-slate-500">
            {formatNumber(energy.potential, 1)} +{' '}
            {formatNumber(energy.kinetic, 1)} +{' '}
            {formatNumber(energy.lost, 1)} ={' '}
            {formatNumber(energy.total, 1)} J
          </p>

        </div>

      </section>

      {/* CONTROL PANEL + CALCULATIONS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* CONTROL PANEL */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              Simulation Control Panel
            </h3>
          </div>

          {/* MASS */}

          <div>

            <div className="flex justify-between items-center text-sm mb-2">

              <label
                htmlFor="mass-slider"
                className="font-semibold text-slate-700"
              >
                বস্তুর ভর (Mass)
              </label>

              <span className="font-bold text-blue-600">
                {mass} kg
              </span>

            </div>

            <input
              id="mass-slider"
              type="range"
              min={MIN_MASS}
              max={MAX_MASS}
              step={1}
              value={mass}
              onChange={(event) => {
                setMass(Number(event.target.value));
                resetSimulation();
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{MIN_MASS} kg</span>
              <span>{MAX_MASS} kg</span>
            </div>

          </div>

          {/* HEIGHT */}

          <div>

            <div className="flex justify-between items-center text-sm mb-2">

              <label
                htmlFor="height-slider"
                className="font-semibold text-slate-700"
              >
                প্রাথমিক উচ্চতা (Height)
              </label>

              <span className="font-bold text-emerald-600">
                {initialHeight} m
              </span>

            </div>

            <input
              id="height-slider"
              type="range"
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              step={1}
              value={initialHeight}
              onChange={(event) => {
                const newHeight = Number(event.target.value);

                setInitialHeight(newHeight);
                resetSimulation(newHeight);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{MIN_HEIGHT} m</span>
              <span>{MAX_HEIGHT} m</span>
            </div>

          </div>

          {/* EFFICIENCY */}

          <div className="pt-4 border-t border-slate-100">

            <div className="flex items-center justify-between gap-2 mb-2">

              <label
                htmlFor="efficiency-slider"
                className="flex items-center gap-2 font-semibold text-slate-700 text-sm"
              >
                <TrendingUp className="w-4 h-4 text-purple-600" />

                কর্মদক্ষতা (Efficiency)
              </label>

              <span className="font-bold text-purple-600">
                {efficiency}%
              </span>

            </div>

            <input
              id="efficiency-slider"
              type="range"
              min={MIN_EFFICIENCY}
              max={MAX_EFFICIENCY}
              step={5}
              value={efficiency}
              onChange={(event) => {
                const value = Number(event.target.value);

                setEfficiency(
                  clamp(
                    value,
                    MIN_EFFICIENCY,
                    MAX_EFFICIENCY
                  )
                );

                resetSimulation();
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{MIN_EFFICIENCY}%</span>
              <span>{MAX_EFFICIENCY}%</span>
            </div>

            <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-xl">

              <div className="flex items-center gap-2 text-purple-800 font-semibold text-sm">

                <Scale className="w-4 h-4" />

                {efficiency === 100
                  ? 'আদর্শ শক্তি রূপান্তর'
                  : 'শক্তির কিছু অংশ অপচয় হচ্ছে'}

              </div>

              <p className="text-xs text-purple-700 mt-1 leading-relaxed">

                {efficiency === 100
                  ? 'কোনো শক্তি অপচয় হচ্ছে না। বিভব শক্তি সম্পূর্ণ গতিশক্তিতে রূপান্তরিত হচ্ছে।'
                  : `এই মডেলে মুক্ত হওয়া শক্তির ${100 - efficiency}% তাপ ও শব্দ হিসেবে অপচয় হচ্ছে।`}

              </p>

            </div>

          </div>

          {/* TIME */}

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">

            <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
              <Timer className="w-4 h-4" />
              অতিবাহিত সময়
            </div>

            <span className="font-bold text-slate-900 tabular-nums">
              {formatNumber(time)} s
            </span>

          </div>

        </section>

        {/* LIVE CALCULATION */}

        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">

          <div className="flex items-center gap-2">

            <Calculator className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              Live Physics Calculation
            </h3>

          </div>

          {/* ACCELERATION */}

          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 space-y-2">

            <p className="text-xs font-bold text-indigo-700">
              ১. কার্যকর ত্বরণ (Acceleration)
            </p>

            <FormulaBox
              formula={`a = \\eta g = ${formatNumber(efficiency / 100, 2)} \\times 9.8 = ${formatNumber(energy.acceleration)}\\text{ m/s}^2`}
            />

            <p className="text-xs text-slate-500">
              এখানে η হলো কর্মদক্ষতার ভগ্নাংশ।
            </p>

          </div>

          {/* POTENTIAL ENERGY */}

          <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 space-y-2">

            <p className="text-xs font-bold text-blue-700">
              ২. বিভব শক্তি (Potential Energy)
            </p>

            <FormulaBox
              formula={`E_p = mgh = ${mass} \\times 9.8 \\times ${formatNumber(currentHeight)} = ${formatNumber(energy.potential)}\\text{ J}`}
            />

          </div>

          {/* KINETIC ENERGY */}

          <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 space-y-2">

            <p className="text-xs font-bold text-emerald-700">
              ৩. গতিশক্তি (Kinetic Energy)
            </p>

            <FormulaBox
              formula={`E_k = \\frac{1}{2}mv^2 = \\frac{1}{2} \\times ${mass} \\times (${formatNumber(velocity)})^2 = ${formatNumber(energy.kinetic)}\\text{ J}`}
            />

          </div>

          {/* EFFICIENCY */}

          <div className="rounded-xl bg-purple-50/60 border border-purple-100 p-4 space-y-2">

            <p className="text-xs font-bold text-purple-700">
              ৪. কর্মদক্ষতা (Efficiency)
            </p>

            <FormulaBox
              formula={`\\eta = \\frac{E_{useful}}{E_{input}} \\times 100 = ${efficiency}\\%`}
            />

            <p className="text-xs text-slate-500 leading-relaxed">
              এই মডেলে E useful হলো মুক্ত হওয়া বিভব শক্তির গতিশক্তিতে রূপান্তরিত অংশ।
            </p>

          </div>

          {/* ENERGY LOSS */}

          <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-4 space-y-2">

            <p className="text-xs font-bold text-amber-700">
              ৫. অপচয়কৃত শক্তি (Energy Loss)
            </p>

            <FormulaBox
              formula={`E_{loss} = E_{total} - E_p - E_k = ${formatNumber(energy.lost)}\\text{ J}`}
            />

          </div>

          {/* CONSERVATION */}

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">

            <p className="text-xs font-bold text-slate-700">
              ৬. শক্তির নিত্যতা (Conservation of Energy)
            </p>

            <FormulaBox
              formula="E_p + E_k + E_{loss} = E_{total}"
            />

            <p className="text-xs text-slate-500">
              {formatNumber(energy.potential, 2)} +{' '}
              {formatNumber(energy.kinetic, 2)} +{' '}
              {formatNumber(energy.lost, 2)} ={' '}
              {formatNumber(energy.total, 2)} J
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Wind className="w-4 h-4 shrink-0" />

            অপচয়িত শক্তিকে এই মডেলে তাপ ও শব্দ হিসেবে বিবেচনা করা হয়েছে।
          </div>

        </section>

      </div>

      {/* LEARNING NOTE */}

      <section className="border border-slate-200 rounded-2xl p-4 bg-slate-50">

        <div className="flex items-center gap-2 mb-3">

          <BookOpen className="w-5 h-5 text-blue-600" />

          <h3 className="font-bold text-slate-900">
            পরীক্ষণ থেকে যা শিখবে
          </h3>

        </div>

        <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">

          <li>
            • উচ্চতা কমার সঙ্গে সঙ্গে বিভব শক্তি কমে।
          </li>

          <li>
            • বস্তু নিচে পড়ার সময় গতিশক্তি বৃদ্ধি পায়।
          </li>

          <li>
            • কর্মদক্ষতা কম হলে মুক্ত হওয়া শক্তির একটি অংশ অপচয়িত হয়।
          </li>

          <li>
            • বিভব, গতি ও অপচয়িত শক্তির যোগফল মোট শক্তির সমান থাকে।
          </li>

          <li>
            • আদর্শ অবস্থায় কর্মদক্ষতা ১০০% হয়।
          </li>

        </ul>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">

          <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">

            <Info className="w-4 h-4" />

            গুরুত্বপূর্ণ তথ্য

          </div>

          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            বাস্তব মুক্ত পতনে বায়ুর বাধা থাকলে ত্বরণ সাধারণত g-এর চেয়ে কম হয়।
            এখানে কর্মদক্ষতাকে একটি ধ্রুবক গুণক ধরে সরলীকৃত মডেল তৈরি করা হয়েছে।
            এটি বায়ুর বাধার পূর্ণ বাস্তবসম্মত মডেল নয়।
          </p>

        </div>

      </section>

    </div>
  );
}
