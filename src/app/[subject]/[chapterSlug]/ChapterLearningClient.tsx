"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  HelpCircle,
  Loader2,
} from "lucide-react";

import type { SubjectData, ChapterData } from "@/types/curriculum";

// ============================================
// LOADING FALLBACK
// ============================================

const SectionLoader = () => (
  <div
    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-16 text-slate-500"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
    <p className="text-sm font-semibold">লোড হচ্ছে...</p>
  </div>
);

// ============================================
// PHYSICS CHAPTER VIEWS
// ============================================

const MeasurementChapterView = dynamic(
  () => import("@/features/physics/measurement/MeasurementChapterView"),
  { loading: () => <SectionLoader /> },
);

const MotionChapterView = dynamic(
  () => import("@/features/physics/motion/MotionChapterView"),
  { loading: () => <SectionLoader /> },
);

const ForceChapterView = dynamic(
  () => import("@/features/physics/force/ForceChapterView"),
  { loading: () => <SectionLoader /> },
);

const WorkEnergyChapterView = dynamic(
  () => import("@/features/physics/work-energy/WorkEnergyChapterView"),
  { loading: () => <SectionLoader /> },
);

const PressureChapterView = dynamic(
  () => import("@/features/physics/pressure/PressureChapterView"),
  { loading: () => <SectionLoader /> },
);

const HeatChapterView = dynamic(
  () => import("@/features/physics/heat/HeatChapterView"),
  { loading: () => <SectionLoader /> },
);

const WavesAndSoundChapterView = dynamic(
  () => import("@/features/physics/waves-and-sound/WavesAndSoundChapterView"),
  { loading: () => <SectionLoader /> },
);

const ReflectionOfLightChapterView = dynamic(
  () =>
    import("@/features/physics/reflection-of-light/ReflectionOfLightChapterView"),
  { loading: () => <SectionLoader /> },
);

const RefractionOfLightChapterView = dynamic(
  () =>
    import("@/features/physics/refraction-of-light/RefractionOfLightChapterView"),
  { loading: () => <SectionLoader /> },
);

const StaticElectricityChapterView = dynamic(
  () =>
    import("@/features/physics/static-electricity/StaticElectricityChapterView"),
  { loading: () => <SectionLoader /> },
);

const CurrentElectricityChapterView = dynamic(
  () =>
    import("@/features/physics/current-electricity/CurrentElectricityChapterView"),
  { loading: () => <SectionLoader /> },
);

const MagneticEffectsChapterView = dynamic(
  () =>
    import("@/features/physics/magnetic-effects/MagneticEffectsChapterView"),
  { loading: () => <SectionLoader /> },
);

const ModernPhysicsChapterView = dynamic(
  () => import("@/features/physics/modern-physics/ModernPhysicsChapterView"),
  { loading: () => <SectionLoader /> },
);

const PhysicsToSaveLifeChapterView = dynamic(
  () =>
    import("@/features/physics/physics-to-save-life/PhysicsToSaveLifeChapterView"),
  { loading: () => <SectionLoader /> },
);

const BiotechnologyChapterView = dynamic(
  () => import("@/features/biology/biotechnology/BiotechnologyChapterView"),
  { loading: () => <SectionLoader /> },
);



// ============================================
// CHEMISTRY CHAPTER VIEWS
// ============================================

const ConceptOfChemistryChapterView = dynamic(
  () =>
    import("@/features/chemistry/concept-of-chemistry/ConceptOfChemistryChapterView"),
  { loading: () => <SectionLoader /> },
);

const StatesOfMatterChapterView = dynamic(
  () =>
    import("@/features/chemistry/states-of-matter/StatesOfMatterChapterView"),
  { loading: () => <SectionLoader /> },
);

const AtomStructureChapterView = dynamic(
  () =>
    import("@/features/chemistry/structure-of-matter/AtomStructureChapterView"),
  { loading: () => <SectionLoader /> },
);

