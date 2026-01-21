import React, { useState, useEffect } from 'react';

export default function BackendStatus() {
    const [status, setStatus] = useState('checking'); // checking, online, offline

    useEffect(() => {
        const check = async () => {
            try {
                await fetch('/api/health');
                setStatus('online');
            } catch (e) {
                setStatus('offline');
            }
        };
        check();
        const interval = setInterval(check, 10000);
        return () => clearInterval(interval);
    }, []);

    if (status === 'online') return (
        <div style={{
            position: 'fixed', bottom: '1rem', left: '1rem',
            fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem',
            opacity: 0.7
        }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }}></div>
            Backend Online
        </div>
    );

    if (status === 'offline') return (
        <div style={{
            position: 'fixed', bottom: '1rem', left: '1rem',
            padding: '0.5rem', background: '#ef4444', color: 'white', borderRadius: '4px', fontSize: '0.8rem', zIndex: 9999
        }}>
            ⚠️ Backend Disconnected
        </div>
    );

    return null;
}
