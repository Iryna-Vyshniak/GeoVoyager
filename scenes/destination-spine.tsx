import { Environment, Text } from '@react-three/drei';
import React, { useMemo } from 'react';
import { BoxGeometry, MeshStandardMaterial } from 'three';

import { PAGE_DEPTH, PAGE_HEIGHT, WHITE_COLOR } from '@/lib/constants';
import { createGradientTexture } from '@/lib/utils';

const DestinationSpine = ({ totalWidth }: { totalWidth: number }) => {
  const gradientTexture = useMemo(() => createGradientTexture(), []);
  const geometry = useMemo(
    () => new BoxGeometry(totalWidth, PAGE_HEIGHT, PAGE_DEPTH),
    [totalWidth]
  );

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        map: gradientTexture,
        metalness: 1, // максимум металевості
        roughness: 0.05, // майже дзеркальна поверхня
        emissive: '#222222', // легке світіння тіні
        emissiveIntensity: 0.2, // м’який глянець
        envMapIntensity: 1.5, // реакція на освітлення
        toneMapped: true,
        transparent: false,
      }),
    [gradientTexture]
  );
  const lineMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: WHITE_COLOR,
        metalness: 0.95,
        roughness: 0.1,
        emissive: WHITE_COLOR,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  const lineGeometry = useMemo(() => new BoxGeometry(totalWidth, 0.002, 0.001), [totalWidth]);
  const thinLineGeometry = useMemo(() => new BoxGeometry(totalWidth, 0.001, 0.001), [totalWidth]);
  return (
    <>
      <Environment preset='sunset' background />
      <mesh
        geometry={geometry}
        material={material}
        position={[-totalWidth / 2, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        {/* Верхня лінія */}
        <mesh
          geometry={thinLineGeometry}
          material={lineMaterial}
          position={[0, PAGE_HEIGHT * 0.35 + 0.01, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, 0]}
        />
        <mesh
          geometry={lineGeometry}
          material={lineMaterial}
          position={[0, PAGE_HEIGHT * 0.35, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, 0]}
        />

        {/* Назва */}
        <Text
          position={[0, 0, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, -Math.PI / 2]}
          fontSize={0.015}
          anchorX='center'
          anchorY='middle'
          color={WHITE_COLOR}
          depthOffset={-0.01}
        >
          GeoVoyager
        </Text>

        {/* Рік */}
        <Text
          position={[0, -PAGE_HEIGHT * 0.28, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, -Math.PI / 2]}
          fontSize={0.015}
          anchorX='center'
          anchorY='middle'
          color={WHITE_COLOR}
        >
          2025
        </Text>

        {/* Нижня лінія */}
        <mesh
          geometry={lineGeometry}
          material={lineMaterial}
          position={[0, -PAGE_HEIGHT * 0.38, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, 0]}
        />
        <mesh
          geometry={thinLineGeometry}
          material={lineMaterial}
          position={[0, -PAGE_HEIGHT * 0.38 - 0.01, PAGE_DEPTH / 2 + 0.001]}
          rotation={[0, 0, 0]}
        />
      </mesh>
    </>
  );
};

export default DestinationSpine;
