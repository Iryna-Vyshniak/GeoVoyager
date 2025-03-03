'use client';

import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import AnimatedStars from './animated-stars';

const AnimatedSpace = () => {
  return (
    <div className='absolute inset-0 w-screen h-screen -z-10'>
      <Canvas
        shadows
        camera={{ position: [0, 0, 0], fov: 75 }}
        dpr={[1, 1.5]} // Оптимізація для мобільних
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          preserveDrawingBuffer: true, // Запобігає очищенню WebGL-контексту
        }}
        className='fixed inset-0 w-full h-full event-pointer-none remove-scrollbar'
      >
        {' '}
        <AnimatedStars />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enablePan={true}
          enableZoom={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
};

export default AnimatedSpace;
