import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCourse } from '../context/CourseContext';

export default function QuizWidget({ question, options, correctAnswer, onComplete }) {
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, correct, incorrect
    const { user } = useCourse();

    const handleCheck = () => {
        if (selected === correctAnswer) {
            setStatus('correct');
            onComplete && onComplete(true);
        } else {
            setStatus('incorrect');
            onComplete && onComplete(false);
        }
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '1rem'
        }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--accent)' }}>
                🧩 Check Your Understanding
            </h4>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{question}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setSelected(idx); setStatus('idle'); }}
                        style={{
                            textAlign: 'left',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: selected === idx ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                            background: selected === idx ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {status === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#10b981', fontWeight: 'bold' }}
                    >
                        ✅ Correct! (+50 XP)
                    </motion.div>
                )}
                {status === 'incorrect' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#ef4444', fontWeight: 'bold' }}
                    >
                        ❌ Try again!
                    </motion.div>
                )}

                <button
                    className="btn-primary"
                    onClick={handleCheck}
                    disabled={selected === null || status === 'correct'}
                    style={{ marginLeft: 'auto' }}
                >
                    Check Answer
                </button>
            </div>
        </div>
    );
}
