import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import VectorVisualization3D from '../visualizations/VectorVisualization3D';
import TransformationVisualization3D from '../visualizations/TransformationVisualization3D';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlaygroundPage() {
    const [mode, setMode] = useState('sandbox'); // 'sandbox' | 'game' | 'matrix'

    return (
        <Layout>
            <div style={{ padding: '2rem 0' }}>
                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', marginBottom: '1rem' }}>Interactive Playground</h1>
                    <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '12px', gap: '0.5rem' }}>
                        <ModeButton active={mode === 'sandbox'} onClick={() => setMode('sandbox')}>🛠️ Vector Sandbox</ModeButton>
                        <ModeButton active={mode === 'game'} onClick={() => setMode('game')}>🎯 Target Practice</ModeButton>
                        <ModeButton active={mode === 'matrix'} onClick={() => setMode('matrix')}>🧊 Matrix Lab</ModeButton>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {mode === 'sandbox' && <SandboxMode key="sandbox" />}
                    {mode === 'game' && <GameMode key="game" />}
                    {mode === 'matrix' && <MatrixMode key="matrix" />}
                </AnimatePresence>
            </div>
        </Layout>
    );
}

function ModeButton({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
            }}
        >
            {children}
        </button>
    )
}

function SandboxMode() {
    // ... Copy of the existing Sandbox Logic ...
    const [vectors, setVectors] = useState([
        { id: 1, end: [2, 2, 2], color: '#3b82f6', label: 'v1' },
    ]);
    const [activeId, setActiveId] = useState(1);
    const [showCrossProduct, setShowCrossProduct] = useState(false);
    const [showSpan, setShowSpan] = useState(false);

    const activeVector = vectors.find(v => v.id === activeId);

    const updateVector = (coord, val) => {
        setVectors(vectors.map(v => {
            if (v.id === activeId) {
                const newEnd = [...v.end];
                newEnd[coord] = Number(val);
                return { ...v, end: newEnd };
            }
            return v;
        }));
    };

    const addVector = () => {
        const newId = vectors.length + 1;
        setVectors([...vectors, { id: newId, end: [1, 1, 1], color: '#10b981', label: `v${newId}` }]);
        setActiveId(newId);
    };

    const removeVector = () => {
        if (vectors.length <= 1) return;
        const newVectors = vectors.filter(v => v.id !== activeId);
        setVectors(newVectors);
        setActiveId(newVectors[0].id);
    }

    // Cross Product Logic
    const calculateCrossProduct = () => {
        if (vectors.length < 2) return null;
        const a = vectors[0].end;
        const b = vectors[1].end;
        const cx = a[1] * b[2] - a[2] * b[1];
        const cy = a[2] * b[0] - a[0] * b[2];
        const cz = a[0] * b[1] - a[1] * b[0];
        return { end: [cx, cy, cz], color: '#f59e0b', label: 'v1 × v2' };
    };

    const crossVector = showCrossProduct ? calculateCrossProduct() : null;
    const vectorsToRender = crossVector ? [...vectors, crossVector] : vectors;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <button onClick={addVector} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px dashed #666', background: 'transparent', color: '#888', cursor: 'pointer' }}>+ Add Vector</button>
                        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="checkbox" checked={showCrossProduct} onChange={e => setShowCrossProduct(e.target.checked)} /> Cross Product
                        </label>
                        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="checkbox" checked={showSpan} onChange={e => setShowSpan(e.target.checked)} /> Show Span
                        </label>
                    </div>
                    <VectorVisualization3D vectors={vectorsToRender} showSpan={showSpan} />
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {vectors.map(v => (
                                <button key={v.id} onClick={() => setActiveId(v.id)} style={{ padding: '0.5rem', borderRadius: '4px', border: activeId === v.id ? `2px solid ${v.color}` : '1px solid #333', background: 'transparent', color: v.color }}>{v.label}</button>
                            ))}
                        </div>
                        {activeVector && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ margin: 0, color: activeVector.color }}>Editing {activeVector.label}</h3>
                                <input type="range" min="-5" max="5" step="0.5" value={activeVector.end[0]} onChange={e => updateVector(0, e.target.value)} style={{ accentColor: 'red' }} />
                                <input type="range" min="-5" max="5" step="0.5" value={activeVector.end[1]} onChange={e => updateVector(1, e.target.value)} style={{ accentColor: 'green' }} />
                                <input type="range" min="-5" max="5" step="0.5" value={activeVector.end[2]} onChange={e => updateVector(2, e.target.value)} style={{ accentColor: 'blue' }} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

