import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Splat } from '@react-three/drei'

interface GaussianSplatBgProps {
  src: string
  className?: string
  onError?: () => void
}

function GaussianSplatBg({ src, className, onError }: GaussianSplatBgProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [-2.11, -2.48, 6.81], fov: 50, near: 0.1, far: 100 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: false, alpha: false }}
        onError={() => onError?.()}
      >
        <color attach="background" args={['#0a0a0a']} />
        <Suspense fallback={null}>
          <Splat src={src} rotation={[0, Math.PI, 0]} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default GaussianSplatBg
