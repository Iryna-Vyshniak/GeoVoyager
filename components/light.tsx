'use client';

import { useRef } from 'react';
import { easing } from 'maath';
import { Group, Object3DEventMap } from 'three';
import { useFrame } from '@react-three/fiber';

// Джерело світла, яке освітлює об'єкти в сцені
function Light() {
  const ref = useRef<Group<Object3DEventMap> | null>(null); // Створюємо посилання на групу об'єктів Three.js

  useFrame((state, delta) => {
    if (ref.current) {
      easing.dampE(
        ref.current.rotation,
        [(state.pointer.y * Math.PI) / 50, (state.pointer.x * Math.PI) / 20, 0],
        0.2, // Час згасання (чим менше, тим плавніше)
        delta
      );
    }
  });

  return (
    <group ref={ref}>
      <directionalLight
        intensity={5}
        position={[5, 5, -8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={-2}
        shadow-camera-bottom={2}
        shadow-camera-near={0.1}
        shadow-camera-far={7}
        shadow-bias={-0.001}
      >
        <orthographicCamera attach='shadow-camera' args={[-8.5, 8.5, 8.5, -8.5, 0.1, 20]} />
      </directionalLight>
    </group>
  );
}

export default Light;
