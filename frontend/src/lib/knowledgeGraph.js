export const nodes = [
    { id: 'vectors', label: 'Vectors', type: 'core', route: '/story/vectors' },
    { id: 'matrices', label: 'Matrices', type: 'core', route: '/story/matrices' },
    { id: 'systems', label: 'Systems of Equations', type: 'core', route: '/story/systems' }, // New
    { id: 'dot_product', label: 'Dot Product', type: 'concept', route: '/story/vectors' },
    { id: 'determinant', label: 'Determinant', type: 'concept', route: '/story/matrices' },
    { id: 'eigenvectors', label: 'Eigenvectors', type: 'advanced', route: '/story/matrices' },
    { id: 'linear_trans', label: 'Linear Transformations', type: 'core', route: '/story/matrices' },
    { id: 'basis', label: 'Basis Vectors', type: 'core', route: '/story/basis' },
    { id: 'data', label: 'Data & Regression', type: 'application', route: '/story/data' },
    { id: 'svd', label: 'SVD & Compression', type: 'advanced', route: '/story/advanced' },
];

export const edges = [
    { source: 'vectors', target: 'dot_product', type: 'contains' },
    { source: 'vectors', target: 'linear_trans', type: 'prerequisite' },
    { source: 'linear_trans', target: 'matrices', type: 'is_a' },
    { source: 'matrices', target: 'determinant', type: 'contains' },
    { source: 'matrices', target: 'systems', type: 'application' }, // Matrices solve Systems
    { source: 'matrices', target: 'eigenvectors', type: 'contains' },
    { source: 'determinant', target: 'eigenvectors', type: 'related' },
    { source: 'linear_trans', target: 'basis', type: 'related' },
    { source: 'matrices', target: 'data', type: 'application' },
    { source: 'vectors', target: 'data', type: 'prerequisite' },
    { source: 'matrices', target: 'svd', type: 'application' },
    { source: 'eigenvectors', target: 'svd', type: 'related' }
];

export function getRelatedConcepts(nodeId) {
    const direct = edges.filter(e => e.source === nodeId || e.target === nodeId);
    return direct.map(e => {
        const otherId = e.source === nodeId ? e.target : e.source;
        return {
            ...nodes.find(n => n.id === otherId),
            relation: e.type
        };
    });
}
