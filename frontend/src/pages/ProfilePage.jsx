import React from 'react';
import Layout from '../components/Layout';
import { useCourse } from '../context/CourseContext';

export default function ProfilePage() {
    const { user, userId, progress, resetProgress, login, logout } = useCourse();
    const [usernameInput, setUsernameInput] = React.useState("");

    if (!userId) {
        return (
            <Layout>
                <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel">
                    <h2 style={{ marginBottom: '1.5rem' }}>Student Login</h2>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white', marginBottom: '1rem' }}
                    />
                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => { if (usernameInput) login(usernameInput) }}
                    >
                        Start Learning
                    </button>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        (This will create a new profile if one doesn't exist)
                    </p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                        {user.level}
                    </div>
                    <div>
                        <h1 style={{ margin: 0 }}>{user.name}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Level {user.level} Scholar • {user.xp} XP</p>
                    </div>
                    <div style={{ position: 'absolute', right: '2rem', top: '2rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Logout
                        </button>
                        <button onClick={resetProgress} style={{ background: 'rgba(255,0,0,0.2)', border: '1px solid red', color: '#ff6b6b', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Reset
                        </button>
                    </div>
                </div>

                <h2 style={{ marginTop: '3rem' }}>Your Progress</h2>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    <ProgressItem title="1. Vectors" progress={progress.vectors} />
                    <ProgressItem title="2. Matrices" progress={progress.matrices} />
                    <ProgressItem title="3. Systems" progress={progress.systems} />
                    <ProgressItem title="4. Basis" progress={progress.basis} />
                    <ProgressItem title="5. Data" progress={progress.data} />
                    <ProgressItem title="6. SVD (Advanced)" progress={progress.advanced} />
                </div>
            </div>
        </Layout>
    );
}

function ProgressItem({ title, progress }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{title}</span>
            <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
            </div>
        </div>
    )
}
