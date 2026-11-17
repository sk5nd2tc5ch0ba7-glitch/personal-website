import Hero from '../components/Hero/Hero'
import RoseGarden from '../components/RoseGarden/RoseGarden'
import Journey from '../components/Journey/Journey'
import SelectedWorks from '../components/SelectedWorks/SelectedWorks'
import SiteNav from '../components/SiteNav/SiteNav'

/**
 * 首页：沉浸式单页滚动。
 * 顺序：Hero → RoseGarden(花园+白屏 outro) → Journey(about) → SelectedWorks(works 入口)。
 * SiteNav 常驻右侧，只在首页出现（作品页有自己的返回入口）。
 */
function HomePage() {
  return (
    <>
      <SiteNav />
      <Hero />
      <RoseGarden />
      <Journey />
      <SelectedWorks />
    </>
  )
}

export default HomePage
