import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

// Extend window for pdfjs
declare global {
  interface Window { pdfjsLib: any }
}

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

interface Props {
  url: string
}

export default function PdfSlideViewer({ url }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const pdfRef     = useRef<any>(null)
  const rendering  = useRef(false)

  const [numPages, setNumPages]     = useState(0)
  const [current, setCurrent]       = useState(1)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [direction, setDirection]   = useState<1 | -1>(1)
  const [animating, setAnimating]   = useState(false)

  // Load PDF.js script once
  const loadScript = useCallback((): Promise<void> => {
    if (window.pdfjsLib) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = PDFJS_CDN
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load PDF.js'))
      document.head.appendChild(s)
    })
  }, [])

  // Render a specific page onto the canvas
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current || rendering.current) return
    rendering.current = true
    try {
      const page     = await pdfRef.current.getPage(pageNum)
      const wrap     = wrapRef.current!
      const maxW     = wrap.clientWidth
      const maxH     = Math.min(600, window.innerHeight * 0.55)
      const vp0      = page.getViewport({ scale: 1 })
      const scale    = Math.min(maxW / vp0.width, maxH / vp0.height)
      const viewport = page.getViewport({ scale })
      const canvas   = canvasRef.current
      canvas.width   = viewport.width
      canvas.height  = viewport.height
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
    } finally {
      rendering.current = false
    }
  }, [])

  // Initial load
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadScript()
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC
        const pdf = await window.pdfjsLib.getDocument(url).promise
        if (cancelled) return
        pdfRef.current = pdf
        setNumPages(pdf.numPages)
        await renderPage(1)
        setLoading(false)
      } catch (e: any) {
        if (!cancelled) { setError(e.message); setLoading(false) }
      }
    })()
    return () => { cancelled = true }
  }, [url, loadScript, renderPage])

  // Navigate to page with slide animation
  const goTo = useCallback(async (next: number, dir: 1 | -1) => {
    if (!pdfRef.current || animating || next < 1 || next > numPages || next === current) return
    setDirection(dir)
    setAnimating(true)
    await renderPage(next)
    setCurrent(next)
    setTimeout(() => setAnimating(false), 260)
  }, [animating, current, numPages, renderPage])

  const prev = () => goTo(current - 1, -1)
  const next = () => goTo(current + 1,  1)

  // Re-render on resize
  useEffect(() => {
    const handler = () => { if (pdfRef.current) renderPage(current) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [current, renderPage])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const pct = numPages > 1 ? ((current - 1) / (numPages - 1)) * 100 : 0

  return (
    <div ref={wrapRef} className="select-none">
      {/* Canvas area */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-900 shadow-xl dark:shadow-black/30">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-28 text-slate-400 dark:text-slate-500 text-sm">
            <div className="w-9 h-9 border-2 border-slate-300 dark:border-slate-600 border-t-brand-500 rounded-full animate-spin" />
            <span>Loading presentation…</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-red-400 text-sm text-center px-8">
            <span className="text-3xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Canvas */}
        {!error && (
          <div
            className="transition-transform duration-[240ms] ease-out"
            style={{ transform: animating ? `translateX(${direction * -30}px)` : 'translateX(0)', opacity: animating ? 0.5 : 1 }}
          >
            <canvas
              ref={canvasRef}
              className="block mx-auto"
              style={{ display: loading ? 'none' : 'block', maxWidth: '100%' }}
            />
          </div>
        )}

        {/* Side arrows — only when loaded */}
        {!loading && !error && (
          <>
            <button
              onClick={prev}
              disabled={current === 1}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-md hover:bg-brand-600 hover:text-white hover:border-brand-600 disabled:opacity-0 transition-all duration-150"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={current === numPages}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-md hover:bg-brand-600 hover:text-white hover:border-brand-600 disabled:opacity-0 transition-all duration-150"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Controls bar */}
      {!loading && !error && (
        <div className="mt-3 flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Page counter */}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
            {current} / {numPages}
          </span>

          {/* Fullscreen */}
          <a
            href={`/pdf-viewer.html?file=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Open fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  )
}
