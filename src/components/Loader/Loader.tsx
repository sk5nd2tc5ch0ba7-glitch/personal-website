import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { scrollToTopInstant } from '../../lib/lenis'
import styles from './Loader.module.css'

const CODE_LINE = 'console.log("你好，世界")'

function Loader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState(0)
  const [done, setDone] = useState(false)
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const typedDone = typed >= CODE_LINE.length

  useEffect(() => {
    if (reduceMotion) {
      setTyped(CODE_LINE.length)
      return
    }
    if (typed >= CODE_LINE.length) return
    const t = setTimeout(() => setTyped((n) => n + 1), 62 + Math.random() * 44)
    return () => clearTimeout(t)
  }, [typed, reduceMotion])

  useGSAP(
    () => {
      const el = rootRef.current
      if (!el) return

      gsap.set(`.${styles.bar}`, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(`.${styles.bar}`, {
        scaleX: 0.85,
        duration: reduceMotion ? 0.4 : 2.0,
        ease: 'power1.out',
      })

      const minTime = new Promise<void>((res) =>
        setTimeout(res, reduceMotion ? 500 : 2200)
      )
      const loaded =
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((res) =>
              window.addEventListener('load', () => res(), { once: true })
            )

      Promise.all([minTime, loaded]).then(() => {
        // Loader 揭开前强制回顶，防止浏览器偷偷恢复了滚动位置
        window.scrollTo(0, 0)
        scrollToTopInstant()

        if (reduceMotion) {
          gsap.to(el, {
            autoAlpha: 0,
            duration: 0.4,
            onComplete: () => setDone(true),
          })
          return
        }
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(`.${styles.bar}`, { scaleX: 1, duration: 0.45, ease: 'power2.in' })
          .to(
            `.${styles.content}`,
            { y: -24, autoAlpha: 0, duration: 0.5, ease: 'power2.in' },
            0.15
          )
          .to(
            `.${styles.meta}`,
            { autoAlpha: 0, duration: 0.4 },
            '<'
          )
          .to(
            el,
            { yPercent: -100, duration: 0.85, ease: 'power3.inOut' },
            '-=0.2'
          )
      })
    },
    { scope: rootRef }
  )

  if (done) return null

  return (
    <div className={styles.loader} ref={rootRef} aria-hidden="true">
      <div className={styles.content}>
        <div className={styles.codeLine}>
          <span className={styles.prompt}>❯</span>
          <span className={styles.code}>
            {CODE_LINE.slice(0, typed)}
            <span
              className={`${styles.caret} ${typedDone ? styles.caretBlink : ''}`}
            />
          </span>
        </div>
        <p className={`${styles.output} ${typedDone ? styles.outShow : ''}`}>
          <span className={styles.outCn}>你好，世界</span>
          <span className={styles.outDot}>·</span>
          <span className={styles.outEn}>Hello, World</span>
        </p>
      </div>

      <div className={styles.meta}>
        <span>EVELYN XU — PORTFOLIO</span>
        <span className={styles.metaLoading}>LOADING</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.bar} />
      </div>
    </div>
  )
}

export default Loader