function MatrixMode() {
    const [matrix, setMatrix] = useState([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

    // Helper to update matrix element
    const updateM = (row, col, val) => {
        const newM = [...matrix];
        newM[row] = [...newM[row]]; // shallow copy row
        newM[row][col] = Number(val);
        setMatrix(newM);
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                Visualize how a 3x3 Matrix transforms 3D space. The "Ghost" wireframe shows the original shape.
            </p>
            <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2 }}>
                    <TransformationVisualization3D matrix={matrix} />
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', height: 'fit-content' }}>
                    {/* 3x3 Grid of Inputs */}
                    {matrix.map((row, r) => row.map((val, c) => (
                        <div key={`${r}-${c}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={val}
                                step="0.1"
                                onChange={e => updateM(r, c, e.target.value)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}
                            />
                        </div>
                    )))}
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => setMatrix([[2, 0, 0], [0, 2, 0], [0, 0, 2]])}>Uniform Scale</button>
                        <button className="btn-secondary" onClick={() => setMatrix([[1, 0, 0], [0, 1, 0], [0, 0.5, 1]])}>Shear Z</button>
                        <button className="btn-primary" onClick={() => setMatrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]])}>Reset Identity</button>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

function GameMode() {
    const [target, setTarget] = useState([3, 2, 1]);
    const [c1, setC1] = useState(1);
    const [c2, setC2] = useState(0);
    const [score, setScore] = useState(0);

    const v1Base = [1, 0, 0];
    const v2Base = [0, 1, 0];
    const v3Base = [0, 0, 1];

    // Player attempts to reach target using Linear Combination: c1*v1 + c2*v2 + ...
    const playerVector = [
        c1 * v1Base[0] + c2 * v2Base[0],
        c1 * v1Base[1] + c2 * v2Base[1],
        c1 * v1Base[2] + c2 * v2Base[2]
    ];

    const dist = Math.sqrt(
        Math.pow(playerVector[0] - target[0], 2) +
        Math.pow(playerVector[1] - target[1], 2) +
        Math.pow(playerVector[2] - target[2], 2)
    );

    const isWin = dist < 0.5;

    useEffect(() => {
        if (isWin) {
            // Celebrate and reset
            const timer = setTimeout(() => {
                setScore(s => s + 100);
                setTarget([Math.floor(Math.random() * 6) - 3, Math.floor(Math.random() * 6) - 3, Math.floor(Math.random() * 6) - 3]);
                setC1(0); setC2(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isWin]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Mission: Reach the Target</h2>
                <p style={{ color: 'var(--text-muted)' }}>Adjust the scalars to perform a "Linear Combination" that hits the Orb.</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'gold', marginTop: '1rem' }}>Score: {score}</div>
                {isWin && <div style={{ color: '#10b981', fontWeight: 'bold' }}>TARGET ACQUIRED! (+100 XP)</div>}
            </div>

            <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2 }}>
                    <VectorVisualization3D
                        vectors={[
                            { start: [0, 0, 0], end: playerVector, color: isWin ? '#10b981' : 'white', label: 'Player' }
                        ]}
                        targetPoint={target}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3>Controls</h3>
                        <p>Construct your vector:</p>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
                            v = <span style={{ color: 'var(--primary)' }}>{c1.toFixed(1)}</span>i + <span style={{ color: 'var(--accent)' }}>{c2.toFixed(1)}</span>j
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Scalar for i-hat (X axis)</label>
                            <input type="range" min="-5" max="5" step="0.1" value={c1} onChange={e => setC1(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Scalar for j-hat (Y axis)</label>
                            <input type="range" min="-5" max="5" step="0.1" value={c2} onChange={e => setC2(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            Distance to Target: <strong>{dist.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}
