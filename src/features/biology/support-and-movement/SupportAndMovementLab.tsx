'use client';

import React, { useState } from 'react';
import {
  Activity,
  Bone,
  Info,
  Move,
  RotateCcw,
} from 'lucide-react';

type ArmAction = 'flexion' | 'extension';

interface JointInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  jointType: string;
  examples: string;
  movementScope: string;
  note: string;
}

const JOINTS_DATA: JointInfo[] = [
  {
    id: 'ball-and-socket',
    nameBn: 'বল ও সকেট সন্ধি',
    nameEn: 'Ball and Socket Joint',
    jointType: 'পূর্ণ সচল (সাইনোভিয়াল) সন্ধি',
    examples: 'কাঁধের সন্ধি (হিউমেরাস ও স্ক্যাপুলা) এবং নিতম্বের সন্ধি (ফিমার ও শ্রোণীচক্র)।',
    movementScope: 'সব দিকে (সামনে, পেছনে, পাশে ও বৃত্তাকারে) ব্যাপক নড়াচড়া সম্ভব।',
    note: 'একটি অস্থির গোলাকার মাথা অপর অস্থির গর্ত বা সকেটে বসানো থাকে।',
  },
  {
    id: 'hinge-joint',
    nameBn: 'কব্জা বা হিঞ্জ সন্ধি',
    nameEn: 'Hinge Joint',
    jointType: 'পূর্ণ সচল (সাইনোভিয়াল) সন্ধি',
    examples: 'কনুই সন্ধি এবং হাঁটু সন্ধি।',
    movementScope: 'দরজার কব্জার মতো মূলত এক তলে ভাঁজ ও সোজা করা যায়।',
    note: 'সাইনোভিয়াল তরল অস্থিসন্ধির ঘর্ষণ কমিয়ে মসৃণ চলন নিশ্চিত করে।',
  },
  {
    id: 'slightly-movable',
    nameBn: 'ঈষৎ সচল সন্ধি',
    nameEn: 'Slightly Movable Joint',
    jointType: 'তরুণাস্থিময় সন্ধি',
    examples: 'মেরুদণ্ডের কশেরুকাগুলোর মধ্যবর্তী সন্ধি।',
    movementScope: 'অত্যন্ত সীমিত নড়াচড়া সম্ভব, তবে দেহকে সোজা ও স্থিতিশীল রাখে।',
    note: 'কশেরুকার মাঝে আন্তঃকশেরুকা চাকতি (Intervertebral disc) থাকে।',
  },
  {
    id: 'immovable',
    nameBn: 'অনড় বা স্থির সন্ধি',
    nameEn: 'Immovable (Fixed) Joint',
    jointType: 'তন্তুময় সন্ধি',
    examples: 'করোটির অস্থিগুলোর সন্ধি (সুঁচার)।',
    movementScope: 'কোনো নড়াচড়া হয় না।',
    note: 'মস্তিষ্ককে শক্ত ও সুরক্ষিত কাঠামোর ভেতরে রাখতে সাহায্য করে।',
  },
];

