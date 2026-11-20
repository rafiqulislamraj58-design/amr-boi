
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AudioWaveform,
  CheckCircle2,
  Clock3,
  Info,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  Sparkles,
  Thermometer,
  Volume2,
  Waves,
  Wind,
} from 'lucide-react';

type WaveMode = 'transverse' | 'longitudinal';

interface WaveState {
  waveMode: WaveMode;
  amplitude: number;
  frequency: number;
  waveSpeed: number;
  isPlaying: boolean;
}

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'violet' | 'slate';
  description?: string;
}

function MetricCard({
  label,
  value,
  unit,
  icon,
  variant = 'blue',
  description,
}: MetricCardProps) {
  const styles = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    violet: 'bg-violet-50 border-violet-100 text-violet-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
  };

  return (
    <div className={`rounded-xl border p-3.5 ${styles[variant]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold opacity-80">{label}</p>
        <span className="opacity-80">{icon}</span>
      </div>

      <p className="mt-2 text-xl font-extrabold text-slate-900 tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-bold text-slate-500">
            {unit}
          </span>
        )}
      </p>

      {description && (
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default function WavesAndSoundLab() {
  // ==========================================
  // 01. WAVE SIMULATOR STATE
  // ==========================================

  const [waveMode, setWaveMode] = useState<WaveMode>('transverse');
  const [amplitude, setAmplitude] = useState<number>(45);
  const [frequency, setFrequency] = useState<number>(2);
  const [waveSpeed, setWaveSpeed] = useState<number>(340);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // ==========================================
  // 02. ECHO & TEMPERATURE STATE
  // ==========================================

  const [temperature, setTemperature] = useState<number>(25);
  const [reflectorDistance, setReflectorDistance] = useState<number>(20);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef<WaveState>({
    waveMode,
    amplitude,
    frequency,
    waveSpeed,
    isPlaying,
  });

  useEffect(() => {
    stateRef.current = {
      waveMode,
      amplitude,
      frequency,
      waveSpeed,
      isPlaying,
    };
  }, [waveMode, amplitude, frequency, waveSpeed, isPlaying]);

  // ==========================================
  // 03. PHYSICS CALCULATIONS
  // ==========================================

  // Actual frequency: 100 Hz - 500 Hz
  const audioFreqHz = frequency * 100;

  // Wave equation: v = fλ
  const wavelength = waveSpeed / audioFreqHz;

  // Time period: T = 1/f
  const period = 1 / audioFreqHz;

  // Sound speed in air: v = 330 + 0.6t
  const soundSpeedAtTemp = 330 + 0.6 * temperature;

  // Echo time: t = 2d/v
  const echoTime = (2 * reflectorDistance) / soundSpeedAtTemp;

  // Minimum reflector distance for distinct echo
  // Human hearing persistence ≈ 0.1 second
  const minEchoDistance = (soundSpeedAtTemp * 0.1) / 2;

  const canHearEcho = echoTime >= 0.1;

  const distanceDifference = reflectorDistance - minEchoDistance;

  // ==========================================
  // 04. CANVAS WAVE ANIMATION
  // ==========================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    let phase = 0;
    let animationId = 0;

    const render = () => {
      const {
        waveMode: mode,
        amplitude: amp,
        frequency: freq,
        waveSpeed: speed,
        isPlaying: playing,
      } = stateRef.current;

      const actualFrequency = freq * 100;

      // Keep animation speed proportional to selected frequency.
      if (playing) {
        phase += 0.035 * (actualFrequency / 200);
      }

      // Background
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = '#e2e8f0';
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

      // Equilibrium line
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);

      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      ctx.setLineDash([]);

      // Convert physical wavelength into a schematic pixel scale.
      // 40 px represents approximately 1 meter in this visualization.
      const wavelengthPx = Math.max(
        32,
        Math.min(260, (speed / actualFrequency) * 40),
      );

      const k = (2 * Math.PI) / wavelengthPx;

      if (mode === 'transverse') {
        // --------------------------------------
        // TRANSVERSE WAVE
        // --------------------------------------

        // Main wave
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        for (let x = 0; x <= width; x += 2) {
          const y = midY - amp * Math.sin(k * x - phase);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();

        // Medium particles
        const particlePositions: number[] = [];

        for (let x = 20; x < width; x += 28) {
          particlePositions.push(x);
        }

        particlePositions.forEach((x, index) => {
          const y = midY - amp * Math.sin(k * x - phase);
          const isHighlighted = index === 10;

          ctx.beginPath();
          ctx.arc(x, y, isHighlighted ? 6 : 4.5, 0, Math.PI * 2);

          ctx.fillStyle = isHighlighted ? '#e11d48' : '#1d4ed8';
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Highlight particle movement
          if (isHighlighted) {
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);

            ctx.beginPath();
            ctx.moveTo(x, y - 28);
            ctx.lineTo(x, y + 28);
            ctx.stroke();

            ctx.setLineDash([]);
          }
        });

        // Direction arrow
        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('তরঙ্গের দিক →', width - 125, 22);
      } else {
        // --------------------------------------
        // LONGITUDINAL WAVE
        // --------------------------------------

        const rows = 5;
        const cols = 38;

        const dx = (width - 40) / (cols - 1);
        const dy = 26;

        const startY = midY - ((rows - 1) * dy) / 2;

        // Draw particles moving parallel to wave direction.
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const baseX = 20 + c * dx;

            const shift =
              (amp * 0.32) * Math.sin(k * baseX - phase);

            const px = baseX + shift;
            const py = startY + r * dy;

            const isHighlighted = c === 19 && r === 2;

            ctx.beginPath();
            ctx.arc(
              px,
              py,
              isHighlighted ? 6 : 4.5,
              0,
              Math.PI * 2,
            );

            ctx.fillStyle = isHighlighted ? '#e11d48' : '#0284c7';
            ctx.fill();

            if (isHighlighted) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }

        // Compression / rarefaction labels
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#0369a1';
        ctx.fillText('সংকোচন', 70, 28);
        ctx.fillText('প্রসারণ', 250, 28);
        ctx.fillText('সংকোচন', 430, 28);

        // Direction arrow
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('তরঙ্গের দিক →', width - 125, height - 12);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // ==========================================
  // 05. RESET
  // ==========================================

  const handleReset = () => {
    setWaveMode('transverse');
    setAmplitude(45);
    setFrequency(2);
    setWaveSpeed(340);
    setIsPlaying(true);
    setTemperature(25);
    setReflectorDistance(20);
  };

  // ==========================================
  // 06. RANGE INPUT COMPONENT
  // ==========================================

  const RangeControl = ({
    label,
    value,
    min,
    max,
    step = 1,
    unit,
    color = 'blue',
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit: string;
    color?: 'blue' | 'emerald';
    onChange: (value: number) => void;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-600">
            {label}
          </label>

          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-800 tabular-nums">
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
          aria-label={label}
          className={`w-full cursor-pointer ${
            color === 'blue' ? 'accent-blue-600' : 'accent-emerald-600'
          }`}
          style={{
            background: `linear-gradient(to right, ${
              color === 'blue' ? '#2563eb' : '#059669'
            } ${percentage}%, #e2e8f0 ${percentage}%)`,
          }}
        />

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    );
  };

  // ==========================================
  // 07. MAIN UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/50 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-blue-700">
              <Activity className="h-3.5 w-3.5" />
              INTERACTIVE PHYSICS LAB
            </div>

            <h2 className="mt-3 text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">
              2D তরঙ্গ সিমুলেটর ও প্রতিধ্বনি ল্যাব
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              তরঙ্গের বিস্তার, কম্পাঙ্ক ও বেগ পরিবর্তন করে তরঙ্গের আচরণ
              পর্যবেক্ষণ করো। পাশাপাশি তাপমাত্রা অনুযায়ী শব্দের বেগ ও
              প্রতিধ্বনি নির্ণয় করো।
            </p>
          </div>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((previous) => !previous)}
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isPlaying ? 'থামাও' : 'চালাও'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              রিসেট
            </button>
          </div>
        </div>
      </div>

      {/* ======================================
          SECTION 01: WAVE SIMULATOR
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        {/* Wave Visualization */}

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-8">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <AudioWaveform className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  তরঙ্গ প্রবাহ সিমুলেশন
                </h3>
                <p className="text-[11px] text-slate-500">
                  Wave motion visualization
                </p>
              </div>
            </div>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              {isPlaying ? '● Live Animation' : 'Ⅱ Paused'}
            </span>
          </div>

          {/* Wave Type Selector */}

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setWaveMode('transverse')}
              aria-pressed={waveMode === 'transverse'}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                waveMode === 'transverse'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Waves className="mr-1.5 inline h-4 w-4" />
              অনুপ্রস্থ তরঙ্গ
            </button>

            <button
              type="button"
              onClick={() => setWaveMode('longitudinal')}
              aria-pressed={waveMode === 'longitudinal'}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition ${
                waveMode === 'longitudinal'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <AudioWaveform className="mr-1.5 inline h-4 w-4" />
              অনুদৈর্ঘ্য তরঙ্গ
            </button>
          </div>

          {/* Canvas */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <canvas
              ref={canvasRef}
              width={720}
              height={260}
              role="img"
              aria-label={
                waveMode === 'transverse'
                  ? 'Animated transverse wave visualization'
                  : 'Animated longitudinal wave visualization'
              }
              className="block h-auto w-full"
            />
          </div>

          {/* Legend */}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
              পর্যবেক্ষণাধীন কণা
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              মাধ্যমের কণা
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-slate-400" />
              সাম্য অবস্থান
            </span>
          </div>

          {/* Educational Explanation */}

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

              <div>
                <p className="text-xs font-extrabold text-blue-900">
                  {waveMode === 'transverse'
                    ? 'অনুপ্রস্থ তরঙ্গ'
                    : 'অনুদৈর্ঘ্য তরঙ্গ'}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-900/80">
                  {waveMode === 'transverse'
                    ? 'এখানে মাধ্যমের কণাগুলো তরঙ্গের গতির দিকের লম্বভাবে কম্পিত হয়। তরঙ্গ সামনে এগিয়ে যায়, কিন্তু কণাগুলো সাম্য অবস্থানের চারপাশে দোলন করে।'
                    : 'এখানে মাধ্যমের কণাগুলো তরঙ্গের গতির দিকের সমান্তরালে সামনে-পেছনে কম্পিত হয়। ফলে সংকোচন ও প্রসারণ সৃষ্টি হয়।'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-slate-400">
            দ্রষ্টব্য: এটি ধারণাগত 2D সিমুলেশন। কণার আকার, দূরত্ব ও
            কম্পনের মাত্রা বাস্তব জগতের সঙ্গে সরাসরি স্কেল করা নয়।
          </p>
        </section>

        {/* Controls */}

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-4">

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                সিমুলেশন নিয়ন্ত্রণ
              </h3>
              <p className="text-[11px] text-slate-500">
                Change the wave parameters
              </p>
            </div>
          </div>

          <RangeControl
            label="বিস্তার (A)"
            value={amplitude}
            min={15}
            max={75}
            unit="px"
            onChange={setAmplitude}
          />

          <div className="h-px bg-slate-100" />

          <RangeControl
            label="কম্পাঙ্ক (f)"
            value={frequency}
            min={1}
            max={5}
            step={0.5}
            unit="× 100 Hz"
            onChange={setFrequency}
          />

          <div className="h-px bg-slate-100" />

          <RangeControl
            label="তরঙ্গের বেগ (v)"
            value={waveSpeed}
            min={300}
            max={500}
            step={10}
            unit="m/s"
            onChange={setWaveSpeed}
          />

          {/* Formula */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Wave Equation
            </p>

            <p className="mt-1 text-center text-lg font-extrabold text-slate-900">
              v = f × λ
            </p>

            <p className="text-center text-[10px] text-slate-500">
              λ = v / f
            </p>
          </div>

          {/* Wave Telemetry */}

          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard
              label="তরঙ্গদৈর্ঘ্য (λ)"
              value={wavelength.toFixed(2)}
              unit="m"
              icon={<Ruler className="h-4 w-4" />}
              variant="blue"
              description="λ = v / f"
            />

            <MetricCard
              label="পর্যায়কাল (T)"
              value={period.toFixed(4)}
              unit="s"
              icon={<Clock3 className="h-4 w-4" />}
              variant="violet"
              description="T = 1 / f"
            />
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <p className="text-[11px] font-bold text-emerald-800">
              বর্তমান কম্পাঙ্ক
            </p>

            <p className="mt-1 text-xl font-extrabold text-emerald-700 tabular-nums">
              {audioFreqHz} Hz
            </p>

            <p className="mt-1 text-[10px] text-emerald-800/70">
              প্রতি সেকেন্ডে {audioFreqHz} বার পূর্ণ কম্পন
            </p>
          </div>
        </section>
      </div>

      {/* ======================================
          SECTION 02: ECHO CALCULATOR
      ====================================== */}

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <Volume2 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                প্রতিধ্বনি ও তাপমাত্রায় শব্দের বেগ
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Echo & Temperature Calculator
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${
              canHearEcho
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {canHearEcho ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Info className="h-3.5 w-3.5" />
            )}

            {canHearEcho
              ? 'প্রতিধ্বনি শোনা যাবে'
              : 'পৃথক প্রতিধ্বনি শোনা যাবে না'}
          </span>
        </div>

        {/* Controls */}

        <div className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2">

          <RangeControl
            label="বায়ুর তাপমাত্রা (t)"
            value={temperature}
            min={0}
            max={50}
            unit="°C"
            color="emerald"
            onChange={setTemperature}
          />

          <RangeControl
            label="প্রতিফলকের দূরত্ব (d)"
            value={reflectorDistance}
            min={5}
            max={100}
            unit="m"
            color="emerald"
            onChange={setReflectorDistance}
          />
        </div>

        {/* Formula */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Speed of Sound
            </p>

            <p className="mt-2 text-lg font-extrabold text-slate-900">
              v = 330 + 0.6t
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              বায়ুর তাপমাত্রা অনুযায়ী শব্দের বেগ
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Echo Time
            </p>

            <p className="mt-2 text-lg font-extrabold text-slate-900">
              Δt = 2d / v
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              শব্দের যাওয়া ও ফিরে আসার মোট সময়
            </p>
          </div>
        </div>

        {/* Results */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="শব্দের বেগ"
            value={soundSpeedAtTemp.toFixed(1)}
            unit="m/s"
            icon={<Wind className="h-4 w-4" />}
            variant="emerald"
            description={`${temperature}°C তাপমাত্রায়`}
          />

          <MetricCard
            label="প্রতিধ্বনির সময়"
            value={echoTime.toFixed(3)}
            unit="s"
            icon={<Clock3 className="h-4 w-4" />}
            variant="blue"
            description="শব্দের যাওয়া-আসার সময়"
          />

          <MetricCard
            label="ন্যূনতম দূরত্ব"
            value={minEchoDistance.toFixed(2)}
            unit="m"
            icon={<Ruler className="h-4 w-4" />}
            variant="violet"
            description="পৃথক প্রতিধ্বনি শোনার জন্য"
          />
        </div>

        {/* Echo Analysis */}

        <div
          className={`rounded-xl border p-4 ${
            canHearEcho
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-rose-200 bg-rose-50/70'
          }`}
        >
          <div className="flex items-start gap-3">
            {canHearEcho ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            )}

            <div>
              <h4
                className={`text-sm font-extrabold ${
                  canHearEcho ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {canHearEcho
                  ? 'প্রতিধ্বনি শোনার শর্ত পূরণ হয়েছে!'
                  : 'প্রতিফলক আরও দূরে নিতে হবে'}
              </h4>

              <p
                className={`mt-1 text-xs leading-relaxed ${
                  canHearEcho ? 'text-emerald-900/80' : 'text-rose-900/80'
                }`}
              >
                {canHearEcho
                  ? `বর্তমান দূরত্ব ${reflectorDistance} m এবং শব্দের ফিরে আসতে ${echoTime.toFixed(3)} s সময় লাগে। এটি 0.1 s বা তার বেশি, তাই পৃথক প্রতিধ্বনি শোনা সম্ভব।`
                  : `বর্তমান দূরত্ব ${reflectorDistance} m। প্রতিধ্বনি আলাদা করে শুনতে অন্তত ${minEchoDistance.toFixed(2)} m দূরত্ব প্রয়োজন। আরও ${(minEchoDistance - reflectorDistance).toFixed(2)} m দূরে প্রতিফলক স্থাপন করতে হবে।`}
              </p>
            </div>
          </div>

          {/* Distance Comparison */}

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>প্রয়োজনীয় দূরত্ব</span>
              <span>বর্তমান দূরত্ব</span>
            </div>

            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/80">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  canHearEcho ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (reflectorDistance / minEchoDistance) * 100,
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 m</span>
              <span>{minEchoDistance.toFixed(2)} m প্রয়োজন</span>
            </div>
          </div>
        </div>

        {/* Educational Note */}

        <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <div>
            <p className="text-xs font-extrabold text-blue-900">
              প্রতিধ্বনি শোনার মূল শর্ত
            </p>

            <p className="mt-1 text-xs leading-relaxed text-blue-900/80">
              মানুষের কানে শব্দের স্থায়িত্ব বা শ্রবণানুভূতির স্থায়িত্ব
              প্রায় 0.1 s। তাই মূল শব্দ ও প্রতিফলিত শব্দের মধ্যে অন্তত
              0.1 s ব্যবধান থাকা প্রয়োজন। এজন্য প্রতিফলকের ন্যূনতম
              দূরত্ব d = v × 0.1 / 2।
            </p>
          </div>
        </div>

        {/* Extra Learning */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-rose-500" />
              <p className="text-xs font-bold text-slate-700">
                তাপমাত্রার প্রভাব
              </p>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              বায়ুর তাপমাত্রা বৃদ্ধি পেলে সাধারণত শব্দের বেগ বৃদ্ধি পায়।
              প্রতি 1°C তাপমাত্রা বৃদ্ধিতে বেগ প্রায় 0.6 m/s বৃদ্ধি পায়।
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-bold text-slate-700">
                প্রতিধ্বনির ব্যবহার
              </p>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              পাহাড়ে দূরত্ব নির্ণয়, SONAR-এর মাধ্যমে সমুদ্রের গভীরতা
              নির্ণয় এবং বিভিন্ন বস্তু শনাক্ত করতে প্রতিফলিত শব্দ
              ব্যবহার করা হয়।
            </p>
          </div>
        </div>
      </section>

      {/* ======================================
          FOOTER
      ====================================== */}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <p className="text-[11px] font-bold text-slate-700">
            Waves & Sound Interactive Lab
          </p>
        </div>

        <p className="text-[10px] text-slate-400">
          Physics • Class 9–10
        </p>
      </div>
    </div>
  );
}
