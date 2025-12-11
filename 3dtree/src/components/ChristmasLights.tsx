import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PointLight } from 'three'

interface ChristmasLightProps {
    position: [number, number, number]
    color: string
    delay?: number
}

export function ChristmasLight({ position, color, delay = 0 }: ChristmasLightProps) {
    const lightRef = useRef<PointLight>(null)

    useFrame((state) => {
        if (!lightRef.current) return

        const time = state.clock.elapsedTime + delay
        const intensity = Math.sin(time * 3) * 0.5 + 1.5
        lightRef.current.intensity = intensity
    })

    return (
        <pointLight
            ref={lightRef}
            position={position}
            color={color}
            intensity={1.5}
            distance={3}
            decay={2}
        />
    )
}

export function ChristmasLights() {
    const lights: Array<{ position: [number, number, number]; color: string; delay: number }> = [
        { position: [1.5, 1, 0], color: '#ff0000', delay: 0 },
        { position: [-1.5, 1.5, 0], color: '#00ff00', delay: 0.5 },
        { position: [0, 2.5, 1.5], color: '#0000ff', delay: 1 },
        { position: [1, 0.5, -1], color: '#ffff00', delay: 1.5 },
        { position: [-1, 3, 0.5], color: '#ff00ff', delay: 2 },
        { position: [0.5, 1.8, 1], color: '#00ffff', delay: 2.5 },
    ]

    return (
        <group>
            {lights.map((light, i) => (
                <ChristmasLight
                    key={i}
                    position={light.position}
                    color={light.color}
                    delay={light.delay}
                />
            ))}
        </group>
    )
}
