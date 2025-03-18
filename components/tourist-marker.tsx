import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html, useGLTF } from '@react-three/drei';
import { TouristMarkerProps } from '@/shared/shared.types';
import { useFrame } from '@react-three/fiber';

const TouristMarker = ({ position, place, planetRef }: TouristMarkerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const [isInFrustum, setIsInFrustum] = useState(false);
  const frustum = new THREE.Frustum();
  const MAX_DISTANCE = 0.55;

  const { scene } = useGLTF('/assets/textures/pin.glb');
  const gltfScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (markerRef.current && planetRef.current) {
      const localPosition = new THREE.Vector3(...position);
      const planetCenter = new THREE.Vector3().setFromMatrixPosition(planetRef.current.matrixWorld);
      const normal = localPosition.clone().sub(planetCenter).normalize();

      // Позиція рівно там, де мала б бути (без зміщення)
      groupRef.current!.position.copy(localPosition);

      // ОРІЄНТАЦІЯ ПІНУ ПО НОРМАЛІ (як у документації  https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_scatter.html)
      const dummy = new THREE.Object3D();
      dummy.position.copy(localPosition);
      dummy.lookAt(localPosition.clone().add(normal));
      dummy.updateMatrix();

      markerRef.current.setRotationFromMatrix(dummy.matrix);

      // *** Корекція нахилу піну (підібрала вручну, так як була проблема) ***
      markerRef.current.rotateX(Math.PI / 2.2);
    }
  }, [position, planetRef]);

  useFrame(({ camera }) => {
    if (groupRef.current) {
      const projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(projScreenMatrix);

      const localPosition = new THREE.Vector3(...position);
      const distanceToCamera = localPosition.distanceTo(camera.position);
      const isVisible = frustum.containsPoint(localPosition) && distanceToCamera <= MAX_DISTANCE;
      setIsInFrustum(isVisible);

      if (textRef.current) {
        textRef.current.position.set(0, 0.05, 0);
        textRef.current.lookAt(camera.position);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={markerRef}>
        <primitive object={gltfScene} scale={3.2} />
      </mesh>
      <Html
        as='div'
        center
        distanceFactor={1.8}
        occlude={[planetRef]}
        style={{
          transition: 'opacity 0.5s',
          opacity: isInFrustum ? 0 : 1,
          pointerEvents: isInFrustum ? 'none' : 'auto',
        }}
      >
        <p className='text-[.625rem] text-primary drop-shadow-sm whitespace-nowrap transform -translate-y-6'>
          {place.name}
        </p>
      </Html>
    </group>
  );
};

useGLTF.preload('/assets/textures/pin.glb');
export default TouristMarker;
