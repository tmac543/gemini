import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

interface SciFiParticleTreeProps {
    position?: [number, number, number]
}

export function SciFiParticleTree({ position = [0, 0, 0] }: SciFiParticleTreeProps) {
    const pointsRef = useRef<THREE.Points>(null)
    const { photos } = useStore()

    // 粒子参数
    const particleCount = 6000
    const treeHeight = 5.0
    const maxRadius = 2.2

    // 生成粒子数据
    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        // 绿色赛博风格调色板
        const colorPalette = [
            new THREE.Color('#00ff41'), // Matrix Green
            new THREE.Color('#008f11'), // Dark Green
            new THREE.Color('#adff2f'), // Green Yellow
            new THREE.Color('#ffd700'), // Gold (Accents)
        ]

        let pIndex = 0

        // 创建多层树冠结构 (模拟松树)
        const layers = 8
        for (let l = 0; l < layers; l++) {
            const layerProgress = l / layers
            const layerYBase = (layerProgress * treeHeight) - (treeHeight / 2)
            const layerHeight = (treeHeight / layers) * 1.5
            const layerRadius = maxRadius * (1 - layerProgress) * 1.2

            // 每层的粒子数随半径减少
            const layerParticleCount = Math.floor(particleCount / layers)

            for (let i = 0; i < layerParticleCount; i++) {
                if (pIndex >= particleCount) break

                // 锥形分布
                const angle = Math.random() * Math.PI * 2

                // r = h * tan(theta) 类似的线性关系，但在底部更宽
                const h = Math.random() * layerHeight
                const r = (layerRadius * (1 - h / layerHeight)) * Math.sqrt(Math.random()) // sqrt让粒子更聚集在外部

                const x = Math.cos(angle) * r
                const z = Math.sin(angle) * r
                const y = layerYBase + h

                positions[pIndex * 3] = x
                positions[pIndex * 3 + 1] = y
                positions[pIndex * 3 + 2] = z

                // 颜色分配 - 核心更亮，边缘更暗
                const distFromCenter = Math.sqrt(x * x + z * z) / maxRadius
                const color = distFromCenter < 0.2
                    ? new THREE.Color('#ccffcc') // 核心亮白绿
                    : colorPalette[Math.floor(Math.random() * colorPalette.length)]

                colors[pIndex * 3] = color.r
                colors[pIndex * 3 + 1] = color.g
                colors[pIndex * 3 + 2] = color.b

                pIndex++
            }
        }

        return { positions, colors }
    }, [])

    // 动画
    useFrame((state) => {
        if (!pointsRef.current) return

        const time = state.clock.getElapsedTime()

        // 缓慢旋转
        pointsRef.current.rotation.y = time * 0.15

        // 呼吸效果 - 通过缩放模拟
        const scale = 1 + Math.sin(time * 2) * 0.02
        pointsRef.current.scale.set(scale, scale, scale)
    })

    // 照片全息投影位置 - 螺旋上升
    const photoPositions = useMemo(() => {
        return photos.slice(0, 15).map((_, i) => {
            const t = i / Math.min(photos.length, 15)
            const angle = t * Math.PI * 4 // 2圈
            const y = (t * treeHeight * 0.7) - (treeHeight / 2) + 0.5
            const r = maxRadius * (1 - (y + treeHeight / 2) / treeHeight) + 0.6
            return {
                pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
                rot: [0, -angle - Math.PI / 2, 0] as [number, number, number]
            }
        })
    }, [photos])

    return (
        <group position={position}>
            {/* 粒子树主体 */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.positions.length / 3}
                        array={particles.positions}
                        itemSize={3}
                        args={[particles.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particles.colors.length / 3}
                        array={particles.colors}
                        itemSize={3}
                        args={[particles.colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.06}
                    vertexColors
                    transparent
                    opacity={0.9}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* 能量场底座 */}
            <group position={[0, -treeHeight / 2 - 0.1, 0]}>
                {/* 动态光环 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.2, 2.8, 64]} />
                    <meshBasicMaterial color="#00ff41" transparent opacity={0.15} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2.7, 2.8, 64]} />
                    <meshBasicMaterial color="#00ff41" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
                {/* 科技网格 */}
                <gridHelper args={[8, 8, 0x00ff41, 0x003300]} position={[0, -0.1, 0]} />
            </group>

            {/* 全息照片面板 */}
            {photos.slice(0, 15).map((url, i) => (
                <group key={i} position={photoPositions[i].pos} rotation={photoPositions[i].rot}>
                    {/* 边框 */}
                    <mesh>
                        <planeGeometry args={[0.7, 0.52]} />
                        <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.4} />
                    </mesh>
                    {/* 照片内容 */}
                    <mesh position={[0, 0, 0.01]}>
                        <planeGeometry args={[0.65, 0.48]} />
                        <meshBasicMaterial map={new THREE.TextureLoader().load(url)} transparent opacity={0.85} />
                    </mesh>
                    {/* 数据连接线 */}
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([0, 0, 0, -photoPositions[i].pos[0] * 0.9, -photoPositions[i].pos[1] * 0.5, -photoPositions[i].pos[2] * 0.9])}
                                itemSize={3}
                                args={[new Float32Array([0, 0, 0, -photoPositions[i].pos[0] * 0.9, -photoPositions[i].pos[1] * 0.5, -photoPositions[i].pos[2] * 0.9]), 3]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#00ff41" transparent opacity={0.15} />
                    </line>
                </group>
            ))}

            {/* 顶部数据之星 */}
            <group position={[0, treeHeight / 2 + 0.2, 0]}>
                <mesh>
                    <octahedronGeometry args={[0.35]} />
                    <meshBasicMaterial color="#ffd700" wireframe />
                </mesh>
                <mesh>
                    <octahedronGeometry args={[0.2]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
                <pointLight color="#ffd700" intensity={3} distance={6} decay={2} />
            </group>
        </group>
    )
}
