import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
}

interface CursorTrailProps {
  /** 拖尾保留的点数，越大尾巴越长 */
  length?: number
  /** 末端光点颜色 */
  color?: string
  /** 缓动系数：越小跟随越慢越柔（0.05~0.2） */
  ease?: number
}

/**
 * 鼠标拖尾：一条飘逸虚化、绵延渐隐的柔光尾迹。
 * 纯 canvas 绘制，覆盖全屏、不拦截点击（pointer-events:none）。
 * 尊重 prefers-reduced-motion：用户关掉动画时自动不渲染。
 */
function CursorTrail({
  length = 42,
  color = '#c4485b',
  ease = 0.085,
}: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1
    const resize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse: Point = { x: -100, y: -100 }
    const follower: Point = { x: -100, y: -100 }
    const trail: Point[] = []
    let active = false

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!active) {
        follower.x = mouse.x
        follower.y = mouse.y
        active = true
      }
    }
    const onLeave = () => {
      active = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    // 把十六进制色转成 rgba 字符串，便于控制透明度
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    let raf = 0
    const render = () => {
      // 柔和缓动跟随
      follower.x += (mouse.x - follower.x) * ease
      follower.y += (mouse.y - follower.y) * ease

      if (active) {
        trail.push({ x: follower.x, y: follower.y })
      } else if (trail.length) {
        // 鼠标离开时让尾巴慢慢消散
        trail.shift()
      }
      while (trail.length > length) trail.shift()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (trail.length > 1) {
        // 用叠加混合，让重叠处自然发光
        ctx.globalCompositeOperation = 'lighter'

        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1]
          const p1 = trail[i]
          const t = i / trail.length // 0(尾) → 1(头)
          // 渐隐曲线：尾部更透更细，头部更亮更粗
          const alpha = Math.pow(t, 1.6) * 0.55
          const width = Math.pow(t, 1.4) * 5

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
          ctx.lineWidth = width
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }

        // 末端柔光晕（虚，不是实心）
        const head = trail[trail.length - 1]
        const glow = ctx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          16
        )
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`)
        glow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.12)`)
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalCompositeOperation = 'source-over'
      }

      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [length, color, ease])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}

export default CursorTrail
