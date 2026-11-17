
'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  HelpCircle,
} from 'lucide-react';

import { SUBJECTS_DATA } from '@/data/subjectsData';
import type { SubjectId } from '@/types/curriculum';

import MotionSimulationLab from '@/features/physics/MotionSimulationLab';
import AtomStructureLab from '@/features/chemistry/AtomStructureLab';
import CellThreeDExplorer from '@/features/biology/CellThreeDExplorer';

import MotionChapterView from '@/features/physics/motion/MotionChapterView';
import ChapterQuizEngine from '@/features/quiz/ChapterQuizEngine';
import UniversalLabEngine from '@/engines/UniversalLabEngine';

// Derive types directly from your existing data
type Subject = (typeof SUBJECTS_DATA)[SubjectId];
type Chapter = Subject['chapters'][number];

interface ChapterLearningClientProps {
  subject: Subject;
  chapter: Chapter;
}

type ActiveTab = 'lesson' | 'lab' | 'quiz';

export default function ChapterLearningClient({
  subject,
  chapter,
}: ChapterLearningClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');

  // Reusable tab styling
  const getTabClass = (
    tab: ActiveTab,
    activeColor: string
  ) => {
    const isActive = activeTab === tab;

    return `
      flex items-center gap-2 px-4 py-2 rounded-xl
      text-sm font-semibold transition-all cursor-pointer
      ${
        isActive
          ? `${activeColor} text-white shadow-sm`
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }
    `;
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

        <Link
          href={`/${subject.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {subject.nameBn}-এর সব অধ্যায়
        </Link>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${subject.badgeClass}`}
        >
          অধ্যায় {chapter.chapterNumber} • {chapter.titleEn}
        </span>

      </div>

      {/* Chapter Header */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {chapter.title}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {chapter.description}
        </p>

        {/* Navigation Tabs */}
        <div
          className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100"
          role="tablist"
          aria-label="Chapter learning sections"
        >

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'lesson'}
            onClick={() => setActiveTab('lesson')}
            className={getTabClass('lesson', 'bg-slate-900')}
          >
            <BookOpen className="w-4 h-4" />
            পাঠ ও তত্ত্ব (Lesson)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'lab'}
            onClick={() => setActiveTab('lab')}
            className={getTabClass('lab', 'bg-blue-600')}
          >
            <FlaskConical className="w-4 h-4" />
            ইন্টারঅ্যাক্টিভ ল্যাব ও সিমুলেশন
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quiz'}
            onClick={() => setActiveTab('quiz')}
            className={getTabClass('quiz', 'bg-emerald-600')}
          >
            <HelpCircle className="w-4 h-4" />
            অনুশীলন ও কুইজ (Quiz)
          </button>

        </div>
      </section>

      {/* =====================================
          TAB 1: LESSON CONTENT
      ====================================== */}

      {activeTab === 'lesson' && (
        <section
          role="tabpanel"
          className="animate-in fade-in duration-300"
        >

          {chapter.slug === 'motion' ? (
            <MotionChapterView />
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6 leading-relaxed">

              <h2 className="text-xl font-bold text-slate-900">
                মৌলিক ধারণা ও বৈজ্ঞানিক ব্যাখ্যা
              </h2>

              <p className="text-slate-700">
                {chapter.description}
              </p>

            </div>
          )}

        </section>
      )}

      {/* =====================================
          TAB 2: INTERACTIVE LAB / SIMULATION
      ====================================== */}

      {activeTab === 'lab' && (
        <section
          role="tabpanel"
          className="animate-in fade-in duration-300"
        >

          {chapter.slug === 'motion' ? (

            <MotionSimulationLab />

          ) : chapter.slug === 'structure-of-matter' ? (

            <AtomStructureLab />

          ) : chapter.slug === 'cells-and-tissues' ? (

            <CellThreeDExplorer />

          ) : (

            <UniversalLabEngine
              chapterSlug={chapter.slug}
              chapterTitle={chapter.title}
              subjectId={subject.id}
            />

          )}

        </section>
      )}

      {/* =====================================
          TAB 3: QUIZ ENGINE
      ====================================== */}

      {activeTab === 'quiz' && (
        <section
          role="tabpanel"
          className="animate-in fade-in duration-300"
        >

          <ChapterQuizEngine
            chapterSlug={chapter.slug}
            subjectId={subject.id}
          />

        </section>
      )}

    </main>
  );
}
