import { useEffect, useRef } from 'react'

/**
 * 水波纹：鼠标移动/点击时在画面上荡开一圈圈淡色涟漪，
 * 呼应「玫瑰种在代码里」的水感叙事，给纵深漫游加一层「这是活的场景」的信号。
 *
 * 纯 canvas，覆盖全屏、不拦截点击（pointer-events:none）。
 * 移动时低频自发地散落小波纹，点击时荡开一圈大的。
 * 尊重 prefers-reduced-motion：关掉动画时不渲染。
 */

interface Ripple {
  x: number
  y: number
  /** 当前半径 */
  r: number
  /** 最大半径 */
  max: number
  /** 生命 0→1 */
  life: number
  /** 每帧推进速度 */
  speed: number
  /** 初始透明度强度 */
  strength: number
}

interface WaterRippleProps {
  /** 波纹主色（默认沿用品牌红） */
  color?: string
}

function WaterRipple({ color = '#c4485b' }: WaterRippleProps) {
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

    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    const ripples: (Ripple & { big: boolean })[] = []
    const addRipple = (x: number, y: number, big: boolean) => {
      ripples.push({
        x,
        y,
        r: 0,
        max: big ? 150 + Math.random() * 90 : 46 + Math.random() * 30,
        life: 0,
        speed: big ? 0.009 : 0.016,
        strength: big ? 0.32 : 0.16,
        big,
      })
      // 限制总量，避免堆积
      while (ripples.length > 60) ripples.shift()
    }

    let lastSpawn = 0
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      // 移动时低频自发散落（每 ~90ms 一颗），避免太密
      if (now - lastSpawn > 90) {
        addRipple(e.clientX, e.clientY, false)
        lastSpawn = now
      }
    }
    const onDown = (e: MouseEvent) => addRipple(e.clientX, e.clientY, true)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)

    let raf = 0
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 叠加混合：多圈交汇处自然提亮，像水面反光
      ctx.globalCompositeOperation = 'lighter'

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.life += rp.speed
        rp.r = rp.max * easeOut(rp.life)
        if (rp.life >= 1) {
          ripples.splice(i, 1)
          continue
        }
        // 淡入淡出：刚冒头时先涨起来，再随生命衰减，避免「啪」地出现
        const fade = Math.sin(Math.min(1, rp.life * 1.15) * Math.PI)
        const alpha = fade * rp.strength
        if (alpha <= 0.001 || rp.r < 1) continue

        // 环的厚度随扩张变薄，模拟水纹荡开越远越细
        const ring = (rp.big ? 18 : 11) * (1 - rp.life * 0.55)
        const inner = Math.max(0, rp.r - ring)
        // 用径向渐变画「柔环」：中心透明 → 环峰最亮 → 外缘虚化
        const grad = ctx.createRadialGradient(
          rp.x,
          rp.y,
          inner,
          rp.x,
          rp.y,
          rp.r + ring * 0.6
        )
        const peak = inner / (rp.r + ring * 0.6 || 1)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
        // 亮带偏暖白，红只作底色，去掉「红色描边」的雷达感
        grad.addColorStop(
          Math.min(0.98, peak + 0.02),
          `rgba(255, 246, 248, ${(alpha * 0.9).toFixed(3)})`
        )
        grad.addColorStop(
          Math.min(0.99, peak + 0.12),
          `rgba(${r}, ${g}, ${b}, ${(alpha * 0.5).toFixed(3)})`
        )
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r + ring * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    />
  )
}

// 半径扩张用 ease-out，前快后慢，像真水纹荡开
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default WaterRipple
