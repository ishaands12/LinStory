import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function VectorDecomposition({ vec = [3, 2] }) {
    const scale = 50; // Pixels per unit
    const origin = { x: 50, y: 350 };

    // Calculate endpoints
    const endX = origin.x + vec[0] * scale;
    const endY = origin.y - vec[1] * scale; // SVG Y is down
    const mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
    const angle = Math.atan2(vec[1], vec[0]) * 180 / Math.PI;

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <svg width="400" height="400" style={{ background: '#0a0a0a', borderRadius: '12px', border: '1px solid #333' }}>
                {/* Grid */}
                <defs>
                    <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                        <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#222" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Axes */}
                <line x1={origin.x} y1="0" x2={origin.x} y2="400" stroke="#444" strokeWidth="2" />
                <line x1="0" y1={origin.y} x2="400" y2={origin.y} stroke="#444" strokeWidth="2" />

                {/* X Component (Green) */}
                <line x1={origin.x} y1={origin.y} x2={endX} y2={origin.y} stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" />
                <text x={origin.x + (vec[0] * scale) / 2} y={origin.y + 20} fill="#10b981" textAnchor="middle">v_x = {vec[0]}</text>

                {/* Y Component (Pink) */}
                <line x1={endX} y1={origin.y} x2={endX} y2={endY} stroke="#ec4899" strokeWidth="3" strokeDasharray="5,5" />
                <text x={endX + 10} y={origin.y - (vec[1] * scale) / 2} fill="#ec4899" alignmentBaseline="middle">v_y = {vec[1]}</text>

                {/* Main Vector (Blue) */}
                <line x1={origin.x} y1={origin.y} x2={endX} y2={endY} stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrowhead)" />

                {/* Angle Arc */}
                <path d={`M ${origin.x + 30} ${origin.y} A 30 30 0 0 0 ${origin.x + 30 * Math.cos(-angle * Math.PI / 180)} ${origin.y + 30 * Math.sin(-angle * Math.PI / 180)}`} fill="none" stroke="gold" strokeWidth="2" />
                <text x={origin.x + 40} y={origin.y - 10} fill="gold">{angle.toFixed(0)}°</text>

                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
            </svg>

            <div style={{ flex: 1 }}>
                <h3 style={{ color: '#3b82f6' }}>Vector Decomposition</h3>
                <p style={{ color: 'var(--text-muted)' }}>Any vector can be broken down into perpendicular components.</p>

                <div style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#10b981' }}>Horizontal (x):</span> <strong>{vec[0]}</strong>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#ec4899' }}>Vertical (y):</span> <strong>{vec[1]}</strong>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ color: 'white' }}>Magnitude:</span> <strong>{mag.toFixed(2)}</strong>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace' }}>
                        ||v|| = √({vec[0]}² + {vec[1]}²)
                        <br />
                        ||v|| = {mag.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    )
}
