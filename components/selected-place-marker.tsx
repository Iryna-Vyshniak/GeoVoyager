'use client';

import { forwardRef, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { Group } from 'three';

import { lon2xyz } from '@/lib/utils';
import { SelectedPlaceMarkerProps } from '@/shared/shared.types';

const SelectedPlaceMarker = forwardRef<Group, SelectedPlaceMarkerProps>(
  ({ selectedPlace, isVisible, setOccluded }, ref) => {
    const markerRef = ref as React.MutableRefObject<Group | null>;
    const htmlGroupRef = useRef<Group>(null);

    const pulseAnimation = useSpring({
      scale: 1.5,
      from: { scale: 0.25 },
      loop: { reverse: true },
      config: { tension: 100, friction: 20 },
    });

    // Автоматичне орієнтування HTML на камеру (billboard-ефект)
    useFrame((state) => {
      if (htmlGroupRef.current) {
        // Орієнтуємо групу на камеру, щоб текст завжди був спрямований до глядача
        htmlGroupRef.current.quaternion.copy(state.camera.quaternion);
        // Додаємо невелике вертикальне вирівнювання, щоб текст був горизонтальним
        htmlGroupRef.current.rotation.x = 0; // Фіксуємо горизонтальне положення, щоб текст був стабільним
        htmlGroupRef.current.rotation.z = 0; // Фіксуємо поворот навколо Z -  без повороту навколо Z

        // Синхронізуємо позицію HTML із міткою
        if (markerRef.current) {
          const markerPosition = lon2xyz(...selectedPlace.coordinates, 1); // Використовуємо lon2xyz для позиції мітки
          htmlGroupRef.current.position.set(
            markerPosition.x, // Зсув вліво по осі X
            markerPosition.y, // Зсув вгору по осі Y над міткою
            markerPosition.z // Без зсуву по Z
          );

          htmlGroupRef.current.rotation.set(0, 0, 0);
        }
      }
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

        <group ref={htmlGroupRef}>
          {' '}
          <Html
            as='div'
            center
            occlude='raycast'
            onOcclude={(occluded: boolean) => setOccluded(occluded)}
            style={{
              position: 'relative',
              transition: 'all 0.2s',
              opacity: isVisible ? 1 : 0,
              transform: `scale(${isVisible ? 1 : 0.25})`,
            }}
            distanceFactor={10} // Відстань, на якій HTML видимий
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'scale(1)',
                background: 'transparent',
              }}
            >
              <FaMapMarkerAlt color='#ff0000' className='text-xs drop-shadow-sm' />
              <h3 className='text-primary text-xs bg-transparent'>{selectedPlace.name}</h3>
            </div>
          </Html>
        </group>
      </group>
    );
  }
);

SelectedPlaceMarker.displayName = 'SelectedPlaceMarker';

export default SelectedPlaceMarker;
