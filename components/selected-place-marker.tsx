'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Billboard, Text3D, useGLTF } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';

import { BufferGeometry, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';

import { lon2xyz } from '@/lib/utils';
import { SelectedPlaceMarkerProps } from '@/shared/shared.types';

const SelectedPlaceMarker = forwardRef<Group, SelectedPlaceMarkerProps>(
  ({ selectedPlace, isVisible }, ref) => {
    const markerRef = ref as React.MutableRefObject<Group | null>;
    const textRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial>>(null);
    const pinRef = useRef<Mesh>(null);
  
     const { scene } = useGLTF('/assets/textures/mappin.glb');
      const gltfScene = useMemo(() => scene.clone(), [scene]);
      const [hovered, setHovered] = useState<boolean>(false);
      
      useEffect(() => {
         if (hovered) { 
          document.body.style.cursor = 'pointer';
        };
        return () => {
            document.body.style.cursor = 'auto';
          };
      }, [hovered]);
      
    useFrame(() => {
      if (textRef.current && textRef.current.material) {
        const material = textRef.current.material as MeshPhysicalMaterial;
        material.color.set(hovered ? '#7b00ff' : '#ffffff'); 
        material.emissive.set(hovered ? '#0d00ff' : '#ffffff'); // Глибший синій світіння
        material.emissiveIntensity = hovered ? 0.8 : 0.3;
      }
    });

    useFrame(({ clock}) => {
      if(pinRef.current) { pinRef.current.rotation.y = clock.elapsedTime}
     
    })

    const over = ( e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
    };

    const out = () => setHovered(false);

  const pulseAnimation = useSpring({
    scale: 1,
    from: { scale: 0.25 },
    loop: { reverse: true },
    config: { tension: 100, friction: 20 },
  });
 

    return (
      <group
        ref={markerRef}
        position={lon2xyz(...selectedPlace.coordinates, 1).toArray()}
        dispose={null}
      >
        <animated.mesh
          scale={pulseAnimation.scale.to((s) => [s, s, s])}
          visible={isVisible}
          renderOrder={9999}
        >
          <sphereGeometry args={[0.025, 16, 16]} />

          <meshMatcapMaterial
            color='#ff0000'
            transparent
            fog={false}
            depthTest={true} // ховаємо мітку якщо вона заходить за обрій планети
            depthWrite={true}
            visible
          />
        </animated.mesh>

        <Billboard position={lon2xyz(...selectedPlace.coordinates, 0.5).toArray()}>
        <group>
          <mesh ref={pinRef}  position={[-0.05, 0, 0]}>
            <primitive object={gltfScene} scale={0.02}/>
          </mesh>
        
          <mesh position={[0, -0.04, 0]}>
            <Text3D
              ref={textRef}
              font="/fonts/PlayfairDisplay.json"
              size={0.08} 
             height={0.02} 
              curveSegments={16}
              bevelEnabled
              bevelThickness={0.003}
              bevelSize={0.002}
              bevelOffset={0}
              bevelSegments={8}
              onPointerOver={over}
              onPointerOut={out}
            
             
            >
              {selectedPlace.name}
              <meshPhysicalMaterial
                color="#ffffff"
                emissive="#7b00ff"
                emissiveIntensity={0.3}
                metalness={0.5}
                roughness={0.4}
                clearcoat={0.8} 
                reflectivity={0.8}
              />
            </Text3D>
          </mesh>
        </group>
          </Billboard>
      </group>
    );
  }
);

useGLTF.preload('/assets/textures/mappin.glb')

SelectedPlaceMarker.displayName = 'SelectedPlaceMarker';

export default SelectedPlaceMarker;