const PeriodicTableChapterView = dynamic(
  () => import("@/features/chemistry/periodic-table/PeriodicTableChapterView"),
  { loading: () => <SectionLoader /> },
);

const ChemicalBondingChapterView = dynamic(
  () =>
    import("@/features/chemistry/chemical-bonding/ChemicalBondingChapterView"),
  { loading: () => <SectionLoader /> },
);

const MoleConceptChapterView = dynamic(
  () => import("@/features/chemistry/mole-concept/MoleConceptChapterView"),
  { loading: () => <SectionLoader /> },
);

const ChemicalReactionsChapterView = dynamic(
  () =>
    import("@/features/chemistry/chemical-reactions/ChemicalReactionsChapterView"),
  { loading: () => <SectionLoader /> },
);

const ChemistryAndEnergyChapterView = dynamic(
  () =>
    import("@/features/chemistry/chemistry-and-energy/ChemistryAndEnergyChapterView"),
  { loading: () => <SectionLoader /> },
);

const AcidBaseBalanceChapterView = dynamic(
  () =>
    import("@/features/chemistry/acid-base-balance/AcidBaseBalanceChapterView"),
  { loading: () => <SectionLoader /> },
);

const MineralResourcesMetalChapterView = dynamic(
  () =>
    import("@/features/chemistry/mineral-resources-metal/MineralResourcesMetalChapterView"),
  { loading: () => <SectionLoader /> },
);

const MineralResourcesFossilsChapterView = dynamic(
  () =>
    import("@/features/chemistry/mineral-resources-fossils/MineralResourcesFossilsChapterView"),
  { loading: () => <SectionLoader /> },
);

const ChemistryInOurLifeChapterView = dynamic(
  () =>
    import("@/features/chemistry/chemistry-in-our-life/ChemistryInOurLifeChapterView"),
  { loading: () => <SectionLoader /> },
);

// ============================================
// BIOLOGY CHAPTER VIEWS
// ============================================

const LessonsOnLifeChapterView = dynamic(
  () => import("@/features/biology/lessons-on-life/LessonsOnLifeChapterView"),
  { loading: () => <SectionLoader /> },
);

const CellsAndTissuesChapterView = dynamic(
  () => import("@/features/biology/cells-and-tissues/CellsAndTissuesChapterView"),
  { loading: () => <SectionLoader /> },
);

const CellDivisionChapterView = dynamic(
  () => import("@/features/biology/cell-division/CellDivisionChapterView"),
  { loading: () => <SectionLoader /> },
);

const BioenergeticsChapterView = dynamic(
  () => import("@/features/biology/bioenergetics/BioenergeticsChapterView"),
  { loading: () => <SectionLoader /> },
);

const FoodNutritionDigestionChapterView = dynamic(
  () =>
    import("@/features/biology/food-nutrition-digestion/FoodNutritionDigestionChapterView"),
  { loading: () => <SectionLoader /> },
);

const TransportInOrganismsChapterView = dynamic(
  () =>
    import("@/features/biology/transport-in-organisms/TransportInOrganismsChapterView"),
  { loading: () => <SectionLoader /> },
);

const ExchangeOfGasesChapterView = dynamic(
  () =>
    import("@/features/biology/exchange-of-gases/ExchangeOfGasesChapterView"),
  { loading: () => <SectionLoader /> },
);

const ExcretionChapterView = dynamic(
  () => import("@/features/biology/excretion/ExcretionChapterView"),
  { loading: () => <SectionLoader /> },
);

const SupportAndMovementChapterView = dynamic(
  () =>
    import("@/features/biology/support-and-movement/SupportAndMovementChapterView"),
  { loading: () => <SectionLoader /> },
);



const CoordinationChapterView = dynamic(
  () => import("@/features/biology/coordination/CoordinationChapterView"),
  { loading: () => <SectionLoader /> },
);


