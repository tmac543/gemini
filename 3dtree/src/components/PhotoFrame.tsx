import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Mesh } from 'three'
import * as THREE from 'three'

interface PhotoFrameProps {
    position: [number, number, number]
    rotation: [number, number, number]
    photoUrl?: string
    size?: number
}

export function PhotoFrame({
    position,
    rotation,
    photoUrl,
    size = 0.3
}: PhotoFrameProps) {
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHovered] = useState(false)

    // 加载照片纹理
    const texture = photoUrl ? useLoader(THREE.TextureLoader, photoUrl) : null

    // 悬浮动画
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05
        }
    })

    return (
        <group position={position} rotation={rotation}>
            {/* 相框背板 */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[size * 1.1, size * 1.1, 0.02]} />
                <meshStandardMaterial
                    color="#8b4513"
                    roughness={0.8}
                    metalness={0.2}
                />
            </mesh>

            {/* 照片或占位符 */}
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.05 : 1}
            >
                <planeGeometry args={[size, size]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        roughness={0.5}
                        metalness={0.1}
                    />
                ) : (
                    <meshStandardMaterial
                        color="#cccccc"
                        roughness={0.7}
                        metalness={0.1}
                    />
                )}
            </mesh>

            {/* 相框边框 */}
            {/* 上边框 */}
            <mesh position={[0, size / 2 + 0.015, 0.01]}>
                <boxGeometry args={[size * 1.1, 0.03, 0.02]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            {/* 下边框 */}
            <mesh position={[0, -size / 2 - 0.015, 0.01]}>
                <boxGeometry args={[size * 1.1, 0.03, 0.02]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            {/* 左边框 */}
            <mesh position={[-size / 2 - 0.015, 0, 0.01]}>
                <boxGeometry args={[0.03, size * 1.1, 0.02]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            {/* 右边框 */}
            <mesh position={[size / 2 + 0.015, 0, 0.01]}>
                <boxGeometry args={[0.03, size * 1.1, 0.02]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* 挂绳 */}
            <mesh position={[0, size / 2 + 0.05, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
                <meshStandardMaterial
                    color="#666666"
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            {/* 挂钩 */}
            <mesh position={[0, size / 2 + 0.1, 0]}>
                <torusGeometry args={[0.02, 0.005, 8, 16]} />
                <meshStandardMaterial
                    color="#888888"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
        </group>
    )
}
