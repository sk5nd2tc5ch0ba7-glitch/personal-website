import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './RoseGarden.module.css'
import gardenBg from '../../../assets/images/1a8b937fd7e3b4419e40b1c1bd51878.jpg'
import photo1 from '../../../assets/images/1.jpg'
import photo2 from '../../../assets/images/2.jpg'
import photo3 from '../../../assets/images/3.png'
import photo4 from '../../../assets/images/4.jpg'
import photo5 from '../../../assets/images/5.jpg'
import photo6 from '../../../assets/images/6.jpg'
import photo7 from '../../../assets/images/10.jpg'
import photo8 from '../../../assets/images/8.jpg'

gsap.registerPlugin(ScrollTrigger)

/**
 * 顶部垂落的照片配置（占位，后续替换真图）。
 * left  —— 横向位置
 * len   —— 红线长度（vh），决定照片悬挂高度
 * size  —— 照片宽度（px）
 * dropAt—— 在掉落 timeline 上的起始时刻（0~1，集中在前半段）
 * sway  —— 落定前的初始倾角，制造"绳子甩动"的手写物理感
 */
const PHOTOS = [
  { left: '6%', len: 30, size: 95, dropAt: 0.0, sway: -4, src: photo1 },
  { left: '17%', len: 16, size: 70, dropAt: 0.05, sway: 3, src: photo2 },
  { left: '27%', len: 24, size: 79, dropAt: 0.12, sway: -3, src: photo3 },
  { left: '44%', len: 12, size: 64, dropAt: 0.2, sway: 2, src: photo4 },
  { left: '58%', len: 26, size: 86, dropAt: 0.08, sway: 4, src: photo5 },
  { left: '70%', len: 18, size: 73, dropAt: 0.16, sway: -3, src: photo6 },
  { left: '82%', len: 22, size: 81, dropAt: 0.03, sway: 3, src: photo7 },
  { left: '90%', len: 34, size: 66, dropAt: 0.22, sway: -2, src: photo8 },
]

/** 飘落代码字符：二进制为主，混入"种玫瑰"意象 */
const TOKENS = [
  '0', '1', '0', '1', '0', '1', '00', '01', '10', '11', '0101', '1001',
  'const', 'rose', 'bloom', '{', '}', '</>', 'seed', 'grow', 'if', 'true',
  'null', ';', '=>', 'petal', 'hope', 'decay', 'life',
]
const SEED_TOKENS = ['rose', 'bloom', '♥', 'grow', 'love']

