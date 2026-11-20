
'use client';

import React, { useMemo, useState } from 'react';

import { MOTION_TOPICS } from './MotionTopicsData';

import MotionSimulationLab from '../MotionSimulationLab';
import FormulaBox from '@/components/common/FormulaBox';

import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  PlayCircle,
  Target,
  Lightbulb,
  Clock,
  CheckCircle,
  GraduationCap,
  Info,
  AlertTriangle,
  BookMarked,
  RotateCcw,
} from 'lucide-react';

// Topic Animations
import RestMotionAnimation from './animations/RestMotionAnimation';
import TypesOfMotionAnimation from './animations/TypesOfMotionAnimation';
import DistanceDisplacementAnimation from './animations/DistanceDisplacementAnimation';
import SpeedVelocityAnimation from './animations/SpeedVelocityAnimation';
import AccelerationAnimation from './animations/AccelerationAnimation';
import EquationsOfMotionAnimation from './animations/EquationsOfMotionAnimation';

// =====================================================
// TYPES
// =====================================================

type AnimationComponent = React.ComponentType;

const MOTION_ANIMATION_MAP: Record<string, AnimationComponent> = {
  'rest-and-motion': RestMotionAnimation,
  'types-of-motion': TypesOfMotionAnimation,
  'distance-and-displacement': DistanceDisplacementAnimation,
  'speed-and-velocity': SpeedVelocityAnimation,
  acceleration: AccelerationAnimation,
  'equations-of-motion': EquationsOfMotionAnimation,
};

// =====================================================
// HELPERS
// =====================================================

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'সহজ';

    case 'medium':
      return 'মধ্যম';

    case 'hard':
      return 'কঠিন';

    default:
      return difficulty;
  }
}

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';

    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-100';

    case 'hard':
      return 'bg-rose-50 text-rose-700 border-rose-100';

    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