export default function SupportAndMovementLab() {
  // Section 1: Antagonistic Muscle Simulator (Biceps & Triceps)
  const [armAction, setArmAction] = useState<ArmAction>('flexion');

  // Section 2: Joints Explorer
  const [selectedJointId, setSelectedJointId] = useState<string>('ball-and-socket');

  const activeJoint =
    JOINTS_DATA.find((j) => j.id === selectedJointId) ?? JOINTS_DATA[0];

  const isFlexed = armAction === 'flexion';

  const handleReset = () => {
    setArmAction('flexion');
    setSelectedJointId('ball-and-socket');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
            <Activity className="w-4 h-4" />
            INTERACTIVE MUSCLE &amp; JOINT LAB
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            বাইসেপস-ট্রাইসেপস পেশি সিমুলেটর ও অস্থিসন্ধি ল্যাব
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            হাত ভাঁজ ও সোজা করার সময় বাইসেপস এবং ট্রাইসেপস পেশির সংকোচন-প্রসারণ দেখো এবং বিভিন্ন প্রকার অস্থিসন্ধি পর্যবেক্ষণ করো।
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

      {/* Section 1: Antagonistic Muscle Action (Biceps vs Triceps) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              বিপরীতমুখী পেশির ক্রিয়া: বাইসেপস বনাম ট্রাইসেপস
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isFlexed
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isFlexed ? 'হাত ভাঁজ (Flexion)' : 'হাত সোজা (Extension)'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Controls & Muscle State */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setArmAction('flexion')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                  isFlexed
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                হাত ভাঁজ করো (Flexion)
              </button>
              <button
                type="button"
                onClick={() => setArmAction('extension')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                  !isFlexed
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                হাত সোজা করো (Extension)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3.5 rounded-xl border leading-relaxed ${
                  isFlexed
                    ? 'bg-teal-50/80 border-teal-200 text-teal-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <strong className="block mb-1">
                  বাইসেপস পেশি (সামনের দিকে):{' '}
                  {isFlexed ? 'সংকুচিত ও মোটা' : 'শিথিল ও প্রসারিত'}
                </strong>
                {isFlexed
                  ? 'বাইসেপস সংকুচিত হওয়ায় নিচের বাহু (রেডিয়াস-আলনা) ওপরের দিকে উঠে হাত ভাঁজ হয়।'
                  : 'হাত সোজা করার সময় বাইসেপস শিথিল হয়ে প্রসারিত অবস্থায় থাকে।'}
              </div>

              <div
                className={`p-3.5 rounded-xl border leading-relaxed ${
                  !isFlexed
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <strong className="block mb-1">
                  ট্রাইসেপস পেশি (পেছনের দিকে):{' '}
                  {!isFlexed ? 'সংকুচিত ও মোটা' : 'শিথিল ও প্রসারিত'}
                </strong>
                {!isFlexed
                  ? 'ট্রাইসেপস সংকুচিত হয়ে নিচের বাহুকে নিচের দিকে টেনে হাত সোজা করে।'
                  : 'হাত ভাঁজ করার সময় ট্রাইসেপস শিথিল ও প্রসারিত অবস্থায় থাকে।'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                পেশি অস্থির সাথে যুক্ত থাকে <strong>টেন্ডন</strong> দিয়ে এবং এক অস্থি অন্য অস্থির সাথে যুক্ত থাকে <strong>লিগামেন্ট</strong> দিয়ে।
              </span>
            </div>
          </div>

          {/* Visual Arm Diagram SVG */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 220 200"
              className="w-full max-w-[220px] h-auto"
              role="img"
              aria-label="বাইসেপস ও ট্রাইসেপস পেশির সংকোচন-প্রসারণ"
            >
              {/* Shoulder Pivot */}
              <circle cx="75" cy="55" r="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              {/* Upper Arm Bone (Humerus) */}
              <line
                x1="75"
                y1="55"
                x2="75"
                y2="135"
                stroke="#94a3b8"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Biceps (front / right of humerus) */}
              <ellipse
                cx={isFlexed ? 90 : 86}
                cy="95"
                rx={isFlexed ? 12 : 7}
                ry={isFlexed ? 24 : 28}
                fill={isFlexed ? '#0d9488' : '#99f6e4'}
                stroke="#0f766e"
                strokeWidth="1.5"
              />

              {/* Triceps (back / left of humerus) */}
              <ellipse
                cx={!isFlexed ? 60 : 64}
                cy="95"
                rx={!isFlexed ? 12 : 7}
                ry={!isFlexed ? 24 : 28}
                fill={!isFlexed ? '#d97706' : '#fde68a'}
                stroke="#b45309"
                strokeWidth="1.5"
              />

              {/* Elbow Joint */}
              <circle cx="75" cy="135" r="8" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />

              {/* Forearm (tilts up when flexed, stays down when extended) */}
              {isFlexed ? (
                <line
                  x1="75"
                  y1="135"
                  x2="150"
                  y2="75"
                  stroke="#64748b"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              ) : (
                <line
                  x1="75"
                  y1="135"
                  x2="75"
                  y2="182"
                  stroke="#64748b"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              )}

              <text
                x="110"
                y="196"
                textAnchor="middle"
                className="fill-slate-600 text-[10px] font-bold"
              >
                {isFlexed ? 'বাইসেপস সংকুচিত → হাত ভাঁজ' : 'ট্রাইসেপস সংকুচিত → হাত সোজা'}
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Joints Explorer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bone className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              মানবদেহের অস্থিসন্ধি (Joints) এক্সপ্লোরার
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {activeJoint.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {JOINTS_DATA.map((joint) => {
            const isSelected = joint.id === selectedJointId;
            return (
              <button
                key={joint.id}
                type="button"
                onClick={() => setSelectedJointId(joint.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all text-center ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {joint.nameBn}
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-lg font-extrabold text-slate-900">
              {activeJoint.nameBn} ({activeJoint.nameEn})
            </h4>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-teal-700">
              {activeJoint.jointType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">উদাহরণ ও অবস্থান:</strong>
              {activeJoint.examples}
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 leading-relaxed">
              <strong className="block mb-1">চলনের পরিসীমা:</strong>
              {activeJoint.movementScope}
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
            {activeJoint.note}
          </p>
        </div>
      </section>
    </div>
  );
}