import Hero from './components/Hero/Hero'
import RoseGarden from './components/RoseGarden/RoseGarden'
import SelectedWorks from './components/SelectedWorks/SelectedWorks'
import Journey from './components/Journey/Journey'
import CursorTrail from './components/CursorTrail/CursorTrail'
import SmoothScroll from './components/SmoothScroll/SmoothScroll'

function App() {
  return (
    <main>
      <SmoothScroll />
      <CursorTrail />
      <Hero />
      <RoseGarden />
      <SelectedWorks />
      <Journey />
    </main>
  )
}

export default App
