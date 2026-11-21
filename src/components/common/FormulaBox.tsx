'use client';

import { useMemo } from 'react';
import katex from 'katex';

interface FormulaBoxProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export default function FormulaBox({
  formula,
  block = false,
  className = '',
}: FormulaBoxProps) {
  const html = useMemo(() => {
    if (!formula?.trim()) return '';

    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: block,
        strict: false,
      });
    } catch {
      return formula;
    }
  }, [formula, block]);

  if (!html) return null;

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-1 ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}