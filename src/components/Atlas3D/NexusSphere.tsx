import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PILLAR_POSITIONS: [number, number, number][] = [
  [-14, 0, -14],
  [ 14, 0, -14],
  [-14, 0,  14],
  [ 14, 0,  14],
]

const FIGURE_COLORS = ['#06D6A0', '#FFD166', '#EF476F', '#118AB2']

function EnergyBeam({ from, to, color }: { from: [number,number,number], to: [number,number,number], color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  
  const { midpoint, length, quaternion } = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const len = start.distanceTo(end)
    const dir = end.clone().sub(start).normalize()
    const up = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir)
    return { midpoint: [mid.x, mid.y, mid.z] as [number,number,number], length: len, quaternion: q }
  }, [from, to])

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.08 + Math.abs(Math.sin(clock.elapsedTime * 0.8)) * 0.12
    }
  })

  return (
    <mesh ref={ref} position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.04, 0.04, length, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  )
}

export function NexusSphere() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.3
      outerRef.current.rotation.x = t * 0.15
      const s = 1 + Math.sin(t * 1.2) * 0.06
      outerRef.current.scale.setScalar(s)
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.5
      const inner = innerRef.current.material as THREE.MeshStandardMaterial
      inner.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5
    }
    if (ringRef1.current) ringRef1.current.rotation.z = t * 0.6
    if (ringRef2.current) ringRef2.current.rotation.x = t * 0.4
  })

  const origin: [number,number,number] = [0, 1, 0]

  return (
    <group position={[0, 1, 0]}>
      {/* Energy beams to pillars */}
      {PILLAR_POSITIONS.map((pos, i) => (
        <EnergyBeam
          key={i}
          from={[0, 0, 0]}
          to={[pos[0], pos[1] + 4, pos[2]]}
          color={FIGURE_COLORS[i]}
        />
      ))}

      {/* Outer wireframe sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Inner glow sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#88ccff"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Orbital decorative rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.8, 0.03, 8, 64]} />
        <meshBasicMaterial color="#06D6A0" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.0, 0.03, 8, 64]} />
        <meshBasicMaterial color="#118AB2" transparent opacity={0.4} />
      </mesh>

      {/* Point light at center */}
      <pointLight intensity={4} color="#88ccff" distance={25} />
    </group>
  )
}
