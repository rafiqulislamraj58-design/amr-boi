import React, { Suspense } from 'react';
import ChapterRoute from './ChapterRoute';

interface PageProps {
  params: Promise<{
    subject: string;
    chapterSlug: string;
  }>;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 font-medium">
          অধ্যায় লোড হচ্ছে...
        </div>
      }
    >
      <ChapterRoute params={params} />
    </Suspense>
  );
}