// 
const ReproductionChapterView = dynamic(
  () => import("@/features/biology/reproduction/ReproductionChapterView"),
  { loading: () => <SectionLoader /> },
);
// 
const EnvironmentOfLifeChapterView = dynamic(
  () =>
    import("@/features/biology/environment-of-life/EnvironmentOfLifeChapterView"),
  { loading: () => <SectionLoader /> },
);



// ============================================
// INTERACTIVE PHYSICS LABS
// ============================================

const VernierCaliperLab = dynamic(
  () => import("@/features/physics/VernierCaliperLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const MotionSimulationLab = dynamic(
  () => import("@/features/physics/MotionSimulationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ForceSimulationLab = dynamic(
  () => import("@/features/physics/force/ForceSimulationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const WorkEnergySimulationLab = dynamic(
  () => import("@/features/physics/work-energy/WorkEnergySimulationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const PressureSimulationLab = dynamic(
  () => import("@/features/physics/pressure/PressureSimulationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const HeatSimulationLab = dynamic(
  () => import("@/features/physics/heat/HeatSimulationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const WavesAndSoundLab = dynamic(
  () => import("@/features/physics/waves-and-sound/WavesAndSoundLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ReflectionOfLightLab = dynamic(
  () => import("@/features/physics/reflection-of-light/ReflectionOfLightLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const RefractionOfLightLab = dynamic(
  () => import("@/features/physics/refraction-of-light/RefractionOfLightLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const StaticElectricityLab = dynamic(
  () => import("@/features/physics/static-electricity/StaticElectricityLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const CurrentElectricityLab = dynamic(
  () => import("@/features/physics/current-electricity/CurrentElectricityLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const MagneticEffectsLab = dynamic(
  () => import("@/features/physics/magnetic-effects/MagneticEffectsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ModernPhysicsLab = dynamic(
  () => import("@/features/physics/modern-physics/ModernPhysicsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const PhysicsToSaveLifeLab = dynamic(
  () => import("@/features/physics/physics-to-save-life/PhysicsToSaveLifeLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const BiotechnologyLab = dynamic(
  () => import("@/features/biology/biotechnology/BiotechnologyLab"),
  { loading: () => <SectionLoader />, ssr: false },
);



// ============================================
// CHEMISTRY LABS
// ============================================

const HazardSymbolsLab = dynamic(
  () => import("@/features/chemistry/concept-of-chemistry/HazardSymbolsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const StatesOfMatterLab = dynamic(
  () => import("@/features/chemistry/states-of-matter/StatesOfMatterLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const AtomStructureLab = dynamic(
  () => import("@/features/chemistry/AtomStructureLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const PeriodicTableLab = dynamic(
  () => import("@/features/chemistry/periodic-table/PeriodicTableLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ChemicalBondingLab = dynamic(
  () => import("@/features/chemistry/chemical-bonding/ChemicalBondingLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const MoleConceptLab = dynamic(
  () => import("@/features/chemistry/mole-concept/MoleConceptLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ChemicalReactionsLab = dynamic(
  () => import("@/features/chemistry/chemical-reactions/ChemicalReactionsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ChemistryAndEnergyLab = dynamic(
  () =>
    import("@/features/chemistry/chemistry-and-energy/ChemistryAndEnergyLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const AcidBaseBalanceLab = dynamic(
  () => import("@/features/chemistry/acid-base-balance/AcidBaseBalanceLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const MineralResourcesMetalLab = dynamic(
  () =>
    import("@/features/chemistry/mineral-resources-metal/MineralResourcesMetalLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const MineralResourcesFossilsLab = dynamic(
  () =>
    import("@/features/chemistry/mineral-resources-fossils/MineralResourcesFossilsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ChemistryInOurLifeLab = dynamic(
  () =>
    import("@/features/chemistry/chemistry-in-our-life/ChemistryInOurLifeLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const EnvironmentOfLifeLab = dynamic(
  () =>
    import("@/features/biology/environment-of-life/EnvironmentOfLifeLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

// ============================================
// BIOLOGY LABS
// ============================================

const CellThreeDExplorer = dynamic(
  () => import("@/features/biology/CellThreeDExplorer"),
  { loading: () => <SectionLoader />, ssr: false },
);

const LessonsOnLifeLab = dynamic(
  () => import("@/features/biology/lessons-on-life/LessonsOnLifeLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const CellsAndTissuesLab = dynamic(
  () => import("@/features/biology/cells-and-tissues/CellsAndTissuesLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const CellDivisionLab = dynamic(
  () => import("@/features/biology/cell-division/CellDivisionLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const BioenergeticsLab = dynamic(
  () => import("@/features/biology/bioenergetics/BioenergeticsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const FoodNutritionDigestionLab = dynamic(
  () =>
    import("@/features/biology/food-nutrition-digestion/FoodNutritionDigestionLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const TransportInOrganismsLab = dynamic(
  () =>
    import("@/features/biology/transport-in-organisms/TransportInOrganismsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ExchangeOfGasesLab = dynamic(
  () => import("@/features/biology/exchange-of-gases/ExchangeOfGasesLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ExcretionLab = dynamic(
  () => import("@/features/biology/excretion/ExcretionLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const SupportAndMovementLab = dynamic(
  () =>
    import("@/features/biology/support-and-movement/SupportAndMovementLab"),
  { loading: () => <SectionLoader />, ssr: false },
);


const CoordinationLab = dynamic(
  () => import("@/features/biology/coordination/CoordinationLab"),
  { loading: () => <SectionLoader />, ssr: false },
);


// 
const ReproductionLab = dynamic(
  () => import("@/features/biology/reproduction/ReproductionLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const HeredityChapterView = dynamic(
  () => import("@/features/biology/heredity/HeredityChapterView"),
  { loading: () => <SectionLoader /> },
);

// 
const HeredityLab = dynamic(
  () => import("@/features/biology/heredity/HeredityLab"),
  { loading: () => <SectionLoader />, ssr: false },
);



// ============================================
// UNIVERSAL ENGINES
// ============================================

const UniversalLabEngine = dynamic(
  () => import("@/engines/UniversalLabEngine"),
  { loading: () => <SectionLoader />, ssr: false },
);

const ChapterQuizEngine = dynamic(
  () => import("@/features/quiz/ChapterQuizEngine"),
  { loading: () => <SectionLoader /> },
);

// ============================================
// TYPES & TAB CONFIGURATION
// ============================================

type TabId = "lesson" | "lab" | "quiz";

interface Props {
  subject: SubjectData;
  chapter: ChapterData;
}

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}

const TABS: TabItem[] = [
  {
    id: "lesson",
    label: "মূল পাঠ ও টপিক",
    icon: BookOpen,
    activeClass: "bg-white text-blue-600 shadow-xs",
  },
  {
    id: "lab",
    label: "ইন্টারঅ্যাক্টিভ ল্যাব",
    icon: FlaskConical,
    activeClass: "bg-white text-emerald-600 shadow-xs",
  },
  {
    id: "quiz",
    label: "MCQ অনুশীলন",
    icon: HelpCircle,
    activeClass: "bg-white text-amber-600 shadow-xs",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChapterLearningClient({ subject, chapter }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("lesson");
  const chapterSlug = chapter.slug.trim().toLowerCase();

  useEffect(() => {
    setActiveTab("lesson");
  }, [chapterSlug]);

  // ==========================================
  // LESSON CONTENT
  // ==========================================

  const renderChapterLesson = () => {
    switch (chapterSlug) {
      // Physics
      case "measurement":
      case "physical-quantities-and-measurement":
        return <MeasurementChapterView />;

      case "motion":
        return <MotionChapterView />;

      case "force":
        return <ForceChapterView />;

      case "work-power-energy":
      case "work-power-and-energy":
        return <WorkEnergyChapterView />;

      case "pressure":
      case "states-of-matter-and-pressure":
      case "state-of-matter-and-pressure":
        return <PressureChapterView />;

      case "heat":
      case "effect-of-heat-on-matter":
      case "effects-of-heat-on-matter":
        return <HeatChapterView />;

      case "waves-and-sound":
      case "wave-and-sound":
      case "waves":
        return <WavesAndSoundChapterView />;

      case "reflection-of-light":
      case "light-reflection":
        return <ReflectionOfLightChapterView />;

      case "refraction-of-light":
      case "light-refraction":
        return <RefractionOfLightChapterView />;

      case "static-electricity":
      case "electrostatics":
        return <StaticElectricityChapterView />;

      case "current-electricity":
      case "electricity":
        return <CurrentElectricityChapterView />;

      case "magnetic-effects":
      case "magnetic-effects-of-current":
      case "magnetic-effect-of-current":
        return <MagneticEffectsChapterView />;

      case "modern-physics":
      case "modern-physics-and-electronics":
        return <ModernPhysicsChapterView />;

      case "physics-to-save-life":
      case "life-and-physics":
        return <PhysicsToSaveLifeChapterView />;

      // Chemistry
      case "concept-of-chemistry":
      case "concepts-of-chemistry":
        return <ConceptOfChemistryChapterView />;

      case "states-of-matter":
      case "state-of-matter":
        return <StatesOfMatterChapterView />;

      case "structure-of-matter":
        return <AtomStructureChapterView />;

      case "periodic-table":
        return <PeriodicTableChapterView />;

      case "chemical-bonding":
      case "chemical-bond":
        return <ChemicalBondingChapterView />;

      case "mole-concept":
      case "concept-of-mole":
      case "concept-of-mole-and-chemical-counting":
      case "mole-concept-and-chemical-calculations":
        return <MoleConceptChapterView />;

      case "chemical-reactions":
      case "chemical-reaction":
        return <ChemicalReactionsChapterView />;

      case "chemistry-and-energy":
      case "chemistry-energy":
        return <ChemistryAndEnergyChapterView />;

      case "acid-base-balance":
      case "acid-base":
        return <AcidBaseBalanceChapterView />;

      case "mineral-resources-metal":
      case "mineral-resources-metal-nonmetal":
      case "mineral-resources-metals-nonmetals":
      case "mineral-resources-metal-and-nonmetal":
      case "mineral-resources-metals-and-nonmetals":
      case "mineral-resources":
        return <MineralResourcesMetalChapterView />;

      case "mineral-resources-fossils":
      case "mineral-resources-fossil":
      case "mineral-resources-fossil-fuels":
      case "fossils":
        return <MineralResourcesFossilsChapterView />;

      case "chemistry-in-our-life":
      case "chemistry-in-our-lives":
      case "chemistry-in-everyday-life":
      case "chemistry-in-daily-life":
      case "chemistry-in-life":
      case "everyday-chemistry":
      case "chemistry-and-life":
      case "chemistry-life":
        return <ChemistryInOurLifeChapterView />;

      // Biology
      case "lessons-on-life":
      case "lesson-on-life":
      case "life-lessons":
        return <LessonsOnLifeChapterView />;

      case "cells-and-tissues":
      case "cell-and-tissue":
      case "cells-and-tissues-of-organisms":
        return <CellsAndTissuesChapterView />;

      case "cell-division":
      case "cell-divisions":
        return <CellDivisionChapterView />;

      case "bioenergetics":
      case "bio-energetics":
      case "life-energy":
        return <BioenergeticsChapterView />;

      case "food-nutrition-and-digestion":
      case "food-nutrition-digestion":
      case "nutrition-and-digestion":
        return <FoodNutritionDigestionChapterView />;

      case "transport-in-organisms":
      case "transport-in-organism":
      case "transportation-in-organisms":
        return <TransportInOrganismsChapterView />;

      case "exchange-of-gases":
      case "exchange-of-gas":
      case "gaseous-exchange":
        return <ExchangeOfGasesChapterView />;

      case "excretion-in-organisms":
      case "excretion":
      case "excretion-in-organism":
      case "excretion-process":
      case "excretory-system":
        return <ExcretionChapterView />;

      case "support-and-movement-in-organisms":
      case "support-and-movement":
      case "locomotion-and-movement":
      case "support-and-locomotion":
      case "firmness-and-locomotion":
        return <SupportAndMovementChapterView />;


        case "coordination":
      case "coordination-in-organisms":
      case "coordination-in-organism":
        return <CoordinationChapterView />;
// 
 case "heredity-and-evolution":
      case "heredity-in-organisms-and-evolution":
      case "heredity-in-organisms":
        return <HeredityChapterView />;

        // 
        case "reproduction":
      case "reproduction-in-organisms":
      case "reproduction-in-organism":
        return <ReproductionChapterView />;
        // 
        case "environment-of-life":
      case "environment-of-organisms":
      case "organisms-and-environment":
      case "ecosystem":
        return <EnvironmentOfLifeChapterView />;
        // 
        case "biotechnology":
      case "bio-technology":
        return <BiotechnologyChapterView />;
        

        

      default:
        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              {chapter.title}
            </h2>
            <p className="mb-2 font-mono text-xs text-rose-600">
              Current Slug: &quot;{chapterSlug}&quot;
            </p>
            <p className="leading-relaxed text-slate-600">
              {chapter.description ||
                "এই অধ্যায়ের বিস্তারিত পাঠ ও ইন্টারঅ্যাক্টিভ সিমুলেশন শীঘ্রই যুক্ত হচ্ছে।"}
            </p>
          </div>
        );
    }
  };

  // ==========================================
  // LAB CONTENT
  // ==========================================

  const renderChapterLab = () => {
    switch (chapterSlug) {
      // Physics
      case "measurement":
      case "physical-quantities-and-measurement":
        return <VernierCaliperLab />;

      case "motion":
        return <MotionSimulationLab />;

      case "force":
        return <ForceSimulationLab />;

      case "work-power-energy":
      case "work-power-and-energy":
        return <WorkEnergySimulationLab />;

      case "pressure":
      case "states-of-matter-and-pressure":
      case "state-of-matter-and-pressure":
        return <PressureSimulationLab />;

      case "heat":
      case "effect-of-heat-on-matter":
      case "effects-of-heat-on-matter":
        return <HeatSimulationLab />;

      case "waves-and-sound":
      case "wave-and-sound":
      case "waves":
        return <WavesAndSoundLab />;

      case "reflection-of-light":
      case "light-reflection":
        return <ReflectionOfLightLab />;

      case "refraction-of-light":
      case "light-refraction":
        return <RefractionOfLightLab />;

      case "static-electricity":
      case "electrostatics":
        return <StaticElectricityLab />;

      case "current-electricity":
      case "electricity":
        return <CurrentElectricityLab />;

      case "magnetic-effects":
      case "magnetic-effects-of-current":
      case "magnetic-effect-of-current":
        return <MagneticEffectsLab />;

      case "modern-physics":
      case "modern-physics-and-electronics":
        return <ModernPhysicsLab />;

      case "physics-to-save-life":
      case "life-and-physics":
        return <PhysicsToSaveLifeLab />;

      // Chemistry
      case "concept-of-chemistry":
      case "concepts-of-chemistry":
        return <HazardSymbolsLab />;

      case "states-of-matter":
      case "state-of-matter":
        return <StatesOfMatterLab />;

      case "structure-of-matter":
        return <AtomStructureLab />;

      case "periodic-table":
        return <PeriodicTableLab />;

      case "chemical-bonding":
      case "chemical-bond":
        return <ChemicalBondingLab />;

      case "mole-concept":
      case "concept-of-mole":
      case "concept-of-mole-and-chemical-counting":
      case "mole-concept-and-chemical-calculations":
        return <MoleConceptLab />;

      case "chemical-reactions":
      case "chemical-reaction":
        return <ChemicalReactionsLab />;

      case "chemistry-and-energy":
      case "chemistry-energy":
        return <ChemistryAndEnergyLab />;

      case "acid-base-balance":
      case "acid-base":
        return <AcidBaseBalanceLab />;

      case "mineral-resources-metal":
      case "mineral-resources-metal-nonmetal":
      case "mineral-resources-metals-nonmetals":
      case "mineral-resources-metal-and-nonmetal":
      case "mineral-resources-metals-and-nonmetals":
      case "mineral-resources":
        return <MineralResourcesMetalLab />;

      case "mineral-resources-fossils":
      case "mineral-resources-fossil":
      case "mineral-resources-fossil-fuels":
      case "fossils":
        return <MineralResourcesFossilsLab />;

      case "chemistry-in-our-life":
      case "chemistry-in-our-lives":
      case "chemistry-in-everyday-life":
      case "chemistry-in-daily-life":
      case "chemistry-in-life":
      case "everyday-chemistry":
      case "chemistry-and-life":
      case "chemistry-life":
        return <ChemistryInOurLifeLab />;

      // Biology
      case "lessons-on-life":
      case "lesson-on-life":
      case "life-lessons":
        return <LessonsOnLifeLab />;

      case "cells-and-tissues":
      case "cell-and-tissue":
      case "cells-and-tissues-of-organisms":
        return <CellsAndTissuesLab />;

      case "cells-and-tissues-3d":
        return <CellThreeDExplorer />;

      case "cell-division":
      case "cell-divisions":
        return <CellDivisionLab />;

      case "bioenergetics":
      case "bio-energetics":
      case "life-energy":
        return <BioenergeticsLab />;

      case "food-nutrition-and-digestion":
      case "food-nutrition-digestion":
      case "nutrition-and-digestion":
        return <FoodNutritionDigestionLab />;

      case "transport-in-organisms":
      case "transport-in-organism":
      case "transportation-in-organisms":
        return <TransportInOrganismsLab />;

      case "exchange-of-gases":
      case "exchange-of-gas":
      case "gaseous-exchange":
        return <ExchangeOfGasesLab />;

      case "excretion-in-organisms":
      case "excretion":
      case "excretion-in-organism":
      case "excretion-process":
      case "excretory-system":
        return <ExcretionLab />;

      case "support-and-movement-in-organisms":
      case "support-and-movement":
      case "locomotion-and-movement":
      case "support-and-locomotion":
      case "firmness-and-locomotion":
        return <SupportAndMovementLab />;

        case "coordination":
      case "coordination-in-organisms":
      case "coordination-in-organism":
        return <CoordinationLab />;
        // 
        case "environment-of-life":
      case "environment-of-organisms":
      case "organisms-and-environment":
      case "ecosystem":
        return <EnvironmentOfLifeLab />;
        case "heredity":
     



        case "reproduction":
      case "reproduction-in-organisms":
      case "reproduction-in-organism":
        return <ReproductionLab />;
        // 
        case "heredity":
      case "heredity-and-evolution":
      case "heredity-in-organisms-and-evolution":
      case "heredity-in-organisms":
        return <HeredityLab />;
        // 
        case "biotechnology":
      case "bio-technology":
        return <BiotechnologyLab />;


      default:
        return (
          <UniversalLabEngine
            chapterSlug={chapterSlug}
            chapterTitle={chapter.title}
            subjectId={subject.id}
          />
        );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      {/* HEADER */}
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <Link
            href={`/${subject.id}`}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{subject.nameBn}-এর সব অধ্যায়ে ফিরে যাও</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {chapter.title}
          </h1>
        </div>

        {/* NAVIGATION TABS */}
        <div
          role="tablist"
          aria-label="অধ্যায় নেভিগেশন"
          className="flex flex-wrap gap-2 self-start rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:self-auto"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? tab.activeClass
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* TAB CONTENT */}
      <div role="tabpanel">
        {activeTab === "lesson" && renderChapterLesson()}
        {activeTab === "lab" && renderChapterLab()}
        {activeTab === "quiz" && (
          <ChapterQuizEngine chapterSlug={chapterSlug} subjectId={subject.id} />
        )}
      </div>
    </main>
  );
}