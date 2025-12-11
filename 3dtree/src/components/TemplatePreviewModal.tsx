import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { ChristmasTree } from './ChristmasTree'
import { SnowParticles } from './SnowParticles'
import { ChristmasLights } from './ChristmasLights'
import { X } from 'lucide-react'

interface TemplatePreviewModalProps {
    templateName: string
    onClose: () => void
    onPurchase?: () => void
    isPaid: boolean
}

export function TemplatePreviewModal({ templateName, onClose, onPurchase, isPaid }: TemplatePreviewModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-6xl h-[85vh] flex flex-col border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{templateName} - 预览</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {isPaid ? '购买后解锁完整功能' : '免费模版，立即使用'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* 3D Preview */}
                <div className="flex-1 relative bg-[#0a0a15]">
                    <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
                        <color attach="background" args={['#0a0a15']} />
                        <ambientLight intensity={0.3} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
                        <pointLight position={[-10, -10, -10]} intensity={0.3} />

                        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                        <SnowParticles count={200} />
                        <ChristmasLights />

                        <group rotation={[0, 0, 0]}>
                            <ChristmasTree position={[0, -1.5, 0]} />
                        </group>

                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.5}
                            maxPolarAngle={Math.PI / 2}
                            minPolarAngle={Math.PI / 3}
                        />
                    </Canvas>

                    {/* Watermark for paid templates */}
                    {isPaid && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-white/20 text-6xl font-bold transform -rotate-45">
                                预览模式
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-lg p-3 text-white text-sm border border-white/10">
                        <p>💡 拖拽旋转 | 滚轮缩放</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        {isPaid ? '购买后可上传照片、使用手势控制、导出作品' : '立即开始创作您的专属圣诞树'}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                        >
                            关闭
                        </button>
                        {isPaid && onPurchase && (
                            <button
                                onClick={onPurchase}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 rounded-lg font-medium transition-all"
                            >
                                立即购买
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
