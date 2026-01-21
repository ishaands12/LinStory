import React, { useState, useMemo } from 'react';
import StoryEngine from '../components/StoryEngine';
import VectorVisualization from '../visualizations/VectorVisualization';
import moduleData from './01-vectors'; // Importing the bundle
import CheckpointQuiz from '../components/quiz/CheckpointQuiz';
import VectorDecomposition from '../visualizations/VectorDecomposition';

export default function VectorsModule() {
    // Vectors Module State - v1.1
    const [v1, setV1] = useState([3, 2]);
    const [v2, setV2] = useState([1, -1]);
    const [showResultVectors, setShowResultVectors] = useState(false);
    const [dotProductResult, setDotProductResult] = useState(null);

    const computeDotProduct = async () => {
        try {
            const res = await fetch('/api/compute/dot-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ v1, v2 })
            });
            const data = await res.json();
            setDotProductResult(data);
        } catch (e) {
            console.error(e);
        }
    };
    // --- Content Parsing ---
    const contentChunks = useMemo(() => {
        const text = moduleData.content;
        const chunks = {};
        const parts = text.split(/^# /m); // Split by h1
        parts.forEach(part => {
            if (!part.trim()) return;
            const lines = part.split('\n');
            const title = lines[0].trim();
            const body = lines.slice(1).join('\n').trim();
            chunks[title] = body;
        });
        return chunks;
    }, []);

    const getVisualization = (type) => {
        switch (type) {
            case 'vector-single':
                return <VectorVisualization v1={v1} v2={[0, 0]} showResult={false} />;

            // ... (in getVisualization switch)

            case 'vector-decomposition':
                return <VectorDecomposition vec={v1} />;
            case 'vector-coordinates':
                return <VectorVisualization v1={v1} v2={[0, 0]} showResult={false} />;
            case 'vector-addition':
                return <VectorVisualization v1={v1} v2={v2} showResult={showResultVectors} />;
            // ...
            case 'quiz-vectors-checkpoint':
                // This renders the component DIRECTLY instead of returning it.
                // Actually StoryEngine expects a "visualization" node.
                // But for the quiz step, we might want it to take over the whole right panel.
                return (
                    <CheckpointQuiz
                        questions={[
                            {
                                question: "If a vector has components [3, 4], what is its magnitude?",
                                options: ["7", "5", "12", "3.5"],
                                correctAnswer: 1,
                                explanation: "Using Pythagoras: sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5. This is a 3-4-5 triangle."
                            },
                            {
                                question: "What is the result of adding [1, 2] and [3, -1]?",
                                options: ["[4, 1]", "[2, 3]", "[4, 3]", "[3, 1]"],
                                correctAnswer: 0,
                                explanation: "Add component-wise: 1+3=4 and 2+(-1)=1."
                            },
                            {
                                question: "If the dot product of two vectors is negative, the angle between them is:",
                                options: ["Acute (<90°)", "Right (90°)", "Obtuse (>90°)", "Zero"],
                                correctAnswer: 2,
                                explanation: "cos(theta) is negative only when theta is between 90 and 180 degrees."
                            }
                        ]}
                        onComplete={(score) => console.log("Module Mastery:", score)}
                    />
                );
            case 'vector-dot-product':
                return (
                    <div style={{ position: 'relative' }}>
                        <VectorVisualization v1={v1} v2={v2} showResult={false} />
                        <div style={{
                            position: 'absolute', bottom: '1rem', right: '1rem',
                            background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '8px',
                            border: dotProductResult && dotProductResult.cosine_similarity > 0.9 ? '1px solid #10b981' : '1px solid var(--glass-border)'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cosine Similarity</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: dotProductResult?.cosine_similarity > 0.9 ? '#10b981' : 'white' }}>
                                {dotProductResult ? dotProductResult.cosine_similarity.toFixed(2) : "?"}
                            </div>
                        </div>
                    </div>
                );
            case 'quiz-vectors':
                return <div style={{ fontSize: '5rem', opacity: 0.2 }}>🧠</div>;
            default:
                return null;
        }
    };

    const getControls = (type) => {
        switch (type) {
            case 'vector-single':
                return (
                    <div>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Try changing the vector's components:</p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <label>X-Component: {v1[0]}</label>
                                <input type="range" min="-4" max="4" step="0.5" value={v1[0]} onChange={e => setV1([Number(e.target.value), v1[1]])} style={{ width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Y-Component: {v1[1]}</label>
                                <input type="range" min="-4" max="4" step="0.5" value={v1[1]} onChange={e => setV1([v1[0], Number(e.target.value)])} style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                );
            case 'vector-coordinates':
                return (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                        <p>Current Vector: <strong>v = [{v1[0]}, {v1[1]}]</strong></p>
                        <p>Magnitude: <strong>{Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]).toFixed(2)}</strong></p>
                    </div>
                );
            case 'vector-addition':
                return (
                    <div>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: 'var(--primary)' }}>Vector A</h4>
                                <input key="v1-x" type="range" min="-4" max="4" step="0.5" value={v1[0]} onChange={e => setV1([Number(e.target.value), v1[1]])} style={{ width: '100%' }} />
                                <input key="v1-y" type="range" min="-4" max="4" step="0.5" value={v1[1]} onChange={e => setV1([v1[0], Number(e.target.value)])} style={{ width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: 'var(--accent)' }}>Vector B</h4>
                                <input key="v2-x" type="range" min="-4" max="4" step="0.5" value={v2[0]} onChange={e => setV2([Number(e.target.value), v2[1]])} style={{ width: '100%' }} />
                                <input key="v2-y" type="range" min="-4" max="4" step="0.5" value={v2[1]} onChange={e => setV2([v2[0], Number(e.target.value)])} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => setShowResultVectors(!showResultVectors)}
                        >
                            {showResultVectors ? "Hide Result" : "Show Result (Head-to-Tail)"}
                        </button>
                    </div>
                );
            case 'vector-dot-product':
                return (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>Align the vectors to see the score increase.</p>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: 'var(--primary)' }}>User Vector</h4>
                                <input type="range" min="-4" max="4" step="0.5" value={v1[0]} onChange={e => { setV1([Number(e.target.value), v1[1]]); computeDotProduct(); }} style={{ width: '100%' }} />
                                <input type="range" min="-4" max="4" step="0.5" value={v1[1]} onChange={e => { setV1([v1[0], Number(e.target.value)]); computeDotProduct(); }} style={{ width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: 'var(--accent)' }}>Item Vector</h4>
                                <input type="range" min="-4" max="4" step="0.5" value={v2[0]} onChange={e => { setV2([Number(e.target.value), v2[1]]); computeDotProduct(); }} style={{ width: '100%' }} />
                                <input type="range" min="-4" max="4" step="0.5" value={v2[1]} onChange={e => { setV2([v2[0], Number(e.target.value)]); computeDotProduct(); }} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <button className="btn-primary" onClick={computeDotProduct}>
                            Calculate Match Score
                        </button>
                    </div>
                );
            default:
                return null;
        }
    }

    // --- Build Steps from JSON ---
    const steps = moduleData.sections.sections.map(sec => ({
        title: sec.title,
        content: contentChunks[sec.title] || "Content not found for " + sec.title,
        visualization: getVisualization(sec.visualization),
        controls: getControls(sec.visualization),
        // Hardcoding quiz for now since it's a special object
        quiz: sec.id === 'quiz' ? {
            question: "If two vectors have a Dot Product of 0, what does this mean geometrically?",
            options: [
                "They are parallel (pointing same way)",
                "They are perpendicular (90 degrees)",
                "They are pointing in opposite directions",
                "One of them must be zero"
            ],
            correctAnswer: 1
        } : null
    }));

    return <StoryEngine title={moduleData.sections.title} steps={steps} />;
}
