
'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Calculator,
  Flame,
  Info,
  RotateCcw,
  Scale,
  Utensils,
  ChevronRight,
  CheckCircle2,
  Droplets,
  Dna,
  Microscope,
  BookOpen,
  ArrowRight,
  HeartPulse,
  Zap,
  Sparkles,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

type Gender = 'male' | 'female';

type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active';

type FoodType = 'carbohydrate' | 'protein' | 'fat';

type TabType = 'calculator' | 'digestive' | 'journey';

interface ActivityOption {
  id: ActivityLevel;
  labelBn: string;
  multiplier: number;
}

interface DigestiveOrgan {
  id: string;
  nameBn: string;
  nameEn: string;
  juice: string;
  enzymes: string[];
  targetFood: string;
  endProduct: string;
  function: string;
  phNote: string;
  fact: string;
}

interface DigestionStep {
  organ: string;
  enzyme: string;
  action: string;
  result: string;
}

// ======================================================
// CONSTANT DATA
// ======================================================

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'sedentary',
    labelBn: 'পরিশ্রমহীন',
    multiplier: 1.2,
  },
  {
    id: 'light',
    labelBn: 'হালকা পরিশ্রম',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    labelBn: 'মাঝারি পরিশ্রম',
    multiplier: 1.55,
  },
  {
    id: 'active',
    labelBn: 'কঠোর পরিশ্রম',
    multiplier: 1.725,
  },
];

