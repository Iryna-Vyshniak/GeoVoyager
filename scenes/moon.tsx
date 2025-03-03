'use client';

import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { memo, useRef, useCallback } from 'react';
import * as THREE from 'three';

const Moon = memo(() => {
  const moonRef = useRef<THREE.Mesh | null>(null);
  const clockRef = useRef(new THREE.Clock()); // Create a reference to the clock

  const [moonTexture] = useTexture(['/assets/textures/moonmap1k.jpg']);
  const xAxis = 2.5; // orbit
  const updateMoonPosition = useCallback(() => {
    if (moonRef.current) {
      // Orbit Rotation
      moonRef.current.position.x = Math.sin(clockRef.current.getElapsedTime() * 0.1) * xAxis;
      moonRef.current.position.z = Math.cos(clockRef.current.getElapsedTime() * 0.1) * xAxis;
      // Axis Rotation
      moonRef.current.rotation.y += 0.002;
    }
  }, []);

  useFrame(() => {
    updateMoonPosition();
  });

  return (
    <mesh castShadow receiveShadow ref={moonRef} position={[xAxis, 0, 0]}>
      {/* Radius , X-axis , Y-axis */}
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshPhongMaterial
        map={moonTexture}
        emissiveMap={moonTexture}
        emissive={0xffffff}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
});

Moon.displayName = 'Moon';

export default Moon;
