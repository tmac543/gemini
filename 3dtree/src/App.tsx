import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { SciFiParticleTree } from './components/SciFiParticleTree'
import { ChristmasTree } from './components/ChristmasTree'
import { SnowTree } from './components/SnowTree'
import { SnowParticles } from './components/SnowParticles'
import { UploadOverlay } from './components/UploadOverlay'
import { WebcamPreview } from './components/WebcamPreview'
import { GestureController } from './components/GestureController'
import { LandingPage } from './components/LandingPage'
import { TemplateSelector } from './components/TemplateSelector'
import { ScreenshotControls } from './components/ScreenshotControls'
import { GestureTutorial } from './components/GestureTutorial'
import { useStore } from './store'
import { useGestureControl } from './hooks/useGestureControl'
import { Hand, ArrowLeft, Home } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const { uiState, gestureEnabled, toggleGesture, page, setPage, selectedTemplate } = useStore()
  const { isReady, error, gestureData } = useGestureControl({
    enabled: gestureEnabled && uiState === 'interactive',
  })

  // 强制重置 Canvas 的状态
  const [canvasKey, setCanvasKey] = useState(0)
  const [showTemplateToast, setShowTemplateToast] = useState(false)

  useEffect(() => {
    // 当模版改变时，更新 key 以强制重绘 Canvas
    setCanvasKey(prev => prev + 1)
    setShowTemplateToast(true)
    const timer = setTimeout(() => setShowTemplateToast(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedTemplate?.id])

  const handleCapture = async () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `christmas-tree-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    }
  }

  // Routing Logic
  if (page === 'landing') {
    return <LandingPage />
  }

  if (page === 'templates') {
    return <TemplateSelector />
  }

  // Determine which tree to render
  const renderTree = () => {
    const templateId = selectedTemplate?.id || 'cyberpunk'
    const position: [number, number, number] = [0, -2, 0]

    switch (templateId) {
      case 'classic':
        return <ChristmasTree position={position} />
      case 'snow':
        return <SnowTree position={position} />
      case 'cyberpunk':
      default:
        return <SciFiParticleTree position={position} />
    }
  }

  // Environment Settings based on template
  const getEnvironment = () => {
    const templateId = selectedTemplate?.id || 'cyberpunk'

    switch (templateId) {
      case 'classic':
        return (
          <>
            <color attach="background" args={['#051020']} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 3, 5]} intensity={0.5} color="#ffd700" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <fog attach="fog" args={['#051020', 10, 50]} />
          </>
        )
      case 'snow':
        return (
          <>
            <color attach="background" args={['#e0f7fa']} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#ffffff" />
            <pointLight position={[-5, 5, -5]} intensity={0.8} color="#b2ebf2" />
            <fog attach="fog" args={['#e0f7fa', 5, 40]} />
            <SnowParticles count={500} />
          </>
        )
      case 'cyberpunk':
      default:
        return (
          <>
            <color attach="background" args={['#000500']} />
            <ambientLight intensity={0.1} />
            {/* 强烈的绿色主光源 */}
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff41" distance={50} />
            {/* 辅助光源 */}
            <pointLight position={[-10, -5, -10]} intensity={0.8} color="#008f11" distance={50} />
            {/* 金色点缀光 */}
            <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffd700" distance={20} />

            <fog attach="fog" args={['#000500', 5, 35]} />
            <Stars radius={100} depth={50} count={7000} factor={4} saturation={1} fade speed={2} />

            <EffectComposer key="composer-cyberpunk">
              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                height={300}
                intensity={1.5}
                levels={8}
                mipmapBlur
              />
            </EffectComposer>
          </>
        )
    }
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {uiState === 'uploading' && <UploadOverlay />}

      {/* Gesture Tutorial */}
      {gestureEnabled && <GestureTutorial />}

      {/* Template Change Toast */}
      <AnimatePresence>
        {showTemplateToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-bold shadow-xl"
          >
            已切换至：{selectedTemplate?.name}
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        key={`canvas-${canvasKey}-${selectedTemplate?.id || 'default'}`}
        camera={{ position: [0, 2, 9], fov: 50 }}
        gl={{ antialias: selectedTemplate?.id !== 'cyberpunk' }} // Turn on antialias for non-post-processing scenes
        shadows
      >
        {getEnvironment()}

        {!gestureEnabled && <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} />}

        {gestureEnabled ? (
          <GestureController gestureData={gestureData}>
            {renderTree()}
          </GestureController>
        ) : (
          renderTree()
        )}
      </Canvas>

      {/* Header */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className={`text-3xl font-bold tracking-wider ${selectedTemplate?.id === 'snow' ? 'text-slate-600' : 'text-white'
          } ${selectedTemplate?.id === 'cyberpunk' ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 bg-clip-text text-transparent' : ''
          }`} style={{ fontFamily: selectedTemplate?.id === 'cyberpunk' ? 'Orbitron, sans-serif' : 'sans-serif' }}>
          {selectedTemplate?.name || 'Magic Christmas Tree'}
        </h1>
      </div>

      {/* Controls Container */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <div className="flex gap-2">
          <button
            onClick={() => setPage('landing')}
            className={`px-3 py-2 rounded backdrop-blur-md border text-sm font-medium transition-all flex items-center gap-2 ${selectedTemplate?.id === 'snow'
              ? 'bg-white/60 border-slate-300 text-slate-700 hover:bg-white/80'
              : 'bg-black/40 border-white/20 text-white hover:bg-white/10'
              }`}
            title="返回首页"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPage('templates')}
            className={`px-4 py-2 rounded backdrop-blur-md border text-sm font-medium transition-all flex items-center gap-2 ${selectedTemplate?.id === 'snow'
              ? 'bg-white/60 border-slate-300 text-slate-700 hover:bg-white/80'
              : 'bg-black/40 border-white/20 text-white hover:bg-white/10'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            切换模版
          </button>
        </div>

        {/* Gesture Toggle Button */}
        {uiState === 'interactive' && (
          <button
            onClick={toggleGesture}
            className={`px-4 py-2 rounded font-medium transition-all flex items-center gap-2 border ${gestureEnabled
              ? 'bg-green-600 border-green-500 text-white shadow-lg'
              : selectedTemplate?.id === 'snow'
                ? 'bg-white/60 border-slate-300 text-slate-600 hover:bg-white/80'
                : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            <Hand className="w-4 h-4" />
            {gestureEnabled ? '手势控制已开启' : '开启手势控制'}
          </button>
        )}
      </div>

      {/* Webcam Preview */}
      <WebcamPreview
        isActive={gestureEnabled && uiState === 'interactive'}
        isReady={isReady}
        error={error}
        handDetected={gestureData.handDetected}
      />

      {/* Screenshot Controls */}
      {uiState === 'interactive' && <ScreenshotControls onCapture={handleCapture} />}
    </div>
  )
}

export default App
