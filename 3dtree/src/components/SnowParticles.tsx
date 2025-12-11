import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SnowParticles({ count = 1000 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null)

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const velocities = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = Math.random() * 15
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20
            velocities[i] = Math.random() * 0.02 + 0.01
        }

        return { positions, velocities }
    }, [count])

    useFrame(() => {
        if (!pointsRef.current) return

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= particles.velocities[i]

            if (positions[i * 3 + 1] < -2) {
                positions[i * 3 + 1] = 15
                positions[i * 3] = (Math.random() - 0.5) * 20
                positions[i * 3 + 2] = (Math.random() - 0.5) * 20
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
