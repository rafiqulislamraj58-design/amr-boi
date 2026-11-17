import Link from 'next/link';
import { SUBJECTS_DATA } from '@/data/subjectsData';
import { Atom, FlaskConical, Dna, ArrowRight, PlayCircle, Box, FlaskRound, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  const subjects = Object.values(SUBJECTS_DATA);

  const getSubjectIcon = (id: string) => {
    if (id === 'physics') return <Atom className="w-8 h-8 text-blue-600" />;
    if (id === 'chemistry') return <FlaskConical className="w-8 h-8 text-amber-600" />;
    return <Dna className="w-8 h-8 text-emerald-600" />;
  };

  return (
    <main className="flex-1">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>READ → WATCH → EXPLORE → EXPERIMENT → MASTER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            দেখে, বুঝে ও নিজে পরীক্ষা করে <span className="text-blue-600">বিজ্ঞান শেখো</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-8">
            নবম ও দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের ৪০টি অধ্যায়ের 2D অ্যানিমেশন, ইন্টারঅ্যাক্টিভ 3D মডেল এবং ভার্চুয়াল ল্যাবরেটরি—সম্পূর্ণ বিনামূল্যে এবং কোনো লগইন ছাড়াই।
          </p>
        </div>
      </section>

      {/* 3 Main Subjects Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">তোমার বিষয় নির্বাচন করো</h2>
            <p className="text-slate-600 text-sm mt-1">৩টি প্রধান বিজ্ঞান বিষয়ের অধ্যায়ভিত্তিক ইন্টারঅ্যাক্টিভ ল্যাব</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/${subject.id}`}
              className={`group bg-white rounded-2xl p-6 border-2 border-slate-200 transition-all duration-200 hover:shadow-lg flex flex-col justify-between ${subject.cardBorderClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getSubjectIcon(subject.id)}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${subject.badgeClass}`}>
                    {subject.chapterCount} টি অধ্যায়
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:underline">
                  {subject.nameBn}
                </h3>
                <p className="text-xs font-sans text-slate-400 uppercase tracking-wider font-semibold mb-3">
                  {subject.nameEn}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {subject.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>অধ্যায়গুলো দেখো</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pilot Interactive Chapters Highlight */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-md">
              Pilot Interactive Labs
            </span>
            <h2 className="text-2xl font-bold mt-2">সরাসরি ইন্টারঅ্যাক্টিভ ল্যাব দিয়ে শুরু করো</h2>
            <p className="text-slate-400 text-sm mt-1">
              আমাদের প্রধান ৩টি বিষয়ের বিশেষ ইন্টারঅ্যাক্টিভ অধ্যায়গুলো নিজে চালিয়ে দেখো
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/physics/motion"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-5 transition-all"
            >
              <span className="text-xs text-blue-400 font-semibold">পদার্থবিজ্ঞান • অধ্যায় ২</span>
              <h3 className="text-lg font-bold mt-1 mb-2">গতি (Motion Simulation)</h3>
              <p className="text-xs text-slate-300 mb-4">
                গাড়ির বেগ ও ত্বরণ পরিবর্তন করে রিয়েল-টাইম ক্যানভাস সিমুলেশন ও দূরত্ব-সময় গ্রাফ পরীক্ষা করো।
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-blue-400" /> 2D Sim</span>
                <span className="flex items-center gap-1"><FlaskRound className="w-3.5 h-3.5 text-blue-400" /> Live Graph</span>
              </div>
            </Link>

            <Link
              href="/chemistry/structure-of-matter"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-5 transition-all"
            >
              <span className="text-xs text-amber-400 font-semibold">রসায়ন • অধ্যায় ৩</span>
              <h3 className="text-lg font-bold mt-1 mb-2">পদার্থের গঠন (3D Atom)</h3>
              <p className="text-xs text-slate-300 mb-4">
                বোর পরমাণু মডেল, ইলেকট্রন বিন্যাস এবং প্রোটন-নিউট্রন-ইলেকট্রনের 3D গঠন ঘুরিয়ে দেখো।
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Box className="w-3.5 h-3.5 text-amber-400" /> 3D Model</span>
                <span className="flex items-center gap-1"><FlaskRound className="w-3.5 h-3.5 text-amber-400" /> Atom Builder</span>
              </div>
            </Link>

            <Link
              href="/biology/cells-and-tissues"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-5 transition-all"
            >
              <span className="text-xs text-emerald-400 font-semibold">জীববিজ্ঞান • অধ্যায় ২</span>
              <h3 className="text-lg font-bold mt-1 mb-2">জীবকোষ ও টিস্যু (3D Cell)</h3>
              <p className="text-xs text-slate-300 mb-4">
                মাইটোকন্ড্রিয়া, নিউক্লিয়াস ও উদ্ভিদ কোষের বিভিন্ন অঙ্গাণুতে ক্লিক করে ভেতরের গঠন এক্সপ্লোর করো।
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Box className="w-3.5 h-3.5 text-emerald-400" /> 3D Explore</span>
                <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-emerald-400" /> Animation</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}