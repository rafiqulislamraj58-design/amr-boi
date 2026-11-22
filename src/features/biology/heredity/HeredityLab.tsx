'use client';

import React, { useState } from 'react';
import {
  Activity,
  Dna,
  Info,
  RotateCcw,
  Users,
} from 'lucide-react';

type DnaBase = 'A' | 'T' | 'G' | 'C';
type SpermType = 'X' | 'Y';

const COMPLEMENTARY_DNA: Record<DnaBase, DnaBase> = {
  A: 'T',
  T: 'A',
  G: 'C',
  C: 'G',
};

const COMPLEMENTARY_RNA: Record<DnaBase, 'U' | 'A' | 'C' | 'G'> = {
  A: 'U',
  T: 'A',
  G: 'C',
  C: 'G',
};

const BASE_COLORS: Record<string, string> = {
  A: 'bg-rose-100 text-rose-800 border-rose-300',
  T: 'bg-amber-100 text-amber-800 border-amber-300',
  G: 'bg-teal-100 text-teal-800 border-teal-300',
  C: 'bg-sky-100 text-sky-800 border-sky-300',
  U: 'bg-purple-100 text-purple-800 border-purple-300',
};

const DEFAULT_STRAND: DnaBase[] = ['A', 'T', 'G', 'C', 'C', 'A'];

