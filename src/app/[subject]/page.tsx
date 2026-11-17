import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SUBJECTS_DATA } from '@/data/subjectsData';
import { SubjectId } from '@/types/curriculum';
import { Clock, PlayCircle, Box, FlaskConical, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

// Next.js Instant Shell এরর ফিক্স করার জন্য এই লাইনটি:
export const instant = false;

interface Props {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: Props) {
  const { subject: subjectParam } = await params;
  const subject = SUBJECTS_DATA[subjectParam as SubjectId];

  if (!subject) {
    notFound();
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        সব বিষয় (হোমপেজ)
      </Link>

      {/* Subject Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${subject.badgeClass}`}>
            নবম-দশম শ্রেণি • মোট {subject.chapterCount} টি অধ্যায়
          </span>
          <h1 className="text-3xl font-bold text-slate-900">{subject.nameBn} ({subject.nameEn})</h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">{subject.description}</p>
        </div>
      </div>

      {/* Chapter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subject.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/${subject.id}/${chapter.slug}`}
            className={`group bg-white rounded-xl p-6 border border-slate-200 transition-all hover:shadow-md flex flex-col justify-between ${subject.cardBorderClass}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  অধ্যায় {chapter.chapterNumber}
                </span>
                <div className="flex items-center gap-2">
                  {chapter.isPilot && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      <Sparkles className="w-3 h-3" /> পাইলট ল্যাব প্রস্তুত
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {chapter.estimatedMinutes} মিনিট
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {chapter.title}
              </h2>
              <p className="text-xs font-sans text-slate-400 mb-2">{chapter.titleEn}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {chapter.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                {chapter.has2DAnimation && (
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <PlayCircle className="w-3.5 h-3.5 text-blue-600" /> 2D অ্যানিমেশন
                  </span>
                )}
                {chapter.has3DModel && (
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <Box className="w-3.5 h-3.5 text-emerald-600" /> 3D মডেল
                  </span>
                )}
                {chapter.hasVirtualLab && (
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-600" /> ভার্চুয়াল ল্যাব
                  </span>
                )}
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}