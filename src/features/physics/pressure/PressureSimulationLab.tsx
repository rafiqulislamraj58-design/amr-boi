
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Calculator,
  CheckCircle2,
  Droplets,
  Gauge,
  RotateCcw,
  SlidersHorizontal,
  Weight,
  Zap,
} from 'lucide-react';

import FormulaBox from '@/components/common/FormulaBox';

// ======================================================
// TYPES
// ======================================================

type LiquidOption = {
  id: string;
  name: string;
  density: number;
  color: string;
};

type ObjectPreset = {
  name: string;
  density: number;
  color: string;
};

type FloatingStatus = 'floating' | 'neutral' | 'sinking';

// ======================================================
// CONSTANTS
// ======================================================

const GRAVITY = 9.8;

const LIQUIDS: LiquidOption[] = [
  {
    id: 'oil',
    name: 'তেল',
    density: 800,
    color: 'rgba(250, 204, 21, 0.45)',
  },
  {
    id: 'water',
    name: 'পানি',
    density: 1000,
    color: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'glycerin',
    name: 'গ্লিসারিন',
    density: 1260,
    color: 'rgba(167, 139, 250, 0.45)',
  },
  {
    id: 'mercury',
    name: 'পারদ',
    density: 13600,
    color: 'rgba(148, 163, 184, 0.65)',
  },
];

const OBJECT_PRESETS: ObjectPreset[] = [
  {
    name: 'কাঠ',
    density: 600,
    color: '#b45309',
  },
  {
    name: 'বরফ',
    density: 920,
    color: '#38bdf8',
  },
  {
    name: 'অ্যালুমিনিয়াম',
    density: 2700,
    color: '#64748b',
  },
  {
    name: 'লোহা',
    density: 7870,
    color: '#334155',
  },
];

const DEFAULTS = {
  liquidId: 'water',
  objectDensity: 600,
  objectVolume: 0.05,
  depth: 2,
};

// ======================================================
// HELPERS
// ======================================================

const formatNumber = (value: number, decimals = 2) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);

