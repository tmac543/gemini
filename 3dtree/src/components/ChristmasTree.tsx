import { useRef } from 'react'
import { Group } from 'three'
import { PhotoFrame } from './PhotoFrame'
import { useStore } from '../store'


interface ChristmasTreeProps {
  position?: [number, number, number]
}

export function ChristmasTree({ position = [0, 0, 0] }: ChristmasTreeProps) {
  const groupRef = useRef<Group>(null)
  const { photos } = useStore()

  // 圣诞树参数
  const treeHeight = 3.5
  const treeBaseRadius = 1.5

  // 照片框位置（螺旋分布在树周围）
  const framePositions: Array<[number, number, number, number]> = []
  const photoCount = Math.min(photos.length, 15)

  for (let i = 0; i < photoCount; i++) {
    const t = i / photoCount
    const angle = t * Math.PI * 6 // 3圈螺旋
    const height = t * treeHeight * 0.7 - treeHeight / 3
    const radius = treeBaseRadius * (1 - t * 0.6) * 0.9

    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = height

    framePositions.push([x, y, z, angle])
  }

  // 创建松树枝叶（多层不规则圆锥）
  const branches = []
  const branchLayers = 12

  for (let i = 0; i < branchLayers; i++) {
    const t = i / branchLayers
    const layerHeight = treeHeight / branchLayers
    const yPos = -treeHeight / 2 + i * layerHeight

    // 每层3-5个不同大小的圆锥，模拟松针簇
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
        color: i < 3 ? '#0d3d1a' : i < 8 ? '#1a5c2e' : '#2d7a45' // 渐变绿色
      })
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* 树干 */}
      <mesh position={[0, -treeHeight / 2 - 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.25, 0.8, 12]} />
        <meshStandardMaterial
          color="#3d2817"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* 主树体 - 大圆锥作为基础 */}
      <mesh position={[0, -treeHeight / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[treeBaseRadius, treeHeight, 8, 1]} />
        <meshStandardMaterial
          color="#1a4d2e"
          roughness={0.95}
          metalness={0}
          flatShading
        />
      </mesh>

      {/* 松树枝叶 - 多层不规则圆锥模拟松针 */}
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
            roughness={0.9}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}

      {/* 顶部星星 */}
      <group position={[0, treeHeight / 2 + 0.4, 0]}>
        {/* 星星主体 */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
          const outerRadius = 0.3

          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[outerRadius * 0.6, 0, 0]}>
                <coneGeometry args={[0.1, 0.4, 4]} />
                <meshStandardMaterial
                  color="#ffd700"
                  emissive="#ffaa00"
                  emissiveIntensity={0.8}
                  metalness={1}
                  roughness={0.1}
                />
              </mesh>
            </group>
          )
        })}
        {/* 中心球 */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={1}
            metalness={1}
            roughness={0.05}
          />
        </mesh>
        {/* 发光点 */}
        <pointLight intensity={1} color="#ffd700" distance={3} />
      </group>

      {/* 照片相框 */}
      {framePositions.map(([x, y, z, angle], index) => (
        <PhotoFrame
          key={index}
          position={[x, y, z]}
          rotation={[0, -angle + Math.PI, 0]}
          photoUrl={photos[index]}
          size={0.35}
        />
      ))}

      {/* 彩色装饰球 - 随机分布 */}
      {Array.from({ length: 25 }).map((_, i) => {
        const t = (i + 5) / 30
        const angle = i * 2.4 + Math.random() * 0.5
        const height = t * treeHeight * 0.65 - treeHeight / 3
        const radius = treeBaseRadius * (1 - t * 0.65) * (0.85 + Math.random() * 0.1)

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = height

        const colors = ['#c41e3a', '#ffd700', '#0066cc', '#ff1493', '#00ff00', '#ff6347']
        const color = colors[i % colors.length]
        const size = 0.06 + Math.random() * 0.04

        return (
          <mesh key={`ball-${i}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial
              color={color}
              metalness={0.95}
              roughness={0.05}
              emissive={color}
              emissiveIntensity={0.3}
            />
          </mesh>
        )
      })}

      {/* 彩灯串 - 小点光源 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const t = i / 30
        const angle = t * Math.PI * 8
        const height = t * treeHeight * 0.7 - treeHeight / 3
        const radius = treeBaseRadius * (1 - t * 0.6) * 0.95

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = height

        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        const color = colors[i % colors.length]

        return (
          <group key={`light-${i}`} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
              />
            </mesh>
            <pointLight
              color={color}
              intensity={0.3}
              distance={0.5}
            />
          </group>
        )
      })}

      {/* 底部礼物盒 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.3
        const distance = 1.8 + Math.random() * 0.3
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance
        const size = 0.25 + Math.random() * 0.15
        const height = size * (0.8 + Math.random() * 0.4)
        const colors = ['#c41e3a', '#00aa00', '#0066cc', '#ffd700', '#ff1493', '#ff6347']

        return (
          <group key={`gift-${i}`} position={[x, -treeHeight / 2 - 0.3, z]} rotation={[0, Math.random() * Math.PI, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[size, height, size]} />
              <meshStandardMaterial
                color={colors[i]}
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            {/* 丝带 */}
            <mesh position={[0, height / 2 + 0.02, 0]}>
              <boxGeometry args={[size * 1.1, 0.04, size * 0.15]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, height / 2 + 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[size * 1.1, 0.04, size * 0.15]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        )
      })}

      {/* 地面雪堆 */}
      <mesh position={[0, -treeHeight / 2 - 0.65, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color="#f0f8ff"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}
