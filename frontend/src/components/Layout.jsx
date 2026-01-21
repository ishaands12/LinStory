import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getRelatedConcepts } from '../lib/knowledgeGraph';
import LevelUpToast from './LevelUpToast';

export default function Layout({ children }) {
    const location = useLocation();

    // Simple heuristic to detect current topic
    const currentTopicId = location.pathname.includes('vectors') ? 'vectors' :
        location.pathname.includes('matrices') ? 'matrices' : null;

    const related = currentTopicId ? getRelatedConcepts(currentTopicId) : [];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-gradient)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            padding: '20px'
        }}>
            <LevelUpToast />
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                marginBottom: '2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="logo-pulse" style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            LinStory
                        </span>
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/" style={{ color: location.pathname === '/' ? 'white' : 'var(--text-muted)', textDecoration: 'none' }}>Modules</Link>
                    <Link to="/playground" style={{ color: location.pathname === '/playground' ? 'white' : 'var(--text-muted)', textDecoration: 'none' }}>Playground</Link>
                    <Link to="/profile" style={{ color: location.pathname === '/profile' ? 'white' : 'var(--text-muted)', textDecoration: 'none' }}>Profile</Link>
                </div>
            </nav>

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
                <main style={{ flex: 1, minWidth: 0 }}>
                    {children}
                </main>

                {/* Knowledge Graph Sidebar */}
                {related.length > 0 && (
                    <aside style={{ width: '280px', flexShrink: 0 }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                            <h4 style={{ color: 'var(--accent)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🔗 Related Concepts
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {related.map((node, i) => (
                                    <Link key={i} to={node.route || '#'} style={{
                                        display: 'block',
                                        padding: '0.8rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'var(--text-main)',
                                        borderLeft: `2px solid ${node.type === 'core' ? 'var(--primary)' : 'var(--text-muted)'}`,
                                        transition: 'background 0.2s'
                                    }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{node.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                                            {node.relation.replace('_', ' ')}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}
