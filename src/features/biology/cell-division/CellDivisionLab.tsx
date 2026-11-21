
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dna,
  GitCompare,
  Info,
  Layers,
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Microscope,
  CheckCircle2,
  Sparkles,
  Atom,
  RefreshCw,
  ArrowRight,
  CircleHelp,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface MitosisStage {
  id: string;
  step: number;
  nameBn: string;
  nameEn: string;
  badge: string;
  nucleusStatus: string;
  chromosomeStatus: string;
  keyEvent: string;
  observation: string;
}

interface OrganismPreset {
  nameBn: string;
  nameEn: string;
  diploid: number;
}

type CellType = 'animal' | 'plant';

// =====================================================
// MITOSIS DATA
// =====================================================

const MITOSIS_STAGES: MitosisStage[] = [
  {
    id: 'prophase',
    step: 1,
    nameBn: 'প্রোফেজ',
    nameEn: 'Prophase',
    badge: 'ক্রোমোজোম ঘনীভবন',
    nucleusStatus:
      'নিউক্লিয়ার মেমব্রেন ও নিউক্লিওলাস প্রথমদিকে অক্ষত থাকে। প্রাণিকোষে সেন্ট্রিওল দুটি বিপরীত মেরুর দিকে সরে যায়।',
    chromosomeStatus:
      'ক্রোমাটিন জালিকা ঘনীভূত হয়ে খাটো ও মোটা ক্রোমোজোমে পরিণত হয়। প্রতিটি ক্রোমোজোমে দুটি সিস্টার ক্রোমাটিড থাকে।',
    keyEvent:
      'ক্রোমাটিন জালিকা থেকে দৃশ্যমান ক্রোমোজোম তৈরি হয় এবং স্পিন্ডল গঠন শুরু হয়।',
    observation:
      'একটি ক্রোমোজোমের দুটি সিস্টার ক্রোমাটিড সেন্ট্রোমিয়ারে যুক্ত থাকে।',
  },
  {
    id: 'prometaphase',
    step: 2,
    nameBn: 'প্রো-মেটাফেজ',
    nameEn: 'Prometaphase',
    badge: 'স্পিন্ডল সংযুক্তি',
    nucleusStatus:
      'নিউক্লিয়ার মেমব্রেন ভেঙে যায় এবং নিউক্লিওলাস অদৃশ্য হয়।',
    chromosomeStatus:
      'স্পিন্ডল মাইক্রোটিউবিউল ক্রোমোজোমের কাইনেটোকোরের সঙ্গে যুক্ত হয়। ক্রোমোজোমগুলো বিষুবীয় অঞ্চলের দিকে চলতে থাকে।',
    keyEvent:
      'নিউক্লিয়ার মেমব্রেনের বিলুপ্তি এবং স্পিন্ডল তন্তুর ক্রোমোজোমের সঙ্গে সংযুক্তি।',
    observation:
      'ক্রোমোজোমগুলো এখনো বিষুবীয় অঞ্চলে সম্পূর্ণ সারিবদ্ধ হয়নি।',
  },
  {
    id: 'metaphase',
    step: 3,
    nameBn: 'মেটাফেজ',
    nameEn: 'Metaphase',
    badge: 'বিষুবীয় অঞ্চলে সজ্জা',
    nucleusStatus:
      'নিউক্লিয়ার মেমব্রেন ও নিউক্লিওলাস অনুপস্থিত থাকে। স্পিন্ডল যন্ত্র সম্পূর্ণ সক্রিয় থাকে।',
    chromosomeStatus:
      'সব ক্রোমোজোম কোষের বিষুবীয় অঞ্চলে সারিবদ্ধ হয়। প্রতিটি ক্রোমোজোমের সিস্টার ক্রোমাটিড বিপরীত মেরুর স্পিন্ডল তন্তুর সঙ্গে যুক্ত থাকে।',
    keyEvent:
      'ক্রোমোজোমগুলো বিষুবীয় অঞ্চলে সারিবদ্ধ হয় এবং ক্রোমোজোম সবচেয়ে খাটো ও মোটা অবস্থায় দেখা যায়।',
    observation:
      'এই পর্যায়ে ক্রোমোজোমের সংখ্যা ও গঠন পর্যবেক্ষণ করা সবচেয়ে সহজ।',
  },
  {
    id: 'anaphase',
    step: 4,
    nameBn: 'অ্যানাফেজ',
    nameEn: 'Anaphase',
    badge: 'ক্রোমাটিড পৃথকীকরণ',
    nucleusStatus:
      'অপত্য ক্রোমোজোমগুলো স্পিন্ডল তন্তুর সাহায্যে বিপরীত মেরুর দিকে সরে যায়।',
    chromosomeStatus:
      'সেন্ট্রোমিয়ার বিভক্ত হয়। সিস্টার ক্রোমাটিড পৃথক হয়ে অপত্য ক্রোমোজোমে পরিণত হয়।',
    keyEvent:
      'অপত্য ক্রোমোজোমগুলো বিপরীত মেরুতে গমন করে। সেন্ট্রোমিয়ার অগ্রগামী থাকে।',
    observation:
      'ক্রোমোজোমের সেন্ট্রোমিয়ারের অবস্থানের ওপর নির্ভর করে V, L, J বা I আকৃতি দেখা যেতে পারে।',
  },
  {
    id: 'telophase',
    step: 5,
    nameBn: 'টেলোফেজ',
    nameEn: 'Telophase',
    badge: 'দুটি নিউক্লিয়াস গঠন',
    nucleusStatus:
      'দুই মেরুতে নতুন নিউক্লিয়ার মেমব্রেন ও নিউক্লিওলাস পুনরায় গঠিত হয়।',
    chromosomeStatus:
      'ক্রোমোজোমগুলো ধীরে ধীরে প্রসারিত হয়ে ক্রোমাটিন জালিকায় পরিণত হয়।',
    keyEvent:
      'দুটি অপত্য নিউক্লিয়াস তৈরি হয়। পরবর্তীতে সাইটোকাইনেসিসের মাধ্যমে দুটি কোষ সৃষ্টি হয়।',
    observation:
      'প্রাণিকোষে ক্লিভেজ ফারো এবং উদ্ভিদকোষে কোষপ্লেট তৈরি হয়।',
  },
];

