'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Calculator,
  Flame,
  Gauge,
  RotateCcw,
  Ruler,
  SlidersHorizontal,
  Thermometer,
} from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';

type MetalOption = {
  id: string;
  name: string;
  alpha: number; // Linear expansion coefficient (K^-1)
  specificHeat: number; // J / (kg·K)
  baseColor: string;
};

const METALS: MetalOption[] = [
  {
    id: 'iron',
    name: 'লোহা (Iron)',
    alpha: 11.6e-6,
    specificHeat: 450,
    baseColor: '#64748b',
  },
  {
    id: 'copper',
    name: 'তামা (Copper)',
    alpha: 16.7e-6,
    specificHeat: 385,
    baseColor: '#c2410c',
  },
  {
    id: 'aluminum',
    name: 'অ্যালুমিনিয়াম (Al)',
    alpha: 23.0e-6,
    specificHeat: 900,
    baseColor: '#94a3b8',
  },
  {
    id: 'brass',
    name: 'পিতল (Brass)',
    alpha: 19.0e-6,
    specificHeat: 380,
    baseColor: '#ca8a04',
  },
];

const INITIAL_TEMP = 20; // °C

export default function HeatSimulationLab() {
  const [metal, setMetal] = useState<MetalOption>(METALS[2]); // Aluminum
  const [initialLength, setInitialLength] = useState(2.0); // meters
  const [mass, setMass] = useState(2.0); // kg
  const [targetTemp, setTargetTemp] = useState(220); // °C

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics Calculations
  const deltaT = targetTemp - INITIAL_TEMP; // K or °C
  const deltaL = initialLength * metal.alpha * deltaT; // meters
  const deltaLmm = deltaL * 1000; // millimeters
  const finalLength = initialLength + deltaL;
  const heatRequired = mass * metal.specificHeat * deltaT; // Joules
  const tempFahrenheit = (targetTemp * 9) / 5 + 32;
  const tempKelvin = targetTemp + 273;

  const resetDefaults = () => {
    setMetal(METALS[2]);
    setInitialLength(2.0);
    setMass(2.0);
    setTargetTemp(220);
  };

  // 2D Canvas Visualization
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

    // Fixed Wall (Left clamp)
    const wallX = 70;
    ctx.fillStyle = '#334155';
    ctx.fillRect(40, 60, 30, 120);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    for (let y = 70; y < 175; y += 15) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(55, y - 10);
      ctx.stroke();
    }

    // Rod dimensions (exaggerated visual expansion for clarity)
    const baseRodPx = 320 + initialLength * 40;
    const expansionPx = Math.min(130, deltaLmm * 6);
    const rodY = 105;
    const rodH = 30;

    // Heat glow factor (0 to 1)
    const heatRatio = Math.min(1, Math.max(0, (targetTemp - 20) / 480));

    // Base Rod (Original Length)
    ctx.fillStyle = metal.baseColor;
    ctx.fillRect(wallX, rodY, baseRodPx, rodH);

    // Thermal Glow Overlay on Rod
    if (heatRatio > 0.05) {
      ctx.fillStyle = `rgba(239, 68, 68, ${heatRatio * 0.65})`;
      ctx.fillRect(wallX, rodY, baseRodPx, rodH);
    }

    // Expanded Section (Highlighted in Bright Orange/Red)
    if (expansionPx > 0.5) {
      ctx.fillStyle = '#f97316';
      ctx.fillRect(wallX + baseRodPx, rodY, expansionPx, rodH);

      // Dashed guide line for original end
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(wallX + baseRodPx, rodY - 22);
      ctx.lineTo(wallX + baseRodPx, rodY + rodH + 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // Expansion Label
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `+ΔL = ${deltaLmm.toFixed(2)} mm`,
        wallX + baseRodPx + expansionPx / 2,
        rodY - 12
      );
    }

    // Rod Border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(wallX, rodY, baseRodPx + expansionPx, rodH);

    // Original Length Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `L₁ = ${initialLength.toFixed(1)} m (${metal.name})`,
      wallX + baseRodPx / 2,
      rodY + 19
    );

    // Burners / Flames underneath the rod
    const burnerY = 200;
    const flameHeight = 12 + heatRatio * 34;

    if (deltaT > 0) {
      for (let i = 0; i < 3; i++) {
        const bx = wallX + 90 + i * 110;
        // Burner nozzle
        ctx.fillStyle = '#475569';
        ctx.fillRect(bx - 12, burnerY, 24, 24);

        // Outer Flame
        ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
        ctx.beginPath();
        ctx.moveTo(bx - 10, burnerY);
        ctx.quadraticCurveTo(bx, burnerY - flameHeight * 1.4, bx + 10, burnerY);
        ctx.fill();

        // Inner Flame
        ctx.fillStyle = 'rgba(250, 204, 21, 0.95)';
        ctx.beginPath();
        ctx.moveTo(bx - 5, burnerY);
        ctx.quadraticCurveTo(bx, burnerY - flameHeight * 0.8, bx + 5, burnerY);
        ctx.fill();
      }
    }

    // Status Banner
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      `তাপমাত্রা: ${targetTemp}°C (${tempFahrenheit.toFixed(1)}°F | ${tempKelvin} K)`,
      20,
      28
    );

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('*ভিজ্যুয়াল বোঝার জন্য প্রসারণ অংশটি বড় করে দেখানো হয়েছে', width - 20, 28);
  }, [metal, initialLength, targetTemp, deltaT, deltaLmm, tempFahrenheit, tempKelvin]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE THERMAL LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            তাপীয় প্রসারণ ও আপেক্ষিক তাপের পরীক্ষাগার
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            ধাতু ও তাপমাত্রা পরিবর্তন করে দৈর্ঘ্য প্রসারণ এবং প্রয়োজনীয় তাপের পরিমাণ পর্যবেক্ষণ করো।
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Metal Selector */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="font-bold text-slate-800 text-sm">ধাতু নির্বাচন করো</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {METALS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetal(m)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                metal.id === m.id
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </section>

      {/* Canvas Simulation */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <canvas
            ref={canvasRef}
            width={820}
            height={240}
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* Live Telemetry */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'দৈর্ঘ্য বৃদ্ধি (ΔL)', value: deltaLmm.toFixed(3), unit: 'mm', icon: Ruler },
          { label: 'শেষ দৈর্ঘ্য (L₂)', value: finalLength.toFixed(5), unit: 'm', icon: Gauge },
          { label: 'প্রয়োজনীয় তাপ (Q)', value: (heatRequired / 1000).toFixed(2), unit: 'kJ', icon: Flame },
          { label: 'তাপমাত্রা বৃদ্ধি (ΔT)', value: deltaT.toString(), unit: 'K', icon: Thermometer },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">{item.label}</span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                {item.value}{' '}
                <span className="text-xs text-slate-500">{item.unit}</span>
              </p>
            </div>
          );
        })}
      </section>

      {/* Controls + Live Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Control Panel</h3>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <label className="font-semibold text-slate-700">শেষ তাপমাত্রা (T₂)</label>
              <span className="font-bold text-orange-600">{targetTemp} °C</span>
            </div>
            <input
              type="range"
              min={20}
              max={500}
              step={5}
              value={targetTemp}
              onChange={(e) => setTargetTemp(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <label className="font-semibold text-slate-700">আদি দৈর্ঘ্য (L₁)</label>
              <span className="font-bold text-blue-600">{initialLength.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={initialLength}
              onChange={(e) => setInitialLength(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <label className="font-semibold text-slate-700">দণ্ডের ভর (Mass)</label>
              <span className="font-bold text-emerald-600">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Live Formula Calculation</h3>
          </div>

          <div className="rounded-xl bg-orange-50/60 border border-orange-100 p-4 space-y-2 text-sm">
            <p className="text-xs font-bold text-orange-700">১. দৈর্ঘ্য প্রসারণ (ΔL = L₁αΔT)</p>
            <FormulaBox
              formula={`\\Delta L = ${initialLength.toFixed(1)} \\times (${(metal.alpha * 1e6).toFixed(1)} \\times 10^{-6}) \\times ${deltaT} = ${deltaLmm.toFixed(3)}\\text{ mm}`}
            />
          </div>

          <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 space-y-2 text-sm">
            <p className="text-xs font-bold text-blue-700">২. গৃহীত তাপ (Q = msΔT)</p>
            <FormulaBox
              formula={`Q = ${mass.toFixed(1)} \\times ${metal.specificHeat} \\times ${deltaT} = ${heatRequired.toFixed(0)}\\text{ J}`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}