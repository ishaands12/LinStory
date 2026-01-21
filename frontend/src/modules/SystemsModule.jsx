import React, { useState, useMemo } from 'react';
import StoryEngine from '../components/StoryEngine';
import LinearSystemVisualization from '../visualizations/LinearSystemVisualization';
import CheckpointQuiz from '../components/quiz/CheckpointQuiz';
import moduleData from './03-systems';

export default function SystemsModule() {
    // System State: 2 Equations
    // L1: 2x + 1y = 5
    const [eq1, setEq1] = useState({ a: 2, b: 1, c: 5 });
    // L2: 1x - 1y = 1
    const [eq2, setEq2] = useState({ a: 1, b: -1, c: 1 });

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

    const EquationControl = ({ label, eq, setEq, color }) => (
        <div style={{ marginBottom: '1.5rem', borderLeft: `3px solid ${color}`, paddingLeft: '1rem' }}>
            <h4 style={{ color: color, margin: '0 0 0.5rem 0' }}>{label}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <span>x coeff: {eq.a}</span>
                <input type="range" min="-3" max="3" step="1" value={eq.a} onChange={e => setEq({ ...eq, a: Number(e.target.value) })} />

                <span>y coeff: {eq.b}</span>
                <input type="range" min="-3" max="3" step="1" value={eq.b} onChange={e => setEq({ ...eq, b: Number(e.target.value) })} />

                <span>constant: {eq.c}</span>
                <input type="range" min="-5" max="5" step="1" value={eq.c} onChange={e => setEq({ ...eq, c: Number(e.target.value) })} />
            </div>
        </div>
    );

    const getVisualization = (type) => {
        switch (type) {
            case 'systems-lines':
            case 'systems-matrix':
                return <LinearSystemVisualization eq1={eq1} eq2={eq2} />;
            case 'systems-singular':
                // Force a singular state for the initial view of this step, or let user discover it
                return <LinearSystemVisualization eq1={eq1} eq2={eq2} />;
            case 'quiz-systems':
                return (
                    <CheckpointQuiz
                        questions={[
                            {
                                question: "What does the intersection of two lines represent in a system of equations?",
                                options: ["The y-intercept", "The unique solution (x,y)", "The slope", "The determinant"],
                                correctAnswer: 1,
                                explanation: "The intersection point maps to the specific (x,y) values that satisfy BOTH equations simultaneously."
                            },
                            {
                                question: "If the determinant of the coefficient matrix is 0, the lines are:",
                                options: ["Perpendicular", "Parallel or Identical", "Intersecting at 90 degrees", "Curved"],
                                correctAnswer: 1,
                                explanation: "Determinant 0 means the transformation squishes space, so the lines lose their independence (become parallel)."
                            }
                        ]}
                        onComplete={(score) => console.log("Systems Mastery:", score)}
                    />
                );
            default: return null;
        }
    };

    const getControls = (type) => {
        if (type === 'systems-lines' || type === 'systems-matrix' || type === 'systems-singular') {
            return (
                <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Adjust the equations to see how the lines move.</p>
                    <EquationControl label="Line 1 (Blue)" eq={eq1} setEq={setEq1} color="#3b82f6" />
                    <EquationControl label="Line 2 (Purple)" eq={eq2} setEq={setEq2} color="#a855f7" />

                    {type === 'systems-singular' && (
                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn-secondary" onClick={() => {
                                setEq1({ a: 1, b: 1, c: 5 });
                                setEq2({ a: 1, b: 1, c: 2 });
                            }}>
                                Make Parallel (No Solution)
                            </button>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const steps = moduleData.sections.sections.map(sec => ({
        title: sec.title,
        content: contentChunks[sec.title] || "",
        visualization: getVisualization(sec.visualization),
        controls: getControls(sec.visualization),
        objectives: sec.objectives
    }));

    return <StoryEngine title={moduleData.sections.title} steps={steps} />;
}
