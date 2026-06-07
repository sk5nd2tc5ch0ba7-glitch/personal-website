import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SelectedWorks.module.css'
import workGarden from '../../../assets/images/01-garden-remembers.png'
import work02 from '../../../assets/images/02.webp'
import work03 from '../../../assets/images/03.webp'
import work04 from '../../../assets/images/9.jpg'

gsap.registerPlugin(ScrollTrigger)

/**
 * 精选作品（02 SELECTED WORKS）。
 * 纯展示 + hover 动效，暂不做路由跳转。
 * img 为 null 的项走渐变占位，待真图替换。
 * title / cat 沿用效果图文案。
 */
const WORKS = [
  {
    img: workGarden,
    no: '01',
    title: 'THE GARDEN REMEMBERS',
    cat: 'EXPERIENCE DESIGN',
  },
  {
    img: work02,
    no: '02',
    title: 'PERSISTENCE',
    cat: 'PRODUCT DESIGN',
  },
  {
    img: work03,
    no: '03',
    title: 'THREADS OF CARE',
    cat: 'SERVICE & SYSTEM DESIGN',
  },
  {
    img: work04,
    no: '04',
    title: 'HIDDEN COLLAGE',
    cat: 'VISUAL SYSTEM DESIGN',
  },
]

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
      // 作品卡错落上浮
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
          <span className={styles.works__no}>02</span>
          <span className={styles.works__label}>SELECTED WORKS</span>
          <span className={styles.works__rule} />
        </div>

        {/* 四张作品 */}
        <div className={styles.works__grid}>
          {WORKS.map((w) => (
            <article className={styles.work} key={w.no}>
              <div className={styles.work__media}>
                {w.img ? (
                  <img src={w.img} alt={w.title} />
                ) : (
                  <span className={styles.work__placeholder}>{w.no}</span>
                )}
                <div className={styles.work__meta}>
                  <h3 className={styles.work__title}>{w.title}</h3>
                  <div className={styles.work__foot}>
                    <span className={styles.work__cat}>{w.cat}</span>
                    <span className={styles.work__arrow}>→</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SelectedWorks
