import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { nodes } from '../lib/knowledgeGraph';

export default function HomePage() {
    // Filter for top-level story modules
    const modules = nodes.filter(n => ['core', 'advanced', 'application'].includes(n.type));

    // Custom coloring/description map (since KG only has labels)
    const metadata = {
        vectors: { desc: "The building blocks of space. Magnitude & Direction.", color: "var(--primary)" },
        matrices: { desc: "Transformations: Scale, Shear, Rotate.", color: "#ec4899" },
        systems: { desc: "Solving Ax=b. Lines and Intersections.", color: "#10b981" },
        basis: { desc: "Coordinate Systems & Span.", color: "#f59e0b" },
        data: { desc: "Least Squares: Finding truth in noise.", color: "#8b5cf6" },
        svd: { desc: "Image Compression & The Matrix Factorization.", color: "#ef4444" }
    };

    return (
        <Layout>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto', padding: '4rem 1rem' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Master Linear Algebra<br />Without The Headache.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Stop memorizing formulas. Start visualizing concepts. <br />
                    An interactive, story-driven journey from Vectors to SVD.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                    {modules.map(node => (
                        <StoryCard
                            key={node.id}
                            title={node.label}
                            desc={metadata[node.id]?.desc || "Learn about " + node.label}
                            link={node.route}
                            color={metadata[node.id]?.color || "#ccc"}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

function StoryCard({ title, desc, link, color }) {
    return (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{
                height: '100%',
                padding: '2rem',
                transition: 'all 0.2s',
                borderLeft: `4px solid ${color}`,
                cursor: 'pointer'
            }}>
                <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{desc}</p>
                <div style={{ marginTop: '1rem', color: color, fontSize: '0.85rem', fontWeight: 'bold' }}>Start Module →</div>
            </div>
        </Link>
    )
}
