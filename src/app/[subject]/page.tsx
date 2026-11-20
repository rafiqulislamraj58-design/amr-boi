
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SUBJECTS_DATA } from '@/data/subjectsData';
import type { SubjectId } from '@/types/curriculum';

import {
  Clock,
  PlayCircle,
  Box,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers3,
  ChevronRight,
} from 'lucide-react';

export const instant = false;

interface Props {
  params: Promise<{ subject: string }>;
}

const FeatureBadge = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${color}`}
  >
    <Icon className="h-3.5 w-3.5 shrink-0" />
    {label}
  </span>
);

export default async function SubjectPage({ params }: Props) {
  const { subject: subjectParam } = await params;

  const subject = SUBJECTS_DATA[subjectParam as SubjectId];

  if (!subject) {
    notFound();
  }

  const chapters = subject.chapters ?? [];
  const totalChapters = chapters.length;

  const pilotCount = chapters.filter(
    (chapter) => chapter.isPilot
  ).length;

  const animationCount = chapters.filter(
    (chapter) => chapter.has2DAnimation
  ).length;

  const modelCount = chapters.filter(
    (chapter) => chapter.has3DModel
  ).length;

  const labCount = chapters.filter(
    (chapter) => chapter.hasVirtualLab
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব বিষয়
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span className="font-semibold text-slate-800">
            {subject.nameBn}
          </span>
        </nav>

        {/* Subject Header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

          {/* Decorative Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl"
          />

          <div className="relative z-10">

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${subject.badgeClass}`}
              >
                নবম-দশম শ্রেণি
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <BookOpen className="h-3.5 w-3.5" />
                NCTB Curriculum
              </span>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div className="max-w-2xl">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {subject.nameBn}
                </h1>

                <p className="mt-2 text-sm font-medium tracking-wide text-blue-600 sm:text-base">
                  {subject.nameEn}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {subject.description}
                </p>
              </div>

              {/* Chapter Count */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-w-52">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {totalChapters}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    মোট অধ্যায়
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Learning Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <StatCard
            icon={Layers3}
            label="মোট অধ্যায়"
            value={totalChapters}
            color="blue"
          />

          <StatCard
            icon={Sparkles}
            label="পাইলট ল্যাব"
            value={pilotCount}
            color="amber"
          />

          <StatCard
            icon={PlayCircle}
            label="2D অ্যানিমেশন"
            value={animationCount}
            color="indigo"
          />

          <StatCard
            icon={Box}
            label="3D মডেল"
            value={modelCount + labCount}
            color="emerald"
          />

        </section>

        {/* Chapter Section Header */}
        <section>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                অধ্যায়সমূহ
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                পছন্দের অধ্যায় নির্বাচন করে শেখা শুরু করো।
              </p>
            </div>

            <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              {totalChapters} টি অধ্যায়
            </span>

          </div>

          {/* Chapter List */}
          {totalChapters > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {chapters.map((chapter) => (

                <Link
                  key={chapter.id}
                  href={`/${subject.id}/${chapter.slug}`}
                  aria-label={`অধ্যায় ${chapter.chapterNumber}: ${chapter.title} পড়ুন`}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-6 ${subject.cardBorderClass}`}
                >

                  <div>

                    {/* Chapter Meta */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-600">
                        অধ্যায় {chapter.chapterNumber}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">

                        {chapter.isPilot && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                            <Sparkles className="h-3 w-3" />
                            Pilot Lab
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {chapter.estimatedMinutes} মিনিট
                        </span>

                      </div>
                    </div>

                    {/* Chapter Title */}
                    <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                      {chapter.title}
                    </h3>

                    <p className="mb-3 mt-1 text-xs font-medium text-slate-400">
                      {chapter.titleEn}
                    </p>

                    <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-600">
                      {chapter.description}
                    </p>

                  </div>

                  {/* Chapter Features */}
                  <div className="border-t border-slate-100 pt-4">

                    <div className="flex flex-wrap items-center gap-2">

                      {chapter.has2DAnimation && (
                        <FeatureBadge
                          icon={PlayCircle}
                          label="2D অ্যানিমেশন"
                          color="bg-blue-50 text-blue-700"
                        />
                      )}

                      {chapter.has3DModel && (
                        <FeatureBadge
                          icon={Box}
                          label="3D মডেল"
                          color="bg-emerald-50 text-emerald-700"
                        />
                      )}

                      {chapter.hasVirtualLab && (
                        <FeatureBadge
                          icon={FlaskConical}
                          label="ভার্চুয়াল ল্যাব"
                          color="bg-amber-50 text-amber-700"
                        />
                      )}

                    </div>

                    {/* Open Chapter */}
                    <div className="mt-5 flex items-center justify-between">

                      <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                        শেখা শুরু করো
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        Chapter {chapter.chapterNumber}
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          ) : (

            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <BookOpen className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                এখনো কোনো অধ্যায় যুক্ত করা হয়নি
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                এই বিষয়ের অধ্যায়গুলো শীঘ্রই যুক্ত করা হবে।
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4" />
                হোমপেজে ফিরে যাও
              </Link>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}


/* =========================================
   STATISTICS CARD
========================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'blue' | 'amber' | 'indigo' | 'emerald';
}) {

  const styles = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-5">

      <div className="flex items-center gap-3">

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            {value}
          </p>

          <p className="truncate text-xs font-medium text-slate-500">
            {label}
          </p>
        </div>

      </div>

    </div>
  );
}
