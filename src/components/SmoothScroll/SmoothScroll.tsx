import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 平滑滚动：给整页加惯性/重量感，干掉浏览器默认的"硬"滚动。
 * 同时把 Lenis 的滚动同步给 GSAP ScrollTrigger，保证入场动画时机准确。
 */
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // 大图异步加载会撑高页面，导致 ScrollTrigger 早先算出的触发点位置全部错位
    // （表现：滚到某屏，本该"升起显现"的文字永远停在隐藏态）。
    // 等 load 完成 + 兜底延时各刷新一次，让所有触发点按最终页面高度重算。
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t1 = window.setTimeout(refresh, 600)
    const t2 = window.setTimeout(refresh, 1500)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t1)
      clearTimeout(t2)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return null
}

export default SmoothScroll
