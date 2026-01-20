'use client';

import { useId, useState } from 'react';

export function MiniLineChart({
    data = [],
    labels = [],
    color = 'var(--deploy-accent-yellow)',
    height = 60,
    unit = '%',
}) {
    const gradientId = useId();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Generate SVG path
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10; // Leave 10% padding
        return { x, y, value };
    });

    const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;

    return (
        <div className="relative" style={{ height: `${height}px` }}>
            {/* Tooltip */}
            {hoveredIndex !== null && (
                <div
                    className="absolute z-10 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground shadow-md border border-border/50 whitespace-nowrap pointer-events-none"
                    style={{
                        left: `${points[hoveredIndex].x}%`,
                        top: `${(points[hoveredIndex].y / 100) * height - 32}px`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    <div className="font-medium">
                        {labels[hoveredIndex] || `Point ${hoveredIndex + 1}`}
                    </div>
                    <div style={{ color }}>
                        {data[hoveredIndex]}
                        {unit}
                    </div>
                </div>
            )}

            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
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

                {/* Interactive points */}
                {points.map((point, index) => {
                    const isMax = point.value === max;
                    const isHovered = hoveredIndex === index;

                    return (
                        <g key={index}>
                            {/* Invisible larger hit area for easier hovering */}
                            <rect
                                x={point.x - 8}
                                y={0}
                                width={16}
                                height={100}
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                            {/* Visible point - shown when hovered or is max */}
                            {(isMax || isHovered) && (
                                <>
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={isHovered ? '4' : '3'}
                                        fill={color}
                                    />
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={isHovered ? '2' : '1.5'}
                                        fill="white"
                                    />
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
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
