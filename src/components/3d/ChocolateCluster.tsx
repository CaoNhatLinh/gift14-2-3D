import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '../../store/useExperienceStore';

const ChocolateMaterial: React.FC<{ color?: string }> = () => (
    <meshPhysicalMaterial
        color="#7B3F00" // Lighter "Cadbury" Milk Chocolate
        roughness={0.35} // Slightly rougher for realistic chocolate texture
        metalness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.15}
        emissive="#3E2723" // Subtle inner glow for richness
        emissiveIntensity={0.1}
        sheen={0.5}
        sheenColor="#FFCCBC" // Warm highlight
        envMapIntensity={2.0} // Stronger reflections
    />
);

const GoldLeaf: React.FC<{ position: [number, number, number]; rotation: [number, number, number]; scale: number }> = ({ position, rotation, scale }) => (
    <mesh position={position} rotation={rotation} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0.1}
            emissive="#FFB347"
            emissiveIntensity={0.3}
        />
    </mesh>
);

// White Chocolate Drizzle - tương phản với chocolate nâu
const WhiteDrizzle: React.FC<{ position: [number, number, number]; rotation: [number, number, number] }> = ({ position, rotation }) => (
    <mesh position={position} rotation={rotation}>
        <torusGeometry args={[0.18, 0.012, 12, 24]} />
        <meshStandardMaterial
            color="#FFF8E7"
            roughness={0.4}
            metalness={0.05}
            emissive="#FFF0D0"
            emissiveIntensity={0.1}
        />
    </mesh>
);

// Ruby Chocolate Accent - màu hồng đỏ đặc biệt
const RubyAccent: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <mesh position={position}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
            color="#E84C6F"
            roughness={0.3}
            metalness={0.15}
            emissive="#D14D72"
            emissiveIntensity={0.2}
        />
    </mesh>
);

const HeartBurst: React.FC<{ active: boolean }> = ({ active }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 15;

    // Seeded random để tránh lỗi React strict mode
    const seededRandom = (seed: number) => {
        const x = Math.sin(seed * 12.9898) * 43758.5453;
        return x - Math.floor(x);
    };

    const data = useMemo(() => {
        const p = new Float32Array(count * 3);
        const v = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const seed = i * 1000;
            const theta = seededRandom(seed + 1) * Math.PI * 2;
            const phi = Math.acos(2 * seededRandom(seed + 2) - 1);
            const speed = 0.05 + seededRandom(seed + 3) * 0.1;
            v[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            v[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            v[i * 3 + 2] = Math.cos(phi) * speed;
        }
        return { pos: p, vel: v };
    }, []);

    useFrame(() => {
        if (!pointsRef.current || !active) return;
        const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < count; i++) {
            attr.setXYZ(i,
                attr.getX(i) + data.vel[i * 3],
                attr.getY(i) + data.vel[i * 3 + 1],
                attr.getZ(i) + data.vel[i * 3 + 2]
            );
        }
        attr.needsUpdate = true;
    });

    if (!active) return null;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[data.pos, 3]}
                />
            </bufferGeometry>
            <pointsMaterial color="#ff4d6d" size={0.15} transparent opacity={0.8} />
        </points>
    );
};

const HeartGeometry = () => {
    const shape = useMemo(() => {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 0.5, y + 0.5);
        heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 0.5, y + 0.5);
        return heartShape;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.4,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1,
    }), []);

    return (
        <extrudeGeometry args={[shape, extrudeSettings]} />
    );
};

// Truffle Geometry with slight noise displacement could be done via shader or high-res geo, 
// strictly using simple primitives for performance now but with better material.

const Truffle: React.FC<{ position: [number, number, number], type: 'round' | 'cube' | 'heart', index?: number }> = ({ position, type, index = 0 }) => {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                {type === 'round' && <sphereGeometry args={[0.3, 32, 32]} />}
                {type === 'cube' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
                {type === 'heart' && <HeartGeometry />}

                <ChocolateMaterial />
            </mesh>

            {/* White Chocolate Drizzle - tương phản */}
            {index % 2 === 0 && (
                <WhiteDrizzle position={[0, 0.32, 0]} rotation={[0.5, 0.5, 0]} />
            )}

            {/* Gold Drizzle - truyền thống */}
            {index % 2 === 1 && (
                <mesh position={[0, 0.31, 0]} rotation={[0.5, 0.5, 0]}>
                    <torusGeometry args={[0.2, 0.015, 16, 32]} />
                    <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
                </mesh>
            )}

            {/* Ruby Chocolate Accent - điểm nhấn */}
            {type === 'heart' && (
                <>
                    <RubyAccent position={[0.15, 0.35, 0.1]} />
                    <RubyAccent position={[-0.1, 0.3, -0.08]} />
                </>
            )}
        </group>
    )
}

