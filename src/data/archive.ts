import frag1 from '../../assets/images/74.jpg'
import frag2 from '../../assets/images/65cf4a84ec984c657546fd1a8adaaef.jpg'
import frag3 from '../../assets/images/4daced6d3f7fd23fcf13fa6a24e3c56.jpg'
import frag4 from '../../assets/images/1240dc70d2362d19b493b816d251ceb.jpg'
import frag5 from '../../assets/images/c9da9fdf693ee6883cc60ef932b01a8.jpg'
import frag6 from '../../assets/images/2d0e5a14596554787edb1880bb22f2c.png'
import motion03 from '../../assets/videos/3220541f2d404befcd210f13646c175e.mp4'

/**
 * 隐藏档案（/archive）数据源。
 *
 * 这里是「创作者的脑内后台」——不是再讲一遍专业人设，而是放那些
 * 未完成的、私人的、好玩的碎片：MJ 画的故事、AI 做的视频、3D 建模录屏…
 * 像路过的人一样在纵深里浮现 → 走近 → 消失。
 *
 * 现在用现有图当【临时碎片】，等你的视频 / MJ 图 / 建模录屏整理好，
 * 把 src 换成真素材即可（video 字段留好了，填了就当视频播）。
 * 加碎片：往 FRAGMENTS 里 push；加弹幕：往 DANMU 里加字符串。结构都不用动。
 */

export type FragmentKind = 'STORY' | 'VIDEO' | 'MODEL' | 'IMAGE' | 'NOTE'

export interface Fragment {
  /** 浮现在左还是右（纵深漫游时左右交替出现） */
  side: 'left' | 'right'
  /** 类型标签，显示在卡片角落 */
  kind: FragmentKind
  /** 卡片主标题（可中可英） */
  title: string
  /** 副标题 / 一句话注解 */
  note: string
  /** 编号 / 时间戳风格的小字 */
  stamp: string
  /** 封面图（临时用现有图） */
  img: string
  /** 视频地址：填了就当视频播，留空走静态图 */
  video?: string
  /**
   * 走近时打字机敲出的一句话（VR 漫游的「旁白」）。
   * 留空则不打字。
   */
  caption?: string
}

export const FRAGMENTS: Fragment[] = [
  {
    side: 'left',
    kind: 'STORY',
    title: 'The Fish That Remembered Rain',
    note: 'MJ 生成的一则无人读过的短故事。',
    stamp: 'MJ · 2024',
    img: frag1,
    caption: '有些画面，是先于语言出现的。',
  },
  {
    side: 'right',
    kind: 'VIDEO',
    title: 'Untitled Motion #03',
    note: 'AI 视频实验，关于一座会呼吸的城市。',
    stamp: 'AI VIDEO · 2024',
    img: frag2,
    video: motion03,
    caption: '我让机器做梦，然后把梦录了下来。',
  },
  {
    side: 'left',
    kind: 'MODEL',
    title: 'Low-Poly Solitude',
    note: '深夜建模的一个废弃场景，没有用在任何项目里。',
    stamp: '3D · BLENDER',
    img: frag3,
    caption: '建模使人秃头，但我停不下来。',
  },
  {
    side: 'right',
    kind: 'IMAGE',
    title: 'Color Study / Decay',
    note: '一组关于腐烂与盛开的配色练习。',
    stamp: 'STUDY · 2024',
    img: frag4,
    caption: '美和衰败，常常是同一种东西。',
  },
  {
    side: 'left',
    kind: 'NOTE',
    title: 'Notes on Being Lost',
    note: '一段没写完的思考，关于在不确定里继续做事。',
    stamp: 'FRAGMENT',
    img: frag5,
    caption: '走错路的时候，风景反而是新的。',
  },
  {
    side: 'right',
    kind: 'STORY',
    title: 'A Rose, Rendered',
    note: '试着用代码种一朵玫瑰，长出来的样子。',
    stamp: 'CREATIVE CODE',
    img: frag6,
    caption: '我把玫瑰种在了代码里。',
  },
]

/**
 * 飘过式弹幕——有灵魂的真实吐槽，像路过的人随口说的话。
 * tone: 'red' 的会用红色强调（少量点缀），其余走低调白。
 * 随便加，越有人味越好。
 */
export interface Danmu {
  text: string
  tone?: 'red' | 'plain'
}

export const DANMU: Danmu[] = [
  { text: '3D 建模使人秃头，拉完了！🖕', tone: 'red' },
  { text: 'AI 视频好好玩！我要看霸道总裁' },
  { text: '这张图 MJ 抽了 80 次才出……' },
  { text: '别问，问就是还没做完' },
  { text: '凌晨三点的灵感都是骗人的' },
  { text: '又是为爱发电的一天', tone: 'red' },
  { text: '设计师的命也是命（猫猫哭哭）' },
  { text: '渲染一晚上，结果忘了保存' },
  { text: '我觉得我可以，甲方觉得不行' },
  { text: '这里本来想放视频的，咕咕咕' },
  { text: 'Less is more？Less is 加班', tone: 'red' },
  { text: '灵感枯竭时就来逛逛这里' },
  { text: 'Ctrl+S 是肌肉记忆，但还是丢了' },
  { text: '这个配色我跟它磕到天亮' },
  { text: '建模软件又崩了，问候开发者全家' },
  { text: '甲方：再大气一点。我：？', tone: 'red' },
  { text: '画饼一时爽，画图火葬场' },
  { text: '我的 figma 图层名全是「未命名」' },
  { text: '改到第 18 版，最后用了第 1 版' },
  { text: '不是我菜，是 deadline 太快', tone: 'red' },
  { text: '咖啡续命，玫瑰续魂' },
  { text: '今天也没有早睡（理直气壮）' },
  { text: '灵感来了挡都挡不住，可惜它不常来' },
  { text: '好看是第一生产力' },
  { text: '审美在线，钱包离线', tone: 'red' },
  { text: '又在给爱好交学费了' },
  { text: '这条弹幕也是我熬夜写的' },
]
