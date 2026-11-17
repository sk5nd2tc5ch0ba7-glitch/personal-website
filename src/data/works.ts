import imgRedesign from '../../assets/images/01-garden-remembers.png'
import imgRedesignDetail from '../../assets/images/umetrip-cover.jpg'
import imgAi from '../../assets/images/02.webp'
import imgSkills from '../../assets/images/03.webp'
import imgBeyond from '../../assets/images/9.jpg'

/**
 * 全站作品数据源（首页入口卡片 + 作品详情页共用）。
 * 这里只放「入口元信息」，详情页的正文/PDF图/录屏等以后再填，
 * 所以字段刻意留得克制——加内容时往详情组件里堆即可，不必改这里。
 *
 * 四个入口对应你说的四块能力：
 *   01 航旅纵横·购买流程 redesign —— 解决问题 / 调研 / AB 测试
 *   02 航旅纵横·AI 全流程设计    —— AI 能力 + 可能穿插 web coding 录屏
 *   03 Skills & 对工具的理解      —— 设计素养 / 系统思考
 *   04 其他能力                   —— 建模 / 硬件 / MCP / AI 网关 / 爱好
 *
 * 流程后面可能还会加项 —— 直接往数组里 push 新对象即可，首页和路由都会自动跟上。
 */
export interface WorkMeta {
  /** URL 用的英文短标识，对应 /work/:slug */
  slug: string
  /** 展示编号 */
  no: string
  /** 卡片大标题（英文，效果图风格） */
  title: string
  /** 分类标签 */
  cat: string
  /** 卡片封面图 */
  cover: string
  /** 详情页顶部大封面（可选）。不填则详情页复用 cover。
      首页卡是竖版裁切，详情页是横版——比例不同时分开放更合适。 */
  detailCover?: string
  /** 详情页一句话定位（中文，可改） */
  tagline: string
}

export const WORKS: WorkMeta[] = [
  {
    slug: 'umetrip-redesign',
    no: '01',
    title: 'UMETRIP · PURCHASE REDESIGN',
    cat: 'PRODUCT DESIGN',
    cover: imgRedesign,
    detailCover: imgRedesignDetail,
    tagline: '航旅纵横 · 购买流程重设计',
  },
  {
    slug: 'umetrip-ai',
    no: '02',
    title: 'UMETRIP · AI EXPERIENCE',
    cat: 'AI · FULL-FLOW DESIGN',
    cover: imgAi,
    tagline: '航旅纵横 · AI 全流程设计',
  },
  {
    slug: 'skills',
    no: '03',
    title: 'SKILLS & REFLECTION',
    cat: 'CRAFT & THINKING',
    cover: imgSkills,
    tagline: '我的技能栈，以及对工具与方法的理解',
  },
  {
    slug: 'beyond',
    no: '04',
    title: 'BEYOND DESIGN',
    cat: '3D · HARDWARE · PLAY',
    cover: imgBeyond,
    tagline: '建模 / 硬件产品 / MCP / AI 网关等探索',
  },
]

export function getWork(slug: string): WorkMeta | undefined {
  return WORKS.find((w) => w.slug === slug)
}
