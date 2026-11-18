'use client';

import React, { useEffect, useState } from 'react';

export type MotionAnimationType =
  | 'rest-motion'
  | 'types-of-motion'
  | 'distance-displacement'
  | 'speed-velocity'
  | 'acceleration'
  | 'equations-of-motion';

interface Props {
  type: MotionAnimationType;
  title: string;
  description: string;
}

export default function MotionAnimationPlayer({
  type,
  title,
  description,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          setPlaying(false);
          return 100;
        }
        return Math.min(100, current + speed * 0.5);
      });
    }, 30);

    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const reset = () => {
    setProgress(0);
    setPlaying(false);
  };

  const carX = 45 + progress * 4.8;
  const accelerationX = 45 + (progress * progress * 4.8) / 100;
  const pendulumAngle = Math.sin((progress / 100) * Math.PI * 4) * 35;

  const car = (x: number, y = 100, color = '#2563eb') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="72" height="25" rx="7" fill={color} />
      <path d="M12 0 L23 -15 H52 L63 0" fill={color} />
      <rect x="25" y="-12" width="23" height="11" rx="2" fill="#bfdbfe" />
      <circle cx="16" cy="27" r="7" fill="#1e293b" />
      <circle cx="57" cy="27" r="7" fill="#1e293b" />
      <circle cx="16" cy="27" r="3" fill="#cbd5e1" />
      <circle cx="57" cy="27" r="3" fill="#cbd5e1" />
    </g>
  );

  return (
    <section className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            2D ANIMATION
          </span>
          <span className="text-xs font-medium text-slate-500">
            Interactive Physics
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="bg-slate-50 p-3 sm:p-5">
        <svg
          viewBox="0 0 600 190"
          className="w-full rounded-xl border border-slate-200 bg-white"
          role="img"
          aria-label={title}
        >
          <defs>
            <marker
              id={`arrow-${type}`}
              markerWidth="8"
              markerHeight="8"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* REST AND MOTION */}
          {type === 'rest-motion' && (
            <>
              <path d="M20 145 H580" stroke="#64748b" strokeWidth="3" />
              <path d="M20 150 H580" stroke="#cbd5e1" strokeWidth="8" />
              <text x="25" y="25" fontSize="13" fill="#475569">
                Reference point
              </text>
              <rect x="25" y="65" width="8" height="80" fill="#64748b" />
              <text x="17" y="55" fontSize="11" fill="#64748b">A</text>
              {car(progress === 0 ? 75 : carX)}
              <text x="420" y="35" fontSize="13" fill="#2563eb">
                {progress === 0 ? 'Object at rest' : 'Object in motion'}
              </text>
              <path
                d="M90 55 H480"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="6 5"
                markerEnd={`url(#arrow-${type})`}
              />
            </>
          )}

          {/* TYPES OF MOTION */}
          {type === 'types-of-motion' && (
            <>
              <g transform="translate(100 75)">
                <rect x="-38" y="-12" width="76" height="24" rx="5" fill="#2563eb" />
                <path d={`M${-25 + progress * 0.3} 0 H${-15 + progress * 0.3}`} stroke="white" strokeWidth="3" />
                <text x="-38" y="48" fontSize="13" fill="#334155">Linear</text>
                <path d="M-55 20 H55" stroke="#94a3b8" strokeDasharray="4 4" />
              </g>

              <g transform="translate(300 75)">
                <circle cx="0" cy="0" r="34" fill="none" stroke="#0d9488" strokeWidth="3" />
                <g transform={`rotate(${progress * 3.6} 0 0)`}>
                  <circle cx="30" cy="0" r="8" fill="#0d9488" />
                  <path d="M0 0 H30" stroke="#0d9488" strokeWidth="2" />
                </g>
                <text x="-45" y="65" fontSize="13" fill="#334155">Circular</text>
              </g>

              <g transform="translate(495 75)">
                <path d="M-45 0 Q-25 -45 0 0 T45 0" fill="none" stroke="#9333ea" strokeWidth="3" />
                <circle
                  cx={Math.sin((progress / 100) * Math.PI * 4) * 35}
                  cy={-Math.abs(Math.sin((progress / 100) * Math.PI * 4)) * 25}
                  r="8"
                  fill="#9333ea"
                />
                <text x="-50" y="65" fontSize="13" fill="#334155">Oscillatory</text>
              </g>
            </>
          )}

          {/* DISTANCE AND DISPLACEMENT */}
          {type === 'distance-displacement' && (
            <>
              <path
                d="M50 140 L50 75 L260 75 L260 140 L500 140"
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeDasharray="8 5"
              />
              <path d="M50 140 H500" stroke="#dc2626" strokeWidth="3" />
              <circle cx="50" cy="140" r="7" fill="#16a34a" />
              <circle cx="500" cy="140" r="7" fill="#dc2626" />
              {car(50 + progress * 4.5, 45, '#2563eb')}
              <text x="35" y="165" fontSize="12" fill="#16a34a">Start</text>
              <text x="470" y="165" fontSize="12" fill="#dc2626">End</text>
              <text x="190" y="125" fontSize="12" fill="#2563eb">Actual path = Distance</text>
              <text x="230" y="180" fontSize="12" fill="#dc2626">Straight line = Displacement</text>
            </>
          )}

          {/* SPEED AND VELOCITY */}
          {type === 'speed-velocity' && (
            <>
              <path d="M20 145 H580" stroke="#94a3b8" strokeWidth="3" />
              {car(carX, 100, '#0d9488')}
              <path
                d={`M${carX + 70} 85 H${Math.min(carX + 160, 570)}`}
                stroke="#dc2626"
                strokeWidth="3"
                markerEnd={`url(#arrow-${type})`}
              />
              <text x="30" y="30" fontSize="14" fill="#0f766e">
                Speed: How fast the object moves
              </text>
              <text x="30" y="52" fontSize="14" fill="#dc2626">
                Velocity: Speed with direction
              </text>
              <text x="30" y="175" fontSize="12" fill="#64748b">
                Direction of motion →
              </text>
            </>
          )}

          {/* ACCELERATION */}
          {type === 'acceleration' && (
            <>
              <path d="M20 145 H580" stroke="#94a3b8" strokeWidth="3" />
              {car(accelerationX, 100, '#ea580c')}
              <path
                d={`M${accelerationX + 70} 85 H${Math.min(accelerationX + 90 + progress * 0.8, 580)}`}
                stroke="#ea580c"
                strokeWidth="4"
                markerEnd={`url(#arrow-${type})`}
              />
              <text x="25" y="30" fontSize="14" fill="#c2410c">
                Increasing velocity
              </text>
              <text x="25" y="52" fontSize="12" fill="#64748b">
                The car covers more distance in equal time intervals.
              </text>
              {[0, 1, 2, 3, 4].map((n) => (
                <line
                  key={n}
                  x1={60 + n * 100}
                  y1="145"
                  x2={60 + n * 100}
                  y2="155"
                  stroke="#64748b"
                />
              ))}
            </>
          )}

          {/* EQUATIONS OF MOTION */}
          {type === 'equations-of-motion' && (
            <>
              <path d="M20 145 H580" stroke="#94a3b8" strokeWidth="3" />
              {car(carX, 100, '#7c3aed')}
              <text x="30" y="25" fontSize="15" fontWeight="bold" fill="#6d28d9">
                v = u + at
              </text>
              <text x="30" y="48" fontSize="12" fill="#475569">
                Final velocity changes with time and acceleration.
              </text>
              <text x="350" y="30" fontSize="13" fill="#334155">
                Time: {(progress / 10).toFixed(1)} s
              </text>
              <text x="350" y="52" fontSize="13" fill="#334155">
                Progress: {Math.round(progress)}%
              </text>
            </>
          )}
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {playing ? 'Pause' : progress >= 100 ? 'Replay' : 'Play'}
          </button>

          <button
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>

          <span className="ml-auto text-sm font-semibold text-slate-600">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => {
              setProgress(Number(event.target.value));
              setPlaying(false);
            }}
            className="w-full accent-blue-600"
            aria-label="Animation progress"
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-slate-600">Animation Speed</label>
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </section>
  );
}