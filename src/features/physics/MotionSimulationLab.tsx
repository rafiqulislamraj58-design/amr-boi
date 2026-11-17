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
  Calculator,
  Activity,
  Gauge,
  Clock,
  Route,
  Zap,
  CarFront,
  TrendingUp,
  BookOpen,
  ArrowLeftRight,
  Target,
  Ruler,
} from 'lucide-react';

import FormulaBox from '@/components/common/FormulaBox';

// ============================================================
// TYPES
// ============================================================

type GraphType = 'position' | 'velocity' | 'acceleration';

type Preset = {
  name: string;
  u: number;
  a: number;
  time: number;
};

type GraphPoint = {
  t: number;
  position: number;
  velocity: number;
  acceleration: number;
};

// ============================================================
// CONSTANTS
// ============================================================

const EPSILON = 0.000001;

const DEFAULTS = {
  u: 5,
  a: 2,
  time: 10,
};

const PRESETS: Preset[] = [
  { name: 'সমবেগ', u: 5, a: 0, time: 10 },
  { name: 'ধনাত্মক ত্বরণ', u: 5, a: 2, time: 10 },
  { name: 'মন্দন', u: 20, a: -2, time: 10 },
  { name: 'দ্রুত গাড়ি', u: 15, a: 3, time: 8 },
  { name: 'স্থির অবস্থা থেকে', u: 0, a: 2, time: 10 },
  { name: 'ঋণাত্মক বেগ', u: -10, a: 0, time: 10 },
  { name: 'দিক পরিবর্তন', u: 10, a: -2, time: 10 },
  { name: 'বিপরীত দিকে ত্বরণ', u: -10, a: -2, time: 10 },
];

// ============================================================
// PHYSICS ENGINE
// ============================================================

const velocityAt = (u: number, a: number, t: number): number => {
  return u + a * t;
};

const displacementAt = (u: number, a: number, t: number): number => {
  return u * t + 0.5 * a * t * t;
};

const distanceAt = (u: number, a: number, t: number): number => {
  if (t <= 0) return 0;

  if (Math.abs(a) < EPSILON) {
    return Math.abs(u) * t;
  }

  const turningTime = -u / a;

  // No direction change
  if (turningTime <= 0 || turningTime >= t) {
    return Math.abs(displacementAt(u, a, t));
  }

  const firstPosition = displacementAt(u, a, turningTime);
  const finalPosition = displacementAt(u, a, t);

  return (
    Math.abs(firstPosition) + Math.abs(finalPosition - firstPosition)
  );
};

const averageVelocityAt = (u: number, a: number, t: number): number => {
  if (t <= 0) return 0;
  return displacementAt(u, a, t) / t;
};

const averageSpeedAt = (u: number, a: number, t: number): number => {
  if (t <= 0) return 0;
  return distanceAt(u, a, t) / t;
};

const turningTimeAt = (u: number, a: number): number | null => {
  if (Math.abs(a) < EPSILON) return null;
  return -u / a;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0.00';

  const normalized = Math.abs(value) < EPSILON ? 0 : value;

  return normalized.toFixed(2);
};

// ============================================================
// COMPONENT
// ============================================================

