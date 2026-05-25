import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Box,
  Sphere,
  Torus,
  Octahedron,
  MeshWobbleMaterial,
  MeshDistortMaterial,
  Environment,
  ContactShadows,
  Float,
  Text3D,
  Center,
} from '@react-three/drei';
import * as THREE from 'three';

function RotatingBox({ position, color, speed = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.6;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.4;
  });
  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Box ref={mesh} position={position} args={[1, 1, 1]}>
        <MeshWobbleMaterial color={color} factor={0.3} speed={2} metalness={0.8} roughness={0.1} />
      </Box>
    </Float>
  );
}

function RotatingSphere({ position, color, distort = 0.4 }) {
  return (
    <Float speed={2} floatIntensity={1}>
      <Sphere position={position} args={[0.7, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={3}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  );
}

function SpinningTorus({ position, color }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.8;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.5;
  });
  return (
    <Float speed={1} floatIntensity={0.8}>
      <Torus ref={mesh} position={position} args={[0.6, 0.2, 16, 60]}>
        <meshStandardMaterial color={color} metalness={1} roughness={0} />
      </Torus>
    </Float>
  );
}

function FloatingOctahedron({ position, color }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.7;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={2.5} floatIntensity={1.2}>
      <Octahedron ref={mesh} position={position} args={[0.65]}>
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.6} />
      </Octahedron>
    </Float>
  );
}

function GridFloor() {
  const grid = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 20, 20);
    return geo;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <primitive object={grid} />
      <meshStandardMaterial color="#1a1a2e" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

export default function Scene3DPlayground() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 55 }}
      gl={{ antialias: true }}
      shadows
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow color="#7c3aed" />
      <pointLight position={[-8, 5, -5]} intensity={1.5} color="#2563eb" />
      <pointLight position={[8, -2, 5]} intensity={1} color="#db2777" />

      <RotatingBox position={[-3.5, 0, 0]} color="#7c3aed" speed={0.8} />
      <RotatingSphere position={[-1.2, 0.3, 0]} color="#2563eb" distort={0.5} />
      <SpinningTorus position={[1.2, 0, 0]} color="#06b6d4" />
      <FloatingOctahedron position={[3.5, 0.2, 0]} color="#db2777" />

      <GridFloor />
      <ContactShadows position={[0, -2.4, 0]} opacity={0.4} scale={15} blur={2} far={4} />

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
