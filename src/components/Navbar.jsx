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
    { to: '/realisations', label: t('nav.realisations', 'Projets') },
    { to: '/parcours',     label: t('nav.parcours', 'Parcours') },
    { to: '/a-propos',     label: t('nav.about', 'À propos') },
    { to: '/contact',      label: t('nav.contact', 'Contact') },
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
            <span className="navbar__logo-name">Seydou Diallo</span>
          </NavLink>
        </div>

        {/* Navigation desktop */}
        <div className="navbar__center">
          <nav className="navbar__links" aria-label="Navigation principale">
            {links.map(link => {
              const isHash = link.to.includes('#');
              if (isHash) {
                return (
                  <a
                    key={link.to}
                    href={link.to}
                    className="navbar__link"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
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
              );
            })}
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
            href="/cv-seydou-diallo.pdf"
            download="CV_Seydou_DIALLO_FR.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary navbar__cta"
            aria-label="Télécharger mon CV"
          >
            Télécharger mon CV
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
          {links.map(link => {
            const isHash = link.to.includes('#');
            if (isHash) {
              return (
                <a
                  key={link.to}
                  href={link.to}
                  className="navbar__mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            }
            return (
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
            );
          })}
          <a
            href="/cv-seydou-diallo.pdf"
            download="CV_Seydou_DIALLO_FR.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary navbar__mobile-cta"
            style={{ margin: '1rem', display: 'block', textAlign: 'center' }}
          >
            Télécharger mon CV
          </a>
        </nav>
      )}
    </header>
  )
}
