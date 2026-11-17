'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUBJECTS_DATA } from '@/data/subjectsData';
import { Search, ArrowRight } from 'lucide-react';

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');

  const allChapters = Object.values(SUBJECTS_DATA).flatMap((sub) =>
    sub.chapters.map((ch) => ({
      ...ch,
      subjectId: sub.id,
      subjectNameBn: sub.nameBn,
      badgeClass: sub.badgeClass,
    }))
  );

  const filtered =
    query.trim().length > 0
      ? allChapters.filter(
          (ch) =>
            ch.title.toLowerCase().includes(query.toLowerCase()) ||
            ch.titleEn.toLowerCase().includes(query.toLowerCase()) ||
            ch.description.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div className="max-w-xl mx-auto relative text-left">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="অধ্যায় বা টপিক খুঁজো (যেমন: গতি, Motion, পরমাণু, কোষ, তড়িৎ)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none text-sm sm:text-base shadow-xs transition-all"
        />
      </div>

      {query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 max-h-80 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">কোনো অধ্যায় পাওয়া যায়নি।</p>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                href={`/${item.subjectId}/${item.slug}`}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                    {item.subjectNameBn} • অধ্যায় {item.chapterNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    {item.title} ({item.titleEn})
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}