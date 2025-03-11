'use client';

import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const UpperAtmosphere = () => {
  const texture = useLoader(THREE.TextureLoader, '/assets/textures/atmosphere.jpg');
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default UpperAtmosphere;
