import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Journey.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * 03 ABOUT —— 个人介绍。
 * 深色整页，editorial 排版。动效用「遮罩擦除式入场」：每行文字从一条隐形基线
 * 后方升起显现（overflow:hidden 裁切 + yPercent 100→0），克制、电影感，
 * 取代之前飘忽的视差浮动。
 *
 * 文案多为占位，随时替换：把 <Reveal> 里的文字改成你真实的经历即可。
 */

/** 单行遮罩容器：外层裁切，内层从下方升起。className 控制字体样式 */
function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'p' | 'span'
}) {
  const Tag = as
  return (
    <Tag className={`${styles.reveal} ${className ?? ''}`}>
      <span className={styles.reveal__inner}>{children}</span>
    </Tag>
  )
}

function Journey() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // 所有遮罩内层：先压到基线下方
      gsap.set(`.${styles.reveal__inner}`, { yPercent: 110 })

      // 主标题区：进视口后逐行升起
      gsap.to(`.${styles.head} .${styles.reveal__inner}`, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: `.${styles.head}`, start: 'top 78%' },
      })

      // 正文段落：稍后、节奏更慢
      gsap.to(`.${styles.lede} .${styles.reveal__inner}`, {
        yPercent: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.lede}`, start: 'top 80%' },
      })

      // 信息网格：逐块升起
      gsap.to(`.${styles.meta} .${styles.reveal__inner}`, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.07,
        scrollTrigger: { trigger: `.${styles.meta}`, start: 'top 82%' },
      })

      // 强调红线：从左抽出
      gsap.from(`.${styles.rule}`, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: `.${styles.head}`, start: 'top 70%' },
      })

      // 巨号背景字：极慢视差，作氛围底纹（这是唯一保留的"飘"，但很轻）
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

  return (
    <section className={styles.journey} id="about" ref={rootRef}>
      {/* 氛围底纹：超大幽灵字，几乎不可见，只为空间纵深 */}
      <span className={styles.ghost} aria-hidden="true">
        ABOUT
      </span>

      <div className={styles.inner}>
        {/* 章节索引 */}
        <span className={styles.index}>03 — ABOUT ME</span>

        {/* 主标题 */}
        <div className={styles.head}>
          <Reveal className={styles.kicker} as="span">
            你好，世界。
          </Reveal>
          <Reveal className={styles.name} as="div">
            徐韩逸 <span className={styles.nameEn}>/ Evelyn Xu</span>
          </Reveal>
          <Reveal className={styles.role} as="div">
            一个会写代码的<span className={styles.roleAccent}>产品设计师</span>。
          </Reveal>
          <span className={styles.rule} />
        </div>

        {/* 正文：自我介绍叙事 */}
        <div className={styles.lede}>
          <Reveal className={styles.ledeLine} as="p">
            我在衰败里寻找生命的证据，
          </Reveal>
          <Reveal className={styles.ledeLine} as="p">
            也在代码里种下一朵玫瑰。
          </Reveal>
          <Reveal className={styles.ledeLine} as="p">
            设计与工程之间那条模糊的边界，
          </Reveal>
          <Reveal className={styles.ledeLine} as="p">
            是我最想停留的地方。
          </Reveal>

          <Reveal className={styles.ledeSub} as="p">
            I seek proofs of life in decay, and plant a rose in code —
            living where design meets engineering.
          </Reveal>
        </div>

        {/* 信息网格：教育 / 方向 / 工具 / 现状 */}
        <div className={styles.meta}>
          <div className={styles.metaCol}>
            <Reveal className={styles.metaH} as="span">
              EDUCATION
            </Reveal>
            <Reveal className={styles.metaMain} as="span">
              北京理工大学
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              视觉传达设计 · 本科在读
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              2024 — 2028
            </Reveal>
          </div>

          <div className={styles.metaCol}>
            <Reveal className={styles.metaH} as="span">
              FOCUS
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              体验设计 · 交互原型
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              视觉系统 · 创意编程
            </Reveal>
          </div>

          <div className={styles.metaCol}>
            <Reveal className={styles.metaH} as="span">
              TOOLBOX
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              Figma · Procreate
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              React · GSAP · Three.js
            </Reveal>
          </div>

          <div className={styles.metaCol}>
            <Reveal className={styles.metaH} as="span">
              NOW
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              在路上，持续生长
            </Reveal>
            <Reveal className={styles.metaSub} as="span">
              Beijing, China
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Journey
