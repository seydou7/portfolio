import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop Component
 * Garantit que chaque changement de route ou clic de navigation
 * ramène immédiatement le scroll en haut de la page.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Si une ancre est présente (ex: #expertise), scroller vers l'ancre
      const timer = setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
      return () => clearTimeout(timer)
    }

    // Sinon, retour instantané tout en haut de la page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [pathname, hash])

  return null
}
