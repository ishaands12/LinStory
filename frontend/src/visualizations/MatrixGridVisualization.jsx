import React from 'react';
import { motion } from 'framer-motion';

export default function MatrixGridVisualization({ matrix, showBasis = true, eigenvectors = [], animate = false }) {
    // matrix is [[a, b], [c, d]]
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];

    const gridSize = 10;
    const gridLines = [];
    for (let i = -gridSize; i <= gridSize; i++) {
        gridLines.push(i);
    }

    return (
        <div style={{
            width: '100%',
            height: '350px',
            position: 'relative',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Span Lines for Eigenvectors (Fixed in space to show alignment) */}
            {eigenvectors.map((vec, idx) => {
                const angle = Math.atan2(vec[1], vec[0]) * (180 / Math.PI);
                return (
                    <div key={'span-' + idx} style={{
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        background: 'rgba(236, 72, 153, 0.3)',
                        transform: `rotate(${-angle}deg)`,
                        pointerEvents: 'none'
                    }} />
                );
            })}

            {/* Container for the transforming world */}
            <motion.div
                animate={{
                    transform: animate
                        ? [`matrix(1, 0, 0, 1, 0, 0)`, `matrix(${a}, ${c}, ${b}, ${d}, 0, 0)`, `matrix(1, 0, 0, 1, 0, 0)`]
                        : `matrix(${a}, ${c}, ${b}, ${d}, 0, 0)`
                }}
                transition={animate ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : { duration: 0.8, type: "spring" }}
                style={{
                    width: '100px', // Unit size
                    height: '100px',
                    position: 'absolute',
                }}
            >
                {/* Coordinate System Wrapper */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: '0', height: '0' }}>

                    {/* Grid Lines */}
                    {gridLines.map(i => (
                        <React.Fragment key={i}>
                            {/* Vertical (x=i) and Horizontal (y=i) */}
                            <div style={{
                                position: 'absolute', left: `${i * 40}px`, top: '-300px', height: '600px', width: '1px',
                                background: i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)'
                            }} />
                            <div style={{
                                position: 'absolute', top: `${-i * 40}px`, left: '-300px', width: '600px', height: '1px',
                                background: i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)'
                            }} />
                        </React.Fragment>
                    ))}

                    {/* Basis Vectors */}
                    {showBasis && (
                        <>
                            <div style={{ position: 'absolute', left: 0, top: 0, width: '40px', height: '3px', background: 'var(--accent)', transformOrigin: 'left center', boxShadow: '0 0 10px var(--accent)' }} />
                            <div style={{ position: 'absolute', left: '40px', top: '-4px', borderLeft: '8px solid var(--accent)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />

                            <div style={{ position: 'absolute', left: 0, top: 0, width: '40px', height: '3px', background: '#10b981', transformOrigin: 'left center', transform: 'rotate(-90deg)', boxShadow: '0 0 10px #10b981' }} />
                            <div style={{ position: 'absolute', left: -5, top: '-48px', borderBottom: '8px solid #10b981', borderLeft: '5px solid transparent', borderRight: '5px solid transparent' }} />
                        </>
                    )}

                    {/* Eigenvectors attached to grid */}
                    {eigenvectors.map((vec, idx) => {
                        const angle = Math.atan2(vec[1], vec[0]) * (180 / Math.PI);
                        const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]) * 40;
                        return (
                            <div key={'eigen-' + idx} style={{
                                position: 'absolute', left: 0, top: 0,
                                width: `${length}px`, height: '4px',
                                background: '#ec4899',
                                transformOrigin: 'left center',
                                transform: `rotate(${-angle}deg)`,
                                boxShadow: '0 0 15px #ec4899'
                            }} />
                        )
                    })}

                    {/* Unit Square for Determinant */}
                    <div style={{
                        position: 'absolute', left: 0, top: -40, width: '40px', height: '40px',
                        background: 'rgba(255, 215, 0, 0.1)', border: '1px dashed gold', pointerEvents: 'none'
                    }} />

                </div>
            </motion.div>

            {/* Static Reference Grid (Overlay) */}
            <div style={{ pointerEvents: 'none', position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
                <div style={{ position: 'absolute', left: '50%', height: '100%', width: '1px', background: 'white' }}></div>
                <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', background: 'white' }}></div>
            </div>
        </div>
    );
}
