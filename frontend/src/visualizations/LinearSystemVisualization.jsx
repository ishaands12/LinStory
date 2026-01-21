import React, { useMemo } from 'react';

export default function LinearSystemVisualization({ eq1, eq2 }) {
    // eq structure: { a, b, c } for ax + by = c
    const scale = 40;
    const size = 400;
    const origin = size / 2;

    // Helper to get svg coords
    const toSVG = (x, y) => [origin + x * scale, origin - y * scale];

    // Calculate intersection
    const intersection = useMemo(() => {
        const det = eq1.a * eq2.b - eq2.a * eq1.b;
        if (Math.abs(det) < 0.001) return null; // Parallel

        const x = (eq1.c * eq2.b - eq2.c * eq1.b) / det;
        const y = (eq1.a * eq2.c - eq2.a * eq1.c) / det;
        return { x, y };
    }, [eq1, eq2]);

    // Helper to get line endpoints for bounding box [-5, 5]
    const getLineCoords = (eq) => {
        // ax + by = c
        // if b != 0, y = (c - ax) / b
        // if b == 0, x = c / a

        const points = [];
        const range = 6;

        if (Math.abs(eq.b) > 0.001) {
            // Calculate y for x = -range and x = range
            const y1 = (eq.c - eq.a * (-range)) / eq.b;
            const y2 = (eq.c - eq.a * (range)) / eq.b;
            points.push([-range, y1]);
            points.push([range, y2]);
        } else {
            // Vertical line
            const x = eq.c / eq.a;
            points.push([x, -range]);
            points.push([x, range]);
        }
        return points.map(p => toSVG(p[0], p[1]));
    };

    const line1 = getLineCoords(eq1);
    const line2 = getLineCoords(eq2);

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={size} height={size} style={{ background: '#0a0a0a', borderRadius: '12px', border: '1px solid #333' }}>
                {/* Grid */}
                <defs>
                    <pattern id="grid_sys" width={scale} height={scale} patternUnits="userSpaceOnUse">
                        <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#222" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid_sys)" />

                {/* Axes */}
                <line x1={origin} y1="0" x2={origin} y2={size} stroke="#444" strokeWidth="2" />
                <line x1="0" y1={origin} x2={size} y2={origin} stroke="#444" strokeWidth="2" />

                {/* Line 1 (Blue) */}
                <line x1={line1[0][0]} y1={line1[0][1]} x2={line1[1][0]} y2={line1[1][1]} stroke="#3b82f6" strokeWidth="3" />

                {/* Line 2 (Purple) */}
                <line x1={line2[0][0]} y1={line2[0][1]} x2={line2[1][0]} y2={line2[1][1]} stroke="#a855f7" strokeWidth="3" />

                {/* Intersection */}
                {intersection && (
                    <g>
                        <circle cx={toSVG(intersection.x, intersection.y)[0]} cy={toSVG(intersection.x, intersection.y)[1]} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
                        <text x={toSVG(intersection.x, intersection.y)[0] + 10} y={toSVG(intersection.x, intersection.y)[1] - 10} fill="#10b981" fontWeight="bold">
                            ({intersection.x.toFixed(1)}, {intersection.y.toFixed(1)})
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                {intersection ? (
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Unique Solution Found
                    </div>
                ) : (
                    <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        No Unique Solution (Parallel)
                    </div>
                )}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: '#3b82f6' }}>L1: {eq1.a}x + {eq1.b}y = {eq1.c}</span>
                    <span style={{ color: '#a855f7' }}>L2: {eq2.a}x + {eq2.b}y = {eq2.c}</span>
                </div>
            </div>
        </div>
    );
}
