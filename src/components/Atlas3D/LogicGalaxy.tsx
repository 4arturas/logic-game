import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { FigurePillar } from './FigureOrbit'
import { NexusSphere } from './NexusSphere'
import { FloatingParticles } from './FloatingSymbols'
import { type Syllogism, type Figure, SYLLOGISM_EXAMPLES } from '../../lib/logic'

// Configuration
const FIGURE_COLORS: Record<number, string> = {
  1: '#06D6A0',
  2: '#FFD166',
  3: '#EF476F',
  4: '#118AB2',
}

const PILLAR_POSITIONS: Record<number, [number, number, number]> = {
  1: [-11, 0, -11],
  2: [ 11, 0, -11],
  3: [-11, 0,  11],
  4: [ 11, 0,  11],
}

// Animated camera that slowly sweeps but yields to user control
function CameraRig({ userInteracting }: { userInteracting: boolean }) {
  const { camera } = useThree()
  const angle = useRef(0)
  const targetY = useRef(12)

  useFrame((_, delta) => {
    if (userInteracting) return
    angle.current += delta * 0.04
    const r = 32
    const tx = Math.cos(angle.current) * r
    const tz = Math.sin(angle.current) * r
    camera.position.lerp(new THREE.Vector3(tx, 14, tz), 0.002)
    camera.lookAt(0, 2, 0)
  })

  return null
}

// Ground plane with grid
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#050810" roughness={1} metalness={0} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        cellSize={4}
        cellThickness={0.3}
        cellColor="#1a2030"
        sectionSize={16}
        sectionThickness={0.8}
        sectionColor="#0d1525"
        fadeDistance={60}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />
    </group>
  )
}

// Hint text that fades after first interaction
function HintOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-xl">
        <span className="text-white/60 text-xs font-mono tracking-widest uppercase">
          Drag to explore
        </span>
        <span className="w-px h-3 bg-white/20" />
        <span className="text-white/60 text-xs font-mono tracking-widest uppercase">
          Click a gem to discover
        </span>
      </div>
    </div>
  )
}

interface LogicGalaxyProps {
  onSelectSyllogism: (s: Syllogism) => void
  selectedId: string | null
}

export function LogicGalaxy({ onSelectSyllogism, selectedId }: LogicGalaxyProps) {
  const [interacting, setInteracting] = useState(false)
  const [showHint, setShowHint] = useState(true)

  const groupedSyllogisms = useMemo(() => {
    const res: Record<Figure, Syllogism[]> = { 1: [], 2: [], 3: [], 4: [] }
    SYLLOGISM_EXAMPLES.forEach(s => res[s.figure].push(s))
    return res
  }, [])

  const activeFigure = useMemo(() => {
    if (!selectedId) return null
    const s = SYLLOGISM_EXAMPLES.find(x => x.id === selectedId)
    return s?.figure ?? null
  }, [selectedId])

  // Hide hint after 5 seconds or on first click
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [28, 14, 28], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        onPointerDown={() => { setInteracting(true); setShowHint(false) }}
        onPointerUp={() => setTimeout(() => setInteracting(false), 3000)}
      >
        {/* Background */}
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 40, 90]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#8899bb" />

        {/* Camera rig */}
        <CameraRig userInteracting={interacting} />

        {/* Stars */}
        <Stars radius={120} depth={60} count={6000} factor={3} saturation={0.2} fade speed={0.5} />

        {/* Ambient particles */}
        <FloatingParticles />

        {/* Ground */}
        <Ground />

        <Suspense fallback={null}>
          {/* Central Nexus */}
          <NexusSphere />

          {/* Four Pillars */}
          {([1, 2, 3, 4] as Figure[]).map(fig => (
            <FigurePillar
              key={fig}
              figure={fig}
              syllogisms={groupedSyllogisms[fig]}
              position={PILLAR_POSITIONS[fig]}
              color={FIGURE_COLORS[fig]}
              onSelect={(s) => { onSelectSyllogism(s); setShowHint(false) }}
              selectedId={selectedId}
              isActive={activeFigure === fig}
            />
          ))}
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          maxDistance={55}
          minDistance={6}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
          target={[0, 2, 0]}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      <HintOverlay visible={showHint} />
    </div>
  )
}