const DIGESTIVE_ORGANS: DigestiveOrgan[] = [
  {
    id: 'mouth',
    nameBn: 'মুখগহ্বর',
    nameEn: 'Mouth Cavity',
    juice: 'লালারস (Saliva)',
    enzymes: ['টায়ালিন / স্যালিভারি অ্যামাইলেজ'],
    targetFood: 'শ্বেতসার (Starch)',
    endProduct: 'মল্টোজ ও ছোট ডেক্সট্রিন',
    function:
      'দাঁত খাদ্যকে চূর্ণ করে। জিহ্বা খাদ্যকে লালারসের সঙ্গে মেশায় এবং গিলতে সাহায্য করে।',
    phNote:
      'প্রায় নিরপেক্ষ pH। লালার অ্যামাইলেজ শ্বেতসারের পরিপাক শুরু করে।',
    fact:
      'মানুষের খাদ্য পরিপাকের সূচনা ঘটে মুখগহ্বরে।',
  },
  {
    id: 'pharynx',
    nameBn: 'গলবিল',
    nameEn: 'Pharynx',
    juice: 'কোনো পরিপাক রস নিঃসরণ করে না',
    enzymes: ['কোনো পরিপাককারী এনজাইম নেই'],
    targetFood: 'খাদ্য বলাস (Bolus)',
    endProduct: 'খাদ্য অন্ননালিতে প্রবেশ করে',
    function:
      'গলবিল খাদ্যকে মুখগহ্বর থেকে অন্ননালিতে পাঠায়। এপিগ্লটিস খাদ্যকে শ্বাসনালিতে প্রবেশ করতে বাধা দেয়।',
    phNote:
      'এটি খাদ্য চলাচলের পথ; এখানে উল্লেখযোগ্য রাসায়নিক পরিপাক হয় না।',
    fact:
      'গিলন প্রক্রিয়ায় এপিগ্লটিস গুরুত্বপূর্ণ ভূমিকা রাখে।',
  },
  {
    id: 'esophagus',
    nameBn: 'অন্ননালি',
    nameEn: 'Esophagus',
    juice: 'কোনো পরিপাক রস নিঃসরণ করে না',
    enzymes: ['কোনো পরিপাককারী এনজাইম নেই'],
    targetFood: 'খাদ্য বলাস',
    endProduct: 'পাকস্থলীতে খাদ্য পৌঁছে যায়',
    function:
      'পেশির পর্যায়ক্রমিক সংকোচন ও প্রসারণের মাধ্যমে খাদ্য পাকস্থলীতে পৌঁছে দেয়। এই প্রক্রিয়াকে পেরিস্টালসিস বলে।',
    phNote:
      'এখানে মূলত খাদ্য পরিবহন ঘটে, রাসায়নিক পরিপাক নয়।',
    fact:
      'পেরিস্টালসিস খাদ্যকে নিচের দিকে ঠেলে দেয়।',
  },
  {
    id: 'stomach',
    nameBn: 'পাকস্থলী',
    nameEn: 'Stomach',
    juice: 'গ্যাস্ট্রিক রস',
    enzymes: ['পেপসিন', 'গ্যাস্ট্রিক লাইপেজ (সামান্য)'],
    targetFood: 'প্রধানত আমিষ (Protein)',
    endProduct: 'পলিপেপটাইড ও পেপটাইড',
    function:
      'খাদ্যকে গ্যাস্ট্রিক রসের সঙ্গে মিশিয়ে কাইমে পরিণত করে। পেপসিন আমিষের পরিপাক শুরু করে।',
    phNote:
      'অম্লীয় পরিবেশ (প্রায় pH 1.5–3.5)। HCl পেপসিনের কাজের উপযোগী পরিবেশ তৈরি করে।',
    fact:
      'পেপসিনোজেন নিষ্ক্রিয় অবস্থায় নিঃসৃত হয় এবং অম্লীয় পরিবেশে পেপসিনে সক্রিয় হয়।',
  },
  {
    id: 'liver',
    nameBn: 'যকৃত ও পিত্তথলি',
    nameEn: 'Liver & Gallbladder',
    juice: 'পিত্তরস (Bile)',
    enzymes: ['কোনো পরিপাককারী এনজাইম নেই'],
    targetFood: 'স্নেহ পদার্থ (Fat)',
    endProduct: 'ক্ষুদ্র ক্ষুদ্র চর্বিকণা',
    function:
      'যকৃত পিত্তরস তৈরি করে। পিত্তথলি পিত্তরস জমা ও ঘনীভূত করে। পিত্তলবণ চর্বির ইমালসিফিকেশন ঘটায়।',
    phNote:
      'পিত্তরস ক্ষারীয় প্রকৃতির। এতে এনজাইম নেই, তবে পিত্তলবণ থাকে।',
    fact:
      'যকৃত মানবদেহের সবচেয়ে বড় গ্রন্থি।',
  },
  {
    id: 'pancreas',
    nameBn: 'অগ্ন্যাশয়',
    nameEn: 'Pancreas',
    juice: 'অগ্ন্যাশয় রস (Pancreatic Juice)',
    enzymes: [
      'অ্যামাইলেজ',
      'ট্রিপসিন',
      'কাইমোট্রিপসিন',
      'লাইপেজ',
    ],
    targetFood: 'শর্করা, আমিষ ও স্নেহ',
    endProduct:
      'ডাইস্যাকারাইড, পেপটাইড এবং ফ্যাটি অ্যাসিড ও মনোগ্লিসারাইড',
    function:
      'অগ্ন্যাশয় রসের এনজাইম শর্করা, আমিষ ও স্নেহের পরিপাকে সাহায্য করে।',
    phNote:
      'অগ্ন্যাশয় রসে বাইকার্বোনেট থাকে, যা পাকস্থলী থেকে আসা অম্লীয় কাইমকে নিরপেক্ষ করতে সাহায্য করে।',
    fact:
      'অগ্ন্যাশয় একটি মিশ্র গ্রন্থি। এটি ইনসুলিন ও গ্লুকাগনও নিঃসরণ করে।',
  },
  {
    id: 'small-intestine',
    nameBn: 'ক্ষুদ্রান্ত্র',
    nameEn: 'Small Intestine',
    juice: 'আন্ত্রিক রস (Intestinal Juice)',
    enzymes: [
      'মল্টেজ',
      'সুক্রেজ',
      'ল্যাকটেজ',
      'পেপটাইডেজ',
    ],
    targetFood: 'ডাইস্যাকারাইড ও ক্ষুদ্র পেপটাইড',
    endProduct:
      'গ্লুকোজ, গ্যালাক্টোজ, ফ্রুক্টোজ ও অ্যামিনো অ্যাসিড',
    function:
      'খাদ্যের অধিকাংশ রাসায়নিক পরিপাক ও পুষ্টি উপাদানের শোষণ এখানে সম্পন্ন হয়।',
    phNote:
      'মৃদু ক্ষারীয় পরিবেশ। ভিলাই ও মাইক্রোভিলাই শোষণতলের ক্ষেত্রফল বাড়ায়।',
    fact:
      'ক্ষুদ্রান্ত্রের তিনটি অংশ: ডিওডেনাম, জেজুনাম ও ইলিয়াম।',
  },
  {
    id: 'large-intestine',
    nameBn: 'বৃহদন্ত্র',
    nameEn: 'Large Intestine',
    juice: 'কোনো গুরুত্বপূর্ণ পরিপাককারী এনজাইম নেই',
    enzymes: ['নিজস্ব পরিপাককারী এনজাইম নেই'],
    targetFood: 'অপাচ্য খাদ্য ও অবশিষ্ট পদার্থ',
    endProduct: 'ঘন মল',
    function:
      'অবশিষ্ট খাদ্য থেকে পানি ও ইলেকট্রোলাইট শোষণ করে। উপকারী ব্যাকটেরিয়া কিছু ভিটামিন উৎপাদনে ভূমিকা রাখে।',
    phNote:
      'অন্ত্রের অণুজীব খাদ্যের কিছু অবশিষ্ট উপাদান গাঁজন করতে পারে।',
    fact:
      'বৃহদন্ত্রে পানি শোষণের মাধ্যমে মল ঘন হয়।',
  },
  {
    id: 'rectum',
    nameBn: 'মলাশয় ও পায়ুপথ',
    nameEn: 'Rectum & Anus',
    juice: 'কোনো পরিপাক রস নিঃসরণ করে না',
    enzymes: ['কোনো পরিপাককারী এনজাইম নেই'],
    targetFood: 'মল',
    endProduct: 'দেহের বাইরে মল নির্গমন',
    function:
      'মলাশয়ে মল সাময়িকভাবে জমা থাকে এবং পায়ুপথ দিয়ে দেহের বাইরে বের হয়ে যায়।',
    phNote:
      'এখানে পরিপাক বা উল্লেখযোগ্য পুষ্টি শোষণ হয় না।',
    fact:
      'মলত্যাগকে Defecation বলা হয়।',
  },
];

