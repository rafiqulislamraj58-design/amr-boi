
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Eye,
  Info,
  RotateCcw,
  Sparkles,
  Ruler,
  ArrowUpDown,
  Lightbulb,
  Target,
} from 'lucide-react';

type MirrorType = 'concave' | 'convex';

const DEFAULTS = {
  mirrorType: 'concave' as MirrorType,
  focalMag: 15,
  objectDist: 35,
  objectHeight: 5,
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : '∞';

export default function ReflectionOfLightLab() {
  const [mirrorType, setMirrorType] = useState<MirrorType>(
    DEFAULTS.mirrorType
  );
  const [focalMag, setFocalMag] = useState(DEFAULTS.focalMag);
  const [objectDist, setObjectDist] = useState(DEFAULTS.objectDist);
  const [objectHeight, setObjectHeight] = useState(
    DEFAULTS.objectHeight
  );

  // ==========================================
  // 01. MIRROR CALCULATIONS
  // ==========================================

  const f = mirrorType === 'concave' ? focalMag : -focalMag;
  const u = objectDist;

  const isAtFocus =
    mirrorType === 'concave' && Math.abs(u - focalMag) < 0.001;

  // Mirror formula:
  // 1/f = 1/v + 1/u
  // v = uf / (u - f)

  const v = isAtFocus
    ? Infinity
    : (u * f) / (u - f);

  const magnification = isAtFocus ? Infinity : -v / u;

  const imageHeight = isAtFocus
    ? Infinity
    : magnification * objectHeight;

  const absM = Math.abs(magnification);

  const isReal = !isAtFocus && v > 0;
  const isVirtual = !isAtFocus && v < 0;
  const isInverted = !isAtFocus && magnification < 0;

  const sizeLabel = isAtFocus
    ? 'অত্যন্ত বিবর্ধিত'
    : absM > 1.000001
      ? 'বিবর্ধিত (বড়)'
      : absM < 0.999999
        ? 'খর্বিত (ছোট)'
        : 'লক্ষ্যবস্তুর সমান';

  const natureLabel = isAtFocus
    ? 'অসীমে গঠিত'
    : isReal
      ? 'বাস্তব ও উল্টো'
      : 'অবাস্তব ও সোজা';

  const imagePositionLabel = isAtFocus
    ? 'অসীমে'
    : isReal
      ? 'দর্পণের সামনে'
      : 'দর্পণের পেছনে';

  const imageHeightLabel = isAtFocus
    ? 'অসীম'
    : `${formatNumber(Math.abs(imageHeight), 2)} cm`;

  // ==========================================
  // 02. SVG DIAGRAM
  // ==========================================

  const svgW = 600;
  const svgH = 280;
  const poleX = 330;
  const axisY = 140;

  const scaleX = 5.2;
  const scaleY = 11;

  const objX = poleX - u * scaleX;
  const objTopY = axisY - objectHeight * scaleY;

  const focusX =
    mirrorType === 'concave'
      ? poleX - focalMag * scaleX
      : poleX + focalMag * scaleX;

  const centerX =
    mirrorType === 'concave'
      ? poleX - 2 * focalMag * scaleX
      : poleX + 2 * focalMag * scaleX;

  // Image position and height are clipped to the SVG viewport.
  // Calculated values remain unchanged in the result panel.

  const rawImageX = isAtFocus
    ? 15
    : poleX - v * scaleX;

  const rawImageTopY = isAtFocus
    ? axisY + 100
    : axisY - imageHeight * scaleY;

  const imageX = clamp(rawImageX, 20, svgW - 20);
  const imageTopY = clamp(rawImageTopY, 20, svgH - 20);

  const imageIsClipped =
    !isAtFocus &&
    (rawImageX < 20 ||
      rawImageX > svgW - 20 ||
      rawImageTopY < 20 ||
      rawImageTopY > svgH - 20);

  const mirrorPath =
    mirrorType === 'concave'
      ? `M ${poleX - 14} 35 Q ${poleX + 14} ${axisY} ${poleX - 14} 245`
      : `M ${poleX + 14} 35 Q ${poleX - 14} ${axisY} ${poleX + 14} 245`;

  // Ray 1: Parallel ray.
  // Concave: reflected through F.
  // Convex: reflected ray diverges; its extension passes through F.

  const ray1Slope =
    (axisY - objTopY) / (focusX - poleX);

  const ray1LeftX = 15;
  const ray1LeftY =
    objTopY + ray1Slope * (ray1LeftX - poleX);

  // Ray 2: Ray through pole P.
  // Reflection follows i = r.

  const ray2InSlope =
    (axisY - objTopY) / (poleX - objX);

  const ray2RefSlope = -ray2InSlope;

  const ray2LeftX = 15;
  const ray2LeftY =
    axisY + ray2RefSlope * (ray2LeftX - poleX);

  // ==========================================
  // 03. PRESETS AND RESET
  // ==========================================

  const applyPreset = (
    type: MirrorType,
    distance: number,
    focalLength = 15
  ) => {
    setMirrorType(type);
    setFocalMag(focalLength);
    setObjectDist(distance);
  };

  const handleReset = () => {
    setMirrorType(DEFAULTS.mirrorType);
    setFocalMag(DEFAULTS.focalMag);
    setObjectDist(DEFAULTS.objectDist);
    setObjectHeight(DEFAULTS.objectHeight);
  };

  // ==========================================
  // 04. LEARNING INSIGHT
  // ==========================================

  const learningInsight = useMemo(() => {
    if (isAtFocus) {
      return 'লক্ষ্যবস্তু প্রধান ফোকাসে থাকলে প্রতিফলিত রশ্মিগুলো পরস্পর সমান্তরাল হয়। ফলে প্রতিবিম্ব অসীমে গঠিত হয়।';
    }

    if (mirrorType === 'convex') {
      return 'উত্তল দর্পণে প্রতিফলিত রশ্মিগুলো অপসারী হয়। এদের বর্ধিত অংশ দর্পণের পেছনে মিলিত হয়ে অবাস্তব, সোজা ও খর্বিত প্রতিবিম্ব তৈরি করে।';
    }

    if (u > 2 * focalMag) {
      return 'লক্ষ্যবস্তু বক্রতার কেন্দ্র C-এর বাইরে রয়েছে। প্রতিবিম্ব F ও C-এর মধ্যে বাস্তব, উল্টো ও খর্বিত হয়।';
    }

    if (Math.abs(u - 2 * focalMag) < 0.001) {
      return 'লক্ষ্যবস্তু বক্রতার কেন্দ্র C-তে রয়েছে। প্রতিবিম্বও C-তে বাস্তব, উল্টো ও সমান আকারের হয়।';
    }

    if (u > focalMag && u < 2 * focalMag) {
      return 'লক্ষ্যবস্তু F ও C-এর মধ্যে রয়েছে। প্রতিবিম্ব C-এর বাইরে বাস্তব, উল্টো ও বিবর্ধিত হয়।';
    }

    return 'লক্ষ্যবস্তু F ও P-এর মধ্যে রয়েছে। প্রতিফলিত রশ্মিগুলোর বর্ধিত অংশ দর্পণের পেছনে মিলিত হয়। প্রতিবিম্ব অবাস্তব, সোজা ও বিবর্ধিত হয়।';
  }, [mirrorType, u, focalMag, isAtFocus]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold tracking-wider text-blue-700 sm:text-xs">
              <Activity className="h-3.5 w-3.5" />
              INTERACTIVE PHYSICS LAB
            </div>

            <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
              গোলীয় দর্পণে রশ্মিচিত্র ও বিবর্ধন
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              অবতল ও উত্তল দর্পণের সামনে লক্ষ্যবস্তুর অবস্থান
              পরিবর্তন করে প্রতিবিম্বের প্রকৃতি, অবস্থান ও আকার
              পর্যবেক্ষণ করো।
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            রিসেট
          </button>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      {/* ========================================
          MAIN GRID
      ======================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* ======================================
            RAY DIAGRAM
        ====================================== */}

        <section className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                আলোকরশ্মি চিত্র
              </h3>
            </div>

            <div
              className="flex w-full gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto"
              role="group"
              aria-label="দর্পণের ধরন নির্বাচন"
            >
              <button
                type="button"
                aria-pressed={mirrorType === 'concave'}
                onClick={() => setMirrorType('concave')}
                className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-bold transition sm:flex-none sm:text-xs ${
                  mirrorType === 'concave'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                অবতল দর্পণ
              </button>

              <button
                type="button"
                aria-pressed={mirrorType === 'convex'}
                onClick={() => setMirrorType('convex')}
                className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-bold transition sm:flex-none sm:text-xs ${
                  mirrorType === 'convex'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                উত্তল দর্পণ
              </button>
            </div>
          </div>

          {/* SVG */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="block h-auto min-w-[420px] w-full"
                role="img"
                aria-label={`${
                  mirrorType === 'concave' ? 'অবতল' : 'উত্তল'
                } দর্পণের আলোকরশ্মি চিত্র`}
              >
                <defs>
                  <marker
                    id="ray-arrow-orange"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0 0 L6 3 L0 6" fill="#f59e0b" />
                  </marker>

                  <marker
                    id="ray-arrow-blue"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0 0 L6 3 L0 6" fill="#0ea5e9" />
                  </marker>
                </defs>

                {/* Principal Axis */}
                <line
                  x1={10}
                  y1={axisY}
                  x2={svgW - 10}
                  y2={axisY}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />

                {/* Mirror */}
                <path
                  d={mirrorPath}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={4}
                  strokeLinecap="round"
                />

                {/* Pole */}
                <circle
                  cx={poleX}
                  cy={axisY}
                  r={4}
                  fill="#0f172a"
                />
                <text
                  x={poleX + 8}
                  y={axisY + 17}
                  fontSize={12}
                  fontWeight="bold"
                  fill="#0f172a"
                >
                  P
                </text>

                {/* Focus */}
                <circle
                  cx={focusX}
                  cy={axisY}
                  r={4}
                  fill="#e11d48"
                />
                <text
                  x={focusX - 4}
                  y={axisY + 19}
                  fontSize={12}
                  fontWeight="bold"
                  fill="#e11d48"
                >
                  F
                </text>

                {/* Center of Curvature */}
                {centerX > 15 && centerX < svgW - 15 && (
                  <>
                    <circle
                      cx={centerX}
                      cy={axisY}
                      r={4}
                      fill="#7c3aed"
                    />
                    <text
                      x={centerX - 4}
                      y={axisY + 19}
                      fontSize={12}
                      fontWeight="bold"
                      fill="#7c3aed"
                    >
                      C
                    </text>
                  </>
                )}

                {/* Ray 1: Incident parallel ray */}
                <line
                  x1={objX}
                  y1={objTopY}
                  x2={poleX}
                  y2={objTopY}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  markerEnd="url(#ray-arrow-orange)"
                />

                {/* Ray 1: Reflected ray */}
                <line
                  x1={poleX}
                  y1={objTopY}
                  x2={ray1LeftX}
                  y2={ray1LeftY}
                  stroke="#f59e0b"
                  strokeWidth={2}
                />

                {/* Ray 2: Incident ray to pole */}
                <line
                  x1={objX}
                  y1={objTopY}
                  x2={poleX}
                  y2={axisY}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />

                {/* Ray 2: Reflected ray */}
                <line
                  x1={poleX}
                  y1={axisY}
                  x2={ray2LeftX}
                  y2={ray2LeftY}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />

                {/* Virtual ray extensions */}
                {isVirtual && (
                  <>
                    <line
                      x1={poleX}
                      y1={objTopY}
                      x2={imageX}
                      y2={imageTopY}
                      stroke="#f59e0b"
                      strokeWidth={1.6}
                      strokeDasharray="5 4"
                    />

                    <line
                      x1={poleX}
                      y1={axisY}
                      x2={imageX}
                      y2={imageTopY}
                      stroke="#0ea5e9"
                      strokeWidth={1.6}
                      strokeDasharray="5 4"
                    />
                  </>
                )}

                {/* Object */}
                <line
                  x1={objX}
                  y1={axisY}
                  x2={objX}
                  y2={objTopY}
                  stroke="#2563eb"
                  strokeWidth={3.5}
                />

                <polygon
                  points={`${objX},${objTopY - 6} ${objX - 5},${objTopY + 4} ${objX + 5},${objTopY + 4}`}
                  fill="#2563eb"
                />

                <text
                  x={objX - 18}
                  y={objTopY - 11}
                  fontSize={11}
                  fontWeight="bold"
                  fill="#1d4ed8"
                >
                  বস্তু
                </text>

                {/* Image */}
                {!isAtFocus && (
                  <>
                    <line
                      x1={imageX}
                      y1={axisY}
                      x2={imageX}
                      y2={imageTopY}
                      stroke={isReal ? '#059669' : '#e11d48'}
                      strokeWidth={3.5}
                      strokeDasharray={isReal ? undefined : '5 3'}
                    />

                    <polygon
                      points={
                        isInverted
                          ? `${imageX},${imageTopY + 6} ${imageX - 5},${imageTopY - 4} ${imageX + 5},${imageTopY - 4}`
                          : `${imageX},${imageTopY - 6} ${imageX - 5},${imageTopY + 4} ${imageX + 5},${imageTopY + 4}`
                      }
                      fill={isReal ? '#059669' : '#e11d48'}
                    />

                    <text
                      x={clamp(imageX - 25, 5, svgW - 55)}
                      y={imageTopY + (isInverted ? 18 : -11)}
                      fontSize={11}
                      fontWeight="bold"
                      fill={isReal ? '#047857' : '#be123c'}
                    >
                      প্রতিবিম্ব
                    </text>
                  </>
                )}

                {/* Focus warning */}
                {isAtFocus && (
                  <text
                    x={poleX - 100}
                    y={axisY - 12}
                    fontSize={11}
                    fontWeight="bold"
                    fill="#be123c"
                  >
                    প্রতিবিম্ব অসীমে
                  </text>
                )}
              </svg>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-slate-600 sm:text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                লক্ষ্যবস্তু
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                বাস্তব প্রতিবিম্ব
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                অবাস্তব প্রতিবিম্ব
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-slate-500" />
                বর্ধিত রশ্মি
              </span>
            </div>
          </div>

          {imageIsClipped && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              <Info className="mr-1 inline h-3.5 w-3.5" />
              প্রতিবিম্বের প্রকৃত অবস্থান চিত্রের সীমার বাইরে। তাই
              SVG-তে দৃশ্যমান রাখার জন্য চিত্রটি সীমাবদ্ধ করা হয়েছে।
              ফলাফলের ঘরে প্রকৃত মান দেখানো হয়েছে।
            </p>
          )}

          {/* Presets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <Target className="h-4 w-4 text-blue-600" />
              দ্রুত অবস্থান নির্বাচন
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                {
                  label: 'C-এর বাইরে',
                  sub: 'u > 2f',
                  action: () => applyPreset('concave', 40),
                },
                {
                  label: 'C-তে',
                  sub: 'u = 2f',
                  action: () => applyPreset('concave', 30),
                },
                {
                  label: 'F ও P-এর মাঝে',
                  sub: 'u < f',
                  action: () => applyPreset('concave', 10),
                },
                {
                  label: 'উত্তল দর্পণ',
                  sub: 'Convex',
                  action: () => applyPreset('convex', 25),
                },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={preset.action}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                >
                  <span className="block text-[11px] font-extrabold text-slate-800">
                    {preset.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                    {preset.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================
            CONTROLS
        ====================================== */}

        <section className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              নিয়ন্ত্রণ ও ফলাফল
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              স্লাইডার পরিবর্তন করে পরীক্ষাটি পরিচালনা করো।
            </p>
          </div>

          {/* Object distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="object-distance"
                className="text-xs font-bold text-slate-700"
              >
                লক্ষ্যবস্তুর দূরত্ব (u)
              </label>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                {objectDist} cm
              </span>
            </div>

            <input
              id="object-distance"
              type="range"
              min={5}
              max={55}
              step={1}
              value={objectDist}
              onChange={(e) => setObjectDist(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 cm</span>
              <span>55 cm</span>
            </div>
          </div>

          {/* Focal length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="focal-length"
                className="text-xs font-bold text-slate-700"
              >
                ফোকাস দূরত্ব (|f|)
              </label>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                {mirrorType === 'concave' ? '+' : '-'}
                {focalMag} cm
              </span>
            </div>

            <input
              id="focal-length"
              type="range"
              min={10}
              max={25}
              step={1}
              value={focalMag}
              onChange={(e) => setFocalMag(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10 cm</span>
              <span>25 cm</span>
            </div>
          </div>

          {/* Object height */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="object-height"
                className="text-xs font-bold text-slate-700"
              >
                লক্ষ্যবস্তুর উচ্চতা (h)
              </label>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                {objectHeight} cm
              </span>
            </div>

            <input
              id="object-height"
              type="range"
              min={2}
              max={8}
              step={1}
              value={objectHeight}
              onChange={(e) => setObjectHeight(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 cm</span>
              <span>8 cm</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Result Cards */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <Activity className="h-4 w-4 text-blue-600" />
              পরিমাপের ফলাফল
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">
                  প্রতিবিম্বের দূরত্ব (v)
                </p>
                <p className="mt-1 break-words text-base font-extrabold text-slate-900">
                  {isAtFocus ? '∞' : `${formatNumber(v, 2)}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  cm
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">
                  রৈখিক বিবর্ধন (m)
                </p>
                <p className="mt-1 break-words text-base font-extrabold text-slate-900">
                  {isAtFocus ? '∞' : formatNumber(magnification)}
                </p>
                <p className="text-[10px] text-slate-400">
                  m = -v/u
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">
                  প্রতিবিম্বের উচ্চতা
                </p>
                <p className="mt-1 text-base font-extrabold text-slate-900">
                  {imageHeightLabel}
                </p>
                <p className="text-[10px] text-slate-400">
                  |h'|
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">
                  প্রতিবিম্বের অবস্থান
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {imagePositionLabel}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isAtFocus ? '∞' : `${formatNumber(Math.abs(v), 2)} cm`}
                </p>
              </div>
            </div>
          </div>

          {/* Nature */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-800">
              <Sparkles className="h-4 w-4" />
              প্রতিবিম্বের প্রকৃতি
            </div>

            <p className="mt-2 text-sm font-extrabold text-slate-900">
              {natureLabel}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-700">
                {sizeLabel}
              </span>

              <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-700">
                {isAtFocus
                  ? 'দিক: নির্ধারণযোগ্য নয়'
                  : isInverted
                    ? 'উল্টো'
                    : 'সোজা'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================
          LEARNING INSIGHT
      ======================================== */}

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-emerald-900">
              এই অবস্থায় কী ঘটছে?
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-emerald-900/80 sm:text-sm">
              {learningInsight}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          FORMULA AND SIGN CONVENTION
      ======================================== */}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-extrabold text-slate-800">
              দর্পণ সূত্র
            </h3>
          </div>

          <p className="mt-3 text-center text-lg font-extrabold text-blue-700">
            1/f = 1/v + 1/u
          </p>

          <p className="mt-2 text-center text-xs text-slate-500">
            বিবর্ধন, m = -v/u = h'/h
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-extrabold text-slate-800">
              চিহ্ন প্রথা
            </h3>
          </div>

          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600">
            <li>• অবতল দর্পণ: f ধনাত্মক</li>
            <li>• উত্তল দর্পণ: f ঋণাত্মক</li>
            <li>• বাস্তব প্রতিবিম্ব: v ধনাত্মক</li>
            <li>• অবাস্তব প্রতিবিম্ব: v ঋণাত্মক</li>
          </ul>
        </div>
      </section>

      {/* ========================================
          INFO NOTE
      ======================================== */}

      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

        <p className="text-[11px] leading-relaxed text-amber-950 sm:text-xs">
          <strong>বিশেষ দ্রষ্টব্য:</strong> এখানে নিউ কার্টেসীয়
          চিহ্ন প্রথা অনুসরণ করা হয়েছে। বস্তু দর্পণের সামনে থাকায়
          u ঋণাত্মক না ধরে তার দূরত্বের মান ব্যবহার করা হয়েছে;
          এই সিমুলেটরে বস্তু দূরত্ব u ধনাত্মক এবং দর্পণের সামনে
          বাস্তব প্রতিবিম্বের দূরত্ব v ধনাত্মক দেখানো হয়েছে।
          রশ্মিচিত্রটি শিক্ষামূলক ও প্যারাক্সিয়াল রশ্মির
          আনুমানিক চিত্র।
        </p>
      </div>
    </div>
  );
}
