import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Skills.module.css'

gsap.registerPlugin(ScrollTrigger)

const STAGES = [
  { no: '0', title: '需求收敛', en: 'Requirement Convergence', desc: '用 9 个大白话问题，帮设计师把脑子里的画面变成结构化 spec' },
  { no: '0.5', title: '资源发现', en: 'Resource Discovery', desc: '写代码前先搜 GitHub、组件库、设计参考——站在巨人肩膀上' },
  { no: '1', title: '结构搭建', en: 'Structure', desc: '搭好文件树和路由骨架，地基打稳再盖楼' },
  { no: '2', title: '样式落地', en: 'Styling', desc: '设计稿 → 像素级还原，token 化管理颜色和间距' },
  { no: '3', title: '交互注入', en: 'Interaction', desc: '动效、滚动触发、微交互，让页面活起来' },
  { no: '4', title: '动效打磨', en: 'Motion Polish', desc: '最后 5% 的打磨——缓动曲线、时序编排、体感调优' },
]

const REPO_URL = 'https://github.com/sk5nd2tc5ch0ba7-glitch/designer-to-code-skill'

function Skills() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // 简介区淡入
      gsap.from(`.${styles.intro}`, {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.intro}`, start: 'top 85%' },
      })

      // 时间线标题
      gsap.from(`.${styles.timelineTitle}`, {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.timelineTitle}`, start: 'top 85%' },
      })

      // 阶段卡片错落上浮
      gsap.from(`.${styles.stage}`, {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.timeline}`, start: 'top 80%' },
      })

      // GitHub 按钮
      gsap.from(`.${styles.cta}`, {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.cta}`, start: 'top 90%' },
      })
    },
    { scope: rootRef }
  )

  return (
    <div className={styles.body} ref={rootRef}>
      {/* 简介 */}
      <section className={styles.intro}>
        <h2 className={styles.introTitle}>这是什么？</h2>
        <p className={styles.introText}>
          市面上的 AI Coding 工具都在解决「AI 怎么写代码」，
          但没人解决「设计师怎么指挥 AI 一步步做出好东西」。
        </p>
        <p className={styles.introText}>
          我做了一个 Claude Code Skill——一套 6 阶段的工作流引擎，
          让不会写代码的设计师也能用 AI 从零搭出高完成度的前端项目。
          从需求收敛到动效打磨，每一步都有引导、有自检、有断点续传。
        </p>
        <p className={styles.introHighlight}>
          调研了 7 个竞品、14 个用户痛点，这个 Skill 是我给出的答案。
        </p>
      </section>

      {/* 6 阶段时间线 */}
      <h3 className={styles.timelineTitle}>6 阶段工作流</h3>
      <div className={styles.timeline}>
        {STAGES.map((s) => (
          <div key={s.no} className={styles.stage}>
            <span className={styles.stageNo}>{s.no}</span>
            <div className={styles.stageContent}>
              <h4 className={styles.stageName}>
                {s.title}
                <span className={styles.stageEn}>{s.en}</span>
              </h4>
              <p className={styles.stageDesc}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub 链接 */}
      <div className={styles.cta}>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          查看完整文档 · GitHub →
        </a>
      </div>
    </div>
  )
}

export default Skills