// =====================================================
// REUSABLE SECTION
// =====================================================

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function SectionHeading({
  icon,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>
      </div>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function MotionChapterView() {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    MOTION_TOPICS[0]?.id ?? ''
  );

  // ---------------------------------------------------
  // CURRENT TOPIC
  // ---------------------------------------------------

  const currentIndex = useMemo(
    () =>
      MOTION_TOPICS.findIndex(
        (topic) => topic.id === activeTopicId
      ),
    [activeTopicId]
  );

  const currentTopic =
    MOTION_TOPICS[currentIndex] ?? MOTION_TOPICS[0];

  const totalTopics = MOTION_TOPICS.length;

  const progress =
    totalTopics > 0 && currentIndex >= 0
      ? ((currentIndex + 1) / totalTopics) * 100
      : 0;

  const hasPrevious = currentIndex > 0;

  const hasNext = currentIndex >= 0 && currentIndex < totalTopics - 1;

  // ---------------------------------------------------
  // ANIMATION
  // ---------------------------------------------------

  const TopicAnimation = currentTopic
    ? MOTION_ANIMATION_MAP[currentTopic.id]
    : undefined;

  // ---------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------

  const handlePrevious = () => {
    if (!hasPrevious) return;

    setActiveTopicId(MOTION_TOPICS[currentIndex - 1].id);
  };

  const handleNext = () => {
    if (!hasNext) return;

    setActiveTopicId(MOTION_TOPICS[currentIndex + 1].id);
  };

  const handleTopicSelect = (topicId: string) => {
    setActiveTopicId(topicId);
  };

  const handleReset = () => {
    if (MOTION_TOPICS[0]) {
      setActiveTopicId(MOTION_TOPICS[0].id);
    }
  };

  // ---------------------------------------------------
  // EMPTY STATE
  // ---------------------------------------------------

  if (!currentTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />

        <h2 className="text-xl font-bold text-slate-800">
          কোনো Topic পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          MotionTopicsData.ts ফাইলে Topic যুক্ত করো।
        </p>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:col-span-4">

        {/* Sidebar Header */}

        <div className="mb-5 px-2">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Physics Chapter
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            অধ্যায়ের টপিকসমূহ
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            প্রতিটি Topic নির্বাচন করে ধাপে ধাপে শিখতে থাকো।
          </p>
        </div>

        {/* Topic Navigation */}

        <nav
          className="space-y-2"
          aria-label="Motion chapter topics"
        >
          {MOTION_TOPICS.map((topic, index) => {
            const isActive = topic.id === currentTopic.id;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleTopicSelect(topic.id)}
                aria-current={isActive ? 'step' : undefined}
                className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'border-transparent bg-slate-50 text-slate-700 hover:border-blue-100 hover:bg-blue-50'
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">
                      {topic.title}
                    </span>

                    <span
                      className={`mt-0.5 block truncate text-[11px] ${
                        isActive
                          ? 'text-blue-100'
                          : 'text-slate-400'
                      }`}
                    >
                      {topic.estimatedTime} মিনিট
                    </span>
                  </span>
                </span>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive
                      ? 'translate-x-1 text-white'
                      : 'text-slate-400 group-hover:translate-x-1'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Progress */}

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />

              <span className="text-xs font-bold text-blue-800">
                Chapter Progress
              </span>
            </div>

            <span className="text-xs font-bold tabular-nums text-blue-700">
              {Math.round(progress)}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-blue-100"
            role="progressbar"
            aria-label="Topic navigation progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-blue-700">
            <span>
              Topic {currentIndex + 1} of {totalTopics}
            </span>

            <span>গতি অধ্যায়</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            প্রথম Topic থেকে শুরু করো
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="min-w-0 space-y-6 lg:col-span-8">

        <div key={currentTopic.id} className="space-y-6">

          {/* =================================================
              LESSON CARD
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-100 p-5 sm:p-8">

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-blue-600">
                <GraduationCap className="h-4 w-4" />

                <span>পদার্থবিজ্ঞান</span>

                <span className="text-slate-300">/</span>

                <span>অধ্যায় ২: গতি</span>

                <span className="text-slate-300">/</span>

                <span>
                  Topic {currentIndex + 1}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                {currentTopic.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {currentTopic.subtitle}
              </p>

              {/* Topic Metadata */}

              <div className="mt-5 flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getDifficultyStyle(
                    currentTopic.difficulty
                  )}`}
                >
                  {getDifficultyLabel(currentTopic.difficulty)} স্তর
                </span>

                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <Clock className="h-3.5 w-3.5" />
                  {currentTopic.estimatedTime} মিনিট
                </span>

                {currentTopic.lab?.interactive && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Interactive Lab
                  </span>
                )}
              </div>

              {/* Summary */}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">

                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />

                  <h3 className="text-sm font-bold text-blue-800">
                    সংক্ষিপ্ত ধারণা
                  </h3>
                </div>

                <p className="text-sm leading-7 text-slate-700">
                  {currentTopic.summary}
                </p>
              </div>
            </div>

            {/* =================================================
                TOPIC ANIMATION
            ================================================= */}

            <div className="border-b border-slate-100 p-5 sm:p-8">

              <SectionHeading
                icon={<PlayCircle className="h-5 w-5" />}
                title="Interactive Topic Animation"
                description="Animation-এর মাধ্যমে বিষয়টি পর্যবেক্ষণ করো এবং ধারণা পরিষ্কার করো।"
              />

              {TopicAnimation ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-4">
                  <TopicAnimation />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <PlayCircle className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                  <h4 className="font-bold text-slate-700">
                    Animation এখনো যুক্ত করা হয়নি
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    এই Topic-এর Interactive Animation পরবর্তী সময়ে যুক্ত করা যাবে।
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                LESSON CONTENT
            ================================================= */}

            <div className="p-5 sm:p-8">

              <SectionHeading
                icon={<BookOpen className="h-5 w-5" />}
                title="বিস্তারিত আলোচনা"
                description="বিষয়টি মনোযোগ দিয়ে পড়ো এবং উদাহরণগুলো বোঝার চেষ্টা করো।"
              />

              <article className="whitespace-pre-line text-[15px] leading-8 text-slate-700 sm:text-base">
                {currentTopic.content}
              </article>

              {/* =================================================
                  LEARNING OBJECTIVES
              ================================================= */}

              {currentTopic.learningObjectives.length > 0 && (
                <div className="mt-9 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">

                  <div className="mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />

                    <h3 className="font-bold text-emerald-800">
                      এই Topic থেকে যা শিখবে
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {currentTopic.learningObjectives.map(
                      (objective, index) => (
                        <li
                          key={`${currentTopic.id}-objective-${index}`}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                        >
                          <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                          <span>{objective}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* =================================================
                  KEY POINTS
              ================================================= */}

              {currentTopic.keyPoints.length > 0 && (
                <div className="mt-9">

                  <SectionHeading
                    icon={<BookMarked className="h-5 w-5" />}
                    title="গুরুত্বপূর্ণ বিষয়সমূহ"
                    description="পরীক্ষার প্রস্তুতির জন্য এই বিষয়গুলো মনে রাখবে।"
                  />

                  <div className="space-y-3">
                    {currentTopic.keyPoints.map((point, index) => (
                      <div
                        key={`${currentTopic.id}-point-${index}`}
                        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                          {index + 1}
                        </span>

                        <p className="text-sm leading-6 text-slate-700">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================
                  LEGACY FORMULA
              ================================================= */}

              {currentTopic.formula && (
                <div className="mt-9 rounded-xl bg-slate-900 p-5 text-white">

                  <div className="mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />

                    <h3 className="font-bold">
                      গুরুত্বপূর্ণ সূত্র
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <FormulaBox formula={currentTopic.formula} />
                  </div>
                </div>
              )}

              {/* =================================================
                  FORMULAS
              ================================================= */}

              {currentTopic.formulas.length > 0 && (
                <div className="mt-9">

                  <SectionHeading
                    icon={<BookOpen className="h-5 w-5" />}
                    title="প্রয়োজনীয় সূত্রসমূহ"
                    description="প্রতিটি সূত্রের ব্যবহার ও প্রতীকগুলোর অর্থ বুঝে নাও।"
                  />

                  <div className="space-y-4">
                    {currentTopic.formulas.map((formula, index) => (
                      <div
                        key={`${currentTopic.id}-formula-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                          <h4 className="font-bold text-slate-800">
                            {index + 1}. {formula.name}
                          </h4>
                        </div>

                        <div className="p-5">

                          <div className="mb-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-white">
                            <FormulaBox formula={formula.expression} />
                          </div>

                          <p className="text-sm leading-7 text-slate-600">
                            {formula.description}
                          </p>

                          {formula.variables &&
                            formula.variables.length > 0 && (
                              <div className="mt-5">
                                <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                  প্রতীকগুলোর পরিচয়
                                </h5>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {formula.variables.map(
                                    (variable, variableIndex) => (
                                      <div
                                        key={`${currentTopic.id}-formula-${index}-variable-${variableIndex}`}
                                        className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
                                      >
                                        <div className="min-w-0">
                                          <span className="font-bold text-blue-600">
                                            {variable.symbol}
                                          </span>

                                          <p className="mt-1 text-xs text-slate-600">
                                            {variable.meaning}
                                          </p>
                                        </div>

                                        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-500">
                                          {variable.unit}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================
                  EXAMPLES
              ================================================= */}

              {currentTopic.examples.length > 0 && (
                <div className="mt-9">

                  <SectionHeading
                    icon={<Lightbulb className="h-5 w-5" />}
                    title="বাস্তব উদাহরণ"
                    description="বাস্তব জীবনের উদাহরণের মাধ্যমে ধারণাগুলো বোঝো।"
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentTopic.examples.map((example, index) => (
                      <div
                        key={`${currentTopic.id}-example-${index}`}
                        className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                            {index + 1}
                          </span>

                          <h4 className="font-bold text-slate-800">
                            {example.title}
                          </h4>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {example.description}
                        </p>

                        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
                          <p className="text-sm leading-6 text-blue-800">
                            {example.example}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================
                  APPLICATIONS
              ================================================= */}

              {currentTopic.applications.length > 0 && (
                <div className="mt-9">

                  <SectionHeading
                    icon={<GraduationCap className="h-5 w-5" />}
                    title="বাস্তব জীবনে প্রয়োগ"
                    description="পদার্থবিজ্ঞানের এই ধারণাগুলো বাস্তবে কোথায় ব্যবহার হয় দেখো।"
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {currentTopic.applications.map(
                      (application, index) => (
                        <div
                          key={`${currentTopic.id}-application-${index}`}
                          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                          <p className="text-sm leading-6 text-slate-700">
                            {application}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* =================================================
                  MISCONCEPTIONS
              ================================================= */}

              {currentTopic.misconceptions.length > 0 && (
                <div className="mt-9 rounded-xl border border-amber-200 bg-amber-50/70 p-5">

                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />

                    <h3 className="font-bold text-amber-900">
                      সাধারণ ভুল ধারণা
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {currentTopic.misconceptions.map(
                      (item, index) => (
                        <li
                          key={`${currentTopic.id}-misconception-${index}`}
                          className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                        >
                          <Info className="mt-1 h-4 w-4 shrink-0 text-amber-600" />

                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* =================================================
                  TAGS
              ================================================= */}

              {currentTopic.tags.length > 0 && (
                <div className="mt-9 border-t border-slate-100 pt-5">

                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Related Topics
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {currentTopic.tags.map((tag) => (
                      <span
                        key={`${currentTopic.id}-${tag}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              INTERACTIVE SIMULATION LAB
          ================================================= */}

          {currentTopic.lab?.interactive === true && (
            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-5 flex flex-wrap items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {currentTopic.lab.title}
                    </h3>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      INTERACTIVE
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {currentTopic.lab.description}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                  Dimension: {currentTopic.lab.dimension}
                </span>

                <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                  Lab Type: {currentTopic.lab.type}
                </span>
              </div>

              <MotionSimulationLab />
            </section>
          )}

        </div>

        {/* =================================================
            TOPIC NAVIGATION
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            disabled={!hasPrevious}
            onClick={handlePrevious}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Topic
          </button>

          <span className="text-center text-xs font-semibold text-slate-400">
            {currentIndex + 1} / {totalTopics}
          </span>

          <button
            type="button"
            disabled={!hasNext}
            onClick={handleNext}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Topic
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
