import { useState, useEffect } from 'react'
import { X, Hand, RotateCw, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function GestureTutorial() {
    const [show, setShow] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // 检查是否是首次访问
        const hasSeenTutorial = localStorage.getItem('hasSeenGestureTutorial')
        if (!hasSeenTutorial) {
            setTimeout(() => setShow(true), 1000)
        }
    }, [])

    const steps = [
        {
            icon: <Hand className="w-12 h-12" />,
            title: '挥手控制',
            description: '将手掌对准摄像头，即可开始手势控制'
        },
        {
            icon: <RotateCw className="w-12 h-12" />,
            title: '旋转场景',
            description: '左右移动手掌，旋转圣诞树查看不同角度'
        },
        {
            icon: <ZoomIn className="w-12 h-12" />,
            title: '缩放视图',
            description: '上下移动手掌，调整观看距离'
        }
    ]

    const handleClose = () => {
        setShow(false)
        localStorage.setItem('hasSeenGestureTutorial', 'true')
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleClose()
        }
    }

    if (!show) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 relative"
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="text-center">
                        <div className="mb-6 flex justify-center text-blue-400">
                            {steps[currentStep].icon}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                            {steps[currentStep].title}
                        </h3>

                        <p className="text-gray-400 mb-8">
                            {steps[currentStep].description}
                        </p>

                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                            ? 'bg-blue-500 w-8'
                                            : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                            >
                                跳过
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 rounded-xl font-medium transition-all"
                            >
                                {currentStep < steps.length - 1 ? '下一步' : '开始体验'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
