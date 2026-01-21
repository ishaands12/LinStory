import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const CourseContext = createContext();

export function useCourse() {
    return useContext(CourseContext);
}

export function CourseProvider({ children }) {
    const [progress, setProgress] = useState({
        vectors: 0, matrices: 0, systems: 0, basis: 0, data: 0, advanced: 0
    });

    const [userId, setUserId] = useState(() => localStorage.getItem('linstory_uid') || 'user_1');
    const [user, setUser] = useState({ name: 'Guest Scholar', level: 1, xp: 0 });

    // Sync with Backend
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`/api/progress/${userId}`);
                const data = await res.json();
                if (data.user) {
                    setUser({
                        name: data.user.name,
                        level: data.user.current_level,
                        xp: data.user.current_xp
                    });
                    // Load progress map
                    if (data.progress) {
                        const newProgress = { ...progress };
                        Object.keys(data.progress).forEach(k => {
                            newProgress[k] = data.progress[k].completed_sections || 0;
                        });
                        setProgress(newProgress);
                    }
                }
            } catch (e) {
                console.error("Failed to load user data", e);
            }
        };

        fetchUserData();
    }, [userId]);

    const login = async (username) => {
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (data.user) {
                setUserId(data.user.id);
                localStorage.setItem('linstory_uid', data.user.id);
            }
        } catch (e) { console.error(e); }
    };

    const logout = () => {
        localStorage.removeItem('linstory_uid');
        setUserId(null);
        setUser({ name: 'Guest', level: 1, xp: 0 });
        setProgress({ vectors: 0, matrices: 0, systems: 0, basis: 0, data: 0, advanced: 0 });
    };

    // Listen for XP events
    useEffect(() => {
        const handleXPGain = (e) => {
            addXP(e.detail);
        };
        window.addEventListener('xp_gained', handleXPGain);
        return () => window.removeEventListener('xp_gained', handleXPGain);
    }, []);

    const updateProgress = (moduleId, percent) => {
        setProgress(prev => {
            if (percent > (prev[moduleId] || 0)) {
                return { ...prev, [moduleId]: percent };
            }
            return prev;
        });

        // Note: For MVP we aren't creating a backend input for general read-progress yet, 
        // just for explicit quiz completion.
    };

    const playLevelUp = useSound('/levelup.mp3'); // User needs to add this file to public/

    const addXP = (amount) => {
        setUser(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / 100) + 1;

            if (newLevel > prev.level) {
                // Level Up Event!
                console.log("Level Up!");
                playLevelUp();
            }

            return { ...prev, xp: newXP, level: newLevel };
        });
    };

    const resetProgress = async () => {
        // Optimistic Update
        setProgress({
            vectors: 0, matrices: 0, systems: 0, basis: 0, data: 0, advanced: 0
        });
        setUser({ name: 'Guest Scholar', level: 1, xp: 0 });

        try {
            await fetch('/api/progress/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 'user_1' })
            });
        } catch (e) { console.error("Reset failed", e); }
    };

    return (
        <CourseContext.Provider value={{ progress, user, updateProgress, resetProgress }}>
            {children}
        </CourseContext.Provider>
    );
}
