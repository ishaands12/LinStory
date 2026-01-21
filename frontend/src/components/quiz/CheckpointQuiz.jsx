import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckpointQuiz({ questions, onComplete }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const question = questions[currentIdx];

    const handleAnswer = (idx) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);

        if (idx === question.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = async () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            const finalScore = score + (question.correctAnswer === selectedOption ? 1 : 0);
            const percentage = Math.round((finalScore / questions.length) * 100);

            setShowResult(true);
            if (onComplete) onComplete(percentage);

            // Save to Backend
            try {
                // Hardcoded user_1 for MVP
                const res = await fetch('/api/progress/quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: 'user_1',
                        quiz_id: 'vectors_checkpoint_1', // Ideally passed as prop
                        score: finalScore,
                        max_score: questions.length
                    })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    console.log(`Quiz Saved! Gained ${data.xp_gained} XP`);
                    // Create a Custom Event to notify standard UI components of XP gain
                    window.dispatchEvent(new CustomEvent('xp_gained', { detail: data.xp_gained }));
                }
            } catch (e) {
                console.error("Failed to save quiz result", e);
            }
        }
    };

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Checkpoint Complete!</h3>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: percentage >= 80 ? '#10b981' : '#f59e0b', marginBottom: '1rem' }}>
                    {percentage}%
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                    {percentage >= 80 ? "Excellent mastery! You display strong intuition." : "Good effort. Review the concepts and try again to solidify your understanding."}
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <button onClick={() => window.location.reload()} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                        Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{question.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {question.options.map((opt, i) => {
                    let bg = 'rgba(255,255,255,0.05)';
                    if (isAnswered) {
                        if (i === question.correctAnswer) bg = 'rgba(16, 185, 129, 0.2)'; // Green
                        else if (i === selectedOption) bg = 'rgba(239, 68, 68, 0.2)'; // Red
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={isAnswered}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                background: bg,
                                border: isAnswered && i === question.correctAnswer ? '1px solid #10b981' : '1px solid transparent',
                                color: 'var(--text-main)',
                                textAlign: 'left',
                                cursor: isAnswered ? 'default' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {opt}
                        </button>
                    )
                })}
            </div>

            {isAnswered && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ marginBottom: '1rem', color: selectedOption === question.correctAnswer ? '#10b981' : '#ef4444' }}>
                        {selectedOption === question.correctAnswer ? "Correct!" : "Incorrect."}
                    </div>
                    {question.explanation && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            <strong>Analysis:</strong> {question.explanation}
                        </div>
                    )}
                    <button className="btn-primary" onClick={nextQuestion}>
                        {currentIdx < questions.length - 1 ? "Next Question" : "Finish Checkpoint"}
                    </button>
                </div>
            )}
        </div>
    );
}
