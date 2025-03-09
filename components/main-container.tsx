'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import Link from 'next/link';
import { useSpring, animated } from '@react-spring/web';

import AnimatedStars from './animated-stars';
import Earth from '@/scenes/earth';
import { TOURIST_DATA } from '@/shared/mock/tourist-spot-data';
import { useLoadingStore } from '@/shared/store/loading-store';
import { useModalStore } from '@/shared/store/modal-store';
import AnimatedLoading from './animated-loading';
import { usePlaceStore } from '@/shared/store/place-store';

const MainContainer = () => {
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const { isLoading, progress } = useLoadingStore();
  const { isOpenModal, setIsOpenModal } = useModalStore();

  const selectRandomPlace = () => {
    const randomIndex = Math.floor(Math.random() * TOURIST_DATA.length);
    const place = TOURIST_DATA[randomIndex];
    setSelectedPlace(place);
  };

  const planetSpring = useSpring({
    opacity: isOpenModal ? 0 : 1,
    scale: isOpenModal ? 0 : 1,
    config: { mass: 2, tension: 150, friction: 25 },
  });

  return (
    <animated.div
      style={{
        ...planetSpring,
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20,
      }}
      className='remove-scrollbar'
    >
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
        fallback={
          <p className='text-primary text-center text-balance'>Sorry no WebGL supported!</p>
        }
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
      {isLoading && <AnimatedLoading progress={progress} />}
      {!selectedPlace ? (
        <button
          onClick={selectRandomPlace}
          disabled={isLoading} // ✅ Disable when loading
          className={`absolute left-1/2 -translate-x-1/2 bottom-10 z-50 w-44 h-11 px-4 py-2 rounded-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-450 ease-in-out
            ${
              isLoading
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed pointer-events-none'
                : 'bg-btn-primary text-primary hover:bg-btn-secondary cursor-pointer'
            }`}
          aria-label='Select a random tourist place'
          tabIndex={isLoading ? -1 : 0} // ✅ Remove from tab navigation when disabled
        >
          {isLoading ? 'Wait please...' : 'Select Tourist Place'}
        </button>
      ) : (
        <Link
          href={`/destinations/${selectedPlace.name}`}
          className={`absolute left-1/2 -translate-x-1/2 bottom-10 z-50 w-44 h-11 px-4 py-2 rounded-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-450 ease-in-out
            ${
              isLoading
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed pointer-events-none'
                : 'bg-btn-primary text-primary hover:bg-btn-secondary cursor-pointer'
            }`}
          aria-label='Show tourist place'
          onClick={() => setIsOpenModal(true)}
          tabIndex={isLoading ? -1 : 0} // ✅ Remove from tab navigation when disabled
        >
          {isLoading ? 'Wait please...' : 'Show Tourist Place'}
        </Link>
      )}
    </animated.div>
  );
};

export default MainContainer;