export default function HeredityLab() {
  // Section 1: DNA Base-Pairing & RNA Simulator
  const [templateStrand, setTemplateStrand] = useState<DnaBase[]>(DEFAULT_STRAND);

  // Section 2: Human Sex Determination Simulator
  const [fatherSperm, setFatherSperm] = useState<SpermType>('X');

  const handleAddBase = (base: DnaBase) => {
    if (templateStrand.length < 8) {
      setTemplateStrand((prev) => [...prev, base]);
    }
  };

  const handleRemoveLast = () => {
    if (templateStrand.length > 1) {
      setTemplateStrand((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setTemplateStrand(DEFAULT_STRAND);
    setFatherSperm('X');
  };

  const totalHydrogenBonds = templateStrand.reduce(
    (sum, base) => sum + (base === 'A' || base === 'T' ? 2 : 3),
    0,
  );

  const isGirl = fatherSperm === 'X';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE DNA &amp; GENETICS LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            DNA ক্ষারক জোড়া ও মানব লিঙ্গ নির্ধারণ সিমুলেটর ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            DNA-এর একটি সূত্রক তৈরি করে পরিপূরক DNA ও RNA সূত্রক এবং হাইড্রোজেন বন্ধন সংখ্যা দেখো; নিচে মানব সন্তানের লিঙ্গ নির্ধারণ প্রক্রিয়া পরীক্ষা করো।
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

      {/* Section 1: DNA Base-Pairing & RNA Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              DNA ক্ষারক জোড়া (Base-Pairing) ও RNA সিমুলেটর
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            মোট হাইড্রোজেন বন্ধন: {totalHydrogenBonds}টি
          </span>
        </div>

        {/* Base Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 mr-1">
            ক্ষারক যোগ করো (সর্বোচ্চ ৮টি):
          </span>
          {(['A', 'T', 'G', 'C'] as DnaBase[]).map((base) => (
            <button
              key={base}
              type="button"
              onClick={() => handleAddBase(base)}
              disabled={templateStrand.length >= 8}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${BASE_COLORS[base]}`}
            >
              + {base}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRemoveLast}
            disabled={templateStrand.length <= 1}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer disabled:opacity-40"
          >
            শেষেরটি মুছো
          </button>
        </div>

        {/* Visual Strands */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto">
          <div className="min-w-[420px] space-y-3">
            {/* Template DNA Strand */}
            <div className="flex items-center gap-2">
              <span className="w-28 text-xs font-bold text-slate-700 shrink-0">
                মূল DNA সূত্রক:
              </span>
              <div className="flex items-center gap-2">
                {templateStrand.map((base, idx) => (
                  <div
                    key={`t-${idx}`}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-extrabold text-sm ${BASE_COLORS[base]}`}
                  >
                    {base}
                  </div>
                ))}
              </div>
            </div>

            {/* Hydrogen Bonds Row */}
            <div className="flex items-center gap-2">
              <span className="w-28 text-[11px] font-semibold text-slate-500 shrink-0">
                হাইড্রোজেন বন্ধন:
              </span>
              <div className="flex items-center gap-2">
                {templateStrand.map((base, idx) => (
                  <div
                    key={`b-${idx}`}
                    className="w-10 text-center text-xs font-extrabold text-slate-500"
                  >
                    {base === 'A' || base === 'T' ? '||' : '|||'}
                  </div>
                ))}
              </div>
            </div>

            {/* Complementary DNA Strand */}
            <div className="flex items-center gap-2">
              <span className="w-28 text-xs font-bold text-slate-700 shrink-0">
                পরিপূরক DNA:
              </span>
              <div className="flex items-center gap-2">
                {templateStrand.map((base, idx) => {
                  const comp = COMPLEMENTARY_DNA[base];
                  return (
                    <div
                      key={`c-${idx}`}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-extrabold text-sm ${BASE_COLORS[comp]}`}
                    >
                      {comp}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Corresponding mRNA Strand */}
            <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
              <span className="w-28 text-xs font-bold text-purple-800 shrink-0">
                পরিপূরক RNA:
              </span>
              <div className="flex items-center gap-2">
                {templateStrand.map((base, idx) => {
                  const rnaBase = COMPLEMENTARY_RNA[base];
                  return (
                    <div
                      key={`r-${idx}`}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-extrabold text-sm ${BASE_COLORS[rnaBase]}`}
                    >
                      {rnaBase}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            DNA-তে <strong>A = T</strong> (২টি হাইড্রোজেন বন্ধন) এবং <strong>G ≡ C</strong> (৩টি হাইড্রোজেন বন্ধন)। আর RNA-তে থাইমিন (T)-এর পরিবর্তে <strong>ইউরাসিল (U)</strong> থাকে।
          </span>
        </div>
      </section>

      {/* Section 2: Human Sex Determination Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              মানব সন্তানের লিঙ্গ নির্ধারণ (Sex Determination) সিমুলেটর
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isGirl
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}
          >
            ফলাফল: {isGirl ? 'কন্যাসন্তান (XX)' : 'পুত্রসন্তান (XY)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              মায়ের ডিম্বাণুতে সবসময় <strong>X</strong> ক্রোমোজোম থাকে। পিতার কোন শুক্রাণুটি ডিম্বাণুকে নিষিক্ত করবে তা নির্বাচন করো:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFatherSperm('X')}
                className={`p-3.5 rounded-xl text-xs font-extrabold border cursor-pointer transition-all text-left ${
                  isGirl
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[11px] opacity-85">পিতার শুক্রাণু (22 + X)</span>
                <span className="text-sm mt-0.5 block">X ক্রোমোজোম যুক্ত</span>
              </button>

              <button
                type="button"
                onClick={() => setFatherSperm('Y')}
                className={`p-3.5 rounded-xl text-xs font-extrabold border cursor-pointer transition-all text-left ${
                  !isGirl
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[11px] opacity-85">পিতার শুক্রাণু (22 + Y)</span>
                <span className="text-sm mt-0.5 block">Y ক্রোমোজোম যুক্ত</span>
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isGirl
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-sky-50/70 border-sky-200 text-sky-950'
              }`}
            >
              <strong className="block text-sm mb-1">
                মায়ের ডিম্বাণু (22 + X) + পিতার শুক্রাণু (22 + {fatherSperm}) = জাইগোট (44 + {isGirl ? 'XX' : 'XY'})
              </strong>
              {isGirl
                ? 'পিতার X-বহনকারী শুক্রাণু মায়ের X-ডিম্বাণুকে নিষিক্ত করায় XX জাইগোট তৈরি হয়েছে—অর্থাৎ কন্যাসন্তান জন্ম নেবে।'
                : 'পিতার Y-বহনকারী শুক্রাণু মায়ের X-ডিম্বাণুকে নিষিক্ত করায় XY জাইগোট তৈরি হয়েছে—অর্থাৎ পুত্রসন্তান জন্ম নেবে।'}
            </div>
          </div>

          {/* Punnett Square Visual */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-700 text-center mb-3">
              সম্ভাব্যতা ছক (৫০% কন্যা : ৫০% পুত্র)
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 font-bold text-slate-500">পিতা \ মাতা</div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 font-extrabold text-rose-700">
                X (ডিম্বাণু)
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 font-extrabold text-rose-700">
                X (ডিম্বাণু)
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 font-extrabold text-teal-700">
                X (শুক্রাণু)
              </div>
              <div
                className={`p-2.5 rounded-lg border font-extrabold ${
                  isGirl
                    ? 'bg-rose-100 border-rose-400 text-rose-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                XX (কন্যা)
              </div>
              <div
                className={`p-2.5 rounded-lg border font-extrabold ${
                  isGirl
                    ? 'bg-rose-100 border-rose-400 text-rose-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                XX (কন্যা)
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 font-extrabold text-sky-700">
                Y (শুক্রাণু)
              </div>
              <div
                className={`p-2.5 rounded-lg border font-extrabold ${
                  !isGirl
                    ? 'bg-sky-100 border-sky-400 text-sky-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                XY (পুত্র)
              </div>
              <div
                className={`p-2.5 rounded-lg border font-extrabold ${
                  !isGirl
                    ? 'bg-sky-100 border-sky-400 text-sky-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                XY (পুত্র)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}