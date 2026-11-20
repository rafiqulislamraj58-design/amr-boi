'use client';

import React from 'react';
import FormulaBox from './FormulaBox';

interface MathTextProps {
  text: string;
  className?: string;
}

export default function MathText({ text, className = '' }: MathTextProps) {
 
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1); // শুরু ও শেষের $ বাদ দেওয়া হলো
          return <FormulaBox key={index} formula={latex} className="mx-0.5" />;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}