
'use client';

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  BookOpen,
  Microscope,
  Info,
  ChevronRight,
} from 'lucide-react';

interface Organelle {
  id: string;
  nameBn: string;
  nameEn: string;
  role: string;
  description: string;
  color: string;
  x: number;
  y: number;
}
import PlantCellDiagram from '../../components/learning/PlantCellDiagram';
const ORGANELLES: Organelle[] = [
  {
    id: 'nucleus',
    nameBn: 'নিউক্লিয়াস',
    nameEn: 'Nucleus',
    role: 'কোষের নিয়ন্ত্রণ কেন্দ্র',
    description:
      'নিউক্লিয়াস কোষের যাবতীয় কার্যক্রম নিয়ন্ত্রণ করে। এর মধ্যে DNA ও ক্রোমোজোম থাকে, যা বংশগত বৈশিষ্ট্য বহন করে।',
    color: '#a855f7',
    x: 45.5,
    y: 46,
  },
  {
    id: 'vacuole',
    nameBn: 'কোষ গহ্বর',
    nameEn: 'Central Vacuole',
    role: 'পানি ও কোষরস সঞ্চয়কারী',
    description:
      'বড় কেন্দ্রীয় কোষ গহ্বর পানি, খনিজ লবণ ও কোষরস সঞ্চয় করে। এটি উদ্ভিদ কোষের স্ফীতি বজায় রাখতে সাহায্য করে।',
    color: '#38bdf8',
    x: 32,
    y: 44,
  },
  {
    id: 'mitochondria',
    nameBn: 'মাইটোকন্ড্রিয়া',
    nameEn: 'Mitochondria',
    role: 'কোষের শক্তিঘর',
    description:
      'মাইটোকন্ড্রিয়ায় কোষীয় শ্বসনের মাধ্যমে ATP উৎপন্ন হয়। এর ভেতরের ঝিল্লির ভাঁজকে Cristae বলা হয়।',
    color: '#ef4444',
    x: 42,
    y: 19,
  },
  {
    id: 'chloroplast',
    nameBn: 'ক্লোরোপ্লাস্ট',
    nameEn: 'Chloroplast',
    role: 'সালোকসংশ্লেষণের স্থান',
    description:
      'ক্লোরোপ্লাস্টে ক্লোরোফিল থাকে। এটি সূর্যালোক ব্যবহার করে সালোকসংশ্লেষণের মাধ্যমে খাদ্য তৈরি করে।',
    color: '#16a34a',
    x: 26,
    y: 56,
  },
  {
    id: 'golgi',
    nameBn: 'গলজি বডি',
    nameEn: 'Golgi Apparatus',
    role: 'প্রোটিন ও লিপিড প্যাকেজিং',
    description:
      'গলজি বডি প্রোটিন ও লিপিড পরিবর্তন, সাজানো এবং প্যাকেজিং করে কোষের প্রয়োজনীয় স্থানে পাঠায়।',
    color: '#f59e0b',
    x: 44,
    y: 32,
  },
  {
    id: 'er',
    nameBn: 'এন্ডোপ্লাজমিক রেটিকুলাম',
    nameEn: 'Endoplasmic Reticulum',
    role: 'অভ্যন্তরীণ পরিবহন ব্যবস্থা',
    description:
      'Rough ER প্রোটিন সংশ্লেষণে এবং Smooth ER লিপিড সংশ্লেষণসহ বিভিন্ন কাজে অংশগ্রহণ করে।',
    color: '#8b5cf6',
    x: 52,
    y: 30,
  },
  {
    id: 'cellwall',
    nameBn: 'কোষপ্রাচীর',
    nameEn: 'Cell Wall',
    role: 'কোষের দৃঢ় বাইরের আবরণ',
    description:
      'কোষপ্রাচীর উদ্ভিদ কোষকে নির্দিষ্ট আকৃতি, দৃঢ়তা ও সুরক্ষা প্রদান করে। এটি প্রধানত সেলুলোজ দিয়ে গঠিত।',
    color: '#0d9488',
    x: 20,
    y: 38,
  },
  {
    id: 'membrane',
    nameBn: 'কোষঝিল্লি',
    nameEn: 'Cell Membrane',
    role: 'পদার্থ চলাচল নিয়ন্ত্রণকারী',
    description:
      'কোষঝিল্লি কোষের ভেতরে ও বাইরে পদার্থের চলাচল নিয়ন্ত্রণ করে। এটি নির্বাচনী ভেদ্য।',
    color: '#14b8a6',
    x: 19,
    y: 64,
  },
  {
    id: 'cytoplasm',
    nameBn: 'সাইটোপ্লাজম',
    nameEn: 'Cytoplasm',
    role: 'কোষের অভ্যন্তরীণ তরল মাধ্যম',
    description:
      'সাইটোপ্লাজমে কোষের বিভিন্ন অঙ্গাণু অবস্থান করে। এখানে অনেক গুরুত্বপূর্ণ বিপাকীয় বিক্রিয়া ঘটে।',
    color: '#84cc16',
    x: 39,
    y: 72,
  },
];

