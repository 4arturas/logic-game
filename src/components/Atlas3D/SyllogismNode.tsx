import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { type Syllogism } from '../../lib/logic'

interface SyllogismGemProps {
  syllogism: Syllogism
  position: [number, number, number]
  color: string
  onSelect: (s: Syllogism) => void
  isSelected: boolean
  index: number
}

export function SyllogismGem({ syllogism, position, color, onSelect, isSelected, index }: SyllogismGemProps) {
  const gemRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!gemRef.current || !glowRef.current) return
    const t = clock.elapsedTime + index * 0.8

    // Gentle bob
    gemRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.25
    gemRef.current.rotation.y = t * 0.6
    gemRef.current.rotation.x = Math.sin(t * 0.4) * 0.2

    // Scale
    const tScale = isSelected ? 1.6 : hovered ? 1.3 : 1.0
    const s = gemRef.current.scale.x
    const ns = s + (tScale - s) * 0.1
    gemRef.current.scale.setScalar(ns)

    // Glow pulse
    glowRef.current.position.y = gemRef.current.position.y
    const gScale = (isSelected ? 1.9 : hovered ? 1.6 : 1.3) + Math.sin(t * 2) * 0.07
    glowRef.current.scale.setScalar(gScale)
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial
    glowMat.opacity = isSelected ? 0.35 : hovered ? 0.25 : 0.08 + Math.sin(t * 1.5) * 0.04

    // Emissive
    const mat = gemRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = isSelected ? 2.5 : hovered ? 1.8 : 0.6 + Math.sin(t * 2) * 0.2
  })

  return (
    <group>
      {/* Glow sphere behind the gem */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>

      {/* The gem */}
      <mesh
        ref={gemRef}
        position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); onSelect(syllogism) }}
      >
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color={isSelected || hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.8}
        />

        {/* Label appears on hover/select */}
        {(hovered || isSelected) && (
          <Html distanceFactor={12} center>
            <div className="pointer-events-none select-none text-center" style={{ minWidth: '80px' }}>
              <div
                className="text-[10px] font-black uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded-full mb-1"
                style={{
                  color,
                  background: 'rgba(5,8,20,0.85)',
                  border: `1px solid ${color}55`,
                  backdropFilter: 'blur(8px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {syllogism.mood}
              </div>
              <div
                className="text-sm italic"
                style={{
                  color: '#ffffff',
                  textShadow: `0 0 12px ${color}, 0 2px 8px rgba(0,0,0,0.9)`,
                  fontFamily: 'Georgia, serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {syllogism.mnemonic}
              </div>
            </div>
          </Html>
        )}
      </mesh>

      {/* Selected: ring indicator */}
      {isSelected && (
        <mesh position={[position[0], position[1], position[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
