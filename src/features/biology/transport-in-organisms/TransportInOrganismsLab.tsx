
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Info,
  RotateCcw,
  XCircle,
  Heart,
  ArrowDownUp,
  Gauge,
  ShieldCheck,
  Play,
  Pause,
  BookOpen,
  AlertTriangle,
  Wind,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

type BloodGroup =
  | 'A+' | 'A-' | 'B+' | 'B-'
  | 'AB+' | 'AB-' | 'O+' | 'O-';

interface BloodGroupMeta {
  group: BloodGroup;
  abo: 'A' | 'B' | 'AB' | 'O';
  antigens: string[];
  antibodies: string[];
  rhPositive: boolean;
}

type BPStatus = {
  label: string;
  labelEn: string;
  advice: string;
  color: string;
  bg: string;
  border: string;
  percentage: number;
};

// =====================================================
// BLOOD GROUP DATA
// Packed RBC compatibility
// =====================================================

const BLOOD_GROUPS: BloodGroupMeta[] = [
  {
    group: 'A+',
    abo: 'A',
    antigens: ['A', 'Rh(D)'],
    antibodies: ['Anti-B'],
    rhPositive: true,
  },
  {
    group: 'A-',
    abo: 'A',
    antigens: ['A'],
    antibodies: ['Anti-B'],
    rhPositive: false,
  },
  {
    group: 'B+',
    abo: 'B',
    antigens: ['B', 'Rh(D)'],
    antibodies: ['Anti-A'],
    rhPositive: true,
  },
  {
    group: 'B-',
    abo: 'B',
    antigens: ['B'],
    antibodies: ['Anti-A'],
    rhPositive: false,
  },
  {
    group: 'AB+',
    abo: 'AB',
    antigens: ['A', 'B', 'Rh(D)'],
    antibodies: [],
    rhPositive: true,
  },
  {
    group: 'AB-',
    abo: 'AB',
    antigens: ['A', 'B'],
    antibodies: [],
    rhPositive: false,
  },
  {
    group: 'O+',
    abo: 'O',
    antigens: ['Rh(D)'],
    antibodies: ['Anti-A', 'Anti-B'],
    rhPositive: true,
  },
  {
    group: 'O-',
    abo: 'O',
    antigens: [],
    antibodies: ['Anti-A', 'Anti-B'],
    rhPositive: false,
  },
];

// =====================================================
// COMPATIBILITY LOGIC
// =====================================================

function isCompatible(
  donor: BloodGroupMeta,
  recipient: BloodGroupMeta,
): boolean {
  // Rh-positive RBC should not be given to Rh-negative recipient.
  if (donor.rhPositive && !recipient.rhPositive) {
    return false;
  }

  // O RBC has no A or B antigen.
  if (donor.abo === 'O') return true;

  // AB recipient has both A and B antigens.
  if (recipient.abo === 'AB') return true;

  return donor.abo === recipient.abo;
}

function getCompatibilityReason(
  donor: BloodGroupMeta,
  recipient: BloodGroupMeta,
): string {
  if (
    donor.rhPositive &&
    !recipient.rhPositive
  ) {
    return 'দাতা Rh-positive কিন্তু গ্রহীতা Rh-negative। Rh(D) অ্যান্টিজেনের সংস্পর্শে গ্রহীতার শরীরে Anti-D অ্যান্টিবডি তৈরি হতে পারে। তাই এই RBC transfusion সামঞ্জস্যপূর্ণ নয়।';
  }

  const aboCompatible =
    donor.abo === 'O' ||
    recipient.abo === 'AB' ||
    donor.abo === recipient.abo;

  if (!aboCompatible) {
    return `দাতার ${donor.abo} অ্যান্টিজেন গ্রহীতার রক্তরসের অ্যান্টিবডির সঙ্গে বিক্রিয়া করতে পারে। এতে RBC Agglutination বা হেমোলাইসিসের ঝুঁকি থাকে।`;
  }

  return `দাতা ${donor.group} এবং গ্রহীতা ${recipient.group}। ABO ও Rh(D) ভিত্তিক Packed RBC সামঞ্জস্যতা রয়েছে। তবে বাস্তব রক্ত সঞ্চালনের আগে Crossmatch এবং অন্যান্য পরীক্ষা আবশ্যক।`;
}

