import React, { useState, useEffect } from 'react';
import StoryEngine from '../components/StoryEngine';
import SVDVisualization from '../visualizations/SVDVisualization';

export default function SVDModule() {
    const initialImage = [
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const [svdK, setSvdK] = useState(2);
    const [compressedImage, setCompressedImage] = useState(null);

    const computeSVD = async () => {
        try {
            const res = await fetch('/api/compute/svd-compression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matrix: initialImage, k: svdK })
            });
            const data = await res.json();
            setCompressedImage(data.reconstructed);
        } catch (e) { console.error("API Error (SVD):", e); }
    }

    useEffect(() => {
        computeSVD();
    }, [svdK]);

    const HookCard = ({ title, content }) => (
        <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid var(--accent)'
        }}>
            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚀 Real World Hook: {title}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{content}</p>
        </div>
    );

    const steps = [
        {
            title: "Image Compression (SVD)",
            content: "Singular Value Decomposition (SVD) allows us to break any matrix (like an image) into simple layers. By keeping only the most important layers (Highest Singular Values), we can compress the image significantly while preserving the main patterns.",
            visualization: <SVDVisualization originalMatrix={initialImage} compressedMatrix={compressedImage} />,
            controls: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>Adjust the "Rank" (k) to see how many layers we keep.</p>
                    <label>
                        Rank (k) = {svdK}
                        <input
                            type="range" min="1" max="8" step="1"
                            value={svdK}
                            onChange={e => setSvdK(Number(e.target.value))}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        />
                    </label>
                    <div style={{ fontSize: '0.9rem', color: '#10b981', marginTop: '0.5rem' }}>
                        Compression Ratio: {((svdK * (8 + 8 + 1)) / (8 * 8) * 100).toFixed(0)}% of original data used.
                    </div>
                    <HookCard title="Netflix & Facial Recognition" content="SVD is used to match users to movies (Netflix Prize) and to identify faces (Eigenfaces). It extracts the 'DNA' of the data matrix." />
                </div>
            )
        }
    ];

    return <StoryEngine title="Module 6: SVD & Compression" steps={steps} />;
}
