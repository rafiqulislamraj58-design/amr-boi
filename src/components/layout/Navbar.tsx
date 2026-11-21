
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import {
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Home,
} from 'lucide-react';

const navItems = [
  {
    name: 'পদার্থবিজ্ঞান',
    href: '/physics',
    icon: Atom,
    color: 'blue',
    activeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  {
    name: 'রসায়ন',
    href: '/chemistry',
    icon: FlaskConical,
    color: 'amber',
    activeColor: 'text-amber-600 bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  {
    name: 'জীববিজ্ঞান',
    href: '/biology',
    icon: Dna,
    color: 'emerald',
    activeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isActive = (href: string) => pathname.startsWith(href);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-[0_2px_15px_rgba(15,23,42,0.03)]">

      {/* ================= DESKTOP / MOBILE HEADER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-[68px] flex items-center justify-between gap-3">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              <BookOpen className="w-5 h-5" />

              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                বিজ্ঞান ল্যাব
              </span>

              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-400">
                SCIENCE LEARNING PLATFORM
              </span>
            </div>

            <span className="hidden xl:inline-flex ml-1 text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">
              নবম-দশম শ্রেণি
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1.5">

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 ${
                    active
                      ? item.activeColor
                      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      active ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />

                  {item.name}

                  {active && (
                    <motion.span
                      layoutId="activeNav"
                      className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full ${item.dotColor}`}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Desktop Progress */}
            <Link
              href="/progress"
              aria-current={pathname.startsWith('/progress') ? 'page' : undefined}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-300 ${
                pathname.startsWith('/progress')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-900 border-slate-900 text-white hover:bg-blue-700 hover:border-blue-700 shadow-md shadow-slate-900/10'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              আমার প্রগ্রেস
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION ================= */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Mobile Menu */}
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: 'easeInOut',
              }}
              className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
            >
              <motion.div
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: shouldReduceMotion ? 0 : 0.07,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 py-5"
              >

                {/* Mobile Menu Heading */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      নেভিগেশন মেনু
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      তোমার পছন্দের বিষয় নির্বাচন করো
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    LEARN & EXPLORE
                  </div>
                </motion.div>

                {/* Home Link */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -15 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className={`flex items-center justify-between p-3.5 mb-2 rounded-xl border transition-all ${
                      pathname === '/'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Home className="w-4 h-4 text-blue-600" />
                      </div>

                      <span className="text-sm font-bold">
                        হোম
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </motion.div>

                {/* Subject Links */}
                <div className="space-y-2">

                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <motion.div
                        key={item.href}
                        variants={{
                          hidden: { opacity: 0, x: -15 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                            active
                              ? item.activeColor
                              : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">

                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              active ? 'bg-white/80' : 'bg-slate-50'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <div>
                              <span className="block text-sm font-bold">
                                {item.name}
                              </span>

                              <span className="block text-[10px] text-slate-400 mt-0.5">
                                {item.color === 'blue'
                                  ? 'Physics Learning'
                                  : item.color === 'amber'
                                  ? 'Chemistry Learning'
                                  : 'Biology Learning'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {active && (
                              <span className="text-[9px] font-extrabold">
                                ACTIVE
                              </span>
                            )}

                            <ChevronRight className="w-4 h-4 opacity-50" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress Link */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="mt-4 pt-4 border-t border-slate-100"
                >
                  <Link
                    href="/progress"
                    onClick={closeMenu}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      pathname.startsWith('/progress')
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-slate-900 text-white hover:bg-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                      </div>

                      <div>
                        <span className="block text-sm font-bold">
                          আমার প্রগ্রেস
                        </span>

                        <span className={`block text-[10px] mt-0.5 ${
                          pathname.startsWith('/progress')
                            ? 'text-emerald-600/70'
                            : 'text-slate-400'
                        }`}>
                          তোমার শেখার অগ্রগতি দেখো
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 opacity-60" />
                  </Link>
                </motion.div>

                {/* Footer */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className="flex items-center justify-center gap-2 mt-5 text-[10px] font-semibold text-slate-400"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  বিজ্ঞান ল্যাব · নবম-দশম শ্রেণি
                </motion.div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
