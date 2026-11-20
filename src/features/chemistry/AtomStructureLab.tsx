
'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Atom,
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Zap,
  CircleDot,
  FlaskConical,
  Sparkles,
  ChevronRight,
  BookOpen,
  Layers,
  Activity,
} from 'lucide-react';

import FormulaBox from '@/components/common/FormulaBox';

// ============================================
// TYPES
// ============================================

interface ElementInfo {
  z: number;
  symbol: string;
  nameBn: string;
  nameEn: string;
  defaultNeutrons: number;
}

interface ShellInfo {
  name: string;
  electrons: number;
  capacity: number;
}

// ============================================
// ELEMENT DATABASE
// First 18 Elements
// ============================================

const ELEMENTS: ElementInfo[] = [
  { z: 1, symbol: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', defaultNeutrons: 0 },
  { z: 2, symbol: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', defaultNeutrons: 2 },
  { z: 3, symbol: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', defaultNeutrons: 4 },
  { z: 4, symbol: 'Be', nameBn: 'বেরিলিয়াম', nameEn: 'Beryllium', defaultNeutrons: 5 },
  { z: 5, symbol: 'B', nameBn: 'বোরন', nameEn: 'Boron', defaultNeutrons: 6 },
  { z: 6, symbol: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', defaultNeutrons: 6 },
  { z: 7, symbol: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', defaultNeutrons: 7 },
  { z: 8, symbol: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', defaultNeutrons: 8 },
  { z: 9, symbol: 'F', nameBn: 'ফ্লোরিন', nameEn: 'Fluorine', defaultNeutrons: 10 },
  { z: 10, symbol: 'Ne', nameBn: 'নিয়ন', nameEn: 'Neon', defaultNeutrons: 10 },
  { z: 11, symbol: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', defaultNeutrons: 12 },
  { z: 12, symbol: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', defaultNeutrons: 12 },
  { z: 13, symbol: 'Al', nameBn: 'অ্যালুমিনিয়াম', nameEn: 'Aluminium', defaultNeutrons: 14 },
  { z: 14, symbol: 'Si', nameBn: 'সিলিকন', nameEn: 'Silicon', defaultNeutrons: 14 },
  { z: 15, symbol: 'P', nameBn: 'ফসফরাস', nameEn: 'Phosphorus', defaultNeutrons: 16 },
  { z: 16, symbol: 'S', nameBn: 'সালফার', nameEn: 'Sulfur', defaultNeutrons: 16 },
  { z: 17, symbol: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', defaultNeutrons: 18 },
  { z: 18, symbol: 'Ar', nameBn: 'আর্গন', nameEn: 'Argon', defaultNeutrons: 22 },
];

// ============================================
// CONSTANTS
// ============================================

const SHELLS = [
  { name: 'K', capacity: 2 },
  { name: 'L', capacity: 8 },
  { name: 'M', capacity: 8 },
];

const MAX_PROTONS = 18;
const MAX_NEUTRONS = 30;

// ============================================
// ELECTRON CONFIGURATION
// ============================================

function getShellDistribution(electrons: number): ShellInfo[] {
  let remaining = electrons;

  return SHELLS.map((shell) => {
    const count = Math.min(remaining, shell.capacity);
    remaining -= count;

    return {
      ...shell,
      electrons: count,
    };
  });
}

// ============================================
// CANVAS PARTICLE POSITION
// ============================================

function getParticlePosition(index: number, total: number, radius: number) {
  const angle = index * 2.399963;
  const distance = Math.sqrt((index + 0.5) / Math.max(total, 1)) * radius;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AtomStructureLab() {
  // ------------------------------------------
  // STATE
  // ------------------------------------------

  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [isRotating, setIsRotating] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(0);

  // ------------------------------------------
  // COMPUTED VALUES
  // ------------------------------------------

  const electrons = protons;
  const massNumber = protons + neutrons;
  const atomicNumber = protons;

  const currentElement = useMemo(
    () => ELEMENTS.find((el) => el.z === protons),
    [protons]
  );

  const shells = useMemo(
    () => getShellDistribution(electrons),
    [electrons]
  );

  const electronConfiguration = shells
    .filter((shell) => shell.electrons > 0)
    .map((shell) => `${shell.name}${shell.electrons}`)
    .join(' ');

  const valenceElectrons = shells
    .filter((shell) => shell.electrons > 0)
    .at(-1)?.electrons ?? 0;

  const neutronToProtonRatio = (
    neutrons / Math.max(protons, 1)
  ).toFixed(2);

  // ------------------------------------------
  // RESET
  // ------------------------------------------

  const handleReset = useCallback(() => {
    setProtons(6);
    setNeutrons(6);
    setIsRotating(true);
    angleRef.current = 0;
  }, []);

  // ------------------------------------------
  // ELEMENT SELECT
  // ------------------------------------------

  const handleElementSelect = useCallback((element: ElementInfo) => {
    setProtons(element.z);
    setNeutrons(element.defaultNeutrons);
  }, []);

  // ==========================================
  // RESPONSIVE CANVAS BOHR MODEL
  // ==========================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    // ----------------------------------------
    // RESIZE CANVAS
    // ----------------------------------------

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      drawAtom();
    };

    // ----------------------------------------
    // DRAW ATOM
    // ----------------------------------------

    const drawAtom = () => {
      if (!width || !height) return;

      const cx = width / 2;
      const cy = height / 2;

      const minDimension = Math.min(width, height);

      const scale = Math.min(minDimension / 310, 1.3);

      const orbitRadii = [
        43 * scale,
        76 * scale,
        109 * scale,
      ];

      const nucleusRadius = Math.max(17, 25 * scale);

      ctx.clearRect(0, 0, width, height);

      // Background

      const gradient = ctx.createLinearGradient(0, 0, width, height);

      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#172554');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Background grid

      ctx.strokeStyle = 'rgba(148,163,184,0.055)';
      ctx.lineWidth = 1;

      const gridSize = 25;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Atom title

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = 'rgba(226,232,240,0.75)';
      ctx.font = 'bold 11px sans-serif';

      ctx.fillText(
        currentElement
          ? `${currentElement.nameBn} (${currentElement.symbol})`
          : `Atomic Number: ${protons}`,
        cx,
        19
      );

      // --------------------------------------
      // ELECTRON SHELLS
      // --------------------------------------

      shells.forEach((shell, shellIndex) => {
        if (shell.electrons === 0) return;

        const radius = orbitRadii[shellIndex];

        // Orbit

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);

        ctx.strokeStyle = 'rgba(148,163,184,0.40)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';

        ctx.fillText(
          shell.name,
          cx + radius + 10,
          cy - 8
        );

        // Electrons

        for (let i = 0; i < shell.electrons; i++) {
          const speed = (3 - shellIndex) * 0.55;

          const theta =
            (Math.PI * 2 * i) / shell.electrons +
            angleRef.current * speed;

          const ex = cx + radius * Math.cos(theta);
          const ey = cy + radius * Math.sin(theta);

          // Glow

          ctx.beginPath();
          ctx.arc(ex, ey, 10 * scale, 0, Math.PI * 2);

          ctx.fillStyle = 'rgba(56,189,248,0.16)';
          ctx.fill();

          // Electron

          ctx.beginPath();
          ctx.arc(ex, ey, Math.max(3, 4.5 * scale), 0, Math.PI * 2);

          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      });

      // --------------------------------------
      // NUCLEUS GLOW
      // --------------------------------------

      const glow = ctx.createRadialGradient(
        cx,
        cy,
        1,
        cx,
        cy,
        nucleusRadius * 2.2
      );

      glow.addColorStop(0, 'rgba(245,158,11,0.25)');
      glow.addColorStop(1, 'rgba(245,158,11,0)');

      ctx.beginPath();
      ctx.arc(cx, cy, nucleusRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // --------------------------------------
      // NUCLEUS PARTICLES
      // --------------------------------------

      const totalParticles = protons + neutrons;

      const particleRadius = Math.max(
        3.2,
        Math.min(5.2, 30 / Math.sqrt(totalParticles))
      );

      const clusterRadius = nucleusRadius * 0.83;

      for (let i = 0; i < totalParticles; i++) {
        const point = getParticlePosition(
          i,
          totalParticles,
          clusterRadius
        );

        const isProton = i < protons;

        ctx.beginPath();

        ctx.arc(
          cx + point.x,
          cy + point.y,
          particleRadius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = isProton ? '#fb923c' : '#60a5fa';
        ctx.fill();

        ctx.strokeStyle = isProton ? '#fed7aa' : '#bfdbfe';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // --------------------------------------
      // LEGEND
      // --------------------------------------

      const legendY = height - 17;

      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';

      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(width / 2 - 75, legendY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Proton: ${protons}`, width / 2 - 65, legendY);

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(width / 2 + 30, legendY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Neutron: ${neutrons}`, width / 2 + 40, legendY);
    };

    // ----------------------------------------
    // ANIMATION LOOP
    // ----------------------------------------

    const animate = () => {
      if (isRotating) {
        angleRef.current += 0.012;
      }

      drawAtom();

      if (isRotating) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // ----------------------------------------
    // RESIZE OBSERVER
    // ----------------------------------------

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    observer.observe(canvas);

    resizeCanvas();

    if (isRotating) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [protons, neutrons, shells, isRotating, currentElement]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:rounded-3xl sm:p-6 lg:p-7">

        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative flex items-start gap-3 sm:gap-4">

          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 sm:flex">
            <Atom className="h-8 w-8" />
          </div>

          <div className="min-w-0">

            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-700 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              INTERACTIVE ATOMIC LAB
            </span>

            <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl lg:text-3xl">
              পরমাণুর গঠন ও ইলেকট্রন বিন্যাস
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm">
              প্রোটন, নিউট্রন ও ইলেকট্রনের সাহায্যে একটি পরমাণু তৈরি
              করো। পরিবর্তনগুলো 3D-ধাঁচের অ্যানিমেটেড Bohr মডেলে দেখো।
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">

              <span className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold text-amber-800">
                Class 9–10 Chemistry
              </span>

              <span className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600">
                Atomic Structure
              </span>

            </div>

          </div>

        </div>
      </header>

      {/* ======================================
          LIVE STATISTICS
      ====================================== */}

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">

        <StatCard
          label="পারমাণবিক সংখ্যা"
          value={atomicNumber}
          sub="Atomic Number (Z)"
          color="amber"
        />

        <StatCard
          label="প্রোটন"
          value={protons}
          sub="Protons (+)"
          color="orange"
        />

        <StatCard
          label="নিউট্রন"
          value={neutrons}
          sub="Neutrons (0)"
          color="blue"
        />

        <StatCard
          label="ভরসংখ্যা"
          value={massNumber}
          sub="Mass Number (A)"
          color="emerald"
        />

      </section>

      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

        {/* ====================================
            LEFT: ATOM VISUALIZATION
        ==================================== */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">

            <div className="min-w-0">

              <span className="inline-flex rounded-lg bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                BOHR ATOMIC MODEL
              </span>

              <h3 className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                {currentElement
                  ? `${currentElement.nameBn} (${currentElement.symbol})`
                  : `মৌল: Z = ${protons}`}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Interactive Atomic Visualization
              </p>

            </div>

            <button
              type="button"
              onClick={() => setIsRotating((prev) => !prev)}
              aria-label={isRotating ? 'Animation pause' : 'Animation play'}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-amber-700 active:scale-95"
            >
              {isRotating ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}

              {isRotating ? 'Pause' : 'Play'}
            </button>

          </div>

          {/* Canvas */}

          <div className="p-3 sm:p-5">

            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Bohr atomic model with ${protons} protons, ${neutrons} neutrons and ${electrons} electrons`}
                className="block aspect-[5/3] w-full max-h-[420px]"
              />

              <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1.5 text-[9px] font-semibold text-slate-300 backdrop-blur sm:text-[10px]">
                LIVE ATOM VIEW
              </div>

              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1.5 text-[9px] text-slate-300 backdrop-blur">
                <span className={`h-1.5 w-1.5 rounded-full ${isRotating ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`} />
                {isRotating ? 'ANIMATING' : 'PAUSED'}
              </div>

            </div>

            {/* Legend */}

            <div className="mt-4 grid grid-cols-3 gap-2">

              <LegendItem color="bg-orange-500" label="প্রোটন (+)" />

              <LegendItem color="bg-blue-500" label="নিউট্রন (0)" />

              <LegendItem color="bg-sky-400" label="ইলেকট্রন (-)" />

            </div>

          </div>

          {/* Electron Shell Information */}

          <div className="border-t border-slate-100 p-4 sm:p-5">

            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Layers className="h-4 w-4 text-amber-600" />
              ইলেকট্রন বিন্যাস
            </h4>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {shells.map((shell) => (
                <div
                  key={shell.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
                >

                  <p className="text-xs font-bold text-slate-500">
                    {shell.name} Shell
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    {shell.electrons}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Max {shell.capacity}
                  </p>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${(shell.electrons / shell.capacity) * 100}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>

            <div className="mt-3 rounded-xl bg-amber-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">

                <span className="text-xs font-semibold text-amber-800">
                  সংক্ষিপ্ত ইলেকট্রন বিন্যাস
                </span>

                <span className="font-mono text-sm font-extrabold text-amber-900">
                  {electronConfiguration}
                </span>

              </div>
            </div>

          </div>

          {/* Element Presets */}

          <div className="border-t border-slate-100 p-4 sm:p-5">

            <div className="flex items-center justify-between gap-2">

              <h4 className="text-sm font-bold text-slate-900">
                দ্রুত মৌল নির্বাচন
              </h4>

              <span className="text-[10px] text-slate-400">
                1–18 Elements
              </span>

            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">

              {ELEMENTS.map((element) => {
                const active = protons === element.z;

                return (
                  <button
                    key={element.z}
                    type="button"
                    onClick={() => handleElementSelect(element)}
                    aria-pressed={active}
                    title={`${element.nameBn} - ${element.nameEn}`}
                    className={`
                      min-w-0 rounded-xl border p-2.5 text-center transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                      ${
                        active
                          ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                      }
                    `}
                  >

                    <span className="block text-base font-extrabold">
                      {element.symbol}
                    </span>

                    <span className={`mt-1 block truncate text-[9px] font-semibold ${active ? 'text-amber-50' : 'text-slate-500'}`}>
                      Z = {element.z}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>

        </section>

        {/* ====================================
            RIGHT: ATOM BUILDER
        ==================================== */}

        <div className="min-w-0 space-y-4 lg:col-span-5">

          {/* Atom Builder */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-amber-600" />

                <h3 className="text-sm font-bold text-slate-900">
                  Atom Builder
                </h3>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-bold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

            </div>

            <div className="mt-5 space-y-6">

              {/* Proton Slider */}

              <RangeControl
                label="প্রোটন সংখ্যা"
                sublabel="Atomic Number (Z)"
                value={protons}
                min={1}
                max={MAX_PROTONS}
                color="amber"
                onChange={(value) => setProtons(value)}
              />

              {/* Neutron Slider */}

              <RangeControl
                label="নিউট্রন সংখ্যা"
                sublabel="Neutron Number (N)"
                value={neutrons}
                min={0}
                max={MAX_NEUTRONS}
                color="blue"
                onChange={(value) => setNeutrons(value)}
              />

            </div>

            {/* Live Result */}

            <div className="mt-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-700" />

                <h4 className="text-xs font-bold text-amber-900">
                  Live Atom Information
                </h4>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-[10px] text-slate-500">
                    Element
                  </p>

                  <p className="mt-1 break-words text-sm font-extrabold text-slate-900">
                    {currentElement?.nameBn ?? 'অজানা মৌল'}
                  </p>
                </div>

                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-[10px] text-slate-500">
                    Symbol
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {currentElement?.symbol ?? '—'}
                  </p>
                </div>

                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-[10px] text-slate-500">
                    Electrons
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {electrons}
                  </p>
                </div>

                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-[10px] text-slate-500">
                    Valence Electrons
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {valenceElectrons}
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* Formula Panel */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">

              <FlaskConical className="h-5 w-5 text-amber-600" />

              <h3 className="text-sm font-bold text-slate-900">
                গুরুত্বপূর্ণ সূত্র ও হিসাব
              </h3>

            </div>

            <div className="mt-4 space-y-4">

              {/* Atomic Number */}

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  ১. পারমাণবিক সংখ্যা
                </p>

                <FormulaBox
                  formula={`Z = P = ${protons}`}
                />

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  নিরপেক্ষ পরমাণুতে প্রোটন ও ইলেকট্রন সংখ্যা সমান।
                </p>
              </div>

              {/* Mass Number */}

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  ২. ভরসংখ্যা
                </p>

                <FormulaBox
                  formula={`A = P + N = ${protons} + ${neutrons} = ${massNumber}`}
                />

              </div>

              {/* Electron Distribution */}

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  ৩. শক্তিস্তরের ইলেকট্রন ধারণক্ষমতা
                </p>

                <FormulaBox
                  formula={String.raw`2n^2`}
                />

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  n = প্রধান শক্তিস্তরের ক্রমিক সংখ্যা।
                </p>

              </div>

              {/* Neutron Proton Ratio */}

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">
                  ৪. নিউট্রন ও প্রোটনের অনুপাত
                </p>

                <FormulaBox
                  formula={`N/P = ${neutrons}/${protons} = ${neutronToProtonRatio}`}
                />

              </div>

            </div>

          </section>

          {/* Learning Note */}

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4">

            <div className="flex items-start gap-3">

              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>

                <h4 className="text-xs font-bold text-blue-900">
                  শেখার জন্য গুরুত্বপূর্ণ তথ্য
                </h4>

                <p className="mt-2 text-xs leading-6 text-blue-800">
                  পরমাণুর নিউক্লিয়াসে প্রোটন ও নিউট্রন থাকে। ইলেকট্রন
                  নিউক্লিয়াসের চারপাশের শক্তিস্তরে অবস্থান করে। একটি
                  নিরপেক্ষ পরমাণুতে প্রোটন ও ইলেকট্রনের সংখ্যা সমান।
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

      {/* ======================================
          BOTTOM LEARNING SECTION
      ====================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600" />

          <h3 className="text-sm font-bold text-slate-900">
            পরমাণুর গঠন সম্পর্কে মনে রাখবে
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <LearningCard
            number="01"
            title="প্রোটন"
            description="ধনাত্মক চার্জযুক্ত কণিকা। নিউক্লিয়াসে অবস্থান করে।"
            color="orange"
          />

          <LearningCard
            number="02"
            title="নিউট্রন"
            description="চার্জ নিরপেক্ষ কণিকা। নিউক্লিয়াসে অবস্থান করে।"
            color="blue"
          />

          <LearningCard
            number="03"
            title="ইলেকট্রন"
            description="ঋণাত্মক চার্জযুক্ত কণিকা। নিউক্লিয়াসের বাইরের শক্তিস্তরে থাকে।"
            color="emerald"
          />

        </div>

      </section>

      {/* Disclaimer */}

      <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3.5">

        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

        <p className="text-[10px] leading-5 text-slate-500">
          শিক্ষামূলক মডেল: এটি Bohr মডেলের সরলীকৃত দ্বিমাত্রিক উপস্থাপনা।
          প্রকৃত পরমাণুতে ইলেকট্রনের অবস্থান ও গতি এভাবে নির্দিষ্ট
          বৃত্তাকার কক্ষপথে সীমাবদ্ধ নয়। নিউক্লিয়াসের কণিকাগুলোর
          অবস্থানও চিত্রায়নের সুবিধার্থে দেখানো হয়েছে।
        </p>

      </div>

    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  color: 'amber' | 'orange' | 'blue' | 'emerald';
}) {
  const themes = {
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  };

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">

      <div className="flex items-center justify-between gap-1">

        <p className="min-w-0 truncate text-[10px] font-semibold text-slate-500 sm:text-xs">
          {label}
        </p>

        <span className={`rounded-lg border p-1.5 text-[9px] font-bold ${themes[color]}`}>
          {sub.split(' ')[0]}
        </span>

      </div>

      <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 truncate text-[9px] text-slate-400 sm:text-[10px]">
        {sub}
      </p>

    </div>
  );
}

// ============================================
// RANGE CONTROL
// ============================================

function RangeControl({
  label,
  sublabel,
  value,
  min,
  max,
  color,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  color: 'amber' | 'blue';
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  const accent = color === 'amber' ? 'accent-amber-500' : 'accent-blue-500';

  const badge = color === 'amber'
    ? 'bg-amber-100 text-amber-800'
    : 'bg-blue-100 text-blue-800';

  return (
    <div>

      <div className="mb-3 flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm font-bold text-slate-800">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {sublabel}
          </p>

        </div>

        <span className={`flex h-10 min-w-12 items-center justify-center rounded-xl px-3 text-base font-extrabold ${badge}`}>
          {value}
        </span>

      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 ${accent}`}
        style={{
          background: `linear-gradient(to right, ${color === 'amber' ? '#f59e0b' : '#3b82f6'} ${percentage}%, #e2e8f0 ${percentage}%)`,
        }}
      />

      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>

    </div>
  );
}

// ============================================
// LEGEND
// ============================================

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-2 py-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />

      <span className="truncate text-[10px] font-semibold text-slate-600">
        {label}
      </span>
    </div>
  );
}

// ============================================
// LEARNING CARD
// ============================================

function LearningCard({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: 'orange' | 'blue' | 'emerald';
}) {
  const themes = {
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5">

      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${themes[color]}`}>
        {number}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-bold text-slate-900">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}
