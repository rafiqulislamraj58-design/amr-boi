'use client';

import React, { useState } from 'react';
import { SubjectId } from '@/types/curriculum';
import { saveQuizResult } from '@/database/progressDb';
import { CheckCircle2, XCircle, RotateCcw, Award, AlertTriangle, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topicTag: string;
  explanation: string;
}

const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  motion: [
    {
      id: 'm1',
      question: 'সময়ের সাথে অসম বেগের পরিবর্তনের হারকে কী বলে?',
      options: ['দ্রুতি (Speed)', 'সরণ (Displacement)', 'ত্বরণ (Acceleration)', 'ভরবেগ (Momentum)'],
      correctIndex: 2,
      topicTag: 'ত্বরণের সংজ্ঞা',
      explanation: 'সময়ের সাথে বস্তুর অসম বেগের পরিবর্তনের হারকে ত্বরণ (a) বলে।',
    },
    {
      id: 'm2',
      question: 'স্থির অবস্থান (u = 0) থেকে 2 m/s² সমত্বরণে চললে 5 সেকেন্ড পর গাড়ির শেষবেগ (v) কত হবে?',
      options: ['5 m/s', '10 m/s', '15 m/s', '25 m/s'],
      correctIndex: 1,
      topicTag: 'গতির গাণিতিক সূত্র (v = u + at)',
      explanation: 'v = u + at সূত্রানুসারে, v = 0 + (2 × 5) = 10 m/s।',
    },
    {
      id: 'm3',
      question: 'সুষম বেগে চলমান কোনো গাড়ির ত্বরণের মান কত?',
      options: ['সর্বোচ্চ', 'শূন্য (0)', '9.8 m/s²', 'ঋণাত্মক'],
      correctIndex: 1,
      topicTag: 'সুষম বেগ ও ত্বরণ',
      explanation: 'বেগের পরিবর্তন না হলে ত্বরণ থাকে না, তাই সুষম বা সমবেগে ত্বরণ সর্বদা শূন্য (0)।',
    },
  ],
  'structure-of-matter': [
    {
      id: 'c1',
      question: '2n² সূত্রানুসারে পরমাণুর ২য় শক্তিস্তরে (L শেল) সর্বোচ্চ কয়টি ইলেকট্রন থাকতে পারে?',
      options: ['2 টি', '8 টি', '18 টি', '32 টি'],
      correctIndex: 1,
      topicTag: 'ইলেকট্রন বিন্যাস (2n²)',
      explanation: 'L কক্ষপথের জন্য n = 2। সুতরাং 2 × (2)² = 8 টি ইলেকট্রন থাকতে পারে।',
    },
    {
      id: 'c2',
      question: 'কার্বন পরমাণুতে ৬টি প্রোটন ও ৬টি নিউট্রন থাকলে এর ভরসংখ্যা (A) কত?',
      options: ['6', '12', '14', '18'],
      correctIndex: 1,
      topicTag: 'ভরসংখ্যা ও নিউক্লিয়াস',
      explanation: 'ভরসংখ্যা (A) = প্রোটন সংখ্যা (Z) + নিউট্রন সংখ্যা (N) = 6 + 6 = 12।',
    },
  ],
  'cells-and-tissues': [
    {
      id: 'b1',
      question: 'কোন অঙ্গাণুটিকে কোষের "পাওয়ার হাউস" বা শক্তিঘর বলা হয়?',
      options: ['নিউক্লিয়াস', 'রাইবোজোম', 'মাইটোকন্ড্রিয়া', 'গলজি বস্তু'],
      correctIndex: 2,
      topicTag: 'মাইটোকন্ড্রিয়ার কাজ',
      explanation: 'মাইটোকন্ড্রিয়ায় শ্বসন প্রক্রিয়ায় ক্রেবস চক্র ও ATP শক্তি উৎপন্ন হয় বলে একে কোষের শক্তিঘর বলে।',
    },
    {
      id: 'b2',
      question: 'উদ্ভিদ কোষের কোন অঙ্গাণুটি সূর্যালোকের সাহায্যে শর্করা খাদ্য প্রস্তুত করে?',
      options: ['ক্লোরোপ্লাস্ট', 'কোষ গহ্বর', 'সেন্ট্রোজোম', 'লাইসোজোম'],
      correctIndex: 0,
      topicTag: 'প্লাস্টিড ও সালোকসংশ্লেষণ',
      explanation: 'সবুজ বর্ণের ক্লোরোপ্লাস্ট সালোকসংশ্লেষণ প্রক্রিয়ায় খাদ্য তৈরি করে।',
    },
  ],
};

interface Props {
  chapterSlug: string;
  subjectId: SubjectId;
}

export default function ChapterQuizEngine({ chapterSlug, subjectId }: Props) {
  const questions = QUIZ_BANK[chapterSlug] || QUIZ_BANK['motion'];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // একবার উত্তর দিলে লক হয়ে যাবে
    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWeakTopics((prev) => Array.from(new Set([...prev, currentQ.topicTag])));
    }
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      await saveQuizResult(chapterSlug, subjectId, score, questions.length, weakTopics);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setWeakTopics([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900">কুইজ সম্পন্ন হয়েছে!</h3>
          <p className="text-slate-500 text-sm mt-1">তোমার ফলাফল ব্রাউজারের লোকাল ডাটাবেসে সংরক্ষিত হয়েছে</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">প্রাপ্ত স্কোর</span>
            <p className="text-2xl font-bold text-slate-900 font-sans">
              {score} / {questions.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-700">সঠিকতার হার</span>
            <p className="text-2xl font-bold text-emerald-700 font-sans">{accuracy}%</p>
          </div>
        </div>

        {/* Weak Topics Detection */}
        {weakTopics.length > 0 && (
          <div className="text-left p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>পুনরায় রিভিশন দেওয়ার পরামর্শ (Weak Topics):</span>
            </div>
            <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
              {weakTopics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> আবার অনুশীলন করো
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
          প্রশ্ন {currentIdx + 1} / {questions.length}
        </span>
        <span className="text-xs font-medium text-slate-500">টপিক: {currentQ.topicTag}</span>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{currentQ.question}</h3>

      <div className="space-y-3">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';
          if (selectedOption !== null) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
            } else if (isSelected) {
              btnStyle = 'border-red-400 bg-red-50 text-red-950';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 rounded-xl border font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{option}</span>
              {selectedOption !== null && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {selectedOption !== null && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Explanation */}
      {selectedOption !== null && (
        <div className="mt-6 space-y-4">
          <div
            className={`p-4 rounded-xl text-sm border ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <p className="font-bold mb-1">
              {selectedOption === currentQ.correctIndex ? 'সঠিক উত্তর!' : 'উত্তরটি সঠিক নয়।'}
            </p>
            <p>{currentQ.explanation}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <span>{currentIdx + 1 < questions.length ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখো'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}