import React, { useState, useMemo } from 'react';
import StoryEngine from '../components/StoryEngine';
import VectorVisualization from '../visualizations/VectorVisualization';
import MatrixGridVisualization from '../visualizations/MatrixGridVisualization';
import CheckpointQuiz from '../components/quiz/CheckpointQuiz';
import moduleData from './04-basis';

export default function BasisModule() {
    const [basisV1, setBasisV1] = useState([1, 0]);
    const [basisV2, setBasisV2] = useState([0, 1]);
    const [coeffs, setCoeffs] = useState({ c1: 2, c2: 1 });

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

    const MatrixSlider = ({ label, val, onChange }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{label}</span>
                <span>{val.toFixed(1)}</span>
            </div>
            <input type="range" min="-3" max="3" step="0.1" value={val} onChange={e => onChange(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
    );

    const getVisualization = (type) => {
        switch (type) {
            case 'basis-linear-combo':
                return (
                    <div style={{ position: 'relative', width: '100%' }}>
                        <VectorVisualization
                            v1={[basisV1[0] * coeffs.c1, basisV1[1] * coeffs.c1]}
                            v2={[basisV2[0] * coeffs.c2, basisV2[1] * coeffs.c2]}
                            showResult={true}
                        />
                        <div style={{
                            marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid var(--primary)', borderRadius: '8px', fontFamily: 'monospace'
                        }}>
                            v_target = {coeffs.c1.toFixed(1)}*v1 + {coeffs.c2.toFixed(1)}*v2
                        </div>
                    </div>
                );
            case 'basis-change-grid':
            case 'basis-independence':
                return <MatrixGridVisualization matrix={[basisV1, basisV2]} />;
            case 'quiz-basis':
                return (
                    <CheckpointQuiz
                        questions={[
                            {
                                question: "How many basis vectors do you need to span a 2D plane?",
                                options: ["1", "2", "3", "Infinite"],
                                correctAnswer: 1,
                                explanation: "You need exactly 2 independent vectors to reach any point in 2D space. 1 only spans a line."
                            },
                            {
                                question: "If the basis vectors are linearly dependent (parallel), what happens to the span?",
                                options: ["It spans the whole plane", "It becomes 3D", "It collapses to a line (1D)", "It becomes a point"],
                                correctAnswer: 2,
                                explanation: "Since they point in the same direction, you can only travel along that one line."
                            }
                        ]}
                        onComplete={(score) => console.log("Basis Mastery:", score)}
                    />
                );
            default: return null;
        }
    };

    const getControls = (type) => {
        switch (type) {
            case 'basis-linear-combo':
                return (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>Adjust the coefficients (scalars) to reach different points using the standard basis.</p>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <label>Scalar c1: {coeffs.c1}</label>
                                <input type="range" min="-3" max="3" step="0.1" value={coeffs.c1} onChange={e => setCoeffs({ ...coeffs, c1: Number(e.target.value) })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Scalar c2: {coeffs.c2}</label>
                                <input type="range" min="-3" max="3" step="0.1" value={coeffs.c2} onChange={e => setCoeffs({ ...coeffs, c2: Number(e.target.value) })} style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                );
            case 'basis-change-grid':
                return (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>Change the Basis Vectors (warp the grid).</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '300px' }}>
                            <MatrixSlider label="v1 (x)" val={basisV1[0]} onChange={v => setBasisV1([v, basisV1[1]])} />
                            <MatrixSlider label="v1 (y)" val={basisV1[1]} onChange={v => setBasisV1([basisV1[0], v])} />
                            <MatrixSlider label="v2 (x)" val={basisV2[0]} onChange={v => setBasisV2([v, basisV2[1]])} />
                            <MatrixSlider label="v2 (y)" val={basisV2[1]} onChange={v => setBasisV2([basisV2[0], v])} />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn-secondary" onClick={() => { setBasisV1([1, 0]); setBasisV2([0, 1]); }}>Reset to Standard</button>
                        </div>
                    </div>
                );
            case 'basis-independence':
                return (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>Try to make the vectors parallel.</p>
                        <button className="btn-primary" onClick={() => { setBasisV1([1, 1]); setBasisV2([2, 2]); }}>Make Dependent</button>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Note how the grid collapses?</p>
                    </div>
                );
            default: return null;
        }
    };

    const steps = moduleData.sections.sections.map(sec => ({
        title: sec.title,
        content: contentChunks[sec.title] || "",
        visualization: getVisualization(sec.visualization),
        controls: getControls(sec.visualization),
        objectives: sec.objectives,
        objectives: sec.objectives
    }));

    return <StoryEngine title={moduleData.sections.title} steps={steps} />;
}
