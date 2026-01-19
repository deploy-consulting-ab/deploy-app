'use client';

import { useId } from 'react';

export function MiniLineChart({ data = [], color = 'var(--deploy-accent-yellow)', height = 60 }) {
    const gradientId = useId();
    
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Generate SVG path
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10; // Leave 10% padding
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    return (
        <svg
            viewBox="0 0 100 100"
            className="w-full"
            style={{ height: `${height}px` }}
            preserveAspectRatio="none"
        >
            {/* Gradient fill */}
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                </linearGradient>
            </defs>

            {/* Area under the curve */}
            <path d={`${pathData} L 100,100 L 0,100 Z`} fill={`url(#${gradientId})`} />

            {/* Line */}
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Peak point indicator */}
            {data.map((value, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((value - min) / range) * 80 - 10;
                const isMax = value === max;

                return isMax ? (
                    <g key={index}>
                        <circle cx={x} cy={y} r="3" fill={color} />
                        <circle cx={x} cy={y} r="1.5" fill="white" />
                    </g>
                ) : null;
            })}
        </svg>
    );
}

export function MiniBarChart({ data = [], color = 'var(--deploy-accent-orange)', height = 60 }) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);

    return (
        <div className="flex items-end gap-1 h-full" style={{ height: `${height}px` }}>
            {data.map((value, index) => {
                const barHeight = (value / max) * 100;

                return (
                    <div
                        key={index}
                        className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                        style={{
                            height: `${barHeight}%`,
                            backgroundColor: color,
                        }}
                    />
                );
            })}
        </div>
    );
}
