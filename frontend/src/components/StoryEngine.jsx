import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useCourse } from '../context/CourseContext';
import QuizWidget from './QuizWidget';

export default function StoryEngine({ title, steps }) {
    const { topicId } = useParams();
    const { updateProgress } = useCourse();
    const [currentStep, setCurrentStep] = useState(0);

    // Update progress whenever step changes
    useEffect(() => {
        if (topicId) {
            const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
            updateProgress(topicId, progressPercent);
        }
    }, [currentStep, topicId, steps.length, updateProgress]);

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const step = steps[currentStep];

    return (
        <div className="glass-panel" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                height: '4px',
                                flex: 1,
                                background: i <= currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '2px',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', gap: '2rem' }}>
                {/* Left: Narrative & Controls */}
                <div style={{ flex: 1 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{step.title}</h3>

                            {/* Learning Objectives Information Card */}
                            {step.objectives && step.objectives.length > 0 && (
                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderLeft: '3px solid var(--primary)',
                                    padding: '1rem',
                                    borderRadius: '0 8px 8px 0',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h5 style={{ margin: 0, color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Learning Objectives
                                    </h5>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {step.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* Render Content with Markdown & Math */}
                            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '1rem' }} {...props} />,
                                        // Custom styling for code/math blocks could go here
                                    }}
                                >
                                    {step.content}
                                </ReactMarkdown>
                            </div>

                            {/* Render Quiz if it exists, otherwise Controls */}
                            {step.quiz ? (
                                <QuizWidget
                                    question={step.quiz.question}
                                    options={step.quiz.options}
                                    correctAnswer={step.quiz.correctAnswer}
                                    onComplete={(success) => console.log("Quiz completed:", success)}
                                />
                            ) : (
                                step.controls
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Visualization Stage */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.visualization}
                </div>
            </div>

            <footer style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{ opacity: currentStep === 0 ? 0.5 : 1, color: 'var(--text-muted)', background: 'transparent' }}
                >
                    ← Previous
                </button>
                <button className="btn-primary" onClick={nextStep} disabled={currentStep === steps.length - 1}>
                    {currentStep === steps.length - 1 ? 'Finish Story' : 'Next Part →'}
                </button>
            </footer>
        </div>
    );
}
