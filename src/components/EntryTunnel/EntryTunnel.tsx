import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './EntryTunnel.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * 旅程隧道（Archive 结尾段）：滚动驱动「连续帧序列」。
 *
 * 用在「隐藏档案」纵深漫游之后：碎片一个个从身边走过 → 走到尽头，
 * 画面从「飘过的碎片」汇聚成一段连续旅程（飞机场醒来→开花→奔跑），
 * 是从「碎片记忆」升华成「我还在往前走」的情绪出口。
 *
 * 帧图在 public/frames/，由 scripts/extract-frames.mjs 拆出。
 * 段内画面缓慢横移（列车感）+ 段交界交叉淡化横移（不硬切）。
 */

const FRAME_COUNT = 330
const framePath = (i: number) =>
  `/frames/frame_${String(i).padStart(4, '0')}.webp`

// 三段字幕：随滚动进度淡入淡出
const CHAPTERS = [
  { id: '01', range: [0, 0.333], title: '从阴天醒来', sub: 'DEPARTURE / 拨开灰色，等一场春天' },
  { id: '02', range: [0.333, 0.666], title: '在衰败中开花', sub: 'BLOOM / 凝固的石头里，也藏着生命' },
  { id: '03', range: [0.666, 1.0], title: '然后向前奔跑', sub: 'RUN / 带着野性，往光的方向去' },
]

function EntryTunnel() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [activeChapter, setActiveChapter] = useState(0)
  const [progress, setProgress] = useState(0)

  // 三段帧区间 + 交界（用于段内横移 + 交界转场）
  const SEG: [number, number][] = [
    [0, 109],
    [110, 219],
    [220, 329],
  ]
  const BOUNDARIES = [109.5, 219.5]
  const TRANS_R = 13

  useGSAP(
    () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const lastP = { current: 0 }
      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      const drawFrame = (
        img: HTMLImageElement | undefined,
        xOffset: number,
        alpha: number
      ) => {
        if (!img || !img.complete || img.naturalWidth === 0) return
        const cw = window.innerWidth
        const ch = window.innerHeight
        const scale =
          Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 1.12
        const dw = img.naturalWidth * scale
        const dh = img.naturalHeight * scale
        ctx.globalAlpha = alpha
        ctx.drawImage(img, (cw - dw) / 2 + xOffset, (ch - dh) / 2, dw, dh)
        ctx.globalAlpha = 1
      }

      const render = (p: number) => {
        const imgs = imagesRef.current
        const cw = window.innerWidth
        const ch = window.innerHeight
        ctx.clearRect(0, 0, cw, ch)

        const fp = p * (FRAME_COUNT - 1)
        const drift = cw * 0.045

        for (const b of BOUNDARIES) {
          if (fp >= b - TRANS_R && fp <= b + TRANS_R) {
            const t = easeInOut((fp - (b - TRANS_R)) / (2 * TRANS_R))
            const lastIdx = Math.floor(b)
            const firstIdx = Math.ceil(b)
            drawFrame(imgs[lastIdx], -drift - t * drift, 1 - t)
            drawFrame(imgs[firstIdx], drift * 2 - t * drift, t)
            return
          }
        }

        const idx = Math.round(fp)
        const seg = SEG.find(([s, e]) => idx >= s && idx <= e) || SEG[0]
        const segP = (idx - seg[0]) / (seg[1] - seg[0])
        const x = (0.5 - segP) * 2 * drift
        drawFrame(imgs[idx], x, 1)
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        render(lastP.current)
      }

      const images: HTMLImageElement[] = []
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image()
        img.src = framePath(i)
        if (i === 1) img.onload = () => render(0)
        images.push(img)
      }
      imagesRef.current = images

      resize()
      window.addEventListener('resize', resize)

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=600%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          lastP.current = p
          render(p)
          setProgress(p)
          const ci = CHAPTERS.findIndex(
            (c) => p >= c.range[0] && p < c.range[1]
          )
          setActiveChapter(ci === -1 ? CHAPTERS.length - 1 : ci)
        },
      })

      return () => {
        window.removeEventListener('resize', resize)
        st.kill()
      }
    },
    { scope: rootRef }
  )

  return (
    <section className={styles.tunnel} ref={rootRef}>
      <div className={styles.tunnel__viewport}>
        <canvas className={styles.tunnel__canvas} ref={canvasRef} />
        <div className={styles.tunnel__overlay} />

        {/* 开头暗场引子：碎片走完后，先有一句话把人领进旅程 */}
        <div
          className={styles.tunnel__lead}
          style={{ opacity: progress < 0.04 ? 1 : 0 }}
        >
          <span className={styles.tunnel__leadCn}>而这些碎片，最终汇成一段旅程</span>
          <span className={styles.tunnel__leadEn}>AND ALL THESE FRAGMENTS BECOME A JOURNEY</span>
        </div>

        {/* 居中字幕：随段落淡入淡出 */}
        <div className={styles.tunnel__caption}>
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              className={`${styles.cap} ${i === activeChapter && progress >= 0.04 ? styles['cap--on'] : ''}`}
            >
              <span className={styles.cap__id}>{c.id}</span>
              <h2 className={styles.cap__title}>{c.title}</h2>
              <span className={styles.cap__sub}>{c.sub}</span>
            </div>
          ))}
        </div>

        {/* 右侧竖向进度 */}
        <div className={styles.tunnel__rail}>
          <span className={styles.tunnel__railNum}>
            {String(activeChapter + 1).padStart(2, '0')}
            <span className={styles.tunnel__railTotal}>/0{CHAPTERS.length}</span>
          </span>
          <div className={styles.tunnel__railTrack}>
            <div
              className={styles.tunnel__railFill}
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default EntryTunnel
