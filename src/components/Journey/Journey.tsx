import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Journey.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * 03 ABOUT —— 个人介绍。
 * 左 45% 文字（标题逐行上浮 / 正文淡入 / 关键词逐组滑入），
 * 右 55% 放大的代码卡片（真打字机逐字敲出），
 * 底部一条 app/工具图标无缝跑马灯（从右往左）。
 *
 * 入场动画统一用 gsap.from + immediateRender:false：元素初始保持「可见」，
 * 触发时才跳到隐藏起点再播放。好处是即便 ScrollTrigger 万一没触发，文字也永远
 * 看得见、绝不会永久卡在隐藏态（我们被这个坑过两次）。
 */

// 右侧代码卡片内容（加料：更多行，信息更完整）
const CODE_LINES = [
  'const evelyn = {',
  '  role: "Product Designer",',
  '  focus: ["AI Experience", "Creative Coding", "UX Design"],',
  '  stack: ["React", "Three.js", "TouchDesigner"],',
  '  hardware: ["ESP32", "Arduino", "AIGC"],',
  '  currently: "turning technology into experience",',
  '  believe: "design = research + structure + emotion",',
  '}',
]
const FULL = CODE_LINES.join('\n')

// 底部跑马灯：我会用的工具 / app（等真图标放进 assets/icons/ 再换成 <img>）
const SKILLS = [
  'Figma', 'Procreate', 'Photoshop', 'Illustrator', 'After Effects',
  'Blender', 'Cinema 4D', 'React', 'Three.js', 'TouchDesigner',
  'Node.js', 'ESP32', 'Arduino', 'GSAP', 'AIGC',
]

function Journey() {
  const rootRef = useRef<HTMLElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState(0)
  const [typing, setTyping] = useState(false)

  // 打字机：进视口后逐字敲出。
  // 真打字机的手感关键在「快慢不均」——大部分字很快，偶尔卡顿一下，
  // 标点/换行后停顿更久（像在思考或换行复位）。所以这里给每个字一个
  // 带较大随机抖动的基础延时，再对特殊字符叠加额外停顿。
  useEffect(() => {
    if (!typing || typed >= FULL.length) return
    const ch = FULL[typed]
    const prev = FULL[typed - 1]

    // 基础节奏：26~75ms 之间大幅抖动，偶发性更长的「迟疑」
    let delay = 26 + Math.random() * 49
    if (Math.random() < 0.08) delay += 80 + Math.random() * 105 // 8% 概率明显卡一下

    // 特殊字符的停顿（模仿换行复位、标点后的呼吸）
    if (ch === '\n') delay = 170 + Math.random() * 120
    else if (prev === '\n') delay += 80 // 换行后起手慢一点
    else if (ch === ',' || ch === ']' || ch === '}') delay = 120 + Math.random() * 80
    else if (ch === ' ' && Math.random() < 0.5) delay += 40 // 空格偶尔顿一下

    const t = setTimeout(() => setTyped((n) => n + 1), delay)
    return () => clearTimeout(t)
  }, [typing, typed])

  useGSAP(
    () => {
      const trig = { trigger: `.${styles.colLeft}`, start: 'top 85%' }

      // 主标题：逐行从下方上浮（mask 裁切 + 内层位移），克制电影感
      gsap.from(`.${styles.leadInner}`, {
        yPercent: 120,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.14,
        immediateRender: false,
        scrollTrigger: trig,
      })

      // 强调红线：从左抽出
      gsap.from(`.${styles.rule}`, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power3.inOut',
        immediateRender: false,
        scrollTrigger: trig,
      })

      // 正文段落：逐段淡入上浮
      gsap.from(`.${styles.para}`, {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.para}`, start: 'top 88%' },
      })

      // 关键词三组：逐组从左滑入，竖线同时生长
      gsap.from(`.${styles.tagGroup}`, {
        x: -28,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.16,
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.tags}`, start: 'top 85%' },
      })

      // 结尾斜体：淡入
      gsap.from(`.${styles.outroLine}`, {
        y: 24,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.outroLine}`, start: 'top 90%' },
      })

      // 代码卡片：浮入 + 触发打字机
      gsap.from(`.${styles.codeCard}`, {
        y: 50,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: codeRef.current, start: 'top 82%' },
      })
      ScrollTrigger.create({
        trigger: codeRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => setTyping(true),
      })

      // 跑马灯：进视口淡入（滚动由 CSS animation 驱动）
      gsap.from(`.${styles.marquee}`, {
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.marquee}`, start: 'top 92%' },
      })

      // 巨号幽灵背景字：极慢视差
      gsap.to(`.${styles.ghost}`, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    },
    { scope: rootRef }
  )

  const shown = FULL.slice(0, typed)
  const done = typed >= FULL.length

  return (
    <section className={styles.journey} id="about" ref={rootRef}>
      {/* 氛围底纹：超大幽灵字 */}
      <span className={styles.ghost} aria-hidden="true">
        ABOUT
      </span>

      <div className={styles.inner}>
        {/* 左栏：文字介绍 */}
        <div className={styles.colLeft}>
          <span className={styles.index}>01 / ABOUT ME</span>

          <h2 className={styles.lead}>
            <span className={styles.leadLine}>
              <span className={styles.leadInner}>
                我是一名关注 <span className={styles.accent}>AI 与交互体验</span>
              </span>
            </span>
            <span className={styles.leadLine}>
              <span className={styles.leadInner}>的产品设计师。</span>
            </span>
          </h2>

          <span className={styles.rule} />

          <p className={styles.para}>
            我喜欢把设计、技术和一点点情绪感放在一起思考。对我来说，产品设计不只是把界面做得好看，而是理解人在具体场景里的需求、犹豫、焦虑和期待，再用更清楚的结构把它们表达出来。
          </p>
          <p className={styles.para}>
            目前我主要关注 AI 产品体验、AIGC 工作流、创意编程与智能硬件原型。我会使用设计工具完成视觉与原型，也会通过 Three.js、TouchDesigner、React、Node.js、ESP32
            等工具，把一些想法做成可以运行、可以交互的东西。
          </p>

          {/* 三组关键词 */}
          <div className={styles.tags}>
            <div className={styles.tagGroup}>
              <span className={styles.tagH}>Design</span>
              <span className={styles.tagL}>
                Product Design / UX Design / Visual System
              </span>
            </div>
            <div className={styles.tagGroup}>
              <span className={styles.tagH}>Technology</span>
              <span className={styles.tagL}>
                Creative Coding / AI Workflow / Hardware Prototype
              </span>
            </div>
            <div className={styles.tagGroup}>
              <span className={styles.tagH}>Thinking</span>
              <span className={styles.tagL}>
                User Research / Scenario Analysis / Interaction Logic
              </span>
            </div>
          </div>

          <p className={styles.outroLine}>
            I try to make technology easier to understand,
            <br />
            and experience easier to feel.
          </p>
        </div>

        {/* 右栏：代码打字机 */}
        <div className={styles.colRight}>
          <div className={styles.codeCard} ref={codeRef}>
            <div className={styles.codeBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.codeName}>evelyn.ts</span>
            </div>
            <pre className={styles.codeBody}>
              <code>
                {shown}
                <span
                  className={`${styles.caret} ${done ? styles.caretBlink : ''}`}
                />
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* 底部：技能/工具无缝跑马灯（从右往左） */}
      <div className={styles.marquee} aria-label="skills">
        <div className={styles.marqueeTrack}>
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span className={styles.chip} key={i}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Journey
