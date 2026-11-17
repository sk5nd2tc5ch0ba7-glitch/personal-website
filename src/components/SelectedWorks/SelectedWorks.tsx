import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SelectedWorks.module.css'
import { WORKS } from '../../data/works'

gsap.registerPlugin(ScrollTrigger)

/**
 * 作品入口（页面编号 03，承接 about 之后）。
 * 四张图不再是「纯展示」，而是四个跳转入口 —— 点击进入 /work/:slug 详情页。
 * 数据来自共享数据源 src/data/works.ts，加项只改那里、这里自动跟上。
 */
function SelectedWorks() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // 标题区淡入
      gsap.from(`.${styles.works__head} > *`, {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      })
      // 入口卡错落上浮
      gsap.from(`.${styles.work}`, {
        y: 56,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.${styles.works__grid}`, start: 'top 82%' },
      })
    },
    { scope: rootRef }
  )

  return (
    <section className={styles.works} id="works" ref={rootRef}>
      <div className={styles.works__inner}>
        {/* 左侧编号 + 标签 */}
        <div className={styles.works__head}>
          <span className={styles.works__no}>03</span>
          <span className={styles.works__label}>SELECTED WORKS</span>
          <span className={styles.works__rule} />
        </div>

        {/* 四个入口：点击进入详情页 */}
        <div className={styles.works__grid}>
          {WORKS.map((w) => (
            <Link
              className={styles.work}
              key={w.slug}
              to={`/work/${w.slug}`}
              aria-label={`查看作品：${w.title}`}
            >
              <div className={styles.work__media}>
                {w.cover ? (
                  <img src={w.cover} alt={w.title} />
                ) : (
                  <span className={styles.work__placeholder}>{w.no}</span>
                )}
                <div className={styles.work__meta}>
                  <h3 className={styles.work__title}>{w.title}</h3>
                  <div className={styles.work__foot}>
                    <span className={styles.work__cat}>{w.cat}</span>
                    <span className={styles.work__view}>VIEW CASE →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 隐藏档案入口：明显一点，中文领衔，hover 还有红色暗示 */}
        <Link to="/archive" className={styles.archiveEntry}>
          <span className={styles.archiveEntry__en}>
            NOT ALL WORKS ARE MEANT TO BE SEEN YET
          </span>
          <span className={styles.archiveEntry__cn}>
            还有一些没准备好被看见的东西
            <span className={styles.archiveEntry__arrow}>→</span>
          </span>
          <span className={styles.archiveEntry__hint}>进入隐藏档案 · HIDDEN ARCHIVE</span>
        </Link>
      </div>
    </section>
  )
}

export default SelectedWorks
