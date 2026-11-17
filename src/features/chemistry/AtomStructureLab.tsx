'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Atom, Play, Pause, Sliders, Info } from 'lucide-react';
import FormulaBox from '@/components/common/FormulaBox';

interface ElementInfo {
  z: number;
  symbol: string;
  nameBn: string;
  nameEn: string;
  defaultNeutrons: number;
}

const ELEMENTS: ElementInfo[] = [
  { z: 1, symbol: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', defaultNeutrons: 0 },
  { z: 2, symbol: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', defaultNeutrons: 2 },
  { z: 3, symbol: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', defaultNeutrons: 4 },
  { z: 6, symbol: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', defaultNeutrons: 6 },
  { z: 7, symbol: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', defaultNeutrons: 7 },
  { z: 8, symbol: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', defaultNeutrons: 8 },
  { z: 11, symbol: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', defaultNeutrons: 12 },
  { z: 12, symbol: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', defaultNeutrons: 12 },
  { z: 17, symbol: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', defaultNeutrons: 18 },
];

export default function AtomStructureLab() {
  const [protons, setProtons] = useState<number>(6); // Carbon by default
  const [neutrons, setNeutrons] = useState<number>(6);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);

  // Electron Configuration across K(2), L(8), M(8) shells
  const getShellDistribution = (totalElectrons: number): number[] => {
    const shells: number[] = [];
    let remaining = totalElectrons;
    const capacities = [2, 8, 8];
    for (const cap of capacities) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, cap);
      shells.push(count);
      remaining -= count;
    }
    return shells;
  };

  const shells = getShellDistribution(protons);
  const massNumber = protons + neutrons;
  const currentElement = ELEMENTS.find((el) => el.z === protons);

  // Canvas Bohr Model Animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isRotating) {
        angleRef.current += 0.015;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Draw Electron Shells (Orbits)
      const radii = [55, 95, 135];
      const shellNames = ['K', 'L', 'M'];

      shells.forEach((electronCount, sIdx) => {
        const r = radii[sIdx];

        // Orbit Circle
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Shell Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText(shellNames[sIdx], cx + r + 4, cy);

        // Draw Electrons on this Shell
        for (let i = 0; i < electronCount; i++) {
          const speedMultiplier = (3 - sIdx) * 0.6;
          const theta = (Math.PI * 2 * i) / electronCount + angleRef.current * speedMultiplier;
          const ex = cx + r * Math.cos(theta);
          const ey = cy + r * Math.sin(theta);

          // Glow effect
          ctx.beginPath();
          ctx.arc(ex, ey, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Draw Nucleus (Protons + Neutrons cluster)
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${protons}p+`, cx, cy - 5);
      ctx.font = '11px sans-serif';
      ctx.fillText(`${neutrons}n`, cx, cy + 8);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [protons, neutrons, isRotating, shells]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Bohr Atom Viewport */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                Bohr Atomic Model
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {currentElement ? `${currentElement.nameBn} (${currentElement.symbol}) পরমাণুর গঠন` : `পারমাণবিক সংখ্যা Z = ${protons}`}
              </h3>
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold cursor-pointer"
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRotating ? 'ঘূর্ণন থামাও' : 'ঘূর্ণন চালাও'}
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex justify-center">
            <canvas ref={canvasRef} width={500} height={320} className="w-full max-w-[500px] h-[320px]" />
          </div>

          {/* Quick Element Presets */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">দ্রুত মৌল নির্বাচন করো:</p>
            <div className="flex flex-wrap gap-2">
              {ELEMENTS.map((el) => (
                <button
                  key={el.z}
                  onClick={() => {
                    setProtons(el.z);
                    setNeutrons(el.defaultNeutrons);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    protons === el.z
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  {el.z}. {el.symbol} ({el.nameBn})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls & Formula Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>পরমাণু গঠন নিয়ন্ত্রণ (Atom Builder)</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>প্রোটন / ইলেকট্রন সংখ্যা (Z)</span>
                  <span className="font-bold text-amber-600 font-sans">{protons}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={18}
                  value={protons}
                  onChange={(e) => setProtons(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>নিউট্রন সংখ্যা (N)</span>
                  <span className="font-bold text-amber-600 font-sans">{neutrons}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={22}
                  value={neutrons}
                  onChange={(e) => setNeutrons(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Shell Distribution Info */}
            <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <p className="text-xs font-bold text-amber-900">কক্ষপথের ইলেকট্রন বিন্যাস (2n² সূত্রানুসারে):</p>
              <div className="flex items-center gap-3 font-sans text-sm font-bold text-slate-800">
                <span className="px-2.5 py-1 bg-white rounded-md border border-amber-200">K: {shells[0] || 0}</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-amber-200">L: {shells[1] || 0}</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-amber-200">M: {shells[2] || 0}</span>
              </div>
            </div>
          </div>

          {/* Live Atomic Mass Calculation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
              <Info className="w-4 h-4 text-amber-600" />
              <span>ভরসংখ্যা ও কক্ষপথের সূত্র</span>
            </div>
            <div className="text-xs space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-600">ভরসংখ্যা (Mass Number, A):</p>
              <FormulaBox formula={`A = Z + N = ${protons} + ${neutrons} = ${massNumber}`} />
              <p className="font-semibold text-slate-600 pt-2">প্রতি শক্তিস্তরে সর্বোচ্চ ইলেকট্রন ধারণক্ষমতা:</p>
              <FormulaBox formula={`2n^2 \\quad (K=2, L=8, M=18)`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}