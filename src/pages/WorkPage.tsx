import { useParams, Link } from 'react-router-dom'
import { getWork, WORKS } from '../data/works'
import UmetripRedesign from '../components/work/UmetripRedesign/UmetripRedesign'
import UmetripAi from '../components/work/UmetripAi/UmetripAi'
import Skills from '../components/work/Skills/Skills'
import Beyond from '../components/work/Beyond/Beyond'
import styles from './WorkPage.module.css'

/** 按 slug 分流到各自的正文组件；没做的返回 null，走通用占位 */
function getWorkBody(slug: string) {
  if (slug === 'umetrip-redesign') return <UmetripRedesign />
  if (slug === 'umetrip-ai') return <UmetripAi />
  if (slug === 'skills') return <Skills />
  if (slug === 'beyond') return <Beyond />
  return null
}

/** 走浅色基调的作品（其余默认深色）。 */
const LIGHT_WORKS = new Set(['umetrip-redesign', 'umetrip-ai'])

function WorkPage() {
  const { slug } = useParams<{ slug: string }>()
  const work = slug ? getWork(slug) : undefined

  if (!work) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <Link to="/" className={styles.back}>
            ← 返回首页
          </Link>
          <p className={styles.missing}>没有找到这个作品。</p>
        </div>
      </main>
    )
  }

  const idx = WORKS.findIndex((w) => w.slug === work.slug)
  const next = WORKS[(idx + 1) % WORKS.length]

  const body = getWorkBody(work.slug)
  const isLight = LIGHT_WORKS.has(work.slug)

  return (
    <main className={`${styles.page} ${isLight ? styles.light : ''}`}>
      <div className={styles.inner}>
        <Link to="/" state={{ returnTo: '#works' }} className={styles.back}>
          ← 返回作品入口
        </Link>

        <header className={styles.head}>
          <span className={styles.no}>{work.no}</span>
          <h1 className={styles.title}>{work.title}</h1>
          <p className={styles.tagline}>{work.tagline}</p>
          <span className={styles.cat}>{work.cat}</span>
        </header>

        {/* 正文：有专属组件就渲染它，否则走「内容建设中」通用占位 */}
        {body ?? (
          <section className={styles.bodyPlaceholder}>
            <span className={styles.soon}>CASE STUDY · 内容建设中</span>
            <p className={styles.soonNote}>
              这里之后会放完整案例：背景与问题、调研与用户分析、设计过程、关键决策、
              结果与反思。内容整理好后逐步填入。
            </p>
          </section>
        )}

        {/* 下一个作品 */}
        <Link to={`/work/${next.slug}`} className={styles.nextLink}>
          <span className={styles.nextLabel}>NEXT</span>
          <span className={styles.nextTitle}>{next.title} →</span>
        </Link>
      </div>
    </main>
  )
}

export default WorkPage
