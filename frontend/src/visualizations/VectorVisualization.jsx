import { motion } from 'framer-motion';
import React from 'react';


export default function VectorVisualization({ v1, v2, showResult }) {
    // Simple coordinate system container
    return (
        <div style={{
            width: '100%',
            height: '300px',
            position: 'relative',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)'
        }}>
            {/* Grid lines (simplified) */}
            <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.1)'
            }} />
            <div style={{
                position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)'
            }} />

            {/* Origin Dot */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '50%',
                width: '6px',
                height: '6px',
                background: '#fff',
                borderRadius: '50%',
                transform: 'translate(-50%, 50%)'
            }} />

            {/* Vector 1 */}
            <Arrow start={[0, 0]} end={v1} color="var(--primary)" label="v1" />

            {/* Vector 2 Logic */}
            {/* If Adding: Show Ghost of V2 at origin (faded) to remind user where it came from */}
            {showResult && (
                <Arrow
                    start={[0, 0]}
                    end={v2}
                    color="var(--accent)"
                    label="(v2)"
                    opacity={0.3}
                    dashed={true}
                />
            )}

            {/* Vector 2 (Head-to-tail if showing result, else from origin) */}
            <Arrow
                start={showResult ? v1 : [0, 0]}
                end={showResult ? [v1[0] + v2[0], v1[1] + v2[1]] : v2}
                color="var(--accent)"
                label="v2"
            />

            {/* Travel Path (Dashed line from V2 origin to V2 head-to-tail start) */}
            {showResult && (
                <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}
                >
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <line
                            x1={`${50 + v2[0] * 5}%`} y1={`${50 + v2[1] * 5}%`} // Tip of ghost
                            x2={`${50 + (v1[0] + v2[0]) * 5}%`} y2={`${50 + (v1[1] + v2[1]) * 5}%`} // Tip of moved
                            stroke="var(--accent)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.5"
                        />
                    </svg>
                </motion.div>
            )}

            {/* Resultant Vector */}
            {showResult && (
                <Arrow
                    start={[0, 0]}
                    end={[v1[0] + v2[0], v1[1] + v2[1]]}
                    color="#10b981"
                    label="v1 + v2"
                />
            )}
        </div>
    );
}

// Update Arrow component to support opacity/dashed
const Arrow = ({ start, end, color = '#6366f1', label, opacity = 1, dashed = false }) => {
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * (180 / Math.PI);
    const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: opacity, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'absolute',
                left: `${50 + start[0] * 5}%`,
                bottom: `${50 + start[1] * 5}%`,
                width: `${length * 5}%`, // Adjusted scale (approx 5% per unit to match grid)
                height: '2px',
                backgroundColor: dashed ? 'transparent' : color,
                borderTop: dashed ? `2px dashed ${color}` : 'none',
                transformOrigin: 'left center',
                transform: `rotate(${-angle}deg)`,
            }}
        >
            {!dashed && (
                <div style={{
                    position: 'absolute',
                    right: '-5px',
                    top: '-4px', // Adjust for border
                    width: '0',
                    height: '0',
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: `10px solid ${color}`,
                }} />
            )}
            {label && (
                <span style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    color: color,
                    fontWeight: 'bold',
                    transform: `rotate(${angle}deg)`,
                    fontSize: '0.8rem'
                }}>
                    {label}
                </span>
            )}
        </motion.div>
    );
};
