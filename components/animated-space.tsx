'use client';

import React, { ReactNode, Suspense } from 'react';
import { Html, OrbitControls, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

const AnimatedSpace = ({ children }: { children: ReactNode }) => {
  return (
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.55,
        far: 100,
        position: [0, -1, 5],
      }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        preserveDrawingBuffer: true,
        alpha: true,
      }}
      fallback={<p className='text-primary text-center text-balance'>Sorry no WebGL supported!</p>}
      className='fixed inset-0 w-screen h-screen remove-scrollbar -z-20 overflow-hidden pointer-events-auto'
    >
      <Suspense
        fallback={
          <Html>
            <p className='text-center'>Loading...</p>
          </Html>
        }
      >
        {children}

        <ambientLight intensity={0.5} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={1}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.25}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default AnimatedSpace;
