import styles from '../UmetripRedesign/UmetripRedesign.module.css'

import img201 from '../../../../assets/images/works/umetrip-ai/201.jpg'
import img203 from '../../../../assets/images/works/umetrip-ai/203.jpg'
import img204 from '../../../../assets/images/works/umetrip-ai/204.jpg'
import img205 from '../../../../assets/images/works/umetrip-ai/205.jpg'
import img206 from '../../../../assets/images/works/umetrip-ai/206.jpg'
import img207 from '../../../../assets/images/works/umetrip-ai/207.jpg'
import img208 from '../../../../assets/images/works/umetrip-ai/208.jpg'
import img209 from '../../../../assets/images/works/umetrip-ai/209.jpg'
import img210 from '../../../../assets/images/works/umetrip-ai/210.jpg'
import img211 from '../../../../assets/images/works/umetrip-ai/211.jpg'
import img212 from '../../../../assets/images/works/umetrip-ai/212.jpg'
import img213 from '../../../../assets/images/works/umetrip-ai/213.jpg'
import img215 from '../../../../assets/images/works/umetrip-ai/215.jpg'

const PLATES = [
  img201, img203, img204, img205, img206, img207, img208,
  img209, img210, img211, img212, img213, img215,
]

function UmetripAi() {
  return (
    <div className={styles.body}>
      {PLATES.map((src, i) => (
        <figure key={i} className={styles.figure}>
          <img src={src} alt={`航旅纵横·AI 全流程设计 - ${i + 1}`} loading="lazy" />
        </figure>
      ))}
    </div>
  )
}

export default UmetripAi
