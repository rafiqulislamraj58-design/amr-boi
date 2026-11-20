
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Glasses,
  Info,
  RotateCcw,
  Sparkles,
  Waves,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Zap,
  Target,
} from 'lucide-react';

interface MediumOption {
  id: string;
  nameBn: string;
  n: number;
  bgTint: string;
}

const MEDIA: MediumOption[] = [
  { id: 'air', nameBn: 'বায়ু (Air)', n: 1.0, bgTint: '#f8fafc' },
  { id: 'water', nameBn: 'পানি (Water)', n: 1.33, bgTint: '#e0f2fe' },
  { id: 'glass', nameBn: 'কাচ (Glass)', n: 1.5, bgTint: '#dbeafe' },
  { id: 'diamond', nameBn: 'হীরা (Diamond)', n: 2.42, bgTint: '#ede9fe' },
];

const DEFAULTS = {
  medium1: 'water',
  medium2: 'air',
  angle: 35,
  lensType: 'convex' as const,
  focalLength: 25,
};

type LensType = 'convex' | 'concave';

export default function RefractionOfLightLab() {
  // ==========================================
  // STATE
  // ==========================================

  const [medium1Id, setMedium1Id] = useState(DEFAULTS.medium1);
  const [medium2Id, setMedium2Id] = useState(DEFAULTS.medium2);
  const [incidentAngle, setIncidentAngle] = useState(DEFAULTS.angle);

  const [lensType, setLensType] = useState<LensType>(DEFAULTS.lensType);
  const [focalLengthCm, setFocalLengthCm] = useState(DEFAULTS.focalLength);

  const [showAngles, setShowAngles] = useState(true);
  const [showNormal, setShowNormal] = useState(true);

  // ==========================================
  // MEDIUM DATA
  // ==========================================

  const m1 = useMemo(
    () => MEDIA.find((m) => m.id === medium1Id) ?? MEDIA[1],
    [medium1Id]
  );

  const m2 = useMemo(
    () => MEDIA.find((m) => m.id === medium2Id) ?? MEDIA[0],
    [medium2Id]
  );

  const refractiveRatio = m1.n / m2.n;

  // ==========================================
  // SNELL'S LAW
  // ==========================================

  const iRad = (incidentAngle * Math.PI) / 180;

  const sinI = Math.sin(iRad);
  const sinR = refractiveRatio * sinI;

  const hasCriticalAngle = m1.n > m2.n;

  const criticalAngle = hasCriticalAngle
    ? (Math.asin(m2.n / m1.n) * 180) / Math.PI
    : null;

  // Avoid floating-point errors around critical angle.
  const isCritical =
    criticalAngle !== null &&
    Math.abs(incidentAngle - criticalAngle) < 0.05;

  const isTIR =
    criticalAngle !== null &&
    incidentAngle > criticalAngle + 0.05;

  const refractedAngle =
    isTIR
      ? null
      : Math.asin(Math.min(1, Math.max(0, sinR))) * 180 / Math.PI;

  const isEqualMedium = Math.abs(m1.n - m2.n) < 0.000001;

  const bendsTowardNormal = m2.n > m1.n;
  const bendsAwayFromNormal = m2.n < m1.n && !isTIR;

  const opticalStatus = isTIR
    ? 'পূর্ণ অভ্যন্তরীণ প্রতিফলন'
    : isCritical
      ? 'সংকট অবস্থা'
      : isEqualMedium
        ? 'দিক পরিবর্তন হয় না'
        : 'আলোর প্রতিসরণ';

  // ==========================================
  // LENS POWER
  // ==========================================

  const signedFocalLength =
    (lensType === 'convex' ? focalLengthCm : -focalLengthCm) / 100;

  const lensPower = 1 / signedFocalLength;

  const lensSign = lensPower > 0 ? '+' : '';

  // ==========================================
  // SVG RAY GEOMETRY
  // ==========================================

  const svgW = 560;
  const svgH = 340;

  const cx = svgW / 2;
  const cy = svgH / 2;

  const rayLen = 130;

  const rRad = refractedAngle !== null
    ? (refractedAngle * Math.PI) / 180
    : 0;

  // Incident ray
  const incX = cx - rayLen * Math.sin(iRad);
  const incY = cy - rayLen * Math.cos(iRad);

  // Reflected ray
  const refX = cx + rayLen * Math.sin(iRad);
  const refY = cy - rayLen * Math.cos(iRad);

  // Refracted ray
  const refrX = cx + rayLen * Math.sin(rRad);
  const refrY = cy + rayLen * Math.cos(rRad);

  // Angle arcs
  const arcRadius = 34;

  const incidentArc = [
    `M ${cx} ${cy - arcRadius}`,
    `A ${arcRadius} ${arcRadius} 0 0 0`,
    `${cx - arcRadius * Math.sin(iRad)} ${cy - arcRadius * Math.cos(iRad)}`,
  ].join(' ');

  const reflectedArc = [
    `M ${cx} ${cy - arcRadius}`,
    `A ${arcRadius} ${arcRadius} 0 0 1`,
    `${cx + arcRadius * Math.sin(iRad)} ${cy - arcRadius * Math.cos(iRad)}`,
  ].join(' ');

  const refractedArc = [
    `M ${cx} ${cy + arcRadius}`,
    `A ${arcRadius} ${arcRadius} 0 0 0`,
    `${cx + arcRadius * Math.sin(rRad)} ${cy + arcRadius * Math.cos(rRad)}`,
  ].join(' ');

  // ==========================================
  // STATUS MESSAGE
  // ==========================================

  const statusDescription = isTIR
    ? `আপতন কোণ ${incidentAngle}°, যা সংকট কোণ ${criticalAngle?.toFixed(1)}°-এর বেশি। তাই আলো দ্বিতীয় মাধ্যমে প্রবেশ না করে প্রথম মাধ্যমেই সম্পূর্ণ প্রতিফলিত হচ্ছে।`
    : isCritical
      ? 'আপতন কোণ সংকট কোণের সমান। প্রতিসরণ কোণ ৯০° হয় এবং প্রতিসরিত রশ্মি বিভেদতল বরাবর চলে।'
      : bendsTowardNormal
        ? 'আলো হালকা মাধ্যম থেকে ঘন মাধ্যমে প্রবেশ করছে। তাই প্রতিসরিত রশ্মি অভিলম্বের দিকে বেঁকে যাচ্ছে।'
        : bendsAwayFromNormal
          ? 'আলো ঘন মাধ্যম থেকে হালকা মাধ্যমে প্রবেশ করছে। তাই প্রতিসরিত রশ্মি অভিলম্ব থেকে দূরে বেঁকে যাচ্ছে।'
          : 'দুটি মাধ্যমের প্রতিসরণাঙ্ক সমান। তাই আলোর গতিপথের দিক পরিবর্তন হচ্ছে না।';

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setMedium1Id(DEFAULTS.medium1);
    setMedium2Id(DEFAULTS.medium2);
    setIncidentAngle(DEFAULTS.angle);

    setLensType(DEFAULTS.lensType);
    setFocalLengthCm(DEFAULTS.focalLength);

    setShowAngles(true);
    setShowNormal(true);
  };

  // ==========================================
  // PRESETS
  // ==========================================

  const applyPreset = (
    first: string,
    second: string,
    angle: number
  ) => {
    setMedium1Id(first);
    setMedium2Id(second);
    setIncidentAngle(angle);
  };

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-6">

        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">

          <div className="min-w-0 flex-1">

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-blue-700">
              <Activity className="h-4 w-4" />
              INTERACTIVE PHYSICS VIRTUAL LAB
            </div>

            <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
              আলোর প্রতিসরণ ও লেন্স ল্যাব
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              স্নেলের সূত্র, সংকট কোণ, পূর্ণ অভ্যন্তরীণ প্রতিফলন
              এবং লেন্সের ক্ষমতা বাস্তবসম্মতভাবে পর্যবেক্ষণ করো।
            </p>

          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            রিসেট
          </button>

        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {[
            {
              label: 'প্রথম মাধ্যম',
              value: m1.nameBn,
              icon: Waves,
            },
            {
              label: 'দ্বিতীয় মাধ্যম',
              value: m2.nameBn,
              icon: Waves,
            },
            {
              label: 'আপতন কোণ',
              value: `${incidentAngle}°`,
              icon: Target,
            },
            {
              label: 'লেন্সের ক্ষমতা',
              value: `${lensSign}${lensPower.toFixed(2)} D`,
              icon: Glasses,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white bg-white/80 p-3 shadow-sm"
              >
                <Icon className="mb-2 h-4 w-4 text-blue-600" />

                <p className="text-[11px] font-semibold text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}

        </div>

      </section>

      {/* ====================================== */}
      {/* SECTION 1: REFRACTION LAB */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">

        {/* RAY DIAGRAM */}

        <section className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-7">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                আলোকরশ্মির সিমুলেশন
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                মাধ্যম ও কোণ পরিবর্তন করে পর্যবেক্ষণ করো
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${
                isTIR
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : isCritical
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {opticalStatus}
            </span>

          </div>

          {/* SVG DIAGRAM */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="block h-auto w-full"
              role="img"
              aria-label={`আলোর প্রতিসরণ চিত্র। আপতন কোণ ${incidentAngle} ডিগ্রি। ${opticalStatus}`}
            >

              <defs>

                <marker
                  id="ray-arrow-red"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0 0 L6 3 L0 6 Z" fill="#e11d48" />
                </marker>

                <marker
                  id="ray-arrow-blue"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0 0 L6 3 L0 6 Z" fill="#2563eb" />
                </marker>

              </defs>

              {/* Medium 1 */}

              <rect
                x="0"
                y="0"
                width={svgW}
                height={cy}
                fill={m1.bgTint}
              />

              {/* Medium 2 */}

              <rect
                x="0"
                y={cy}
                width={svgW}
                height={cy}
                fill={m2.bgTint}
              />

              {/* Medium Labels */}

              <text
                x="14"
                y="25"
                fontSize="12"
                fontWeight="bold"
                fill="#334155"
              >
                ১ম মাধ্যম: {m1.nameBn} (n₁ = {m1.n})
              </text>

              <text
                x="14"
                y={svgH - 17}
                fontSize="12"
                fontWeight="bold"
                fill="#334155"
              >
                ২য় মাধ্যম: {m2.nameBn} (n₂ = {m2.n})
              </text>

              {/* Boundary */}

              <line
                x1="0"
                y1={cy}
                x2={svgW}
                y2={cy}
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Normal */}

              {showNormal && (
                <g>
                  <line
                    x1={cx}
                    y1="40"
                    x2={cx}
                    y2={svgH - 35}
                    stroke="#64748b"
                    strokeWidth="1.5"
                    strokeDasharray="6 5"
                  />

                  <text
                    x={cx + 9}
                    y="48"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#64748b"
                  >
                    অভিলম্ব
                  </text>
                </g>
              )}

              {/* Incident Ray */}

              <line
                x1={incX}
                y1={incY}
                x2={cx}
                y2={cy}
                stroke="#e11d48"
                strokeWidth="3.5"
                markerEnd="url(#ray-arrow-red)"
              />

              {/* Reflected Ray */}

              <line
                x1={cx}
                y1={cy}
                x2={refX}
                y2={refY}
                stroke="#e11d48"
                strokeWidth={isTIR || isCritical ? 3.5 : 1.5}
                strokeOpacity={isTIR || isCritical ? 1 : 0.35}
                strokeDasharray={isTIR || isCritical ? undefined : '5 4'}
                markerEnd={isTIR || isCritical ? 'url(#ray-arrow-red)' : undefined}
              />

              {/* Refracted Ray */}

              {!isTIR && refractedAngle !== null && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={refrX}
                  y2={refrY}
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  markerEnd="url(#ray-arrow-blue)"
                />
              )}

              {/* Angle Arcs */}

              {showAngles && (
                <g fill="none" strokeWidth="1.5">

                  <path
                    d={incidentArc}
                    stroke="#e11d48"
                  />

                  <path
                    d={reflectedArc}
                    stroke="#e11d48"
                    strokeDasharray="3 3"
                  />

                  {!isTIR && (
                    <path
                      d={refractedArc}
                      stroke="#2563eb"
                    />
                  )}

                </g>
              )}

              {/* Incidence Point */}

              <circle
                cx={cx}
                cy={cy}
                r="5"
                fill="#0f172a"
                stroke="white"
                strokeWidth="1.5"
              />

              {/* Angle Labels */}

              {showAngles && (
                <g fontSize="12" fontWeight="bold">

                  <text
                    x={cx - 65}
                    y={cy - 42}
                    fill="#be123c"
                  >
                    i = {incidentAngle}°
                  </text>

                  <text
                    x={cx + 43}
                    y={cy - 42}
                    fill="#be123c"
                  >
                    e = {incidentAngle}°
                  </text>

                  {!isTIR && refractedAngle !== null && (
                    <text
                      x={cx + 17}
                      y={cy + 57}
                      fill="#1d4ed8"
                    >
                      r = {refractedAngle.toFixed(1)}°
                    </text>
                  )}

                  {isTIR && (
                    <text
                      x={cx + 14}
                      y={cy + 22}
                      fill="#be123c"
                    >
                      TIR
                    </text>
                  )}

                </g>
              )}

            </svg>

          </div>

          {/* DIAGRAM LEGEND */}

          <div className="flex flex-wrap gap-x-5 gap-y-2">

            {[
              { color: 'bg-rose-500', label: 'আপতিত / প্রতিফলিত রশ্মি' },
              { color: 'bg-blue-600', label: 'প্রতিসরিত রশ্মি' },
              { color: 'bg-slate-400', label: 'অভিলম্ব' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[11px] font-semibold text-slate-600"
              >
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                {item.label}
              </div>
            ))}

          </div>

          {/* DISPLAY OPTIONS */}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">

            <button
              type="button"
              onClick={() => setShowAngles(!showAngles)}
              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                showAngles
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {showAngles ? '✓ কোণ দেখানো হচ্ছে' : 'কোণ দেখাও'}
            </button>

            <button
              type="button"
              onClick={() => setShowNormal(!showNormal)}
              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                showNormal
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {showNormal ? '✓ অভিলম্ব দেখানো হচ্ছে' : 'অভিলম্ব দেখাও'}
            </button>

          </div>

          {/* PRESETS */}

          <div className="space-y-2 border-t border-slate-100 pt-4">

            <p className="text-xs font-extrabold text-slate-700">
              দ্রুত পরীক্ষা (Quick Experiments)
            </p>

            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                onClick={() => applyPreset('air', 'glass', 45)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                বায়ু → কাচ
              </button>

              <button
                type="button"
                onClick={() => applyPreset('water', 'air', 55)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
              >
                পানি → বায়ু (TIR)
              </button>

              <button
                type="button"
                onClick={() => applyPreset('diamond', 'air', 30)}
                className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
              >
                হীরা → বায়ু
              </button>

              <button
                type="button"
                onClick={() => applyPreset('glass', 'water', 30)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                কাচ → পানি
              </button>

            </div>

          </div>

        </section>

        {/* ====================================== */}
        {/* CONTROLS */}
        {/* ====================================== */}

        <section className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">

          <div>

            <h3 className="text-base font-extrabold text-slate-900">
              পরীক্ষার নিয়ন্ত্রণ
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              মাধ্যম এবং আপতন কোণ পরিবর্তন করো
            </p>

          </div>

          {/* MEDIUM SELECTORS */}

          <div className="space-y-3">

            {[
              {
                label: 'প্রথম মাধ্যম (আপতিত রশ্মি)',
                value: medium1Id,
                setter: setMedium1Id,
              },
              {
                label: 'দ্বিতীয় মাধ্যম (প্রতিসরিত রশ্মি)',
                value: medium2Id,
                setter: setMedium2Id,
              },
            ].map((item) => (
              <div key={item.label}>

                <label className="mb-2 block text-xs font-bold text-slate-600">
                  {item.label}
                </label>

                <select
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >

                  {MEDIA.map((medium) => (
                    <option key={medium.id} value={medium.id}>
                      {medium.nameBn} (n = {medium.n})
                    </option>
                  ))}

                </select>

              </div>
            ))}

          </div>

          {/* INCIDENT ANGLE */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="mb-3 flex items-center justify-between gap-2">

              <label
                htmlFor="incident-angle"
                className="text-xs font-extrabold text-slate-700"
              >
                আপতন কোণ (Angle of Incidence)
              </label>

              <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-extrabold tabular-nums text-blue-700">
                {incidentAngle}°
              </span>

            </div>

            <input
              id="incident-angle"
              type="range"
              min="0"
              max="85"
              step="1"
              value={incidentAngle}
              onChange={(e) => setIncidentAngle(Number(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />

            <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
              <span>0°</span>
              <span>45°</span>
              <span>85°</span>
            </div>

            {criticalAngle !== null && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">

                <div className="flex items-center justify-between gap-2">

                  <span className="text-xs font-bold text-amber-800">
                    সংকট কোণ (Critical Angle)
                  </span>

                  <span className="text-sm font-extrabold text-amber-700">
                    {criticalAngle.toFixed(2)}°
                  </span>

                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                  {incidentAngle > criticalAngle
                    ? 'আপতন কোণ সংকট কোণের চেয়ে বেশি। TIR ঘটছে।'
                    : incidentAngle === Math.round(criticalAngle)
                      ? 'আপতন কোণ সংকট কোণের কাছাকাছি।'
                      : 'আপতন কোণ সংকট কোণের চেয়ে কম।'}
                </p>

              </div>
            )}

          </div>

          {/* RESULTS */}

          <div>

            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />

              <h4 className="text-sm font-extrabold text-slate-900">
                পরীক্ষার ফলাফল
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <ResultCard
                label="প্রতিসরণ কোণ (r)"
                value={
                  isTIR
                    ? 'TIR'
                    : `${refractedAngle?.toFixed(2)}°`
                }
                color="blue"
              />

              <ResultCard
                label="প্রতিফলন কোণ (e)"
                value={`${incidentAngle}°`}
                color="rose"
              />

              <ResultCard
                label="প্রতিসরণাঙ্ক (n₁)"
                value={m1.n.toFixed(2)}
                color="slate"
              />

              <ResultCard
                label="প্রতিসরণাঙ্ক (n₂)"
                value={m2.n.toFixed(2)}
                color="slate"
              />

            </div>

          </div>

          {/* STATUS */}

          <div className={`rounded-xl border p-4 ${
            isTIR
              ? 'border-rose-200 bg-rose-50'
              : isCritical
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
          }`}>

            <div className="flex items-start gap-2.5">

              {isTIR ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              )}

              <div>

                <p className={`text-xs font-extrabold ${
                  isTIR ? 'text-rose-800' : isCritical ? 'text-amber-800' : 'text-emerald-800'
                }`}>
                  {opticalStatus}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  {statusDescription}
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* ====================================== */}
      {/* SNELL'S LAW CALCULATION */}
      {/* ====================================== */}

      <section className="space-y-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              স্নেলের সূত্র (Snell's Law)
            </h3>

            <p className="text-xs text-slate-500">
              আলোর প্রতিসরণের গাণিতিক সম্পর্ক
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-4 text-center">

          <p className="text-xl font-extrabold tracking-wide text-blue-800 sm:text-2xl">
            n₁ sin i = n₂ sin r
          </p>

          <p className="mt-2 text-xs text-slate-500">
            অথবা, sin r = (n₁ × sin i) / n₂
          </p>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold text-slate-500">
              sin i
            </p>

            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {sinI.toFixed(4)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold text-slate-500">
              sin r
            </p>

            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {isTIR ? '> 1' : sinR.toFixed(4)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold text-slate-500">
              আপেক্ষিক প্রতিসরণাঙ্ক
            </p>

            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {(m1.n / m2.n).toFixed(4)}
            </p>
          </div>

        </div>

        <div className="rounded-xl bg-white p-4">

          <p className="mb-2 text-xs font-extrabold text-blue-700">
            গাণিতিক প্রয়োগ
          </p>

          <div className="space-y-2 overflow-x-auto text-sm leading-relaxed text-slate-700">

            <p>
              sin r = ({m1.n} × sin {incidentAngle}°) / {m2.n}
            </p>

            <p>
              sin r = {isTIR ? '> 1' : sinR.toFixed(4)}
            </p>

            <p className="font-bold text-blue-800">
              {isTIR
                ? 'sin r > 1 হওয়ায় বাস্তব প্রতিসরণ সম্ভব নয়। তাই পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটে।'
                : `r = ${refractedAngle?.toFixed(2)}°`}
            </p>

          </div>

        </div>

      </section>

      {/* ====================================== */}
      {/* SECTION 2: LENS POWER */}
      {/* ====================================== */}

      <section className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Glasses className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                লেন্সের ক্ষমতা ক্যালকুলেটর
              </h3>

              <p className="text-xs text-slate-500">
                Convex ও Concave Lens
              </p>
            </div>

          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
            P = 1 / f
          </span>

        </div>

        {/* LENS TYPE */}

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">

          <button
            type="button"
            onClick={() => setLensType('convex')}
            className={`rounded-lg px-3 py-3 text-xs font-extrabold transition ${
              lensType === 'convex'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            উত্তল লেন্স (+)
          </button>

          <button
            type="button"
            onClick={() => setLensType('concave')}
            className={`rounded-lg px-3 py-3 text-xs font-extrabold transition ${
              lensType === 'concave'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            অবতল লেন্স (-)
          </button>

        </div>

        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">

          {/* FOCAL LENGTH */}

          <div className="space-y-4 md:col-span-6">

            <div className="flex items-center justify-between gap-2">

              <label
                htmlFor="focal-length"
                className="text-xs font-extrabold text-slate-700"
              >
                ফোকাস দূরত্ব (|f|)
              </label>

              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-700">
                {focalLengthCm} cm
              </span>

            </div>

            <input
              id="focal-length"
              type="range"
              min="10"
              max="100"
              step="5"
              value={focalLengthCm}
              onChange={(e) => setFocalLengthCm(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>10 cm</span>
              <span>55 cm</span>
              <span>100 cm</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

              <p className="text-xs font-bold text-slate-500">
                Signed Focal Length
              </p>

              <p className="mt-1 text-lg font-extrabold text-slate-900">
                {signedFocalLength.toFixed(2)} m
              </p>

            </div>

          </div>

          {/* POWER RESULT */}

          <div className="md:col-span-6">

            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">

              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">

                <Zap className="h-4 w-4" />

                লেন্সের ক্ষমতা (Power)

              </div>

              <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                {lensSign}{lensPower.toFixed(2)}
                <span className="ml-2 text-base font-bold text-emerald-700">
                  Diopter
                </span>
              </p>

              <div className="mt-4 border-t border-emerald-200 pt-3">

                <p className="text-xs font-bold text-slate-500">
                  সংশ্লিষ্ট দৃষ্টিত্রুটি
                </p>

                <p className="mt-1 text-sm font-extrabold text-emerald-800">
                  {lensType === 'convex'
                    ? 'দীর্ঘদৃষ্টি (Hypermetropia)'
                    : 'হ্রস্বদৃষ্টি (Myopia)'}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {lensType === 'convex'
                    ? 'উত্তল লেন্স আলোকরশ্মিকে অভিসারী করে। দীর্ঘদৃষ্টি সংশোধনে ব্যবহৃত হয়।'
                    : 'অবতল লেন্স আলোকরশ্মিকে অপসারী করে। হ্রস্বদৃষ্টি সংশোধনে ব্যবহৃত হয়।'}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* LENS FORMULA */}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

          <p className="mb-2 text-xs font-extrabold text-slate-700">
            গাণিতিক সমাধান
          </p>

          <div className="space-y-2 text-sm text-slate-700">

            <p>
              P = 1 / f
            </p>

            <p>
              P = 1 / ({signedFocalLength.toFixed(2)})
            </p>

            <p className="font-extrabold text-emerald-700">
              P = {lensSign}{lensPower.toFixed(2)} D
            </p>

          </div>

        </div>

      </section>

      {/* ====================================== */}
      {/* LEARNING INSIGHTS */}
      {/* ====================================== */}

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-amber-950">
              শেখার বিষয় ও গুরুত্বপূর্ণ তথ্য
            </h3>

            <p className="text-xs text-amber-700">
              পরীক্ষার জন্য মনে রাখবে
            </p>
          </div>

        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {[
            'আলো হালকা মাধ্যম থেকে ঘন মাধ্যমে গেলে অভিলম্বের দিকে বেঁকে যায়।',

            'আলো ঘন মাধ্যম থেকে হালকা মাধ্যমে গেলে অভিলম্ব থেকে দূরে বেঁকে যায়।',

            'সংকট কোণে প্রতিসরণ কোণ ৯০° হয়।',

            'আপতন কোণ সংকট কোণের বেশি হলে পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটে।',

            'উত্তল লেন্সের ক্ষমতা ধনাত্মক।',

            'অবতল লেন্সের ক্ষমতা ঋণাত্মক।',
          ].map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-white/80 p-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <p className="text-xs leading-relaxed text-slate-700">
                {tip}
              </p>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

// ==========================================
// REUSABLE RESULT CARD
// ==========================================

interface ResultCardProps {
  label: string;
  value: string;
  color?: 'blue' | 'rose' | 'slate';
}

function ResultCard({
  label,
  value,
  color = 'blue',
}: ResultCardProps) {
  const colorClasses = {
    blue: 'border-blue-100 bg-blue-50/60 text-blue-800',
    rose: 'border-rose-100 bg-rose-50/60 text-rose-800',
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
  };

  return (
    <div className={`min-w-0 rounded-xl border p-3 ${colorClasses[color]}`}>

      <p className="text-[11px] font-bold opacity-75">
        {label}
      </p>

      <p className="mt-1 break-words text-lg font-extrabold tabular-nums">
        {value}
      </p>

    </div>
  );
}