// =====================================================
// 3D ANIMATED HEART MODEL
// =====================================================

function Heart3D({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-3">

      <style>{`
        @keyframes heartBeat3D {
          0%, 100% {
            transform: perspective(900px) rotateY(-9deg) scale(1);
          }
          15% {
            transform: perspective(900px) rotateY(-9deg) scale(1.07);
          }
          30% {
            transform: perspective(900px) rotateY(-9deg) scale(0.98);
          }
          45% {
            transform: perspective(900px) rotateY(-9deg) scale(1.04);
          }
          65% {
            transform: perspective(900px) rotateY(-9deg) scale(1);
          }
        }

        @keyframes bloodFlowDown {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -40; }
        }

        @keyframes bloodFlowUp {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes bloodParticle {
          0% { transform: translateY(-8px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }

        .heart-beat {
          animation: heartBeat3D 1.2s ease-in-out infinite;
          transform-origin: center;
          transform-style: preserve-3d;
        }

        .blood-flow {
          stroke-dasharray: 7 9;
          animation: bloodFlowDown 1s linear infinite;
        }

        .blood-flow-reverse {
          stroke-dasharray: 7 9;
          animation: bloodFlowUp 1s linear infinite;
        }

        .blood-particle {
          animation: bloodParticle 1.5s ease-in-out infinite;
        }

        .heart-glow {
          filter: drop-shadow(0 12px 18px rgba(225, 29, 72, 0.25));
        }

        .heart-paused * {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Heart information */}
      <div className="w-full flex justify-between items-center mb-2 px-2">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            3D Anatomical Model
          </p>
          <p className="text-sm font-extrabold text-slate-800">
            মানব হৃৎপিণ্ড (Human Heart)
          </p>
        </div>

        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
          isPlaying
            ? 'bg-rose-100 text-rose-700'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {isPlaying ? '● BEATING' : 'Ⅱ PAUSED'}
        </span>
      </div>

      <div
        className={`relative w-full max-w-[360px] ${
          isPlaying ? '' : 'heart-paused'
        }`}
      >
        {/* Background glow */}
        <div className="absolute inset-10 rounded-full bg-rose-400/10 blur-3xl" />

        {/* 3D heart SVG */}
        <svg
          viewBox="0 0 360 390"
          className="relative z-10 w-full heart-glow overflow-visible"
          role="img"
          aria-label="Animated 3D-style human heart showing chambers and major blood vessels"
        >
          <defs>
            <linearGradient id="heartBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="35%" stopColor="#e11d48" />
              <stop offset="70%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>

            <linearGradient id="heartLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fecdd3" />
              <stop offset="45%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>

            <linearGradient id="heartBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="55%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#164e63" />
            </linearGradient>

            <linearGradient id="heartRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="55%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            <linearGradient id="vesselRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>

            <radialGradient id="heartSurface">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="75%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>

            <filter id="heartShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" />
            </filter>

            <clipPath id="heartClip">
              <path d="
                M180 111
                C150 84 107 91 91 124
                C61 185 102 262 179 337
                C187 345 192 342 201 333
                C278 254 316 181 287 124
                C270 91 223 84 190 111
                Z
              " />
            </clipPath>
          </defs>

          {/* Heart shadow */}
          <ellipse
            cx="185"
            cy="335"
            rx="91"
            ry="16"
            fill="#881337"
            opacity="0.13"
            filter="url(#heartShadow)"
          />

          {/* Aorta */}
          <g>
            <path
              d="M177 127 C161 88 154 43 185 26 C216 8 250 27 246 63 C244 83 224 93 225 127"
              fill="none"
              stroke="#7f1d1d"
              strokeWidth="31"
              strokeLinecap="round"
            />
            <path
              d="M177 127 C161 88 154 43 185 26 C216 8 250 27 246 63 C244 83 224 93 225 127"
              fill="none"
              stroke="url(#vesselRed)"
              strokeWidth="23"
              strokeLinecap="round"
            />
            <path
              d="M177 115 C165 78 170 43 191 34"
              fill="none"
              stroke="#fecaca"
              strokeWidth="3"
              opacity="0.7"
              strokeLinecap="round"
            />
          </g>

          {/* Pulmonary artery */}
          <path
            d="M166 124 C133 90 98 84 84 104 C72 120 88 139 113 143"
            fill="none"
            stroke="#164e63"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M166 124 C133 90 98 84 84 104 C72 120 88 139 113 143"
            fill="none"
            stroke="url(#heartBlue)"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Superior vena cava */}
          <path
            d="M126 39 C127 73 128 94 139 119"
            fill="none"
            stroke="#164e63"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M126 39 C127 73 128 94 139 119"
            fill="none"
            stroke="url(#heartBlue)"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Inferior vena cava */}
          <path
            d="M119 278 C126 298 136 315 145 329"
            fill="none"
            stroke="#164e63"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M119 278 C126 298 136 315 145 329"
            fill="none"
            stroke="url(#heartBlue)"
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* Pulmonary veins */}
          <path
            d="M251 151 C282 135 303 141 318 128"
            fill="none"
            stroke="#991b1b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M251 151 C282 135 303 141 318 128"
            fill="none"
            stroke="url(#vesselRed)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Heart body */}
          <g className="heart-beat">
            <path
              d="
                M180 111
                C150 84 107 91 91 124
                C61 185 102 262 179 337
                C187 345 192 342 201 333
                C278 254 316 181 287 124
                C270 91 223 84 190 111
                Z
              "
              fill="#881337"
              transform="translate(4 5)"
            />

            <path
              d="
                M180 111
                C150 84 107 91 91 124
                C61 185 102 262 179 337
                C187 345 192 342 201 333
                C278 254 316 181 287 124
                C270 91 223 84 190 111
                Z
              "
              fill="url(#heartBody)"
              stroke="#9f1239"
              strokeWidth="3"
            />

            {/* Heart surface highlight */}
            <path
              d="M110 141 C91 181 122 252 173 309"
              fill="none"
              stroke="#fda4af"
              strokeWidth="7"
              opacity="0.3"
              strokeLinecap="round"
            />

            {/* Chambers */}
            <g clipPath="url(#heartClip)">
              <path
                d="M178 111 C136 93 99 124 108 175 L175 214 Z"
                fill="url(#heartBlue)"
                stroke="#164e63"
                strokeWidth="2"
              />

              <path
                d="M184 111 C224 91 266 116 270 163 L188 213 Z"
                fill="url(#heartRed)"
                stroke="#991b1b"
                strokeWidth="2"
              />

              <path
                d="M108 175 L175 214 L181 331 C145 295 102 239 108 175Z"
                fill="#0e7490"
                stroke="#164e63"
                strokeWidth="2"
              />

              <path
                d="M188 213 L270 163 C294 221 240 290 188 331Z"
                fill="url(#heartSurface)"
                stroke="#881337"
                strokeWidth="2"
              />

              {/* Septum */}
              <path
                d="M181 115 Q184 190 181 325"
                stroke="#fecdd3"
                strokeWidth="5"
                opacity="0.7"
                fill="none"
              />

              {/* Chamber highlights */}
              <path
                d="M120 151 Q133 128 154 146"
                fill="none"
                stroke="#a5f3fc"
                strokeWidth="4"
                opacity="0.6"
                strokeLinecap="round"
              />
              <path
                d="M205 145 Q237 125 253 151"
                fill="none"
                stroke="#fecaca"
                strokeWidth="4"
                opacity="0.6"
                strokeLinecap="round"
              />

              {/* Internal blood flow */}
              <path
                d="M139 145 L151 204 L158 256"
                fill="none"
                stroke="#a5f3fc"
                strokeWidth="4"
                className="blood-flow"
                opacity="0.9"
              />
              <path
                d="M227 147 L215 204 L208 259"
                fill="none"
                stroke="#fee2e2"
                strokeWidth="4"
                className="blood-flow"
                opacity="0.9"
              />
            </g>
          </g>

          {/* Animated blood flow in vessels */}
          <path
            d="M126 44 L132 108"
            fill="none"
            stroke="#a5f3fc"
            strokeWidth="3"
            className="blood-flow"
          />
          <path
            d="M224 104 L224 47"
            fill="none"
            stroke="#fecaca"
            strokeWidth="3"
            className="blood-flow-reverse"
          />

          {/* Labels */}
          <g fontSize="10" fontWeight="bold">
            <text x="9" y="52" fill="#0891b2">Vena Cava</text>
            <path d="M75 49 L114 49" stroke="#0891b2" strokeWidth="1.5" />

            <text x="265" y="37" fill="#dc2626">Aorta</text>
            <path d="M255 40 L242 49" stroke="#dc2626" strokeWidth="1.5" />

            <text x="4" y="190" fill="#0891b2">Right</text>
            <text x="4" y="202" fill="#0891b2">Atrium</text>
            <path d="M53 194 L115 174" stroke="#0891b2" strokeWidth="1.5" />

            <text x="4" y="257" fill="#0891b2">Right</text>
            <text x="4" y="269" fill="#0891b2">Ventricle</text>
            <path d="M62 253 L128 245" stroke="#0891b2" strokeWidth="1.5" />

            <text x="279" y="190" fill="#dc2626">Left</text>
            <text x="279" y="202" fill="#dc2626">Atrium</text>
            <path d="M277 193 L247 172" stroke="#dc2626" strokeWidth="1.5" />

            <text x="277" y="257" fill="#dc2626">Left</text>
            <text x="277" y="269" fill="#dc2626">Ventricle</text>
            <path d="M277 250 L231 248" stroke="#dc2626" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-1 text-[10px] font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500" />
          অক্সিজেন-স্বল্প রক্ত
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          অক্সিজেন-সমৃদ্ধ রক্ত
        </div>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-3">
        শিক্ষামূলক 3D-style schematic illustration; এটি প্রকৃত চিকিৎসাবিষয়ক anatomical model নয়।
      </p>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function TransportInOrganismsLab() {
  // Blood transfusion state
  const [donorGroup, setDonorGroup] =
    useState<BloodGroup>('O-');

  const [recipientGroup, setRecipientGroup] =
    useState<BloodGroup>('AB+');

  // Blood pressure state
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);

  // Heart state
  const [heartPlaying, setHeartPlaying] = useState(true);

  // Educational section
  const [showLearning, setShowLearning] = useState(false);

  // Blood group metadata
  const donorMeta = useMemo(
    () => BLOOD_GROUPS.find((b) => b.group === donorGroup)!,
    [donorGroup],
  );

  const recipientMeta = useMemo(
    () => BLOOD_GROUPS.find((b) => b.group === recipientGroup)!,
    [recipientGroup],
  );

  const compatible = isCompatible(donorMeta, recipientMeta);

  const canReceiveFrom = BLOOD_GROUPS
    .filter((d) => isCompatible(d, recipientMeta))
    .map((d) => d.group);

  const canDonateTo = BLOOD_GROUPS
    .filter((r) => isCompatible(donorMeta, r))
    .map((r) => r.group);

  const compatibilityReason = getCompatibilityReason(
    donorMeta,
    recipientMeta,
  );

  // ===================================================
  // BLOOD PRESSURE CLASSIFICATION
  // ===================================================

  const pulsePressure = systolic - diastolic;

  const bpInvalid = systolic <= diastolic;

  const getBpStatus = (): BPStatus => {
    if (systolic < 90 || diastolic < 60) {
      return {
        label: 'নিম্ন রক্তচাপ',
        labelEn: 'Hypotension',
        advice: 'রক্তচাপ কম। মাথা ঘোরা, দুর্বলতা বা অজ্ঞান হওয়ার মতো উপসর্গ থাকতে পারে। উপসর্গ থাকলে চিকিৎসকের পরামর্শ নাও।',
        color: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        percentage: 20,
      };
    }

    if (systolic >= 140 || diastolic >= 90) {
      return {
        label: 'উচ্চ রক্তচাপ - Stage 2',
        labelEn: 'Stage 2 Hypertension',
        advice: 'রক্তচাপ উল্লেখযোগ্যভাবে বেশি। নিয়মিত মাপা এবং চিকিৎসকের পরামর্শ নেওয়া গুরুত্বপূর্ণ।',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        percentage: 95,
      };
    }

    if (systolic >= 130 || diastolic >= 80) {
      return {
        label: 'উচ্চ রক্তচাপ - Stage 1',
        labelEn: 'Stage 1 Hypertension',
        advice: 'রক্তচাপ স্বাভাবিকের চেয়ে বেশি। স্বাস্থ্যকর খাদ্যাভ্যাস, ব্যায়াম এবং চিকিৎসকের পরামর্শ অনুসরণ করো।',
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        percentage: 75,
      };
    }

    if (systolic >= 120 && diastolic < 80) {
      return {
        label: 'বর্ধিত রক্তচাপ',
        labelEn: 'Elevated',
        advice: 'সিস্টোলিক চাপ কিছুটা বেশি। নিয়মিত ব্যায়াম, লবণ নিয়ন্ত্রণ এবং স্বাস্থ্যকর জীবনযাপন বজায় রাখো।',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        percentage: 55,
      };
    }

    return {
      label: 'স্বাভাবিক রক্তচাপ',
      labelEn: 'Normal',
      advice: 'রক্তচাপ স্বাভাবিক সীমায় রয়েছে। স্বাস্থ্যকর জীবনযাপন অব্যাহত রাখো।',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      percentage: 35,
    };
  };

  const bpStatus = getBpStatus();

  // ===================================================
  // RESET
  // ===================================================

  const handleReset = () => {
    setDonorGroup('O-');
    setRecipientGroup('AB+');
    setSystolic(120);
    setDiastolic(80);
    setHeartPlaying(true);
    setShowLearning(false);
  };

  // ===================================================
  // REUSABLE BLOOD GROUP BUTTONS
  // ===================================================

  const renderBloodGroups = (
    selected: BloodGroup,
    onSelect: (group: BloodGroup) => void,
    activeClass: string,
  ) => (
    <div className="grid grid-cols-4 gap-2">
      {BLOOD_GROUPS.map((blood) => (
        <button
          key={blood.group}
          type="button"
          onClick={() => onSelect(blood.group)}
          aria-pressed={selected === blood.group}
          className={`py-2.5 rounded-xl text-sm font-extrabold border transition-all duration-200 ${
            selected === blood.group
              ? `${activeClass} text-white border-transparent shadow-md scale-[1.03]`
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          {blood.group}
        </button>
      ))}
    </div>
  );

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="space-y-6">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950 p-5 sm:p-7 text-white">

        <div className="absolute -right-12 -top-16 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-wrap justify-between gap-4 items-start">

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-teal-200 text-[10px] font-bold tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              INTERACTIVE HUMAN CIRCULATION LAB
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold mt-3 leading-tight">
              রক্ত ও সংবহনতন্ত্র
              <span className="block text-teal-300">
                Interactive Biology Lab
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              মানব হৃৎপিণ্ডের গঠন, রক্ত সঞ্চালন, রক্তের গ্রুপের
              সামঞ্জস্যতা এবং রক্তচাপের কার্যপ্রণালি হাতে-কলমে
              পর্যবেক্ষণ করো।
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট ল্যাব
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-2 mt-6">
          {[
            { label: 'Blood Groups', value: '08', icon: Droplets },
            { label: 'Heart Model', value: '3D', icon: Heart },
            { label: 'BP Monitor', value: 'LIVE', icon: Gauge },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="p-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <Icon className="w-4 h-4 text-teal-300 mb-2" />
                <p className="text-lg sm:text-xl font-extrabold">
                  {item.value}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===============================================
          SECTION 1 - 3D HEART
      =============================================== */}

      <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50">
              <HeartPulse className="w-5 h-5 text-rose-600" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900">
                মানব হৃৎপিণ্ডের 3D মডেল
              </h3>
              <p className="text-[11px] text-slate-500">
                Structure & Blood Circulation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHeartPlaying((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
              heartPlaying
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {heartPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause Beat
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Start Beat
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6">

          {/* Heart Model */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-rose-50/50 border border-slate-100 p-3">
            <Heart3D isPlaying={heartPlaying} />
          </div>

          {/* Heart educational information */}
          <div className="space-y-3">

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  হৃৎপিণ্ডের চারটি প্রকোষ্ঠ
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: 'ডান অলিন্দ',
                    en: 'Right Atrium',
                    color: 'bg-sky-500',
                  },
                  {
                    name: 'বাম অলিন্দ',
                    en: 'Left Atrium',
                    color: 'bg-rose-500',
                  },
                  {
                    name: 'ডান নিলয়',
                    en: 'Right Ventricle',
                    color: 'bg-sky-600',
                  },
                  {
                    name: 'বাম নিলয়',
                    en: 'Left Ventricle',
                    color: 'bg-rose-600',
                  },
                ].map((chamber) => (
                  <div
                    key={chamber.en}
                    className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${chamber.color}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {chamber.name}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {chamber.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                প্রধান রক্তনালি
              </h4>

              <div className="space-y-3">
                {[
                  {
                    name: 'মহাধমনি',
                    en: 'Aorta',
                    desc: 'বাম নিলয় থেকে অক্সিজেনসমৃদ্ধ রক্ত দেহে পাঠায়।',
                    color: 'bg-rose-500',
                  },
                  {
                    name: 'মহাশিরা',
                    en: 'Vena Cava',
                    desc: 'দেহ থেকে অক্সিজেন-স্বল্প রক্ত ডান অলিন্দে আনে।',
                    color: 'bg-sky-500',
                  },
                  {
                    name: 'ফুসফুসীয় ধমনি',
                    en: 'Pulmonary Artery',
                    desc: 'ডান নিলয় থেকে রক্ত ফুসফুসে নিয়ে যায়।',
                    color: 'bg-sky-600',
                  },
                  {
                    name: 'ফুসফুসীয় শিরা',
                    en: 'Pulmonary Vein',
                    desc: 'ফুসফুস থেকে অক্সিজেনসমৃদ্ধ রক্ত বাম অলিন্দে আনে।',
                    color: 'bg-red-400',
                  },
                ].map((vessel) => (
                  <div key={vessel.en} className="flex gap-2.5">
                    <span className={`w-1 rounded-full shrink-0 ${vessel.color}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {vessel.name}
                        <span className="text-slate-400 font-normal ml-1">
                          ({vessel.en})
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {vessel.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 flex gap-2.5">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-teal-900">
                মনে রাখবে: ডান পাশের হৃৎপিণ্ড অক্সিজেন-স্বল্প রক্ত
                ফুসফুসে পাঠায় এবং বাম পাশের হৃৎপিণ্ড অক্সিজেনসমৃদ্ধ
                রক্ত সারা দেহে পাঠায়।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================================
          SECTION 2 - BLOOD GROUP
      =============================================== */}

      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50">
              <Droplets className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                রক্ত সঞ্চালন সামঞ্জস্যতা পরীক্ষাগার
              </h3>
              <p className="text-[11px] text-slate-500">
                ABO & Rh Blood Compatibility
              </p>
            </div>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold border ${
            compatible
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {compatible ? '✓ COMPATIBLE' : '✕ INCOMPATIBLE'}
          </span>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  রক্তদাতা (Donor)
                </p>
                <p className="text-[10px] text-slate-500">
                  Select donor blood group
                </p>
              </div>

              <span className="text-xl font-extrabold text-rose-600">
                {donorGroup}
              </span>
            </div>

            {renderBloodGroups(
              donorGroup,
              setDonorGroup,
              'bg-rose-600',
            )}

            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold">দান করতে পারবে:</span>
              <p className="font-extrabold text-rose-700 mt-1">
                {canDonateTo.join('  •  ')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  রক্তগ্রহীতা (Recipient)
                </p>
                <p className="text-[10px] text-slate-500">
                  Select recipient blood group
                </p>
              </div>

              <span className="text-xl font-extrabold text-teal-700">
                {recipientGroup}
              </span>
            </div>

            {renderBloodGroups(
              recipientGroup,
              setRecipientGroup,
              'bg-teal-600',
            )}

            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold">গ্রহণ করতে পারবে:</span>
              <p className="font-extrabold text-teal-700 mt-1">
                {canReceiveFrom.join('  •  ')}
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className={`p-4 rounded-2xl border flex gap-3 ${
          compatible
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-rose-50 border-rose-200'
        }`}>
          {compatible ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          )}

          <div>
            <h4 className={`text-sm font-extrabold ${
              compatible ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {donorGroup} → {recipientGroup}
              {' '}
              {compatible
                ? 'সামঞ্জস্যপূর্ণ'
                : 'সামঞ্জস্যপূর্ণ নয়'}
            </h4>

            <p className="text-xs mt-1 leading-relaxed text-slate-700">
              {compatibilityReason}
            </p>
          </div>
        </div>

        {/* Antigen antibody */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {[
            {
              title: `দাতা (${donorGroup})`,
              meta: donorMeta,
              color: 'text-rose-700',
            },
            {
              title: `গ্রহীতা (${recipientGroup})`,
              meta: recipientMeta,
              color: 'text-teal-700',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"
            >
              <h4 className="text-xs font-extrabold text-slate-900 mb-2">
                {item.title}
              </h4>

              <div className="space-y-1.5 text-[11px]">
                <p className="text-slate-600">
                  অ্যান্টিজেন:
                  <span className={`font-bold ml-1 ${item.color}`}>
                    {item.meta.antigens.join(', ') || 'নেই'}
                  </span>
                </p>

                <p className="text-slate-600">
                  অ্যান্টিবডি:
                  <span className="font-bold text-slate-800 ml-1">
                    {item.meta.antibodies.join(', ') || 'নেই'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Educational Note */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            <strong>বিশেষ দ্রষ্টব্য:</strong> O− কে Packed RBC-এর
            Universal Donor এবং AB+ কে Universal Recipient বলা হয়।
            এটি সাধারণ শিক্ষামূলক নিয়ম; বাস্তবে Crossmatch ও
            চিকিৎসকের সিদ্ধান্ত ছাড়া রক্ত সঞ্চালন করা যাবে না।
          </p>
        </div>
      </section>

      {/* ===============================================
          SECTION 3 - BLOOD PRESSURE SIMULATOR
      =============================================== */}

      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50">
              <Gauge className="w-5 h-5 text-teal-600" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                রক্তচাপ সিমুলেটর
              </h3>
              <p className="text-[11px] text-slate-500">
                Blood Pressure Monitor
              </p>
            </div>
          </div>

          <span className={`px-3 py-1.5 rounded-full border text-[10px] font-extrabold ${bpStatus.bg} ${bpStatus.color} ${bpStatus.border}`}>
            {bpStatus.labelEn}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Controls */}
          <div className="space-y-5">

            {/* Systolic */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    সিস্টোলিক চাপ
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Systolic Pressure
                  </p>
                </div>

                <span className="text-lg font-extrabold text-rose-600 font-mono">
                  {systolic}
                  <span className="text-[10px] ml-1">mmHg</span>
                </span>
              </div>

              <input
                type="range"
                min={70}
                max={180}
                step={1}
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
                aria-label="Systolic pressure"
              />

              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>70</span>
                <span>120</span>
                <span>180 mmHg</span>
              </div>

              <p className="text-[10px] text-slate-500 mt-2">
                হৃৎপিণ্ডের নিলয় সংকুচিত হলে ধমনিতে যে চাপ সৃষ্টি হয়।
              </p>
            </div>

            {/* Diastolic */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    ডায়াস্টোলিক চাপ
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Diastolic Pressure
                  </p>
                </div>

                <span className="text-lg font-extrabold text-sky-600 font-mono">
                  {diastolic}
                  <span className="text-[10px] ml-1">mmHg</span>
                </span>
              </div>

              <input
                type="range"
                min={45}
                max={120}
                step={1}
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
                aria-label="Diastolic pressure"
              />

              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>45</span>
                <span>80</span>
                <span>120 mmHg</span>
              </div>

              <p className="text-[10px] text-slate-500 mt-2">
                নিলয় প্রসারিত হলে ধমনিতে যে চাপ বজায় থাকে।
              </p>
            </div>

            {/* Invalid pressure */}
            {bpInvalid && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-800">
                  সিস্টোলিক চাপ সাধারণত ডায়াস্টোলিক চাপের চেয়ে বেশি
                  হয়। বর্তমান রিডিংটি শারীরবৃত্তীয়ভাবে অস্বাভাবিক।
                </p>
              </div>
            )}

            {/* Advice */}
            <div className={`p-3.5 rounded-xl border ${bpStatus.bg} ${bpStatus.border}`}>
              <div className="flex gap-2">
                <Info className={`w-4 h-4 shrink-0 mt-0.5 ${bpStatus.color}`} />
                <div>
                  <p className={`text-xs font-extrabold ${bpStatus.color}`}>
                    {bpStatus.label}
                  </p>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    {bpStatus.advice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Monitor */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-5 sm:p-6 text-white flex flex-col justify-between min-h-[290px]">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-bold tracking-wider text-slate-400">
                  DIGITAL BP MONITOR
                </span>
              </div>

              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="text-center py-5">
              <p className="text-[10px] tracking-widest text-slate-400 mb-2">
                BLOOD PRESSURE
              </p>

              <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-teal-300">
                {systolic}
                <span className="text-slate-500 mx-1">/</span>
                {diastolic}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                mmHg
              </p>

              <div className={`inline-flex px-3 py-1.5 mt-4 rounded-full text-[10px] font-bold ${
                bpStatus.bg
              } ${bpStatus.color}`}>
                {bpStatus.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] text-slate-400">
                  Pulse Pressure
                </p>
                <p className="text-xl font-extrabold text-white font-mono mt-1">
                  {pulsePressure}
                  <span className="text-[10px] ml-1 text-slate-400">
                    mmHg
                  </span>
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">
                  BP Category
                </p>
                <p className="text-sm font-bold text-teal-300 mt-2">
                  {bpStatus.labelEn}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BP Reference */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800">
            রক্তচাপের শ্রেণিবিভাগ (প্রাপ্তবয়স্কদের জন্য)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                name: 'Normal',
                value: '120-এর কম এবং 80-এর কম',
                color: 'bg-emerald-500',
              },
              {
                name: 'Elevated',
                value: '120–129 এবং 80-এর কম',
                color: 'bg-amber-500',
              },
              {
                name: 'Stage 1',
                value: '130–139 অথবা 80–89',
                color: 'bg-orange-500',
              },
              {
                name: 'Stage 2',
                value: '140 বা বেশি অথবা 90 বা বেশি',
                color: 'bg-rose-500',
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50"
              >
                <span className={`w-2 h-8 rounded-full ${item.color}`} />
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {item.value} mmHg
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            নিম্ন রক্তচাপের জন্য সাধারণত 90/60 mmHg-এর নিচের
            রিডিংকে একটি প্রচলিত নির্দেশক হিসেবে ধরা হয়।
            BP শ্রেণিবিভাগ একাধিক সঠিক পরিমাপের ভিত্তিতে
            চিকিৎসক নির্ধারণ করেন।
          </p>
        </div>
      </section>

      {/* ===============================================
          SECTION 4 - LEARNING
      =============================================== */}

      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white overflow-hidden">

        <button
          type="button"
          onClick={() => setShowLearning((v) => !v)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left"
          aria-expanded={showLearning}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                শেখার বিষয়গুলো
              </h3>
              <p className="text-[10px] text-slate-500">
                Important Biology Concepts
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-600">
            {showLearning ? 'বন্ধ করো −' : 'বিস্তারিত দেখো +'}
          </span>
        </button>

        {showLearning && (
          <div className="px-4 sm:px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

            {[
              {
                title: 'দ্বৈত সংবহন',
                en: 'Double Circulation',
                desc: 'একবার পূর্ণ রক্ত সঞ্চালনে রক্ত হৃৎপিণ্ডের মধ্য দিয়ে দুইবার অতিক্রম করে।',
              },
              {
                title: 'সিস্টোল',
                en: 'Systole',
                desc: 'হৃৎপিণ্ডের প্রকোষ্ঠ বিশেষত নিলয় সংকুচিত হয়ে রক্ত বাইরে পাঠায়।',
              },
              {
                title: 'ডায়াস্টোল',
                en: 'Diastole',
                desc: 'হৃৎপিণ্ডের পেশি শিথিল হয় এবং প্রকোষ্ঠে রক্ত প্রবেশ করে।',
              },
              {
                title: 'অ্যাগলুটিনেশন',
                en: 'Agglutination',
                desc: 'অসামঞ্জস্যপূর্ণ রক্তের RBC অ্যান্টিজেন ও অ্যান্টিবডির বিক্রিয়ায় জমাট বাঁধতে পারে।',
              },
            ].map((item) => (
              <div
                key={item.en}
                className="p-3.5 rounded-xl bg-white border border-indigo-100"
              >
                <h4 className="text-xs font-extrabold text-indigo-800">
                  {item.title}
                </h4>
                <p className="text-[9px] text-indigo-400 font-semibold mt-0.5">
                  {item.en}
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer note */}
      <div className="flex gap-2 items-start px-2 pb-2">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          এই ল্যাবটি জীববিজ্ঞানের শিক্ষামূলক সিমুলেশন।
          এটি রোগ নির্ণয়, চিকিৎসা বা বাস্তব রক্ত সঞ্চালনের
          বিকল্প নয়।
        </p>
      </div>
    </div>
  );
}