export default function CellTwoDExplorer() {
  const [selectedId, setSelectedId] = useState('nucleus');
  const [zoom, setZoom] = useState(1);
  const [showMarkers, setShowMarkers] = useState(true);

  const selected =
    ORGANELLES.find((item) => item.id === selectedId) || ORGANELLES[0];

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.8));
  const resetZoom = () => setZoom(1);

  return (
    <div className="w-full space-y-5">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
            <Microscope size={16} />
            Interactive Biology Lab
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            উদ্ভিদ কোষের গঠন
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ছবির বিভিন্ন অংশে ক্লিক করে অঙ্গাণুগুলো সম্পর্কে জানো।
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          2D Interactive Diagram
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

        {/* DIAGRAM */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-8">

          {/* TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Plant Cell Diagram
              </h3>
              <p className="text-xs text-slate-400">
                Select an organelle to explore
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.8}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                aria-label="Zoom out"
              >
                <ZoomOut size={17} />
              </button>

              <span className="min-w-14 text-center text-xs font-bold text-slate-600">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={zoomIn}
                disabled={zoom >= 2.2}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                aria-label="Zoom in"
              >
                <ZoomIn size={17} />
              </button>

              <button
                onClick={resetZoom}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Reset zoom"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setShowMarkers(!showMarkers)}
                className={`rounded-lg border p-2 ${
                  showMarkers
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500'
                }`}
                aria-label="Toggle markers"
              >
                <Eye size={17} />
              </button>
            </div>
          </div>

          {/* IMAGE VIEW */}
          <div className="overflow-auto bg-slate-50 p-3 sm:p-5">
            <div className="mx-auto w-full max-w-[800px]">
              <div
                className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-sm"
                style={{
                  aspectRatio: '800 / 542',
                  minWidth: zoom > 1.2 ? `${zoom * 100}%` : '100%',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    transition: 'transform 250ms ease',
                  }}
                >
                  <PlantCellDiagram
  selectedId={selectedId}
  showMarkers={showMarkers}
  onSelect={setSelectedId}
/>

                  {/* INTERACTIVE HOTSPOTS */}
                  {showMarkers &&
                    ORGANELLES.map((org, index) => {
                      const active = selectedId === org.id;

                      return (
                        <button
                          key={org.id}
                          onClick={() => setSelectedId(org.id)}
                          title={org.nameBn}
                          aria-label={org.nameBn}
                          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200"
                          style={{
                            left: `${org.x}%`,
                            top: `${org.y}%`,
                            width: active ? 29 : 22,
                            height: active ? 29 : 22,
                            backgroundColor: org.color,
                            border: '3px solid white',
                            boxShadow: active
                              ? `0 0 0 5px ${org.color}55, 0 0 15px ${org.color}`
                              : '0 2px 7px #0005',
                          }}
                        >
                          <span className="text-[9px] font-black text-white">
                            {index + 1}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE FOOTER */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              <span className="font-bold text-emerald-600">●</span>
              {' '}নম্বরযুক্ত অংশে ক্লিক করে নির্বাচন করো
            </p>

            <span className="text-xs font-semibold text-slate-400">
              {ORGANELLES.length} Interactive Parts
            </span>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="space-y-4 xl:col-span-4">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5" style={{
              background: `linear-gradient(135deg, ${selected.color}20, white)`,
            }}>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Info size={15} />
                Selected Organelle
              </div>

              <div
                className="mb-3 h-1.5 w-12 rounded-full"
                style={{ backgroundColor: selected.color }}
              />

              <h3 className="text-2xl font-black text-slate-900">
                {selected.nameBn}
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {selected.nameEn}
              </p>

              <div className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                {selected.role}
              </div>
            </div>

            <div className="p-5">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <BookOpen size={15} />
                বিস্তারিত আলোচনা
              </h4>

              <p className="text-sm leading-7 text-slate-700">
                {selected.description}
              </p>
            </div>
          </div>

          {/* ORGANELLE LIST */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-black text-slate-900">
              অঙ্গাণুর তালিকা
            </h3>

            <div className="max-h-[390px] space-y-2 overflow-y-auto pr-1">
              {ORGANELLES.map((org, index) => {
                const active = selectedId === org.id;

                return (
                  <button
                    key={org.id}
                    onClick={() => setSelectedId(org.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      active
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                      style={{ backgroundColor: org.color }}
                    >
                      {index + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-800">
                        {org.nameBn}
                      </span>
                      <span className="block truncate text-[10px] text-slate-400">
                        {org.nameEn}
                      </span>
                    </span>

                    <ChevronRight
                      size={16}
                      className={active ? 'text-emerald-600' : 'text-slate-300'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEARNING TIP */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
              <BookOpen size={16} />
              Learning Activity
            </div>
            <p className="mt-2 text-xs leading-6 text-blue-700">
              প্রতিটি অঙ্গাণু নির্বাচন করো এবং তার কাজ মনে রাখার চেষ্টা করো।
              এরপর বইয়ের ছবির সঙ্গে মিলিয়ে দেখো।
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
