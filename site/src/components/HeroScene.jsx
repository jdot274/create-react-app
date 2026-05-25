import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

function FloatingOrb({ position, color, speed = 1, distort = 0.4, radius = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function WireframeTorus({ position, color }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.4;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[0.8, 0.25, 16, 60]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 1200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const palette = [
      [0.4, 0.2, 1.0],
      [0.2, 0.6, 1.0],
      [1.0, 0.3, 0.7],
      [0.3, 1.0, 0.8],
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c[0];
      arr[i * 3 + 1] = c[1];
      arr[i * 3 + 2] = c[2];
    }
    return arr;
  }, []);

  const points = useRef();
  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function OrbitalRing({ radius, speed, color, tilt }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.z = state.clock.elapsedTime * speed;
  });
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return pts;
  }, [radius]);

  return (
    <group ref={group} rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
    </group>
  );
}

function CentralCore() {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.5;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#4c1d95"
        emissiveIntensity={1}
        metalness={1}
        roughness={0}
        wireframe={false}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#7c3aed" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#2563eb" />
      <pointLight position={[0, 10, -10]} intensity={1} color="#db2777" />

      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
      <ParticleField />

      <CentralCore />
      <OrbitalRing radius={2} speed={0.4} color="#7c3aed" tilt={Math.PI / 6} />
      <OrbitalRing radius={2.8} speed={-0.3} color="#2563eb" tilt={-Math.PI / 4} />
      <OrbitalRing radius={3.6} speed={0.2} color="#db2777" tilt={Math.PI / 3} />

      <FloatingOrb position={[-3.5, 1.5, -2]} color="#7c3aed" speed={0.8} radius={0.5} distort={0.5} />
      <FloatingOrb position={[3.5, -1, -1]} color="#2563eb" speed={1.2} radius={0.6} distort={0.3} />
      <FloatingOrb position={[2, 2.5, -3]} color="#db2777" speed={0.6} radius={0.4} distort={0.6} />
      <FloatingOrb position={[-2.5, -2, -2]} color="#059669" speed={1} radius={0.35} distort={0.45} />

      <WireframeTorus position={[4, 0, -4]} color="#7c3aed" />
      <WireframeTorus position={[-4, 1, -3]} color="#06b6d4" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
