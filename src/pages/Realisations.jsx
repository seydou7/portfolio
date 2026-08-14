import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Globe, Smartphone, Code, Layers, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { projets as staticProjets } from '../data/projets'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import ProjectCard from '../components/ProjectCard'
import './Realisations.css'

export default function Realisations() {
  const [filtre, setFiltre] = useState('all')
  const [projets, setProjets] = useState([])
  const [translatedProjets, setTranslatedProjets] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()

  // SEO & Document Title
  useEffect(() => {
    document.title = t('realisations.seoTitle', 'Projets UX/UI — Seydou Diallo | Portfolio')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        t('realisations.seoDesc', 'Découvrez les projets UX/UI de Seydou Diallo : plateformes métier, tableaux de bord, produits éducatifs, design systems et interfaces web responsives.')
      )
    }
  }, [t, i18n.language])

  // Chargement 100% dynamique depuis l'API avec fallback transparent
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetch(`${API_URL}/api/projets`)
      .then(res => {
        if (!res.ok) throw new Error('API non disponible')
        return res.json()
      })
      .then(data => {
        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          setProjets(data)
        } else {
          setProjets(staticProjets)
        }
        setLoading(false)
      })
      .catch(err => {
        if (!isMounted) return
        console.warn('Fallback sur les données locales :', err.message)
        setProjets(staticProjets)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-traduction dynamique i18n
  useEffect(() => {
    if (projets.length === 0) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateArray(projets, ['description', 'type'], lang)
      .then(setTranslatedProjets)
      .catch(() => setTranslatedProjets([]))
  }, [projets, i18n.language])

  const displayedProjets = translatedProjets.length > 0 ? translatedProjets : projets

  // Calcul dynamique des catégories présentes dans les données (max 5 filtres, jamais de catégorie vide)
  const categories = useMemo(() => {
    if (displayedProjets.length === 0) return []

    const presentCategories = new Set(displayedProjets.map(p => p.categorie).filter(Boolean))

    const allDefinitions = [
      { 
        id: 'all', 
        label: t('realisations.filterAll', 'Tous'), 
        icon: <Layers size={14} />,
        count: displayedProjets.length 
      },
      { 
        id: 'dashboard', 
        label: t('realisations.filterDashboard', 'Plateformes & Dashboards'), 
        icon: <LayoutDashboard size={14} />,
        count: displayedProjets.filter(p => p.categorie === 'dashboard').length 
      },
      { 
        id: 'web', 
        label: t('realisations.filterWeb', 'Produits & Sites Web'), 
        icon: <Globe size={14} />,
        count: displayedProjets.filter(p => p.categorie === 'web').length 
      },
      { 
        id: 'mobile', 
        label: t('realisations.filterMobile', 'Applications Mobiles'), 
        icon: <Smartphone size={14} />,
        count: displayedProjets.filter(p => p.categorie === 'mobile').length 
      },
      { 
        id: 'dev', 
        label: t('realisations.filterDev', 'Collaboration Front-end'), 
        icon: <Code size={14} />,
        count: displayedProjets.filter(p => p.categorie === 'dev').length 
      }
    ]

    // Ne conserver que 'Tous' et les catégories qui contiennent au moins un projet
    return allDefinitions.filter(cat => cat.id === 'all' || (presentCategories.has(cat.id) && cat.count > 0))
  }, [displayedProjets, t])

  // Filtrage des projets
  const projetsFiltrés = filtre === 'all'
    ? displayedProjets
    : displayedProjets.filter(p => p.categorie === filtre)

  return (
    <div className="page-projets">
      
      {/* ===== 1. HERO COMPACT & ÉDITORIAL ===== */}
      <section className="projets-hero" aria-labelledby="projets-heading">
        <div className="container">
          <div className="projets-hero__inner">
            <span className="section-label">{t('realisations.label', 'PROJETS')}</span>
            <h1 id="projets-heading" className="projets-hero__title">
              {t('realisations.title', 'Des expériences conçues pour des produits web complexes')}
            </h1>
            <p className="projets-hero__intro">
              {t('realisations.intro', 'Découvrez une sélection de plateformes métier, tableaux de bord, produits éducatifs et expériences web sur lesquels je suis intervenu en UX Design, UI Design, prototypage et collaboration front-end.')}
            </p>
            <p className="projets-hero__subintro">
              {t('realisations.subIntro', 'Chaque projet présente un contexte, une problématique et les choix de conception réalisés pour y répondre.')}
            </p>
          </div>
        </div>
      </section>

      {/* ===== 2. BARRE DE FILTRES DYNAMIQUE ===== */}
      {categories.length > 1 && (
        <section className="projets-filters-bar" aria-label="Filtrer les projets par catégorie">
          <div className="container">
            <div className="projets-filters">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`projets-filter-btn ${filtre === cat.id ? 'projets-filter-btn--active' : ''}`}
                  onClick={() => setFiltre(cat.id)}
                  aria-pressed={filtre === cat.id}
                  type="button"
                >
                  <span className="projets-filter-btn__icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className="projets-filter-btn__label">{cat.label}</span>
                  <span className="projets-filter-btn__count" aria-label={`${cat.count} projets`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 3. GRILLE DYNAMIQUE DES PROJETS ===== */}
      <section className="section projets-grid-section" aria-label="Galerie des projets">
        <div className="container">
          
          {loading ? (
            /* Skeletons de chargement */
            <div className="projets-grid" aria-busy="true" aria-label="Chargement des projets...">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="project-card-skeleton" aria-hidden="true">
                  <div className="project-card-skeleton__media" />
                  <div className="project-card-skeleton__body">
                    <div className="project-card-skeleton__line project-card-skeleton__line--short" />
                    <div className="project-card-skeleton__line project-card-skeleton__line--title" />
                    <div className="project-card-skeleton__line" />
                    <div className="project-card-skeleton__line" />
                    <div className="project-card-skeleton__tags">
                      <span className="project-card-skeleton__tag" />
                      <span className="project-card-skeleton__tag" />
                      <span className="project-card-skeleton__tag" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projetsFiltrés.length > 0 ? (
            /* Grille dynamique des projets */
            <div className="projets-grid">
              {projetsFiltrés.map((projet, index) => (
                <ProjectCard key={projet.id} project={projet} index={index} />
              ))}
            </div>
          ) : (
            /* État vide */
            <div className="projets-empty">
              <p className="projets-empty__title">
                {t('realisations.emptyTitle', 'Aucun projet disponible pour le moment.')}
              </p>
              <p className="projets-empty__desc">
                {t('realisations.emptyDesc', 'Essayez de sélectionner une autre catégorie pour explorer les réalisations.')}
              </p>
              <button 
                onClick={() => setFiltre('all')} 
                className="btn btn-secondary projets-empty__btn"
                type="button"
              >
                <RotateCcw size={15} />
                {t('realisations.emptyReset', 'Afficher tous les projets')}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ===== 4. CTA FINAL COMPACT ===== */}
      <section className="section projets-cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="projets-cta-card">
            <h2 id="cta-heading" className="projets-cta-card__title">
              {t('realisations.ctaTitle', 'Un projet ou une opportunité à me proposer ?')}
            </h2>
            <p className="projets-cta-card__desc">
              {t('realisations.ctaDesc', 'Je suis disponible pour échanger autour d’une mission UX/UI, d’une collaboration ou d’un poste en remote.')}
            </p>
            <div className="projets-cta-card__actions">
              <Link to="/contact" className="btn btn-primary">
                {t('realisations.ctaPrimary', 'Me contacter')}
              </Link>
              <a 
                href="/cv-seydou-diallo.pdf" 
                download="CV_Seydou_DIALLO_FR.pdf"
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                {t('realisations.ctaSecondary', 'Télécharger mon CV')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
