/**
 * useTranslate.ts
 * React hook that auto-translates an array of strings whenever `lang` changes.
 *
 * Usage:
 *   const { translated, loading } = useTranslate(originalTexts, lang)
 *   // translated[i] is the translation of originalTexts[i], or the original while loading
 */

import { useState, useEffect, useRef } from 'react'
import { translateTexts } from '../services/translationApi'

export function useTranslate(texts: string[], lang: string) {
  const [translated, setTranslated] = useState<string[]>(texts)
  const [loading, setLoading] = useState(false)
  const lastLang = useRef(lang)
  const lastKey  = useRef('')

  useEffect(() => {
    const key = lang + '|' + texts.join('|')
    if (key === lastKey.current) return
    lastKey.current = key

    if (lang === 'en') {
      setTranslated(texts)
      setLoading(false)
      return
    }

    setLoading(true)
    // Show originals immediately while we fetch
    setTranslated(texts)

    let cancelled = false
    translateTexts(texts, lang).then(result => {
      if (!cancelled) {
        setTranslated(result)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, texts.join('|||')])

  // If lang didn't change but texts did, reset
  useEffect(() => {
    if (lastLang.current !== lang) {
      lastLang.current = lang
    }
  }, [lang])

  return { translated, loading }
}
