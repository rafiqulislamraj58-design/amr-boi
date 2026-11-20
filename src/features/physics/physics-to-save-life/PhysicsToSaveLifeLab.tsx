'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  HeartPulse,
  Info,
  Radio,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

type DiagnosticToolId = 'xray' | 'ultrasound' | 'ct' | 'mri' | 'endoscopy';

interface DiagnosticToolInfo {
  id: DiagnosticToolId;
  name: string;
  principle: string;
  radiation: 'ক্ষতিকর বিকিরণ আছে' | 'ক্ষতিকর বিকিরণ নেই';
  safeInPregnancy: boolean;
  bestFor: string;
  caution: string;
}

const DIAGNOSTIC_TOOLS: DiagnosticToolInfo[] = [
  {
    id: 'xray',
    name: 'এক্স-রে (X-Ray)',
    principle: 'ক্ষুদ্র তরঙ্গদৈর্ঘ্যের তাড়িতচৌম্বক তরঙ্গ (হাড় শোষণ করে, পেশি ভেদ করে)',
    radiation: 'ক্ষতিকর বিকিরণ আছে',
    safeInPregnancy: false,
    bestFor: 'ভাঙা হাড়, দাঁতের ক্ষয়, ফুসফুসের নিউমোনিয়া বা যক্ষ্মা শনাক্তকরণ',
    caution: 'গর্ভবতী মায়েদের জন্য ঝুঁকিপূর্ণ; অপ্রয়োজনে বারবার করা উচিত নয়।',
  },
  {
    id: 'ultrasound',
    name: 'আল্ট্রাসনোগ্রাফি (Ultrasound)',
    principle: '1–10 MHz কম্পাঙ্কের শব্দোত্তর তরঙ্গের প্রতিধ্বনি (Echo)',
    radiation: 'ক্ষতিকর বিকিরণ নেই',
    safeInPregnancy: true,
    bestFor: 'গর্ভস্থ ভ্রূণের অবস্থা, পিত্তথলির পাথর, যকৃত ও কিডনির টিউমার',
    caution: 'কোনো আয়নাইজিং বিকিরণ নেই, তাই সবচেয়ে নিরাপদ পরীক্ষা।',
  },
  {
    id: 'ct',
    name: 'সিটি স্ক্যান (CT Scan)',
    principle: 'চারদিক থেকে তোলা অসংখ্য এক্স-রে ছবি + কম্পিউটারের 3D পুনর্গঠন',
    radiation: 'ক্ষতিকর বিকিরণ আছে',
    safeInPregnancy: false,
    bestFor: 'মস্তিষ্কের রক্তক্ষরণ, অভ্যন্তরীণ টিউমার ও সূক্ষ্ম প্রস্থচ্ছেদ ছবি',
    caution: 'সাধারণ এক্স-রের চেয়ে বেশি বিকিরণ ব্যবহৃত হয়।',
  },
  {
    id: 'mri',
    name: 'এমআরআই (MRI)',
    principle: 'শক্তিশালী চৌম্বক ক্ষেত্র ও রেডিও তরঙ্গ (হাইড্রোজেন প্রোটনের অনুরণন)',
    radiation: 'ক্ষতিকর বিকিরণ নেই',
    safeInPregnancy: true,
    bestFor: 'মস্তিষ্ক, সুষুম্নাকাণ্ড, লিগামেন্ট ও নরম টিস্যুর নিখুঁত ছবি',
    caution: 'শরীরে ধাতব বস্তু, ঘড়ি বা পেসমেকার থাকলে করা যাবে না।',
  },
  {
    id: 'endoscopy',
    name: 'এন্ডোস্কোপি (Endoscopy)',
    principle: 'অপটিক্যাল ফাইবারে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন',
    radiation: 'ক্ষতিকর বিকিরণ নেই',
    safeInPregnancy: true,
    bestFor: 'পাকস্থলী, খাদ্যনালী ও অন্ত্রের আলসার বা রক্তক্ষরণ সরাসরি দেখা',
    caution: 'চিকিৎসকের তত্ত্বাবধানে সরু নমনীয় নল প্রবেশ করিয়ে করা হয়।',
  },
];

const ULTRASOUND_SPEED = 1540; // m/s in human soft tissue

