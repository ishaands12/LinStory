import React, { useState, useEffect } from 'react';
import StoryEngine from '../components/StoryEngine';
import LeastSquaresVisualization from '../visualizations/LeastSquaresVisualization';

export default function DataModule() {
    const [dataPoints, setDataPoints] = useState([]);
    const [regressionLine, setRegressionLine] = useState(null);

    const computeLeastSquares = async () => {
        if (dataPoints.length < 2) return;
        try {
            const res = await fetch('/api/compute/least-squares', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPoints)
            });
            const data = await res.json();
            if (data.slope !== undefined) {
                setRegressionLine(data);
            }
        } catch (e) { console.error("API Error (LS):", e); }
    };

    // Auto-compute regression when points change
    useEffect(() => {
        if (dataPoints.length >= 2) {
            computeLeastSquares();
        } else {
            setRegressionLine(null);
        }
    }, [dataPoints]);

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
            title: "The Best Fit Line (Least Squares)",
            content: "In the real world, data is messy. Points almost never align perfectly. Linear Algebra gives us a way to find the 'best' line that goes through the middle of the cloud. This is solving A*x = b where there is No Solution, so we minimize the error instead.",
            visualization: <LeastSquaresVisualization points={dataPoints} setPoints={setDataPoints} lineParams={regressionLine} />,
            controls: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>Click on the graph area to add data points.</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-primary" onClick={() => setDataPoints([])}>Clear Points</button>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Points: {dataPoints.length}</div>
                    </div>

                    {regressionLine && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px' }}>
                            <strong style={{ color: '#10b981' }}>Model Found:</strong>
                            <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{regressionLine.equation}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>This line minimizes the sum of squared errors (vertical distances).</div>
                        </div>
                    )}

                    <HookCard title="Linear Regression" content="This is the foundation of predictive analytics. Calculating price trends, stock forecasting, and trend analysis all start here." />
                </div>
            )
        }
    ];

    return <StoryEngine title="Module 5: Geometry of Data" steps={steps} />;
}
