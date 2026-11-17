import type Lenis from 'lenis'

/**
 * 全站共享的 Lenis 实例引用。
 * SmoothScroll 创建实例后调用 setLenis 注册，
 * 导航等组件通过 scrollToSection 调用平滑滚动，避免各自重复 new Lenis。
 */
let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

/**
 * 平滑滚动到指定锚点。
 * @param target  CSS 选择器（如 '#works'）或 'top'
 */
export function scrollToSection(target: string) {
  if (target === 'top') {
    if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const el = document.querySelector(target)
  if (!el) return

  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { duration: 1.2, offset: 0 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * 瞬间复位到页面顶部（无动画）。
 * 路由切换时用——平滑滚动会让人看着页面从当前位置一路滚回顶部，很怪。
 * Lenis 开了 smoothWheel，直接 window.scrollTo 可能被它的 rAF 覆盖，
 * 所以优先用 Lenis 的 immediate 跳转，并同时重置原生滚动兜底。
 */
export function scrollToTopInstant() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true })
  }
  window.scrollTo(0, 0)
}

/**
 * 瞬间定位到指定区块（无动画）。
 * 用于「从作品页返回首页」时落回来源区块（如 works 入口），
 * 而不是把人甩回页面顶部、还得重新滚一遍。
 * 元素不存在时不动作（由调用方决定兜底）。
 */
export function scrollToSectionInstant(target: string) {
  const el = document.querySelector(target)
  if (!el) return
  if (lenisInstance) {
    // Lenis 全局常驻、跨路由不卸载，从作品页返回时它仍缓存着作品页的（很矮的）
    // 滚动高度，scrollTo 会被截断到旧的最大值 → 落点偏前。先强制重算尺寸再跳。
    lenisInstance.resize()
    lenisInstance.scrollTo(el as HTMLElement, { immediate: true })
  } else {
    ;(el as HTMLElement).scrollIntoView()
  }
}
