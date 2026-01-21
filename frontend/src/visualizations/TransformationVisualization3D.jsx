import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

function GridFlood() {
    return (
        <Grid
            position={[0, -0.01, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={50}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
        />
    )
}

function TransformableCube({ matrixElements }) {
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            // matrixElements is a 3x3 matrix (array of 9, row-major or nested arrays)
            // Three.js uses 4x4 matrices column-major.
            // Let's assume input is [[a,b,c],[d,e,f],[g,h,i]] (Row major visual)

            // Unpack 3x3 into 4x4 identity-like
            // [ a b c 0 ]
            // [ d e f 0 ]
            // [ g h i 0 ]
            // [ 0 0 0 1 ]

            const [
                [a, b, c],
                [d, e, f],
                [g, h, i]
            ] = matrixElements;

            const m4 = new THREE.Matrix4();
            m4.set(
                a, b, c, 0,
                d, e, f, 0,
                g, h, i, 0,
                0, 0, 0, 1
            );

            meshRef.current.matrix.copy(m4);
            meshRef.current.matrixAutoUpdate = false;
        }
    });

    return (
        <group>
            {/* The transformed object */}
            <mesh ref={meshRef}>
                <boxGeometry args={[2, 2, 2]} />
                <meshNormalMaterial transparent opacity={0.8} />
                <Edges color="white" />
            </mesh>

            {/* Original wireframe ghost for comparison */}
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

export default function TransformationVisualization3D({ matrix }) {
    return (
        <div style={{ width: '100%', height: '500px', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />
                <GridFlood />
                <OrbitControls makeDefault />
                <axesHelper args={[5]} />

                <TransformableCube matrixElements={matrix} />

                <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
                    Original (Ghost) vs Transformed (Solid)
                </Text>
            </Canvas>
        </div>
    )
}
