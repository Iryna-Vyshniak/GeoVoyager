import { useRef } from 'react';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';
import { Html } from '@react-three/drei';

import { TouristMarkerProps } from '@/shared/shared.types';

const TouristMarker = ({ position, place, planetRef }: TouristMarkerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const isHiddenRef = useRef(false);

  const { scale } = useSpring({
    scale: 1.2,
    from: { scale: 1 },
    loop: { reverse: true },
    config: { tension: 100, friction: 20 },
  });

  return (
    <group ref={groupRef} position={position}>
      <animated.mesh scale={scale.to((s) => [s, s, s])}>
        <sphereGeometry args={[0.01, 16, 16]} />
        <meshStandardMaterial color='#ff0000' emissive='#ff0000' />
      </animated.mesh>
      <Html
        as='div'
        center
        distanceFactor={1.8}
        occlude={[planetRef]}
        style={{
          transition: 'opacity 0.5s',
          opacity: isHiddenRef.current ? 0 : 1,
          pointerEvents: isHiddenRef.current ? 'none' : 'auto',
        }}
      >
        <p className='text-base text-primary drop-shadow-sm whitespace-nowrap transform -translate-y-6'>
          {place.name}
        </p>
      </Html>
    </group>
  );
};

export default TouristMarker;
