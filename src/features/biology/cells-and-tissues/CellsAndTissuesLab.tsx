
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Eye,
  Info,
  Layers,
  Microscope,
  RotateCcw,
  XCircle,
  ZoomIn,
  ZoomOut,
  Leaf,
  Dna,
  ScanEye,
  Maximize2,
  Sparkles,
} from 'lucide-react';

type TissueCategory = 'plant' | 'animal';
type CellType = 'plant' | 'animal';

interface OrganelleInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  inPlant: boolean;
  inAnimal: boolean;
  nickname: string;
  functionBn: string;
  structureBn: string;
  color: string;
}

const CELL_ORGANELLES: OrganelleInfo[] = [
  {
    id: 'cell-wall',
    nameBn: 'কোষপ্রাচীর',
    nameEn: 'Cell Wall',
    inPlant: true,
    inAnimal: false,
    nickname: 'কোষের সুরক্ষা বর্ম',
    functionBn: 'কোষকে নির্দিষ্ট আকৃতি ও যান্ত্রিক দৃঢ়তা দেয় এবং বাইরের আঘাত থেকে রক্ষা করে।',
    structureBn: 'সেলুলোজ, হেমিসেলুলোজ ও পেকটিন নির্মিত জড় আবরণ।',
    color: '#059669',
  },
  {
    id: 'cell-membrane',
    nameBn: 'কোষঝিল্লি',
    nameEn: 'Cell Membrane',
    inPlant: true,
    inAnimal: true,
    nickname: 'কোষের প্রবেশদ্বার',
    functionBn: 'কোষে পদার্থের প্রবেশ ও নির্গমন নিয়ন্ত্রণ করে।',
    structureBn: 'প্রধানত ফসফোলিপিড দ্বিস্তর ও প্রোটিন দিয়ে গঠিত অর্ধভেদ্য ঝিল্লি।',
    color: '#38bdf8',
  },
  {
    id: 'plastid',
    nameBn: 'ক্লোরোপ্লাস্ট',
    nameEn: 'Chloroplast',
    inPlant: true,
    inAnimal: false,
    nickname: 'কোষের রান্নাঘর',
    functionBn: 'সালোকসংশ্লেষণের মাধ্যমে আলোকশক্তি ব্যবহার করে জৈব খাদ্য তৈরি করে।',
    structureBn: 'দ্বিস্তরী ঝিল্লিবেষ্টিত; ভেতরে স্ট্রোমা, থাইলাকয়েড ও গ্রানা থাকে।',
    color: '#10b981',
  },
  {
    id: 'vacuole',
    nameBn: 'কোষগহ্বর',
    nameEn: 'Vacuole',
    inPlant: true,
    inAnimal: true,
    nickname: 'কোষের সঞ্চয় ভাণ্ডার',
    functionBn: 'পানি, লবণ, রঞ্জক ও বিভিন্ন পদার্থ সঞ্চয় করে। উদ্ভিদকোষে রসস্ফীতি চাপ বজায় রাখে।',
    structureBn: 'টনোপ্লাস্ট নামক ঝিল্লি দিয়ে ঘেরা। উদ্ভিদকোষে সাধারণত বড় কেন্দ্রীয় কোষগহ্বর থাকে।',
    color: '#0ea5e9',
  },
  {
    id: 'mitochondria',
    nameBn: 'মাইটোকন্ড্রিয়া',
    nameEn: 'Mitochondria',
    inPlant: true,
    inAnimal: true,
    nickname: 'কোষের শক্তিঘর',
    functionBn: 'কোষীয় শ্বসনের মাধ্যমে ATP উৎপাদনে গুরুত্বপূর্ণ ভূমিকা পালন করে।',
    structureBn: 'দ্বিস্তরী ঝিল্লি; ভেতরের ঝিল্লি ভাঁজ হয়ে ক্রিস্টি তৈরি করে।',
    color: '#f97316',
  },
  {
    id: 'nucleus',
    nameBn: 'নিউক্লিয়াস',
    nameEn: 'Nucleus',
    inPlant: true,
    inAnimal: true,
    nickname: 'কোষের নিয়ন্ত্রণকেন্দ্র',
    functionBn: 'কোষের কার্যক্রম নিয়ন্ত্রণ করে এবং DNA-এর মাধ্যমে বংশগত তথ্য সংরক্ষণ করে।',
    structureBn: 'নিউক্লিয়ার ঝিল্লি, নিউক্লিওপ্লাজম, নিউক্লিওলাস ও ক্রোমাটিন নিয়ে গঠিত।',
    color: '#6366f1',
  },
  {
    id: 'centrosome',
    nameBn: 'সেন্ট্রোসোম',
    nameEn: 'Centrosome',
    inPlant: false,
    inAnimal: true,
    nickname: 'বিভাজন সহায়ক',
    functionBn: 'প্রাণিকোষে মাইক্রোটিউবিউল সংগঠিত করে এবং কোষ বিভাজনে স্পিন্ডল গঠনে সহায়তা করে।',
    structureBn: 'প্রাণিকোষে সাধারণত একজোড়া সেন্ট্রিওল নিয়ে গঠিত। উচ্চতর উদ্ভিদকোষে সাধারণত সেন্ট্রিওল থাকে না।',
    color: '#ec4899',
  },
  {
    id: 'ribosome',
    nameBn: 'রাইবোজোম',
    nameEn: 'Ribosome',
    inPlant: true,
    inAnimal: true,
    nickname: 'প্রোটিন তৈরির কারখানা',
    functionBn: 'অ্যামিনো অ্যাসিড যুক্ত করে প্রোটিন সংশ্লেষণ করে।',
    structureBn: 'বৃহৎ ও ক্ষুদ্র দুটি উপএকক নিয়ে গঠিত ঝিল্লিবিহীন অঙ্গাণু।',
    color: '#8b5cf6',
  },
];

