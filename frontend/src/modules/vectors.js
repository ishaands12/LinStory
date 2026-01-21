import React from 'react';
import VectorVisualization from '../visualizations/VectorVisualization';

export const vectorsStory = [
    {
        title: "Introduction to Vectors",
        content: "A vector is more than just an arrow. It's a movement in space. In computer science, it's a list of numbers (like a row in a database). In physics, it's a force. Here, we visualize it as a step: Right and Up.",
        visualization: <VectorVisualization v1={[2, 3]} v2={[0, 0]} showResult={false} />,
        controls: <div style={{ padding: '1rem' }}>Try imagining walking 2 steps East, 3 steps North.</div>
    },
    // ... (rest of the story needs to be ported)
];
