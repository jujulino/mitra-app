"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// Warm, joyful palette — taps cycle through these.
const PALETTE = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c780ff", "#ff9f45"];

type Shape = "ball" | "box" | "gem";

function Toy({
  position,
  color: initial,
  shape,
  onPop,
}: {
  position: [number, number, number];
  color: string;
  shape: Shape;
  onPop: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const pop = useRef(0); // spring value, eased back to 0 each frame
  const spin = useRef(0.2 + Math.random() * 0.5);
  const [color, setColor] = useState(initial);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += spin.current * delta;
    pop.current = THREE.MathUtils.lerp(pop.current, 0, Math.min(delta * 6, 1));
    m.scale.setScalar(1 + pop.current * 0.55);
  });

  const handleTap = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    pop.current = 1; // bounce
    setColor(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    onPop();
  };

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh
        ref={mesh}
        position={position}
        castShadow
        onClick={handleTap}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        {shape === "ball" ? (
          <sphereGeometry args={[0.7, 48, 48]} />
        ) : shape === "box" ? (
          <boxGeometry args={[1.1, 1.1, 1.1]} />
        ) : (
          <dodecahedronGeometry args={[0.75, 0]} />
        )}
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Scene({ onPop }: { onPop: () => void }) {
  return (
    <>
      <color attach="background" args={["#fef6ff"]} />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-6, 3, -3]} intensity={0.5} color="#ffd9a0" />

      {/* Soft round floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#fff3e0" roughness={1} />
      </mesh>
      <ContactShadows position={[0, -1.58, 0]} opacity={0.35} scale={16} blur={2.6} far={4} />

      <Toy position={[-2.4, 0.1, 0]} color="#ff6b6b" shape="ball" onPop={onPop} />
      <Toy position={[0, 0.4, 0]} color="#ffd93d" shape="box" onPop={onPop} />
      <Toy position={[2.4, 0.1, 0]} color="#4d96ff" shape="gem" onPop={onPop} />
    </>
  );
}

export default function MitraRoom({ onPop }: { onPop: () => void }) {
  return (
    <div className="absolute inset-0">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 7], fov: 50 }}>
        <Scene onPop={onPop} />
      </Canvas>
    </div>
  );
}
