'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Atom, FlaskConical, Dna, BookOpen, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'পদার্থবিজ্ঞান', href: '/physics', icon: Atom, activeColor: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'রসায়ন', href: '/chemistry', icon: FlaskConical, activeColor: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'জীববিজ্ঞান', href: '/biology', icon: Dna, activeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">বিজ্ঞান ল্যাব</span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
              নবম-দশম শ্রেণি
            </span>
          </div>
        </Link>

        {/* 3 Subjects Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  isActive
                    ? item.activeColor
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Local Progress Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            {/* Local Progress Link */}
        <Link
          href="/progress"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>আমার প্রগ্রেস</span>
        </Link>
          </div>
        </div>
      </div>
    </header>
  );
}