export const ChocolateCluster: React.FC<{ visible: boolean }> = ({ visible }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [bursting, setBursting] = useState(false);

    // Interaction Refs
    const shakeRef = useRef(0);
    const grabRotation = useRef(new THREE.Euler());
    const grabMouse = useRef(new THREE.Vector2());

    const setIsInspecting = useExperienceStore((s) => s.setIsInspecting);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // WIND SWAY SIMULATION
        // More complex organic movement
        const time = state.clock.elapsedTime;

        // Base Sway (Wind)
        const windX = Math.sin(time * 0.8) * 0.05; // Slow large sway
        const windZ = Math.cos(time * 1.1) * 0.03;
        const microJitter = Math.sin(time * 4) * 0.005; // Realistic micro-vibration

        // Apply
        if (!isHolding && !hovered) {
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, windX + microJitter, delta * 2);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, windZ, delta * 2);
        }

        // Jitter / Shake effect logic
        if (shakeRef.current > 0) {
            groupRef.current.position.x += (Math.random() - 0.5) * shakeRef.current;
            groupRef.current.position.y += (Math.random() - 0.5) * shakeRef.current;
            shakeRef.current *= 0.9;
            if (shakeRef.current < 0.001) {
                shakeRef.current = 0;
                // Reset pos is handled relative to parent group, so just zero out local drift
                groupRef.current.position.set(0, 0, 0);
            }
        }

        // Manual Rotation / Tilt Logic (RELATIVE)
        if (isHolding) {
            const deltaX = (state.mouse.x - grabMouse.current.x) * Math.PI;
            const deltaY = (state.mouse.y - grabMouse.current.y) * Math.PI;

            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, grabRotation.current.y + deltaX, 0.2);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, grabRotation.current.x - deltaY, 0.2);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
        } else if (hovered) {
            const targetRotX = state.mouse.y * 0.4;
            const targetRotZ = -state.mouse.x * 0.4;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
        }

        const baseScale = visible ? 1 : 0;
        let scaleFactor = 1;
        if (isHolding) scaleFactor = 1.3;
        else if (hovered) scaleFactor = 1.15;

        const targetScaleValue = baseScale * scaleFactor;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScaleValue, targetScaleValue, targetScaleValue), delta * 4);

        if (!visible && groupRef.current.scale.x < 0.01) {
            // Optional: cull logic if needed, but keeping mounted avoids lag
        }
    });

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHolding(true);
        setIsInspecting(true);
        if (groupRef.current) {
            grabRotation.current.copy(groupRef.current.rotation);
            grabMouse.current.copy(e.pointer);
        }
    };

    const handlePointerUp = () => {
        setIsHolding(false);
        setIsInspecting(false);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setClickCount(prev => prev + 1);
        shakeRef.current = 0.15;
        setBursting(true);
        setTimeout(() => setBursting(false), 800);
    };

    return (
        <group
            ref={groupRef}
            position={[0, 0, 0]}
            scale={0}
            onPointerOver={() => { setHovered(true); document.body.style.cursor = 'grab'; }}
            onPointerOut={() => {
                setHovered(false);
                setIsHolding(false);
                setIsInspecting(false);
                document.body.style.cursor = 'auto';
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={handleClick}
        >
            <pointLight color="#ffb7c5" intensity={hovered ? 2.5 : 0} distance={3} decay={2} position={[0, 0, 0.5]} />
            <Float
                speed={isHolding ? 0 : (hovered ? 4 : 2.2)}
                rotationIntensity={isHolding ? 0 : (hovered ? 1.5 : 0.6)}
                floatIntensity={isHolding ? 0 : (hovered ? 1 : 0.4)}
            >
                <HeartBurst active={bursting} />
                {clickCount >= 3 && (
                    <group position={[0, 1.4, 0]}>
                        <mesh position={[0, 0, -0.01]}>
                            <planeGeometry args={[1.8, 0.4]} />
                            <meshBasicMaterial color="black" transparent opacity={0.5} />
                        </mesh>
                        <Text fontSize={0.12} color="#fae0e4" maxWidth={2} textAlign="center" anchorX="center" anchorY="middle">
                            You make my life sweet
                        </Text>
                    </group>
                )}

                {/* 3 Truffles Arrangement */}
                <group rotation={[Math.PI, 0, 0]} scale={0.9}>
                    <group position={[0, -0.5, 0]}>
                        {/* Center Heart */}
                        <Truffle position={[0, 0, 0]} type='heart' />

                        {/* Side Round Truffle Left */}
                        <group position={[-0.6, 0.2, 0.2]} rotation={[0, 0, 0.2]}>
                            <Truffle position={[0, 0, 0]} type='round' />
                            <GoldLeaf position={[0, 0.32, 0]} rotation={[0, 0, 0]} scale={0.1} />
                        </group>

                        {/* Side Round Truffle Right */}
                        <group position={[0.6, 0.2, -0.2]} rotation={[0, 0, -0.2]}>
                            <Truffle position={[0, 0, 0]} type='round' />
                        </group>
                    </group>
                </group>

                {/* Ribbon */}
                <mesh position={[0, 0, 0.25]} rotation={[0, 0, 0.3]}>
                    <torusGeometry args={[0.5, 0.03, 16, 100, Math.PI * 0.8]} />
                    <meshStandardMaterial color="#A21B47" roughness={0.3} emissive="#4A0E1C" emissiveIntensity={0.2} />
                </mesh>
            </Float>
        </group>
    );
};
