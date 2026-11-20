import type { QuizQuestion } from '@/types/curriculum';

import { measurementMCQs } from './physics/measurement';
import { motionMCQs } from './physics/motion';
import { FORCE_MCQS } from './physics/force';
import { WORK_ENERGY_MCQS } from './physics/work-power-energy';
import { PRESSURE_MCQS } from './physics/pressure';
import { HEAT_MCQS } from './physics/heat';

import { STRUCTURE_OF_MATTER_MCQS } from './chemistry/structure-of-matter';

import { WAVES_AND_SOUND_MCQS } from './physics/waves-and-sound';

import { REFLECTION_OF_LIGHT_MCQS } from './physics/reflection-of-light';

import { REFRACTION_OF_LIGHT_MCQS } from './physics/refraction-of-light';

import { STATIC_ELECTRICITY_MCQS } from './physics/static-electricity';

import { CURRENT_ELECTRICITY_MCQS } from './physics/current-electricity';

import { MAGNETIC_EFFECTS_MCQS } from './physics/magnetic-effects';
import { MODERN_PHYSICS_MCQS } from './physics/modern-physics';
import { PHYSICS_TO_SAVE_LIFE_MCQS } from './physics/physics-to-save-life';

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

  'waves-and-sound': WAVES_AND_SOUND_MCQS,
  'wave-and-sound': WAVES_AND_SOUND_MCQS,
  'waves': WAVES_AND_SOUND_MCQS,

  
  'reflection-of-light': REFLECTION_OF_LIGHT_MCQS,
  'light-reflection': REFLECTION_OF_LIGHT_MCQS,


  'refraction-of-light': REFRACTION_OF_LIGHT_MCQS,
  'light-refraction': REFRACTION_OF_LIGHT_MCQS,

  'static-electricity': STATIC_ELECTRICITY_MCQS,
  'electrostatics': STATIC_ELECTRICITY_MCQS,

 
  'current-electricity': CURRENT_ELECTRICITY_MCQS,
  'electricity': CURRENT_ELECTRICITY_MCQS,

 
  'magnetic-effects': MAGNETIC_EFFECTS_MCQS,
  'magnetic-effects-of-current': MAGNETIC_EFFECTS_MCQS,
  'magnetic-effect-of-current': MAGNETIC_EFFECTS_MCQS,


  'modern-physics': MODERN_PHYSICS_MCQS,
  'modern-physics-and-electronics': MODERN_PHYSICS_MCQS,


  'physics-to-save-life': PHYSICS_TO_SAVE_LIFE_MCQS,
  'life-and-physics': PHYSICS_TO_SAVE_LIFE_MCQS,

  

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