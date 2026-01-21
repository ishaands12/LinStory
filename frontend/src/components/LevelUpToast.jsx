import React, { useEffect, useState } from 'react';
import { useCourse } from '../context/CourseContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LevelUpToast() {
    const { user } = useCourse();
    const [prevLevel, setPrevLevel] = useState(user.level);
    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        if (user.level > prevLevel) {
            setShowLevelUp(true);
            const audio = new Audio('/levelup.mp3'); // Assuming we had this, but visual only for now
            setTimeout(() => setShowLevelUp(false), 4000);
        }
        setPrevLevel(user.level);
    }, [user.level, prevLevel]);

    return (
        <AnimatePresence>
            {showLevelUp && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -50 }}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        padding: '1.5rem 3rem',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
                        border: '2px solid #FFF',
                        textAlign: 'center',
                        color: '#000'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 LEVEL UP!</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>You are now Level {user.level}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Rank: {getRankName(user.level)}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function getRankName(level) {
    if (level < 3) return "Novice Geometer";
    if (level < 5) return "Vector Voyager";
    if (level < 10) return "Matrix Master";
    return "Linear Legend";
}
