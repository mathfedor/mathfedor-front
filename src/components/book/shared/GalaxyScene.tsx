'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface GalaxyPlanet {
  index: number;
  label: string;
  icon: string;
  /** 0..100 de progreso de la unidad. */
  pct: number;
  color: string;
}

/** Planeta = unidad. Su tamaño crece con el progreso; al tocarlo entra a la unidad. */
function Planet({
  planet,
  position,
  onPick,
}: {
  planet: GalaxyPlanet;
  position: [number, number, number];
  onPick: (index: number, position: [number, number, number]) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.004;
  });

  const radius = 0.8 + planet.pct / 200;

  const enter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = 'pointer';
  };
  const leave = () => {
    setHover(false);
    document.body.style.cursor = 'auto';
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPick(planet.index, position);
  };

  return (
    <group position={position}>
      <mesh ref={ref} scale={hover ? 1.18 : 1} onClick={click} onPointerOver={enter} onPointerOut={leave}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={hover ? 0.6 : 0.3}
          roughness={0.55}
          metalness={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.22, radius + 0.36, 48]} />
        <meshBasicMaterial
          color={planet.pct >= 100 ? '#F5C518' : '#FFFFFF'}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html center distanceFactor={12} position={[0, radius + 0.95, 0]}>
        <div className="galaxy-label" onClick={() => onPick(planet.index, position)}>
          <span className="gl-icon">{planet.icon}</span>
          <span className="gl-name">{planet.label}</span>
          <span className="gl-pct">{planet.pct}%</span>
        </div>
      </Html>
    </group>
  );
}

/** Sol central = marca Fedor. */
function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial color="#7B2FBE" emissive="#A864E8" emissiveIntensity={0.85} roughness={0.4} />
      </mesh>
      <Html center distanceFactor={14} position={[0, 2.5, 0]}>
        <div className="galaxy-sun-label">🚀 Galaxia del Saber</div>
      </Html>
    </group>
  );
}

/** Nave del jugador: idle en el sol y viaja al planeta elegido. */
function Ship({ target, onArrive }: { target: [number, number, number] | null; onArrive: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const arrived = useRef(false);
  useFrame(() => {
    if (!ref.current || !target) return;
    const tv = new THREE.Vector3(target[0], target[1], target[2]);
    ref.current.position.lerp(tv, 0.06);
    ref.current.lookAt(tv);
    if (!arrived.current && ref.current.position.distanceTo(tv) < 0.6) {
      arrived.current = true;
      onArrive();
    }
  });
  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.7, 16]} />
        <meshStandardMaterial color="#F5C518" emissive="#FF8C2A" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FF6B6B" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/** Escena 3D del universo Fedor. */
export default function GalaxyScene({
  planets,
  onSelect,
}: {
  planets: GalaxyPlanet[];
  onSelect: (index: number) => void;
}) {
  const R = 6;
  const [travel, setTravel] = useState<{ index: number; target: [number, number, number] } | null>(null);

  const handlePick = (index: number, position: [number, number, number]) => {
    if (!travel) setTravel({ index, target: position });
  };

  return (
    <Canvas camera={{ position: [0, 7, 13], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#050518']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#A864E8" />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={80} depth={40} count={3000} factor={4} fade speed={1} />
      <Sun />
      {planets.map((p, i) => {
        const a = (i / Math.max(1, planets.length)) * Math.PI * 2;
        const pos: [number, number, number] = [Math.cos(a) * R, Math.sin(i * 1.3) * 1.2, Math.sin(a) * R];
        return <Planet key={p.index} planet={p} position={pos} onPick={handlePick} />;
      })}
      <Ship
        target={travel ? travel.target : null}
        onArrive={() => {
          if (travel) onSelect(travel.index);
        }}
      />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={24} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
