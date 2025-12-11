# Magic Christmas Tree - Implementation Plan

## Project Overview
A 3D interactive Christmas Tree Photo Wall using React Three Fiber and MediaPipe. Users upload photos which decorate the tree, and control the view using hand gestures.

## Technology Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **3D Engine:** React Three Fiber (R3F) + Drei + Three.js
- **State Management:** Zustand
- **Gesture Recognition:** MediaPipe Hands
- **Animation:** Framer Motion (UI), React Spring (3D transitions)

## Phase 1: Project Initialization & Basic 3D Scene
**Goal:** Set up the environment and render a static 3D tree with mouse controls.

1.  **Scaffold Project:**
    - Initialize Vite with React/TypeScript.
    - Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `tailwindcss`, `lucide-react`.
    - Configure Tailwind CSS.

2.  **Basic Scene Setup:**
    - Create `Canvas` container.
    - Add `OrbitControls` for mouse interaction.
    - Add basic lighting (Ambient, Directional, Point).
    - Add a background (Color or Environment).

3.  **Tree Component:**
    - Create a procedural `ChristmasTree` component using `ConeGeometry` (layers of foliage) and `CylinderGeometry` (trunk).
    - Add placeholder `Ornament` spheres distributed spirally around the tree.

## Phase 2: Photo Upload & Texture Mapping
**Goal:** Allow users to upload photos and map them onto the tree ornaments.

1.  **State Management (Zustand):**
    - Create `useStore` to manage:
        - `photos`: Array of image URLs (blob/base64).
        - `uiState`: 'uploading', 'viewing', 'interactive'.

2.  **Upload UI:**
    - Create an overlay UI for file upload.
    - Implement file reading (FileReader) to convert images to Data URLs.
    - Limit max photos (e.g., 20-50).

3.  **Texture Mapping:**
    - Update `Ornament` component to accept a texture URL.
    - Use `TextureLoader` (via `useTexture` or `useLoader`) to load user photos.
    - Apply texture to the `map` property of the sphere material.
    - Handle aspect ratio or UV mapping (simple spherical mapping for now).

## Phase 3: Gesture Control (MediaPipe)
**Goal:** Implement hand tracking to control rotation and zoom.

1.  **MediaPipe Integration:**
    - Install `@mediapipe/hands`, `@mediapipe/camera_utils`.
    - Create a `WebcamInput` component (hidden or small preview).
    - Initialize MediaPipe Hands solution.

2.  **Gesture Logic:**
    - **Rotation:** Detect "Fist" or hand position (x-axis movement) to rotate the tree group.
    - **Zoom:** Detect distance between two hands (Pinch or Open/Close) to control Camera Zoom or Dolly.
    - **Trigger:** Detect "Open Hand" or specific pose for effects.

3.  **Control Loop:**
    - Use `useFrame` to update 3D scene state based on latest gesture data.
    - Smooth values using `lerp` (Linear Interpolation) to avoid jitter.

## Phase 4: Visual Polish & Effects
**Goal:** Make it look "Magical" and Premium.

1.  **Atmosphere:**
    - Add `Sparkles` (Snow effect).
    - Add `Stars` background.
    - Post-processing: `Bloom` for glowing lights.

2.  **Animations:**
    - Animate ornaments floating or gently rotating.
    - Transition effects when photos are added.

3.  **UI Refinement:**
    - Glassmorphism style for UI overlays.
    - Instructions for gestures.

## Phase 5: Export & Commercialization (Future)
- Implement `MediaRecorder` for video export.
- Prepare structure for payment integration.

---

## Next Steps
1.  Initialize the project structure.
2.  Build the Phase 1 Basic Scene.

---

## 当前进度 (Current Progress)

### ✅ Phase 1: 基础 3D 场景 - 已完成
- ✅ 项目初始化 (React + Vite + TypeScript)
- ✅ 安装依赖 (React Three Fiber, Drei, Zustand, Tailwind CSS)
- ✅ 配置 Tailwind CSS v4
- ✅ 创建基础 Canvas 场景
- ✅ 实现 ChristmasTree 组件（树干 + 三层树叶）
- ✅ 添加 Ornament 装饰球组件
- ✅ 螺旋分布 20 个装饰球
- ✅ 添加 OrbitControls 鼠标控制
- ✅ 添加星空背景和灯光

### ✅ Phase 2: 照片上传与贴图 - 已完成
- ✅ 创建 Zustand 状态管理
- ✅ 实现 UploadOverlay 上传界面
- ✅ 支持多图片上传（拖拽/点击）
- ✅ 图片预览功能
- ✅ 将上传的照片映射到装饰球纹理
- ✅ TextureLoader 加载用户照片

### ✅ Phase 3: 手势控制 - 已完成
- ✅ 安装 MediaPipe Hands 依赖
- ✅ 创建 useGestureControl Hook
- ✅ 实现摄像头访问和初始化
- ✅ 手势识别逻辑（握拳、张开手掌、双手距离）
- ✅ GestureController 组件（手势到 3D 变换映射）
- ✅ WebcamPreview 状态指示器
- ✅ 手势控制开关按钮
- ✅ 平滑插值（Lerp）避免抖动
- ✅ 支持三种手势：
  - 握拳旋转
  - 双手缩放
  - 张开手掌触发特效

### ✅ Phase 4: 视觉优化 - 已完成
- ✅ 雪花粒子系统（800 个粒子）
- ✅ 彩灯闪烁效果（6 个彩色点光源）
- ✅ 装饰球浮动和旋转动画
- ✅ 增强星空背景（5000 颗星）
- ✅ 优化光照系统（多层次照明）
- ✅ 深蓝夜空背景
- ✅ 性能优化（BufferGeometry）

### 📋 Phase 5: 导出与商业化 - 待开始
- 视频录制
- 支付集成
