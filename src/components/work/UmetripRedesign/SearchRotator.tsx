import styles from './SearchRotator.module.css'

/**
 * 搜索框提示文案轮播 —— 纯 CSS 垂直轮播，自动循环、无缝衔接。
 *
 * 设计意图：航旅纵横首页搜索框是个入口，光放「搜索」太静。
 * 让提示词一条条往上滚（搜酒店 → 特价机票 → 免税全球购 …），
 * 用轮播把更多可搜的东西「捎带」露出来，引导探索、提升点击。
 *
 * 实现：4 条提示竖向堆叠成轨道，末尾再复制第 1 条；轨道 translateY 逐条上推，
 * 到复制的那条时正好回到顶部，肉眼无缝。reduced-motion 下停在第一条。
 */

const HINTS = ['搜酒店、目的地', '搜特价机票', '搜免税全球购', '搜接送机、租车']

function SearchRotator() {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" strokeLinecap="round" />
          </svg>
        </span>
        <div className={styles.window}>
          <div className={styles.track}>
            {HINTS.map((h) => (
              <span key={h} className={styles.item}>
                {h}
              </span>
            ))}
            {/* 复制第一条到末尾，让轮播回到顶部时无缝 */}
            <span className={styles.item} aria-hidden="true">
              {HINTS[0]}
            </span>
          </div>
        </div>
      </div>

      <p className={styles.caption}>
        搜索框不止能搜机票，用<strong>提示词轮播</strong>把更多场景捎带露出来，
        引导用户多看一眼、多点一下。
      </p>
    </div>
  )
}

export default SearchRotator