function RoseGarden() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const pendantRefs = useRef<(HTMLDivElement | null)[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })

  // === 红线吊照片：随滚动一边画一边掉 ===
  useGSAP(
    () => {
      // 文字入场（非 scrub，进视口即淡入上浮）
      gsap.from(`.${styles.garden__cn}`, {
        y: 36,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
      })
      gsap.from(`.${styles.garden__en}`, {
        y: 18,
        autoAlpha: 0,
        duration: 1,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
      })

      // outro 桥接文字：进视口淡入上浮
      gsap.from(`.${styles.outro} > *`, {
        y: 40,
        autoAlpha: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: outroRef.current, start: 'top 72%' },
      })

      // 照片掉落：scrub 绑定整段滚动，前 ~45% 全部落定
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      // 撑满 timeline 时长为 1，让照片集中在前半段
      tl.to({}, { duration: 1 }, 0)

      // 底图随滚动从顶部平移到底部 → 底部的蔷薇"一边滑一边显现"。
      // 竖长图 cover 后高度远超视口，objectPosition 从 top 推到 bottom 即可。
      // 速度曲线分四段（按底图纵向百分比分区，duration = 占用的滚动距离）。
      // 速度 = 图片移动距离 / duration：duration 越大 → 同样图片距离要滚更久 → 越慢。
      //   段1 0→35  匀速慢（白底，慢慢推）
      //   段2 35→70 慢速（略减速）
      //   段3 70→90 最慢（好看区，滚很多才挪一点，方便停下细看）
      //   段4 90→100 加速掠过结尾不好看的部分
      // 想某段更慢 → 调大该段 duration；整体更慢 → 调高 .garden 的 height。
      if (bgRef.current) {
        const bg = bgRef.current
        // 显式锁定起点。关键：用 .to() 链而非多个 fromTo —— fromTo 默认 immediateRender，
        // 4 段创建时会各自把底图瞬间设到自己的起点，最后一段(起点90%)获胜，导致页面一加载
        // 底图就被拍到底部，首次下滑时被 scrub 猛拉回顶部 → 闪一张图 + 卡顿。
        // .to() 不会预渲染起点，每段从上一段终点接着走，运动完全一致且无闪。
        gsap.set(bg, { objectPosition: 'center 0%' })
        const seg = (to: number, at: number, dur: number, ease: string) =>
          tl.to(
            bg,
            { objectPosition: `center ${to}%`, ease, duration: dur },
            at
          )
        seg(35, 0, 0.4, 'none') //   前段白底：匀速慢
        seg(70, 0.4, 0.46, 'none') // 慢速
        seg(90, 0.86, 0.52, 'power1.out') // 好看区：最慢，减速到近乎停住
        seg(100, 1.38, 0.12, 'power1.in') // 结尾：加速掠过
      }

      // 先把所有照片立刻锁到隐藏起点，避免滚到 dropAt 前先以原位露脸（闪一下）
      const pendants = pendantRefs.current.filter(Boolean) as HTMLDivElement[]
      gsap.set(pendants, { autoAlpha: 0, yPercent: -135 })

      PHOTOS.forEach((p, i) => {
        const el = pendantRefs.current[i]
        if (!el) return
        tl.fromTo(
          el,
          { yPercent: -135, autoAlpha: 0, rotation: p.sway },
          {
            yPercent: 0,
            autoAlpha: 1,
            rotation: 0,
            ease: 'back.out(1.4)',
            duration: 0.22,
            immediateRender: false,
          },
          p.dropAt
        )
      })
    },
    { scope: rootRef }
  )

  // === 代码雨堆山：canvas 持续下落、逐列累积成山 ===
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = false

    const COL_W = 12
    const CHAR_H = 13
    const STACK_STEP = CHAR_H * 0.62 // 字符叠压，堆得密实
    let cols = 0
    let stackH: number[] = []
    let maxH: number[] = []

    interface P {
      x: number
      y: number
      col: number
      vy: number
      text: string
      size: number
      alpha: number
      settled: boolean
      seed: boolean
    }
    let parts: P[] = []

    const resize = () => {
      canvas.width = stage.clientWidth
      canvas.height = stage.clientHeight
      cols = Math.ceil(canvas.width / COL_W)
      stackH = new Array(cols).fill(0)
      maxH = new Array(cols).fill(0)
      const cx = cols / 2
      for (let c = 0; c < cols; c++) {
        const d = Math.abs(c - cx) / cx // 0 中心 → 1 边缘
        // 抛物线：中间高两边低，加噪声让山脊起伏
        const h = (1 - d * d) * canvas.height * 0.34
        maxH[c] = Math.max(0, h + (Math.random() * 2 - 1) * CHAR_H * 1.6)
      }
      parts = []
    }
    resize()
    window.addEventListener('resize', resize)

    // 鼠标推开：靠近的未沉降字符被推离指针；同时驱动细光圈跟随
    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseRef.current = { x, y, active: true }
      const ring = cursorRef.current
      if (ring) {
        ring.style.opacity = '1'
        ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
    }
    const onLeave = () => {
      mouseRef.current.active = false
      const ring = cursorRef.current
      if (ring) ring.style.opacity = '0'
    }
    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', onLeave)

    const spawn = () => {
      const col = Math.floor(Math.random() * cols)
      const seed = Math.random() < 0.05
      parts.push({
        x: col * COL_W + Math.random() * 3,
        y: -CHAR_H,
        col,
        vy: 0.6 + Math.random() * 0.9,
        text: seed
          ? SEED_TOKENS[(Math.random() * SEED_TOKENS.length) | 0]
          : TOKENS[(Math.random() * TOKENS.length) | 0],
        size: 10 + Math.random() * 3,
        alpha: 0.12 + Math.random() * 0.22,
        settled: false,
        seed,
      })
    }

    const loop = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 山没堆满 → 持续下雨；堆满 → 零星补落
      let totalMax = 0
      let totalStack = 0
      for (let c = 0; c < cols; c++) {
        totalMax += maxH[c]
        totalStack += stackH[c]
      }
      if (totalStack < totalMax) {
        for (let s = 0; s < 3; s++) spawn()
      } else if (Math.random() < 0.12) {
        spawn()
      }

      for (const p of parts) {
        if (!p.settled) {
          // 鼠标推开：靠近指针的下落字符被推离，制造"拨开代码雨"的手感
          const m = mouseRef.current
          if (m.active) {
            const dx = p.x - m.x
            const dy = p.y - m.y
            const dist = Math.hypot(dx, dy)
            if (dist < 120 && dist > 0.1) {
              const push = (1 - dist / 120) * 2.4
              p.x += (dx / dist) * push
              p.y += (dy / dist) * push * 0.5
            }
          }

          p.y += p.vy
          p.vy += 0.02
          const restY = canvas.height - stackH[p.col] - CHAR_H
          if (p.y >= restY && stackH[p.col] < maxH[p.col]) {
            p.y = restY
            p.settled = true
            stackH[p.col] += STACK_STEP
          }
        }

        ctx.font = `${p.size}px 'IBM Plex Mono', 'Consolas', monospace`
        if (p.seed) {
          ctx.fillStyle = `rgba(176, 58, 70, ${p.alpha + 0.25})`
        } else {
          ctx.fillStyle = p.settled
            ? `rgba(74, 76, 80, ${p.alpha})`
            : `rgba(110, 113, 118, ${p.alpha})`
        }
        ctx.fillText(p.text, p.x, p.y)
      }

      // 清掉落出屏幕且未定居的（列满后继续坠落消失）
      parts = parts.filter(
        (p) => p.settled || p.y < canvas.height + CHAR_H * 2
      )

      raf = requestAnimationFrame(loop)
    }

    // 只在视口内跑，滚出即停
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        running = self.isActive
        if (running) {
          raf = requestAnimationFrame(loop)
        } else {
          cancelAnimationFrame(raf)
        }
      },
    })

    return () => {
      window.removeEventListener('resize', resize)
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      st.kill()
    }
  }, [])

  return (
    <>
    <section className={styles.garden} id="manifesto" ref={rootRef}>
      <div className={styles.garden__stage} ref={stageRef}>
        <img
          className={styles.garden__bg}
          ref={bgRef}
          src={gardenBg}
          alt="在衰败的废墟中，一朵红玫瑰破土生长"
        />

        {/* 代码雨堆山 */}
        <canvas ref={canvasRef} className={styles.garden__canvas} />

        {/* 跟随鼠标的细光圈 */}
        <div ref={cursorRef} className={styles.garden__cursor} />

        {/* 顶部垂落的照片（红线 + 占位） */}
        <div className={styles.garden__pendants}>
          {PHOTOS.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                pendantRefs.current[i] = el
              }}
              className={styles.pendant}
              style={{ left: p.left } as React.CSSProperties}
            >
              <span
                className={styles.pendant__line}
                style={{ height: `${p.len}vh` }}
              />
              <div
                className={styles.pendant__photo}
                style={
                  {
                    width: `clamp(${Math.round(p.size * 0.62)}px, ${(
                      (p.size / 1200) *
                      100
                    ).toFixed(2)}vw, ${Math.round(p.size * 1.7)}px)`,
                  } as React.CSSProperties
                }
              >
                <img src={p.src} alt={`回忆 ${String(i + 1).padStart(2, '0')}`} />
              </div>
            </div>
          ))}
        </div>

        {/* 文字层：参照效果图，偏上居中 */}
        <div className={styles.garden__body}>
          <p className={styles.garden__cn}>
            在衰败中寻找生命的证据，
            <br />
            在代码里种下一朵
            <span className={styles.garden__accent}>玫瑰</span>。
          </p>
          <p className={styles.garden__en}>
            I SEEK PROOFS OF LIFE IN DECAY,
            <br />
            I PLANT A ROSE IN CODE.
          </p>
        </div>
      </div>
    </section>

    {/* 纯白 outro：拉开大段留白，一句单独的桥接文字，把"花园"过渡到"我走过的路" */}
    <section className={styles.outro} ref={outroRef}>
      <p className={styles.outro__cn}>而我，仍在生长。</p>
      <p className={styles.outro__en}>AND I AM STILL GROWING.</p>
    </section>
    </>
  )
}

export default RoseGarden
