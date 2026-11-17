import type { Metadata } from 'next';
import { Hind_Siliguri, Inter } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'বিজ্ঞান ল্যাব | বাংলা ইন্টারঅ্যাক্টিভ বিজ্ঞান শিক্ষা প্ল্যাটফর্ম',
  description: 'নবম ও দশম শ্রেণির পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের 2D অ্যানিমেশন, 3D মডেল ও ভার্চুয়াল ল্যাব।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-bengali antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}