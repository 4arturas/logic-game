import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LOGIC_SYMBOLS = ['∀', '∃', '∧', '∨', '¬', '⊆', '⊃', '≡', '∴', '∵', '⊕', '↔']

interface FloatingSymbolProps {
  symbol: string
  position: [number, number, number]
  speed: number
  phase: number
  color: string
}

function FloatingSymbol({ symbol, position, speed, phase, color }: FloatingSymbolProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 1.5
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.7 + phase) * 0.5
    ref.current.rotation.y = t * speed * 0.5
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.05 + Math.abs(Math.sin(t * speed * 0.3 + phase)) * 0.15
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.01, 0.01]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 800
    const posArr = new Float32Array(count * 3)
    const colArr = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#06D6A0'),
      new THREE.Color('#FFD166'),
      new THREE.Color('#EF476F'),
      new THREE.Color('#118AB2'),
    ]
    for (let i = 0; i < count; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 80
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 40
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 80
      const c = palette[Math.floor(Math.random() * palette.length)]
      colArr[i * 3]     = c.r
      colArr[i * 3 + 1] = c.g
      colArr[i * 3 + 2] = c.b
    }
    return { positions: posArr, colors: colArr }
  }, [])

  useFrame(({ clock }) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = clock.elapsedTime * 0.01
    particlesRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.005) * 0.05
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
