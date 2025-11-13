import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';

function RotatingBox({ position, color, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * speed;
    meshRef.current.rotation.y += delta * speed * 0.5;
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </Box>
  );
}

function FloatingSphere({ position, color }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere position={position} args={[0.5, 32, 32]}>
        <MeshDistortMaterial color={color} distort={0.3} speed={2} />
      </Sphere>
    </Float>
  );
}

function RotatingTorus({ position, color }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.8;
  });

  return (
    <Torus ref={meshRef} position={position} args={[1, 0.3, 16, 100]}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} />
    </Torus>
  );
}



function Slide1() {
  return (
    <>
      <Center position={[0, 1, 0]}>
        <group>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>
        </group>
      </Center>
      <RotatingBox position={[0, 0, 0]} color="#3b82f6" speed={0.5} />
      <FloatingSphere position={[-3, 0, 0]} color="#8b5cf6" />
      <FloatingSphere position={[3, 0, 0]} color="#10b981" />
      <RotatingTorus position={[0, -2, 0]} color="#f59e0b" />
    </>
  );
}

function Slide2() {
  return (
    <>
      <RotatingBox position={[-2, 1, 0]} color="#ef4444" speed={0.8} />
      <RotatingBox position={[2, 1, 0]} color="#06b6d4" speed={0.6} />
      <RotatingBox position={[0, -1, 0]} color="#8b5cf6" speed={0.4} />
      <FloatingSphere position={[0, 1, -2]} color="#f59e0b" />
    </>
  );
}

function Slide3() {
  return (
    <>
      <RotatingTorus position={[0, 1, 0]} color="#3b82f6" />
      <RotatingTorus position={[-2, -1, 0]} color="#10b981" />
      <RotatingTorus position={[2, -1, 0]} color="#ef4444" />
      <FloatingSphere position={[0, 0, 2]} color="#8b5cf6" />
    </>
  );
}

function Slide4() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <RotatingBox position={[0, 0, 0]} color="#f59e0b" speed={1} />
      </Float>
      <RotatingBox position={[-3, 2, -1]} color="#3b82f6" speed={0.5} />
      <RotatingBox position={[3, 2, -1]} color="#10b981" speed={0.5} />
      <RotatingBox position={[-3, -2, -1]} color="#ef4444" speed={0.5} />
      <RotatingBox position={[3, -2, -1]} color="#8b5cf6" speed={0.5} />
    </>
  );
}

function Scene({ currentSlide }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
      
      {currentSlide === 0 && <Slide1 />}
      {currentSlide === 1 && <Slide2 />}
      {currentSlide === 2 && <Slide3 />}
      {currentSlide === 3 && <Slide4 />}
      
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const slideInfo = [
    { title: "Welcome to 3D Presentation", description: "Interactive 3D slides with Three.js" },
    { title: "Multiple 3D Objects", description: "Rotating cubes and floating spheres" },
    { title: "Dynamic Animations", description: "Smooth transitions and effects" },
    { title: "Final Slide", description: "Beautiful 3D compositions" }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="w-full h-full"
      >
        <Scene currentSlide={currentSlide} />
      </Canvas>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl">
          {slideInfo[currentSlide].title}
        </h1>
        <p className="text-xl text-gray-200 drop-shadow-lg">
          {slideInfo[currentSlide].description}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          onClick={prevSlide}
          className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
        >
          ← Previous
        </button>
        
        <div className="flex gap-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
        >
          Next →
        </button>
      </div>

      <div className="absolute top-8 right-8 text-white/60 text-sm z-10 pointer-events-none">
        <p>Use arrow keys or space to navigate</p>
        <p className="text-xs mt-1">Slide {currentSlide + 1} of {totalSlides}</p>
      </div>
    </div>
  );
}

export default App;
