
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db, ChapterProgress } from '@/database/progressDb';
import { SUBJECTS_DATA } from '@/data/subjectsData';

import {
  BarChart3,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Trophy,
  TrendingUp,
  Loader2,
  RefreshCw,
  ChevronRight,
  Target,
} from 'lucide-react';

export default function ProgressDashboardPage() {
  const router = useRouter();

  const [progressList, setProgressList] = useState<ChapterProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await db.chapterProgress.toArray();
      setProgressList(data);
    } catch (error) {
      console.error('Progress loading failed:', error);
      alert('প্রগ্রেস লোড করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // Statistics
  const completedCount = progressList.filter(
    (item) => item.completed
  ).length;

  const totalCount = progressList.length;

  const weakCount = progressList.reduce(
    (acc, item) => acc + (item.weakTopics?.length || 0),
    0
  );

  const completionPercentage =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  // Export Backup
  const handleExport = async () => {
    try {
      const data = await db.chapterProgress.toArray();

      if (!data.length) {
        alert('ব্যাকআপ করার মতো কোনো প্রগ্রেস নেই।');
        return;
      }

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: 'application/json' }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `science-lab-progress-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('ব্যাকআপ তৈরি করা যায়নি।');
    }
  };

  // Import Backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImporting(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(
          event.target?.result as string
        );

        if (!Array.isArray(importedData)) {
          throw new Error('Invalid backup format');
        }

        const validData = importedData.every(
          (item) =>
            item &&
            typeof item.subjectId === 'string' &&
            typeof item.chapterSlug === 'string' &&
            typeof item.completed === 'boolean' &&
            typeof item.bestQuizScore === 'number' &&
            typeof item.totalQuestions === 'number' &&
            Array.isArray(item.weakTopics)
        );

        if (!validData) {
          throw new Error('Invalid progress data');
        }

        await db.chapterProgress.bulkPut(importedData);
        await loadProgress();

        alert('তোমার প্রগ্রেস সফলভাবে Restore হয়েছে!');
      } catch (error) {
        console.error(error);
        alert('সঠিক Science Lab Backup JSON ফাইল নির্বাচন করো।');
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      setImporting(false);
      alert('ফাইলটি পড়া সম্ভব হয়নি।');
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  // Reset All
  const handleResetAll = async () => {
    const confirmed = confirm(
      'তুমি কি নিশ্চিত? সব লোকাল প্রগ্রেস স্থায়ীভাবে মুছে যাবে!'
    );

    if (!confirmed) return;

    try {
      await db.chapterProgress.clear();
      setProgressList([]);
      alert('সব প্রগ্রেস Reset করা হয়েছে।');
    } catch (error) {
      console.error(error);
      alert('প্রগ্রেস Reset করা যায়নি।');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6
            rounded-xl border border-slate-200 bg-white
            text-slate-600 hover:text-blue-600 hover:border-blue-300
            transition-all text-sm font-semibold"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center
          justify-between gap-5">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                  <BarChart3 size={27} />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    আমার শেখার অগ্রগতি
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    My Learning Progress Dashboard
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                তোমার শেখার অগ্রগতি, কুইজ স্কোর এবং দুর্বল টপিকগুলো
                  এক জায়গায় দেখো।
              </p>
            </div>

            {/* Backup Controls */}
            <div className="flex flex-wrap gap-2">

              <button
                onClick={handleExport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5
                rounded-xl bg-white border border-slate-200
                hover:bg-blue-50 text-slate-700 text-sm font-semibold
                transition-all disabled:opacity-50"
              >
                <Download size={16} />
                Export
              </button>

              <label className={`flex items-center gap-2 px-4 py-2.5
                rounded-xl bg-white border border-slate-200
                hover:bg-emerald-50 text-slate-700 text-sm font-semibold
                transition-all cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}>

                {importing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}

                Import

                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  disabled={importing}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetAll}
                disabled={loading || totalCount === 0}
                className="flex items-center gap-2 px-4 py-2.5
                rounded-xl bg-red-50 border border-red-200
                hover:bg-red-100 text-red-600 text-sm font-semibold
                transition-all disabled:opacity-50"
              >
                <Trash2 size={16} />
                Reset
              </button>

            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500 mt-4">
              তোমার প্রগ্রেস লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <StatCard
                icon={<BookOpen size={22} />}
                label="অনুশীলনকৃত অধ্যায়"
                value={totalCount}
                color="blue"
              />

              <StatCard
                icon={<CheckCircle2 size={22} />}
                label="সম্পন্ন অধ্যায়"
                value={completedCount}
                color="emerald"
              />

              <StatCard
                icon={<Target size={22} />}
                label="Completion Rate"
                value={`${completionPercentage}%`}
                color="violet"
              />

              <StatCard
                icon={<AlertCircle size={22} />}
                label="রিভিশন প্রয়োজন"
                value={weakCount}
                color="amber"
              />

            </div>

            {/* Overall Progress */}
            <div className="bg-white rounded-2xl border border-slate-200
            p-6 mb-8">

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    Overall Learning Progress
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    তোমার সম্পন্ন করা অধ্যায়ের অগ্রগতি
                  </p>
                </div>

                <Trophy className="text-amber-500" size={28} />
              </div>

              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-slate-600">
                  {completedCount} / {totalCount} Chapters
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600
                  rounded-full transition-all duration-700"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-3">
                {totalCount === 0
                  ? 'শেখা শুরু করলে এখানে তোমার অগ্রগতি দেখা যাবে।'
                  : completionPercentage === 100
                    ? 'অসাধারণ! তুমি সব অনুশীলনকৃত অধ্যায় সম্পন্ন করেছ।'
                    : 'এভাবেই নিয়মিত শেখা চালিয়ে যাও!'}
              </p>

            </div>

            {/* Chapter Report */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    অধ্যায়ভিত্তিক রিপোর্ট
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Chapter-wise learning performance
                  </p>
                </div>

                <TrendingUp className="text-blue-600" size={23} />
              </div>

              {progressList.length === 0 ? (

                <div className="text-center py-14">

                  <div className="w-16 h-16 rounded-2xl bg-blue-50
                  flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={30} className="text-blue-500" />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    এখনো কোনো প্রগ্রেস নেই!
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 mb-6">
                    একটি অধ্যায় দিয়ে শেখা শুরু করো।
                  </p>

                  <Link
                    href="/physics/motion"
                    className="inline-flex items-center gap-2 px-5 py-3
                    rounded-xl bg-blue-600 hover:bg-blue-700
                    text-white text-sm font-semibold transition-all"
                  >
                    Start Learning
                    <ChevronRight size={17} />
                  </Link>

                </div>

              ) : (

                <div className="space-y-3">

                  {progressList.map((item) => {

                    const subject = SUBJECTS_DATA[item.subjectId];

                    const chapter = subject?.chapters.find(
                      (c) => c.slug === item.chapterSlug
                    );

                    const scorePercentage =
                      item.totalQuestions > 0
                        ? Math.round(
                            (item.bestQuizScore / item.totalQuestions) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={`${item.subjectId}-${item.chapterSlug}`}
                        className="p-4 sm:p-5 rounded-xl border border-slate-200
                        hover:border-blue-200 hover:shadow-sm transition-all"
                      >

                        <div className="flex flex-col md:flex-row
                        md:items-center justify-between gap-4">

                          <div className="min-w-0">

                            <span className="text-xs font-bold text-blue-600 uppercase">
                              {subject?.nameBn || item.subjectId}
                            </span>

                            <Link
                              href={`/${item.subjectId}/${item.chapterSlug}`}
                              className="block text-base font-bold text-slate-900
                              hover:text-blue-600 mt-1"
                            >
                              {chapter?.title || item.chapterSlug}
                            </Link>

                            {item.weakTopics?.length > 0 && (
                              <p className="text-xs text-amber-700 mt-2 flex items-start gap-1">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                দুর্বল টপিক: {item.weakTopics.join(', ')}
                              </p>
                            )}

                          </div>

                          <div className="flex flex-wrap items-center gap-4">

                            <div className="min-w-24">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Quiz Score</span>
                                <span className="font-bold text-slate-800">
                                  {scorePercentage}%
                                </span>
                              </div>

                              <p className="text-sm font-bold text-slate-900">
                                {item.bestQuizScore} / {item.totalQuestions}
                              </p>

                              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{
                                    width: `${Math.min(scorePercentage, 100)}%`
                                  }}
                                />
                              </div>
                            </div>

                            {item.completed ? (
                              <span className="inline-flex items-center gap-1
                              text-xs font-bold px-3 py-2 rounded-full
                              bg-emerald-100 text-emerald-700">
                                <CheckCircle2 size={14} />
                                সম্পন্ন
                              </span>
                            ) : (
                              <span className="text-xs font-semibold px-3 py-2
                              rounded-full bg-amber-100 text-amber-700">
                                চলমান
                              </span>
                            )}

                            <Link
                              href={`/${item.subjectId}/${item.chapterSlug}`}
                              className="p-2 rounded-lg bg-slate-100
                              hover:bg-blue-100 text-slate-500
                              hover:text-blue-600 transition-all"
                              aria-label="Continue chapter"
                            >
                              <ChevronRight size={18} />
                            </Link>

                          </div>
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            {/* Refresh */}
            <div className="flex justify-center mt-6">
              <button
                onClick={loadProgress}
                className="flex items-center gap-2 text-sm text-slate-500
                hover:text-blue-600 transition-colors"
              >
                <RefreshCw size={15} />
                Refresh Progress
              </button>
            </div>

          </>
        )}

      </div>
    </main>
  );
}

// Reusable Stat Card
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200
    hover:shadow-md transition-all">

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>

        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}
