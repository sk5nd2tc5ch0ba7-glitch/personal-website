import { useEffect, useRef, useState } from 'react'
import styles from './DanmuLayer.module.css'
import { DANMU } from '../../data/archive'

/**
 * 飘过式弹幕：有灵魂的吐槽像路过的人一样从右往左飘过，
 * 高度随机、速度随机、偶尔红色点缀。给实验性的纵深场景注入「人味」和幽默。
 *
 * 实现：每隔一段时间放出一条，飘完即销毁。条目从 DANMU 里随机取，
 * 不重复连续两条同样的。加句子只改 src/data/archive.ts 的 DANMU。
 * 尊重 prefers-reduced-motion：关掉时不放弹幕。
 */

interface FlyingDanmu {
  id: number
  text: string
  tone: 'red' | 'plain'
  /** 纵向位置（vh 百分比） */
  top: number
  /** 飘完用时（秒） */
  duration: number
  /** 字号缩放，制造远近层次 */
  scale: number
}

function DanmuLayer() {
  const [items, setItems] = useState<FlyingDanmu[]>([])
  const idRef = useRef(0)
  const lastIdxRef = useRef(-1)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduceMotion) return

    // 所有定时器都登记进来，卸载时统一清，避免泄漏
    const timers = new Set<number>()
    const after = (ms: number, fn: () => void) => {
      const t = window.setTimeout(() => {
        timers.delete(t)
        fn()
      }, ms)
      timers.add(t)
    }

    const spawn = () => {
      // 随机取一条，避免和上一条相同
      let idx = Math.floor(Math.random() * DANMU.length)
      if (idx === lastIdxRef.current) idx = (idx + 1) % DANMU.length
      lastIdxRef.current = idx
      const d = DANMU[idx]

      const id = idRef.current++
      const item: FlyingDanmu = {
        id,
        text: d.text,
        tone: d.tone ?? 'plain',
        top: 12 + Math.random() * 66, // 避开最顶和最底
        duration: 11 + Math.random() * 8,
        scale: 0.82 + Math.random() * 0.5,
      }
      setItems((prev) => [...prev, item])
      // 飘完移除
      after(item.duration * 1000, () => {
        setItems((prev) => prev.filter((it) => it.id !== id))
      })

      // 下一条间隔：0.8~2.2s，疏密随机（加密，让屏上同时飘好几条）
      after(800 + Math.random() * 1400, spawn)
    }
    // 首条稍微延迟，等页面入场；开场错峰连放几条，避免一开始太空
    after(900, spawn)
    after(1500, spawn)
    after(2100, spawn)

    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.id}
          className={`${styles.danmu} ${
            it.tone === 'red' ? styles.red : ''
          }`}
          style={{
            top: `${it.top}%`,
            animationDuration: `${it.duration}s`,
            fontSize: `${it.scale}rem`,
            opacity: 0.3 + (it.scale - 0.82) * 0.7,
          }}
        >
          {it.text}
        </span>
      ))}
    </div>
  )
}

export default DanmuLayer
