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
        position={[5, 5, -8]} // Позиція джерела світла
        castShadow // Увімкнення тіней
        intensity={5} // Інтенсивність світла
        shadow-mapSize={2048} // Роздільна здатність карти тіней (чим більше, тим якісніші тіні)
        shadow-bias={-0.001} // Маленька зміна для виправлення артефактів тіней (shadow acne)
      >
        <orthographicCamera attach='shadow-camera' args={[-8.5, 8.5, 8.5, -8.5, 0.1, 20]} />
      </directionalLight>
    </group>
  );
}

export default Light;
