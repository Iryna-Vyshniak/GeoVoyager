'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

import { TouristMarkerProps } from '@/shared/shared.types';

const TouristMarker = ({ position }: TouristMarkerProps) => {
  const markerRef = useRef<THREE.Mesh | null>(null);

  const { scale } = useSpring({
    scale: 1.2,
    from: { scale: 1 },
    loop: { reverse: true },
    config: { tension: 100, friction: 20 },
  });

  return (
    <animated.mesh ref={markerRef} position={position} scale={scale.to((s) => [s, s, s])}>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshStandardMaterial color='#0000ff' emissive='#4000ff' />
    </animated.mesh>
  );
};

export default TouristMarker;
