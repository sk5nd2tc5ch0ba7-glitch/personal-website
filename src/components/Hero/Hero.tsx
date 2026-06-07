import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Hero.module.css'
import heroBg from '../../../assets/images/fe2ac777dd0c9a415f7bf70e2e6fb22.png'

const navItems = [
  { id: '01', label: 'HOME', active: true },
  { id: '02', label: 'WORKS' },
  { id: '03', label: 'ARCHIVE' },
  { id: '04', label: 'NOTES' },
  { id: '05', label: 'CONTACT' },
]

function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // 背景先轻轻放大沉入（缓慢，0.85→1 透明度），制造"景深"
      gsap.from(`.${styles.hero__bg} img`, {
        scale: 1.08,
        opacity: 0,
        duration: 1.8,
        ease: 'power2.out',
      })

      // 内容元素错落淡入上浮
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 },
        delay: 0.3,
      })

      tl.from(`.${styles.hero__brand}, .${styles.hero__menu}`, {
        y: -16,
        opacity: 0,
        stagger: 0.12,
      })
        .from(
          `.${styles['hero__name-cn']}`,
          { y: 40, opacity: 0, duration: 1.2 },
          '-=0.4'
        )
        .from(
          `.${styles['hero__name-en']}`,
          { y: 24, opacity: 0 },
          '-=0.8'
        )
        .from(
          `.${styles.hero__title}`,
          { y: 24, opacity: 0 },
          '-=0.7'
        )
        .from(
          `.${styles.hero__skills} span`,
          { y: 16, opacity: 0, stagger: 0.12 },
          '-=0.6'
        )
        .from(`.${styles.hero__cta}`, { y: 16, opacity: 0 }, '-=0.5')
        .from(
          `.${styles['hero__nav-item']}`,
          { x: 24, opacity: 0, stagger: 0.1 },
          '-=0.9'
        )
        .from(`.${styles.hero__coords}`, { opacity: 0, duration: 0.8 }, '-=0.4')
    },
    { scope: rootRef }
  )

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className={styles.hero__bg}>
        <img src={heroBg} alt="" />
      </div>

      <div className={styles.hero__content}>
        {/* 左上：站点标识 */}
        <div className={styles.hero__brand}>
          <span className={styles['hero__brand-name']}>EVELYN XU</span>
          <span className={styles['hero__brand-tagline']}>
            DESIGN × TECHNOLOGY × EMOTION
            <span className={styles['hero__brand-cursor']} />
          </span>
        </div>

        {/* 右上：菜单 */}
        <button className={styles.hero__menu}>— MENU</button>

        {/* 主区 */}
        <div className={styles.hero__main}>
          <div className={styles['hero__name-block']}>
            <h1 className={styles['hero__name-cn']}>徐韩逸</h1>
            <p className={styles['hero__name-en']}>/ Evelyn Xu</p>

            <h2 className={styles.hero__title}>
              <span className={styles['hero__title-line']}>会写代码的</span>
              <span
                className={`${styles['hero__title-line']} ${styles['hero__title-line--last']}`}
              >
                产品设计师<span className={styles.hero__cursor}>_</span>
              </span>
            </h2>
          </div>

          <div className={styles.hero__skills}>
            <span>产品策略 / 体验设计 / 视觉系统</span>
            <span>原型开发 / AI 探索 / 创意实验</span>
          </div>

          <a href="#about" className={styles.hero__cta}>
            ABOUT ME <span className={styles['hero__cta-arrow']}>→</span>
          </a>
        </div>

        {/* 右侧导航 */}
        <nav className={styles.hero__nav}>
          {navItems.map((item) => (
            <span
              key={item.id}
              className={`${styles['hero__nav-item']} ${
                item.active ? styles['hero__nav-item--active'] : ''
              }`}
            >
              <span className={styles['hero__nav-id']}>{item.id}</span>
              <span className={styles['hero__nav-label']}>{item.label}</span>
            </span>
          ))}
        </nav>

        {/* 右下坐标 */}
        <span className={styles.hero__coords}>
          31.2304°N, 121.4737°E
        </span>
      </div>
    </section>
  )
}

export default Hero
