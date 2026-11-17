import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ArchivePage.module.css'
import { FRAGMENTS } from '../data/archive'
import WaterRipple from '../components/Archive/WaterRipple'
import DanmuLayer from '../components/Archive/DanmuLayer'
import EntryTunnel from '../components/EntryTunnel/EntryTunnel'
import bgImg from '../../assets/images/777.jpg'

gsap.registerPlugin(ScrollTrigger)

/**
 * 隐藏档案 /archive —— 「创作者的脑内后台」。
 *
 * 不是往下翻页，而是往屏幕【纵深】走：碎片在 z 轴上由远及近浮现，
 * 左右交替（左边一个、右边一个），从虚化+缩小 → 清晰+原大（走到面前）
 * → 再放大虚化穿过消失，模拟在一个雾气场景里一步步走近又走过。
 * 配水波纹 + 打字机旁白 + 飘过式弹幕 + 一点红，VR 漫游感。
 *
 * 滚动不劫持（交给全局 Lenis 给惯性），纵深变换用 ScrollTrigger scrub 驱动。
 * 背景现在是 CSS 雾感顶替，等真背景视频好了换成 <video>。
 */
function ArchivePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(-1) // 当前走到面前的碎片
  const [typed, setTyped] = useState(0)

  const caption = active >= 0 ? FRAGMENTS[active]?.caption ?? '' : ''

  // 打字机旁白：每次 active 变化重置，逐字敲出（带轻微随机抖动）
  useEffect(() => {
    setTyped(0)
  }, [active])

  useEffect(() => {
    if (!caption || typed >= caption.length) return
    const t = setTimeout(() => setTyped((n) => n + 1), 38 + Math.random() * 60)
    return () => clearTimeout(t)
  }, [caption, typed])

  useGSAP(
    () => {
      const N = FRAGMENTS.length
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

      // 主时间线：绑整段滚动，scrub 跟手。每个碎片占 1 个时间单位，
      // 前后重叠 0.4，保证「上一个还没完全消失，下一个已经在远处浮现」。
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            // 谁正走到面前：用进度映射到碎片索引
            const idx = Math.min(N - 1, Math.floor(self.progress * N + 0.18))
            setActive((prev) => (prev === idx ? prev : idx))
          },
        },
      })

      cards.forEach((card, i) => {
        const side = FRAGMENTS[i].side === 'left' ? -1 : 1
        // 远处起点：偏向各自一侧、缩小、虚化、透明
        gsap.set(card, {
          xPercent: side * 38,
          yPercent: -50,
          x: 0,
          scale: 0.52,
          rotateY: side * 14,
          autoAlpha: 0,
          filter: 'blur(16px)',
        })
        // 走近：移到中央、原大、清晰
        tl.to(
          card,
          {
            xPercent: side * 8,
            scale: 1,
            rotateY: side * 3,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.6,
          },
          i
        )
          // 穿过：继续放大、推开、虚化消失（像从身边走过）
          .to(
            card,
            {
              xPercent: side * 30,
              scale: 1.45,
              rotateY: side * -6,
              autoAlpha: 0,
              filter: 'blur(12px)',
              ease: 'power2.in',
              duration: 0.55,
            },
            i + 0.6
          )
      })

      // 标题层：进入时淡入，随滚动轻微上移视差
      gsap.from(`.${styles.intro} > *`, {
        y: 30,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      })
    },
    { scope: rootRef }
  )

  return (
    <>
    <div className={styles.page} ref={rootRef}>
      {/* 背景底图：压暗 + 雾感叠层（等真视频好了把 img 换成 <video>） */}
      <div className={styles.bg} aria-hidden="true">
        <img className={styles.bgImg} src={bgImg} alt="" />
        <div className={styles.fog} />
        <div className={styles.grain} />
      </div>

      {/* 水波纹 + 弹幕：覆盖全屏的氛围层 */}
      <WaterRipple />
      <DanmuLayer />

      {/* 常驻出口：任何滚动位置都在，根治「找不到返回」 */}
      <Link
        to="/"
        className={styles.exit}
        state={{ returnTo: '#works' }}
        aria-label="返回首页"
      >
        <span className={styles.exitArrow}>←</span>
        <span className={styles.exitText}>EXIT</span>
      </Link>

      {/* 固定舞台：碎片在这里纵深浮现 */}
      <div className={styles.stage} ref={stageRef}>
        {/* 顶部介绍（隐藏档案标题） */}
        <div className={styles.intro}>
          <span className={styles.idx}>02 / HIDDEN ARCHIVE</span>
          <h1 className={styles.h1}>
            隐藏档案<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.sub}>/ Hidden Archive</p>
          <p className={styles.desc}>
            一些未完成的记录，实验性的片段，
            <br />
            和还没准备好被看见的东西。
          </p>
          <Link to="/" className={styles.back} state={{ returnTo: '#works' }}>
            ← BACK TO INDEX
          </Link>
        </div>

        {/* 碎片们：纵深浮现 */}
        {FRAGMENTS.map((f, i) => (
          <div
            className={`${styles.card} ${
              f.side === 'left' ? styles.left : styles.right
            } ${f.video ? styles.video : ''} ${
              active === i ? styles.active : ''
            }`}
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          >
            <div className={styles.cardMedia}>
              {f.video ? (
                <video
                  src={f.video}
                  poster={f.img}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <img src={f.img} alt={f.title} />
              )}
              <span className={styles.kind}>{f.kind}</span>
              <span className={styles.stamp}>{f.stamp}</span>
            </div>
            <div className={styles.cardMeta}>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardNote}>{f.note}</p>
            </div>
          </div>
        ))}

        {/* 打字机旁白：固定在底部中央，跟着当前碎片换句子 */}
        <div className={styles.narration} aria-live="polite">
          <span className={styles.narrText}>{caption.slice(0, typed)}</span>
          <span className={styles.narrCaret} />
        </div>

        {/* 滚动提示 */}
        <div className={styles.scrollHint}>
          <span>SCROLL TO WALK IN</span>
          <span className={styles.arrowDown}>↓</span>
        </div>
      </div>
    </div>

      {/* 旅程隧道：碎片走完后，汇成一段连续旅程（飞机场→开花→奔跑） */}
      <EntryTunnel />

      {/* 页脚收束句 */}
      <footer className={styles.footer}>
        <p className={styles.footerCn}>
          有些东西只属于文字之间的空白，
          <br />
          在那里，<span className={styles.footerRed}>意义仍在生成</span>。
        </p>
        <p className={styles.footerEn}>
          SOME THINGS ONLY BELONG TO THE WHITESPACE BETWEEN WORDS,
          <br />
          WHERE MEANING IS STILL BECOMING.
        </p>

        <Link to="/" className={styles.backBottom} state={{ returnTo: '#works' }}>
          ← BACK TO INDEX
        </Link>
      </footer>
    </>
  )
}

export default ArchivePage
