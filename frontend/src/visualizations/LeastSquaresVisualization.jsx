import React, { useRef, useState, useEffect } from 'react';

export default function LeastSquaresVisualization({ points, setPoints, lineParams }) {
    // points: Array of [x, y]
    // lineParams: { slope, intercept } or null

    const containerRef = useRef(null);

    // Coordinate system: 
    // Plot area: 0 to 10 on both axes.
    // CSS Y is inverted.

    // Scale Helpers
    const toPercentX = (val) => (val / 10) * 100;
    const toPercentY = (val) => 100 - ((val / 10) * 100);

    const fromPercentX = (pct) => (pct / 100) * 10;
    const fromPercentY = (pct) => ((100 - pct) / 100) * 10;

    const handleClick = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const xPx = e.clientX - rect.left;
        const yPx = e.clientY - rect.top;

        const xPct = (xPx / rect.width) * 100;
        const yPct = (yPx / rect.height) * 100;

        const xVal = fromPercentX(xPct);
        const yVal = fromPercentY(yPct);

        // Add point
        setPoints([...points, [xVal, yVal]]);
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            style={{
                width: '100%',
                height: '350px',
                position: 'relative',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                cursor: 'crosshair',
                overflow: 'hidden'
            }}
        >
            {/* Grid */}
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '1px', background: 'var(--text-muted)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '1px', height: '100%', background: 'var(--text-muted)', opacity: 0.5 }} />

            {/* Labels */}
            <span style={{ position: 'absolute', left: '5px', top: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click to add data points (Scatter Plot)</span>

            {/* Points */}
            {points.map((p, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: `calc(${toPercentX(p[0])}% - 6px)`,
                    top: `calc(${toPercentY(p[1])}% - 6px)`,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px rgba(255,100,200, 0.5)',
                    pointerEvents: 'none'
                }} />
            ))}

            {/* Best Fit Line */}
            {lineParams && (
                <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {/* Calculate line end points at x=0 and x=10 */}
                    {/* y = mx + c */}
                    <line
                        x1="0%"
                        y1={`${toPercentY(lineParams.intercept)}%`}
                        x2="100%"
                        y2={`${toPercentY(lineParams.slope * 10 + lineParams.intercept)}%`}
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                </svg>
            )}
        </div>
    );
}
