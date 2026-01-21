import React, { useState, useMemo } from 'react';
import StoryEngine from '../components/StoryEngine';
import MatrixGridVisualization from '../visualizations/MatrixGridVisualization';
import moduleData from './02-matrices';

export default function MatricesModule() {
    const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
    const [transformVector, setTransformVector] = useState([1, 1]);
    const [backendResultMatrix, setBackendResultMatrix] = useState(null);
    const [determinantResult, setDeterminantResult] = useState(null);
    const [eigenResult, setEigenResult] = useState(null);

    // --- API HELPER FUNCTION ---
    const postCompute = async (endpoint, body) => {
        try {
            const res = await fetch(`/api/compute/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) { console.error(`API Error ${endpoint}`, e); return null; }
    };

    const computeMatrixTransform = async () => {
        const data = await postCompute('matrix-transform', { matrix, vector: transformVector });
        setBackendResultMatrix(data);
    };

    const computeDeterminant = async () => {
        const data = await postCompute('determinant', matrix);
        setDeterminantResult(data);
    };

    const computeEigen = async () => {
        const data = await postCompute('eigen', matrix);
        setEigenResult(data);
    };

    // --- Helpers ---
    const MatrixSlider = ({ label, val, onChange }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{label}</span>
                <span>{val.toFixed(1)}</span>
            </div>
            <input
                type="range" min="-3" max="3" step="0.1"
                value={val}
                onChange={e => onChange(Number(e.target.value))}
                style={{ width: '100%' }}
            />
        </div>
    );

    const MatrixControls = ({ onChange, matrix }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '300px', marginBottom: '1rem' }}>
            <MatrixSlider label="a (i-x)" val={matrix[0][0]} onChange={v => onChange([[v, matrix[0][1]], matrix[1]])} />
            <MatrixSlider label="b (i-y)" val={matrix[0][1]} onChange={v => onChange([[matrix[0][0], v], matrix[1]])} />
            <MatrixSlider label="c (j-x)" val={matrix[1][0]} onChange={v => onChange([matrix[0], [v, matrix[1][1]]])} />
            <MatrixSlider label="d (j-y)" val={matrix[1][1]} onChange={v => onChange([matrix[0], [matrix[1][0], v]])} />
        </div>
    );

    // --- Content Parsing ---
    const contentChunks = useMemo(() => {
        const text = moduleData.content;
        const chunks = {};
        const parts = text.split(/^# /m);
        parts.forEach(part => {
            if (!part.trim()) return;
            const lines = part.split('\n');
            const title = lines[0].trim();
            const body = lines.slice(1).join('\n').trim();
            chunks[title] = body;
        });
        return chunks;
    }, []);

    // --- Visualization & Controls Maps ---
    const getVisualization = (type) => {
        switch (type) {
            case 'matrix-grid':
                return <MatrixGridVisualization matrix={matrix} />;
            case 'matrix-mult':
                return (
                    <div>
                        <MatrixGridVisualization matrix={matrix} />
                        {backendResultMatrix && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', borderRadius: '8px' }}>
                                <strong>Transformed Vector:</strong> {JSON.stringify(backendResultMatrix.result)}
                            </div>
                        )}
                    </div>
                );
            case 'matrix-det':
                return (
                    <div style={{ position: 'relative' }}>
                        <MatrixGridVisualization matrix={matrix} />
                        <div style={{
                            position: 'absolute', bottom: '1rem', right: '1rem',
                            background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '8px',
                            border: '1px solid gold'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scaling Factor (Det)</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'gold' }}>
                                {determinantResult ? determinantResult.determinant.toFixed(2) : "?"}
                            </div>
                        </div>
                    </div>
                );
            case 'matrix-eigen':
                return (
                    <div style={{ position: 'relative' }}>
                        <MatrixGridVisualization
                            matrix={matrix}
                            eigenvectors={eigenResult?.results?.map(r => r.eigenvector) || []}
                            animate={true}
                        />
                        {eigenResult && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid #ec4899', borderRadius: '8px' }}>
                                <strong style={{ color: '#ec4899' }}>Found Eigenvectors:</strong>
                                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', margin: 0 }}>
                                    {eigenResult.results.map((res, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                                            Vector: [{res.eigenvector.map(n => n.toFixed(2)).join(', ')}]
                                            <span style={{ color: 'var(--text-muted)' }}> (stretched by {res.eigenvalue.toFixed(2)}x)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            case 'quiz-matrices':
                return <div style={{ fontSize: '5rem', opacity: 0.2 }}>🧠</div>;
            default: return null;
        }
    };

    const getControls = (type) => {
        switch (type) {
            case 'matrix-grid':
                return (
                    <div>
                        <MatrixControls onChange={setMatrix} matrix={matrix} />
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setMatrix([[2, 0], [0, 2]])} className="btn-secondary">Scale 2x</button>
                            <button onClick={() => setMatrix([[1, 1], [0, 1]])} className="btn-secondary">Shear</button>
                            <button onClick={() => setMatrix([[0, -1], [1, 0]])} className="btn-secondary">Rotate 90</button>
                        </div>
                    </div>
                );
            case 'matrix-mult':
                return (
                    <div>
                        <p style={{ marginBottom: '0.5rem' }}>Input Vector to Transform:</p>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <input type="number" value={transformVector[0]} onChange={e => setTransformVector([Number(e.target.value), transformVector[1]])} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px', borderRadius: '4px' }} />
                            <input type="number" value={transformVector[1]} onChange={e => setTransformVector([transformVector[0], Number(e.target.value)])} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px', borderRadius: '4px' }} />
                        </div>
                        <button className="btn-primary" onClick={computeMatrixTransform}>Run Transformation</button>
                    </div>
                );
            case 'matrix-det':
                return (
                    <div>
                        <MatrixControls onChange={(m) => { setMatrix(m); computeDeterminant(); }} matrix={matrix} />
                        <button className="btn-primary" onClick={computeDeterminant}>Calculate Determinant</button>
                    </div>
                );
            case 'matrix-eigen':
                return (
                    <div>
                        <MatrixControls onChange={(m) => { setMatrix(m); setEigenResult(null); }} matrix={matrix} />
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={computeEigen}>Find Eigenvectors</button>
                            <button className="btn-secondary" onClick={() => { setMatrix([[2, 0], [0, 0.5]]); setEigenResult(null); }}>Try Scaling (Easy)</button>
                            <button className="btn-secondary" onClick={() => { setMatrix([[1, 1], [0, 1]]); setEigenResult(null); }}>Try Shear</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    const steps = moduleData.sections.sections.map(sec => ({
        title: sec.title,
        content: contentChunks[sec.title] || "Content not found for " + sec.title,
        visualization: getVisualization(sec.visualization),
        controls: getControls(sec.visualization),
        objectives: sec.objectives, // Passing pedogogical objective
        quiz: sec.id === 'quiz' ? {
            question: "If the determinant of a matrix is 0, what happens to the grid area?",
            options: [
                "It doubles in size",
                "It stays the same",
                "It collapses into a line or point (Area becomes 0)",
                "It rotates 90 degrees"
            ],
            correctAnswer: 2
        } : null
    }));

    return <StoryEngine title={moduleData.sections.title} steps={steps} />;
}
