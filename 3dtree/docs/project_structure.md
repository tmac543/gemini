# 项目结构说明

## 目录结构

```
3dtree/
├── docs/                           # 文档目录
│   ├── 需求文档_3d圣诞树.md         # 原始需求文档
│   ├── implementation_plan.md      # 实施计划
│   └── gesture_guide.md            # 手势控制使用指南
│
├── src/
│   ├── components/                 # React 组件
│   │   ├── ChristmasTree.tsx       # 3D 圣诞树组件
│   │   ├── Ornament.tsx            # 装饰球组件（支持纹理）
│   │   ├── UploadOverlay.tsx       # 照片上传界面
│   │   ├── WebcamPreview.tsx       # 摄像头状态预览
│   │   └── GestureController.tsx   # 手势控制器（3D 变换）
│   │
│   ├── hooks/                      # 自定义 Hooks
│   │   └── useGestureControl.ts    # 手势识别 Hook
│   │
│   ├── App.tsx                     # 主应用组件
│   ├── store.ts                    # Zustand 状态管理
│   ├── main.tsx                    # 应用入口
│   └── index.css                   # 全局样式
│
├── public/                         # 静态资源
├── package.json                    # 项目依赖
├── vite.config.ts                  # Vite 配置
├── tailwind.config.js              # Tailwind 配置
└── tsconfig.json                   # TypeScript 配置
```

## 核心组件说明

### 1. App.tsx
主应用组件，负责：
- 管理全局 UI 状态
- 集成手势控制
- 渲染 3D Canvas 和 UI 覆盖层
- 提供手势开关按钮

### 2. ChristmasTree.tsx
3D 圣诞树组件，包含：
- 树干（CylinderGeometry）
- 三层树叶（ConeGeometry）
- 20 个螺旋分布的装饰球
- 从 store 获取照片并映射到装饰球

### 3. Ornament.tsx
装饰球组件，支持：
- 纯色材质
- 照片纹理映射
- 金属质感（metalness + roughness）

### 4. UploadOverlay.tsx
照片上传界面，功能：
- 拖拽/点击上传
- 图片预览
- 上传进度显示
- 玻璃态设计风格

### 5. GestureController.tsx
手势控制器，实现：
- 接收手势数据
- 平滑插值（Lerp）
- 映射到 3D 变换（旋转、缩放、位移）
- 包裹子组件应用变换

### 6. WebcamPreview.tsx
摄像头状态指示器，显示：
- 初始化状态
- 手部检测状态
- 错误信息
- 手势操作提示

### 7. useGestureControl.ts
手势识别 Hook，负责：
- MediaPipe Hands 初始化
- 摄像头访问
- 手势检测算法
- 实时数据更新

### 8. store.ts
Zustand 状态管理，包含：
- photos: 照片数组
- uiState: UI 状态（uploading/viewing/interactive）
- gestureEnabled: 手势控制开关
- 相关 actions

## 数据流

```
用户上传照片
    ↓
store.photos 更新
    ↓
ChristmasTree 读取 photos
    ↓
Ornament 应用纹理
    ↓
3D 场景渲染

---

用户启用手势
    ↓
useGestureControl 初始化
    ↓
摄像头捕获画面
    ↓
MediaPipe 识别手势
    ↓
GestureController 接收数据
    ↓
应用 3D 变换（旋转/缩放）
    ↓
useFrame 平滑更新
```

## 技术栈

### 前端框架
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 3D 渲染
- **Three.js** - 底层 3D 引擎
- **React Three Fiber** - React 集成
- **@react-three/drei** - 辅助组件（OrbitControls, Stars）

### 手势识别
- **MediaPipe Hands** - Google 手势识别
- **@mediapipe/camera_utils** - 摄像头工具

### 状态管理
- **Zustand** - 轻量级状态管理

### 样式
- **Tailwind CSS v4** - 原子化 CSS
- **@tailwindcss/postcss** - PostCSS 插件

### UI 图标
- **lucide-react** - 图标库

## 性能优化

1. **纹理加载**: 使用 TextureLoader 异步加载
2. **平滑插值**: Lerp 避免手势抖动
3. **条件渲染**: 根据状态切换 OrbitControls/GestureController
4. **useMemo**: 装饰球位置计算缓存
5. **useRef**: 避免不必要的重渲染

## 下一步开发

参考 `docs/implementation_plan.md` 中的 Phase 4 和 Phase 5。
