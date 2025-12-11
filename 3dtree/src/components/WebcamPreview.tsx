import { Camera, Hand } from 'lucide-react'

interface WebcamPreviewProps {
    isActive: boolean
    isReady: boolean
    error: string | null
    handDetected: boolean
}

export function WebcamPreview({ isActive, isReady, error, handDetected }: WebcamPreviewProps) {
    if (!isActive) return null

    return (
        <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-gray-300">手势控制</span>
                </div>

                {error ? (
                    <div className="text-xs text-red-400">{error}</div>
                ) : !isReady ? (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        初始化中...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${handDetected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <Hand className={`w-4 h-4 ${handDetected ? 'text-green-400' : 'text-gray-500'}`} />
                        <span className="text-xs text-gray-400">
                            {handDetected ? '已检测' : '未检测'}
                        </span>
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500 space-y-1">
                    <div>✊ 握拳移动 = 旋转</div>
                    <div>🤲 双手开合 = 缩放</div>
                    <div>✋ 张开手掌 = 特效</div>
                </div>
            </div>
        </div>
    )
}
