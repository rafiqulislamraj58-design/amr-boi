"use client";

import React, { useState } from "react";
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

//
const WavesAndSoundChapterView = dynamic(
  () => import("@/features/physics/waves-and-sound/WavesAndSoundChapterView"),
  { loading: () => <SectionLoader /> },
);
//
const ReflectionOfLightChapterView = dynamic(
  () =>
    import("@/features/physics/reflection-of-light/ReflectionOfLightChapterView"),
  { loading: () => <SectionLoader /> },
);



const StaticElectricityChapterView = dynamic(
  () => import("@/features/physics/static-electricity/StaticElectricityChapterView"),
  { loading: () => <SectionLoader /> },
);


// 
const CurrentElectricityChapterView = dynamic(
  () => import("@/features/physics/current-electricity/CurrentElectricityChapterView"),
  { loading: () => <SectionLoader /> },
);
// 
const MagneticEffectsChapterView = dynamic(
  () => import("@/features/physics/magnetic-effects/MagneticEffectsChapterView"),
  { loading: () => <SectionLoader /> },
  
);
// 
const ModernPhysicsChapterView = dynamic(
  () => import("@/features/physics/modern-physics/ModernPhysicsChapterView"),
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

const StatesOfMatterChapterView = dynamic(
  () =>
    import("@/features/chemistry/states-of-matter/StatesOfMatterChapterView"),
  { loading: () => <SectionLoader /> },
);

//
const MoleConceptChapterView = dynamic(
  () => import("@/features/chemistry/mole-concept/MoleConceptChapterView"),
  { loading: () => <SectionLoader /> },
);
//

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

const ReflectionOfLightLab = dynamic(
  () => import("@/features/physics/reflection-of-light/ReflectionOfLightLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const RefractionOfLightLab = dynamic(
  () => import("@/features/physics/refraction-of-light/RefractionOfLightLab"),
  { loading: () => <SectionLoader />, ssr: false },
);



const RefractionOfLightChapterView = dynamic(
  () =>
    import("@/features/physics/refraction-of-light/RefractionOfLightChapterView"),
  { loading: () => <SectionLoader /> },
);



// 
const StaticElectricityLab = dynamic(
  () => import("@/features/physics/static-electricity/StaticElectricityLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const CurrentElectricityLab = dynamic(
  () => import("@/features/physics/current-electricity/CurrentElectricityLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const MagneticEffectsLab = dynamic(
  () => import("@/features/physics/magnetic-effects/MagneticEffectsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const ModernPhysicsLab = dynamic(
  () => import("@/features/physics/modern-physics/ModernPhysicsLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
// 
const PhysicsToSaveLifeChapterView = dynamic(
  () => import("@/features/physics/physics-to-save-life/PhysicsToSaveLifeChapterView"),
  { loading: () => <SectionLoader /> },
);
// 
const PhysicsToSaveLifeLab = dynamic(
  () => import("@/features/physics/physics-to-save-life/PhysicsToSaveLifeLab"),
  { loading: () => <SectionLoader />, ssr: false },
);



// ============================================
// CHEMISTRY & BIOLOGY LABS
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

//
const MoleConceptLab = dynamic(
  () => import("@/features/chemistry/mole-concept/MoleConceptLab"),
  { loading: () => <SectionLoader />, ssr: false },
);
//
const WavesAndSoundLab = dynamic(
  () => import("@/features/physics/waves-and-sound/WavesAndSoundLab"),
  { loading: () => <SectionLoader />, ssr: false },
);

const CellThreeDExplorer = dynamic(
  () => import("@/features/biology/CellThreeDExplorer"),
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
      //

      case "waves-and-sound":
      case "wave-and-sound":
      case "waves":
        return <WavesAndSoundChapterView />;
      //
      case "reflection-of-light":
      case "light-reflection":
        return <ReflectionOfLightChapterView />;
      //
      case "refraction-of-light":
      case "light-refraction":
        return <RefractionOfLightChapterView />;
        // 
        case "static-electricity":
      case "electrostatics":
        return <StaticElectricityChapterView />;
        // 
        case "current-electricity":
      case "electricity":
        return <CurrentElectricityChapterView />;
        // 
         case "magnetic-effects":
      case "magnetic-effects-of-current":
      case "magnetic-effect-of-current":
        return <MagneticEffectsChapterView />;
        case "modern-physics":
      case "modern-physics-and-electronics":
        return <ModernPhysicsChapterView />;
        // 
        case "physics-to-save-life":
      case "life-and-physics":
        return <PhysicsToSaveLifeChapterView />;
        // 

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

      // Biology
      case "cells-and-tissues":
        return <CellThreeDExplorer />;

      default:
        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              {chapter.title}
            </h2>
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
      //
      case "reflection-of-light":
      case "light-reflection":
        return <ReflectionOfLightLab />;
      //
      case "refraction-of-light":
      case "light-refraction":
        return <RefractionOfLightLab />;
        // 
case "static-electricity":
      case "electrostatics":
        return <StaticElectricityLab />;
        // 
        case "current-electricity":
      case "electricity":
        return <CurrentElectricityLab />;
        // 
        case "magnetic-effects":
      case "magnetic-effects-of-current":
      case "magnetic-effect-of-current":
        return <MagneticEffectsLab />;
        // 
        case "modern-physics":
      case "modern-physics-and-electronics":
        return <ModernPhysicsLab />;
        // 
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

      //
      case "waves-and-sound":
      case "wave-and-sound":
      case "waves":
        return <WavesAndSoundLab />;

      // Biology
      case "cells-and-tissues":
        return <CellThreeDExplorer />;

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
