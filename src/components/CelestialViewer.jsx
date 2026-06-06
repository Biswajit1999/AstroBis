import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import Planet from './Planet';

const CelestialViewer = () => {
  return (
    <div className="w-full h-screen bg-space-900">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading 3D Viewer...</div>}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 100]} />
          <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

          {/* Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[8, 32, 32]} />
            <meshBasicMaterial color="#FDB813" />
            <pointLight intensity={2} />
          </mesh>

          {/* Mercury */}
          <Planet position={[20, 0, 0]} size={3.8} color="#8C7853" speed={0.04} distance={20} name="Mercury" />

          {/* Venus */}
          <Planet position={[35, 0, 0]} size={9.5} color="#FFC649" speed={0.015} distance={35} name="Venus" />

          {/* Earth */}
          <Planet position={[55, 0, 0]} size={10} color="#4B7BE5" speed={0.01} distance={55} name="Earth" />

          {/* Mars */}
          <Planet position={[75, 0, 0]} size={5.3} color="#E27B58" speed={0.008} distance={75} name="Mars" />

          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom enablePan />

          <ambientLight intensity={0.5} />
        </Canvas>
      </Suspense>

      <div className="absolute top-8 left-8 text-white max-w-md">
        <h2 className="text-2xl font-bold mb-2">Solar System Explorer</h2>
        <p className="text-space-300 text-sm">
          Use your mouse to rotate, scroll to zoom, and drag to pan. Watch as planets orbit the sun!
        </p>
      </div>
    </div>
  );
};

export default CelestialViewer;
