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

import { CHEMICAL_REACTIONS_MCQS } from './chemistry/chemical-reactions';

import { CHEMISTRY_AND_ENERGY_MCQS } from './chemistry/chemistry-and-energy';

import { ACID_BASE_BALANCE_MCQS } from './chemistry/acid-base-balance';
import { MINERAL_RESOURCES_METAL_MCQS } from './chemistry/mineral-resources-metal';
import { MINERAL_RESOURCES_FOSSILS_MCQS } from './chemistry/mineral-resources-fossils';

import { CHEMISTRY_IN_OUR_LIFE_MCQS } from './chemistry/chemistry-in-our-life';
// biology
import { LESSONS_ON_LIFE_MCQS } from './biology/lessons-on-life';

import { CELLS_AND_TISSUES_MCQS } from './biology/cells-and-tissues';

import { CELL_DIVISION_MCQS } from './biology/cell-division';

import { BIOENERGETICS_MCQS } from './biology/bioenergetics';

import { FOOD_NUTRITION_DIGESTION_MCQS } from './biology/food-nutrition-digestion';

import { TRANSPORT_IN_ORGANISMS_MCQS } from './biology/transport-in-organisms';





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

  'mole-concept': MOLE_CONCEPT_MCQS,
  'concept-of-mole': MOLE_CONCEPT_MCQS,
  'concept-of-mole-and-chemical-counting': MOLE_CONCEPT_MCQS,
  'mole-concept-and-chemical-calculations': MOLE_CONCEPT_MCQS,


  'chemical-reactions': CHEMICAL_REACTIONS_MCQS,
  'chemical-reaction': CHEMICAL_REACTIONS_MCQS,

  
  'chemistry-and-energy': CHEMISTRY_AND_ENERGY_MCQS,
  'chemistry-energy': CHEMISTRY_AND_ENERGY_MCQS,


  'acid-base-balance': ACID_BASE_BALANCE_MCQS,
  'acid-base': ACID_BASE_BALANCE_MCQS,




  'mineral-resources-metal': MINERAL_RESOURCES_METAL_MCQS,
  'mineral-resources-metal-nonmetal': MINERAL_RESOURCES_METAL_MCQS,
  'mineral-resources-metals-nonmetals': MINERAL_RESOURCES_METAL_MCQS,
  'mineral-resources-metal-and-nonmetal': MINERAL_RESOURCES_METAL_MCQS,
  'mineral-resources': MINERAL_RESOURCES_METAL_MCQS,
  // 
  //
  'mineral-resources-fossils': MINERAL_RESOURCES_FOSSILS_MCQS,
  'mineral-resources-fossil': MINERAL_RESOURCES_FOSSILS_MCQS,
  'mineral-resources-fossil-fuels': MINERAL_RESOURCES_FOSSILS_MCQS,
  'fossils': MINERAL_RESOURCES_FOSSILS_MCQS,
  // 
  // 
  //
  'chemistry-in-our-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-in-our-lives': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-in-everyday-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-in-daily-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-in-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'everyday-chemistry': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-and-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
  'chemistry-life': CHEMISTRY_IN_OUR_LIFE_MCQS,
// boilogy

  'lessons-on-life': LESSONS_ON_LIFE_MCQS,
  'lesson-on-life': LESSONS_ON_LIFE_MCQS,
  'life-lessons': LESSONS_ON_LIFE_MCQS,


  'cells-and-tissues': CELLS_AND_TISSUES_MCQS,
  'cell-and-tissue': CELLS_AND_TISSUES_MCQS,
  'cells-and-tissues-of-organisms': CELLS_AND_TISSUES_MCQS,
// 

  'cell-division': CELL_DIVISION_MCQS,
  'cell-divisions': CELL_DIVISION_MCQS,

// 

  'bioenergetics': BIOENERGETICS_MCQS,
  'bio-energetics': BIOENERGETICS_MCQS,
  'life-energy': BIOENERGETICS_MCQS,


// 
  'food-nutrition-and-digestion': FOOD_NUTRITION_DIGESTION_MCQS,
  'food-nutrition-digestion': FOOD_NUTRITION_DIGESTION_MCQS,
  'nutrition-and-digestion': FOOD_NUTRITION_DIGESTION_MCQS,

  // 
 
  'transport-in-organisms': TRANSPORT_IN_ORGANISMS_MCQS,
  'transport-in-organism': TRANSPORT_IN_ORGANISMS_MCQS,
  'transportation-in-organisms': TRANSPORT_IN_ORGANISMS_MCQS,

};
// 


// =====================================================
// GET MCQs BY CHAPTER
// =====================================================

export function getMCQsByChapter(chapterSlug: string): QuizQuestion[] {
  const normalizedSlug = chapterSlug.trim().toLowerCase();
  return CHAPTER_MCQ_REGISTRY[normalizedSlug] ?? [];
}