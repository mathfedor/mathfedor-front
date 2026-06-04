'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Estrellas que pasan hacia la cámara (réplica del point cloud de `_cinInit`). */
function StreakStars() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const pos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = -Math.random() * 1000;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 2; i < arr.length; i += 3) {
      arr[i] += 6;
      if (arr[i] > 30) {
        arr[i] = -1000 + Math.random() * 100;
        arr[i - 2] = (Math.random() - 0.5) * 200;
        arr[i - 1] = (Math.random() - 0.5) * 200;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={0xffffff} size={1.2} sizeAttenuation />
    </points>
  );
}

/** Planeta destino que se acerca y gira (réplica del planet+halo de `_cinTick`). */
function ApproachingPlanet() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    if (ref.current.position.z < -40) ref.current.position.z += 0.45;
    ref.current.rotation.y += 0.005;
  });
  return (
    <group ref={ref} position={[0, 0, -200]}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />
        <meshStandardMaterial color={0x4d8aff} emissive={0x4d8aff} emissiveIntensity={0.4} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color={0xffd58a} transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/** Escena 3D de la intro cinemática del despegue. */
export default function CinematicScene() {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 2000 }} dpr={[1, 2]}>
      <color attach="background" args={[0x000010]} />
      <ambientLight color={0x88aaff} intensity={0.45} />
      <pointLight color={0xffe066} intensity={1.6} distance={500} position={[0, 0, -180]} />
      <StreakStars />
      <ApproachingPlanet />
    </Canvas>
  );
}
