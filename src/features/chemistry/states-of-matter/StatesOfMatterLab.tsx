
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Flame,
  Info,
  RotateCcw,
  Snowflake,
  Thermometer,
  Wind,
  Atom,
  Gauge,
  FlaskConical,
  ArrowRightLeft,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type MatterState = 'solid' | 'liquid' | 'gas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

interface GasOption {
  id: string;
  formula: string;
  nameBn: string;
  molarMass: number;
  color: string;
}

interface StateMeta {
  label: string;
  badge: string;
  force: string;
  kinetic: string;
  distance: string;
  color: string;
  description: string;
}

// ============================================
// CONSTANTS
// ============================================

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

const MIN_TEMP = -20;
const MAX_TEMP = 150;
const DEFAULT_TEMP = 25;

const PARTICLE_RADIUS = 7;
const PARTICLE_COLS = 9;
const PARTICLE_ROWS = 6;

const GAS_OPTIONS: GasOption[] = [
  {
    id: 'h2',
    formula: 'H₂',
    nameBn: 'হাইড্রোজেন',
    molarMass: 2,
    color: '#0284c7',
  },
  {
    id: 'ch4',
    formula: 'CH₄',
    nameBn: 'মিথেন',
    molarMass: 16,
    color: '#059669',
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    nameBn: 'অ্যামোনিয়া',
    molarMass: 17,
    color: '#7c3aed',
  },
  {
    id: 'hcl',
    formula: 'HCl',
    nameBn: 'হাইড্রোজেন ক্লোরাইড',
    molarMass: 36.5,
    color: '#e11d48',
  },
  {
    id: 'co2',
    formula: 'CO₂',
    nameBn: 'কার্বন ডাই-অক্সাইড',
    molarMass: 44,
    color: '#d97706',
  },
  {
    id: 'so2',
    formula: 'SO₂',
    nameBn: 'সালফার ডাই-অক্সাইড',
    molarMass: 64,
    color: '#475569',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// পানির অবস্থার পরিবর্তন: স্বাভাবিক বায়ুচাপে
function getMatterState(temp: number): MatterState {
  if (temp < 0) return 'solid';
  if (temp <= 100) return 'liquid';
  return 'gas';
}

function getStateMeta(state: MatterState): StateMeta {
  const states: Record<MatterState, StateMeta> = {
    solid: {
      label: 'কঠিন অবস্থা (বরফ)',
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      force: 'সর্বোচ্চ — অত্যন্ত দৃঢ়',
      kinetic: 'কম — নির্দিষ্ট অবস্থানে কম্পন',
      distance: 'সবচেয়ে কম',
      color: '#0284c7',
      description:
        'কণাগুলো খুব কাছাকাছি সুশৃঙ্খলভাবে অবস্থান করে। তারা নির্দিষ্ট অবস্থানে শুধু কম্পন করে।',
    },

    liquid: {
      label: 'তরল অবস্থা (পানি)',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      force: 'মাঝারি — কঠিনের চেয়ে কম',
      kinetic: 'মাঝারি — কণাগুলো স্থান পরিবর্তন করে',
      distance: 'মাঝারি',
      color: '#2563eb',
      description:
        'কণাগুলোর মধ্যে কিছুটা দূরত্ব থাকে। তারা একে অপরের পাশ দিয়ে চলাচল করতে পারে।',
    },

    gas: {
      label: 'গ্যাসীয় অবস্থা (জলীয় বাষ্প)',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      force: 'অত্যন্ত দুর্বল',
      kinetic: 'বেশি — দ্রুত ও স্বাধীনভাবে চলাচল',
      distance: 'সবচেয়ে বেশি',
      color: '#e11d48',
      description:
        'কণাগুলোর মধ্যে দূরত্ব অনেক বেশি। তারা দ্রুত ও এলোমেলোভাবে সবদিকে চলাচল করে।',
    },
  };

  return states[state];
}

// ============================================
// PARTICLE INITIALIZATION
// ============================================

function createParticles(): Particle[] {
  const particles: Particle[] = [];

  const spacingX = 30;
  const spacingY = 28;

  const startX =
    (CANVAS_WIDTH - (PARTICLE_COLS - 1) * spacingX) / 2;

  const startY =
    CANVAS_HEIGHT - 35 - (PARTICLE_ROWS - 1) * spacingY;

  for (let row = 0; row < PARTICLE_ROWS; row++) {
    for (let col = 0; col < PARTICLE_COLS; col++) {
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        baseX: x,
        baseY: y,
      });
    }
  }

  return particles;
}