// ======================================================
// FOOD DIGESTION JOURNEY
// ======================================================

const DIGESTION_JOURNEYS: Record<FoodType, DigestionStep[]> = {
  carbohydrate: [
    {
      organ: 'মুখগহ্বর',
      enzyme: 'স্যালিভারি অ্যামাইলেজ',
      action: 'শ্বেতসার ভাঙতে শুরু করে',
      result: 'মল্টোজ ও ডেক্সট্রিন',
    },
    {
      organ: 'পাকস্থলী',
      enzyme: 'অম্লীয় পরিবেশ',
      action: 'লালার অ্যামাইলেজের কাজ বন্ধ হয়ে যায়',
      result: 'উল্লেখযোগ্য নতুন শর্করা পরিপাক নয়',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'প্যানক্রিয়াটিক অ্যামাইলেজ',
      action: 'শ্বেতসারকে ছোট শর্করায় ভাঙে',
      result: 'মল্টোজ ও ছোট অলিগোস্যাকারাইড',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'মল্টেজ, সুক্রেজ ও ল্যাকটেজ',
      action: 'ডাইস্যাকারাইড ভেঙে মনোস্যাকারাইড তৈরি করে',
      result: 'গ্লুকোজ, গ্যালাক্টোজ ও ফ্রুক্টোজ',
    },
  ],

  protein: [
    {
      organ: 'মুখগহ্বর',
      enzyme: 'কোনো প্রোটিয়েজ নেই',
      action: 'খাদ্য চর্বণ ও লালারসের সঙ্গে মিশ্রণ',
      result: 'খাদ্য বলাস',
    },
    {
      organ: 'পাকস্থলী',
      enzyme: 'পেপসিন',
      action: 'আমিষের পেপটাইড বন্ধন ভাঙে',
      result: 'বড় ও ছোট পলিপেপটাইড',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'ট্রিপসিন ও কাইমোট্রিপসিন',
      action: 'পলিপেপটাইডকে আরও ছোট পেপটাইডে ভাঙে',
      result: 'ছোট পেপটাইড',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'পেপটাইডেজ',
      action: 'পেপটাইডকে চূড়ান্তভাবে ভাঙে',
      result: 'অ্যামিনো অ্যাসিড',
    },
  ],

  fat: [
    {
      organ: 'মুখ ও পাকস্থলী',
      enzyme: 'সামান্য লাইপেজ',
      action: 'সীমিত পরিমাণে স্নেহের পরিপাক শুরু হতে পারে',
      result: 'আংশিক ভাঙা স্নেহ',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'পিত্তলবণ',
      action: 'চর্বির ইমালসিফিকেশন ঘটায়',
      result: 'ক্ষুদ্র চর্বিকণা',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'প্যানক্রিয়াটিক লাইপেজ',
      action: 'ট্রাইগ্লিসারাইড ভাঙে',
      result: 'ফ্যাটি অ্যাসিড ও মনোগ্লিসারাইড',
    },
    {
      organ: 'ক্ষুদ্রান্ত্র',
      enzyme: 'অন্ত্রকোষ',
      action: 'কাইলোমাইক্রন তৈরি করে লসিকায় পাঠায়',
      result: 'লসিকানালিতে স্নেহ পরিবহন',
    },
  ],
};

