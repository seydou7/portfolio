import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          
          {/* Zone gauche */}
          <div className="footer__brand">
            <span className="footer__logo">Seydou Diallo</span>
            <p className="footer__tagline">
              UX/UI Designer · Dakar · Remote & présentiel
            </p>
          </div>

          {/* Zone centrale */}
          <nav className="footer__nav" aria-label="Navigation pied de page">
            <NavLink to="/realisations" className="footer__link">{t('nav.realisations', 'Projets')}</NavLink>
            <NavLink to="/parcours" className="footer__link">{t('nav.parcours', 'Parcours')}</NavLink>
            <NavLink to="/a-propos" className="footer__link">{t('nav.about', 'À propos')}</NavLink>
            <NavLink to="/contact" className="footer__link">{t('nav.contact', 'Contact')}</NavLink>
          </nav>

          {/* Zone droite */}
          <div className="footer__contact">

            <a href="mailto:seydoukellel@gmail.com" className="footer__contact-item">
              E-mail
            </a>
            <a 
              href="/cv-seydou-diallo.pdf" 
              download="CV_Seydou_DIALLO_FR.pdf"
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer__contact-item"
            >
              Télécharger mon CV
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Seydou Diallo. Tous droits réservés.</span>
          <span className="footer__made">Conçu et intégré avec attention aux détails.</span>
        </div>
      </div>
    </footer>
  )
}