// ============================================
// PARTICLE PHYSICS
// ============================================

function updateSolidParticle(p: Particle, temp: number) {
  const vibration = 0.5 + ((temp - MIN_TEMP) / 170) * 2;

  p.x +=
    (p.baseX - p.x) * 0.18 +
    (Math.random() - 0.5) * vibration;

  p.y +=
    (p.baseY - p.y) * 0.18 +
    (Math.random() - 0.5) * vibration;
}

function updateLiquidParticle(p: Particle, temp: number) {
  const surfaceY = CANVAS_HEIGHT * 0.47;
  const bottom = CANVAS_HEIGHT - PARTICLE_RADIUS - 8;

  const speedFactor = 0.8 + (temp / 100) * 1.2;

  p.vx += (Math.random() - 0.5) * 0.3;
  p.vy += (Math.random() - 0.5) * 0.3 + 0.025;

  const maxSpeed = 1.5 * speedFactor;

  p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
  p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));

  p.x += p.vx;
  p.y += p.vy;

  // Left boundary
  if (p.x < PARTICLE_RADIUS + 8) {
    p.x = PARTICLE_RADIUS + 8;
    p.vx = Math.abs(p.vx);
  }

  // Right boundary
  if (p.x > CANVAS_WIDTH - PARTICLE_RADIUS - 8) {
    p.x = CANVAS_WIDTH - PARTICLE_RADIUS - 8;
    p.vx = -Math.abs(p.vx);
  }

  // Liquid surface
  if (p.y < surfaceY) {
    p.y = surfaceY;
    p.vy = Math.abs(p.vy) * 0.6;
  }

  // Container bottom
  if (p.y > bottom) {
    p.y = bottom;
    p.vy = -Math.abs(p.vy) * 0.65;
  }
}

