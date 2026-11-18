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

export default async function ChapterRoute({ params }: ChapterRouteProps) {
  const resolvedParams = await params;

  if (!resolvedParams?.subject || !resolvedParams?.chapterSlug) {
    notFound();
  }

  const { subject: subjectParam, chapterSlug } = resolvedParams;

  // Validate subject ID
  if (!(subjectParam in SUBJECTS_DATA)) {
    notFound();
  }

  const subject = SUBJECTS_DATA[subjectParam as SubjectId];

  // Find requested chapter by slug
  const chapter = subject.chapters.find((item) => item.slug === chapterSlug);

  if (!chapter) {
    notFound();
  }

  return <ChapterLearningClient subject={subject} chapter={chapter} />;
}