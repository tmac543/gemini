import { Camera } from 'lucide-react'
import { useState } from 'react'

interface ScreenshotControlsProps {
    onCapture: () => void
}

export function ScreenshotControls({ onCapture }: ScreenshotControlsProps) {
    const [capturing, setCapturing] = useState(false)

    const handleCapture = async () => {
        setCapturing(true)
        try {
            await onCapture()
            // 显示成功提示
            setTimeout(() => setCapturing(false), 1000)
        } catch (error) {
            console.error('截图失败:', error)
            setCapturing(false)
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-20 flex flex-col gap-3">
            <button
                onClick={handleCapture}
                disabled={capturing}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="截图保存"
            >
                {capturing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        处理中...
                    </>
                ) : (
                    <>
                        <Camera className="w-5 h-5" />
                        截图保存
                    </>
                )}
            </button>

            {/* 提示文字 */}
            <div className="text-center text-xs text-gray-400 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                💡 保存您的作品
            </div>
        </div>
    )
}
