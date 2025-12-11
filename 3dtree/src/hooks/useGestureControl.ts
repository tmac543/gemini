import { useEffect, useRef, useState } from 'react'
import { Hands, type Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'

interface UseGestureControlProps {
    onGestureUpdate?: (data: GestureData) => void
    enabled?: boolean
}

export interface GestureData {
    rotation: number // -1 to 1 for left/right rotation
    zoom: number // 0.5 to 2 for zoom level
    trigger: boolean // special gesture detected
    handDetected: boolean
}

export function useGestureControl({ onGestureUpdate, enabled = true }: UseGestureControlProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const cameraRef = useRef<Camera | null>(null)
    const handsRef = useRef<Hands | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const gestureDataRef = useRef<GestureData>({
        rotation: 0,
        zoom: 1,
        trigger: false,
        handDetected: false,
    })

    useEffect(() => {
        if (!enabled) return

        const videoElement = document.createElement('video')
        videoElement.style.display = 'none'
        document.body.appendChild(videoElement)
        videoRef.current = videoElement

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            },
        })

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        })

        hands.onResults((results: Results) => {
            processGesture(results)
        })

        handsRef.current = hands

        // Initialize camera
        navigator.mediaDevices
            .getUserMedia({ video: { width: 640, height: 480 } })
            .then(() => {
                const camera = new Camera(videoElement, {
                    onFrame: async () => {
                        if (handsRef.current) {
                            await handsRef.current.send({ image: videoElement })
                        }
                    },
                    width: 640,
                    height: 480,
                })
                cameraRef.current = camera
                camera.start()
                setIsReady(true)
            })
            .catch((err) => {
                console.error('Camera access denied:', err)
                setError('无法访问摄像头')
            })

        return () => {
            cameraRef.current?.stop()
            handsRef.current?.close()
            if (videoRef.current) {
                document.body.removeChild(videoRef.current)
            }
        }
    }, [enabled])

    const processGesture = (results: Results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            gestureDataRef.current.handDetected = false
            onGestureUpdate?.(gestureDataRef.current)
            return
        }

        gestureDataRef.current.handDetected = true

        const landmarks = results.multiHandLandmarks[0]

        // Calculate hand position (wrist x-coordinate for rotation)
        const wrist = landmarks[0]
        const rotation = (wrist.x - 0.5) * 2 // Map 0-1 to -1 to 1

        // Detect fist (fingers closed)
        const isFist = detectFist(landmarks)

        if (isFist) {
            gestureDataRef.current.rotation = rotation
        }

        // Detect pinch for zoom (two hands)
        if (results.multiHandLandmarks.length === 2) {
            const hand1 = results.multiHandLandmarks[0][9] // Middle finger tip
            const hand2 = results.multiHandLandmarks[1][9]
            const distance = Math.sqrt(
                Math.pow(hand1.x - hand2.x, 2) + Math.pow(hand1.y - hand2.y, 2)
            )
            gestureDataRef.current.zoom = Math.max(0.5, Math.min(2, distance * 3))
        }

        // Detect open hand (trigger)
        const isOpenHand = detectOpenHand(landmarks)
        gestureDataRef.current.trigger = isOpenHand

        onGestureUpdate?.(gestureDataRef.current)
    }

    const detectFist = (landmarks: any[]) => {
        // Check if all fingertips are below their respective knuckles
        const fingerTips = [8, 12, 16, 20] // Index, Middle, Ring, Pinky tips
        const fingerKnuckles = [6, 10, 14, 18]

        let closedCount = 0
        for (let i = 0; i < fingerTips.length; i++) {
            if (landmarks[fingerTips[i]].y > landmarks[fingerKnuckles[i]].y) {
                closedCount++
            }
        }
        return closedCount >= 3
    }

    const detectOpenHand = (landmarks: any[]) => {
        // Check if all fingertips are above their knuckles
        const fingerTips = [8, 12, 16, 20]
        const fingerKnuckles = [6, 10, 14, 18]

        let openCount = 0
        for (let i = 0; i < fingerTips.length; i++) {
            if (landmarks[fingerTips[i]].y < landmarks[fingerKnuckles[i]].y) {
                openCount++
            }
        }
        return openCount >= 3
    }

    return {
        isReady,
        error,
        gestureData: gestureDataRef.current,
    }
}
