import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Monitor, Smartphone, LayoutDashboard, Globe, ArrowRight } from 'lucide-react'
import { projets as staticProjets } from '../data/projets'
import { useTranslation } from 'react-i18next'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './Realisations.css'

const categoryIcon = {
  web:       <Globe size={14} />,
  mobile:    <Smartphone size={14} />,
  dashboard: <LayoutDashboard size={14} />,
}

export default function Realisations() {
  const [filtre, setFiltre] = useState('all')
  const [projets, setProjets] = useState([])
  const [translatedProjets, setTranslatedProjets] = useState([])
  const { t, i18n } = useTranslation()

  const categories = [
    { id: 'all',       label: t('realisations.filterAll') },
    { id: 'web',       label: t('realisations.filterWeb') },
    { id: 'mobile',    label: t('realisations.filterMobile') },
    { id: 'dashboard', label: t('realisations.filterDashboard') },
  ]

  useEffect(() => {
    fetch(`${API_URL}/api/projets`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjets(data)
        } else {
          setProjets(staticProjets)
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des projets:', err)
        setProjets(staticProjets)
      })
  }, [])

  // Auto-traduire quand la langue ou les projets changent
  useEffect(() => {
    if (projets.length === 0) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateArray(projets, ['description', 'type'], lang)
      .then(setTranslatedProjets)
  }, [projets, i18n.language])

  const displayedProjets = translatedProjets.length > 0 ? translatedProjets : projets
  const projetsFiltrés = filtre === 'all'
    ? displayedProjets
    : displayedProjets.filter(p => p.categorie === filtre)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.08 }
    )
    
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [filtre, displayedProjets])

  return (
    <div className="page-realisations">
      {/* Editorial Header */}
      <div className="page-header-editorial">
        <span className="section-label">{t('realisations.label')}</span>
        <h1 className="page-header-editorial__title">{t('realisations.title')}</h1>
        <div className="page-header-editorial__line" aria-hidden="true" />
        <p className="page-header-editorial__subtitle">
          {projets.length} PROJETS — WEB, MOBILE & DASHBOARD — DU SÉNÉGAL AU MONDE ENTIER.
        </p>
      </div>

      {/* Filtres */}
      <div className="realisations__filters-bar">
        <div className="container">
          <div className="realisations__filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`realisations__filter-btn ${filtre === cat.id ? 'realisations__filter-btn--active' : ''}`}
                onClick={() => setFiltre(cat.id)}
                aria-pressed={filtre === cat.id}
              >
                {cat.id !== 'all' && categoryIcon[cat.id]}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille */}
      <section className="section section--portfolio-grid">
        <div className="container">
          <div className="realisations__grid">
            {projetsFiltrés.map((projet, i) => (
              <Link
                to={`/projet/${projet.id}`}
                key={projet.id}
                className="projet-card reveal"
                style={{ transitionDelay: `${(i % 4) * 0.08}s`, display: 'block', textDecoration: 'none' }}
              >
                {/* Header carte */}
                <div className="projet-card__header">
                  <div className="projet-card__icon" aria-hidden="true">
                    {categoryIcon[projet.categorie] || <Monitor size={20} />}
                  </div>
                  <span className="projet-card__pays">{projet.pays}</span>
                </div>

                {/* Content */}
                <div className="projet-card__body">
                  <h2 className="projet-card__nom">{projet.nom}</h2>
                  <p className="projet-card__type">{projet.type}</p>
                  <p className="projet-card__desc">{projet.description}</p>

                  {/* Technos */}
                  <div className="projet-card__techno">
                    {projet.techno.map(t => (
                      <span key={t} className="tag tag-dark">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="projet-card__footer">
                  <span className="projet-card__ecrans">{projet.ecrans} {t('realisations.ecrans')}</span>
                  <div className="projet-card__action">
                    <span>{t('realisations.voirProjet')}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
