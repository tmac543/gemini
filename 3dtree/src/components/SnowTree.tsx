import { useRef } from 'react'
import { Group } from 'three'
import { PhotoFrame } from './PhotoFrame'
import { useStore } from '../store'

interface SnowTreeProps {
    position?: [number, number, number]
}

export function SnowTree({ position = [0, 0, 0] }: SnowTreeProps) {
    const groupRef = useRef<Group>(null)
    const { photos } = useStore()

    // 圣诞树参数
    const treeHeight = 3.5
    const treeBaseRadius = 1.5

    // 照片框位置
    const framePositions: Array<[number, number, number, number]> = []
    const photoCount = Math.min(photos.length, 15)

    for (let i = 0; i < photoCount; i++) {
        const t = i / photoCount
        const angle = t * Math.PI * 6
        const height = t * treeHeight * 0.7 - treeHeight / 3
        const radius = treeBaseRadius * (1 - t * 0.6) * 0.9

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = height

        framePositions.push([x, y, z, angle])
    }

    // 创建冰雪枝叶
    const branches = []
    const branchLayers = 12

    for (let i = 0; i < branchLayers; i++) {
        const t = i / branchLayers
        const layerHeight = treeHeight / branchLayers
        const yPos = -treeHeight / 2 + i * layerHeight
        const branchesPerLayer = 4 + Math.floor(Math.random() * 2)

        for (let j = 0; j < branchesPerLayer; j++) {
            const angle = (j / branchesPerLayer) * Math.PI * 2 + i * 0.3
            const baseRadius = treeBaseRadius * (1 - t * 0.7)
            const branchRadius = baseRadius * (0.3 + Math.random() * 0.2)
            const branchHeight = layerHeight * (1.5 + Math.random() * 0.5)
            const branchDistance = baseRadius * (0.7 + Math.random() * 0.3)

            const x = Math.cos(angle) * branchDistance
            const z = Math.sin(angle) * branchDistance

            branches.push({
                position: [x, yPos, z] as [number, number, number],
                rotation: [
                    (Math.random() - 0.5) * 0.3,
                    angle,
                    (Math.random() - 0.5) * 0.2
                ] as [number, number, number],
                radius: branchRadius,
                height: branchHeight,
                color: i < 4 ? '#e0f7fa' : '#b2ebf2' // 冰蓝色渐变
            })
        }
    }

    return (
        <group ref={groupRef} position={position}>
            {/* 树干 - 冰柱风格 */}
            <mesh position={[0, -treeHeight / 2 - 0.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.18, 0.25, 0.8, 12]} />
                <meshPhysicalMaterial
                    color="#a0e0ff"
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={1}
                />
            </mesh>

            {/* 主树体 - 磨砂玻璃质感 */}
            <mesh position={[0, -treeHeight / 4, 0]} castShadow receiveShadow>
                <coneGeometry args={[treeBaseRadius, treeHeight, 8, 1]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.4}
                    opacity={0.8}
                    transparent
                />
            </mesh>

            {/* 冰雪枝叶 */}
            {branches.map((branch, i) => (
                <mesh
                    key={i}
                    position={branch.position}
                    rotation={branch.rotation}
                    castShadow
                    receiveShadow
                >
                    <coneGeometry args={[branch.radius, branch.height, 6, 1]} />
                    <meshStandardMaterial
                        color={branch.color}
                        roughness={0.3}
                        metalness={0.4}
                    />
                </mesh>
            ))}

            {/* 顶部雪花星星 */}
            <group position={[0, treeHeight / 2 + 0.4, 0]}>
                <mesh>
                    <dodecahedronGeometry args={[0.25]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#e0f7fa"
                        emissiveIntensity={0.8}
                        metalness={0.8}
                        roughness={0.1}
                    />
                </mesh>
                <pointLight intensity={1.5} color="#e0f7fa" distance={4} />
            </group>

            {/* 照片相框 - 银色边框 */}
            {framePositions.map(([x, y, z, angle], index) => (
                <PhotoFrame
                    key={index}
                    position={[x, y, z]}
                    rotation={[0, -angle + Math.PI, 0]}
                    photoUrl={photos[index]}
                    size={0.35}
                />
            ))}

            {/* 装饰水晶球 */}
            {Array.from({ length: 30 }).map((_, i) => {
                const t = (i + 5) / 35
                const angle = i * 2.4 + Math.random() * 0.5
                const height = t * treeHeight * 0.65 - treeHeight / 3
                const radius = treeBaseRadius * (1 - t * 0.65) * (0.85 + Math.random() * 0.1)

                const x = Math.cos(angle) * radius
                const z = Math.sin(angle) * radius
                const y = height

                return (
                    <mesh key={`crystal-${i}`} position={[x, y, z]} castShadow>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshPhysicalMaterial
                            color="#ffffff"
                            metalness={0.1}
                            roughness={0}
                            transmission={0.9}
                            thickness={0.5}
                        />
                    </mesh>
                )
            })}

            {/* 地面冰层 */}
            <mesh position={[0, -treeHeight / 2 - 0.65, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[3, 32]} />
                <meshPhysicalMaterial
                    color="#e0f7fa"
                    roughness={0.05}
                    metalness={0.2}
                    transmission={0.2}
                />
            </mesh>
        </group>
    )
}
