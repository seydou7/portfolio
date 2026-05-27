import { NavLink } from 'react-router-dom'
import { Mail, Phone, Link2, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <span className="footer__logo">
              SD<span className="footer__logo-dot">.</span>
            </span>
            <p className="footer__tagline">
              {t('footer.tagline1')}<br />
              {t('footer.tagline2')}
            </p>
          </div>

          {/* Links */}
          <nav className="footer__nav" aria-label="Navigation pied de page">
            {[
              { to: '/',              label: t('nav.accueil') },
              { to: '/parcours',      label: t('nav.parcours') },
              { to: '/realisations',  label: t('nav.realisations') },
              { to: '/contact',       label: t('nav.contact') },
            ].map(link => (
              <NavLink key={link.to} to={link.to} className="footer__link">
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Contact */}
          <div className="footer__contact">
            <a href="mailto:seydoukellel@gmail.com" className="footer__contact-item">
              <Mail size={16} />
              seydoukellel@gmail.com
            </a>
            <a href="tel:+221774931084" className="footer__contact-item">
              <Phone size={16} />
              +221 77 493 10 84
            </a>
            <a
              href="https://www.linkedin.com/in/seydou-diallo-front-end-developpeur-designer-ux-ui/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-item"
            >
              <Link2 size={16} />
              LinkedIn
            </a>
            <span className="footer__contact-item footer__contact-item--location">
              <MapPin size={16} />
              Dakar, Sénégal
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Seydou Diallo. {t('footer.rights')}</span>
          <span className="footer__made">
            {t('footer.made')}
          </span>
        </div>
      </div>
    </footer>
  )
}
