import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import ArchivePage from './pages/ArchivePage'
import CursorTrail from './components/CursorTrail/CursorTrail'
import SmoothScroll from './components/SmoothScroll/SmoothScroll'
import ScrollManager from './components/ScrollManager/ScrollManager'
import Loader from './components/Loader/Loader'

/**
 * 路由分发。
 * 全局常驻（跨路由不卸载）：SmoothScroll(Lenis 惯性滚动) / CursorTrail(光标拖尾) /
 * ScrollManager(路由切换时复位滚动并刷新 ScrollTrigger)。
 *   /            首页（沉浸式单页滚动）
 *   /work/:slug  作品详情页（每个作品风格可不同）
 */
function App() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <CursorTrail />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </>
  )
}

export default App
