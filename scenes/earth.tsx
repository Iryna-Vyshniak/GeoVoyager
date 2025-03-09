'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';

import Moon from './moon';
import Light from '@/components/light';
import TouristMarker from '@/components/tourist-marker';
import SelectedPlaceMarker from '@/components/selected-place-marker';

import { lon2xyz } from '@/lib/utils';
import { EarthProps } from '@/shared/shared.types';
import { TOURIST_DATA } from '@/shared/mock/tourist-spot-data';
import { useLoadingStore } from '@/shared/store/loading-store';

const Earth = ({ selectedPlace }: EarthProps) => {
  const earthRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const markerRef = useRef<THREE.Group | null>(null);

  const { setIsLoading, setProgress } = useLoadingStore();
  const [shouldRotate, setShouldRotate] = useState<boolean>(true);
  const [isOccluded, setOccluded] = useState<boolean>(false);
  const [isInRange, setInRange] = useState<boolean>(false);
  const vec = new THREE.Vector3();

  const [dayTexture, setDayTexture] = useState<THREE.Texture | null>(null);
  const [nightTexture, setNightTexture] = useState<THREE.Texture | null>(null);
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);
  const [displacementMap, setDisplacementMap] = useState<THREE.Texture | null>(null);
  const [specularMap, setSpecularMap] = useState<THREE.Texture | null>(null);
  const [cloudTexture, setCloudTexture] = useState<THREE.Texture | null>(null);

  const { gl } = useThree();

  useEffect(() => {
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progressValue = Math.floor((itemsLoaded / itemsTotal) * 100);
      setProgress(progressValue);
    };

    loadingManager.onLoad = () => {
      setIsLoading(false);
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);

    textureLoader.load('/assets/textures/earth-day8k.jpg', (texture) => {
      texture.anisotropy = 16;
      texture.colorSpace = THREE.SRGBColorSpace;
      setDayTexture(texture);
    });

    textureLoader.load('/assets/textures/earth-night.webp', (texture) => {
      texture.anisotropy = 16;
      texture.colorSpace = THREE.SRGBColorSpace;
      setNightTexture(texture);
    });

    textureLoader.load('/assets/textures/earth-normal.jpg', (texture) => {
      texture.anisotropy = 16;
      setNormalMap(texture);
    });

    textureLoader.load('/assets/textures/earthbump1k.jpg', (texture) => {
      texture.anisotropy = 16;
      setDisplacementMap(texture);
    });

    textureLoader.load('/assets/textures/earthspec1k.jpg', (texture) => {
      texture.anisotropy = 16;
      setSpecularMap(texture);
    });

    textureLoader.load('/assets/textures/fair_clouds_8k.jpg', (texture) => {
      texture.anisotropy = 16;
      texture.colorSpace = THREE.SRGBColorSpace;
      setCloudTexture(texture);
    });
  }, [gl, setProgress, setIsLoading]);

  const [hovered, setHovered] = useState<boolean>(false);

  const baseTexture = useMemo(
    () => (hovered ? nightTexture : dayTexture),
    [hovered, dayTexture, nightTexture]
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const { earthScale } = useSpring({
    earthScale: selectedPlace ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useFrame((state, delta) => {
    if (earthRef.current && cloudRef.current) {
      if (shouldRotate) {
        earthRef.current.rotation.y += 0.25 * delta;
      }
      cloudRef.current.rotation.y += 0.005 * delta;
    }

    if (selectedPlace && markerRef.current) {
      const markerWorldPosition = markerRef.current.getWorldPosition(vec);
      const distanceToCamera = state.camera.position.distanceTo(markerWorldPosition);
      const inRange = distanceToCamera <= 10;
      setInRange(inRange);

      const directionToMarker = markerWorldPosition.clone().sub(state.camera.position).normalize();
      const cameraDirection = state.camera.getWorldDirection(new THREE.Vector3()).normalize();
      const dotProduct = directionToMarker.dot(cameraDirection);
      const occluded = dotProduct < 0;
      setOccluded(occluded);
    }
  });

  useEffect(() => {
    if (selectedPlace && earthRef.current && cameraControlsRef.current) {
      setShouldRotate(false);

      const markerLocalPosition = lon2xyz(...selectedPlace.coordinates, 1);
      const markerWorldPosition = markerLocalPosition.clone();
      earthRef.current.localToWorld(markerWorldPosition);

      const cameraLocalPosition = lon2xyz(...selectedPlace.coordinates, 4.5);
      const cameraWorldPosition = cameraLocalPosition.clone();
      earthRef.current.localToWorld(cameraWorldPosition);
      cameraWorldPosition.y += 1.5;

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

      const timer = setTimeout(() => {
        setShouldRotate(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [selectedPlace]);

  const isMarkerVisible = isInRange && !isOccluded;

  if (
    !dayTexture ||
    !nightTexture ||
    !normalMap ||
    !displacementMap ||
    !specularMap ||
    !cloudTexture
  ) {
    return null;
  }

  return (
    <>
      <animated.group ref={earthRef} scale={earthScale.to((s) => [s, s, s])}>
        <mesh
          ref={earthMeshRef}
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

        <mesh ref={cloudRef} scale={1.01}>
          <sphereGeometry args={[1.02, 32, 32]} />
          <meshStandardMaterial map={cloudTexture} transparent opacity={0.5} depthWrite={false} />
        </mesh>

        {TOURIST_DATA.map((place, index) => {
          const { x, y, z } = lon2xyz(...place.coordinates);
          return (
            <TouristMarker
              key={index}
              position={[x, y, z]}
              place={place}
              planetRef={earthMeshRef}
            />
          );
        })}

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
        ref={cameraControlsRef}
        makeDefault
        minDistance={3.5}
        maxDistance={100}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        smoothTime={0.4}
      />
      <ambientLight intensity={0.4} />
      <Light />
    </>
  );
};

export default Earth;
