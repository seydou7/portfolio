import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Navbar.css'

export default function Navbar({ onOpenLangModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const links = [
    { to: '/',             label: t('nav.accueil') },
    { to: '/parcours',     label: t('nav.parcours') },
    { to: '/realisations', label: t('nav.realisations') },
    { to: '/contact',      label: t('nav.contact') },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'FR'

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo / Nom */}
        <div className="navbar__left">
          <NavLink to="/" className="navbar__logo">
            SD<span className="navbar__logo-dot">.</span>
          </NavLink>
        </div>

        {/* Navigation desktop */}
        <div className="navbar__center">
          <nav className="navbar__links" aria-label="Navigation principale">
            {links.filter(l => l.to !== '/contact').map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Actions desktop */}
        <div className="navbar__right desktop-only">
          {/* Sélecteur de langue discret */}
          <div className="navbar__lang-toggle">
            <button 
              className={`lang-toggle-btn ${currentLang === 'FR' ? 'active' : ''}`}
              onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('portfolio_lang', 'fr'); }}
            >
              FR
            </button>
            <span className="lang-toggle-sep">/</span>
            <button 
              className={`lang-toggle-btn ${currentLang === 'EN' ? 'active' : ''}`}
              onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('portfolio_lang', 'en'); }}
            >
              EN
            </button>
          </div>

          <a
            href="/contact"
            className="btn btn-primary navbar__cta"
            aria-label={t('nav.meContacter')}
          >
            {t('nav.meContacter')}
          </a>
        </div>

        {/* Burger mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="navbar__lang-toggle navbar__lang-toggle--mobile">
            <button 
              className={`lang-toggle-btn ${currentLang === 'FR' ? 'active' : ''}`}
              onClick={() => { i18n.changeLanguage('fr'); localStorage.setItem('portfolio_lang', 'fr'); }}
            >
              FR
            </button>
            <span className="lang-toggle-sep">/</span>
            <button 
              className={`lang-toggle-btn ${currentLang === 'EN' ? 'active' : ''}`}
              onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('portfolio_lang', 'en'); }}
            >
              EN
            </button>
          </div>
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="navbar__mobile" aria-label="Navigation mobile">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
