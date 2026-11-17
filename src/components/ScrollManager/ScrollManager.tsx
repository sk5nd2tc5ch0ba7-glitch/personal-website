import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTopInstant, scrollToSectionInstant } from '../../lib/lenis'

/**
 * 路由切换时的滚动管理：
 * - 默认：每次 pathname 变化瞬间复位到页面顶部（不要平滑——平滑会让人看着
 *   页面从底部一路滚回去，很怪），再刷新 ScrollTrigger，让新页面里所有
 *   入场触发点按新内容高度重新计算（否则会出现「滚到位了文字却没显现」）。
 * - 例外：当导航带了 state.returnTo（如作品页返回首页时回到 #works 入口），
 *   就瞬间定位到那个区块，而不是把人甩回顶部、还得重新滚一遍。
 *   首页是刚 mount 的，目标节点可能还没渲染好，所以用 rAF 等一帧再定位。
 */
function ScrollManager() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    const returnTo = (state as { returnTo?: string } | null)?.returnTo

    if (returnTo) {
      // 等首页 DOM 落定（下一帧）再定位，否则 #works 还不存在
      const raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        scrollToSectionInstant(returnTo)
        // 图片/字体撑高后位置可能微偏，二次校正
        window.setTimeout(() => scrollToSectionInstant(returnTo), 120)
      })
      return () => cancelAnimationFrame(raf)
    }

    scrollToTopInstant()
    // 等新页面 DOM 落定再刷新触发点；双保险各刷一次
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, state])

  return null
}

export default ScrollManager
