/**
 * Hook pour traduire automatiquement du contenu dynamique (projets, parcours)
 * via l'API MyMemory (gratuite, sans clé API).
 * Les traductions sont mises en cache dans localStorage.
 */

const CACHE_KEY = 'portfolio_translations_cache'

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

function setCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

/**
 * Traduit un texte via l'API MyMemory (FR → EN ou EN → FR)
 * @param {string} text - Le texte à traduire
 * @param {string} targetLang - 'en' ou 'fr'
 * @returns {Promise<string>} - Le texte traduit
 */
export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || text.trim() === '') return text

  // Si la langue cible est le français, pas besoin de traduire (données en FR)
  if (targetLang === 'fr') return text

  // Vérifier le cache
  const cache = getCache()
  const cacheKey = `${targetLang}:${text.substring(0, 50)}`
  if (cache[cacheKey]) return cache[cacheKey]

  try {
    const langPair = `fr|${targetLang}`
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      // Mettre en cache
      const newCache = getCache()
      newCache[cacheKey] = translated
      setCache(newCache)
      return translated
    }
    return text // fallback au texte original
  } catch {
    return text // en cas d'erreur, retourner le texte original
  }
}

/**
 * Traduit un objet entier (ex: un projet ou un élément de parcours)
 * @param {object} obj - L'objet à traduire
 * @param {string[]} fields - Les champs à traduire
 * @param {string} targetLang - 'en' ou 'fr'
 * @returns {Promise<object>} - L'objet avec les champs traduits
 */
export async function translateObject(obj, fields, targetLang) {
  if (targetLang === 'fr') return obj

  const translated = { ...obj }
  await Promise.all(
    fields.map(async (field) => {
      if (obj[field]) {
        translated[field] = await translateText(obj[field], targetLang)
      }
    })
  )
  return translated
}

/**
 * Traduit un tableau d'objets
 * @param {object[]} arr - Le tableau d'objets
 * @param {string[]} fields - Les champs à traduire dans chaque objet
 * @param {string} targetLang - 'en' ou 'fr'
 * @returns {Promise<object[]>}
 */
export async function translateArray(arr, fields, targetLang) {
  if (targetLang === 'fr') return arr
  return Promise.all(arr.map(item => translateObject(item, fields, targetLang)))
}
