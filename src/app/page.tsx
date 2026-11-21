
'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  Atom,
  FlaskConical,
  Dna,
  ArrowRight,
  PlayCircle,
  Sparkles,
  BookOpen,
  Microscope,
  GraduationCap,
  MoveUpRight,
  Zap,
  ChevronRight,
  Orbit,
  Telescope,
  Beaker,
  Brain,
  Lightbulb,
  Star,
  Layers,
  Activity,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { SUBJECTS_DATA } from '@/data/subjectsData';

// ============================================
// ANIMATION COMPONENTS
// ============================================

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const learningSteps = [
  { label: 'পড়ো', en: 'READ', icon: BookOpen },
  { label: 'দেখো', en: 'WATCH', icon: PlayCircle },
  { label: 'অন্বেষণ করো', en: 'EXPLORE', icon: Telescope },
  { label: 'পরীক্ষা করো', en: 'EXPERIMENT', icon: FlaskConical },
  { label: 'দক্ষ হও', en: 'MASTER', icon: GraduationCap },
];

const labs = [
  {
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'অধ্যায় ২',
    title: 'গতি',
    subtitle: 'Motion Simulation',
    description:
      'বেগ, ত্বরণ ও সময় পরিবর্তন করে গাড়ির গতি নিজে নিয়ন্ত্রণ করো। রিয়েল-টাইম গ্রাফে গতির পরিবর্তন পর্যবেক্ষণ করো।',
    href: '/physics/motion',
    icon: Atom,
    color: 'blue',
    features: ['2D Simulation', 'Live Graph'],
    number: '01',
  },
  {
    subject: 'রসায়ন',
    chapter: 'অধ্যায় ৩',
    title: 'পদার্থের গঠন',
    subtitle: '3D Atom Explorer',
    description:
      'বোর পরমাণু মডেল, ইলেকট্রন বিন্যাস এবং প্রোটন-নিউট্রনের গঠন 3D মডেলে ঘুরিয়ে দেখো।',
    href: '/chemistry/structure-of-matter',
    icon: FlaskConical,
    color: 'amber',
    features: ['3D Model', 'Atom Builder'],
    number: '02',
  },
  {
    subject: 'জীববিজ্ঞান',
    chapter: 'অধ্যায় ২',
    title: 'জীবকোষ ও টিস্যু',
    subtitle: '3D Cell Explorer',
    description:
      'নিউক্লিয়াস, মাইটোকন্ড্রিয়া ও কোষের বিভিন্ন অঙ্গাণুর গঠন ইন্টারঅ্যাক্টিভ 3D মডেলে আবিষ্কার করো।',
    href: '/biology/cells-and-tissues',
    icon: Dna,
    color: 'emerald',
    features: ['3D Explore', 'Animation'],
    number: '03',
  },
];

const colorStyles = {
  blue: {
    icon: 'bg-blue-500/10 text-blue-400',
    label: 'text-blue-400',
    hover: 'group-hover:border-blue-500/50',
    glow: 'from-blue-500/15',
    feature: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    line: 'bg-blue-400',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400',
    label: 'text-amber-400',
    hover: 'group-hover:border-amber-500/50',
    glow: 'from-amber-500/15',
    feature: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    line: 'bg-amber-400',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    label: 'text-emerald-400',
    hover: 'group-hover:border-emerald-500/50',
    glow: 'from-emerald-500/15',
    feature: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    line: 'bg-emerald-400',
  },
} as const;

const floatingIcons = [
  { Icon: Atom, top: '12%', left: '8%', size: 45, delay: 0 },
  { Icon: Dna, top: '25%', right: '8%', size: 48, delay: 1 },
  { Icon: Beaker, bottom: '15%', left: '12%', size: 40, delay: 2 },
  { Icon: Orbit, bottom: '18%', right: '12%', size: 50, delay: 0.7 },
  { Icon: Brain, top: '55%', left: '3%', size: 35, delay: 1.5 },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const staggerItem = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut' as const,
    },
  },
};