interface TissueSample {
  id: string;
  category: TissueCategory;
  nameBn: string;
  nameEn: string;
  subType: string;
  location: string;
  features: string;
  functionBn: string;
}

const TISSUE_SAMPLES: TissueSample[] = [
  {
    id: 'parenchyma',
    category: 'plant',
    nameBn: 'প্যারেনকাইমা',
    nameEn: 'Parenchyma',
    subType: 'সরল স্থায়ী টিস্যু',
    location: 'পাতা, কাণ্ডের মজ্জা ও ফলের নরম অংশে।',
    features: 'জীবিত, পাতলা কোষপ্রাচীরযুক্ত কোষ এবং আন্তঃকোষীয় ফাঁক থাকে।',
    functionBn: 'খাদ্য তৈরি, খাদ্য সঞ্চয় ও গ্যাস বিনিময়ে সহায়তা করে।',
  },
  {
    id: 'sclerenchyma',
    category: 'plant',
    nameBn: 'স্ক্লেরেনকাইমা',
    nameEn: 'Sclerenchyma',
    subType: 'সরল স্থায়ী টিস্যু',
    location: 'পাটের আঁশ, নারিকেলের ছোবড়া ও বীজত্বকে।',
    features: 'লিগনিনযুক্ত পুরু কোষপ্রাচীর; পরিণত কোষ সাধারণত মৃত।',
    functionBn: 'উদ্ভিদদেহকে যান্ত্রিক দৃঢ়তা ও সুরক্ষা প্রদান করে।',
  },
  {
    id: 'xylem',
    category: 'plant',
    nameBn: 'জাইলেম',
    nameEn: 'Xylem',
    subType: 'জটিল স্থায়ী টিস্যু',
    location: 'মূল, কাণ্ড ও পাতার পরিবহন গুচ্ছে।',
    features: 'ট্রাকিড, ভেসেল, জাইলেম প্যারেনকাইমা ও জাইলেম ফাইবার নিয়ে গঠিত।',
    functionBn: 'মূল থেকে পানি ও খনিজ লবণ ঊর্ধ্বমুখী পরিবহন করে।',
  },
  {
    id: 'phloem',
    category: 'plant',
    nameBn: 'ফ্লোয়েম',
    nameEn: 'Phloem',
    subType: 'জটিল স্থায়ী টিস্যু',
    location: 'উদ্ভিদের মূল, কাণ্ড ও পাতার পরিবহন গুচ্ছে।',
    features: 'সিভ টিউব এলিমেন্ট, সঙ্গীকোষ, ফ্লোয়েম প্যারেনকাইমা ও ফাইবার থাকে।',
    functionBn: 'পাতায় তৈরি শর্করা উদ্ভিদের বিভিন্ন অংশে পরিবহন করে।',
  },
  {
    id: 'epithelial',
    category: 'animal',
    nameBn: 'আবরণী টিস্যু',
    nameEn: 'Epithelial Tissue',
    subType: 'প্রাণিটিস্যু',
    location: 'ত্বকের বাইরের স্তর এবং বিভিন্ন অঙ্গের ভেতরের আবরণে।',
    features: 'কোষগুলো ভিত্তিপর্দার ওপর ঘনসন্নিবিষ্টভাবে সাজানো থাকে।',
    functionBn: 'সুরক্ষা, শোষণ, ক্ষরণ ও ছাঁকনে সহায়তা করে।',
  },
  {
    id: 'connective-blood',
    category: 'animal',
    nameBn: 'রক্ত',
    nameEn: 'Blood',
    subType: 'তরল যোজক টিস্যু',
    location: 'হৃৎপিণ্ড ও রক্তনালির ভেতরে।',
    features: 'রক্তরস, লোহিত রক্তকণিকা, শ্বেত রক্তকণিকা ও অণুচক্রিকা থাকে।',
    functionBn: 'অক্সিজেন, খাদ্যসার ও হরমোন পরিবহন এবং রোগ প্রতিরোধ করে।',
  },
  {
    id: 'cardiac-muscle',
    category: 'animal',
    nameBn: 'হৃৎপেশি',
    nameEn: 'Cardiac Muscle',
    subType: 'পেশি টিস্যু',
    location: 'হৃৎপিণ্ডের প্রাচীরে।',
    features: 'শাখান্বিত, আড়াআড়ি দাগযুক্ত কোষ এবং ইন্টারক্যালেটেড ডিস্ক থাকে।',
    functionBn: 'ছন্দময় অনৈচ্ছিক সংকোচন-প্রসারণের মাধ্যমে রক্ত সঞ্চালন করে।',
  },
  {
    id: 'nervous-neuron',
    category: 'animal',
    nameBn: 'স্নায়ু টিস্যু',
    nameEn: 'Nervous Tissue',
    subType: 'স্নায়ু টিস্যু',
    location: 'মস্তিষ্ক, সুষুম্নাকাণ্ড ও স্নায়ুতে।',
    features: 'নিউরনের কোষদেহ, ডেনড্রাইট ও অ্যাক্সন থাকে।',
    functionBn: 'উদ্দীপনা গ্রহণ, স্নায়ু সংকেত পরিবহন ও সাড়া প্রদানে সহায়তা করে।',
  },
];

