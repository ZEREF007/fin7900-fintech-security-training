/**
 * translationApi.ts
 * Calls server /api/translate which proxies MyMemory (free, no key needed).
 * Results are cached server-side in SQLite AND client-side in localStorage.
 */

const LS_PREFIX = 'fin7900_tx_'

function lsKey(lang: string, text: string) {
  // Short hash to keep localStorage keys compact
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  return `${LS_PREFIX}${lang}_${Math.abs(hash)}`
}

function getCached(lang: string, text: string): string | null {
  try { return localStorage.getItem(lsKey(lang, text)) } catch { return null }
}

function setCached(lang: string, text: string, result: string) {
  try { localStorage.setItem(lsKey(lang, text), result) } catch { /* quota */ }
}

/**
 * Translate an array of strings to the given language.
 * - Skips English (returns originals immediately)
 * - Uses localStorage cache first; only uncached texts go to the server
 * - Falls back to original text on any error
 */
export async function translateTexts(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  if (!targetLang || targetLang === 'en') return texts

  // Separate cached vs uncached
  const results: string[] = new Array(texts.length)
  const uncachedIndices: number[] = []
  const uncachedTexts: string[] = []

  for (let i = 0; i < texts.length; i++) {
    const cached = getCached(targetLang, texts[i])
    if (cached !== null) {
      results[i] = cached
    } else {
      uncachedIndices.push(i)
      uncachedTexts.push(texts[i])
    }
  }

  if (uncachedTexts.length === 0) return results

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncachedTexts, targetLang }),
    })
    if (!res.ok) throw new Error('translate failed')
    const data: { results: string[] } = await res.json()

    for (let j = 0; j < uncachedIndices.length; j++) {
      const idx = uncachedIndices[j]
      const translated = data.results[j] ?? texts[idx]
      results[idx] = translated
      setCached(targetLang, texts[idx], translated)
    }
  } catch {
    // Network error: fill with originals
    for (let j = 0; j < uncachedIndices.length; j++) {
      results[uncachedIndices[j]] = texts[uncachedIndices[j]]
    }
  }

  return results
}
