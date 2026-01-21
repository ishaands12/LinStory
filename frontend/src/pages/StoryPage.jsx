import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load modules
const VectorsModule = React.lazy(() => import('../modules/VectorsModule'));
const MatricesModule = React.lazy(() => import('../modules/MatricesModule'));
const SystemsModule = React.lazy(() => import('../modules/SystemsModule'));
const BasisModule = React.lazy(() => import('../modules/BasisModule'));
const DataModule = React.lazy(() => import('../modules/DataModule'));
const SVDModule = React.lazy(() => import('../modules/SVDModule'));

export default function StoryPage() {
    const { topicId } = useParams();

    let ModuleComponent;
    switch (topicId) {
        case 'vectors': ModuleComponent = VectorsModule; break;
        case 'matrices': ModuleComponent = MatricesModule; break;
        case 'systems': ModuleComponent = SystemsModule; break;
        case 'basis': ModuleComponent = BasisModule; break;
        case 'data': ModuleComponent = DataModule; break;
        case 'advanced': ModuleComponent = SVDModule; break;
        default: ModuleComponent = () => <div>Module '{topicId}' not found.</div>; break;
    }

    return (
        <Layout>
            <div style={{ padding: '2rem 0' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>← Back to Home</Link>

                <ErrorBoundary>
                    <Suspense fallback={<div style={{ color: 'white' }}>Loading Module...</div>}>
                        <ModuleComponent />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </Layout>
    );
}
