import styles from './FlightButton.module.css'

/**
 * 飞机按钮（机票核心入口）动态强化 —— 纯 CSS 循环动效，自动播放、不靠点击。
 *
 * 设计意图：机票是航旅纵横首页第一入口，静态图标在一排功能里不够突出。
 * 给它一个「微微上扬 → 加速滑离 → 复位」的循环微动效，用运动把视线钩住，
 * 又不打扰——节奏克制，4.2s 一轮，大部分时间是静止的。
 *
 * 飞机是矢量重绘（非贴图），所以能独立于卡片做位移/旋转，飞出 stage 边界
 * 被裁掉 = 飞离画面。reduced-motion 下定格静止帧。
 */
function FlightButton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        {/* 速度线：加速段才显形 */}
        <div className={styles.streaks} aria-hidden="true">
          <span className={styles.streak} />
          <span className={styles.streak} />
          <span className={styles.streak} />
        </div>

        {/* 波纹层：放在白卡「前面」=渲染在下层，从卡片边缘往外扩散，
            中心被白卡盖住，只露出外圈，正好是「外边框在动」 */}
        <div className={styles.ripples} aria-hidden="true">
          <span className={styles.ripple} />
          <span className={styles.ripple} />
        </div>

        {/* 白色 app 图标卡 */}
        <div className={styles.card}>
          <span className={styles.badge}>官方直销</span>
          <span className={styles.plane}>
            {/* 机尾拖尾：贴着飞机走，加速段才拉出来 */}
            <span className={styles.tail} aria-hidden="true" />
            {/* 内层做待机微浮，跟外层的飞行位移叠加 */}
            <span className={styles.planeInner}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {/* 渐变蓝：浅蓝→深蓝，呼应航旅纵横图标的层次感 */}
                <defs>
                  <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5bb4ff" />
                    <stop offset="55%" stopColor="#1e7afe" />
                    <stop offset="100%" stopColor="#0a5fd6" />
                  </linearGradient>
                </defs>
                {/* 民航客机剪影：机身饱满（中段加粗），机翼宽厚，呼应航旅纵横那个胖胖的图标。
                  基础朝上，靠 CSS 转 45° 朝右上 */}
                <path
                  fill="url(#planeGrad)"
                  d="M12 2c1 0 1.8 1 1.8 2.3v4.4l8.4 4.9c.5.3.8.9.8 1.5v2l-9.2-2.7v4.7l2.7 2v1.8l-4.5-1.3-4.5 1.3v-1.8l2.7-2v-4.7L1 17.1v-2c0-.6.3-1.2.8-1.5l8.4-4.9V4.3C10.2 3 11 2 12 2z"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>

      <p className={styles.caption}>
        机票是首页第一入口，我选择用一个克制的<strong>循环微动效</strong>把视线钩住，
        让核心功能在一排图标里先被看见，促进购买转化。
      </p>
    </div>
  )
}

export default FlightButton
