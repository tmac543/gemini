import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import type { GestureData } from '../hooks/useGestureControl'

interface GestureControllerProps {
    gestureData: GestureData
    children: React.ReactNode
}

export function GestureController({ gestureData, children }: GestureControllerProps) {
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    const currentRotation = useRef(0)
    const targetZoom = useRef(1)
    const currentZoom = useRef(1)

    useEffect(() => {
        if (gestureData.handDetected) {
            targetRotation.current = gestureData.rotation * Math.PI * 2
            targetZoom.current = gestureData.zoom
        }
    }, [gestureData])

    useFrame((state) => {
        if (!groupRef.current) return

        // Smooth rotation interpolation
        currentRotation.current += (targetRotation.current - currentRotation.current) * 0.1
        groupRef.current.rotation.y = currentRotation.current

        // Smooth zoom interpolation
        currentZoom.current += (targetZoom.current - currentZoom.current) * 0.1
        groupRef.current.scale.setScalar(currentZoom.current)

        // Trigger effect: gentle bounce
        if (gestureData.trigger) {
            const bounce = Math.sin(state.clock.elapsedTime * 10) * 0.05
            groupRef.current.position.y = bounce
        } else {
            groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.1
        }
    })

    return <group ref={groupRef}>{children}</group>
}
