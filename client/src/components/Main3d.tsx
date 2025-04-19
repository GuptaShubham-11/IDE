import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text, Trail } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

function Cube() {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.2;
      cubeRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  const texts = ['Collaboration', 'Code', '{}', '</>', 'Editor', 'Video Call'];

  const positions: [number, number, number][] = [
    [0, 0, -2.8],
    [0, 0, 2.8],
    [0, 2.8, 0],
    [0, -2.8, 0],
    [2.8, 0, 0],
    [-2.8, 0, 0],
  ];

  const rotations: [number, number, number, THREE.EulerOrder?][] = [
    [0, Math.PI, 0],
    [0, 0, 0],
    [-Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
  ];

  return (
    <mesh ref={cubeRef}>
      <RoundedBox args={[5, 5, 5]} radius={0.2} smoothness={9}>
        <meshStandardMaterial
          color={'#121212'}
          metalness={0.8}
          roughness={0.1}
          emissive={'#121212'}
        />
      </RoundedBox>

      {texts.map((text, index) => (
        <Text
          key={index}
          position={positions[index]}
          rotation={rotations[index]}
          fontSize={0.65}
          color={'#F8F9FA'}
          outlineColor={'#F8F9FA'}
          outlineWidth={0.05}
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
          material-toneMapped={false}
          textAlign="center"
        >
          {text}
        </Text>
      ))}
    </mesh>
  );
}

function OrbitingStar({
  radius,
  speed,
  height,
  color,
  direction,
}: {
  radius: number;
  speed: number;
  height: number;
  color: string;
  direction: 'horizontal' | 'vertical' | 'diagonal1' | 'diagonal2';
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      const angle = Math.sin(t * 2) * height;
      const sinT = Math.sin(t);
      const cosT = Math.cos(t);

      const positions: Record<
        'horizontal' | 'vertical' | 'diagonal1' | 'diagonal2',
        [number, number, number]
      > = {
        horizontal: [radius * cosT, angle, radius * sinT],
        vertical: [angle, radius * cosT, radius * sinT],
        diagonal1: [radius * cosT, radius * sinT, angle],
        diagonal2: [-radius * cosT, radius * sinT, angle],
      };

      ref.current.position.set(...positions[direction]);
      ref.current.rotation.x += 0.04;
      ref.current.rotation.y += 0.06;
    }
  });

  return (
    <Trail width={0.45} color={color} length={3} attenuation={(t) => t * t}>
      <mesh ref={ref} position={[radius, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial emissive={color} color="white" />
      </mesh>
    </Trail>
  );
}

export default function Main3d() {
  return (
    <div className="w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[70vh] flex justify-center items-center">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <color attach="transparent" args={['#121212']} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.8}
            color="#ffffff"
            castShadow
          />
          <OrbitControls enableZoom={false} enableRotate={true} />
          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
          <Cube />
          <OrbitingStar
            radius={4}
            speed={0.6}
            height={1}
            color="#3B82F6"
            direction="horizontal"
          />
          <OrbitingStar
            radius={4}
            speed={0.35}
            height={1}
            color="#8B5CF6"
            direction="vertical"
          />
          <OrbitingStar
            radius={4}
            speed={0.5}
            height={1}
            color="#E07A5F"
            direction="diagonal1"
          />
          <OrbitingStar
            radius={4}
            speed={0.8}
            height={1}
            color="#3B82F6"
            direction="diagonal2"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
