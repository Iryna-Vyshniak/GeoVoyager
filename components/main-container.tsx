'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Preload } from '@react-three/drei';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSpring, animated } from '@react-spring/web';

import Earth from '@/scenes/earth';
import { TOURIST_DATA } from '@/shared/mock/tourist-spot-data';
import { useLoadingStore } from '@/shared/store/loading-store';
import { useModalStore } from '@/shared/store/modal-store';
import AnimatedLoading from './animated-loading';
import { usePlaceStore } from '@/shared/store/place-store';
import { params } from '@/lib/utils';
import Light from './light';

const MainContainer = () => {
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const { isLoading, progress } = useLoadingStore();
  const { isOpenModal, setIsOpenModal } = useModalStore();
  const pathname = usePathname();

  const selectRandomPlace = () => {
    const randomIndex = Math.floor(Math.random() * TOURIST_DATA.length);
    const place = TOURIST_DATA[randomIndex];
    setSelectedPlace(place);
  };

  const [planetSpring, api] = useSpring(() => ({
    opacity: isOpenModal ? 0 : 1,
    scale: isOpenModal ? 0 : 1,
    config: { mass: 2, tension: 150, friction: 25 },
  }));

  // Оновлюємо анімацію при зміні маршруту або isOpenModal
  useEffect(() => {
    api.start({
      opacity: isOpenModal ? 0 : 1,
      scale: isOpenModal ? 0 : 1,
      immediate: pathname === '/', // Негайно встановлюємо значення при поверненні на головну
    });
    setSelectedPlace(null);
  }, [isOpenModal, pathname, api, setSelectedPlace]);

  return (
    <animated.div
      style={planetSpring}
      className='relative w-screen h-screen inset-0 z-10 remove-scrollbar pointer-events-none'
    >
      <Canvas
        shadows
        camera={{
          fov: 45, // Кут огляду камери (Field of View) – 55 градусів
          // near: 0.55, // Мінімальна дистанція від камери до об'єкту
          // far: 10, // Максимальна дистанція від камери до об'єкту
          position: [0, 0, 3.5], // Початкова позиція камери в 3D-просторі,
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
        className='fixed inset-0 w-screen h-screen pointer-events-auto'
      >
        <Suspense
          fallback={
            <Html>
              <p className='text-center'>Loading...</p>
            </Html>
          }
        >
          <Earth selectedPlace={selectedPlace} />
          <Light/>
          <OrbitControls
            enableDamping //  камера плавно зупинятиметься після відпускання миші
            dampingFactor={0.05}
            enablePan
            enableZoom
            enableRotate
            minDistance={0.055}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={params.speedFactor}
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
          className={`absolute left-1/2 -translate-x-1/2 bottom-10 z-50 w-44 h-11 px-4 py-2 rounded-lg shadow-md hover:shadow-sm focus:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-450 ease-in-out pointer-events-auto
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
          className={`absolute left-1/2 -translate-x-1/2 bottom-10 z-50 w-44 h-11 px-4 py-2 rounded-lg shadow-md hover:shadow-sm focus:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-450 ease-in-out pointer-events-auto
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
