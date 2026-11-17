'use client';

import katex from 'katex';

interface FormulaBoxProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export default function FormulaBox({ formula, block = false, className = '' }: FormulaBoxProps) {
  const html = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: block,
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}