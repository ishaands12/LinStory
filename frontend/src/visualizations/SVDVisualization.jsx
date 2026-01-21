import React, { useEffect, useState } from 'react';

export default function SVDVisualization({ originalMatrix, compressedMatrix }) {
    // Matrices are 2D arrays of numbers (0-1 range usually, or 0-255)
    // We render them as pixel grids.

    const renderGrid = (matrix, title) => {
        if (!matrix) return null;
        const rows = matrix.length;
        const cols = matrix[0].length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ color: 'var(--text-muted)' }}>{title}</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: '1px',
                    border: '1px solid var(--glass-border)',
                    padding: '2px',
                    background: 'black'
                }}>
                    {matrix.map((row, r) =>
                        row.map((val, c) => (
                            <div key={`${r}-${c}`} style={{
                                width: '15px',
                                height: '15px',
                                backgroundColor: `rgb(${val * 255}, ${val * 255}, ${val * 255})` // Grayscale
                            }} title={val.toFixed(2)} />
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            width: '100%',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'start',
            flexWrap: 'wrap',
            gap: '2rem'
        }}>
            {renderGrid(originalMatrix, "Original Image")}
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: '2rem', color: 'var(--text-muted)' }}>
                →
            </div>
            {renderGrid(compressedMatrix, "Compressed (Approximation)")}
        </div>
    );
}
