
import Link from 'next/link';
import {
  Atom,
  FlaskConical,
  Dna,
  ArrowRight,
  PlayCircle,
  Box,
  FlaskRound,
  Sparkles,
  BookOpen,
  Microscope,
  GraduationCap,
  MoveUpRight,
  Zap,
  ChevronRight,
  Orbit,
  Telescope,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { SUBJECTS_DATA } from '@/data/subjectsData';

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
    dot: 'bg-blue-400',
    hover: 'group-hover:border-blue-500/40',
    glow: 'from-blue-500/10',
    feature: 'bg-blue-500/10 text-blue-300',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400',
    label: 'text-amber-400',
    dot: 'bg-amber-400',
    hover: 'group-hover:border-amber-500/40',
    glow: 'from-amber-500/10',
    feature: 'bg-amber-500/10 text-amber-300',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    label: 'text-emerald-400',
    dot: 'bg-emerald-400',
    hover: 'group-hover:border-emerald-500/40',
    glow: 'from-emerald-500/10',
    feature: 'bg-emerald-500/10 text-emerald-300',
  },
} as const;

export default function HomePage() {
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="absolute top-20 right-[12%] opacity-10">
            <Atom className="w-40 h-40 text-blue-600" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 mb-7">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>THE FUTURE OF SCIENCE LEARNING</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.3] mb-6">
              শুধু মুখস্থ নয়,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                বিজ্ঞানকে আবিষ্কার করো!
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-8 mb-9">
              নবম ও দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞান
              শেখো 2D Animation, Interactive 3D Model এবং Virtual
              Laboratory-এর মাধ্যমে। পড়ো, দেখো, নিজে পরীক্ষা করো।
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
              <Link
                href="/physics"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                শেখা শুরু করো
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/chemistry/structure-of-matter"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-blue-300 transition-all"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" />
                Interactive Lab দেখো
              </Link>
            </div>

            {/* Learning journey */}
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-4">
              {learningSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.en} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">
                          {step.label}
                        </p>
                        <p className="text-[9px] tracking-widest text-slate-400">
                          {step.en}
                        </p>
                      </div>
                    </div>

                    {index !== learningSteps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 -mt-1">
        <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-white shadow-sm divide-x divide-slate-100">
          {[
            { value: '03', label: 'বিজ্ঞান বিষয়', icon: Microscope },
            { value: totalChapters.toString().padStart(2, '0'), label: 'মোট অধ্যায়', icon: BookOpen },
            { value: 'FREE', label: 'সম্পূর্ণ বিনামূল্যে', icon: Zap },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="text-center py-5 px-2 sm:py-7">
                <Icon className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SUBJECTS ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">
              <span className="w-7 h-0.5 bg-blue-600" />
              Explore Subjects
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              তোমার বিষয় নির্বাচন করো
            </h2>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              প্রতিটি বিষয় শেখো অধ্যায়ভিত্তিক ইন্টারঅ্যাক্টিভ অভিজ্ঞতায়।
            </p>
          </div>

          <span className="text-sm font-semibold text-slate-500">
            {subjects.length} টি বিষয় উপলব্ধ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/${subject.id}`}
              className={`group relative overflow-hidden bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${subject.cardBorderClass}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-50/70 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex justify-between items-center mb-7">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform">
                    {getSubjectIcon(subject.id)}
                  </div>

                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${subject.badgeClass}`}>
                    {subject.chapterCount} টি অধ্যায়
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {subject.nameBn}
                </h3>

                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
                  {subject.nameEn}
                </p>

                <p className="text-sm text-slate-600 leading-7 min-h-14 mb-7">
                  {subject.description}
                </p>

                <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    অধ্যায়গুলো দেখো
                  </span>

                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= INTERACTIVE LABS ================= */}
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" />
                Interactive Learning Experience
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                শুধু দেখো না, নিজে করে শেখো!
              </h2>

              <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl leading-7">
                ভার্চুয়াল ল্যাবে প্রবেশ করো। বিভিন্ন বৈজ্ঞানিক
                বিষয় নিজে নিয়ন্ত্রণ করে বাস্তব অভিজ্ঞতা অর্জন করো।
              </p>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              EXPLORE AVAILABLE LABS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {labs.map((lab) => {
              const Icon = lab.icon;
              const styles = colorStyles[lab.color as keyof typeof colorStyles];

              return (
                <Link
                  key={lab.number}
                  href={lab.href}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/80 ${styles.hover}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-7">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="text-3xl font-black text-slate-800">
                        {lab.number}
                      </span>
                    </div>

                    <p className={`text-xs font-bold mb-2 ${styles.label}`}>
                      {lab.subject} · {lab.chapter}
                    </p>

                    <h3 className="text-xl font-bold text-white mb-1">
                      {lab.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-semibold tracking-wide mb-4">
                      {lab.subtitle}
                    </p>

                    <p className="text-sm text-slate-400 leading-7 mb-6">
                      {lab.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {lab.features.map((feature) => (
                        <span
                          key={feature}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${styles.feature}`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        ল্যাবে প্রবেশ করো
                      </span>

                      <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                        <MoveUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 px-6 py-12 sm:p-14 text-center">
          <div className="absolute -top-20 -right-10 w-64 h-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-32 -left-10 w-72 h-72 rounded-full border-[45px] border-white/5" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-6">
              <Orbit className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              বিজ্ঞানের জগতে তোমাকে স্বাগতম!
            </h2>

            <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-7 mb-8">
              আজ থেকেই শুরু হোক তোমার বিজ্ঞান শেখার নতুন যাত্রা।
              কোনো লগইন নয়, কোনো বাধা নয়—শুধু শেখো এবং আবিষ্কার করো।
            </p>

            <Link
              href="/physics"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-extrabold hover:bg-blue-50 hover:-translate-y-1 transition-all shadow-lg"
            >
              এখনই শুরু করো
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-blue-200 mt-5">
              Free Learning · No Login Required · Interactive Labs
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
