'use client';

import * as THREE from 'three';

import { useLoader } from '@react-three/fiber';

const Stars = () => {
  const texture = useLoader(THREE.TextureLoader, '/assets/textures/stars.jpg');
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default Stars;