// ============================================
// MAIN HOMEPAGE
// ============================================

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const subjects = Object.values(SUBJECTS_DATA);

  const totalChapters = subjects.reduce(
    (total, subject) => total + subject.chapterCount,
    0
  );

  const getSubjectIcon = (id: string) => {
    const iconClass = 'w-7 h-7';

    switch (id) {
      case 'physics':
        return <Atom className={iconClass} />;
      case 'chemistry':
        return <FlaskConical className={iconClass} />;
      default:
        return <Dna className={iconClass} />;
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Navbar />

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="relative isolate overflow-hidden bg-white border-b border-slate-200">

        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [0, 35, 0],
                    y: [0, 25, 0],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-40 -right-20 w-[550px] h-[550px] rounded-full bg-blue-200/40 blur-[100px]"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [0, -35, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.15, 1],
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-40 -left-20 w-[550px] h-[550px] rounded-full bg-violet-200/40 blur-[110px]"
          />

          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* Floating Science Icons */}
          {floatingIcons.map((item, index) => {
            const Icon = item.Icon;

            return (
              <motion.div
                key={index}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -20, 0],
                        rotate: [0, 12, -12, 0],
                      }
                }
                transition={{
                  duration: 6 + index,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: 'easeInOut',
                }}
                className="absolute hidden md:block text-blue-500/10"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  bottom: item.bottom,
                }}
              >
                <Icon
                  style={{
                    width: item.size,
                    height: item.size,
                  }}
                />
              </motion.div>
            );
          })}

          {/* Decorative Atom */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-20 right-[12%] hidden lg:block text-blue-500/[0.07]"
          >
            <Atom size={170} strokeWidth={0.8} />
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20 sm:pb-28">

          <div className="max-w-4xl mx-auto text-center">

            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 mb-8 shadow-sm"
            >
              <motion.span
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </motion.span>

              <span>THE FUTURE OF SCIENCE LEARNING</span>

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: 'easeOut',
              }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.25] mb-7"
            >
              শুধু মুখস্থ নয়,

              <br />

              <span className="relative inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                বিজ্ঞানকে আবিষ্কার করো!

                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 origin-left"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-8 mb-10"
            >
              নবম ও দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞান
              শেখো 2D Animation, Interactive 3D Model এবং Virtual
              Laboratory-এর মাধ্যমে। পড়ো, দেখো, নিজে পরীক্ষা করো।
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/physics"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-shadow"
                >
                  <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />

                  <span className="relative">শেখা শুরু করো</span>

                  <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/chemistry/structure-of-matter"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/80 backdrop-blur border border-slate-200 text-slate-700 font-bold shadow-sm hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <PlayCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />

                  Interactive Lab দেখো

                  <MoveUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Learning Journey */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center items-center gap-x-5 gap-y-5"
            >
              {learningSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.en}
                    variants={staggerItem}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      whileHover={
                        shouldReduceMotion ? {} : { y: -5, scale: 1.08 }
                      }
                      className="flex items-center gap-2.5 group cursor-default"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-800">
                          {step.label}
                        </p>

                        <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400">
                          {step.en}
                        </p>
                      </div>
                    </motion.div>

                    {index !== learningSteps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      </section>

      {/* =====================================
          STATS SECTION
      ===================================== */}

      <section className="relative z-10 max-w-5xl mx-auto px-4 -mt-1">

        <Reveal>
          <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 divide-x divide-slate-100 overflow-hidden">

            {[
              {
                value: '03',
                label: 'বিজ্ঞান বিষয়',
                icon: Microscope,
              },
              {
                value: totalChapters.toString().padStart(2, '0'),
                label: 'মোট অধ্যায়',
                icon: BookOpen,
              },
              {
                value: 'FREE',
                label: 'সম্পূর্ণ বিনামূল্যে',
                icon: Zap,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  whileHover={
                    shouldReduceMotion ? {} : { backgroundColor: '#f8fafc' }
                  }
                  className="text-center py-6 px-2 sm:py-8 group transition-colors"
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 8 }}
                    className="inline-flex"
                  >
                    <Icon className="w-5 h-5 mx-auto mb-3 text-blue-600" />
                  </motion.div>

                  <h3 className="text-xl sm:text-3xl font-black text-slate-900">
                    {stat.value}
                  </h3>

                  <p className="text-[10px] sm:text-sm text-slate-500 mt-2 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* =====================================
          SUBJECTS SECTION
      ===================================== */}

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">

            <div>
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-[0.2em] mb-4">
                <span className="w-8 h-0.5 bg-blue-600" />
                Explore Subjects
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                তোমার বিষয় নির্বাচন করো
              </h2>

              <p className="text-slate-500 mt-3 text-sm sm:text-base leading-7">
                প্রতিটি বিষয় শেখো অধ্যায়ভিত্তিক ইন্টারঅ্যাক্টিভ অভিজ্ঞতায়।
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Layers className="w-4 h-4 text-blue-500" />
              {subjects.length} টি বিষয় উপলব্ধ
            </div>
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              variants={staggerItem}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -10,
                      transition: { duration: 0.3 },
                    }
              }
              className="h-full"
            >
              <Link
                href={`/${subject.id}`}
                className={`group relative flex h-full flex-col overflow-hidden bg-white rounded-2xl border-2 border-slate-200 p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 ${subject.cardBorderClass}`}
              >
                {/* Background Glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-100/70 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

                <div className="relative flex flex-col flex-1">

                  <div className="flex justify-between items-center mb-8">

                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : { rotate: 12, scale: 1.12 }
                      }
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                    >
                      {getSubjectIcon(subject.id)}
                    </motion.div>

                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${subject.badgeClass}`}>
                      {subject.chapterCount} টি অধ্যায়
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    {subject.nameBn}
                  </h3>

                  <p className="text-xs font-extrabold tracking-[0.18em] text-slate-400 uppercase mb-4">
                    {subject.nameEn}
                  </p>

                  <p className="text-sm text-slate-600 leading-7 flex-1 mb-8">
                    {subject.description}
                  </p>

                  <div className="pt-5 border-t border-slate-100 flex justify-between items-center">

                    <span className="text-sm font-extrabold text-slate-700 group-hover:text-blue-600 transition-colors">
                      অধ্যায়গুলো দেখো
                    </span>

                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { x: 5 }}
                      className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* =====================================
          INTERACTIVE LABS
      ===================================== */}

      <section className="relative overflow-hidden bg-[#080F20] py-24">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [0, 60, 0],
                    y: [0, 40, 0],
                  }
            }
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                  }
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px]"
          />

          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:25px_25px]" />

          <Atom className="absolute top-10 right-[10%] w-32 h-32 text-white/[0.04]" />
          <Orbit className="absolute bottom-10 left-[8%] w-40 h-40 text-white/[0.04]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">

              <div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
                  <Sparkles className="w-4 h-4" />
                  Interactive Learning Experience
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  শুধু দেখো না,
                  <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 sm:ml-2">
                    নিজে করে শেখো!
                  </span>
                </h2>

                <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl leading-8">
                  ভার্চুয়াল ল্যাবে প্রবেশ করো। বিভিন্ন বৈজ্ঞানিক
                  বিষয় নিজে নিয়ন্ত্রণ করে বাস্তব অভিজ্ঞতা অর্জন করো।
                </p>
              </div>

              <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold tracking-wider">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                EXPLORE AVAILABLE LABS
              </div>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {labs.map((lab) => {
              const Icon = lab.icon;
              const styles = colorStyles[lab.color as keyof typeof colorStyles];

              return (
                <motion.div
                  key={lab.number}
                  variants={staggerItem}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -9,
                          transition: { duration: 0.3 },
                        }
                  }
                >
                  <Link
                    href={lab.href}
                    className={`group relative block h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-7 transition-all duration-300 hover:shadow-2xl ${styles.hover}`}
                  >

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative">

                      <div className="flex items-center justify-between mb-8">

                        <motion.div
                          whileHover={
                            shouldReduceMotion
                              ? {}
                              : { rotate: 15, scale: 1.12 }
                          }
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${styles.icon}`}
                        >
                          <Icon className="w-7 h-7" />
                        </motion.div>

                        <span className="text-4xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                          {lab.number}
                        </span>
                      </div>

                      <p className={`text-xs font-extrabold mb-3 ${styles.label}`}>
                        {lab.subject} · {lab.chapter}
                      </p>

                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-100 transition-colors">
                        {lab.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-bold tracking-wider mb-5">
                        {lab.subtitle}
                      </p>

                      <p className="text-sm text-slate-400 leading-7 mb-7">
                        {lab.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-7">
                        {lab.features.map((feature) => (
                          <span
                            key={feature}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold border ${styles.feature}`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="pt-5 border-t border-slate-800 flex items-center justify-between">

                        <span className="text-sm font-extrabold text-white">
                          ল্যাবে প্রবেশ করো
                        </span>

                        <motion.div
                          whileHover={shouldReduceMotion ? {} : { x: 5, y: -5 }}
                          className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors"
                        >
                          <MoveUpRight className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =====================================
          LEARNING EXPERIENCE STRIP
      ===================================== */}

      <section className="py-20 bg-white border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-indigo-600 text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
                <Lightbulb className="w-4 h-4" />
                Learn Differently
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                শেখার অভিজ্ঞতা হোক আরও বাস্তব!
              </h2>

              <p className="text-slate-500 text-sm mt-3">
                বইয়ের জ্ঞানকে বাস্তব অভিজ্ঞতায় রূপান্তর করো।
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Activity,
                title: 'Visual Learning',
                description: 'জটিল বিষয়গুলো Animation ও Diagram-এর মাধ্যমে সহজে বোঝো।',
                color: 'blue',
              },
              {
                icon: Microscope,
                title: 'Virtual Experiment',
                description: 'নিজেই বিভিন্ন উপাদান নিয়ন্ত্রণ করে পরীক্ষা করে শেখো।',
                color: 'violet',
              },
              {
                icon: Star,
                title: 'Build Your Skills',
                description: 'ধাপে ধাপে ধারণা পরিষ্কার করে নিজের দক্ষতা বাড়াও।',
                color: 'amber',
              },
            ].map((item) => {
              const Icon = item.icon;

              const colors = {
                blue: 'bg-blue-50 text-blue-600',
                violet: 'bg-violet-50 text-violet-600',
                amber: 'bg-amber-50 text-amber-600',
              };

              return (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  whileHover={shouldReduceMotion ? {} : { y: -6 }}
                  className="p-7 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${colors[item.color as keyof typeof colors]}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-7">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =====================================
          FINAL CTA
      ===================================== */}

      <section className="py-24 px-4 bg-slate-50">

        <Reveal>
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 py-16 sm:p-16 text-center shadow-2xl shadow-indigo-900/20">

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        rotate: 360,
                      }
                }
                transition={{
                  duration: 50,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -top-32 -right-20 text-white/[0.06]"
              >
                <Atom size={320} strokeWidth={0.7} />
              </motion.div>

              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
                className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full border-[45px] border-white/10"
              />

              <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
            </div>

            <div className="relative">

              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -8, 0],
                        rotate: [0, 5, -5, 0],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm mb-7"
              >
                <Orbit className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
                বিজ্ঞানের জগতে তোমাকে স্বাগতম!
              </h2>

              <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-8 mb-9">
                আজ থেকেই শুরু হোক তোমার বিজ্ঞান শেখার নতুন যাত্রা।
                কোনো লগইন নয়, কোনো বাধা নয়—শুধু শেখো এবং আবিষ্কার করো।
              </p>

              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="inline-block"
              >
                <Link
                  href="/physics"
                  className="group inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-black hover:bg-blue-50 transition-colors shadow-xl"
                >
                  এখনই শুরু করো

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-3 text-xs text-blue-100/80 font-semibold mt-8">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Free Learning
                </span>

                <span className="hidden sm:block w-1 h-1 rounded-full bg-blue-300" />

                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  No Login Required
                </span>

                <span className="hidden sm:block w-1 h-1 rounded-full bg-blue-300" />

                <span className="flex items-center gap-2">
                  <Atom className="w-3.5 h-3.5" />
                  Interactive Labs
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </main>
  );
}