// --------------------------------------------------
// 2D CELL MODEL
// --------------------------------------------------

function CellModel({
  type,
  selectedId,
  zoom,
  onSelect,
}: {
  type: CellType;
  selectedId: string;
  zoom: number;
  onSelect: (id: string) => void;
}) {
  const plant = type === 'plant';

  const Organelle = ({
    id,
    x,
    y,
    children,
    label,
  }: {
    id: string;
    x: number;
    y: number;
    children: React.ReactNode;
    label?: string;
  }) => {
    const selected = selectedId === id;

    return (
      <g
        transform={`translate(${x} ${y})`}
        onClick={() => onSelect(id)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={label || id}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect(id);
        }}
      >
        {selected && (
          <circle
            r="35"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="5 4"
          >
            <animate
              attributeName="r"
              values="31;37;31"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        {children}
      </g>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-teal-50 border border-slate-200">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-600">
          2D SCIENTIFIC MODEL
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="text-xs font-bold text-teal-700 bg-white/90 px-3 py-1.5 rounded-lg border border-teal-100">
          {plant ? 'উদ্ভিদকোষ' : 'প্রাণিকোষ'}
        </span>
      </div>

      <div className="w-full flex justify-center items-center p-4 pt-12">
        <svg
          viewBox="0 0 500 390"
          className="w-full max-w-[520px] h-auto"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.25s ease',
          }}
        >
          <defs>
            <linearGradient id="cytoplasm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
            <linearGradient id="vacuoleGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <filter id="cellShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.13" />
            </filter>
          </defs>

          {/* Cell body */}
          {plant ? (
            <>
              <rect
                x="38" y="35" width="424" height="320" rx="48"
                fill="#86efac"
                stroke="#15803d"
                strokeWidth="12"
                filter="url(#cellShadow)"
              />
              <rect
                x="49" y="46" width="402" height="298" rx="39"
                fill="url(#cytoplasm)"
                stroke="#38bdf8"
                strokeWidth="4"
              />
            </>
          ) : (
            <>
              <path
                d="M250 34 C355 25 449 103 455 192 C464 282 380 353 274 356 C160 369 49 300 45 200 C39 104 143 37 250 34Z"
                fill="url(#cytoplasm)"
                stroke="#38bdf8"
                strokeWidth="7"
                filter="url(#cellShadow)"
              />
            </>
          )}

          {/* Nucleus */}
          <Organelle id="nucleus" x={plant ? 340 : 245} y={plant ? 115 : 175} label="Nucleus">
            <ellipse rx="48" ry="39" fill="#818cf8" stroke="#4338ca" strokeWidth="3" />
            <ellipse rx="39" ry="31" fill="#a5b4fc" />
            <circle cx="9" cy="-2" r="12" fill="#4338ca" />
            <path d="M-30 -12 Q-10 5 20 17 M-25 15 Q0 -5 29 -16" stroke="#4f46e5" strokeWidth="2" fill="none" />
          </Organelle>

          {/* Nucleolus label */}
          <text x={plant ? 340 : 245} y={plant ? 168 : 228} textAnchor="middle" fontSize="10" fill="#4338ca" fontWeight="bold">
            নিউক্লিয়াস
          </text>

          {/* Plant chloroplasts */}
          {plant && (
            <>
              {[ [105,95], [165,280], [385,275], [390,205] ].map(([x,y], i) => (
                <Organelle key={i} id="plastid" x={x} y={y} label="Chloroplast">
                  <ellipse rx="24" ry="13" fill="#22c55e" stroke="#15803d" strokeWidth="2" transform="rotate(-25)" />
                  {[ -6, 0, 6 ].map((v) => (
                    <path key={v} d={`M-13 ${v} Q0 ${v-5} 13 ${v}`} stroke="#dcfce7" strokeWidth="2" fill="none" />
                  ))}
                </Organelle>
              ))}
            </>
          )}

          {/* Vacuole */}
          <Organelle id="vacuole" x={plant ? 170 : 360} y={plant ? 180 : 275}>
            <ellipse
              rx={plant ? 57 : 25}
              ry={plant ? 100 : 19}
              fill="url(#vacuoleGradient)"
              stroke="#0284c7"
              strokeWidth="3"
              opacity="0.9"
            />
            <path
              d={plant ? 'M-35 -65 Q0 -80 30 -55 M-35 45 Q0 62 34 42' : 'M-12 0 Q0 -12 13 0'}
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="4"
            />
          </Organelle>

          {/* Mitochondria */}
          {[
            [plant ? 270 : 140, plant ? 280 : 90],
            [plant ? 95 : 365, plant ? 215 : 105],
          ].map(([x,y], i) => (
            <Organelle key={i} id="mitochondria" x={x} y={y}>
              <ellipse rx="31" ry="17" fill="#fb923c" stroke="#c2410c" strokeWidth="2" transform="rotate(-25)" />
              <path d="M-21 0 Q-12 -16 -3 0 T15 0 T25 0" stroke="#fff7ed" strokeWidth="3" fill="none" />
            </Organelle>
          ))}

          {/* Ribosomes */}
          <Organelle id="ribosome" x={plant ? 275 : 190} y={plant ? 75 : 285}>
            {[[-12,0],[0,-8],[12,0],[-5,12],[9,13]].map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#7c3aed" />
            ))}
          </Organelle>

          {!plant && (
            <Organelle id="centrosome" x={310} y={100}>
              <g stroke="#db2777" strokeWidth="7" strokeLinecap="round">
                <path d="M-12 -12 L12 12" />
                <path d="M12 -12 L-12 12" />
              </g>
              <circle r="4" fill="#831843" />
            </Organelle>
          )}

          {/* Cell membrane */}
          <g
            onClick={() => onSelect('cell-membrane')}
            className="cursor-pointer"
          >
            {plant ? (
              <rect x="49" y="46" width="402" height="298" rx="39" fill="none" stroke={selectedId === 'cell-membrane' ? '#f59e0b' : '#38bdf8'} strokeWidth={selectedId === 'cell-membrane' ? 8 : 3} />
            ) : (
              <path
                d="M250 34 C355 25 449 103 455 192 C464 282 380 353 274 356 C160 369 49 300 45 200 C39 104 143 37 250 34Z"
                fill="none"
                stroke={selectedId === 'cell-membrane' ? '#f59e0b' : '#38bdf8'}
                strokeWidth={selectedId === 'cell-membrane' ? 9 : 5}
              />
            )}
          </g>

          {/* Cell wall */}
          {plant && (
            <rect
              x="38" y="35" width="424" height="320" rx="48"
              fill="none"
              stroke={selectedId === 'cell-wall' ? '#f59e0b' : '#15803d'}
              strokeWidth={selectedId === 'cell-wall' ? 17 : 11}
              onClick={() => onSelect('cell-wall')}
              className="cursor-pointer"
            />
          )}

          {/* Labels */}
          <g fontSize="11" fontWeight="bold" fill="#334155">
            <text x="250" y="375" textAnchor="middle">
              {plant ? 'উদ্ভিদকোষের 2D গঠন' : 'প্রাণিকোষের 2D গঠন'}
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-3 px-3 pb-4 text-[10px] font-semibold text-slate-600">
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> নিউক্লিয়াস</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-orange-500" /> মাইটোকন্ড্রিয়া</span>
        {plant && <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-green-500" /> ক্লোরোপ্লাস্ট</span>}
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full bg-sky-400" /> কোষগহ্বর</span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// 2D TISSUE MODELS
// --------------------------------------------------

function TissueModel({ tissue }: { tissue: TissueSample }) {
  const id = tissue.id;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-500">VIRTUAL MICROSCOPE · 2D</span>
        <ScanEye className="w-4 h-4 text-teal-600" />
      </div>

      <svg viewBox="0 0 400 240" className="w-full h-auto rounded-xl bg-white border border-slate-100">
        <defs>
          <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#64748b" />
          </pattern>
        </defs>

        {tissue.category === 'plant' && id === 'parenchyma' && (
          <>
            {Array.from({ length: 11 }).map((_, i) => {
              const x = 45 + (i % 4) * 78;
              const y = 48 + Math.floor(i / 4) * 72;
              return (
                <g key={i}>
                  <path
                    d={`M${x-30} ${y-25} Q${x} ${y-34} ${x+30} ${y-25} Q${x+38} ${y} ${x+30} ${y+25} Q${x} ${y+34} ${x-30} ${y+25} Q${x-38} ${y} ${x-30} ${y-25}`}
                    fill="#bbf7d0"
                    stroke="#15803d"
                    strokeWidth="2"
                  />
                  <circle cx={x} cy={y} r="6" fill="#166534" />
                  <circle cx={x+12} cy={y-10} r="3" fill="#4ade80" />
                </g>
              );
            })}
          </>
        )}

        {tissue.category === 'plant' && id === 'sclerenchyma' && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i} transform={`translate(${55 + i * 58} 120) rotate(-15)`}>
                <rect x="-16" y="-80" width="32" height="160" rx="15" fill="#d6a46a" stroke="#92400e" strokeWidth="5" />
                <rect x="-7" y="-69" width="14" height="138" rx="7" fill="#fff7ed" stroke="#b45309" strokeWidth="2" />
                <path d="M-10 -40 L10 -30 M-10 0 L10 10 M-10 40 L10 50" stroke="#92400e" strokeWidth="2" />
              </g>
            ))}
          </>
        )}

        {tissue.category === 'plant' && id === 'xylem' && (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${85 + i * 115} 120)`}>
                <rect x="-33" y="-90" width="66" height="180" rx="22" fill="#fde68a" stroke="#b45309" strokeWidth="5" />
                <path d="M-27 -55 L27 -55 M-27 0 L27 0 M-27 55 L27 55" stroke="#b45309" strokeWidth="4" />
                <path d="M0 65 L0 -65 M-9 -48 L0 -65 L9 -48" stroke="#0284c7" strokeWidth="5" fill="none" />
              </g>
            ))}
          </>
        )}

        {tissue.category === 'plant' && id === 'phloem' && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${70 + i * 85} 120)`}>
                <rect x="-26" y="-85" width="52" height="170" rx="8" fill="#fecaca" stroke="#be123c" strokeWidth="3" />
                <path d="M-26 -25 L26 -25 M-26 25 L26 25" stroke="#be123c" strokeWidth="3" strokeDasharray="4 3" />
                <circle cx="34" cy="0" r="10" fill="#86efac" stroke="#15803d" strokeWidth="2" />
              </g>
            ))}
          </>
        )}

        {tissue.category === 'animal' && id === 'epithelial' && (
          <>
            {Array.from({ length: 14 }).map((_, i) => {
              const x = 30 + (i % 7) * 49;
              const y = i < 7 ? 80 : 155;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="43" height="62" rx="10" fill="#fbcfe8" stroke="#be185d" strokeWidth="2" />
                  <ellipse cx={x+21} cy={y+30} rx="8" ry="12" fill="#9d174d" />
                </g>
              );
            })}
            <path d="M15 225 H385" stroke="#64748b" strokeWidth="5" />
          </>
        )}

        {tissue.category === 'animal' && id === 'connective-blood' && (
          <>
            {Array.from({ length: 18 }).map((_, i) => (
              <ellipse
                key={i}
                cx={35 + (i % 6) * 65}
                cy={35 + Math.floor(i / 6) * 80}
                rx="21"
                ry="12"
                fill="#ef4444"
                stroke="#991b1b"
                strokeWidth="1.5"
              />
            ))}
            <g transform="translate(205 115)">
              <circle r="23" fill="#e0f2fe" stroke="#0369a1" strokeWidth="3" />
              <circle cx="-7" cy="0" r="8" fill="#2563eb" />
              <circle cx="8" cy="-5" r="8" fill="#2563eb" />
              <circle cx="7" cy="9" r="8" fill="#2563eb" />
            </g>
          </>
        )}

        {tissue.category === 'animal' && id === 'cardiac-muscle' && (
          <>
            {[-1, 0, 1].map((i) => (
              <g key={i} transform={`translate(${190 + i * 40} 120) rotate(${i * 15})`}>
                <path d="M-25 -100 Q0 -120 25 -100 L18 65 Q0 100 -18 65Z" fill="#fda4af" stroke="#be123c" strokeWidth="3" />
                {Array.from({ length: 7 }).map((_, j) => (
                  <path key={j} d={`M-19 ${-65+j*20} H19`} stroke="#be123c" strokeWidth="3" />
                ))}
                <ellipse cx="0" cy="0" rx="8" ry="17" fill="#9f1239" />
              </g>
            ))}
          </>
        )}

        {tissue.category === 'animal' && id === 'nervous-neuron' && (
          <>
            <g transform="translate(195 115)">
              <circle r="30" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
              <circle r="12" fill="#92400e" />
              {Array.from({ length: 8 }).map((_, i) => (
                <path
                  key={i}
                  d={`M${Math.cos(i*Math.PI/4)*22} ${Math.sin(i*Math.PI/4)*22} L${Math.cos(i*Math.PI/4)*85} ${Math.sin(i*Math.PI/4)*85}`}
                  stroke="#b45309"
                  strokeWidth="3"
                  fill="none"
                />
              ))}
              <path d="M25 0 Q75 -15 110 5 L175 5" fill="none" stroke="#b45309" strokeWidth="5" />
              <path d="M175 5 L190 -10 M175 5 L190 20" stroke="#b45309" strokeWidth="3" />
            </g>
          </>
        )}

        <text x="200" y="230" fontSize="10" textAnchor="middle" fill="#64748b" fontWeight="bold">
          {tissue.nameEn} - Schematic Model
        </text>
      </svg>

      <p className="text-[10px] text-center text-slate-400 mt-2">
        শিক্ষামূলক স্কিম্যাটিক চিত্র — প্রকৃত অণুবীক্ষণ চিত্র নয়।
      </p>
    </div>
  );
}