export default function MotionSimulationLab() {
  // ----------------------------------------------------------
  // PHYSICS PARAMETERS
  // ----------------------------------------------------------

  const [u, setU] = useState(DEFAULTS.u);
  const [a, setA] = useState(DEFAULTS.a);
  const [maxTime, setMaxTime] = useState(DEFAULTS.time);

  // ----------------------------------------------------------
  // SIMULATION STATE
  // ----------------------------------------------------------

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [graphType, setGraphType] = useState<GraphType>('velocity');

  // ----------------------------------------------------------
  // REFS
  // ----------------------------------------------------------

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);

  // ----------------------------------------------------------
  // CURRENT PHYSICS VALUES
  // ----------------------------------------------------------

  const currentVelocity = velocityAt(u, a, currentTime);
  const currentSpeed = Math.abs(currentVelocity);
  const currentDisplacement = displacementAt(u, a, currentTime);
  const currentDistance = distanceAt(u, a, currentTime);
  const currentAcceleration = a;

  // ----------------------------------------------------------
  // FINAL PHYSICS VALUES
  // ----------------------------------------------------------

  const finalVelocity = velocityAt(u, a, maxTime);
  const finalSpeed = Math.abs(finalVelocity);
  const finalDisplacement = displacementAt(u, a, maxTime);
  const totalDistance = distanceAt(u, a, maxTime);
  const averageVelocity = averageVelocityAt(u, a, maxTime);
  const averageSpeed = averageSpeedAt(u, a, maxTime);

  // ----------------------------------------------------------
  // MOTION ANALYSIS
  // ----------------------------------------------------------

  const turningTime = turningTimeAt(u, a);

  const hasDirectionChange =
    turningTime !== null &&
    turningTime > EPSILON &&
    turningTime < maxTime - EPSILON;

  const turningDisplacement =
    hasDirectionChange && turningTime !== null
      ? displacementAt(u, a, turningTime)
      : null;

  const isStopped = Math.abs(currentVelocity) < EPSILON;
  const isReversing = currentVelocity < -EPSILON;
  const isSpeedingUp = !isStopped && currentVelocity * a > EPSILON;
  const isSlowingDown = !isStopped && currentVelocity * a < -EPSILON;

  const progress = Math.min(
    100,
    Math.max(0, (currentTime / maxTime) * 100)
  );

  // ----------------------------------------------------------
  // SYNCHRONIZE TIME REF
  // ----------------------------------------------------------

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // ----------------------------------------------------------
  // STOP / RESET
  // ----------------------------------------------------------

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    lastTimestampRef.current = null;
  }, []);

  const resetSimulation = useCallback(() => {
    stopAnimation();

    currentTimeRef.current = 0;

    setCurrentTime(0);
    setIsPlaying(false);
  }, [stopAnimation]);

  // ----------------------------------------------------------
  // ANIMATION ENGINE
  // ----------------------------------------------------------

  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = Math.min(
        Math.max(0, (timestamp - lastTimestampRef.current) / 1000),
        0.05
      );

      lastTimestampRef.current = timestamp;

      const nextTime = Math.min(
        currentTimeRef.current + delta * playbackSpeed,
        maxTime
      );

      currentTimeRef.current = nextTime;

      setCurrentTime(nextTime);

      if (nextTime >= maxTime - EPSILON) {
        currentTimeRef.current = maxTime;

        setCurrentTime(maxTime);
        setIsPlaying(false);

        animationRef.current = null;
        lastTimestampRef.current = null;

        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      lastTimestampRef.current = null;
    };
  }, [isPlaying, maxTime, playbackSpeed]);

  // ----------------------------------------------------------
  // CANVAS 2D VISUALIZATION
  // ----------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    const sky = ctx.createLinearGradient(0, 0, 0, height);

    sky.addColorStop(0, '#dbeafe');
    sky.addColorStop(1, '#f8fafc');

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Sun
    ctx.beginPath();
    ctx.arc(width - 100, 45, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Clouds
    const drawCloud = (x: number, y: number) => {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 20, y - 10, 20, 0, Math.PI * 2);
      ctx.arc(x + 42, y, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCloud(120, 55);
    drawCloud(450, 38);
    drawCloud(700, 65);

    // Ground
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, 165, width, 95);

    // Road
    const roadY = 172;

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, roadY, width, 65);

    // Road borders
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, roadY, width, 4);
    ctx.fillRect(0, roadY + 61, width, 4);

    // Road center line
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.setLineDash([25, 20]);

    ctx.beginPath();
    ctx.moveTo(0, roadY + 32);
    ctx.lineTo(width, roadY + 32);
    ctx.stroke();

    ctx.setLineDash([]);

    // Motion range
    const positions = [0, finalDisplacement];

    if (hasDirectionChange && turningDisplacement !== null) {
      positions.push(turningDisplacement);
    }

    const minS = Math.min(...positions);
    const maxS = Math.max(...positions);
    const range = Math.max(maxS - minS, 1);

    const trackStart = 75;
    const trackWidth = width - 180;

    const rawCarX =
      trackStart + ((currentDisplacement - minS) / range) * trackWidth;

    const carX = Math.max(5, Math.min(rawCarX, width - 85));

    // Distance markers
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';

    for (let i = 0; i <= 4; i++) {
      const markerX = trackStart + (trackWidth / 4) * i;
      const markerValue = minS + (range / 4) * i;

      ctx.fillStyle = '#475569';
      ctx.fillText(`${markerValue.toFixed(0)} m`, markerX, 155);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(markerX, 160);
      ctx.lineTo(markerX, 172);
      ctx.stroke();
    }

    // Car
    const carY = 190;

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(15,23,42,0.25)';
    ctx.beginPath();
    ctx.ellipse(carX + 30, carY + 29, 36, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = isReversing ? '#dc2626' : '#2563eb';
    ctx.beginPath();
    ctx.roundRect(carX, carY, 65, 23, 7);
    ctx.fill();

    // Roof
    ctx.fillStyle = isReversing ? '#b91c1c' : '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(carX + 13, carY - 15, 39, 18, 6);
    ctx.fill();

    // Windows
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(carX + 17, carY - 12, 13, 10);
    ctx.fillRect(carX + 34, carY - 12, 13, 10);

    // Headlight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(carX + 61, carY + 8, 5, 7);

    // Wheels
    [carX + 14, carX + 51].forEach((wheelX) => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wheelX, carY + 24, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wheelX, carY + 24, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // Current velocity label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      `v = ${formatNumber(currentVelocity)} m/s`,
      carX + 32,
      105
    );

    // Direction label
    ctx.font = '12px sans-serif';
    ctx.fillStyle = isReversing ? '#dc2626' : '#2563eb';

    ctx.fillText(
      isReversing ? '← বিপরীত দিকে' : 'সামনের দিকে →',
      carX + 32,
      122
    );

    // Turning point marker
    if (hasDirectionChange && turningDisplacement !== null) {
      const turningX =
        trackStart + ((turningDisplacement - minS) / range) * trackWidth;

      ctx.fillStyle = '#dc2626';

      ctx.beginPath();
      ctx.arc(turningX, 165, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '11px sans-serif';
      ctx.fillText('Turning Point', turningX, 145);
    }
  }, [
    u,
    a,
    maxTime,
    currentTime,
    currentDisplacement,
    currentVelocity,
    isReversing,
    hasDirectionChange,
    turningDisplacement,
    finalDisplacement,
  ]);

  // ----------------------------------------------------------
  // GRAPH DATA
  // ----------------------------------------------------------

  const graphData = useMemo<GraphPoint[]>(() => {
    return Array.from({ length: 101 }, (_, index) => {
      const t = (maxTime / 100) * index;

      return {
        t,
        position: displacementAt(u, a, t),
        velocity: velocityAt(u, a, t),
        acceleration: a,
      };
    });
  }, [u, a, maxTime]);

  const graphConfig = useMemo(() => {
    const values = graphData.map((item) => item[graphType]);

    const min = Math.min(0, ...values);
    const max = Math.max(0, ...values);

    const padding = Math.max((max - min) * 0.12, 1);

    return {
      min: min - padding,
      max: max + padding,
    };
  }, [graphData, graphType]);

  const graphX = (t: number) => {
    return 35 + (t / maxTime) * 335;
  };

  const graphY = (value: number) => {
    const { min, max } = graphConfig;

    return 130 - ((value - min) / (max - min)) * 105;
  };

  const currentGraphValue =
    graphType === 'position'
      ? currentDisplacement
      : graphType === 'velocity'
        ? currentVelocity
        : currentAcceleration;

  const graphPoints = useMemo(() => {
    const points = graphData.filter(
      (item) => item.t < currentTime - EPSILON
    );

    points.push({
      t: currentTime,
      position: currentDisplacement,
      velocity: currentVelocity,
      acceleration: currentAcceleration,
    });

    return points
      .map((item) => {
        const value = item[graphType];

        return `${graphX(item.t)},${graphY(value)}`;
      })
      .join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    graphData,
    currentTime,
    currentDisplacement,
    currentVelocity,
    currentAcceleration,
    graphType,
    graphConfig,
    maxTime,
  ]);

  const graphTitle: Record<GraphType, string> = {
    position: 'অবস্থান-সময় (s-t) Graph',
    velocity: 'বেগ-সময় (v-t) Graph',
    acceleration: 'ত্বরণ-সময় (a-t) Graph',
  };

  const graphUnit: Record<GraphType, string> = {
    position: 'm',
    velocity: 'm/s',
    acceleration: 'm/s²',
  };

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  const applyPreset = (preset: Preset) => {
    resetSimulation();

    setU(preset.u);
    setA(preset.a);
    setMaxTime(preset.time);
  };

  const handleParameterChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    resetSimulation();
    setter(value);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (currentTime >= maxTime - EPSILON) {
      currentTimeRef.current = 0;
      setCurrentTime(0);
    }

    setIsPlaying(true);
  };

  const handleTimelineChange = (value: number) => {
    stopAnimation();

    currentTimeRef.current = value;

    setCurrentTime(value);
    setIsPlaying(false);
  };

  const restoreDefaults = () => {
    resetSimulation();

    setU(DEFAULTS.u);
    setA(DEFAULTS.a);
    setMaxTime(DEFAULTS.time);

    setPlaybackSpeed(1);
    setGraphType('velocity');
  };

  const zeroY = graphY(0);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE PHYSICS LAB
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            সমত্বরণে গতির পরীক্ষাগার
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            প্যারামিটার পরিবর্তন করে গতির বাস্তব আচরণ পর্যবেক্ষণ করো।
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live Physics Engine
        </div>
      </div>

      {/* PRESETS */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />

          <h3 className="font-bold text-slate-800 text-sm">
            দ্রুত পরীক্ষার জন্য Scenario
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN SIMULATION */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <CarFront className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              2D Motion Visualization
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}

              {isPlaying ? 'Pause' : currentTime > 0 ? 'Resume' : 'Play'}
            </button>

            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <canvas
            ref={canvasRef}
            width={1000}
            height={260}
            className="w-full h-auto block"
            role="img"
            aria-label="গাড়ির গতির 2D simulation"
          />
        </div>

        {/* Timeline */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Simulation Timeline</span>

            <span>
              {formatNumber(currentTime)} / {formatNumber(maxTime)} s
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={maxTime}
            step={0.01}
            value={currentTime}
            onChange={(e) => handleTimelineChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />

          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Playback Speed */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Gauge className="w-4 h-4 text-slate-500" />

          <span className="text-xs text-slate-600 font-semibold">
            Playback Speed:
          </span>

          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                playbackSpeed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </section>

      {/* LIVE TELEMETRY */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'অতিবাহিত সময়',
            value: formatNumber(currentTime),
            unit: 's',
            icon: Clock,
          },
          {
            label: 'বর্তমান বেগ',
            value: formatNumber(currentVelocity),
            unit: 'm/s',
            icon: Gauge,
          },
          {
            label: 'তাৎক্ষণিক দ্রুতি',
            value: formatNumber(currentSpeed),
            unit: 'm/s',
            icon: Activity,
          },
          {
            label: 'সরণ',
            value: formatNumber(currentDisplacement),
            unit: 'm',
            icon: Route,
          },
          {
            label: 'মোট দূরত্ব',
            value: formatNumber(currentDistance),
            unit: 'm',
            icon: Ruler,
          },
          {
            label: 'ত্বরণ',
            value: formatNumber(currentAcceleration),
            unit: 'm/s²',
            icon: Zap,
          },
          {
            label: 'গড় বেগ',
            value: formatNumber(averageVelocityAt(u, a, currentTime)),
            unit: 'm/s',
            icon: TrendingUp,
          },
          {
            label: 'গড় দ্রুতি',
            value: formatNumber(averageSpeedAt(u, a, currentTime)),
            unit: 'm/s',
            icon: Gauge,
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

              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 break-all">
                {item.value}

                <span className="text-xs text-slate-500 ml-1">
                  {item.unit}
                </span>
              </p>
            </div>
          );
        })}
      </section>

      {/* MOTION STATUS */}
      <div
        className={`rounded-xl p-4 border text-sm font-semibold ${
          isStopped
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : isSpeedingUp
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : isSlowingDown
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeftRight className="w-4 h-4" />
          Motion Analysis
        </div>

        {isStopped
          ? 'গাড়িটির তাৎক্ষণিক বেগ শূন্য।'
          : isSpeedingUp
            ? 'গাড়িটির দ্রুতি বৃদ্ধি পাচ্ছে।'
            : isSlowingDown
              ? 'গাড়িটির দ্রুতি কমছে।'
              : isReversing
                ? 'গাড়িটি ঋণাত্মক দিকে চলছে।'
                : 'গাড়িটি ধনাত্মক দিকে চলছে।'}

        <p className="font-normal mt-1">
          {isStopped
            ? 'এই মুহূর্তে গাড়িটি স্থির। তবে ত্বরণ থাকলে পরবর্তী মুহূর্তে চলতে পারে।'
            : `গতির দিক: ${isReversing ? 'ঋণাত্মক' : 'ধনাত্মক'} | ${
                isSpeedingUp
                  ? 'দ্রুতি বাড়ছে'
                  : isSlowingDown
                    ? 'দ্রুতি কমছে'
                    : 'দ্রুতি অপরিবর্তিত'
              }`}
        </p>
      </div>

      {/* TURNING POINT */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-purple-600" />

          <h3 className="font-bold text-slate-900">
            Direction Change Analysis
          </h3>
        </div>

        {hasDirectionChange && turningTime !== null ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-purple-600">
                দিক পরিবর্তনের সময়
              </p>

              <p className="text-xl font-bold text-purple-800 mt-1">
                {formatNumber(turningTime)} s
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600">
                Turning Point Displacement
              </p>

              <p className="text-xl font-bold text-blue-800 mt-1">
                {formatNumber(turningDisplacement ?? 0)} m
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600">
                Turning Point Velocity
              </p>

              <p className="text-xl font-bold text-emerald-800 mt-1">
                0.00 m/s
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            নির্বাচিত সময়ের মধ্যে গাড়ির গতির দিক পরিবর্তন হচ্ছে না।
          </p>
        )}
      </section>

      {/* CONTROL PANEL + GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PARAMETERS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              Physics Control Panel
            </h3>
          </div>

          <div className="space-y-6">
            {/* Initial Velocity */}
            <div>
              <div className="flex justify-between gap-2 text-sm mb-2">
                <label className="font-semibold text-slate-700">
                  আদিবেগ (Initial Velocity)
                </label>

                <span className="font-bold text-blue-600">{u} m/s</span>
              </div>

              <input
                type="range"
                min={-30}
                max={30}
                step={1}
                value={u}
                onChange={(e) =>
                  handleParameterChange(setU, Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>-30 m/s</span>
                <span>0</span>
                <span>+30 m/s</span>
              </div>
            </div>

            {/* Acceleration */}
            <div>
              <div className="flex justify-between gap-2 text-sm mb-2">
                <label className="font-semibold text-slate-700">
                  ত্বরণ (Acceleration)
                </label>

                <span
                  className={`font-bold ${
                    a < 0 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {a} m/s²
                </span>
              </div>

              <input
                type="range"
                min={-10}
                max={10}
                step={0.5}
                value={a}
                onChange={(e) =>
                  handleParameterChange(setA, Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>-10</span>
                <span>0</span>
                <span>+10</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between gap-2 text-sm mb-2">
                <label className="font-semibold text-slate-700">
                  মোট সময় (Duration)
                </label>

                <span className="font-bold text-blue-600">{maxTime} s</span>
              </div>

              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={maxTime}
                onChange={(e) =>
                  handleParameterChange(setMaxTime, Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2 s</span>
                <span>20 s</span>
              </div>
            </div>

            {/* Defaults */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={restoreDefaults}
                className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                Default Parameters
              </button>
            </div>
          </div>
        </section>

        {/* GRAPH */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">Live Motion Graph</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(
              [
                ['position', 's-t Graph'],
                ['velocity', 'v-t Graph'],
                ['acceleration', 'a-t Graph'],
              ] as const
            ).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setGraphType(type)}
                className={`px-3 py-2 rounded-lg text-xs font-bold ${
                  graphType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-2">
            {graphTitle[graphType]}
          </p>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-2">
            <svg
              viewBox="0 0 390 155"
              className="w-full h-auto"
              role="img"
              aria-label={graphTitle[graphType]}
            >
              {/* Grid */}
              {[25, 50, 75, 100, 125].map((y) => (
                <line
                  key={y}
                  x1="35"
                  y1={y}
                  x2="370"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Y Axis */}
              <line
                x1="35"
                y1="10"
                x2="35"
                y2="130"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* X Axis */}
              <line
                x1="35"
                y1="130"
                x2="370"
                y2="130"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Zero Reference */}
              {graphConfig.min < 0 && graphConfig.max > 0 && (
                <line
                  x1="35"
                  y1={zeroY}
                  x2="370"
                  y2={zeroY}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                />
              )}

              {/* Graph */}
              <polyline
                points={graphPoints}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Current time vertical guide */}
              <line
                x1={graphX(currentTime)}
                y1="10"
                x2={graphX(currentTime)}
                y2="130"
                stroke="#2563eb"
                strokeDasharray="3 4"
                opacity="0.35"
              />

              {/* Current Point */}
              <circle
                cx={graphX(currentTime)}
                cy={graphY(currentGraphValue)}
                r="4.5"
                fill="#1d4ed8"
                stroke="white"
                strokeWidth="2"
              />

              <text x="8" y="15" fontSize="10" fill="#64748b">
                {graphUnit[graphType]}
              </text>

              <text x="355" y="148" fontSize="10" fill="#64748b">
                t(s)
              </text>

              <text x="30" y="143" fontSize="9" fill="#64748b">
                0
              </text>

              <text x="335" y="143" fontSize="9" fill="#64748b">
                {maxTime}
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
            <span>
              Current: {formatNumber(currentGraphValue)} {graphUnit[graphType]}
            </span>

            <span>Time: {formatNumber(currentTime)} s</span>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            নীল রেখা বর্তমান সময় পর্যন্ত গ্রাফের পরিবর্তন দেখায়।
          </p>
        </section>
      </div>

      {/* PHYSICS FORMULA CALCULATOR */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-blue-600" />

          <h3 className="font-bold text-slate-900">
            Step-by-Step Physics Calculator
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1 Velocity */}
          <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
            <p className="text-xs text-blue-700 font-bold mb-3">
              ১. শেষবেগ নির্ণয়
            </p>

            <FormulaBox formula={'v = u + at'} />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`v = ${u} + (${a}) \\times ${maxTime}`}
              />

              <div className="border-t border-slate-100 pt-2">
                <p className="font-bold text-blue-700">
                  উত্তর: {formatNumber(finalVelocity)} m/s
                </p>
              </div>
            </div>
          </div>

          {/* 2 Displacement */}
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4">
            <p className="text-xs text-emerald-700 font-bold mb-3">
              ২. সরণ নির্ণয়
            </p>

            <FormulaBox formula={'s = ut + \\frac{1}{2}at^2'} />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`s = (${u} \\times ${maxTime}) + \\frac{1}{2}(${a})(${maxTime})^2`}
              />

              <div className="border-t border-slate-100 pt-2">
                <p className="font-bold text-emerald-700">
                  উত্তর: {formatNumber(finalDisplacement)} m
                </p>
              </div>
            </div>
          </div>

          {/* 3 Acceleration */}
          <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-4">
            <p className="text-xs text-amber-700 font-bold mb-3">
              ৩. ত্বরণ যাচাই
            </p>

            <FormulaBox formula={'a = \\frac{v-u}{t}'} />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`a = \\frac{${formatNumber(finalVelocity)}-(${u})}{${maxTime}}`}
              />

              <p className="font-bold text-amber-700 border-t border-slate-100 pt-2">
                উত্তর: {formatNumber(a)} m/s²
              </p>
            </div>
          </div>

          {/* 4 Distance */}
          <div className="rounded-xl bg-purple-50/60 border border-purple-100 p-4">
            <p className="text-xs text-purple-700 font-bold mb-3">
              ৪. মোট অতিক্রান্ত দূরত্ব
            </p>

            <p className="text-sm text-slate-700">
              গতির দিক পরিবর্তন হলে সরণ ও মোট অতিক্রান্ত দূরত্ব আলাদা হয়।
            </p>

            <div className="bg-white rounded-lg p-3 mt-3">
              <p className="text-xs text-slate-500 mb-2">Total Distance</p>

              <p className="text-xl font-bold text-purple-700">
                {formatNumber(totalDistance)} m
              </p>
            </div>
          </div>

          {/* 5 Average Velocity */}
          <div className="rounded-xl bg-cyan-50/60 border border-cyan-100 p-4">
            <p className="text-xs text-cyan-700 font-bold mb-3">
              ৫. গড় বেগ নির্ণয়
            </p>

            <FormulaBox
              formula={'v_{avg} = \\frac{\\text{Displacement}}{t}'}
            />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`v_{avg} = \\frac{${formatNumber(finalDisplacement)}}{${maxTime}}`}
              />

              <p className="font-bold text-cyan-700 border-t border-slate-100 pt-2">
                উত্তর: {formatNumber(averageVelocity)} m/s
              </p>
            </div>
          </div>

          {/* 6 Average Speed */}
          <div className="rounded-xl bg-pink-50/60 border border-pink-100 p-4">
            <p className="text-xs text-pink-700 font-bold mb-3">
              ৬. গড় দ্রুতি নির্ণয়
            </p>

            <FormulaBox
              formula={
                '\\text{Average Speed} = \\frac{\\text{Total Distance}}{\\text{Total Time}}'
              }
            />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`v_{avg} = \\frac{${formatNumber(totalDistance)}}{${maxTime}}`}
              />

              <p className="font-bold text-pink-700 border-t border-slate-100 pt-2">
                উত্তর: {formatNumber(averageSpeed)} m/s
              </p>
            </div>
          </div>

          {/* 7 Third Equation */}
          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4">
            <p className="text-xs text-indigo-700 font-bold mb-3">
              ৭. তৃতীয় গতিসূত্র
            </p>

            <FormulaBox formula={'v^2 = u^2 + 2as'} />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>মান বসিয়ে:</p>

              <FormulaBox
                formula={`v^2 = (${u})^2 + 2(${a})(${formatNumber(finalDisplacement)})`}
              />

              <p className="font-bold text-indigo-700 border-t border-slate-100 pt-2">
                v² = {formatNumber(finalVelocity * finalVelocity)} m²/s²
              </p>

              <p className="text-xs text-slate-500">
                বেগের চিহ্ন নির্ণয়ে প্রথম গতিসূত্র ব্যবহার করতে হবে।
              </p>
            </div>
          </div>

          {/* 8 Instantaneous Speed */}
          <div className="rounded-xl bg-orange-50/60 border border-orange-100 p-4">
            <p className="text-xs text-orange-700 font-bold mb-3">
              ৮. তাৎক্ষণিক দ্রুতি
            </p>

            <FormulaBox formula={'\\text{Speed} = |v|'} />

            <div className="bg-white rounded-lg p-3 mt-3 space-y-2 text-sm">
              <p>বর্তমান বেগ:</p>

              <FormulaBox
                formula={`\\text{Speed} = |${formatNumber(currentVelocity)}|`}
              />

              <p className="font-bold text-orange-700 border-t border-slate-100 pt-2">
                উত্তর: {formatNumber(currentSpeed)} m/s
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL RESULT */}
      <section className="bg-slate-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />

          <h3 className="font-bold">Simulation Final Result</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['Initial Velocity', `${u} m/s`],
            ['Acceleration', `${a} m/s²`],
            ['Final Velocity', `${formatNumber(finalVelocity)} m/s`],
            ['Final Speed', `${formatNumber(finalSpeed)} m/s`],
            ['Displacement', `${formatNumber(finalDisplacement)} m`],
            ['Total Distance', `${formatNumber(totalDistance)} m`],
            ['Average Velocity', `${formatNumber(averageVelocity)} m/s`],
            ['Average Speed', `${formatNumber(averageSpeed)} m/s`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-400">{label}</p>

              <p className="text-xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-700 flex items-start gap-2 text-sm text-slate-300">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />

          <p>
            মনে রাখবে: ঋণাত্মক ত্বরণ মানেই সবসময় বেগ কমা নয়। বেগ ও ত্বরণ একই
            দিকে হলে দ্রুতি বাড়ে এবং বিপরীত দিকে হলে দ্রুতি কমে। বেগ শূন্য হলেও
            ত্বরণ শূন্য হওয়া বাধ্যতামূলক নয়।
          </p>
        </div>
      </section>

      {/* PHYSICS LEARNING NOTE */}
      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-600" />

          <h3 className="font-bold text-blue-900">Physics Learning Notes</h3>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <strong>১. সরণ (Displacement): </strong>
            প্রাথমিক অবস্থান থেকে শেষ অবস্থানের দিকসহ পরিবর্তন।
          </p>

          <p>
            <strong>২. দূরত্ব (Distance): </strong>
            বস্তুটি মোট যতটুকু পথ অতিক্রম করেছে।
          </p>

          <p>
            <strong>৩. বেগ (Velocity): </strong>
            সরণের পরিবর্তনের হার। এটি দিকযুক্ত রাশি।
          </p>

          <p>
            <strong>৪. দ্রুতি (Speed): </strong>
            দূরত্ব অতিক্রমের হার। এটি স্কেলার রাশি।
          </p>

          <p>
            <strong>৫. ত্বরণ (Acceleration): </strong>
            সময়ের সঙ্গে বেগের পরিবর্তনের হার।
          </p>

          <p>
            <strong>৬. v-t Graph: </strong>
            গ্রাফের নিচের signed area সরণ নির্দেশ করে।
          </p>

          <p>
            <strong>৭. a-t Graph: </strong>
            গ্রাফের নিচের signed area বেগের পরিবর্তন নির্দেশ করে।
          </p>

          <p>
            <strong>৮. s-t Graph: </strong>
            গ্রাফের ঢাল তাৎক্ষণিক বেগ নির্দেশ করে।
          </p>
        </div>
      </section>
    </div>
  );
}