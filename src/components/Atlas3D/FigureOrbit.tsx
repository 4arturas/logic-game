import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { SyllogismGem } from './SyllogismNode'
import { type Syllogism, type Figure } from '../../lib/logic'

interface FigurePillarProps {
  figure: Figure
  syllogisms: Syllogism[]
  position: [number, number, number]
  color: string
  onSelect: (s: Syllogism) => void
  selectedId: string | null
  isActive: boolean
}

const FIGURE_ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
const FIGURE_NAMES = { 1: 'Prima', 2: 'Secunda', 3: 'Tertia', 4: 'Quarta' }

export function FigurePillar({ figure, syllogisms, position, color, onSelect, selectedId, isActive }: FigurePillarProps) {
  const pillarRef = useRef<THREE.Mesh>(null)
  const topCrystalRef = useRef<THREE.Mesh>(null)
  const glowPlaneRef = useRef<THREE.Mesh>(null)
  const labelGroupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (pillarRef.current) {
      const mat = pillarRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isActive
        ? 0.6 + Math.sin(t * 2) * 0.2
        : 0.15 + Math.sin(t * 1.2 + figure) * 0.05
    }
    if (topCrystalRef.current) {
      topCrystalRef.current.rotation.y = t * 0.8 + figure
      topCrystalRef.current.position.y = 9.5 + Math.sin(t * 1.5 + figure) * 0.15
      const mat = topCrystalRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isActive ? 2.5 + Math.sin(t * 3) * 0.5 : 1.0 + Math.sin(t * 1.5 + figure) * 0.3
    }
    if (glowPlaneRef.current) {
      const mat = glowPlaneRef.current.material as THREE.SpriteMaterial
    }
  })

  // Arrange gems in a gentle arc cluster around the pillar base
  const gemPositions: [number, number, number][] = syllogisms.map((_, i) => {
    const total = syllogisms.length
    const angle = (i / total) * Math.PI * 2
    const r = 2.4
    return [
      position[0] + Math.cos(angle) * r,
      0.6,
      position[2] + Math.sin(angle) * r,
    ]
  })

  const PILLAR_HEIGHT = 9

  return (
    <group>
      {/* Ground glow disc */}
      <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} />
      </mesh>

      {/* Pillar column */}
      <mesh ref={pillarRef} position={[position[0], PILLAR_HEIGHT / 2, position[2]]}>
        <cylinderGeometry args={[0.35, 0.55, PILLAR_HEIGHT, 6]} />
        <meshStandardMaterial
          color={'#0a0f1e'}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Pillar inner glow stripe */}
      <mesh position={[position[0], PILLAR_HEIGHT / 2, position[2]]}>
        <cylinderGeometry args={[0.15, 0.15, PILLAR_HEIGHT * 0.9, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>

      {/* Top crystal */}
      <mesh ref={topCrystalRef} position={[position[0], PILLAR_HEIGHT + 0.5, position[2]]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={'#ffffff'}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Point light at pillar top */}
      <pointLight
        position={[position[0], PILLAR_HEIGHT + 1, position[2]]}
        color={color}
        intensity={isActive ? 3 : 1.2}
        distance={12}
      />

      {/* Pillar label — HTML overlay */}
      <Html
        position={[position[0], PILLAR_HEIGHT + 2.2, position[2]]}
        center
        distanceFactor={18}
      >
        <div
          className="pointer-events-none text-center select-none"
          style={{ minWidth: '80px' }}
        >
          <div
            className="text-[22px] font-black"
            style={{
              color,
              textShadow: `0 0 20px ${color}`,
              fontFamily: 'Georgia, serif',
              lineHeight: 1,
            }}
          >
            {FIGURE_ROMAN[figure]}
          </div>
          <div
            className="text-[8px] font-black uppercase tracking-[0.25em] font-mono mt-0.5"
            style={{ color: `${color}bb` }}
          >
            {FIGURE_NAMES[figure]}
          </div>
        </div>
      </Html>

      {/* Syllogism gems */}
      {syllogisms.map((s, i) => (
        <SyllogismGem
          key={s.id}
          syllogism={s}
          position={gemPositions[i]}
          color={color}
          onSelect={onSelect}
          isSelected={selectedId === s.id}
          index={i + figure * 10}
        />
      ))}

      {/* Subtle ring at base */}
      <mesh position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
