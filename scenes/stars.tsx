'use client';

import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

const Stars = () => {
  const gaiaTexture = useLoader(THREE.TextureLoader, '/assets/textures/space-gaia.png');
  gaiaTexture.anisotropy = 16;
  gaiaTexture.colorSpace = THREE.SRGBColorSpace;
  gaiaTexture.mapping = THREE.EquirectangularReflectionMapping

  return (
    <mesh>
      <sphereGeometry args={[5, 128, 128]} />
      <meshBasicMaterial map={gaiaTexture} side={THREE.BackSide} />
    </mesh>
  );
};

export default Stars;
