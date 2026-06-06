import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const Planet = ({ position, size, color, speed, distance, name }) => {
  const planetRef = useRef();
  const orbitRef = useRef({ angle: 0 });

  useFrame(() => {
    if (planetRef.current) {
      orbitRef.current.angle += speed;
      planetRef.current.position.x = Math.cos(orbitRef.current.angle) * distance;
      planetRef.current.position.z = Math.sin(orbitRef.current.angle) * distance;
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={planetRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

export default Planet;
