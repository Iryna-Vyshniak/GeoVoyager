'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CameraControls, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

import Moon from './moon';
import Light from '@/components/light';
import TouristMarker from '@/components/tourist-marker';
import SelectedPlaceMarker from '@/components/selected-place-marker';

import { lon2xyz } from '@/lib/utils';
import { EarthProps } from '@/shared/shared.types';
import { TOURIST_DATA } from '@/shared/mock/tourist-spot-data';

const Earth = ({ selectedPlace }: EarthProps) => {
  const earthRef = useRef<THREE.Group | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const markerRef = useRef<THREE.Group | null>(null);
  // Додаємо стан для контролю обертання Землі
  const [shouldRotate, setShouldRotate] = useState<boolean>(true);
  const [isOccluded, setOccluded] = useState<boolean>(false);
  const [isInRange, setInRange] = useState<boolean>(false);
  const vec = new THREE.Vector3();

  // Завантажуємо текстури
  const dayTexture = useLoader(THREE.TextureLoader, '/assets/textures/earth-day8k.jpg');
  const nightTexture = useLoader(THREE.TextureLoader, '/assets/textures/earth-night.webp');
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/earth-normal.jpg');
  const displacementMap = useLoader(THREE.TextureLoader, '/assets/textures/earthbump1k.jpg');
  const specularMap = useLoader(THREE.TextureLoader, '/assets/textures/earthspec1k.jpg');
  const cloudTexture = useLoader(THREE.TextureLoader, '/assets/textures/fair_clouds_8k.jpg');

  const [hovered, setHovered] = useState<boolean>(false);

  // Налаштовуємо текстури для кращої якості
  dayTexture.anisotropy = 16;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.anisotropy = 16;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  cloudTexture.anisotropy = 16;
  cloudTexture.colorSpace = THREE.SRGBColorSpace;

  // Обираємо текстуру (день/ніч)
  const baseTexture = useMemo(
    () => (hovered ? nightTexture : dayTexture),
    [hovered, dayTexture, nightTexture]
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // Анімація масштабу Землі
  const { earthScale } = useSpring({
    earthScale: selectedPlace ? 1.1 : 1, // Збільшуємо Землю при обраному місці
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useEffect(() => {
    // Оновлення позиції камери для наближення до обраного місця
    if (selectedPlace && earthRef.current && cameraControlsRef.current) {
      // Вимикаємо обертання Землі
      setShouldRotate(false);
      // Обчислюємо позицію туристичної мітки (локальні координати Землі)
      const markerLocalPosition = lon2xyz(...selectedPlace.coordinates, 1);
      const markerWorldPosition = markerLocalPosition.clone();
      earthRef.current.localToWorld(markerWorldPosition); // Метод localToWorld перетворює локальні координати (де обчислення lon2xyz дає позицію мітки чи базову позицію камери) у глобальні, враховуючи поточне обертання Землі.

      // Обчислюємо базову позицію камери (відступ від мітки)
      const cameraLocalPosition = lon2xyz(...selectedPlace.coordinates, 4.5);
      const cameraWorldPosition = cameraLocalPosition.clone();
      earthRef.current.localToWorld(cameraWorldPosition);

      // Додаємо вертикальне зміщення для розташування камери "над" міткою - Додавання зміщення по осі Y забезпечує, що камера розташована вище мітки, а не збоку.
      cameraWorldPosition.y += 1.5;

      // Встановлюємо ціль (target) і позицію камери з урахуванням глобальних координат
      cameraControlsRef.current.setTarget(
        markerWorldPosition.x,
        markerWorldPosition.y,
        markerWorldPosition.z,
        true
      );
      cameraControlsRef.current.setPosition(
        cameraWorldPosition.x,
        cameraWorldPosition.y,
        cameraWorldPosition.z,
        true
      );

      // Після затримки (5 секунд) відновлюємо обертання Землі
      const timer = setTimeout(() => {
        setShouldRotate(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [selectedPlace]);

  // Постійне обертання Землі та хмар (тільки якщо shouldRotate === true)
  useFrame((state, delta) => {
    if (shouldRotate && earthRef.current) {
      earthRef.current.rotation.y += 0.25 * delta;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.005 * delta;
    }

    if (selectedPlace && markerRef.current) {
      const range = state.camera.position.distanceTo(markerRef.current.getWorldPosition(vec)) <= 10;
      if (range !== isInRange) setInRange(range);
    }
  });

  const isMarkerVisible = isInRange && !isOccluded;

  return (
    <>
      <animated.group
        ref={earthRef}
        scale={earthScale.to((s) => [s, s, s])}
        dispose={null}
      >
        <mesh
          castShadow
          receiveShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1, 64, 64]} />

          <meshPhongMaterial
            map={baseTexture}
            normalMap={normalMap}
            shininess={100}
            displacementMap={displacementMap}
            displacementScale={0.2}
            specularMap={specularMap}
            emissiveMap={nightTexture}
            emissive={0xffffff}
            emissiveIntensity={hovered ? 5 : 1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Хмари */}
        <mesh ref={cloudRef} scale={1.01}>
          {' '}
          {/* Трохи більше ніж Земля */}
          <sphereGeometry args={[1.02, 32, 32]} />
          <meshStandardMaterial
            map={cloudTexture}
            transparent
            opacity={0.5} // Зменшуємо щільність хмар
            depthWrite={false} // Запобігає неправильному відображенню
          />
        </mesh>
        {/* туристичні мітки */}
        {TOURIST_DATA.map((place, index) => {
          const { x, y, z } = lon2xyz(...place.coordinates);
          return <TouristMarker key={index} position={[x, y, z]} />;
        })}

        {/* Пульсуюча мітка з маркером для обраного місця */}
        {selectedPlace && (
          <SelectedPlaceMarker
            ref={markerRef}
            selectedPlace={selectedPlace}
            isVisible={isMarkerVisible}
            setOccluded={setOccluded}
          />
        )}

        <Moon />
      </animated.group>
      <CameraControls
        makeDefault
        ref={cameraControlsRef}
        minDistance={3.5} // Мінімальна відстань камери (захищає від сильного наближення)
        maxDistance={100} // Максимальна відстань камери (не дає камері сильно віддалятися)
        minPolarAngle={Math.PI / 4} // Обмеження нахилу камери (мінімальний кут)
        maxPolarAngle={Math.PI / 2} // Обмеження нахилу камери (максимальний кут)
        smoothTime={0.4} // Згладжування руху
      />
      <ambientLight intensity={0.4} />
      <Light />
      <SoftShadows samples={3} />
    </>
  );
};

export default Earth;
