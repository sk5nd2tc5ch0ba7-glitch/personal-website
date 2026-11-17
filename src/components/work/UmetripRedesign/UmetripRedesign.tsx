import FlightButton from './FlightButton'
import SearchRotator from './SearchRotator'
import styles from './UmetripRedesign.module.css'

import img5 from '../../../../assets/images/works/umetrip-redesign/5.jpg'
import img13 from '../../../../assets/images/works/umetrip-redesign/13.jpg'
import img14 from '../../../../assets/images/works/umetrip-redesign/14.jpg'
import img15 from '../../../../assets/images/works/umetrip-redesign/15.jpg'
import img16 from '../../../../assets/images/works/umetrip-redesign/16.jpg'
import img17 from '../../../../assets/images/works/umetrip-redesign/17.jpg'

const PLATES = [img5, img13, img14, img15, img16, img17]

function UmetripRedesign() {
  return (
    <div className={styles.body}>
      {/* 作品集页面 */}
      {PLATES.map((src, i) => (
        <figure key={i} className={styles.figure}>
          <img src={src} alt={`航旅纵横·购买流程 Redesign - ${i + 1}`} loading="lazy" />
        </figure>
      ))}

      {/* web coding 动态强化：机票核心入口的循环微动效 */}
      <section className={styles.plate}>
        <header className={styles.plateHead}>
          <span className={styles.plateNo}>12</span>
          <h2 className={styles.plateTitle}>飞机按钮·动态强化</h2>
          <span className={styles.plateEn}>Flight Button · Motion</span>
        </header>
        <FlightButton />
      </section>

      {/* web coding 动态强化：搜索框提示词轮播 */}
      <section className={styles.plate}>
        <header className={styles.plateHead}>
          <span className={styles.plateNo}>13</span>
          <h2 className={styles.plateTitle}>搜索框·提示轮播</h2>
          <span className={styles.plateEn}>Search Hints · Rotator</span>
        </header>
        <SearchRotator />
      </section>
    </div>
  )
}

export default UmetripRedesign
