
'use client';

import React from 'react';

interface Props {
  selectedId: string;
  showMarkers: boolean;
  onSelect: (id: string) => void;
}

const parts = [
  { id: 'nucleus', x: 440, y: 256 },
  { id: 'vacuole', x: 300, y: 270 },
  { id: 'mitochondria', x: 480, y: 110 },
  { id: 'chloroplast', x: 210, y: 365 },
  { id: 'golgi', x: 485, y: 190 },
  { id: 'er', x: 475, y: 230 },
  { id: 'cellwall', x: 350, y: 40 },
  { id: 'membrane', x: 515, y: 350 },
  { id: 'cytoplasm', x: 380, y: 440 },
];

export default function PlantCellDiagram({
  selectedId,
  showMarkers,
  onSelect,
}: Props) {
  return (
    <svg
      viewBox="0 0 800 542"
      className="w-full h-full select-none"
      role="img"
      aria-label="Interactive plant cell diagram"
    >
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9e7a1" />
          <stop offset="100%" stopColor="#77965b" />
        </linearGradient>

        <linearGradient id="cyto" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3ef9b" />
          <stop offset="100%" stopColor="#c5d878" />
        </linearGradient>

        <linearGradient id="vacuole" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c6f3d0" />
          <stop offset="100%" stopColor="#83d8a7" />
        </linearGradient>

        <radialGradient id="nucleus">
          <stop offset="0%" stopColor="#d9a5ef" />
          <stop offset="100%" stopColor="#9860c1" />
        </radialGradient>

        <filter id="shadow">
          <feDropShadow dx="2" dy="3" stdDeviation="4"
            floodColor="#334155" floodOpacity=".25" />
        </filter>
      </defs>

      {/* Cell wall */}
      <path
        d="M260 48 Q180 60 170 145
           L158 360 Q160 460 245 480
           Q400 520 510 455
           Q570 410 560 300
           L555 135 Q540 50 440 40
           Q340 20 260 48Z"
        fill="url(#wall)"
        stroke="#526c43"
        strokeWidth="9"
        filter="url(#shadow)"
      />

      {/* Cell membrane */}
      <path
        d="M263 59 Q190 70 180 150
           L170 355 Q174 447 250 466
           Q400 500 500 444
           Q548 400 548 300
           L545 140 Q530 65 440 53
           Q340 34 263 59Z"
        fill="url(#cyto)"
        stroke="#e8f5cf"
        strokeWidth="5"
      />

      {/* Cytoplasm */}
      <path
        d="M250 75 Q205 95 200 165
           L190 355 Q195 425 265 448
           Q390 480 490 425
           Q530 380 530 300
           L525 155 Q515 85 440 70Z"
        fill="#dce99b"
        opacity=".75"
      />

      {/* Central vacuole */}
      <path
        d="M270 175
           Q260 130 300 125
           Q360 110 385 145
           Q420 170 405 215
           L410 330
           Q400 385 350 395
           Q295 400 270 365
           Q245 330 260 280Z"
        fill="url(#vacuole)"
        stroke="#5eaa82"
        strokeWidth="5"
        filter="url(#shadow)"
      />

      {/* Nucleus */}
      <ellipse
        cx="445" cy="270" rx="57" ry="65"
        fill="url(#nucleus)"
        stroke="#724397"
        strokeWidth="5"
      />

      {/* Nucleolus */}
      <ellipse
        cx="455" cy="263" rx="17" ry="19"
        fill="#743b9e"
      />

      {/* Chromatin */}
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <path
          key={n}
          d={`M${420 + n * 7} ${230 + n * 7}
              q 20 10 5 30`}
          fill="none"
          stroke="#e6c5fa"
          strokeWidth="3"
        />
      ))}

      {/* Chloroplasts */}
      {[
        [215, 150], [210, 365], [385, 445], [480, 115]
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(-25)`}>
          <ellipse
            rx="29" ry="16"
            fill="#16834b"
            stroke="#075c35"
            strokeWidth="3"
          />
          {[-8, 0, 8].map((v) => (
            <path
              key={v}
              d={`M-17 ${v} Q0 ${v - 5} 18 ${v}`}
              fill="none"
              stroke="#9be5a8"
              strokeWidth="3"
            />
          ))}
        </g>
      ))}

      {/* Mitochondria */}
      {[
        [270, 110], [480, 385], [220, 270]
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(25)`}>
          <ellipse
            rx="23" ry="13"
            fill="#b87939"
            stroke="#805025"
            strokeWidth="3"
          />
          <path
            d="M-16 0 Q-8 -12 0 2 T16 0"
            fill="none"
            stroke="#f4d39a"
            strokeWidth="3"
          />
        </g>
      ))}

      {/* Golgi body */}
      <g transform="translate(475 190)">
        {[0, 1, 2, 3, 4].map((n) => (
          <path
            key={n}
            d={`M-30 ${n * 10} Q0 ${n * 10 - 12} 30 ${n * 10}`}
            fill="none"
            stroke="#b477a7"
            strokeWidth="7"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Endoplasmic Reticulum */}
      <g fill="none" stroke="#7778b7" strokeWidth="6">
        <path d="M410 195 Q385 175 420 160 Q455 145 480 170" />
        <path d="M405 207 Q385 190 420 180 Q455 165 490 190" />
        <path d="M405 220 Q385 205 420 195 Q455 180 485 205" />
      </g>

      {/* Ribosomes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle
          key={i}
          cx={400 + (i % 6) * 12}
          cy={165 + Math.floor(i / 6) * 12}
          r="3"
          fill="#55427d"
        />
      ))}

      {/* Scientific labels */}
      <g
        fill="#334155"
        fontSize="15"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        <text x="590" y="60">কোষপ্রাচীর</text>
        <text x="590" y="100">কোষঝিল্লি</text>
        <text x="590" y="145">ক্লোরোপ্লাস্ট</text>
        <text x="590" y="190">এন্ডোপ্লাজমিক জালিকা</text>
        <text x="590" y="230">গলজি বডি</text>
        <text x="590" y="275">নিউক্লিয়াস</text>
        <text x="590" y="315">নিউক্লিওলাস</text>
        <text x="590" y="360">মাইটোকন্ড্রিয়া</text>
        <text x="590" y="410">সাইটোপ্লাজম</text>
        <text x="45" y="260">কোষ গহ্বর</text>
      </g>

      {/* Label connector lines */}
      <g
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.8"
      >
        <path d="M440 40 L555 55 L580 55" />
        <path d="M540 100 L580 95" />
        <path d="M480 115 L555 140 L580 140" />
        <path d="M470 180 L555 185 L580 185" />
        <path d="M500 190 L560 225 L580 225" />
        <path d="M500 270 L580 270" />
        <path d="M455 263 L555 310 L580 310" />
        <path d="M480 385 L555 355 L580 355" />
        <path d="M380 440 L555 405 L580 405" />
        <path d="M270 270 L130 260 L135 260" />
      </g>

      {/* Interactive hotspots */}
      {showMarkers && parts.map((part, index) => {
        const active = selectedId === part.id;

        return (
          <g
            key={part.id}
            onClick={() => onSelect(part.id)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={part.id}
          >
            <circle
              cx={part.x}
              cy={part.y}
              r="18"
              fill={active ? '#059669' : '#0f172a'}
              stroke="white"
              strokeWidth="3"
              opacity=".95"
            />
            <text
              x={part.x}
              y={part.y + 4}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              pointerEvents="none"
            >
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