// ======================================================
// REUSABLE UI COMPONENTS
// ======================================================

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  color = 'teal',
}: {
  label: string;
  value: string;
  color?: 'teal' | 'amber' | 'blue';
}) {
  const colors = {
    teal: 'bg-teal-50 text-teal-800 border-teal-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    blue: 'bg-blue-50 text-blue-800 border-blue-100',
  };

  return (
    <div className={`rounded-xl border p-3 ${colors[color]}`}>
      <p className="text-[11px] font-bold opacity-70 mb-1">{label}</p>
      <p className="text-sm font-bold leading-relaxed">{value}</p>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function FoodNutritionDigestionLab() {
  // Calculator
  const [gender, setGender] = useState<Gender>('male');
  const [weightKg, setWeightKg] = useState(62);
  const [heightCm, setHeightCm] = useState(168);
  const [age, setAge] = useState(16);
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>('light');

  // Explorer
  const [selectedOrganId, setSelectedOrganId] = useState('mouth');
  const [selectedFood, setSelectedFood] =
    useState<FoodType>('carbohydrate');

  // Tabs
  const [activeTab, setActiveTab] =
    useState<TabType>('calculator');

  // ====================================================
  // CALCULATIONS
  // ====================================================

  const heightM = heightCm / 100;

  const bmi = useMemo(
    () => Number((weightKg / (heightM * heightM)).toFixed(2)),
    [weightKg, heightM],
  );

  const bmr = useMemo(() => {
    return Math.round(
      gender === 'male'
        ? 66 + 13.7 * weightKg + 5 * heightCm - 6.8 * age
        : 655 + 9.6 * weightKg + 1.8 * heightCm - 4.7 * age,
    );
  }, [gender, weightKg, heightCm, age]);

  const selectedActivity =
    ACTIVITY_OPTIONS.find((item) => item.id === activityLevel) ??
    ACTIVITY_OPTIONS[1];

  const dailyCalories = Math.round(
    bmr * selectedActivity.multiplier,
  );

  const activeOrgan =
    DIGESTIVE_ORGANS.find(
      (organ) => organ.id === selectedOrganId,
    ) ?? DIGESTIVE_ORGANS[0];

  const activeJourney = DIGESTION_JOURNEYS[selectedFood];

  const isChildOrTeen = age < 20;

  const bmiCategory = useMemo(() => {
    if (isChildOrTeen) {
      return {
        label: 'বয়সভিত্তিক মূল্যায়ন প্রয়োজন',
        advice:
          '২০ বছরের কম বয়সীদের BMI বয়স ও লিঙ্গভিত্তিক পারসেন্টাইল চার্ট দিয়ে মূল্যায়ন করতে হয়।',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    }

    if (bmi < 18.5) {
      return {
        label: 'ওজন কম (Underweight)',
        advice:
          'পর্যাপ্ত পুষ্টিকর খাবার গ্রহণ এবং প্রয়োজনে পুষ্টিবিদের পরামর্শ নেওয়া ভালো।',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    }

    if (bmi < 25) {
      return {
        label: 'স্বাভাবিক ওজন (Normal)',
        advice:
          'প্রাপ্তবয়স্কদের BMI শ্রেণি অনুযায়ী ওজন স্বাভাবিক সীমায় রয়েছে।',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }

    if (bmi < 30) {
      return {
        label: 'অতিরিক্ত ওজন (Overweight)',
        advice:
          'স্বাস্থ্যকর খাদ্যাভ্যাস ও নিয়মিত শারীরিক কার্যক্রম বজায় রাখুন।',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }

    return {
      label: 'স্থূলতা (Obesity)',
      advice:
        'BMI একা রোগ নির্ণয় করে না। প্রয়োজনে চিকিৎসক বা পুষ্টিবিদের পরামর্শ নিন।',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }, [bmi, isChildOrTeen]);

  // ====================================================
  // RESET
  // ====================================================

  const handleReset = () => {
    setGender('male');
    setWeightKg(62);
    setHeightCm(168);
    setAge(16);
    setActivityLevel('light');
    setSelectedOrganId('mouth');
    setSelectedFood('carbohydrate');
    setActiveTab('calculator');
  };

  // ====================================================
  // TAB CONFIG
  // ====================================================

  const tabs = [
    {
      id: 'calculator' as const,
      label: 'BMI & BMR',
      icon: Calculator,
    },
    {
      id: 'digestive' as const,
      label: 'পৌষ্টিকতন্ত্র',
      icon: Utensils,
    },
    {
      id: 'journey' as const,
      label: 'পরিপাক প্রক্রিয়া',
      icon: Activity,
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 text-slate-800">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 p-5 sm:p-7 text-white">
        <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-24 -bottom-24 w-48 h-48 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-wrap justify-between items-start gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-[10px] font-extrabold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              INTERACTIVE BIOLOGY LAB
            </div>

            <h2 className="text-xl sm:text-3xl font-black mt-3">
              খাদ্য, পুষ্টি ও পরিপাকতন্ত্র
            </h2>

            <p className="text-sm text-teal-50 mt-2 leading-relaxed">
              BMI ও BMR হিসাব করো, মানব পৌষ্টিকতন্ত্রের অঙ্গ
              আবিষ্কার করো এবং খাদ্যের পরিপাক ধাপে ধাপে শেখো।
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {[
                'BMI Calculator',
                'Enzyme Explorer',
                '2D Anatomy',
              ].map((item) => (
                <span
                  key={item}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/15"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="relative flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-2 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            রিসেট
          </button>
        </div>
      </div>

      {/* ================================================
          NAVIGATION
      ================================================= */}

      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-3 px-2 text-xs font-bold transition-all ${
                selected
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================================================
          TAB 1: BMI & BMR CALCULATOR
      ================================================= */}

      {activeTab === 'calculator' && (
        <section className="space-y-5">

          <SectionHeading
            icon={Calculator}
            title="BMI ও BMR ক্যালকুলেটর"
            subtitle="তোমার শারীরিক তথ্য পরিবর্তন করে ফলাফল দেখো।"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* INPUT PANEL */}

            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-sm">

              {/* Gender */}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  লিঙ্গ নির্বাচন
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'male' as const, label: 'পুরুষ (Male)' },
                    { id: 'female' as const, label: 'নারী (Female)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGender(item.id)}
                      className={`rounded-xl py-3 text-sm font-bold border transition-all ${
                        gender === item.id
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    <Scale className="w-3.5 h-3.5 inline mr-1" />
                    ওজন
                  </label>
                  <span className="text-sm font-black text-teal-700">
                    {weightKg} kg
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={150}
                  step={1}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>30 kg</span>
                  <span>150 kg</span>
                </div>
              </div>

              {/* Height */}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    উচ্চতা
                  </label>
                  <span className="text-sm font-black text-teal-700">
                    {heightCm} cm
                  </span>
                </div>

                <input
                  type="range"
                  min={120}
                  max={220}
                  step={1}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>120 cm</span>
                  <span>220 cm</span>
                </div>
              </div>

              {/* Age */}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    বয়স
                  </label>
                  <span className="text-sm font-black text-teal-700">
                    {age} বছর
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 বছর</span>
                  <span>90 বছর</span>
                </div>
              </div>

              {/* Activity */}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  দৈনিক শারীরিক পরিশ্রম
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActivityLevel(option.id)}
                      className={`rounded-xl p-3 text-left border transition-all ${
                        activityLevel === option.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        {option.labelBn}
                      </span>
                      <span className="block text-[10px] opacity-70 mt-1">
                        × {option.multiplier}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800 leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  পরিশ্রমের মাত্রা অনুযায়ী দৈনিক ক্যালরি চাহিদা
                  আনুমানিকভাবে নির্ণয় করা হয়।
                </p>
              </div>
            </div>

            {/* RESULT PANEL */}

            <div className="lg:col-span-2 space-y-3">

              {/* BMI */}

              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-600">
                      Body Mass Index
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    BMI
                  </span>
                </div>

                <p className="text-4xl font-black text-teal-700 mt-3">
                  {bmi}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  kg/m²
                </p>

                <div className={`mt-3 rounded-xl border px-3 py-2 text-xs font-bold ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </div>

                {/* BMI SCALE */}

                <div className="mt-4">
                  <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                    <div className="flex-1 bg-sky-400" />
                    <div className="flex-[1.5] bg-emerald-500" />
                    <div className="flex-1 bg-amber-400" />
                    <div className="flex-1 bg-rose-500" />
                  </div>

                  <div className="flex justify-between mt-2 text-[9px] text-slate-400">
                    <span>কম</span>
                    <span>স্বাভাবিক</span>
                    <span>বেশি</span>
                    <span>স্থূলতা</span>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                    {bmiCategory.advice}
                  </div>
                </div>
              </div>

              {/* BMR */}

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold">Basal Metabolic Rate</span>
                </div>

                <p className="text-3xl font-black text-amber-700 mt-3">
                  {bmr}
                </p>

                <p className="text-xs text-amber-700 mt-1">
                  kcal / দিন
                </p>

                <p className="text-[10px] text-amber-700/80 mt-3 leading-relaxed">
                  হ্যারিস-বেনেডিক্টের ঐতিহাসিক সূত্রের একটি
                  প্রচলিত সংস্করণ ব্যবহার করা হয়েছে।
                </p>
              </div>

              {/* TOTAL CALORIES */}

              <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-700 p-4 text-white">
                <div className="flex items-center gap-2 text-teal-100">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    Estimated Daily Calories
                  </span>
                </div>

                <p className="text-3xl font-black mt-3">
                  {dailyCalories}
                </p>

                <p className="text-xs text-teal-100 mt-1">
                  kcal / দিন
                </p>

                <div className="border-t border-white/20 mt-3 pt-3 text-[10px] text-teal-100">
                  BMR × {selectedActivity.multiplier}
                </div>
              </div>
            </div>
          </div>

          {/* FORMULA */}

          <div className="rounded-2xl bg-slate-900 text-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <h4 className="text-sm font-bold">
                ব্যবহৃত গাণিতিক সূত্র
              </h4>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-teal-300 mb-2">
                  BMI Formula
                </p>
                <p className="font-mono text-sm text-white">
                  BMI = Weight / Height²
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-amber-300 mb-2">
                  BMR Formula
                </p>
                <p className="text-xs leading-relaxed text-slate-300">
                  পুরুষ: 66 + (13.7 × W) + (5 × H) − (6.8 × A)
                </p>
                <p className="text-xs leading-relaxed text-slate-300 mt-1">
                  নারী: 655 + (9.6 × W) + (1.8 × H) − (4.7 × A)
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              W = ওজন (kg), H = উচ্চতা (cm), A = বয়স (বছর)।
              BMR ও দৈনিক ক্যালরি হিসাব আনুমানিক। বিশেষত
              কিশোর-কিশোরীদের ক্ষেত্রে এই প্রাপ্তবয়স্কদের সূত্র
              নির্ভুল পুষ্টি মূল্যায়নের বিকল্প নয়।
            </p>
          </div>
        </section>
      )}

      {/* ================================================
          TAB 2: DIGESTIVE SYSTEM
      ================================================= */}

      {activeTab === 'digestive' && (
        <section className="space-y-5">

          <SectionHeading
            icon={Utensils}
            title="মানব পৌষ্টিকতন্ত্র 2D Explorer"
            subtitle="অঙ্গ নির্বাচন করে তার অবস্থান ও কাজ সম্পর্কে জানো।"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* 2D ANATOMY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold text-slate-800">
                  Human Digestive Anatomy
                </h4>
                <span className="text-[10px] text-teal-700 bg-teal-50 rounded-full px-2.5 py-1 font-bold">
                  2D MODEL
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-teal-50 border border-slate-100 p-3">
                <svg
                  viewBox="0 0 360 490"
                  className="w-full max-h-[490px]"
                  role="img"
                  aria-label="মানব পৌষ্টিকতন্ত্রের 2D চিত্র"
                >
                  <defs>
                    <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#dbeafe" />
                      <stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                    <linearGradient id="organGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>

                  {/* BODY SILHOUETTE */}

                  <path
                    d="M145 22 Q180 5 215 22 L237 52 L255 83 L249 133 L267 178 L278 258 L255 335 L238 445 L195 445 L180 340 L165 445 L122 445 L105 335 L82 258 L93 178 L111 133 L105 83 L125 52 Z"
                    fill="url(#bodyGradient)"
                    opacity="0.48"
                    stroke="#93c5fd"
                    strokeWidth="2"
                  />

                  {/* HEAD */}

                  <ellipse
                    cx="180"
                    cy="48"
                    rx="35"
                    ry="39"
                    fill="#fcd9bd"
                    stroke="#e5a985"
                    strokeWidth="2"
                  />

                  {/* MOUTH */}

                  <g
                    onClick={() => setSelectedOrganId('mouth')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M165 57 Q180 66 195 57"
                      stroke={selectedOrganId === 'mouth' ? '#0f766e' : '#be123c'}
                      strokeWidth={selectedOrganId === 'mouth' ? 7 : 4}
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="201" cy="59" r="7" fill="transparent" />
                  </g>

                  {/* PHARYNX */}

                  <path
                    d="M180 68 L180 94"
                    stroke={selectedOrganId === 'pharynx' ? '#0f766e' : '#f97316'}
                    strokeWidth={selectedOrganId === 'pharynx' ? 9 : 6}
                    strokeLinecap="round"
                  />

                  {/* ESOPHAGUS */}

                  <path
                    d="M180 94 C168 120 193 142 180 165"
                    fill="none"
                    stroke={selectedOrganId === 'esophagus' ? '#0f766e' : '#f59e0b'}
                    strokeWidth={selectedOrganId === 'esophagus' ? 11 : 7}
                    strokeLinecap="round"
                  />

                  {/* STOMACH */}

                  <g onClick={() => setSelectedOrganId('stomach')} className="cursor-pointer">
                    <path
                      d="M181 161 C211 149 244 166 239 196 C237 219 213 237 188 224 C164 212 160 179 181 161 Z"
                      fill={selectedOrganId === 'stomach' ? '#0f766e' : 'url(#organGradient)'}
                      stroke="#9f1239"
                      strokeWidth="2"
                    />
                  </g>

                  {/* LIVER */}

                  <g onClick={() => setSelectedOrganId('liver')} className="cursor-pointer">
                    <path
                      d="M114 155 Q145 132 178 151 L179 183 Q155 190 132 181 Q112 175 114 155 Z"
                      fill={selectedOrganId === 'liver' ? '#0f766e' : '#a16207'}
                      stroke="#78350f"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="164"
                      cy="186"
                      rx="7"
                      ry="11"
                      fill="#16a34a"
                      stroke="#166534"
                      strokeWidth="1"
                    />
                  </g>

                  {/* PANCREAS */}

                  <g onClick={() => setSelectedOrganId('pancreas')} className="cursor-pointer">
                    <path
                      d="M190 235 Q211 224 234 238 Q217 253 188 249 Z"
                      fill={selectedOrganId === 'pancreas' ? '#0f766e' : '#fbbf24'}
                      stroke="#b45309"
                      strokeWidth="2"
                    />
                  </g>

                  {/* SMALL INTESTINE */}

                  <g onClick={() => setSelectedOrganId('small-intestine')} className="cursor-pointer">
                    <rect
                      x="132"
                      y="260"
                      width="108"
                      height="110"
                      rx="25"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="10"
                      opacity="0.6"
                    />
                    <path
                      d="M145 275 Q220 263 220 287 Q145 294 145 307 Q220 316 220 330 Q145 337 145 349 Q195 357 218 349"
                      fill="none"
                      stroke={selectedOrganId === 'small-intestine' ? '#0f766e' : '#e879f9'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* LARGE INTESTINE */}

                  <g onClick={() => setSelectedOrganId('large-intestine')} className="cursor-pointer">
                    <path
                      d="M126 269 Q112 258 112 285 L112 349 Q112 383 145 383 L226 383 Q253 383 253 350 L253 285 Q253 261 235 269"
                      fill="none"
                      stroke={selectedOrganId === 'large-intestine' ? '#0f766e' : '#b45309'}
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* RECTUM */}

                  <g onClick={() => setSelectedOrganId('rectum')} className="cursor-pointer">
                    <path
                      d="M180 383 L180 419"
                      stroke={selectedOrganId === 'rectum' ? '#0f766e' : '#be123c'}
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="180"
                      cy="423"
                      r="6"
                      fill={selectedOrganId === 'rectum' ? '#0f766e' : '#be123c'}
                    />
                  </g>

                  {/* ORGAN LABELS */}

                  <g fontSize="10" fontWeight="700" fill="#334155">
                    <text x="229" y="59">১. মুখ</text>
                    <text x="205" y="105">২. গলবিল</text>
                    <text x="211" y="130">৩. অন্ননালি</text>
                    <text x="246" y="190">৪. পাকস্থলী</text>
                    <text x="43" y="162">৫. যকৃত</text>
                    <text x="240" y="244">৬. অগ্ন্যাশয়</text>
                    <text x="242" y="309">৭. ক্ষুদ্রান্ত্র</text>
                    <text x="35" y="334">৮. বৃহদন্ত্র</text>
                    <text x="196" y="414">৯. মলাশয়</text>
                  </g>

                  {/* LEADER LINES */}

                  <g stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3">
                    <path d="M196 58 L226 55" />
                    <path d="M185 85 L202 102" />
                    <path d="M185 119 L209 126" />
                    <path d="M236 190 L242 190" />
                    <path d="M114 163 L84 163" />
                    <path d="M224 242 L238 240" />
                    <path d="M238 309 L252 309" />
                    <path d="M112 334 L91 334" />
                    <path d="M185 415 L195 410" />
                  </g>
                </svg>
              </div>

              <p className="text-[10px] text-slate-400 mt-3 text-center">
                চিত্রটি শিক্ষামূলক ও ধারণাগত 2D মডেল; অঙ্গগুলোর
                আকৃতি ও অনুপাত বাস্তব শারীরস্থান অনুযায়ী স্কেল করা নয়।
              </p>

              {/* ORGAN SELECTOR */}

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  অঙ্গ নির্বাচন করো:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {DIGESTIVE_ORGANS.map((organ, index) => (
                    <button
                      key={organ.id}
                      type="button"
                      onClick={() => setSelectedOrganId(organ.id)}
                      className={`rounded-lg p-2 text-[10px] font-bold border transition-all ${
                        selectedOrganId === organ.id
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      {index + 1}. {organ.nameBn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ORGAN DETAILS */}

            <div className="space-y-4">

              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-teal-600">
                      SELECTED ORGAN
                    </p>
                    <h4 className="text-xl font-black text-slate-900 mt-1">
                      {activeOrgan.nameBn}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {activeOrgan.nameEn}
                    </p>
                  </div>

                  <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                    <Microscope className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <InfoCard
                    label="নিঃসৃত রস"
                    value={activeOrgan.juice}
                    color="blue"
                  />

                  <InfoCard
                    label="প্রধান এনজাইম"
                    value={activeOrgan.enzymes.join(', ')}
                  />

                  <InfoCard
                    label="যে খাদ্যে কাজ করে"
                    value={activeOrgan.targetFood}
                    color="amber"
                  />

                  <InfoCard
                    label="পরিপাকের ফলাফল"
                    value={activeOrgan.endProduct}
                  />
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs font-extrabold text-slate-800 mb-1">
                    অঙ্গের প্রধান কাজ
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {activeOrgan.function}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-xs font-bold text-amber-800 mb-1">
                    বৈজ্ঞানিক তথ্য
                  </p>
                  <p className="text-xs leading-relaxed text-amber-800">
                    {activeOrgan.phNote}
                  </p>
                </div>

                <div className="mt-3 flex gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {activeOrgan.fact}
                  </p>
                </div>
              </div>

              {/* PREVIOUS NEXT */}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const index = DIGESTIVE_ORGANS.findIndex(
                      (o) => o.id === selectedOrganId,
                    );
                    const previous =
                      DIGESTIVE_ORGANS[
                        (index - 1 + DIGESTIVE_ORGANS.length) %
                          DIGESTIVE_ORGANS.length
                      ];
                    setSelectedOrganId(previous.id);
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  ← পূর্ববর্তী অঙ্গ
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const index = DIGESTIVE_ORGANS.findIndex(
                      (o) => o.id === selectedOrganId,
                    );
                    const next =
                      DIGESTIVE_ORGANS[
                        (index + 1) % DIGESTIVE_ORGANS.length
                      ];
                    setSelectedOrganId(next.id);
                  }}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white"
                >
                  পরবর্তী অঙ্গ →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================
          TAB 3: FOOD DIGESTION JOURNEY
      ================================================= */}

      {activeTab === 'journey' && (
        <section className="space-y-5">

          <SectionHeading
            icon={Activity}
            title="Food Digestion Simulator"
            subtitle="খাদ্যের ধরন নির্বাচন করে ধাপে ধাপে পরিপাক প্রক্রিয়া দেখো।"
          />

          {/* FOOD SELECTION */}

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'carbohydrate' as const,
                label: 'শর্করা',
                english: 'Carbohydrate',
                icon: Zap,
              },
              {
                id: 'protein' as const,
                label: 'আমিষ',
                english: 'Protein',
                icon: Dna,
              },
              {
                id: 'fat' as const,
                label: 'স্নেহ',
                english: 'Fat',
                icon: Droplets,
              },
            ].map((food) => {
              const Icon = food.icon;
              const selected = selectedFood === food.id;

              return (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => setSelectedFood(food.id)}
                  className={`rounded-2xl p-4 border text-center transition-all ${
                    selected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-black">{food.label}</p>
                  <p className="text-[10px] opacity-75 mt-1">
                    {food.english}
                  </p>
                </button>
              );
            })}
          </div>

          {/* JOURNEY SUMMARY */}

          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-teal-400" />
              <h4 className="font-bold text-sm">
                {selectedFood === 'carbohydrate'
                  ? 'শর্করার পরিপাক'
                  : selectedFood === 'protein'
                    ? 'আমিষের পরিপাক'
                    : 'স্নেহের পরিপাক'}
              </h4>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {selectedFood === 'carbohydrate'
                ? 'জটিল শর্করা এনজাইমের সাহায্যে ভেঙে সরল মনোস্যাকারাইডে পরিণত হয়।'
                : selectedFood === 'protein'
                  ? 'প্রোটিন বিভিন্ন প্রোটিয়েজ এনজাইমের সাহায্যে ভেঙে অ্যামিনো অ্যাসিডে পরিণত হয়।'
                  : 'স্নেহ প্রথমে পিত্তলবণের মাধ্যমে ইমালসিফাই হয়, এরপর লাইপেজের সাহায্যে ভাঙে।'}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10">
              <p className="text-[10px] text-teal-300 font-bold">
                FINAL DIGESTION PRODUCT
              </p>
              <p className="text-sm font-black mt-1">
                {selectedFood === 'carbohydrate'
                  ? 'গ্লুকোজ, গ্যালাক্টোজ ও ফ্রুক্টোজ'
                  : selectedFood === 'protein'
                    ? 'অ্যামিনো অ্যাসিড'
                    : 'ফ্যাটি অ্যাসিড ও মনোগ্লিসারাইড'}
              </p>
            </div>
          </div>

          {/* STEP TIMELINE */}

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-900 mb-5">
              পরিপাকের ধাপসমূহ
            </h4>

            <div className="space-y-0">
              {activeJourney.map((step, index) => (
                <div key={`${step.organ}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">

                  {index !== activeJourney.length - 1 && (
                    <div className="absolute left-[15px] top-9 bottom-0 w-0.5 bg-teal-100" />
                  )}

                  <div className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0 rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-sm font-extrabold text-slate-900">
                        {step.organ}
                      </h5>
                      <span className="text-[10px] rounded-full bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 font-bold">
                        ধাপ {index + 1}
                      </span>
                    </div>

                    <p className="text-xs text-teal-700 font-bold mt-3">
                      এনজাইম / উপাদান: {step.enzyme}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {step.action}
                    </p>

                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-emerald-700 font-bold">
                          উৎপন্ন পদার্থ
                        </p>
                        <p className="text-xs font-bold text-emerald-900 mt-0.5">
                          {step.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEARNING NOTE */}

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-extrabold text-blue-900">
                  মনে রাখবে
                </h5>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  পিত্তলবণ কোনো এনজাইম নয়। এটি স্নেহের
                  ইমালসিফিকেশন ঘটায়। এনজাইম হলো জৈব
                  অনুঘটক, যা নির্দিষ্ট রাসায়নিক বিক্রিয়ার
                  গতি বাড়ায়।
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================
          FOOTER
      ================================================= */}

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-teal-600" />
          <h4 className="text-xs font-extrabold text-slate-800">
            Biology Learning Lab
          </h4>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
          এই ল্যাবটি জীববিজ্ঞানের ধারণা শেখার জন্য তৈরি।
          BMI, BMR ও ক্যালরি চাহিদার ফলাফল শিক্ষামূলক
          আনুমানিক হিসাব; ব্যক্তিগত স্বাস্থ্য নির্ণয়ের বিকল্প নয়।
        </p>
      </div>
    </div>
  );
}
