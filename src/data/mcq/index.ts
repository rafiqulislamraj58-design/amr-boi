import type { QuizQuestion } from '@/types/curriculum';

import { measurementMCQs } from './physics/measurement';
import { motionMCQs } from './physics/motion';
import { FORCE_MCQS } from './physics/force';
import { WORK_ENERGY_MCQS } from './physics/work-power-energy';
import { PRESSURE_MCQS } from './physics/pressure';
import { HEAT_MCQS } from './physics/heat';

import { STRUCTURE_OF_MATTER_MCQS } from './chemistry/structure-of-matter';
// chemisty
import { PERIODIC_TABLE_MCQS } from './chemistry/periodic-table';
import { CHEMICAL_BONDING_MCQS } from './chemistry/chemical-bonding';
import { CONCEPT_OF_CHEMISTRY_MCQS } from './chemistry/concept-of-chemistry';
import { STATES_OF_MATTER_MCQS } from './chemistry/states-of-matter';
import { MOLE_CONCEPT_MCQS } from './chemistry/mole-concept';
// =====================================================
// CHAPTER MCQ REGISTRY
// =====================================================

export const CHAPTER_MCQ_REGISTRY: Record<string, QuizQuestion[]> = {
  // Physics
  measurement: measurementMCQs,
  'physical-quantities-and-measurement': measurementMCQs,
  motion: motionMCQs,
  force: FORCE_MCQS,
  'work-power-energy': WORK_ENERGY_MCQS,
  'work-power-and-energy': WORK_ENERGY_MCQS,
  pressure: PRESSURE_MCQS,
  'states-of-matter-and-pressure': PRESSURE_MCQS,
  'state-of-matter-and-pressure': PRESSURE_MCQS,
  heat: HEAT_MCQS,
  'effect-of-heat-on-matter': HEAT_MCQS,
  'effects-of-heat-on-matter': HEAT_MCQS,

  // Chemistry
  'structure-of-matter': STRUCTURE_OF_MATTER_MCQS,
  'periodic-table': PERIODIC_TABLE_MCQS,
  'chemical-bonding': CHEMICAL_BONDING_MCQS,
  'chemical-bond': CHEMICAL_BONDING_MCQS,

  'concept-of-chemistry': CONCEPT_OF_CHEMISTRY_MCQS,
  'concepts-of-chemistry': CONCEPT_OF_CHEMISTRY_MCQS,
  'states-of-matter': STATES_OF_MATTER_MCQS,
  'state-of-matter': STATES_OF_MATTER_MCQS,
  // Chemistry
  'mole-concept': MOLE_CONCEPT_MCQS,
  'concept-of-mole': MOLE_CONCEPT_MCQS,
  'concept-of-mole-and-chemical-counting': MOLE_CONCEPT_MCQS,
  'mole-concept-and-chemical-calculations': MOLE_CONCEPT_MCQS,
};

// =====================================================
// GET MCQs BY CHAPTER
// =====================================================

export function getMCQsByChapter(chapterSlug: string): QuizQuestion[] {
  const normalizedSlug = chapterSlug.trim().toLowerCase();
  return CHAPTER_MCQ_REGISTRY[normalizedSlug] ?? [];
}