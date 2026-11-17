
import { Suspense } from 'react';
import ChapterRoute from './ChapterRoute';

interface PageProps {
  params: Promise<{
    subject: string;
    chapterSlug: string;
  }>;
}

function ChapterLoading() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-5 w-48 bg-slate-200 rounded" />

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="h-8 w-2/3 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-1/2 bg-slate-100 rounded" />

          <div className="flex gap-3 pt-5">
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
            <div className="h-10 w-36 bg-slate-200 rounded-xl" />
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
          </div>
        </div>

        <div className="h-96 bg-slate-100 rounded-2xl" />
      </div>
    </main>
  );
}

export default function ChapterLearningPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<ChapterLoading />}>
      <ChapterRoute params={params} />
    </Suspense>
  );
}