// --------------------------------------------------
// MAIN LAB
// --------------------------------------------------

export default function CellsAndTissuesLab() {
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('mitochondria');
  const [cellType, setCellType] = useState<CellType>('plant');
  const [tissueCategory, setTissueCategory] = useState<TissueCategory>('plant');
  const [selectedTissueId, setSelectedTissueId] = useState('parenchyma');
  const [zoom, setZoom] = useState(1);
  const [showModel, setShowModel] = useState(true);

  const activeOrganelle = useMemo(
    () => CELL_ORGANELLES.find((o) => o.id === selectedOrganelleId) ?? CELL_ORGANELLES[0],
    [selectedOrganelleId]
  );

  const filteredTissues = useMemo(
    () => TISSUE_SAMPLES.filter((t) => t.category === tissueCategory),
    [tissueCategory]
  );

  const activeTissue = useMemo(
    () => filteredTissues.find((t) => t.id === selectedTissueId) ?? filteredTissues[0],
    [filteredTissues, selectedTissueId]
  );

  const handleCategorySwitch = (cat: TissueCategory) => {
    setTissueCategory(cat);
    const first = TISSUE_SAMPLES.find((t) => t.category === cat);
    if (first) setSelectedTissueId(first.id);
  };

  const handleReset = () => {
    setSelectedOrganelleId('mitochondria');
    setCellType('plant');
    setTissueCategory('plant');
    setSelectedTissueId('parenchyma');
    setZoom(1);
    setShowModel(true);
  };

  const selectOrganelle = (id: string) => {
    setSelectedOrganelleId(id);
    const org = CELL_ORGANELLES.find((o) => o.id === id);
    if (org) {
      setCellType(org.inPlant ? 'plant' : 'animal');
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-700 p-5 sm:p-6 text-white">
        <div className="absolute -right-8 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              <Activity className="w-4 h-4" />
              INTERACTIVE BIOLOGY LAB
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold mt-3">
              কোষ ও টিস্যু অণুবীক্ষণ ল্যাব
            </h2>

            <p className="text-sm text-teal-50 mt-2 max-w-2xl leading-relaxed">
              2D মডেলের সাহায্যে উদ্ভিদ ও প্রাণিকোষের অঙ্গাণু, গঠন এবং বিভিন্ন টিস্যু সম্পর্কে জানো।
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-sm font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>
        </div>

        <div className="relative grid grid-cols-3 gap-2 mt-5">
          {[
            { value: '02', label: 'Cell Models' },
            { value: '08', label: 'Tissue Models' },
            { value: '08', label: 'Organelles' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/10 border border-white/10 p-3">
              <p className="text-xl font-extrabold">{item.value}</p>
              <p className="text-[10px] text-teal-50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-extrabold text-slate-900">
                01. কোষের 2D স্ট্রাকচার মডেল
              </h3>
              <p className="text-xs text-slate-500">Cell Structure Explorer</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full">
            INTERACTIVE 2D
          </span>
        </div>

        {/* Cell Type Switch */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setCellType('plant')}
            className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
              cellType === 'plant'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Leaf className="w-4 h-4" />
            উদ্ভিদকোষ
          </button>

          <button
            onClick={() => setCellType('animal')}
            className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
              cellType === 'animal'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            প্রাণিকোষ
          </button>
        </div>

        {/* Model Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500 font-semibold">
            <Sparkles className="inline w-3.5 h-3.5 mr-1 text-amber-500" />
            অঙ্গাণু নির্বাচন করে মডেলে দেখো
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(1)))}
              disabled={zoom <= 0.8}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-600 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => setZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(1)))}
              disabled={zoom >= 1.3}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoom(1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
              aria-label="Reset zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2D Model */}
        {showModel && (
          <CellModel
            type={cellType}
            selectedId={selectedOrganelleId}
            zoom={zoom}
            onSelect={(id) => setSelectedOrganelleId(id)}
          />
        )}

        <button
          onClick={() => setShowModel(!showModel)}
          className="text-xs font-bold text-teal-700 hover:text-teal-900"
        >
          {showModel ? 'মডেল লুকাও' : 'মডেল দেখাও'}
        </button>

        {/* Organelle Selector */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">
            অঙ্গাণু নির্বাচন করো
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CELL_ORGANELLES.map((org) => {
              const selected = selectedOrganelleId === org.id;
              const available = cellType === 'plant' ? org.inPlant : org.inAnimal;

              return (
                <button
                  key={org.id}
                  onClick={() => selectOrganelle(org.id)}
                  className={`text-left rounded-xl p-3 border transition-all ${
                    selected
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="block w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: org.color }}
                  />
                  <p className="text-xs font-extrabold text-slate-800">
                    {org.nameBn}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {available ? 'উপস্থিত' : 'সাধারণত অনুপস্থিত'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Organelle Details */}
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase">
                Selected Organelle
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                {activeOrganelle.nameBn}
              </h4>
              <p className="text-xs text-slate-500">
                {activeOrganelle.nameEn}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl shadow-sm"
              style={{ backgroundColor: activeOrganelle.color }}
            />
          </div>

          <p className="text-xs text-teal-700 font-bold mt-2">
            {activeOrganelle.nickname}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-extrabold text-slate-800 mb-2">
                <Layers className="inline w-4 h-4 mr-1 text-teal-600" />
                গঠন
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeOrganelle.structureBn}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-extrabold text-slate-800 mb-2">
                <Activity className="inline w-4 h-4 mr-1 text-teal-600" />
                প্রধান কাজ
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeOrganelle.functionBn}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className={`text-xs font-bold flex items-center gap-1 ${activeOrganelle.inPlant ? 'text-emerald-700' : 'text-rose-600'}`}>
              {activeOrganelle.inPlant ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              উদ্ভিদকোষে {activeOrganelle.inPlant ? 'উপস্থিত' : 'সাধারণত অনুপস্থিত'}
            </span>

            <span className={`text-xs font-bold flex items-center gap-1 ${activeOrganelle.inAnimal ? 'text-sky-700' : 'text-rose-600'}`}>
              {activeOrganelle.inAnimal ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              প্রাণিকোষে {activeOrganelle.inAnimal ? 'উপস্থিত' : 'সাধারণত অনুপস্থিত'}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">

        <div className="flex items-center gap-2">
          <Microscope className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-extrabold text-slate-900">
              02. ভার্চুয়াল টিস্যু মাইক্রোস্কোপ
            </h3>
            <p className="text-xs text-slate-500">
              Virtual Tissue Microscope Explorer
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleCategorySwitch('plant')}
            className={`rounded-xl py-3 text-sm font-bold transition-all ${
              tissueCategory === 'plant'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Leaf className="inline w-4 h-4 mr-1" />
            উদ্ভিদ টিস্যু
          </button>

          <button
            onClick={() => handleCategorySwitch('animal')}
            className={`rounded-xl py-3 text-sm font-bold transition-all ${
              tissueCategory === 'animal'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Activity className="inline w-4 h-4 mr-1" />
            প্রাণিটিস্যু
          </button>
        </div>

        {/* Tissue Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredTissues.map((tissue) => (
            <button
              key={tissue.id}
              onClick={() => setSelectedTissueId(tissue.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTissueId === tissue.id
                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-800">
                {tissue.nameBn}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {tissue.nameEn}
              </p>
            </button>
          ))}
        </div>

        {/* Tissue Model */}
        {activeTissue && (
          <>
            <TissueModel tissue={activeTissue} />

            <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                  {activeTissue.subType}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-2">
                  {activeTissue.nameBn}
                </h4>
                <p className="text-xs text-slate-500">
                  {activeTissue.nameEn}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    অবস্থান
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeTissue.location}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    শনাক্তকারী বৈশিষ্ট্য
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeTissue.features}
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl">
                <p className="text-xs font-bold text-teal-800 mb-1">
                  <Info className="inline w-4 h-4 mr-1" />
                  প্রধান কাজ
                </p>
                <p className="text-xs text-teal-900 leading-relaxed">
                  {activeTissue.functionBn}
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* QUICK KNOWLEDGE */}
      <section className="rounded-2xl bg-slate-900 p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="w-5 h-5 text-teal-400" />
          <h3 className="font-extrabold text-sm">মনে রাখার বিষয়</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <span className="text-emerald-400 font-bold">উদ্ভিদকোষ:</span>
            কোষপ্রাচীর, প্লাস্টিড ও সাধারণত বড় কেন্দ্রীয় কোষগহ্বর থাকে।
          </p>
          <p>
            <span className="text-sky-400 font-bold">প্রাণিকোষ:</span>
            কোষপ্রাচীর ও প্লাস্টিড থাকে না। সাধারণত সেন্ট্রোসোমে সেন্ট্রিওল থাকে।
          </p>
          <p>
            <span className="text-amber-400 font-bold">উভয় কোষ:</span>
            নিউক্লিয়াস, মাইটোকন্ড্রিয়া, রাইবোজোম ও কোষঝিল্লি থাকে।
          </p>
        </div>
      </section>

    </div>
  );
}
