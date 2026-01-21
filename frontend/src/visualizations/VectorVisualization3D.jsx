import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Billboard } from '@react-three/drei';
import * as THREE from 'three';

function Arrow({ start, end, color }) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    if (length < 0.1) return null; // Don't render tiny arrows

    return (
        <group position={start} rotation={[0, 0, 0]}>
            <arrowHelper args={[direction.normalize(), new THREE.Vector3(0, 0, 0), length, color, 0.5, 0.3]} />
        </group>
    );
}

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

function SpanPlane({ v1, v2 }) {
    // Only render if we have exactly 2 vectors for a plane
    if (!v1 || !v2) return null;

    const quaternion = React.useMemo(() => {
        const vec1 = new THREE.Vector3(...v1);
        const vec2 = new THREE.Vector3(...v2);
        const normal = new THREE.Vector3().crossVectors(vec1, vec2).normalize();
        return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    }, [v1, v2]);

    return (
        <mesh position={[0, 0, 0]} quaternion={quaternion}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
    )
}

export default function VectorVisualization3D({ vectors = [], showSpan = false }) {
    return (
        <div style={{ width: '100%', height: '500px', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <GridFlood />
                <OrbitControls makeDefault />
                <axesHelper args={[5]} />

                {vectors.map((v, i) => (
                    <React.Fragment key={i}>
                        <Arrow
                            start={new THREE.Vector3(...(v.start || [0, 0, 0]))}
                            end={new THREE.Vector3(...v.end)}
                            color={v.color || 'white'}
                        />
                        <Billboard
                            position={[v.end[0], v.end[1] + 0.5, v.end[2]]}
                            follow={true}
                            lockX={false}
                            lockY={false}
                            lockZ={false}
                        >
                            <Text
                                fontSize={0.5}
                                color={v.color || 'white'}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {v.label}
                            </Text>
                        </Billboard>
                    </React.Fragment>
                ))}

                {showSpan && vectors.length >= 2 && (
                    <SpanPlane v1={vectors[0].end} v2={vectors[1].end} />
                )}
            </Canvas>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', pointerEvents: 'none' }}>
                Map: X(Red), Y(Green), Z(Blue). Left Click to Rotate, Right Click to Pan.
            </div>
        </div>
    );
}