function updateGasParticle(p: Particle, temp: number) {
  const maxSpeed = Math.min(
    7,
    3 + ((temp - 100) / 50) * 2
  );

  // Maintain random motion with controlled speed
  if (Math.random() < 0.025) {
    p.vx = (Math.random() - 0.5) * 2;
    p.vy = (Math.random() - 0.5) * 2;
  }

  const magnitude = Math.hypot(p.vx, p.vy) || 1;

  p.vx = (p.vx / magnitude) * maxSpeed;
  p.vy = (p.vy / magnitude) * maxSpeed;

  p.x += p.vx;
  p.y += p.vy;

  const left = PARTICLE_RADIUS + 5;
  const right = CANVAS_WIDTH - PARTICLE_RADIUS - 5;
  const top = PARTICLE_RADIUS + 5;
  const bottom = CANVAS_HEIGHT - PARTICLE_RADIUS - 5;

  if (p.x <= left || p.x >= right) {
    p.vx *= -1;
    p.x = Math.max(left, Math.min(right, p.x));
  }

  if (p.y <= top || p.y >= bottom) {
    p.vy *= -1;
    p.y = Math.max(top, Math.min(bottom, p.y));
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function StatesOfMatterLab() {
  const [temperature, setTemperature] = useState(DEFAULT_TEMP);

  const [gasLeftId, setGasLeftId] = useState('nh3');
  const [gasRightId, setGasRightId] = useState('hcl');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempRef = useRef(temperature);

  // Keep animation temperature synchronized
  useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  // ==========================================
  // DERIVED DATA
  // ==========================================

  const currentState = getMatterState(temperature);

  const stateMeta = getStateMeta(currentState);

  const gasLeft = useMemo(
    () => GAS_OPTIONS.find((g) => g.id === gasLeftId) ?? GAS_OPTIONS[2],
    [gasLeftId]
  );

  const gasRight = useMemo(
    () => GAS_OPTIONS.find((g) => g.id === gasRightId) ?? GAS_OPTIONS[3],
    [gasRightId]
  );

  // Graham's Law:
  // r1 / r2 = sqrt(M2 / M1)

  const diffusion = useMemo(() => {
    const rateLeft = 1 / Math.sqrt(gasLeft.molarMass);
    const rateRight = 1 / Math.sqrt(gasRight.molarMass);

    const totalRate = rateLeft + rateRight;

    const leftDistance = (rateLeft / totalRate) * 100;
    const rightDistance = 100 - leftDistance;

    const rateRatio = rateLeft / rateRight;

    return {
      rateLeft,
      rateRight,
      leftDistance,
      rightDistance,
      rateRatio,
      fasterGas:
        gasLeft.molarMass < gasRight.molarMass
          ? gasLeft
          : gasLeft.molarMass > gasRight.molarMass
            ? gasRight
            : null,
    };
  }, [gasLeft, gasRight]);

  // ==========================================
  // CANVAS ANIMATION
  // ==========================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    const particles = createParticles();

    let animationId = 0;
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const temp = tempRef.current;
      const mode = getMatterState(temp);

      // Background
      const background =
        mode === 'solid'
          ? '#f0f9ff'
          : mode === 'liquid'
            ? '#eff6ff'
            : '#fff1f2';

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      // Container border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // Liquid surface indicator
      if (mode === 'liquid') {
        const surfaceY = height * 0.47;

        ctx.beginPath();
        ctx.moveTo(8, surfaceY);
        ctx.lineTo(width - 8, surfaceY);

        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Update and draw particles
      particles.forEach((p) => {
        if (mode === 'solid') {
          updateSolidParticle(p, temp);
        } else if (mode === 'liquid') {
          updateLiquidParticle(p, temp);
        } else {
          updateGasParticle(p, temp);
        }

        // Particle shadow
        ctx.beginPath();
        ctx.arc(
          p.x + 1,
          p.y + 2,
          PARTICLE_RADIUS,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.fill();

        // Particle body
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          PARTICLE_RADIUS,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = stateMetaColor(mode);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(
          p.x - 2,
          p.y - 2,
          2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      });

      // Animation loop
      animationId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationId);
      } else if (!isRunning) {
        isRunning = true;
        animationId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    animationId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      );
    };
  }, []);

  // ==========================================
  // HELPERS
  // ==========================================

  function stateMetaColor(state: MatterState) {
    if (state === 'solid') return '#0284c7';
    if (state === 'liquid') return '#2563eb';
    return '#e11d48';
  }

  const changeTemperature = (value: number) => {
    setTemperature(
      Math.max(MIN_TEMP, Math.min(MAX_TEMP, value))
    );
  };

  const resetLab = () => {
    setTemperature(DEFAULT_TEMP);
    setGasLeftId('nh3');
    setGasRightId('hcl');
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6 w-full min-w-0">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="min-w-0">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE CHEMISTRY LAB
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3">
            কণার গতিতত্ত্ব ও ব্যাপন হার সিমুলেটর
          </h2>

          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            তাপমাত্রা পরিবর্তন করে পদার্থের অবস্থা, কণার গতি এবং
            দুটি গ্যাসের ব্যাপন হার পর্যবেক্ষণ করো।
          </p>

        </div>

        <button
          type="button"
          onClick={resetLab}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          রিসেট
        </button>

      </div>

      {/* ================================== */}
      {/* SECTION 1: PARTICLE SIMULATION */}
      {/* ================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* PARTICLE CANVAS */}

        <section className="lg:col-span-7 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${stateMeta.badge}`}
            >
              {stateMeta.label}
            </span>

            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <Thermometer className="w-4 h-4 text-rose-500" />
              {temperature}°C
            </div>

          </div>

          {/* Canvas */}

          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">

            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              aria-label={`তাপমাত্রা ${temperature} ডিগ্রি সেলসিয়াসে পদার্থের ${currentState} অবস্থার কণা সিমুলেশন`}
              className="w-full h-auto block"
            />

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-[10px] sm:text-xs font-bold text-slate-500">
              LIVE PARTICLE SIMULATION
            </div>

          </div>

          {/* Temperature Control */}

          <div className="space-y-3">

            <div className="flex items-center justify-between gap-2">

              <label
                htmlFor="matter-temperature"
                className="text-sm font-bold text-slate-800"
              >
                তাপমাত্রা নিয়ন্ত্রণ
              </label>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {temperature}°C
              </span>

            </div>

            <input
              id="matter-temperature"
              type="range"
              min={MIN_TEMP}
              max={MAX_TEMP}
              step={1}
              value={temperature}
              onChange={(e) =>
                changeTemperature(Number(e.target.value))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-slate-500">

              <span className="flex items-center gap-1 text-sky-600">
                <Snowflake className="w-3.5 h-3.5" />
                -20°C
              </span>

              <span className="text-blue-600">0°C</span>

              <span className="text-rose-600">100°C</span>

              <span className="flex items-center gap-1 text-orange-600">
                <Flame className="w-3.5 h-3.5" />
                150°C
              </span>

            </div>

          </div>

          {/* Temperature Presets */}

          <div className="grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() => changeTemperature(-10)}
              className="px-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs sm:text-sm font-bold transition-colors"
            >
              <Snowflake className="w-4 h-4 mx-auto mb-1" />
              কঠিন
              <span className="block text-[10px] opacity-70 mt-0.5">
                -10°C
              </span>
            </button>

            <button
              type="button"
              onClick={() => changeTemperature(30)}
              className="px-2 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs sm:text-sm font-bold transition-colors"
            >
              <Activity className="w-4 h-4 mx-auto mb-1" />
              তরল
              <span className="block text-[10px] opacity-70 mt-0.5">
                30°C
              </span>
            </button>

            <button
              type="button"
              onClick={() => changeTemperature(120)}
              className="px-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-bold transition-colors"
            >
              <Flame className="w-4 h-4 mx-auto mb-1" />
              গ্যাস
              <span className="block text-[10px] opacity-70 mt-0.5">
                120°C
              </span>
            </button>

          </div>

        </section>

        {/* ================================== */}
        {/* PARTICLE ANALYSIS */}
        {/* ================================== */}

        <section className="lg:col-span-5 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">

          <div className="flex items-center gap-2">

            <Atom className="w-5 h-5 text-emerald-600" />

            <h3 className="font-bold text-slate-900">
              কণার গতিতত্ত্ব বিশ্লেষণ
            </h3>

          </div>

          {/* Current state */}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

            <p className="text-xs font-bold text-slate-500">
              বর্তমান অবস্থা
            </p>

            <p
              className="text-lg font-extrabold mt-1"
              style={{ color: stateMeta.color }}
            >
              {stateMeta.label}
            </p>

          </div>

          {/* Force */}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">

            <p className="text-xs font-bold text-slate-500">
              আন্তঃকণা আকর্ষণ বল
            </p>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {stateMeta.force}
            </p>

          </div>

          {/* Kinetic energy */}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">

            <p className="text-xs font-bold text-slate-500">
              কণার গতিশক্তি
            </p>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {stateMeta.kinetic}
            </p>

          </div>

          {/* Distance */}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">

            <p className="text-xs font-bold text-slate-500">
              আন্তঃকণা দূরত্ব
            </p>

            <p className="text-sm font-bold text-slate-900 mt-1">
              {stateMeta.distance}
            </p>

          </div>

          {/* Educational observation */}

          <div className="mt-auto p-4 rounded-xl bg-emerald-50 border border-emerald-200">

            <div className="flex items-center gap-2 mb-2">

              <Info className="w-4 h-4 text-emerald-700 shrink-0" />

              <p className="text-xs font-extrabold text-emerald-800">
                পর্যবেক্ষণ
              </p>

            </div>

            <p className="text-xs text-emerald-950 leading-relaxed">
              {stateMeta.description}
            </p>

          </div>

        </section>

      </div>

      {/* ================================== */}
      {/* SECTION 2: GRAHAM'S LAW */}
      {/* ================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">

        {/* Heading */}

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <Wind className="w-5 h-5 text-emerald-600" />

            <h3 className="text-base font-bold text-slate-900">
              ব্যাপন হার তুলনা ল্যাব
            </h3>

          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            GRAHAM'S LAW
          </span>

        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          দুটি ভিন্ন গ্যাসের আণবিক ভর পরিবর্তন করে তাদের ব্যাপন
          হার এবং মিলন বিন্দুর অবস্থান পর্যবেক্ষণ করো।
        </p>

        {/* Formula */}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">

          <p className="text-xs font-bold text-slate-500">
            গ্রাহামের ব্যাপন সূত্র
          </p>

          <div className="text-lg sm:text-xl font-extrabold text-slate-900">
            r₁ / r₂ = √(M₂ / M₁)
          </div>

          <p className="text-[11px] text-slate-500">
            r = ব্যাপন হার, M = গ্যাসের মোলার ভর (g/mol)
          </p>

        </div>

        {/* Gas selection */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="min-w-0">

            <label
              htmlFor="gas-left"
              className="block text-xs font-bold text-slate-600 mb-2"
            >
              বাম প্রান্তের গ্যাস
            </label>

            <select
              id="gas-left"
              value={gasLeftId}
              onChange={(e) => setGasLeftId(e.target.value)}
              className="w-full min-w-0 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {GAS_OPTIONS.map((gas) => (
                <option key={gas.id} value={gas.id}>
                  {gas.formula} — {gas.nameBn} ({gas.molarMass} g/mol)
                </option>
              ))}
            </select>

          </div>

          <div className="min-w-0">

            <label
              htmlFor="gas-right"
              className="block text-xs font-bold text-slate-600 mb-2"
            >
              ডান প্রান্তের গ্যাস
            </label>

            <select
              id="gas-right"
              value={gasRightId}
              onChange={(e) => setGasRightId(e.target.value)}
              className="w-full min-w-0 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {GAS_OPTIONS.map((gas) => (
                <option key={gas.id} value={gas.id}>
                  {gas.formula} — {gas.nameBn} ({gas.molarMass} g/mol)
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Gas information */}

        <div className="grid grid-cols-2 gap-3">

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">

            <p className="text-xs text-slate-500 font-bold">
              বাম গ্যাসের মোলার ভর
            </p>

            <p
              className="text-lg font-extrabold mt-1"
              style={{ color: gasLeft.color }}
            >
              {gasLeft.molarMass} g/mol
            </p>

          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">

            <p className="text-xs text-slate-500 font-bold">
              ডান গ্যাসের মোলার ভর
            </p>

            <p
              className="text-lg font-extrabold mt-1"
              style={{ color: gasRight.color }}
            >
              {gasRight.molarMass} g/mol
            </p>

          </div>

        </div>

        {/* Glass tube visualization */}

        <div className="space-y-3">

          <div className="flex justify-between items-center gap-2 text-xs sm:text-sm font-bold">

            <span style={{ color: gasLeft.color }}>
              {gasLeft.formula} →
            </span>

            <span className="text-slate-500">
              মিলন বিন্দু
            </span>

            <span style={{ color: gasRight.color }}>
              ← {gasRight.formula}
            </span>

          </div>

          <div className="relative h-14 rounded-full border-2 border-slate-300 bg-slate-100 overflow-hidden flex">

            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${diffusion.leftDistance}%`,
                backgroundColor: gasLeft.color,
                opacity: 0.55,
              }}
            />

            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${diffusion.rightDistance}%`,
                backgroundColor: gasRight.color,
                opacity: 0.55,
              }}
            />

            {/* Meeting marker */}

            <div
              className="absolute top-0 bottom-0 w-1 bg-slate-900 transition-all duration-500"
              style={{
                left: `${diffusion.leftDistance}%`,
                transform: 'translateX(-50%)',
              }}
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-slate-900 transition-all duration-500"
              style={{
                left: `${diffusion.leftDistance}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />

          </div>

          {/* Distance values */}

          <div className="grid grid-cols-2 gap-3">

            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-xs text-slate-500">
                বাম দিকের অতিক্রান্ত দূরত্ব
              </p>

              <p
                className="text-xl font-extrabold mt-1"
                style={{ color: gasLeft.color }}
              >
                {diffusion.leftDistance.toFixed(2)}%
              </p>

            </div>

            <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">

              <p className="text-xs text-slate-500">
                ডান দিকের অতিক্রান্ত দূরত্ব
              </p>

              <p
                className="text-xl font-extrabold mt-1"
                style={{ color: gasRight.color }}
              >
                {diffusion.rightDistance.toFixed(2)}%
              </p>

            </div>

          </div>

        </div>

        {/* Calculation result */}

        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">

          <div className="flex items-center gap-2">

            <Gauge className="w-4 h-4 text-emerald-700" />

            <h4 className="text-sm font-extrabold text-emerald-900">
              পরীক্ষার ফলাফল
            </h4>

          </div>

          <div className="text-sm text-emerald-950 leading-relaxed">

            {gasLeft.molarMass === gasRight.molarMass ? (
              <p>
                উভয় গ্যাসের মোলার ভর সমান হওয়ায় তাদের ব্যাপন
                হারও সমান। তাই তারা ঠিক মাঝখানে মিলিত হবে।
              </p>
            ) : (
              <p>
                <strong>{diffusion.fasterGas?.formula}</strong>
                {' '}গ্যাসের মোলার ভর কম হওয়ায় এর ব্যাপন হার বেশি।
                তাই এটি বেশি দূরত্ব অতিক্রম করবে।
              </p>
            )}

          </div>

          <div className="pt-3 border-t border-emerald-200">

            <p className="text-xs text-emerald-800 font-bold mb-1">
              ব্যাপন হারের অনুপাত
            </p>

            <p className="text-base font-extrabold text-emerald-950">
              {gasLeft.formula} : {gasRight.formula}
              {' = '}
              {diffusion.rateLeft.toFixed(3)}
              {' : '}
              {diffusion.rateRight.toFixed(3)}
            </p>

          </div>

        </div>

        {/* Educational note */}

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-200">

          <FlaskConical className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />

          <p className="text-xs text-blue-950 leading-relaxed">
            <strong>মনে রাখবে:</strong> গ্রাহামের সূত্র অনুযায়ী
            নির্দিষ্ট তাপমাত্রা ও চাপে গ্যাসের ব্যাপন হার তার
            মোলার ভরের বর্গমূলের ব্যস্তানুপাতিক।
            অর্থাৎ হালকা গ্যাস দ্রুত এবং ভারী গ্যাস ধীরে ব্যাপিত হয়।
          </p>

        </div>

      </section>

      {/* ================================== */}
      {/* FOOTER INFORMATION */}
      {/* ================================== */}

      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">

        <ArrowRightLeft className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />

        <p className="text-[11px] text-slate-500 leading-relaxed">
          সিমুলেশনটি শিক্ষামূলক মডেল। প্রকৃত কণার গতিবিধি,
          সংঘর্ষ ও দশার পরিবর্তন আরও জটিল। এখানে পানির
          দশা পরিবর্তন স্বাভাবিক বায়ুচাপের আনুমানিক
          0°C ও 100°C সীমার ভিত্তিতে দেখানো হয়েছে।
        </p>

      </div>

    </div>
  );
}
