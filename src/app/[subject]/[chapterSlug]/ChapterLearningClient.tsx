'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FlaskConical, HelpCircle } from 'lucide-react';
import type { SubjectData, ChapterData } from '@/types/curriculum';

// Physics Chapter Views
import MeasurementChapterView from '@/features/physics/measurement/MeasurementChapterView';
import MotionChapterView from '@/features/physics/motion/MotionChapterView';

// Chemistry & Biology Specialized Labs
import AtomStructureLab from '@/features/chemistry/AtomStructureLab';
import CellThreeDExplorer from '@/features/biology/CellThreeDExplorer';

// Universal Engines
import UniversalLabEngine from '@/engines/UniversalLabEngine';
import ChapterQuizEngine from '@/features/quiz/ChapterQuizEngine';

interface Props {
  subject: SubjectData;
  chapter: ChapterData;
}

export default function ChapterLearningClient({ subject, chapter }: Props) {
  const [activeTab, setActiveTab] = useState<'lesson' | 'lab' | 'quiz'>('lesson');

  const renderChapterLesson = () => {
    switch (chapter.slug) {
      case 'measurement':
      case 'physical-quantities-and-measurement':
        return <MeasurementChapterView />;

      case 'motion':
        return <MotionChapterView />;

      case 'structure-of-matter':
        return <AtomStructureLab />;

      case 'cells-and-tissues':
        return <CellThreeDExplorer />;

      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">{chapter.title}</h2>
              <p className="text-slate-600 leading-relaxed">
                {chapter.summary || 'এই অধ্যায়ের বিস্তারিত পাঠ ও ইন্টারঅ্যাক্টিভ সিমুলেশন নিচে অনুশীলন করো।'}
              </p>
            </div>
            <UniversalLabEngine
              chapterSlug={chapter.slug}
              chapterTitle={chapter.title}
              subjectId={subject.id}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Breadcrumb & Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <Link
            href={`/${subject.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{subject.title}-এর সব অধ্যায়ে ফিরে যাও</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{chapter.title}</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'lesson'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>মূল পাঠ ও টপিক</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>ল্যাব ক্যালকুলেটর</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>MCQ অনুশীলন (২৫টি)</span>
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div>
        {activeTab === 'lesson' && renderChapterLesson()}

        {activeTab === 'lab' && (
          <UniversalLabEngine
            chapterSlug={chapter.slug}
            chapterTitle={chapter.title}
            subjectId={subject.id}
          />
        )}

        {activeTab === 'quiz' && (
          <ChapterQuizEngine
            chapterSlug={chapter.slug}
            subjectId={subject.id}
          />
        )}
      </div>
    </div>
  );
}