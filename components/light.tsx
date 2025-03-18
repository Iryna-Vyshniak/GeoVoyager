'use client';

import { useRef } from 'react';
import { Group, Object3DEventMap } from 'three';

function Light() {
  const ref = useRef<Group<Object3DEventMap> | null>(null);

  return (
    <group ref={ref}>
      <directionalLight
        intensity={5}
        position={[5, 0, 0]} // Світло справа
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.1}
        shadow-camera-far={15}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 20]} />
      </directionalLight>
    </group>
  );
}

export default Light;
