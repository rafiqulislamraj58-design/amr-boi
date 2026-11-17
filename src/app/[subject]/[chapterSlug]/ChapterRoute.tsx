
import { notFound } from 'next/navigation';

import { SUBJECTS_DATA } from '@/data/subjectsData';
import type { SubjectId } from '@/types/curriculum';

import ChapterLearningClient from './ChapterLearningClient';

interface ChapterRouteProps {
  params: Promise<{
    subject: string;
    chapterSlug: string;
  }>;
}

export default async function ChapterRoute({
  params,
}: ChapterRouteProps) {
  // Runtime params are accessed inside Suspense
  const { subject: subjectParam, chapterSlug } = await params;

  // Validate subject
  const subject = SUBJECTS_DATA[subjectParam as SubjectId];

  if (!subject) {
    notFound();
  }

  // Find requested chapter
  const chapter = subject.chapters.find(
    (item) => item.slug === chapterSlug
  );

  if (!chapter) {
    notFound();
  }

  return (
    <ChapterLearningClient
      subject={subject}
      chapter={chapter}
    />
  );
}
