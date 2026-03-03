import { useEffect, useRef } from 'react'

/**
 * Single-element custom cursor — a small ring that tracks the mouse
 * exactly (no lag). Scales up slightly on clickable elements.
 * The inner dot IS the hotspot so there's nothing competing for focus.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const el = cursorRef.current!
    let isPointer = false

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`

      const under = document.elementFromPoint(e.clientX, e.clientY)
      const nowPointer = !!(under && window.getComputedStyle(under).cursor === 'pointer')
      if (nowPointer !== isPointer) {
        isPointer = nowPointer
        el.style.width  = isPointer ? '40px' : '20px'
        el.style.height = isPointer ? '40px' : '20px'
        el.style.opacity = isPointer ? '0.7' : '1'
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        width:           20,
        height:          20,
        borderRadius:    '50%',
        border:          '2px solid var(--cursor-color, #4158f5)',
        background:      'var(--cursor-dot, rgba(65,88,245,0.15))',
        pointerEvents:   'none',
        zIndex:          99999,
        transform:       'translate(-50%, -50%)',
        transition:      'width 0.15s ease, height 0.15s ease, opacity 0.15s ease',
        willChange:      'transform',
      }}
    />
  )
}