// =====================================================
// ORGANISM PRESETS
// =====================================================

const ORGANISM_PRESETS: OrganismPreset[] = [
  { nameBn: 'মানুষ', nameEn: 'Human', diploid: 46 },
  { nameBn: 'ধান', nameEn: 'Rice', diploid: 24 },
  { nameBn: 'পেঁয়াজ', nameEn: 'Onion', diploid: 16 },
  { nameBn: 'ড্রসোফিলা', nameEn: 'Fruit Fly', diploid: 8 },
  { nameBn: 'মটরশুঁটি', nameEn: 'Pea', diploid: 14 },
];

// =====================================================
// SVG CHROMOSOME COMPONENT
// =====================================================

function Chromosome({
  x,
  y,
  color,
  scale = 1,
}: {
  x: number;
  y: number;
  color: string;
  scale?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M -8 -13 L 0 0 L 8 13" />
      <path d="M 8 -13 L 0 0 L -8 13" />
      <circle cx="0" cy="0" r="3.5" fill="#334155" stroke="none" />
    </g>
  );
}

// =====================================================
// SVG SPINDLE COMPONENT
// =====================================================

function SpindleFibers({
  stage,
  plant,
}: {
  stage: string;
  plant: boolean;
}) {
  if (stage === 'prophase') return null;

  const topX = plant ? 130 : 130;
  const bottomY = plant ? 210 : 205;

  return (
    <g
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.5"
      opacity="0.8"
      strokeLinecap="round"
    >
      {[55, 85, 110, 150, 175, 205].map((x, i) => {
        const targetX = stage === 'anaphase'
          ? i % 2 === 0 ? x - 15 : x + 15
          : x;

        return (
          <g key={i}>
            <path
              d={`M ${topX} 35 Q ${targetX - 15} 115 ${targetX} ${bottomY}`}
            />
            <path
              d={`M ${topX} 35 Q ${targetX + 15} 115 ${targetX} ${bottomY}`}
            />
          </g>
        );
      })}
    </g>
  );
}

// =====================================================
// MAIN 2D CELL ILLUSTRATION
// =====================================================

