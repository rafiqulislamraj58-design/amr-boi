
'use client';

import React, { useState } from 'react';

import { MOTION_TOPICS } from './MotionTopicsData';
import MotionSimulationLab from '../MotionSimulationLab';
import FormulaBox from '@/components/common/FormulaBox';

import {
  BookOpen,
  ChevronRight,
  FlaskConical,
  PlayCircle,
  Target,
  Lightbulb,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Topic Animation Components
import RestMotionAnimation from './animations/RestMotionAnimation';
import TypesOfMotionAnimation from './animations/TypesOfMotionAnimation';
import DistanceDisplacementAnimation from './animations/DistanceDisplacementAnimation';
import SpeedVelocityAnimation from './animations/SpeedVelocityAnimation';
import AccelerationAnimation from './animations/AccelerationAnimation';
import EquationsOfMotionAnimation from './animations/EquationsOfMotionAnimation';

// ============================================
// TOPIC ANIMATION MAPPING
// ============================================

const MOTION_ANIMATION_MAP: Record<
  string,
  React.ComponentType
> = {
  'rest-and-motion': RestMotionAnimation,
  'types-of-motion': TypesOfMotionAnimation,
  'distance-and-displacement': DistanceDisplacementAnimation,
  'speed-and-velocity': SpeedVelocityAnimation,
  acceleration: AccelerationAnimation,
  'equations-of-motion': EquationsOfMotionAnimation,
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function MotionChapterView() {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    MOTION_TOPICS[0]?.id ?? ''
  );

  const currentTopic =
    MOTION_TOPICS.find((topic) => topic.id === activeTopicId) ??
    MOTION_TOPICS[0];

  if (!currentTopic) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800">
          কোনো Topic পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          MotionTopicsData.ts ফাইলে Topic যুক্ত করো।
        </p>
      </div>
    );
  }

  const TopicAnimation =
    MOTION_ANIMATION_MAP[currentTopic.id];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

      {/* ========================================
          LEFT SIDEBAR: TOPIC NAVIGATION
      ======================================== */}

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:col-span-4">

        <div className="mb-4 px-3">
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chapter Navigation
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-800">
            অধ্যায়ের টপিকসমূহ
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            তোমার পছন্দের Topic নির্বাচন করো।
          </p>
        </div>

        <div className="space-y-1.5">
          {MOTION_TOPICS.map((topic, index) => {
            const isActive = topic.id === activeTopicId;

            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="truncate">
                    {topic.title}
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
        </div>

        {/* Progress Information */}

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">
              Topic Progress
            </span>

            <span className="text-xs font-bold text-blue-600">
              {MOTION_TOPICS.findIndex(
                (topic) => topic.id === activeTopicId
              ) + 1}
              /{MOTION_TOPICS.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  ((MOTION_TOPICS.findIndex(
                    (topic) => topic.id === activeTopicId
                  ) + 1) /
                    MOTION_TOPICS.length) *
                  100
                }%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-blue-600">
            প্রতিটি Topic পড়ার মাধ্যমে এগিয়ে যাও।
          </p>
        </div>
      </aside>

      {/* ========================================
          RIGHT CONTENT AREA
      ======================================== */}

      <main className="min-w-0 space-y-6 lg:col-span-8">

        {/* ========================================
            TOPIC LESSON
        ======================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Lesson Header */}

          <div className="border-b border-slate-100 p-5 sm:p-8">

            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <BookOpen className="h-4 w-4" />
              <span>পদার্থবিজ্ঞান</span>
              <span className="text-slate-300">•</span>
              <span>অধ্যায় ২: গতি</span>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              {currentTopic.title}
            </h2>

            {/* Topic Subtitle */}

            {'subtitle' in currentTopic && currentTopic.subtitle && (
              <p className="mb-4 text-sm font-medium text-slate-500">
                {currentTopic.subtitle}
              </p>
            )}

            {/* Topic Summary */}

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
                <Lightbulb className="h-4 w-4" />
                সংক্ষিপ্ত ধারণা
              </div>

              <p className="text-sm leading-7 text-slate-700">
                {currentTopic.summary}
              </p>
            </div>
          </div>

          {/* ========================================
              TOPIC ANIMATION
          ======================================== */}

          <div className="border-b border-slate-100 p-5 sm:p-8">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-blue-600" />

                  <h3 className="text-lg font-bold text-slate-900">
                    Interactive Topic Animation
                  </h3>
                </div>

                <p className="text-xs text-slate-500">
                  Animation-এর মাধ্যমে বিষয়টি পর্যবেক্ষণ করো।
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                2D Animation
              </span>
            </div>

            {TopicAnimation ? (
              <TopicAnimation />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <PlayCircle className="mx-auto mb-3 h-9 w-9 text-slate-400" />

                <h4 className="font-bold text-slate-700">
                  এই Topic-এর Animation এখনো যুক্ত করা হয়নি।
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  পরবর্তী সময়ে এই Topic-এর Animation যুক্ত করা যাবে।
                </p>
              </div>
            )}
          </div>

          {/* ========================================
              LESSON CONTENT
          ======================================== */}

          <div className="p-5 sm:p-8">

            <div className="mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />

              <h3 className="text-lg font-bold text-slate-900">
                বিস্তারিত আলোচনা
              </h3>
            </div>

            <div className="whitespace-pre-line text-base leading-8 text-slate-700">
              {currentTopic.content}
            </div>

            {/* ========================================
                LEARNING OBJECTIVES
            ======================================== */}

            {'learningObjectives' in currentTopic &&
              currentTopic.learningObjectives?.length > 0 && (
                <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">

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
                          key={index}
                          className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                        >
                          <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />

                          <span>{objective}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* ========================================
                KEY POINTS
            ======================================== */}

            {'keyPoints' in currentTopic &&
              currentTopic.keyPoints?.length > 0 && (
                <div className="mt-8">

                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    গুরুত্বপূর্ণ বিষয়সমূহ
                  </h3>

                  <ul className="space-y-3">
                    {currentTopic.keyPoints.map(
                      (point, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {index + 1}
                          </span>

                          <span className="text-sm leading-6 text-slate-700">
                            {point}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* ========================================
                FORMULA SECTION
            ======================================== */}

            {currentTopic.formula && (
              <div className="my-8 rounded-xl bg-slate-900 p-5 text-white">

                <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  গুরুত্বপূর্ণ সূত্র
                </span>

                <div className="overflow-x-auto text-lg">
                  <FormulaBox formula={currentTopic.formula} />
                </div>
              </div>
            )}

            {'formulas' in currentTopic &&
              currentTopic.formulas?.length > 0 && (
                <div className="my-8">

                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    প্রয়োজনীয় সূত্রসমূহ
                  </h3>

                  <div className="space-y-4">
                    {currentTopic.formulas.map(
                      (formula, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 bg-white p-5"
                        >
                          <h4 className="mb-3 font-bold text-slate-800">
                            {formula.name}
                          </h4>

                          <div className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-white">
                            <FormulaBox formula={formula.expression} />
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {formula.description}
                          </p>

                          {formula.variables &&
                            formula.variables.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {formula.variables.map(
                                  (variable, variableIndex) => (
                                    <div
                                      key={variableIndex}
                                      className="flex flex-wrap gap-2 text-xs"
                                    >
                                      <span className="font-bold text-blue-600">
                                        {variable.symbol}
                                      </span>

                                      <span className="text-slate-600">
                                        {variable.meaning}
                                      </span>

                                      <span className="text-slate-400">
                                        ({variable.unit})
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* ========================================
                EXAMPLES
            ======================================== */}

            {'examples' in currentTopic &&
              currentTopic.examples?.length > 0 && (
                <div className="my-8">

                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    বাস্তব উদাহরণ
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {currentTopic.examples.map(
                      (example, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <h4 className="mb-2 font-bold text-slate-800">
                            {example.title}
                          </h4>

                          <p className="mb-2 text-sm leading-6 text-slate-600">
                            {example.description}
                          </p>

                          <p className="rounded-lg bg-white p-3 text-sm text-blue-700">
                            {example.example}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* ========================================
                APPLICATIONS
            ======================================== */}

            {'applications' in currentTopic &&
              currentTopic.applications?.length > 0 && (
                <div className="my-8">

                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    বাস্তব জীবনে প্রয়োগ
                  </h3>

                  <ul className="space-y-2">
                    {currentTopic.applications.map(
                      (application, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-slate-700"
                        >
                          {application}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* ========================================
                MISCONCEPTIONS
            ======================================== */}

            {'misconceptions' in currentTopic &&
              currentTopic.misconceptions?.length > 0 && (
                <div className="my-8 rounded-xl border border-amber-200 bg-amber-50 p-5">

                  <h3 className="mb-3 font-bold text-amber-800">
                    সাধারণ ভুল ধারণা
                  </h3>

                  <ul className="space-y-2">
                    {currentTopic.misconceptions.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm leading-6 text-slate-700"
                        >
                          • {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* ========================================
                DIFFICULTY & TIME
            ======================================== */}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">

              {'difficulty' in currentTopic &&
                currentTopic.difficulty && (
                  <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                    Level: {currentTopic.difficulty}
                  </span>
                )}

              {'estimatedTime' in currentTopic &&
                currentTopic.estimatedTime && (
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    <Clock className="h-3.5 w-3.5" />
                    {currentTopic.estimatedTime}
                  </span>
                )}
            </div>

          </div>
        </section>

        {/* ========================================
            INTERACTIVE SIMULATION LAB
        ======================================== */}

        {currentTopic.hasInteractiveLab && (
          <section className="mt-8">

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2">
                <FlaskConical className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  হাতে-কলমে সিমুলেশন ল্যাব
                </h3>

                <p className="text-xs text-slate-500">
                  Interactive Physics Experiment
                </p>
              </div>
            </div>

            <MotionSimulationLab />

          </section>
        )}

        {/* ========================================
            NEXT / PREVIOUS TOPIC NAVIGATION
        ======================================== */}

        <div className="flex items-center justify-between gap-3">

          <button
            disabled={
              MOTION_TOPICS.findIndex(
                (topic) => topic.id === activeTopicId
              ) === 0
            }
            onClick={() => {
              const currentIndex = MOTION_TOPICS.findIndex(
                (topic) => topic.id === activeTopicId
              );

              if (currentIndex > 0) {
                setActiveTopicId(
                  MOTION_TOPICS[currentIndex - 1].id
                );
              }
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous Topic
          </button>

          <button
            disabled={
              MOTION_TOPICS.findIndex(
                (topic) => topic.id === activeTopicId
              ) === MOTION_TOPICS.length - 1
            }
            onClick={() => {
              const currentIndex = MOTION_TOPICS.findIndex(
                (topic) => topic.id === activeTopicId
              );

              if (currentIndex < MOTION_TOPICS.length - 1) {
                setActiveTopicId(
                  MOTION_TOPICS[currentIndex + 1].id
                );
              }
            }}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Topic →
          </button>

        </div>

      </main>
    </div>
  );
}
