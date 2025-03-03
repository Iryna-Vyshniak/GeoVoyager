'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const AnimatedStars = () => {
  const starsRef = useRef<THREE.Points | null>(null);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += delta * 0.0001;
      starsRef.current.rotation.y += delta * 0.0001;
      starsRef.current.rotation.z += delta * 0.0001;
    }
  });

  return (
    <Stars ref={starsRef} radius={100} depth={50} count={10000} factor={4} saturation={0} fade />
  );
};

export default AnimatedStars;
