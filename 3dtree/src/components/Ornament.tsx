import { useRef } from 'react'
import { Mesh, TextureLoader } from 'three'
import { useLoader, useFrame } from '@react-three/fiber'

interface OrnamentProps {
    position: [number, number, number]
    color?: string
    textureUrl?: string
    index?: number
}

export function Ornament({ position, color = 'red', textureUrl, index = 0 }: OrnamentProps) {
    const meshRef = useRef<Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return

        // Gentle floating animation
        const time = state.clock.elapsedTime
        const offset = index * 0.5 // Different phase for each ornament
        meshRef.current.position.y = position[1] + Math.sin(time + offset) * 0.05

        // Slow rotation
        meshRef.current.rotation.y += 0.005
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.2, 32, 32]} />
            {textureUrl ? (
                <TexturedMaterial url={textureUrl} />
            ) : (
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            )}
        </mesh>
    )
}

function TexturedMaterial({ url }: { url: string }) {
    const texture = useLoader(TextureLoader, url)
    return <meshStandardMaterial map={texture} roughness={0.3} metalness={0.2} />
}
