import { useEffect, useRef } from 'react'

/**
 * Custom dual-ring cursor: an inner dot + outer ring that trails with
 * a spring-like delay. Hidden on touch screens.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current!
    const ring = ringRef.current!

    // Ring trails behind with lerp
    let rx = window.innerWidth  / 2
    let ry = window.innerHeight / 2
    let mx = rx, my = ry
    let raf = 0
    let isPointer = false

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`

      const el = document.elementFromPoint(mx, my)
      isPointer = !!(el && window.getComputedStyle(el).cursor === 'pointer')
    }

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`
      raf = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: 'var(--cursor-color, #4158f5)',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          transition: 'background 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 32, height: 32,
          borderRadius: '50%',
          border: '2px solid var(--cursor-color, #4158f5)',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s ease, border-color 0.2s, opacity 0.2s, width 0.18s, height 0.18s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