const getObjectColor = (density: number) => {
  const preset = OBJECT_PRESETS.find(
    (item) => item.density === density
  );

  if (preset) return preset.color;

  if (density < 800) return '#b45309';
  if (density < 1500) return '#38bdf8';
  if (density < 3000) return '#64748b';

  return '#334155';
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function PressureSimulationLab() {
  const [liquidId, setLiquidId] = useState(DEFAULTS.liquidId);
  const [objDensity, setObjDensity] = useState(DEFAULTS.objectDensity);
  const [objVolume, setObjVolume] = useState(DEFAULTS.objectVolume);
  const [depthSensor, setDepthSensor] = useState(DEFAULTS.depth);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ====================================================
  // SELECTED LIQUID
  // ====================================================

  const liquid = useMemo(
    () => LIQUIDS.find((item) => item.id === liquidId) ?? LIQUIDS[1],
    [liquidId]
  );

  const objectColor = useMemo(
    () => getObjectColor(objDensity),
    [objDensity]
  );

  // ====================================================
  // PHYSICS CALCULATIONS
  // ====================================================

  const physics = useMemo(() => {
    // Object mass
    const mass = objDensity * objVolume;

    // Object weight
    const weight = mass * GRAVITY;

    // Maximum buoyancy when completely submerged
    const maxBuoyancy =
      liquid.density * objVolume * GRAVITY;

    // Density comparison
    const densityDifference = objDensity - liquid.density;

    const status: FloatingStatus =
      Math.abs(densityDifference) < 0.0001
        ? 'neutral'
        : densityDifference < 0
          ? 'floating'
          : 'sinking';

    // Submerged fraction
    const submergedFraction =
      status === 'floating'
        ? objDensity / liquid.density
        : 1;

    // Actual submerged volume
    const submergedVolume = objVolume * submergedFraction;

    // Actual buoyancy
    const buoyancy =
      liquid.density *
      submergedVolume *
      GRAVITY;

    // Apparent weight
    const apparentWeight = Math.max(0, weight - buoyancy);

    // Gauge pressure at sensor depth
    const pressure =
      depthSensor * liquid.density * GRAVITY;

    // Absolute pressure (assuming atmospheric pressure at surface)
    const atmosphericPressure = 101325;
    const absolutePressure = atmosphericPressure + pressure;

    return {
      mass,
      weight,
      maxBuoyancy,
      buoyancy,
      apparentWeight,
      submergedFraction,
      submergedVolume,
      pressure,
      absolutePressure,
      status,
    };
  }, [objDensity, objVolume, liquid.density, depthSensor]);

  const {
    mass,
    weight,
    maxBuoyancy,
    buoyancy,
    apparentWeight,
    submergedFraction,
    submergedVolume,
    pressure,
    absolutePressure,
    status,
  } = physics;

  // ====================================================
  // STATUS INFORMATION
  // ====================================================

  const statusInfo = useMemo(() => {
    if (status === 'floating') {
      return {
        title: 'বস্তুটি ভাসছে',
        description:
          'বস্তুর ঘনত্ব তরলের ঘনত্বের চেয়ে কম। তাই বস্তুটি আংশিক নিমজ্জিত অবস্থায় ভাসছে।',
        color: 'emerald',
        percentage: submergedFraction * 100,
      };
    }

    if (status === 'neutral') {
      return {
        title: 'বস্তুটি নিরপেক্ষ প্লবতায় রয়েছে',
        description:
          'বস্তুর ঘনত্ব ও তরলের ঘনত্ব সমান। তাই বস্তুটি সম্পূর্ণ নিমজ্জিত অবস্থায় সাম্যাবস্থায় থাকতে পারে।',
        color: 'blue',
        percentage: 100,
      };
    }

    return {
      title: 'বস্তুটি ডুবে যাচ্ছে',
      description:
        'বস্তুর ঘনত্ব তরলের ঘনত্বের চেয়ে বেশি। তাই বস্তুটির ওজন প্লবতার চেয়ে বেশি।',
      color: 'rose',
      percentage: 100,
    };
  }, [status, submergedFraction]);

  // ====================================================
  // RESET
  // ====================================================

  const resetDefaults = () => {
    setLiquidId(DEFAULTS.liquidId);
    setObjDensity(DEFAULTS.objectDensity);
    setObjVolume(DEFAULTS.objectVolume);
    setDepthSensor(DEFAULTS.depth);
  };

  // ====================================================
  // CANVAS VISUALIZATION
  // ====================================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Tank dimensions
    const tankX = 155;
    const tankY = 65;
    const tankW = 480;
    const tankH = 190;

    const liquidTopY = tankY + 35;
    const liquidBottomY = tankY + tankH;
    const liquidH = liquidBottomY - liquidTopY;

    // --------------------------------------------------
    // Background grid
    // --------------------------------------------------

    ctx.strokeStyle = 'rgba(148,163,184,0.12)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --------------------------------------------------
    // Liquid
    // --------------------------------------------------

    ctx.fillStyle = liquid.color;
    ctx.fillRect(tankX, liquidTopY, tankW, liquidH);

    // Water surface
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(tankX, liquidTopY);
    ctx.lineTo(tankX + tankW, liquidTopY);
    ctx.stroke();

    // --------------------------------------------------
    // Tank walls
    // --------------------------------------------------

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(tankX, tankY);
    ctx.lineTo(tankX, liquidBottomY);
    ctx.lineTo(tankX + tankW, liquidBottomY);
    ctx.lineTo(tankX + tankW, tankY);
    ctx.stroke();

    // --------------------------------------------------
    // Depth ruler
    // --------------------------------------------------

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = liquidTopY + (liquidH / 4) * i;
      const meter = (5 / 4) * i;

      ctx.fillText(`${formatNumber(meter, 2)} m`, tankX - 12, y + 4);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(tankX - 6, y);
      ctx.lineTo(tankX, y);
      ctx.stroke();
    }

    // --------------------------------------------------
    // Object visualization
    // --------------------------------------------------

    const boxSize = 48 + (objVolume / 0.15) * 32;
    const boxX = tankX + tankW / 2 - boxSize / 2;

    let boxY: number;

    if (status === 'floating') {
      boxY =
        liquidTopY -
        boxSize * (1 - submergedFraction);
    } else if (status === 'neutral') {
      // Fully submerged and neutrally buoyant
      boxY = liquidTopY + 30;
    } else {
      // Simplified visual position at tank bottom
      boxY = liquidBottomY - boxSize - 2;
    }

    // Object shadow
    ctx.fillStyle = 'rgba(15,23,42,0.12)';
    ctx.beginPath();
    ctx.roundRect(
      boxX + 5,
      boxY + 5,
      boxSize,
      boxSize,
      7
    );
    ctx.fill();

    // Object body
    ctx.fillStyle = objectColor;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxSize, boxSize, 7);
    ctx.fill();
    ctx.stroke();

    // Object label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      `${objDensity}`,
      boxX + boxSize / 2,
      boxY + boxSize / 2 - 3
    );

    ctx.font = '10px sans-serif';

    ctx.fillText(
      'kg/m³',
      boxX + boxSize / 2,
      boxY + boxSize / 2 + 11
    );

    // --------------------------------------------------
    // Force arrows
    // --------------------------------------------------

    const drawArrow = (
      x: number,
      centerY: number,
      length: number,
      direction: 1 | -1,
      color: string,
      label: string
    ) => {
      const arrowLength = Math.max(
        22,
        Math.min(length, 65)
      );

      const endY = centerY + arrowLength * direction;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, endY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, endY);
      ctx.lineTo(x - 6, endY - 9 * direction);
      ctx.lineTo(x + 6, endY - 9 * direction);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';

      ctx.fillText(
        label,
        x + 9,
        (centerY + endY) / 2 + 4
      );
    };

    const centerX = boxX + boxSize / 2;
    const centerY = boxY + boxSize / 2;

    // Weight - downward
    drawArrow(
      centerX - 18,
      centerY,
      weight / 15,
      1,
      '#dc2626',
      `W = ${weight.toFixed(1)} N`
    );

    // Buoyancy - upward
    drawArrow(
      centerX + 18,
      centerY,
      buoyancy / 15,
      -1,
      '#059669',
      `Fb = ${buoyancy.toFixed(1)} N`
    );

    // --------------------------------------------------
    // Pressure sensor
    // --------------------------------------------------

    const sensorY =
      liquidTopY + (depthSensor / 5) * liquidH;

    const sensorX = tankX + tankW - 55;

    // Sensor connecting line
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(sensorX, liquidTopY);
    ctx.lineTo(sensorX, sensorY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Sensor marker
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(sensorX, sensorY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pressure label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';

    ctx.fillText(
      `P = ${(pressure / 1000).toFixed(2)} kPa`,
      tankX + tankW + 12,
      sensorY + 4
    );

    // --------------------------------------------------
    // Status banner
    // --------------------------------------------------

    const statusColor =
      status === 'floating'
        ? '#047857'
        : status === 'neutral'
          ? '#1d4ed8'
          : '#b91c1c';

    ctx.fillStyle = statusColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      status === 'floating'
        ? `ভাসছে - ${Math.round(submergedFraction * 100)}% নিমজ্জিত`
        : status === 'neutral'
          ? 'নিরপেক্ষ প্লবতা - সম্পূর্ণ নিমজ্জিত'
          : 'ডুবে যাচ্ছে - সম্পূর্ণ নিমজ্জিত',
      width / 2,
      28
    );

    // --------------------------------------------------
    // Liquid label
    // --------------------------------------------------

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      `${liquid.name} | ρ = ${liquid.density} kg/m³`,
      tankX + tankW / 2,
      liquidTopY + 18
    );
  }, [
    liquid,
    objDensity,
    objVolume,
    depthSensor,
    objectColor,
    status,
    submergedFraction,
    weight,
    buoyancy,
    pressure,
  ]);

  // ====================================================
  // TELEMETRY DATA
  // ====================================================

  const telemetry = [
    {
      label: 'বস্তুর ওজন',
      symbol: 'W',
      value: formatNumber(weight, 2),
      unit: 'N',
      icon: Weight,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'প্লবতা বল',
      symbol: 'Fb',
      value: formatNumber(buoyancy, 2),
      unit: 'N',
      icon: Droplets,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'আপাত ওজন',
      symbol: 'W apparent',
      value: formatNumber(apparentWeight, 2),
      unit: 'N',
      icon: Gauge,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'তরলের গেজ চাপ',
      symbol: 'P',
      value: formatNumber(pressure / 1000, 2),
      unit: 'kPa',
      icon: Activity,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6">

      {/* ============================================== */}
      {/* HEADER */}
      {/* ============================================== */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
            <Activity className="h-4 w-4" />
            INTERACTIVE PHYSICS LAB
          </div>

          <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
            তরলের চাপ ও প্লবতার পরীক্ষাগার
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            তরলের ঘনত্ব, বস্তুর ঘনত্ব এবং গভীরতা পরিবর্তন করে
            চাপ ও প্লবতার প্রভাব পর্যবেক্ষণ করো।
          </p>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* ============================================== */}
      {/* LIQUID SELECTION */}
      {/* ============================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />

            <h3 className="text-sm font-bold text-slate-800">
              তরল নির্বাচন করো
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LIQUIDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLiquidId(item.id)}
                aria-pressed={liquidId === item.id}
                className={`rounded-xl border p-3 text-left text-sm transition ${
                  liquidId === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200'
                }`}
              >
                <span className="block font-bold">
                  {item.name}
                </span>

                <span className="mt-1 block text-xs opacity-75">
                  {item.density.toLocaleString('en-US')} kg/m³
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Object presets */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />

            <h3 className="text-sm font-bold text-slate-800">
              বস্তুর উপাদান নির্বাচন করো
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {OBJECT_PRESETS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setObjDensity(item.density)}
                aria-pressed={objDensity === item.density}
                className={`rounded-xl border p-3 text-left text-sm transition ${
                  objDensity === item.density
                    ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-200'
                }`}
              >
                <span className="block font-bold">
                  {item.name}
                </span>

                <span className="mt-1 block text-xs opacity-75">
                  {item.density.toLocaleString('en-US')} kg/m³
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ============================================== */}
      {/* CANVAS SIMULATION */}
      {/* ============================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900">
            Live Simulation
          </h3>

          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            g = 9.8 m/s²
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <canvas
            ref={canvasRef}
            width={820}
            height={290}
            role="img"
            aria-label="তরলের মধ্যে বস্তুর ভাসা, ডোবা, প্লবতা এবং চাপের চিত্র"
            className="block h-auto w-full"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            ওজন (নিচের দিকে)
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            প্লবতা (উপরের দিকে)
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            চাপ সেন্সর
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          দ্রষ্টব্য: এটি একটি ধারণাভিত্তিক 2D simulation।
          বস্তুর আঁকা আকার বাস্তব আয়তনের অনুপাতে নয়।
        </p>
      </section>

      {/* ============================================== */}
      {/* STATUS CARD */}
      {/* ============================================== */}

      <section
        className={`rounded-2xl border p-4 ${
          status === 'floating'
            ? 'border-emerald-200 bg-emerald-50'
            : status === 'neutral'
              ? 'border-blue-200 bg-blue-50'
              : 'border-rose-200 bg-rose-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {status === 'sinking' ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                status === 'floating'
                  ? 'text-emerald-600'
                  : 'text-blue-600'
              }`}
            />
          )}

          <div className="min-w-0">
            <h3
              className={`font-bold ${
                status === 'floating'
                  ? 'text-emerald-800'
                  : status === 'neutral'
                    ? 'text-blue-800'
                    : 'text-rose-800'
              }`}
            >
              {statusInfo.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {statusInfo.description}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-600">
              নিমজ্জিত অংশ: {formatNumber(statusInfo.percentage, 1)}%
            </p>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* LIVE TELEMETRY */}
      {/* ============================================== */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {telemetry.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.symbol}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {item.symbol}
                  </p>
                </div>

                <div className={`rounded-lg p-2 ${item.bg}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>

              <p className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                {item.value}

                <span className="ml-1 text-xs font-medium text-slate-500">
                  {item.unit}
                </span>
              </p>
            </div>
          );
        })}
      </section>

      {/* ============================================== */}
      {/* CONTROL PANEL + FORMULAS */}
      {/* ============================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Controls */}

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              Control Panel
            </h3>
          </div>

          {/* Object density */}

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="object-density"
                className="text-sm font-semibold text-slate-700"
              >
                বস্তুর ঘনত্ব (ρ)
              </label>

              <span className="text-sm font-bold text-amber-600">
                {objDensity.toLocaleString('en-US')} kg/m³
              </span>
            </div>

            <input
              id="object-density"
              type="range"
              min={200}
              max={8000}
              step={10}
              value={objDensity}
              onChange={(e) =>
                setObjDensity(Number(e.target.value))
              }
              className="w-full cursor-pointer accent-amber-600"
            />

            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>200</span>
              <span>8000 kg/m³</span>
            </div>
          </div>

          {/* Object volume */}

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="object-volume"
                className="text-sm font-semibold text-slate-700"
              >
                বস্তুর আয়তন (V)
              </label>

              <span className="text-sm font-bold text-blue-600">
                {formatNumber(objVolume, 2)} m³
              </span>
            </div>

            <input
              id="object-volume"
              type="range"
              min={0.01}
              max={0.15}
              step={0.01}
              value={objVolume}
              onChange={(e) =>
                setObjVolume(Number(e.target.value))
              }
              className="w-full cursor-pointer accent-blue-600"
            />

            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>0.01 m³</span>
              <span>0.15 m³</span>
            </div>
          </div>

          {/* Sensor depth */}

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="sensor-depth"
                className="text-sm font-semibold text-slate-700"
              >
                চাপ সেন্সরের গভীরতা (h)
              </label>

              <span className="text-sm font-bold text-cyan-600">
                {formatNumber(depthSensor, 1)} m
              </span>
            </div>

            <input
              id="sensor-depth"
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={depthSensor}
              onChange={(e) =>
                setDepthSensor(Number(e.target.value))
              }
              className="w-full cursor-pointer accent-cyan-600"
            />

            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>0 m</span>
              <span>5 m</span>
            </div>
          </div>

          {/* Selected values */}

          <div className="rounded-xl bg-slate-50 p-4">
            <h4 className="mb-3 text-xs font-bold text-slate-700">
              বর্তমান পরীক্ষার তথ্য
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">তরলের ঘনত্ব</p>
                <p className="mt-1 font-bold text-slate-900">
                  {liquid.density.toLocaleString('en-US')} kg/m³
                </p>
              </div>

              <div>
                <p className="text-slate-500">বস্তুর ভর</p>
                <p className="mt-1 font-bold text-slate-900">
                  {formatNumber(mass, 2)} kg
                </p>
              </div>

              <div>
                <p className="text-slate-500">নিমজ্জিত আয়তন</p>
                <p className="mt-1 font-bold text-slate-900">
                  {formatNumber(submergedVolume, 4)} m³
                </p>
              </div>

              <div>
                <p className="text-slate-500">সম্পূর্ণ নিমজ্জিত প্লবতা</p>
                <p className="mt-1 font-bold text-slate-900">
                  {formatNumber(maxBuoyancy, 2)} N
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Formula */}

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />

            <h3 className="font-bold text-slate-900">
              Live Formula Calculation
            </h3>
          </div>

          {/* Pressure */}

          <div className="space-y-2 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
            <p className="text-xs font-bold text-cyan-800">
              ১. তরলের চাপ
            </p>

            <FormulaBox
              formula={`P = h\\rho g = ${formatNumber(depthSensor, 1)} \\times ${liquid.density} \\times 9.8 = ${formatNumber(pressure, 2)}\\text{ Pa}`}
            />

            <p className="text-xs text-slate-600">
              চাপ = গভীরতা × তরলের ঘনত্ব × অভিকর্ষজ ত্বরণ।
            </p>

            <p className="text-xs font-semibold text-cyan-800">
              গেজ চাপ: {formatNumber(pressure, 2)} Pa
            </p>

            <p className="text-xs text-slate-500">
              বায়ুমণ্ডলীয় চাপসহ মোট চাপ:
              {' '}
              {formatNumber(absolutePressure, 2)} Pa
            </p>
          </div>

          {/* Buoyancy */}

          <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-xs font-bold text-emerald-800">
              ২. প্লবতা বল
            </p>

            <FormulaBox
              formula={`F_b = V_{sub}\\rho g = ${formatNumber(submergedVolume, 4)} \\times ${liquid.density} \\times 9.8 = ${formatNumber(buoyancy, 2)}\\text{ N}`}
            />

            <p className="text-xs text-slate-600">
              প্লবতা = নিমজ্জিত আয়তন × তরলের ঘনত্ব × অভিকর্ষজ ত্বরণ।
            </p>
          </div>

          {/* Weight */}

          <div className="space-y-2 rounded-xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-bold text-rose-800">
              ৩. বস্তুর ওজন
            </p>

            <FormulaBox
              formula={`W = mg = ${formatNumber(mass, 2)} \\times 9.8 = ${formatNumber(weight, 2)}\\text{ N}`}
            />
          </div>

          {/* Apparent weight */}

          <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-xs font-bold text-blue-800">
              ৪. আপাত ওজন
            </p>

            <FormulaBox
              formula={`W_{apparent} = W - F_b = ${formatNumber(weight, 2)} - ${formatNumber(buoyancy, 2)} = ${formatNumber(apparentWeight, 2)}\\text{ N}`}
            />
          </div>
        </section>
      </div>

      {/* ============================================== */}
      {/* LEARNING INSIGHT */}
      {/* ============================================== */}

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />

          <h3 className="font-bold text-indigo-900">
            কী শিখলে? (Learning Insight)
          </h3>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-xs font-bold text-slate-800">
              ঘনত্বের প্রভাব
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              বস্তুর ঘনত্ব তরলের চেয়ে কম হলে বস্তু আংশিক নিমজ্জিত
              অবস্থায় ভাসে। বেশি হলে বস্তু ডুবে যায়।
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-xs font-bold text-slate-800">
              গভীরতার প্রভাব
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              একই তরলে গভীরতা বাড়ালে তরলের চাপ বাড়ে।
              তাই বাঁধের নিচের অংশ বেশি পুরু করা হয়।
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-xs font-bold text-slate-800">
              প্লবতার প্রভাব
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              নিমজ্জিত অংশের আয়তন বাড়লে অপসারিত তরলের ওজন
              এবং প্লবতা বাড়ে।
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-xs font-bold text-slate-800">
              আপাত ওজন
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              পানির মধ্যে কোনো বস্তু তুলতে গেলে সেটি তুলনামূলক
              হালকা মনে হয়। কারণ প্লবতা বস্তুর আপাত ওজন কমায়।
            </p>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* FORMULA SUMMARY */}
      {/* ============================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold text-slate-900">
          গুরুত্বপূর্ণ সূত্র মনে রাখো
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">
              তরলের চাপ
            </p>

            <div className="mt-2">
              <FormulaBox formula="P = h\\rho g" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">
              প্লবতা
            </p>

            <div className="mt-2">
              <FormulaBox formula="F_b = V\\rho g" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">
              বস্তুর ওজন
            </p>

            <div className="mt-2">
              <FormulaBox formula="W = mg" />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">
              আপাত ওজন
            </p>

            <div className="mt-2">
              <FormulaBox formula="W_{apparent} = W - F_b" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          এখানে P = গেজ চাপ, h = গভীরতা, ρ = তরলের ঘনত্ব,
          V = নিমজ্জিত আয়তন, g = অভিকর্ষজ ত্বরণ,
          W = বস্তুর ওজন এবং Fb = প্লবতা।
        </p>
      </section>
    </div>
  );
}
