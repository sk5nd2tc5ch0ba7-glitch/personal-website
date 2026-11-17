import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SiteNav.module.css'
import { scrollToSection } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * 常驻站点导航：固定在屏幕右侧中部，全程可见、可点击平滑跳转。
 * - 当前区块高亮：每个 section 进入视口中线时点亮对应项
 * - 随背景变色：滚到纯白 outro 屏时整组导航转深色，避免白字白底看不见
 *
 * 导航项只对应真实存在的区块，避免出现点了没有落点的死链接。
 */
const NAV = [
  { id: '01', label: 'HOME', target: 'top', sel: '#hero' },
  { id: '02', label: 'MANIFESTO', target: '#manifesto', sel: '#manifesto' },
  { id: '03', label: 'ABOUT', target: '#about', sel: '#about' },
  { id: '04', label: 'WORKS', target: '#works', sel: '#works' },
]

function SiteNav() {
  const navRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [light, setLight] = useState(false)

  useGSAP(
    () => {
      // 当前区块高亮：每个区块跨过视口中线时点亮自己
      NAV.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item.sel,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })

      // 白色 outro 屏覆盖到导航高度时，整组转深色
      ScrollTrigger.create({
        trigger: '#outro',
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => setLight(self.isActive),
      })

      // 入场：从右侧滑入淡现
      gsap.from(`.${styles.item}`, {
        x: 20,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 1.2,
      })
    },
    { scope: navRef }
  )

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${light ? styles.light : ''}`}
      aria-label="站点导航"
    >
      <ul className={styles.list}>
        {NAV.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className={`${styles.item} ${i === active ? styles.active : ''}`}
              onClick={() => scrollToSection(item.target)}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className={styles.id}>{item.id}</span>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.tick} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SiteNav