function CellIllustration({
  stage,
  cellType,
}: {
  stage: MitosisStage;
  cellType: CellType;
}) {
  const isPlant = cellType === 'plant';
  const isTelophase = stage.id === 'telophase';
  const isAnaphase = stage.id === 'anaphase';
  const isMetaphase = stage.id === 'metaphase';
  const isProphase = stage.id === 'prophase';
  const isPrometaphase = stage.id === 'prometaphase';

  const colors = ['#e11d48', '#2563eb', '#d97706', '#7c3aed'];

  return (
    <svg
      viewBox="0 0 260 250"
      className="w-full max-w-[330px] h-auto overflow-visible"
      role="img"
      aria-label={`${stage.nameBn} পর্যায়ের ${isPlant ? 'উদ্ভিদকোষ' : 'প্রাণিকোষ'} চিত্র`}
    >
      <defs>
        <radialGradient id="cellFill">
          <stop offset="0%" stopColor="#ccfbf1" />
          <stop offset="100%" stopColor="#f0fdfa" />
        </radialGradient>

        <linearGradient id="nucleusFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </linearGradient>
      </defs>

      {/* Cell Wall / Cell Membrane */}
      {isPlant ? (
        <rect
          x="18"
          y="12"
          width="224"
          height="224"
          rx="22"
          fill="#ecfccb"
          stroke="#65a30d"
          strokeWidth="5"
        />
      ) : (
        <ellipse
          cx="130"
          cy="125"
          rx="112"
          ry="112"
          fill="url(#cellFill)"
          stroke="#0d9488"
          strokeWidth="3"
        />
      )}

      {/* Inner membrane for plant cell */}
      {isPlant && (
        <rect
          x="25"
          y="19"
          width="210"
          height="210"
          rx="17"
          fill="#f0fdfa"
          stroke="#0d9488"
          strokeWidth="2"
        />
      )}

      {/* Cytoplasm texture */}
      {[45, 75, 185, 215].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={i % 2 === 0 ? 70 : 190}
          r="2.5"
          fill="#5eead4"
          opacity="0.5"
        />
      ))}

      {/* Animal cell centrioles */}
      {!isPlant && !isProphase && (
        <g fill="#0f766e">
          <rect
            x="121"
            y="24"
            width="18"
            height="5"
            rx="2.5"
            transform="rotate(-25 130 26)"
          />
          <rect
            x="121"
            y="217"
            width="18"
            height="5"
            rx="2.5"
            transform="rotate(25 130 219)"
          />
        </g>
      )}

      {/* Spindle Fibers */}
      <SpindleFibers stage={stage.id} plant={isPlant} />

      {/* Prophase */}
      {isProphase && (
        <g>
          <circle
            cx="130"
            cy="125"
            r="55"
            fill="url(#nucleusFill)"
            stroke="#0f766e"
            strokeWidth="2"
            strokeDasharray="none"
          />

          <circle cx="149" cy="108" r="9" fill="#0f766e" opacity="0.45" />

          <Chromosome x={105} y={110} color="#e11d48" scale={0.9} />
          <Chromosome x={145} y={145} color="#2563eb" scale={0.9} />
          <Chromosome x={158} y={92} color="#d97706" scale={0.75} />

          <path
            d="M 85 140 Q 110 155 125 132"
            stroke="#7c3aed"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 3"
          />

          <text
            x="130"
            y="195"
            textAnchor="middle"
            fontSize="9"
            fill="#0f766e"
            fontWeight="bold"
          >
            Chromosome Condensation
          </text>
        </g>
      )}

      {/* Prometaphase */}
      {isPrometaphase && (
        <g>
          {/* Broken Nuclear Envelope */}
          <circle
            cx="130"
            cy="125"
            r="52"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2"
            strokeDasharray="9 7"
            opacity="0.6"
          />

          <Chromosome x={95} y={90} color="#e11d48" />
          <Chromosome x={163} y={110} color="#2563eb" />
          <Chromosome x={115} y={160} color="#d97706" />
          <Chromosome x={175} y={155} color="#7c3aed" />

          <circle cx="130" cy="125" r="3" fill="#334155" />
        </g>
      )}

      {/* Metaphase */}
      {isMetaphase && (
        <g>
          {/* Equatorial Plane */}
          <line
            x1="35"
            y1="125"
            x2="225"
            y2="125"
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.7"
          />

          {[80, 115, 150, 185].map((x, i) => (
            <g key={x}>
              <Chromosome
                x={x}
                y={125}
                color={colors[i]}
                scale={1.05}
              />
            </g>
          ))}

          <text
            x="130"
            y="190"
            textAnchor="middle"
            fontSize="10"
            fill="#0f766e"
            fontWeight="bold"
          >
            Equatorial Plate
          </text>
        </g>
      )}

      {/* Anaphase */}
      {isAnaphase && (
        <g>
          {/* Top daughter chromosomes */}
          {colors.map((color, i) => {
            const x = 72 + i * 38;
            return (
              <g
                key={`top-${i}`}
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              >
                <path d={`M ${x - 7} 100 L ${x} 80 L ${x + 7} 100`} />
                <circle cx={x} cy="80" r="3" fill={color} stroke="none" />
              </g>
            );
          })}

          {/* Bottom daughter chromosomes */}
          {colors.map((color, i) => {
            const x = 72 + i * 38;
            return (
              <g
                key={`bottom-${i}`}
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              >
                <path d={`M ${x - 7} 150 L ${x} 170 L ${x + 7} 150`} />
                <circle cx={x} cy="170" r="3" fill={color} stroke="none" />
              </g>
            );
          })}

          <text
            x="130"
            y="125"
            textAnchor="middle"
            fontSize="9"
            fill="#0f766e"
            fontWeight="bold"
          >
            Separation
          </text>
        </g>
      )}

      {/* Telophase */}
      {isTelophase && (
        <g>
          {isPlant ? (
            <>
              {/* Cell plate */}
              <rect
                x="127"
                y="20"
                width="6"
                height="210"
                fill="#0d9488"
                opacity="0.8"
              />

              <circle
                cx="78"
                cy="125"
                r="35"
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
              />

              <circle
                cx="182"
                cy="125"
                r="35"
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
              />

              <path
                d="M 60 125 Q 78 105 95 125 T 60 125"
                stroke="#e11d48"
                strokeWidth="2.5"
                fill="none"
              />

              <path
                d="M 164 125 Q 182 105 199 125 T 164 125"
                stroke="#2563eb"
                strokeWidth="2.5"
                fill="none"
              />
            </>
          ) : (
            <>
              {/* Cleavage Furrow */}
              <path
                d="M 130 18 C 85 45 100 90 130 125 C 100 160 85 205 130 232"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                strokeDasharray="5 3"
              />

              <ellipse
                cx="78"
                cy="125"
                rx="48"
                ry="77"
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
              />

              <ellipse
                cx="182"
                cy="125"
                rx="48"
                ry="77"
                fill="#ccfbf1"
                stroke="#0f766e"
                strokeWidth="2"
              />

              <circle cx="78" cy="125" r="28" fill="#99f6e4" stroke="#0f766e" strokeWidth="2" />
              <circle cx="182" cy="125" r="28" fill="#99f6e4" stroke="#0f766e" strokeWidth="2" />

              <path d="M 62 125 Q 78 105 94 125 T 62 125" stroke="#e11d48" strokeWidth="2.5" fill="none" />
              <path d="M 166 125 Q 182 105 198 125 T 166 125" stroke="#2563eb" strokeWidth="2.5" fill="none" />
            </>
          )}
        </g>
      )}

      {/* Cell type label */}
      <text
        x="130"
        y="247"
        textAnchor="middle"
        fontSize="9"
        fill="#64748b"
        fontWeight="bold"
      >
        {isPlant ? 'PLANT CELL' : 'ANIMAL CELL'}
      </text>
    </svg>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CellDivisionLab() {
  // Mitosis simulator
  const [stageIndex, setStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cellType, setCellType] = useState<CellType>('animal');
  const [showObservation, setShowObservation] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(2500);

  // Chromosome calculator
  const [diploidCount, setDiploidCount] = useState(46);
  const [customCount, setCustomCount] = useState('46');

  const activeStage = MITOSIS_STAGES[stageIndex];

  const haploidCount = diploidCount / 2;

  const progress = ((stageIndex + 1) / MITOSIS_STAGES.length) * 100;

  // =====================================================
  // AUTO PLAY
  // =====================================================

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setStageIndex((current) => {
        if (current >= MITOSIS_STAGES.length - 1) {
          setIsPlaying(false);
          return 0;
        }

        return current + 1;
      });
    }, animationSpeed);

    return () => window.clearInterval(timer);
  }, [isPlaying, animationSpeed]);

  // =====================================================
  // CALCULATOR
  // =====================================================

  const comparison = useMemo(() => {
    return {
      mitosis: {
        cells: 2,
        chromosomePerCell: diploidCount,
        totalChromosomes: diploidCount * 2,
      },
      meiosis: {
        cells: 4,
        chromosomePerCell: haploidCount,
        totalChromosomes: diploidCount * 2,
      },
    };
  }, [diploidCount, haploidCount]);

  const handleCountChange = (value: string) => {
    setCustomCount(value);

    const number = Number(value);

    if (
      Number.isInteger(number) &&
      number >= 2 &&
      number <= 60 &&
      number % 2 === 0
    ) {
      setDiploidCount(number);
    }
  };

  const handlePreset = (organism: OrganismPreset) => {
    setDiploidCount(organism.diploid);
    setCustomCount(String(organism.diploid));
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goToStage = (index: number) => {
    const safeIndex = Math.max(
      0,
      Math.min(index, MITOSIS_STAGES.length - 1),
    );

    setStageIndex(safeIndex);
  };

  const handlePlay = () => {
    if (stageIndex === MITOSIS_STAGES.length - 1) {
      setStageIndex(0);
    }

    setIsPlaying(true);
  };

  const handleReset = () => {
    setStageIndex(0);
    setIsPlaying(false);
    setCellType('animal');
    setAnimationSpeed(2500);
    setDiploidCount(46);
    setCustomCount('46');
    setShowObservation(true);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 p-5 sm:p-7 text-white shadow-lg">

        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-52 h-52 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE BIOLOGY LAB
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-4">

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Cell Division Lab
              </h2>

              <p className="text-sm text-teal-100 mt-2 leading-relaxed max-w-2xl">
                মাইটোসিসের ৫টি ধাপ 2D অ্যানিমেশনে পর্যবেক্ষণ করো এবং মাইটোসিস ও মিয়োসিসের ক্রোমোজোম সংখ্যা তুলনা করো।
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              রিসেট ল্যাব
            </button>

          </div>

          <div className="flex flex-wrap gap-3 mt-5">

            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15">
              <p className="text-[10px] text-teal-100">MITOSIS STAGES</p>
              <p className="text-xl font-extrabold">05</p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15">
              <p className="text-[10px] text-teal-100">CELL TYPE</p>
              <p className="text-xl font-extrabold">
                {cellType === 'animal' ? 'Animal' : 'Plant'}
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15">
              <p className="text-[10px] text-teal-100">CHROMOSOMES</p>
              <p className="text-xl font-extrabold">{diploidCount}</p>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          SECTION 1: MITOSIS SIMULATOR
      ================================================= */}

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Microscope className="w-5 h-5 text-teal-600" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  মাইটোসিস 2D সিমুলেটর
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Explore Five Stages of Mitosis
                </p>
              </div>

            </div>

            <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold">
              {activeStage.step}/5 — {activeStage.badge}
            </span>

          </div>

          {/* Progress */}
          <div className="mt-5">

            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>বিভাজনের অগ্রগতি</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

        </div>

        <div className="p-5 sm:p-6 space-y-5">

          {/* Cell Type Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="text-sm font-bold text-slate-800">
                কোষের ধরন নির্বাচন
              </p>

              <p className="text-xs text-slate-400 mt-1">
                উদ্ভিদকোষ ও প্রাণিকোষের বিভাজন পর্যবেক্ষণ করো।
              </p>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-slate-100">

              <button
                type="button"
                onClick={() => setCellType('animal')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  cellType === 'animal'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                প্রাণিকোষ
              </button>

              <button
                type="button"
                onClick={() => setCellType('plant')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  cellType === 'plant'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                উদ্ভিদকোষ
              </button>

            </div>

          </div>

          {/* Stage Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">

            {MITOSIS_STAGES.map((stage, index) => {
              const selected = stageIndex === index;
              const completed = stageIndex > index;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    goToStage(index);
                  }}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >

                  <div className="flex items-center justify-between gap-1">

                    <span className={`text-xs font-extrabold ${
                      selected ? 'text-white' : 'text-slate-500'
                    }`}>
                      STEP 0{stage.step}
                    </span>

                    {completed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}

                  </div>

                  <p className="text-xs sm:text-sm font-extrabold mt-2">
                    {stage.nameBn}
                  </p>

                  <p className={`text-[10px] mt-1 ${
                    selected ? 'text-teal-100' : 'opacity-60'
                  }`}>
                    {stage.nameEn}
                  </p>

                </button>
              );
            })}

          </div>

          {/* Simulator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* SVG Visualization */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 sm:p-5">

              <div className="flex items-center justify-between mb-3">

                <span className="text-xs font-bold text-slate-600">
                  <Activity className="w-3.5 h-3.5 inline mr-1 text-teal-600" />
                  LIVE CELL VIEW
                </span>

                <span className="text-[10px] font-bold text-teal-700 bg-white border border-teal-100 rounded-full px-2.5 py-1">
                  {cellType === 'animal' ? 'Animal Cell' : 'Plant Cell'}
                </span>

              </div>

              <div className="flex justify-center items-center min-h-[300px]">

                <div
                  key={`${activeStage.id}-${cellType}`}
                  className="w-full flex justify-center animate-in fade-in duration-300"
                >
                  <CellIllustration
                    stage={activeStage}
                    cellType={cellType}
                  />
                </div>

              </div>

              {/* Visual Legend */}
              <div className="grid grid-cols-2 gap-2 mt-2">

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-rose-600" />
                  <span className="text-[10px] text-slate-600 font-semibold">
                    ক্রোমোজোম
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-[10px] text-slate-600 font-semibold">
                    স্পিন্ডল তন্তু
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-teal-600" />
                  <span className="text-[10px] text-slate-600 font-semibold">
                    নিউক্লিয়াস / মেরু
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-lime-600" />
                  <span className="text-[10px] text-slate-600 font-semibold">
                    কোষপ্রাচীর
                  </span>
                </div>

              </div>

              <p className="text-[10px] text-center text-slate-400 mt-3">
                চিত্রটি শিক্ষামূলক 2D schematic illustration; প্রকৃত কোষের অনুপাত নয়।
              </p>

            </div>

            {/* Stage Details */}
            <div className="lg:col-span-6 space-y-4">

              <div>

                <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg">
                  <Layers className="w-3.5 h-3.5" />
                  STAGE {activeStage.step}
                </div>

                <h4 className="text-xl font-extrabold text-slate-900 mt-3">
                  {activeStage.nameBn}
                </h4>

                <p className="text-xs text-slate-400 mt-1">
                  {activeStage.nameEn}
                </p>

              </div>

              {/* Main Event */}
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-4">

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h5 className="text-xs font-extrabold text-teal-900">
                    এই ধাপে কী ঘটে?
                  </h5>
                </div>

                <p className="text-sm text-teal-950 leading-7">
                  {activeStage.keyEvent}
                </p>

              </div>

              {/* Nucleus */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                <div className="flex items-center gap-2 mb-2">
                  <Atom className="w-4 h-4 text-indigo-600" />

                  <h5 className="text-xs font-extrabold text-slate-800">
                    নিউক্লিয়াসের অবস্থা
                  </h5>
                </div>

                <p className="text-sm text-slate-600 leading-7">
                  {activeStage.nucleusStatus}
                </p>

              </div>

              {/* Chromosomes */}
              <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-4">

                <div className="flex items-center gap-2 mb-2">
                  <Dna className="w-4 h-4 text-indigo-600" />

                  <h5 className="text-xs font-extrabold text-indigo-900">
                    ক্রোমোজোমের পরিবর্তন
                  </h5>
                </div>

                <p className="text-sm text-indigo-950 leading-7">
                  {activeStage.chromosomeStatus}
                </p>

              </div>

              {/* Observation */}
              <button
                type="button"
                onClick={() => setShowObservation(!showObservation)}
                className="w-full flex items-center justify-between gap-2 text-xs font-bold text-slate-600 p-3 rounded-xl border border-dashed border-slate-300 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  পর্যবেক্ষণ ও শেখার বিষয়
                </span>

                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showObservation ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showObservation && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-950 leading-6">
                  {activeStage.observation}
                </div>
              )}

            </div>

          </div>

          {/* Playback Controls */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>
                <p className="text-sm font-extrabold">
                  Simulation Controls
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  ধাপে ধাপে অথবা স্বয়ংক্রিয়ভাবে দেখো।
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    goToStage(0);
                  }}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="First stage"
                  title="প্রথম ধাপ"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  disabled={!isPlaying}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30"
                  aria-label="Pause"
                >
                  <Pause className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Play
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    goToStage(MITOSIS_STAGES.length - 1);
                  }}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Last stage"
                  title="শেষ ধাপ"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* Speed */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10">

              <span className="text-xs text-slate-400 font-semibold">
                Animation Speed
              </span>

              {[4000, 2500, 1200].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setAnimationSpeed(speed)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                    animationSpeed === speed
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {speed === 4000
                    ? 'Slow'
                    : speed === 2500
                      ? 'Normal'
                      : 'Fast'}
                </button>
              ))}

              <span className="text-[10px] text-slate-400 ml-auto">
                {animationSpeed / 1000}s / stage
              </span>

            </div>

          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">

            <button
              type="button"
              disabled={stageIndex === 0}
              onClick={() => {
                setIsPlaying(false);
                goToStage(stageIndex - 1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              আগের ধাপ
            </button>

            <span className="text-xs font-bold text-slate-500">
              {stageIndex + 1} / 5
            </span>

            <button
              type="button"
              disabled={stageIndex === MITOSIS_STAGES.length - 1}
              onClick={() => {
                setIsPlaying(false);
                goToStage(stageIndex + 1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 disabled:opacity-40"
            >
              পরের ধাপ
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </section>

      {/* =================================================
          SECTION 2: CHROMOSOME CALCULATOR
      ================================================= */}

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-indigo-600" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                ক্রোমোজোম ক্যালকুলেটর
              </h3>

              <p className="text-xs text-slate-400 mt-0.5">
                Mitosis vs Meiosis Comparison
              </p>
            </div>

          </div>

        </div>

        <div className="p-5 sm:p-6 space-y-5">

          {/* Presets */}
          <div>

            <p className="text-sm font-bold text-slate-800 mb-3">
              জীব নির্বাচন করো
            </p>

            <div className="flex flex-wrap gap-2">

              {ORGANISM_PRESETS.map((organism) => (
                <button
                  key={organism.nameEn}
                  type="button"
                  onClick={() => handlePreset(organism)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    diploidCount === organism.diploid
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                  }`}
                >
                  {organism.nameBn}
                  <span className="ml-1 opacity-70">
                    (2n={organism.diploid})
                  </span>
                </button>
              ))}

            </div>

          </div>

          {/* Manual Input */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">

            <div className="flex items-center justify-between gap-2">

              <label className="text-sm font-bold text-slate-800">
                মাতৃকোষের ডিপ্লয়েড ক্রোমোজোম সংখ্যা (2n)
              </label>

              <span className="text-sm font-extrabold text-indigo-700">
                {diploidCount}
              </span>

            </div>

            <input
              type="range"
              min="2"
              max="60"
              step="2"
              value={diploidCount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setDiploidCount(value);
                setCustomCount(String(value));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            <div className="flex items-center gap-3">

              <input
                type="number"
                min="2"
                max="60"
                step="2"
                value={customCount}
                onChange={(e) => handleCountChange(e.target.value)}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              <p className="text-xs text-slate-500">
                ২ থেকে ৬০ পর্যন্ত জোড় সংখ্যা ব্যবহার করো।
              </p>

            </div>

            {Number(customCount) !== diploidCount && (
              <p className="text-xs text-rose-600">
                একটি বৈধ জোড় সংখ্যা লিখুন।
              </p>
            )}

          </div>

          {/* Formula */}
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">

            <p className="text-xs font-bold text-indigo-800 mb-2">
              ক্রোমোজোম সংখ্যার সম্পর্ক
            </p>

            <div className="grid grid-cols-2 gap-3 text-center">

              <div className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-slate-500">Diploid</p>
                <p className="text-xl font-extrabold text-indigo-700">
                  2n = {diploidCount}
                </p>
              </div>

              <div className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-slate-500">Haploid</p>
                <p className="text-xl font-extrabold text-teal-700">
                  n = {haploidCount}
                </p>
              </div>

            </div>

          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* MITOSIS */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 space-y-4">

              <div className="flex items-center justify-between">

                <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-emerald-600" />
                  মাইটোসিস
                </h4>

                <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-1 rounded-full">
                  2n → 2n
                </span>

              </div>

              <div className="grid grid-cols-2 gap-2">

                <div className="bg-white rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-[10px] text-slate-500">
                    অপত্য কোষ
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-700">
                    {comparison.mitosis.cells}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-[10px] text-slate-500">
                    প্রতি কোষে
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-700">
                    {comparison.mitosis.chromosomePerCell}
                  </p>
                </div>

              </div>

              <div className="bg-white rounded-xl p-3 border border-emerald-100">

                <p className="text-[10px] font-bold text-slate-500 mb-2">
                  অপত্য কোষের ক্রোমোজোম
                </p>

                <div className="flex items-center justify-center gap-3">

                  {[1, 2].map((cell) => (
                    <div
                      key={cell}
                      className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center"
                    >
                      <span className="text-xs font-extrabold text-emerald-800">
                        2n
                      </span>
                    </div>
                  ))}

                </div>

                <p className="text-center text-[10px] text-emerald-700 font-semibold mt-2">
                  প্রতিটি কোষে {diploidCount}টি ক্রোমোজোম
                </p>

              </div>

              <p className="text-xs text-emerald-900 leading-6">
                একটি মাতৃকোষ থেকে দুটি অপত্য কোষ সৃষ্টি হয়। প্রতিটি অপত্য কোষে মাতৃকোষের সমান ক্রোমোজোম সংখ্যা থাকে।
              </p>

            </div>

            {/* MEIOSIS */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 sm:p-5 space-y-4">

              <div className="flex items-center justify-between">

                <h4 className="text-sm font-extrabold text-indigo-950 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-indigo-600" />
                  মিয়োসিস
                </h4>

                <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-1 rounded-full">
                  2n → n
                </span>

              </div>

              <div className="grid grid-cols-2 gap-2">

                <div className="bg-white rounded-xl p-3 text-center border border-indigo-100">
                  <p className="text-[10px] text-slate-500">
                    অপত্য কোষ
                  </p>
                  <p className="text-2xl font-extrabold text-indigo-700">
                    {comparison.meiosis.cells}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center border border-indigo-100">
                  <p className="text-[10px] text-slate-500">
                    প্রতি কোষে
                  </p>
                  <p className="text-2xl font-extrabold text-indigo-700">
                    {comparison.meiosis.chromosomePerCell}
                  </p>
                </div>

              </div>

              <div className="bg-white rounded-xl p-3 border border-indigo-100">

                <p className="text-[10px] font-bold text-slate-500 mb-2">
                  অপত্য কোষের ক্রোমোজোম
                </p>

                <div className="flex items-center justify-center gap-2 flex-wrap">

                  {[1, 2, 3, 4].map((cell) => (
                    <div
                      key={cell}
                      className="w-11 h-11 rounded-full bg-indigo-50 border-2 border-indigo-400 flex items-center justify-center"
                    >
                      <span className="text-[10px] font-extrabold text-indigo-800">
                        n
                      </span>
                    </div>
                  ))}

                </div>

                <p className="text-center text-[10px] text-indigo-700 font-semibold mt-2">
                  প্রতিটি কোষে {haploidCount}টি ক্রোমোজোম
                </p>

              </div>

              <p className="text-xs text-indigo-900 leading-6">
                একটি ডিপ্লয়েড মাতৃকোষ থেকে সাধারণত চারটি হ্যাপ্লয়েড অপত্য কোষ সৃষ্টি হয়।
              </p>

            </div>

          </div>

          {/* Biological Note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">

            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

            <div>
              <h5 className="text-xs font-extrabold text-amber-900">
                গুরুত্বপূর্ণ বৈজ্ঞানিক তথ্য
              </h5>

              <p className="text-xs text-amber-900 leading-6 mt-1">
                মিয়োসিসের ফলে সাধারণত চারটি হ্যাপ্লয়েড কোষ তৈরি হয়। তবে মানুষের ডিম্বাণু গঠনের সময় চারটি সমান কার্যকর ডিম্বাণু তৈরি হয় না। এছাড়া মিয়োসিসের আগে DNA একবার প্রতিলিপি তৈরি করে, কিন্তু নিউক্লিয়াস পরপর দুবার বিভাজিত হয়।
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          SECTION 3: QUICK COMPARISON
      ================================================= */}

      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-violet-600" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              মাইটোসিস ও মিয়োসিসের পার্থক্য
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Quick Revision Table
            </p>
          </div>

        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">

          <table className="w-full min-w-[540px] text-sm text-left">

            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="p-3 font-extrabold">বিষয়</th>
                <th className="p-3 font-extrabold text-emerald-700">
                  মাইটোসিস
                </th>
                <th className="p-3 font-extrabold text-indigo-700">
                  মিয়োসিস
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {[
                ['বিভাজনের সংখ্যা', 'একবার', 'দুবার'],
                ['অপত্য কোষ', '২টি', 'সাধারণত ৪টি'],
                ['ক্রোমোজোম সংখ্যা', 'অপরিবর্তিত', 'অর্ধেক'],
                ['সিন্যাপসিস', 'ঘটে না', 'ঘটে'],
                ['ক্রসিং ওভার', 'সাধারণত ঘটে না', 'ঘটে'],
                ['প্রধান কাজ', 'দৈহিক বৃদ্ধি ও ক্ষয়পূরণ', 'জননকোষ উৎপাদন ও বৈচিত্র্য'],
                ['জিনগত বৈশিষ্ট্য', 'সাধারণত প্রায় অভিন্ন', 'জিনগত বৈচিত্র্য দেখা যায়'],
              ].map(([subject, mitosis, meiosis]) => (
                <tr key={subject} className="hover:bg-slate-50/80">

                  <td className="p-3 font-bold text-slate-700">
                    {subject}
                  </td>

                  <td className="p-3 text-slate-600">
                    {mitosis}
                  </td>

                  <td className="p-3 text-slate-600">
                    {meiosis}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================================
          FINAL LEARNING NOTE
      ================================================= */}

      <section className="rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 p-5">

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-teal-700" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-teal-950">
              আজকের শেখার সারসংক্ষেপ
            </h3>

            <p className="text-xs text-teal-900 leading-6 mt-2">
              মাইটোসিসে একটি মাতৃকোষ থেকে দুটি সমসংখ্যক ক্রোমোজোমবিশিষ্ট অপত্য কোষ তৈরি হয়। অন্যদিকে মিয়োসিসে পরপর দুটি নিউক্লিয়ার বিভাজনের মাধ্যমে সাধারণত চারটি হ্যাপ্লয়েড কোষ তৈরি হয়। ক্রসিং ওভার ও ক্রোমোজোমের স্বাধীন বিন্যাস বংশগত বৈচিত্র্য সৃষ্টিতে সাহায্য করে।
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
