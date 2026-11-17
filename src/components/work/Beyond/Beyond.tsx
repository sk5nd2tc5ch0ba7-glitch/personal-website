import styles from '../UmetripRedesign/UmetripRedesign.module.css'

import img1 from '../../../../assets/images/works/beyond/1.jpg'
import img2 from '../../../../assets/images/works/beyond/2.jpg'
import img3 from '../../../../assets/images/works/beyond/3.jpg'
import img4 from '../../../../assets/images/works/beyond/4.jpg'
import img5 from '../../../../assets/images/works/beyond/5.jpg'
import img6 from '../../../../assets/images/works/beyond/6.jpg'
import img7 from '../../../../assets/images/works/beyond/7.jpg'

const PLATES = [img1, img2, img3, img4, img5, img6, img7]

function Beyond() {
  return (
    <div className={styles.body}>
      {PLATES.map((src, i) => (
        <figure key={i} className={styles.figure}>
          <img src={src} alt={`Beyond Design - ${i + 1}`} loading="lazy" />
        </figure>
      ))}
    </div>
  )
}

export default Beyond