export default function PhysicsToSaveLifeLab() {
  // Section 1: Live ECG Monitor State
  const [bpm, setBpm] = useState<number>(72); // Beats per minute
  const [phase, setPhase] = useState<number>(0);

  // Section 2: Ultrasound Echo Depth Calculator State
  const [echoTimeMicroSec, setEchoTimeMicroSec] = useState<number>(100); // µs (100 µs = 0.0001 s)

  // Section 3: Medical Diagnostic Modality Comparator State
  const [selectedToolId, setSelectedToolId] = useState<DiagnosticToolId>('ultrasound');

  const activeTool =
    DIAGNOSTIC_TOOLS.find((t) => t.id === selectedToolId) ?? DIAGNOSTIC_TOOLS[1];

  // ECG Status
  const ecgStatus =
    bpm < 60
      ? { label: 'ধীর স্পন্দন (Bradycardia)', color: 'bg-amber-50 text-amber-800 border-amber-200' }
      : bpm > 100
      ? { label: 'দ্রুত স্পন্দন (Tachycardia / ETT অবস্থা)', color: 'bg-rose-50 text-rose-700 border-rose-200' }
      : { label: 'স্বাভাবিক হৃৎস্পন্দন (Normal)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

  const beatIntervalSec = 60 / bpm;

  // Ultrasound Depth Calculation: d = (v * t) / 2
  const echoTimeSec = echoTimeMicroSec * 1e-6;
  const depthMeters = (ULTRASOUND_SPEED * echoTimeSec) / 2;
  const depthCm = depthMeters * 100;

  // Animate ECG scrolling wave
  useEffect(() => {
    let animId = 0;
    const speed = (bpm / 60) * 1.4;
    const tick = () => {
      setPhase((prev) => (prev + speed) % 120);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [bpm]);

  // Generate P-QRS-T ECG waveform points
  const generateEcgPath = () => {
    const width = 520;
    const baseY = 95;
    const cycleWidth = Math.max(70, Math.min(180, (60 / bpm) * 120));
    const points: string[] = [];

    for (let x = 0; x <= width; x += 2) {
      const localX = ((x + phase * 2) % cycleWidth) / cycleWidth; // 0 to 1
      let yOffset = 0;

      // P wave
      if (localX > 0.12 && localX < 0.22) {
        yOffset = -10 * Math.sin(((localX - 0.12) / 0.1) * Math.PI);
      }
      // Q dip
      else if (localX >= 0.26 && localX < 0.29) {
        yOffset = 10 * Math.sin(((localX - 0.26) / 0.03) * Math.PI);
      }
      // R sharp spike
      else if (localX >= 0.29 && localX < 0.34) {
        yOffset = -62 * Math.sin(((localX - 0.29) / 0.05) * Math.PI);
      }
      // S dip
      else if (localX >= 0.34 && localX < 0.38) {
        yOffset = 18 * Math.sin(((localX - 0.34) / 0.04) * Math.PI);
      }
      // T wave
      else if (localX > 0.48 && localX < 0.64) {
        yOffset = -16 * Math.sin(((localX - 0.48) / 0.16) * Math.PI);
      }

      points.push(`${x},${(baseY + yOffset).toFixed(1)}`);
    }

    return points.join(' ');
  };

  const handleReset = () => {
    setBpm(72);
    setEchoTimeMicroSec(100);
    setSelectedToolId('ultrasound');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE BIOPHYSICS &amp; MEDICAL DIAGNOSTICS LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            লাইভ ইসিজি (ECG) মনিটর, আল্ট্রাসাউন্ড ও মেডিকেল ডায়াগনস্টিক ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            হৃৎস্পন্দনের হার পরিবর্তন করে ECG তরঙ্গ, প্রতিধ্বনি থেকে অঙ্গের গভীরতা এবং বিভিন্ন মেডিকেল যন্ত্রের তুলনা দেখো।
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট</span>
        </button>
      </div>

      {/* Section 1: Live ECG Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">
                লাইভ ইসিজি (ECG) মনিটর
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ecgStatus.color}`}>
              {ecgStatus.label}
            </span>
          </div>

          {/* Dark Medical Monitor SVG */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3">
            <svg
              viewBox="0 0 520 150"
              className="w-full h-auto block"
              role="img"
              aria-label="লাইভ ইসিজি তরঙ্গচিত্র"
            >
              {/* Subtle Medical Grid */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 40}
                  y1={0}
                  x2={i * 40}
                  y2={150}
                  stroke="#064e3b"
                  strokeWidth={0.8}
                />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 35}
                  x2={520}
                  y2={i * 35}
                  stroke="#064e3b"
                  strokeWidth={0.8}
                />
              ))}

              {/* ECG Trace */}
              <polyline
                points={generateEcgPath()}
                fill="none"
                stroke="#10b981"
                strokeWidth={2.6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Top-right BPM readout */}
              <text x={508} y={24} textAnchor="end" fontSize={14} fontWeight="bold" fill="#34d399">
                ♥ {bpm} BPM
              </text>
              <text x={12} y={22} fontSize={10.5} fontWeight="bold" fill="#6ee7b7">
                LEAD II • P-QRS-T COMPLEX
              </text>
            </svg>
          </div>

          {/* Quick ECG Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBpm(52)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer"
            >
              বিশ্রাম / ধীর (52 BPM)
            </button>
            <button
              type="button"
              onClick={() => setBpm(72)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer"
            >
              স্বাভাবিক (72 BPM)
            </button>
            <button
              type="button"
              onClick={() => setBpm(130)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
            >
              ব্যায়াম / ETT (130 BPM)
            </button>
          </div>
        </section>

        {/* Right: BPM Controls & Ultrasound Depth Calculator */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
          {/* BPM Control */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-base">হৃৎস্পন্দন নিয়ন্ত্রণ</h3>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">হৃৎস্পন্দনের হার (Heart Rate):</span>
              <span className="text-rose-600">{bpm} বিট/মিনিট</span>
            </div>
            <input
              type="range"
              min={40}
              max={160}
              step={2}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-xs text-slate-500">
              দুটি স্পন্দনের মধ্যবর্তী সময়কাল (T) = <strong>{beatIntervalSec.toFixed(2)} সেকেন্ড</strong>
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Ultrasound Depth Calculator */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                আল্ট্রাসাউন্ড গভীরতা ক্যালকুলেটর (d = v × t / 2)
              </h3>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">প্রতিধ্বনি ফেরার সময় (t):</span>
                <span className="text-blue-700">
                  {echoTimeMicroSec} µs ({echoTimeSec.toFixed(6)} s)
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={260}
                step={10}
                value={echoTimeMicroSec}
                onChange={(e) => setEchoTimeMicroSec(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-700">অঙ্গের গভীরতা (d)</p>
                <p className="text-xs text-slate-500">টিস্যুতে বেগ v = 1540 m/s</p>
              </div>
              <p className="text-xl font-black text-slate-900">
                {depthCm.toFixed(2)} cm
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Interactive Medical Diagnostic Modality Comparator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">
            রোগ নির্ণয়ের আধুনিক যন্ত্রপাতি তুলনা (Interactive Diagnostic Guide)
          </h3>
        </div>

        {/* Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {DIAGNOSTIC_TOOLS.map((tool) => {
            const isSelected = tool.id === selectedToolId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setSelectedToolId(tool.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tool.name}
              </button>
            );
          })}
        </div>

        {/* Active Tool Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">
                {activeTool.name}
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  activeTool.safeInPregnancy
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {activeTool.radiation}
              </span>
            </div>

            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">কার্যনীতি: </strong>
              {activeTool.principle}
            </p>
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">প্রধান ব্যবহার: </strong>
              {activeTool.bestFor}
            </p>
          </div>

          <div className="md:col-span-4 p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <ShieldCheck
                className={`w-4 h-4 ${
                  activeTool.safeInPregnancy ? 'text-emerald-600' : 'text-amber-600'
                }`}
              />
              <span>সতর্কতা ও নিরাপত্তা</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeTool.caution}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-950 leading-relaxed">
            <strong>পরীক্ষার টিপস:</strong> গর্ভবতী মায়েদের জন্য <strong>আল্ট্রাসনোগ্রাফি</strong> সবচেয়ে নিরাপদ, ভাঙা হাড় দেখতে <strong>এক্স-রে</strong>, নরম টিস্যু বা মস্তিষ্কের জন্য <strong>এমআরআই</strong> এবং পাকস্থলী দেখতে <strong>এন্ডোস্কোপি</strong> ব্যবহৃত হয়।
          </p>
        </div>
      </section>
    </div>
  );
}