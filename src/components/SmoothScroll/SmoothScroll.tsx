import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

function SmoothScroll() {
  useEffect(() => {
    // 确保 Lenis 初始化前滚动位置归零
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // 强制从顶部开始
    lenis.scrollTo(0, { immediate: true })

    lenis.on('scroll', ScrollTrigger.update)
    setLenis(lenis)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t1 = window.setTimeout(refresh, 600)
    const t2 = window.setTimeout(refresh, 1500)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t1)
      clearTimeout(t2)
      gsap.ticker.remove(raf)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}

export default SmoothScroll
