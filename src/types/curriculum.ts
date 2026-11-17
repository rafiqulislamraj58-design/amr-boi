export type SubjectId = 'physics' | 'chemistry' | 'biology';

export interface Chapter {
  id: string;
  chapterNumber: number;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  estimatedMinutes: number;
  has2DAnimation: boolean;
  has3DModel: boolean;
  hasVirtualLab: boolean;
  isPilot?: boolean;
}

export interface Subject {
  id: SubjectId;
  nameBn: string;
  nameEn: string;
  description: string;
  chapterCount: number;
  colorHex: string;
  badgeClass: string;
  cardBorderClass: string;
  buttonClass: string;
  chapters: Chapter[];
}