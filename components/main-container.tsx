'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';

import AnimatedStars from './animated-stars';
import Earth from '@/scenes/earth';
import { Place } from '@/shared/shared.types';
import { TOURIST_DATA } from '@/shared/mock/tourist-spot-data';

const MainContainer = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const selectRandomPlace = () => {
    const randomIndex = Math.floor(Math.random() * TOURIST_DATA.length);
    const place = TOURIST_DATA[randomIndex];
    setSelectedPlace(place);
  };
  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 55, // Кут огляду камери (Field of View) – 55 градусів
          near: 0.1, // Мінімальна дистанція від камери до об'єкту
          far: 1000, // Максимальна дистанція від камери до об'єкту
          position: [0, 0, 5], // Початкова позиція камери в 3D-просторі
        }}
        dpr={[1, 2]} // Налаштування Device Pixel Ratio: підтримка масштабування від 1 до 2 (для різних дисплеїв, зокрема Retina)
        gl={{
          antialias: false, // Вимикаємо антиаліасинг для потенційного покращення продуктивності
          preserveDrawingBuffer: true, // Зберігаємо буфер малювання, що може бути корисним для збереження скріншотів або пост-обробки
          alpha: true, //фон transparent
        }}
        fallback={<div>Sorry no WebGL supported!</div>}
        className='absolute inset-0 w-screen h-screen z-20 remove-scrollbar'
      >
        <Suspense fallback='loading'>
          <AnimatedStars />
          <Earth selectedPlace={selectedPlace} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={3.5}
            maxDistance={100}
            autoRotate
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 4} // Дозволяє більший кут нахилу
            maxPolarAngle={Math.PI / 1.5}
          />
          <Preload all />
        </Suspense>
      </Canvas>
      <button
        onClick={selectRandomPlace}
        className='absolute left-1/2 -translate-x-1/2 bottom-10 z-50 w-44 h-11 px-4 py-2 bg-btn-primary text-primary rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-450  ease-in-out hover:bg-btn-secondary cursor-pointer'
        aria-label='Select a random tourist place'
        tabIndex={0}
      >
        Select Tourist Place
      </button>
    </>
  );
};

export default MainContainer;
