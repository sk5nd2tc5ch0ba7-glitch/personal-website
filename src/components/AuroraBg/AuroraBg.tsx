import { useEffect, useRef, useCallback } from 'react'
import styles from './AuroraBg.module.css'

function AuroraBg({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    container.style.setProperty('--mouse-x', x.toFixed(3))
    container.style.setProperty('--mouse-y', y.toFixed(3))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div ref={containerRef} className={`${styles.aurora} ${className || ''}`}>
      <div className={styles.aurora__blob1} />
      <div className={styles.aurora__blob2} />
      <div className={styles.aurora__blob3} />
      <div className={styles.aurora__noise} />
    </div>
  )
}

export default AuroraBg
